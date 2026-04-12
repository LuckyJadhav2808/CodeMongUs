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

## 🏆 What We Built

> A complete real-time multiplayer social deduction coding game — from scratch.

### Core Systems
- **Real-Time Collaborative IDE** — Monaco Editor + Yjs CRDTs for Google Docs-style multi-cursor coding
- **Server-Authoritative Game Engine** — Full state machine: `Lobby → Role Reveal → Coding → Voting → Build → Game End`
- **4-Ability Sabotage System** — Flashbang, Typo Injection, Cursor Ghosting, Lag Spike with cooldowns
- **Sandboxed Code Execution** — Piston API runs player code in isolated Docker containers
- **Democratic Voting** — Emergency meetings, real-time vote tallying, impostor ejection
- **2-Chance Commit Consensus** — Crewmates vote to approve code, 2 attempts to pass tests

### Progression & Engagement (NEW)
- **GitXP Points System** — Earn XP for wins, bug reports, correct votes, sabotages, and survival
- **8-Tier Rank System** — Intern → Junior Dev → Mid-Level → Senior → Tech Lead → Staff → Principal → CTO
- **19 Unlockable Rewards** — Titles and avatar frames earned through ranks and achievements
- **Real-Time Global Leaderboard** — Live Firestore `onSnapshot` ranking by GitXP
- **Match Highlights** — Post-game superlatives ("Top Bug Reporter", "Sabotage Master")
- **Taunt System** — ~50 sarcastic messages on commit failures and game endings

### AI & Content (NEW)
- **AI Oracle Hints** — LLM-powered contextual debugging hints (costs -5 XP each)
- **AI Problem Generator** — Hosts can generate brand new challenges from any topic
- **20+ Hardcoded Challenges** — Curated prompt catalog across easy/medium/hard difficulties
- **Practice Mode** — Solo debugging environment for skill-building without multiplayer

### Audio & Anti-Cheat (NEW)
- **Sound Engine** — Flashbang SFX, sabotage alarms, voting clock tick, lose jingle
- **Anti-Cheat Keyboard Lockdown** — Ctrl+C/V/A/Z/X/Y disabled in the editor
- **Ghost Chat** — Eliminated players can chat with other ghosts without spoiling the game

---


## ✨ Features

### 🔐 Authentication & Profiles
- **Firebase Authentication** — Google OAuth + Anonymous login for quick demos
- **Player Profiles** — Customizable avatars (10+ styles), display names, rank badges
- **Stats Dashboard** — GitXP progress bar, rank display, win rate, match history

### 🏠 Lobby & Room System
- **Create & Join Rooms** — Share a 6-character room code with friends
- **Configurable Settings** — Timer duration, difficulty, prompt selection (catalog or AI-generated)
- **Real-time Player List** — Watch players join/leave with live Socket.IO updates
- **5-Tab Navigation** — Lobby, Profile, Stats, Leaderboard, Rewards

### 🎭 Role System
- **Secret Role Assignment** — Server-side randomization, revealed with cinematic Framer Motion animation
- **Two Roles:** `Crewmate 🟦` and `Impostor 🔴` — completely different UIs and toolsets
- **Information Asymmetry** — Only the impostor knows who they are

### 💻 Collaborative Code Editor
- **Monaco Editor** — The same engine powering VS Code, embedded in the browser
- **Real-time Sync via Yjs** — CRDT-based conflict-free collaborative editing
- **Multi-Cursor Support** — See exactly where every player is typing
- **Live In-Game Chat** — Regular chat + Ghost chat for eliminated players
- **Anti-Cheat** — Ctrl+C/V/A/Z/X/Y all disabled to prevent copy-pasting solutions

