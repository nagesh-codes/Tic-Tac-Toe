# Tic‑Tac‑Toe — Real‑Time Multiplayer (Client + Server)

A modern Tic‑Tac‑Toe game with real‑time multiplayer using **Socket.IO**, built with a **React (Vite) client** and a **Node.js + Express server**. Create or join a room, take turns live, and enjoy clear in‑app notifications, responsive UI, and optional turn timeouts.

<p align="center">
  <img alt="Tic‑Tac‑Toe" src="./client/public/icons/icon-192x192.png" width="640"/>
</p>

<p align="center">
  <a href="https://github.com/nagesh-codes/Tic-Tac-Toe">
    <img alt="Repo" src="https://img.shields.io/badge/repo-Tic--Tac--Toe-blue?logo=github">
  </a>
  <img alt="Stack" src="https://img.shields.io/badge/stack-React%20%7C%20Vite%20%7C%20Node.js%20%7C%20Express%20%7C%20Socket.IO-informational">
  <img alt="License" src="https://img.shields.io/badge/license-MIT-success">
</p>

---

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [1) Clone](#1-clone)
  - [2) Install Dependencies](#2-install-dependencies)
  - [3) Configure Environment (optional)](#3-configure-environment-optional)
  - [4) Run the Server](#4-run-the-server)
  - [5) Run the Client](#5-run-the-client)
- [How It Works](#how-it-works)
- [Scripts](#scripts)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **Real‑time multiplayer**: Play live with a friend in a shared room.
- **Room management**: Create unique rooms or join by ID.
- **Player presence & turns**: See who’s connected and whose turn it is.
- **Instant state sync**: Moves update simultaneously for both players.
- **Win/Draw handling**: Detects results and surfaces status messages.
- **Restart & reset**: Quickly start a new round with the same players.
- **Optional timeout**: Auto‑forfeit a turn after inactivity (if enabled).
- **Responsive UI**: Play comfortably on desktop or mobile.
- **Clear notifications**: Success/warning/error toasts for key events.

> Tip: Add screenshots/GIFs under `client/src/assets/` and update the banner path above.

---

## Tech Stack

**Frontend (client)**  
- React (Vite)
- React Router DOM
- Socket.IO Client
- CSS (custom styles/animations)

**Backend (server)**  
- Node.js
- Express
- Socket.IO
- CORS
- Nodemon (dev)

---

## Project Structure

```
Tic-Tac-Toe/
├── client/                 # React frontend
│   ├── public/             # Static assets
│   └── src/
│       ├── assets/         # Images / GIFs
│       ├── components/     # Reusable UI + Socket provider
│       ├── pages/          # Screens (e.g., Home, Game_home)
│       ├── App.js          # Root component & routes
│       ├── index.js        # Entry
│       └── index.css       # Global styles
├── server/                 # Node/Express backend
│   ├── index.js            # Express + Socket.IO setup
│   └── package.json
└── README.md
```

---

## Getting Started

### Prerequisites
- **Node.js** v14+ (v18 LTS recommended)
- **npm** (comes with Node)

### 1) Clone
```bash
git clone https://github.com/nagesh-codes/Tic-Tac-Toe.git
cd Tic-Tac-Toe
```

### 2) Install Dependencies
```bash
# Server
cd server
npm install

# Client
cd ../client
npm install
```

### 3) Configure Environment (optional)
For local development the defaults usually “just work” (server at `http://localhost:8000`, client dev server at `http://localhost:5173`).  
If you want explicit env files:

**server/.env**
```
PORT=8000
```

**client/.env**
```
# Only if you refactor the client to read from an env var:
VITE_BACKEND_URL=http://localhost:8000
# or for websockets, if you prefer
VITE_WS_URL=ws://localhost:8000
```

> Note: The current client typically calls `io()` without a custom URL, so explicit envs may not be required.

### 4) Run the Server
```bash
cd server
npm start
# or, if you have nodemon installed
npx nodemon index.js
```
Server listens on `http://localhost:8000` by default.

### 5) Run the Client
```bash
cd client
npm run dev
```
Open the app (usually) at `http://localhost:5173`.

---

## How It Works

- The **server** exposes a Socket.IO gateway and assigns/join players to **rooms**.  
  It validates moves, tracks turns, emits state updates (board, active player, results), and broadcasts join/leave events.
- The **client** connects via **Socket.IO** (e.g., through a `SocketProvider`) and renders the board/UI.  
  It listens for server events (state updates, result notifications), sends user moves, and provides actions like **restart**.

Typical flow:
1. Player A **creates** a room → receives a `roomId` to share.
2. Player B **joins** the room using that `roomId`.
3. Players take turns. Each move is validated and **broadcast** to both clients.
4. Game ends on **win**/**draw**. Players can **restart** to play again.

---

## Scripts

**Server**
- `npm start` — start Express + Socket.IO
- `nodemon index.js` — auto‑reload on changes (if nodemon installed)

**Client**
- `npm run dev` — start Vite dev server
- `npm run build` — production build
- `npm run preview` — preview the production build locally

> Run server and client in separate terminals during development.

---

## Environment Variables

| Location     | Key             | Example/Default             | Purpose                          |
|--------------|------------------|-----------------------------|----------------------------------|
| `server/.env`| `PORT`          | `8000`                      | Server port                      |
| `client/.env`| `VITE_SERVER_URL` | `http://localhost:8000`    | REST/WS base (if used)           |
| `client/.env`| `VITE_WS_URL`     | `http://localhost:8000`      | WebSocket URL (if used)          |

---

## Deployment

**Backend (Render/any VPS)**  
1. Create a new **Web Service** and point it to `/server`.  
2. Set **Build Command**: `npm install`  
3. Set **Start Command**: `node index.js` (or `npm start`)  
4. Add `PORT` env (Render provides one automatically; read it from `process.env.PORT`).

**Frontend (Vercel/Netlify/Render Static Sites)**  
1. Point to `/client`.  
2. **Build Command**: `npm run build`  
3. **Publish Directory**: `dist` (Vite default).  
4. Configure the client to reach the deployed server URL if needed (e.g., `VITE_SERVER_URL`).

> If you have a live demo, add it here:
> - **Live Demo**: https://tic-tac-toe-18le.onrender.com

---

## Contributing

Contributions are welcome!  
1. Fork the repo  
2. Create a feature branch: `git checkout -b feat/your-feature`  
3. Commit: `git commit -m "feat: add your feature"`  
4. Push: `git push origin feat/your-feature`  
5. Open a Pull Request

Please follow conventional commits and keep PRs focused.

---

## License

This project is released under the **MIT License**. See the [LICENSE](LICENSE) file for details.
