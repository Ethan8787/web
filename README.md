# Ethan Personal Website

A lightweight React + Vite personal site for Ethan, built as a modern landing page with social links, a curated profile links page, and a small random wheel utility.

## Overview

This project is a single-page portfolio site designed for a personal brand presence. It includes:

- A clean home page with avatar and social links
- A community/contact links page for major platforms
- A random wheel selector for quick decisions
- Animated background effects and a floating navigation layout
- Responsive styling for desktop and mobile screens

## Tech Stack

- React 19
- Vite
- React Router
- HTML2Canvas
- Lucide icons
- CSS / custom styling

## Project Structure

```text
web/
├── public/
├── src/
│   ├── components/
│   │   ├── Background/
│   │   ├── Footer/
│   │   └── Navbar/
│   ├── pages/
│   │   ├── Home/
│   │   ├── Link/
│   │   ├── NotFound/
│   │   └── RandomWheel/
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── vite.config.js
├── eslint.config.js
└── README.md
```

## Routes

- `/` — Home landing page
- `/link` — Social and profile links hub
- `/wheel` — Random selection wheel
- `/background` — Animated background view
- `*` — Not found fallback page

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Open the local Vite URL shown in the terminal.

## Available Scripts

```bash
npm run dev      # start the local development server
npm run build    # build the production bundle
npm run preview  # preview the production build locally
npm run lint     # run ESLint
```

## Deployment

The app is configured with a homepage value for the personal site and can be deployed to any static hosting provider that supports Vite builds, such as Vercel, Netlify, GitHub Pages, or a custom web server.

## Notes

This repository is tailored to Ethan's personal brand and currently contains social links, profile references, and a decision wheel utility for personal use.
