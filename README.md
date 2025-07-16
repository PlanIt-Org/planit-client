# PlanIt 2025 – All-in-One Event & Trip Planner (Frontend)

## Overview

PlanIt is a modern, user-friendly web application that streamlines the process of planning hangouts, trips, and events. Instead of juggling multiple apps for navigation, transport, weather, and group coordination, PlanIt brings all these tools together in a single platform. Users can select locations, filter preferences (like dietary restrictions or mood), and invite friends or colleagues—all with just a few clicks.

> **Note:** This repository contains only the frontend (React) code for PlanIt. Backend services (Node.js/Express/PostgreSQL) are not included here.

---

## Features

- **Trip & Event Planning:** Organize locations and activities for your next outing.
- **Interactive Map:** Visualize and manage trip stops using Google Maps integration.
- **Smart Search:** Find and add places with autocomplete search.
- **Personalized Filtering:** Tailor plans based on group preferences and constraints.
- **User Accounts:** Register, log in, and manage your profile.
- **Trip Summaries:** Review and share a summary of your planned trip.
- **Modern UI:** Built with Mantine UI for a clean, responsive experience.

> **Note:** PlanIt is in ACTIVE DEVELOPMENT.

---

## Tech Stack

- **Frontend:** React, Vite, Mantine UI, React Router
- **Maps & Places:** @vis.gl/react-google-maps, react-google-autocomplete
- **Styling:** CSS Modules, Mantine

---

## Getting Started

1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd planit-client
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Start the development server:**
   ```bash
   npm run dev
   ```
4. **Open your browser:**
   Visit [http://localhost:5173](http://localhost:5173) (or the port shown in your terminal).

> **Note:** You may need to set up a Google Maps API key in a `.env` file for full map functionality.

---

## Project Structure

```
planit-client/
├── public/                # Static assets
├── src/
│   ├── components/
│   ├── pages/
│   ├── styles/
│   ├── App.jsx
│   └── main.jsx
├── package.json
├── vite.config.js
└── README.md
```

---