### 💣 Impostor Sabotage System
The Impostor has access to a secret **Sabotage Dashboard** with 4 devastating abilities:
| Sabotage | Effect | Cooldown |
|---|---|---|
| 💥 **Flashbang** | 5-second solid white screen blinds all crewmates | 30s |
| ✏️ **Typo Injection** | Randomly deletes 3 syntax characters from the code | 20s |
| 👻 **Cursor Ghosting** | Hides the impostor's cursor for 10 seconds | 25s |
| 🐌 **Lag Spike** | Freezes all crewmate keyboards for 3 seconds | 45s |

### 🗳️ Emergency Meeting & Voting
- **Report Bug** — Any alive player can call an emergency meeting, pausing coding
- **Democratic Voting** — Cast votes against suspected impostors or skip
- **Real-time Tally** — Results aggregated and displayed live. Ties = no ejection
- **Correct Vote Tracking** — Voting out the impostor earns +40 GitXP per voter

### 📤 Commit Proposal & Code Execution
- **2-Chance Commit System** — Crewmates get 2 attempts to pass all test cases
- **Consensus Vote** — Majority of crewmates must approve before code runs
- **Piston API Sandbox** — Code executes in isolated Docker containers with 10s timeout
- **15-Second Auto-Expiry** — Proposals expire if not enough votes are cast

### 🤖 AI-Powered Features
- **Oracle Hints** — AI-generated contextual debugging hints (costs -5 GitXP each)
- **Problem Generator** — Hosts can create brand new challenges from any topic via OpenRouter
- **20+ Prompt Catalog** — Curated challenges across easy/medium/hard difficulties

### ⚡ GitXP Progression System
- **XP Formula** — `50 (base) + 100 (win) + 15×bugs + 40×correctVotes + 10×sabotages + 25 (survived) + 5×tests - 5×hints`
- **8 Ranks** — Intern (0 XP) → Junior Dev (500) → Mid-Level (1,500) → Senior Dev (4,000) → Tech Lead (8,000) → Staff Engineer (15,000) → Principal (30,000) → CTO (60,000)
- **19 Rewards** — 11 titles + 8 avatar frames unlocked by rank or achievements
- **Animated XP Breakdown** — Post-game screen shows line-by-line XP earned with rank-up celebration
- **Server-Side Calculation** — XP is computed on the server to prevent client manipulation

### 🏆 End Screens & Post-Game
- **Win/Lose Screens** — Cinematic animations with role reveals for all players
- **Match Highlights** — Superlatives like "Top Bug Reporter", "Sabotage Master", "Most Curious"
- **Taunt System** — ~50 sarcastic messages injected on commit failures and game endings
- **Real-Time Leaderboard** — Global ranking by GitXP with rank badges and progress bars

### 🎵 Sound Engine
- **Flashbang SFX** — Audio cue on sabotage activation
- **Sabotage Alarm** — Alert sound for typo/ghost/lag sabotages
- **Voting Clock Tick** — Ticking sound in last 10 seconds of voting
- **Lose Jingle** — Plays when the impostor wins

