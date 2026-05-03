# St Mary's Urban Mobility Hub

A small React + Vite app for exploring and comparing travel options around St Mary's.

## Run

Install dependencies and start the dev server:

```bash
npm install
npm run dev
```

Build for production and preview:

```bash
npm run build
npm run preview
```

Open the local URL shown by Vite.

## Technologies

- React + Vite
- React Router
- Bootstrap (minimal) + Bootstrap Icons
- Recharts
- TfL Unified API
- localStorage

## Features

- Home and route discovery
- Travel-mode comparison and cost estimator
- Journey planner with live TfL data (line/status/journeys)
- Saved journeys and simple dashboard
- Sustainability comparison and basic charts

## TfL API (optional)

Copy `.env.example` to `.env` and set your key:

```bash
VITE_TFL_APP_KEY=your_key_here
```

The app works for local development without a key for many endpoints, but a key improves reliability.

## Notes

Do not commit `node_modules`.
