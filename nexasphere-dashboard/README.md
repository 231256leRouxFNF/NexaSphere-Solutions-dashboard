# NexaSphere Solutions Dashboard

NexaSphere Solutions is a fictional SaaS company that has requested a web-based dashboard to give clients a
customisable, user-friendly, and secure control center. This repository implements that vision as a multi-purpose React
application where guests can explore core productivity widgets and registered users unlock the complete suite with
persistent layouts, advanced data feeds, and rich theming controls.

## Core features

- Landing experience that introduces NexaSphere, highlights value propositions, and funnels users into sign-up, login,
  or guest exploration flows.
- Lightweight authentication layer powered by localStorage with dedicated guest mode, account creation, and session
  persistence.
- Modular dashboard built on `react-grid-layout` with drag, resize, add, and remove capabilities for each widget.
- Widget gallery with freemium gating to surface which tools require an account before activation.
- Theme system (light, dark, custom palette) driven by CSS variables and persisted per user.

## Widget catalogue

| Access level | Widgets |
| --- | --- |
| Core (guest) | Clock and date, Motivation quotes via Quotable API, To-do manager with completion tracking, Notes pad with autosave |
| Advanced (registered) | Weather insights powered by Open-Meteo, Habit tracker with weekly grid, Calendar and events planner |

Each widget persists user-specific data in localStorage and respects the current account scope.

## Tech stack

- React 19 + TypeScript + Vite
- Tailwind CSS utility styling
- Framer Motion for micro-interactions
- React Grid Layout for the drag-and-drop canvas
- date-fns for calendar calculations
- Open-Meteo and Quotable public APIs for live data

## Getting started

Prerequisites

- Node.js 18+
- npm

Install dependencies

```powershell
Set-Location 'c:\Users\flr21\Desktop\OWI\2025\DV200\S2\idk\NexaSphere-Solutions-dashboard\nexasphere-dashboard'
npm install
```

Run the development server

```powershell
npm run dev
# open http://localhost:5173
```

Build for production

```powershell
npm run build
npm run preview
```

## Project notes

- Authentication and data persistence currently use localStorage for simplicity; swap to Firebase Auth and Firestore to
  align with the roadmap.
- Weather data relies on Open-Meteo public endpoints and does not require an API key.
- The project keeps the `rolldown-vite` package alias shipped with the starter. Replace it with standard `vite` if you
  prefer the default distribution.