### 🏋️ Practice Mode
- **Solo Debugging** — Practice solving challenges without multiplayer pressure
- **AI or Catalog** — Choose from 20+ prompts or generate a new one with AI
- **Same Editor & Test Runner** — Identical experience to multiplayer, minus the impostor

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
│         │         │  useYjs          │                         │
│         │         │  useSoundManager │                         │
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
│  │  /api/games    │  │  GameRoom    │  │  /yjs endpoint   │     │
│  │  /api/prompts  │  │  Sabotage    │  └──────────────────┘     │
│  │  /api/practice │  │  Manager     │                           │
│  │  /api/reports  │  └──────────────┘                           │
│  └────────────────┘                                             │
│                                                                 │
│  ┌────────────────┐  ┌──────────────┐  ┌──────────────────┐     │
│  │ Firebase Admin │  │  Piston API  │  │ OpenRouter AI    │     │
│  │ (Auth+Firestr) │  │ (Code Runner)│  │ (Hints+GenAI)   │     │
│  └────────────────┘  └──────────────┘  └──────────────────┘     │
│                                                                 │
│  ┌────────────────┐  ┌──────────────┐  ┌──────────────────┐     │
│  │  Rate Limiter  │  │  GitXP Calc  │  │  Stats Service   │     │
│  │  + Helmet      │  │  + Ranks     │  │  + Leaderboard   │     │
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
│   ├── App.jsx                      # Root component & screen routing
│   ├── main.jsx                     # React entry point
│   ├── 📁 components/
│   │   ├── 📁 auth/                 # Login screen (Google + Anonymous)
│   │   ├── 📁 lobby/
│   │   │   ├── LobbyScreen.jsx      # Pre-game lobby & room management
│   │   │   ├── GameSettings.jsx     # Timer, difficulty, prompt selection
│   │   │   ├── PlayerSlot.jsx       # Individual player card
│   │   │   ├── ChatBox.jsx          # In-lobby chat
│   │   │   ├── StatsPanel.jsx       # GitXP, rank progress, win rate
│   │   │   ├── ProfilePanel.jsx     # User profile & avatar customization
│   │   │   ├── NavBar.jsx           # 5-tab navigation bar
│   │   │   ├── LeaderboardPanel.jsx # Real-time global leaderboard (NEW)
│   │   │   └── RewardsPanel.jsx     # Rank roadmap & unlockable rewards (NEW)
│   │   ├── 📁 game/
│   │   │   ├── GameScreen.jsx       # Main game layout with sabotage effects
│   │   │   ├── CodeEditor.jsx       # Monaco + Yjs + anti-cheat shortcuts
│   │   │   ├── RoleReveal.jsx       # Cinematic role reveal animation
│   │   │   ├── PlayerSidebar.jsx    # Live player status (alive/eliminated)
│   │   │   ├── CommitVotingModal.jsx # Commit consensus voting
│   │   │   ├── GameEndScreen.jsx    # Win/lose + XP breakdown + rank-up (UPDATED)
│   │   │   ├── ActionButtons.jsx    # In-game action controls
│   │   │   └── Timer.jsx            # Server-synced countdown display
│   │   ├── 📁 impostor/
│   │   │   └── ImpostorDashboard.jsx # Secret sabotage control panel
│   │   ├── 📁 practice/
│   │   │   └── PracticeScreen.jsx   # Solo debugging mode (NEW)
│   │   ├── 📁 voting/
│   │   │   └── VotingModal.jsx      # Emergency meeting & ejection UI
│   │   └── 📁 common/               # Shared UI: Avatar, Button, Modal
│   ├── 📁 hooks/
│   │   ├── useYjs.js                # Yjs + Monaco binding + cursor awareness
│   │   └── useSoundManager.js       # Centralized audio engine (NEW)
│   ├── 📁 services/
│   │   ├── socket.js                # Socket.IO client singleton
│   │   └── firestoreService.js      # Firestore user docs + leaderboard listener
│   ├── 📁 store/
│   │   └── gameStore.js             # Zustand store (600+ lines of game state)
│   ├── 📁 utils/
│   │   ├── rankUtils.js             # Client-side rank/reward helpers (NEW)
│   │   └── avatarGenerator.js       # DiceBear avatar URL builder
│   ├── 📁 config/                   # Firebase client config
│   └── 📁 styles/                   # Global CSS & Tailwind config
│
├── 📁 server/                       # Backend source
│   └── 📁 src/
│       ├── server.js                # Express + Socket.IO + Yjs entry point
│       ├── 📁 config/
│       │   └── firebase.js          # Firebase Admin SDK initialization
│       ├── 📁 middleware/
│       │   └── auth.js              # Socket/REST auth (Firebase JWT verify)
│       ├── 📁 routes/
│       │   ├── auth.js              # /api/auth (profile sync)
│       │   ├── users.js             # /api/users
│       │   ├── games.js             # /api/games
│       │   ├── prompts.js           # /api/prompts (catalog + AI generation)
│       │   ├── practice.js          # /api/practice (solo mode) (NEW)
│       │   └── reports.js           # /api/reports
│       ├── 📁 game/
│       │   ├── GameManager.js       # Room lifecycle management
│       │   ├── GameRoom.js          # Core game logic (750+ lines)
│       │   ├── TimerManager.js      # Server-authoritative timer
│       │   ├── SabotageManager.js   # 4-ability sabotage system
│       │   └── socketHandlers.js    # Socket.IO event handlers
│       ├── 📁 services/
│       │   ├── yjsServer.js         # Y-WebSocket CRDT server
│       │   ├── piston.js            # Sandboxed code execution
│       │   ├── statsService.js      # Post-game stats + GitXP persistence
│       │   ├── aiService.js         # OpenRouter AI integration (NEW)
│       │   └── problemGenerator.js  # AI problem generation (NEW)
│       ├── 📁 data/
│       │   ├── promptCatalog.js     # 20+ hardcoded challenges
│       │   ├── ranks.js             # XP table, ranks, rewards, calculator (NEW)
│       │   └── taunts.js            # ~50 sarcastic game messages (NEW)
│       ├── 📁 models/               # Firestore data models
│       └── 📁 seeds/                # Database seed scripts
│
├── vercel.json                      # Vercel frontend config
├── Dockerfile.backend               # Backend Docker image
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
| `LobbyScreen.jsx` | Room creation/joining, tab routing, game settings, chat |
| `GameScreen.jsx` | Main game layout — editor, sidebar, sabotage effects, sound |
| `CodeEditor.jsx` | Monaco editor with Yjs binding, anti-cheat, sabotage effects |
| `RoleReveal.jsx` | Cinematic full-screen role animation at game start |
| `ImpostorDashboard.jsx` | Secret sabotage control panel (only rendered for Impostor) |
| `VotingModal.jsx` | Emergency meeting — vote cards, timer, real-time tallying |
| `CommitVotingModal.jsx` | 2-chance consensus vote to submit & execute code |
| `GameEndScreen.jsx` | Win/lose + XP breakdown + rank progress + rank-up animation |
| `LeaderboardPanel.jsx` | Real-time global leaderboard ranked by GitXP |
| `RewardsPanel.jsx` | Rank roadmap + 19 unlockable rewards grid |
| `StatsPanel.jsx` | Player stats with GitXP, rank badge, progress bar |
| `PracticeScreen.jsx` | Solo debugging mode with AI or catalog prompts |
| `Timer.jsx` | Server-synced countdown with warning pulse under 10s |
| `PlayerSidebar.jsx` | Live player status tracker (alive / eliminated) |

---

## 🌐 Deployment

The production stack uses:

| Service | Hosts |
|---|---|
| **Vercel** | React frontend (global CDN, auto-deploys from git) |
| **Railway** | Node.js + Socket.IO backend (WebSocket support, auto-scaling) |
| **Firebase** | Authentication (Google OAuth) + Firestore database |
| **Piston API** | Sandboxed code execution (external) |
| **OpenRouter** | AI hints & problem generation (external) |

### Frontend (Vercel)

1. Import repo → Framework: **Vite**, Output: **dist**
2. Set env vars: `VITE_API_URL` + all `VITE_FIREBASE_*` variables
3. Deploy — `vercel.json` handles SPA rewrites + COOP headers

### Backend (Railway)

1. Root Directory: `/server` or use `Dockerfile.backend`
2. Set env vars: `FIREBASE_SERVICE_ACCOUNT` (full JSON), `PISTON_API_URL`, `OPENROUTER_API_KEY`, `CORS_ORIGIN`
3. Deploy — auto-builds on git push

> 📝 Set `CORS_ORIGIN` on Railway to your Vercel URL to allow cross-origin requests.

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
