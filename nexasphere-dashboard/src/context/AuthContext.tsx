import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

export type AuthPlan = 'guest' | 'registered'

type StoredUser = {
  id: string
  name: string
  email: string
  password: string
}

export type User = {
  id: string
  name: string
  email: string
  plan: AuthPlan
}

type AuthContextValue = {
  user: User | null
  isGuest: boolean
  authenticated: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<void>
  continueAsGuest: (name?: string) => void
  logout: () => void
}

const USERS_KEY = 'nexasphere-auth-users'
const SESSION_KEY = 'nexasphere-auth-session'

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

function parseUsers(value: string | null): StoredUser[] {
  if (!value) return []
  try {
    const parsed = JSON.parse(value)
    if (Array.isArray(parsed)) {
      return parsed.filter(
        (item): item is StoredUser =>
          typeof item?.id === 'string' &&
          typeof item?.name === 'string' &&
          typeof item?.email === 'string' &&
          typeof item?.password === 'string',
      )
    }
    return []
  } catch (error) {
    console.warn('Failed to parse stored users', error)
    return []
  }
}

function mapStoredToUser(stored: StoredUser | undefined): User | null {
  if (!stored) return null
  return {
    id: stored.id,
    name: stored.name,
    email: stored.email,
    plan: 'registered',
  }
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [users, setUsers] = useState<StoredUser[]>(() => parseUsers(localStorage.getItem(USERS_KEY)))
  const [user, setUser] = useState<User | null>(() => {
    const currentId = localStorage.getItem(SESSION_KEY)
    if (currentId === 'guest') {
      return {
        id: 'guest',
        name: 'Guest User',
        email: 'guest@nexasphere.app',
        plan: 'guest',
      }
    }
    if (currentId) {
      const storedUsers = parseUsers(localStorage.getItem(USERS_KEY))
      return mapStoredToUser(storedUsers.find((item) => item.id === currentId))
    }
    return null
  })

  useEffect(() => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users))
  }, [users])

  useEffect(() => {
    if (!user) {
      localStorage.removeItem(SESSION_KEY)
      return
    }
    localStorage.setItem(SESSION_KEY, user.id)
  }, [user])

  const actions = useMemo<AuthContextValue>(() => {
    const login = async (email: string, password: string) => {
      const match = users.find((candidate) => candidate.email.toLowerCase() === email.toLowerCase())
      if (!match || match.password !== password) {
        throw new Error('Invalid email or password')
      }
      setUser(mapStoredToUser(match))
    }

    const signup = async (name: string, email: string, password: string) => {
      const trimmedEmail = email.trim().toLowerCase()
      if (users.some((candidate) => candidate.email.toLowerCase() === trimmedEmail)) {
        throw new Error('Looks like you already have an account')
      }
      const newUser: StoredUser = {
        id: crypto.randomUUID(),
        name: name.trim() || 'New Member',
        email: trimmedEmail,
        password,
      }
      setUsers((current) => [...current, newUser])
      setUser(mapStoredToUser(newUser))
    }

    const continueAsGuest = (name?: string) => {
      setUser({
        id: 'guest',
        name: name?.trim() || 'Guest User',
        email: 'guest@nexasphere.app',
        plan: 'guest',
      })
    }

    const logout = () => {
      setUser(null)
    }

    return {
      user,
      isGuest: user?.plan === 'guest',
      authenticated: Boolean(user),
      login,
      signup,
      continueAsGuest,
      logout,
    }
  }, [user, users])

  return <AuthContext.Provider value={actions}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used inside an AuthProvider')
  }
  return context
}
