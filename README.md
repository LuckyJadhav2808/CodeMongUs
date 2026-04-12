<div align="center">

# 🎮 CodeMongUs

### *Among Us × Competitive Coding — The Social Deduction Programming Game*

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-codemongus.netlify.app-ba0209?style=for-the-badge&labelColor=1a1a2e)](https://codemongus.netlify.app)
[![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white)](https://socket.io)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org)

<br/>

> **Can you find the Impostor before they destroy your codebase?**
> CodeMongUs is a real-time, multiplayer social deduction game that transforms pair-programming and DSA practice into a thrilling game of deception, collaboration, and debugging.

<br/>

</div>

---

## 📖 Table of Contents

- [🧠 Concept](#-concept)
- [✨ Features](#-features)
- [🏗️ Architecture](#️-architecture)
- [🛠️ Tech Stack](#️-tech-stack)
- [📂 Project Structure](#-project-structure)
- [🚀 Getting Started](#-getting-started)
- [🔐 Environment Variables](#-environment-variables)
- [🎭 Gameplay Loop](#-gameplay-loop)
- [⚡ Key Technical Highlights](#-key-technical-highlights)
- [🧩 Component Overview](#-component-overview)
- [🌐 Deployment](#-deployment)
- [🤝 Contributing](#-contributing)

---

## 🧠 Concept

Most developers find DSA practice **tedious and lonely**. CodeMongUs reimagines it as a social experience.

Inspired by the mega-hit game *Among Us*, **CodeMongUs** puts players in a shared code editor where they must collaboratively solve a programming challenge — but one player is secretly an **Impostor** 🔴. The Impostor's job is to **sabotage the codebase** without being caught, while the Crewmates must **write correct code** and figure out who's working against them.

```
🟦 Crewmates  →  Solve the DSA problem. Debug the code. Vote out the Impostor.
🔴 Impostor   →  Inject bugs. Scramble the editor. Blend in. Win without getting caught.
```

---

## 🏆 Hackathon Status: Round 1 Recap & Round 2 Roadmap

> **Hey Team!** Here is a quick breakdown to get everyone synced up on what we accomplished in Round 1 and what our flight plan is for the Round 2 (24-hour hackathon). 

### ✅ Round 1 Recap (What's already built)
- **Real-Time IDE:** Integrated Monaco Editor with Yjs (CRDTs) and y-websocket for completely conflict-free, multi-cursor, Google Docs-style collaborative coding.
- **Game Engine & State Machine:** Node.js + Socket.io backend managing the full game loop: `Lobby ➔ Role Reveal ➔ Coding ➔ Voting ➔ Build ➔ Game End`.
- **Impostor Sabotage System:** A working secret dashboard granting the Impostor abilities to Flashbang, Scramble Code, and spawn Cursor Ghosts.
- **Remote Code Execution:** Secure, sandboxed execution of player code via the Piston API to evaluate against hidden DSA test cases. 
- **Roles & Voting:** Anonymous "Report Bug" emergency meetings, dynamic voting tallying, and automatic ejection mechanics.
- **Cinematic UI:** Beautiful Framer Motion animations across Neobrutalist components.
- **Production Hosted:** Frontend on Netlify, Backend on Replit/Railway, Auth managed via Firebase.

### 🚀 Target Enhancements for Round 2 (24-Hour Sprint)
Here are the highest-impact features we should implement next to wow the judges:
1. **AI-Driven Hints:** Integrate an LLM API to provide "Code Review" hints to Crewmates at the cost of precious game time.
2. **Ghost Mode (Spectating):** Allow eliminated players to become "Ghosts", so they can spectate the live code editor and chat with other ghosts.
3. **Advanced Sabotages:** E.g., "Dependency Hell" (injecting fake boilerplate code) or "Syntax Error" (silent removal of semicolons).
4. **Specific Crewmate Roles:** Give crew members unique abilities (e.g., "QA Engineer" who can test partial code once).
5. **Sound Design:** Add Web Audio API dramatic tracks, alarm sounds during sabotages, and keyboard clacking effects.
6. **Mobile "Second-Screen" Impostor:** Optimize the Sabotage Dashboard for phones so the Impostor can secretly sabotage under the table.

---


## ✨ Features

### 🔐 Authentication & Profiles
- **Firebase Authentication** — Secure email/password sign-in
- **Player Profiles** — Track your wins, losses, and impostor history
- **Stats Dashboard** — Visual breakdown of your performance across all games

### 🏠 Lobby & Room System
- **Create & Join Rooms** — Share a game code with friends to instantly join
- **Configurable Settings** — Choose coding language, round timer, and challenge difficulty
- **Real-time Player List** — Watch players join/leave your lobby live with Socket.io

### 🎭 Role System
- **Secret Role Assignment** — Roles are assigned server-side and revealed with a cinematic **Framer Motion animation**
- **Two Roles:** `Crewmate 🟦` and `Impostor 🔴` — each with a completely different UI and set of tools

### 💻 Collaborative Code Editor
- **Monaco Editor** — The same engine powering VS Code, embedded in the browser
- **Real-time Sync via Yjs** — Conflict-free collaborative editing with CRDT technology (Y-WebSocket)
- **Multi-Cursor Support** — See exactly where other players are typing
- **Live In-Game Chat** — Communicate with teammates directly in the coding bay
- **Language Support** — JavaScript, Python, C++, Java, and more via the Piston API

### 💣 Impostor Sabotage System
The Impostor has access to a secret **Sabotage Dashboard** with 4 devastating abilities:
| Sabotage | Effect |
|---|---|
| 💥 **Flashbang** | Full-screen white flash blinds crewmates for 1.5 seconds |
| 🔀 **Code Scramble** | Randomly rearranges lines in the shared editor |
| 👻 **Cursor Ghosts** | Spawns phantom cursors to confuse everyone |
| ⌛ **Lag Spike** | Artificially delays all keystrokes with CSS jitter |

### 🗳️ Emergency Meeting & Voting
- **Report Bug Button** — Any Crewmate can call an emergency meeting, pausing the game
- **Democratic Voting** — Anonymous votes are cast against suspected Impostors
- **Real-time Tally** — Results are aggregated and displayed live across all clients
- **Ejection Ceremony** — The eliminated player is revealed with a dramatic animation

### 📤 Commit Proposal & Code Execution
- **Propose Commit** — Crewmates can vote to lock in their solution and submit it
- **Piston API Integration** — Code is securely executed in a sandboxed environment server-side
- **Test Case Validation** — The solution is run against hidden test cases to determine the winner

### 🏆 End Screens
- **Crewmates Win** — If the Impostor is ejected or the correct code is committed
- **Impostor Wins** — If the wrong code is committed or time runs out
- **Animated Results** — Cinematic win/lose screens reveal everyone's role

---

## 🏗️ Architecture

```
┌────────────────────────────────────────────────────────────────┐
│                         CLIENT (React + Vite)                  │
│                                                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │  Auth Layer  │  │  Zustand     │  │   Framer Motion UI   │  │
│  │  (Firebase)  │  │  Game Store  │  │   + TailwindCSS      │  │
│  └──────┬───────┘  └──────┬───────┘  └──────────────────────┘  │
│         │                 │                                    │
│         │         ┌───────▼──────────┐                         │
│         │         │   Custom Hooks   │                         │
│         │         │  useYjs  useTimer│                         │
│         │         │  useVoting       │                         │
│         │         └───────┬──────────┘                         │
└─────────┼─────────────────┼────────────────────────────────────┘
          │                 │
          │    Firebase     │ Socket.io + Y-WebSocket
          │    Auth Token   │
          ▼                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                    SERVER (Node.js + Express)                   │
│                                                                 │
│  ┌────────────────┐  ┌──────────────┐  ┌──────────────────┐     │
│  │  REST API      │  │  Socket.io   │  │  YjsServer       │     │
│  │  /api/auth     │  │  GameManager │  │  (Y-WebSocket)   │     │
│  │  /api/games    │  │  Socket      │  │  /yjs endpoint   │     │
│  │  /api/prompts  │  │  Handlers    │  └──────────────────┘     │
│  │  /api/reports  │  └──────────────┘                           │
│  └────────────────┘                                             │
│                                                                 │
│  ┌────────────────┐  ┌──────────────┐  ┌──────────────────┐     │
│  │ Firebase Admin │  │  Piston API  │  │  Rate Limiter    │     │
│  │  (Auth Verify) │  │ (Code Runner)│  │  + Helmet        │     │
│  └────────────────┘  └──────────────┘  └──────────────────┘     │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| **React** | 19 | UI framework |
| **Vite** | 8 | Build tool & dev server |
| **Zustand** | 5 | Global state management |
| **Framer Motion** | 12 | Animations & transitions |
| **Monaco Editor** | 4.7 | VS Code-grade code editor |
| **Yjs + y-monaco** | 13.6 | CRDT collaborative editing |
| **y-websocket** | 3.0 | Yjs WebSocket provider |
| **Socket.io Client** | 4.8 | Real-time game events |
| **TailwindCSS** | 3.4 | Utility-first styling |
| **Firebase SDK** | 12 | Authentication client |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| **Node.js + Express** | 4.21 | REST API |
| **Socket.io** | 4.8 | Real-time bidirectional events |
| **Firebase Admin** | 13 | Server-side auth verification |
| **Yjs + y-protocols** | 13.6 | Collaborative CRDT engine |
| **ws** | 8.18 | WebSocket server (Yjs provider) |
| **Piston API** | — | Sandboxed code execution |
| **Helmet** | 8 | HTTP security headers |
| **express-rate-limit** | 7.4 | API abuse prevention |
| **uuid** | 11 | Unique room/game ID generation |

---

## 📂 Project Structure

```
CodeMongUs/
├── 📁 src/                          # Frontend source
│   ├── App.jsx                      # Root component & routing
│   ├── main.jsx                     # React entry point
│   ├── 📁 components/
│   │   ├── 📁 auth/                 # Login, Register screens
│   │   ├── 📁 lobby/
│   │   │   ├── LobbyScreen.jsx      # Pre-game lobby & room joining
│   │   │   ├── GameSettings.jsx     # Language/timer config
│   │   │   ├── PlayerSlot.jsx       # Individual player card
│   │   │   ├── ChatBox.jsx          # In-lobby chat
│   │   │   ├── StatsPanel.jsx       # Player statistics display
│   │   │   ├── ProfilePanel.jsx     # User profile & avatar
│   │   │   └── NavBar.jsx           # Navigation bar
│   │   ├── 📁 game/
│   │   │   ├── GameScreen.jsx       # Main game layout
│   │   │   ├── CodeEditor.jsx       # Monaco + Yjs collaborative editor
│   │   │   ├── RoleReveal.jsx       # Animated role reveal overlay
│   │   │   ├── PlayerSidebar.jsx    # Live player list during game
│   │   │   ├── CommitVotingModal.jsx # Commit proposal voting
│   │   │   ├── GameEndScreen.jsx    # Win/lose result screen
│   │   │   ├── ActionButtons.jsx    # In-game action controls
│   │   │   └── Timer.jsx            # Countdown timer
│   │   ├── 📁 impostor/
│   │   │   └── ImpostorDashboard.jsx # Secret sabotage control panel
│   │   ├── 📁 voting/
│   │   │   └── VotingModal.jsx      # Emergency meeting & ejection UI
│   │   └── 📁 common/               # Shared UI components
│   ├── 📁 hooks/
│   │   ├── useYjs.js                # Yjs + Monaco binding hook
│   │   ├── useTimer.js              # Countdown timer hook
│   │   └── useVoting.js             # Voting state & socket hook
│   ├── 📁 services/
│   │   └── socket.js                # Socket.io client singleton
│   ├── 📁 store/                    # Zustand game state stores
│   ├── 📁 config/                   # Firebase client config
│   └── 📁 styles/                   # Global CSS & Tailwind config
│
├── 📁 server/                       # Backend source
│   └── 📁 src/
│       ├── server.js                # Express + Socket.io + Yjs entry point
│       ├── 📁 config/
│       │   └── firebase.js          # Firebase Admin initialization
│       ├── 📁 middleware/
│       │   └── auth.js              # Socket auth middleware (JWT verify)
│       ├── 📁 routes/               # REST API route handlers
│       │   ├── auth.js              # /api/auth
│       │   ├── users.js             # /api/users
│       │   ├── games.js             # /api/games
│       │   ├── prompts.js           # /api/prompts
│       │   └── reports.js           # /api/reports
│       ├── 📁 game/
│       │   ├── GameManager.js       # Room lifecycle, roles, win conditions
│       │   └── socketHandlers.js    # All Socket.io event handlers
│       ├── 📁 services/
│       │   ├── yjsServer.js         # Y-WebSocket collaborative server
│       │   ├── piston.js            # Code execution via Piston API
│       │   └── statsService.js      # Player stats aggregation
│       ├── 📁 models/               # Data models
│       ├── 📁 data/                 # Seeded DSA challenge prompts
│       └── 📁 seeds/                # Database seed scripts
│
├── Dockerfile                       # Full-stack Docker image
├── Dockerfile.backend               # Backend-only Docker image
├── nginx.conf                       # Nginx reverse proxy config
├── vercel.json                      # Vercel frontend deployment config
└── vite.config.js                   # Vite build configuration
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** `v18+`
- **npm** `v9+`
- A **Firebase project** with Authentication enabled
- (Optional) **Docker** for containerized deployment

### 1. Clone the Repository

```bash
git clone https://github.com/LuckyJadhav2808/CodeMongUs.git
cd CodeMongUs
```

### 2. Setup the Backend

```bash
cd server
cp .env.example .env
# Fill in your values (see Environment Variables below)
npm install
npm run dev
```

The server will start at `http://localhost:3000`.

> 💡 To seed the DSA challenge prompts into the database, run: `npm run seed`

### 3. Setup the Frontend

```bash
# From project root
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

### 4. (Optional) Run with Docker

```bash
# Build and run the backend container
docker build -f Dockerfile.backend -t codemongus-backend ./server
docker run -p 3000:3000 --env-file server/.env codemongus-backend

# Or use the full-stack Dockerfile with Nginx
docker build -t codemongus .
docker run -p 80:80 codemongus
```

---

## 🔐 Environment Variables

### Backend (`server/.env`)

```env
# Server
PORT=3000
FRONTEND_URL=http://localhost:5173

# Firebase — path to service account key JSON
FIREBASE_SERVICE_ACCOUNT_PATH=../your-service-account-key.json

# Piston API (free, no key required)
PISTON_API_URL=https://emkc.org/api/v2/piston

# Yjs WebSocket
YJS_WEBSOCKET_PORT=1234
```

### Frontend (`.env` in root)

```env
VITE_API_URL=http://localhost:3000
VITE_SOCKET_URL=http://localhost:3000
VITE_YJS_WS_URL=ws://localhost:3000/yjs

# Firebase config (from your Firebase Console)
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_APP_ID=your_app_id
```

> ⚠️ **Never commit your `.env` file or your Firebase service account JSON to source control.** Both are already in `.gitignore`.

---

## 🎭 Gameplay Loop

```
         ┌─────────────────────────────────┐
         │  1. LOGIN  (Firebase Auth)      │
         └──────────────┬──────────────────┘
                        │
         ┌──────────────▼──────────────────┐
         │  2. LOBBY  (Create / Join Room) │  ← Share room code
         └──────────────┬──────────────────┘
                        │
         ┌──────────────▼──────────────────┐
         │  3. ROLE REVEAL  (Animated)     │  ← Crewmate 🟦 or Impostor 🔴
         └──────────────┬──────────────────┘
                        │
         ┌──────────────▼──────────────────┐
         │  4. CODING PHASE                │
         │   • Crewmates: Solve DSA proble │
         │   • Impostor:  Sabotage + blen  │
         │   • Live Yjs sync for all uses  │
         └──────────────┬──────────────────┘
                    ┌───┴───┐
                    │       │
         ┌──────────▼──┐  ┌─▼────────────────────┐
         │  REPORT BUG  │  │  PROPOSE COMMIT     │
         │  (Emergency  │  │  (Consensus vote to │
         │   Meeting)   │  │   run & submit code)│
         └──────┬───────┘  └─────────┬───────────┘
                │                    │
    ┌───────────▼────────┐  ┌────────▼──────────────┐
    │  5. VOTE  (Eject?) │  │  6. CODE EXECUTION    │
    │  Players debate    │  │  Piston API runs code │
    │  & cast votes      │  │  against test cases   │
    └───────────┬────────┘  └────────┬──────────────┘
                │                    │
         ┌──────▼────────────────────▼──────┐
         │  7. GAME OVER                    │
         │   🟦 Crewmates Win: Impostor    │
         │      ejected OR code passes      │
         │   🔴 Impostor Wins: Wrong code   │
         │      submitted OR timer expires  │
         └──────────────────────────────────┘
```

---

## ⚡ Key Technical Highlights

### 🔄 Real-Time Collaboration with Yjs (CRDT)
The shared code editor uses **Yjs**, a production-grade Conflict-free Replicated Data Type (CRDT) library. All code changes are automatically merged without conflicts, even when multiple players type simultaneously. The `useYjs.js` hook manages the lifecycle of the Yjs document, Monaco bindings, and WebSocket provider — including proper cleanup and mutex locks to prevent echo loops.

```
Client A types → Y.Text delta → y-websocket → YjsServer → broadcast → Client B Monaco
```

### 🔌 Socket.io Game Engine
All real-time game events (role assignments, votes, sabotages, game state changes) flow through a centralized **`GameManager`** class on the server. Socket events are cleanly separated via `socketHandlers.js` and authenticated via a `verifySocketToken` middleware that validates the Firebase JWT on every connection.

### 🛡️ Security Model
- **Every** socket connection is verified against Firebase Authentication before joining a room
- The **Impostor's role** is never exposed through any API call — only the server assigns and tracks roles
- Piston API runs all submitted code in a **sandboxed container** — no code runs on your server
- **Rate limiting** (200 req/15 min) and **Helmet** headers protect the REST API

### 🎨 Design System
The UI follows a custom **Neobrutalist "High-Tech Toybox"** design system:
- Vibrant **red (#ba0209)** × **blue (#3046e3)** palette (Impostor vs. Crewmate)
- **3px+ chunky borders** with a 3D push-button effect via `box-shadow` offsets
- **Framer Motion** for all state transitions (role reveal, modals, voting, ejections)
- Fonts: **Plus Jakarta Sans** (display) · **Be Vietnam Pro** (UI) · **JetBrains Mono** (code)

---

## 🧩 Component Overview

| Component | Role |
|---|---|
| `LobbyScreen.jsx` | Room creation, player list, game settings, chat |
| `GameScreen.jsx` | Main game layout — orchestrates all game-phase views |
| `CodeEditor.jsx` | Monaco editor with Yjs binding, sabotage effects, cursor tracking |
| `RoleReveal.jsx` | Cinematic full-screen role animation at game start |
| `ImpostorDashboard.jsx` | Secret sabotage control panel (only rendered for the Impostor) |
| `VotingModal.jsx` | Emergency meeting — vote cards, timer, real-time tallying |
| `CommitVotingModal.jsx` | Consensus vote to submit & execute the current code |
| `GameEndScreen.jsx` | Animated win/lose screen with role reveals for all players |
| `Timer.jsx` | Countdown with warning pulse animation under 10 seconds |
| `PlayerSidebar.jsx` | Live player status tracker (alive / eliminated) |

---

## 🌐 Deployment

The production stack uses:

| Service | Hosts |
|---|---|
| **Netlify** | React frontend (`codemongus.netlify.app`) |
| **Replit / Railway** | Node.js + Socket.io backend |
| **Firebase** | Authentication & token verification |
| **Piston API** | Sandboxed code execution (external) |

### Deploying the Frontend (Netlify)

```bash
npm run build
# Deploy the generated /dist folder to Netlify
# Set your VITE_* environment variables in the Netlify dashboard
```

### Deploying the Backend

The backend includes a `Dockerfile.backend` for containerized deployments:

```bash
docker build -f Dockerfile.backend -t codemongus-server ./server
# Push to your container registry and deploy on Railway, Fly.io, or Render
```

> 📝 Make sure to set `FRONTEND_URL` on the backend to your Netlify URL to allow CORS from production.

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

1. **Fork** the repository
2. **Create** your feature branch: `git checkout -b feat/amazing-feature`
3. **Commit** your changes: `git commit -m 'feat: add amazing feature'`
4. **Push** to the branch: `git push origin feat/amazing-feature`
5. **Open** a Pull Request

Please follow conventional commit style and make sure your code passes ESLint (`npm run lint`).

---

<div align="center">

**Built with ❤️ for hackers who love to code — and deceive.**

*"The code is among us."* 🔴

</div>
