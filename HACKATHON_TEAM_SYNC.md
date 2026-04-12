# 🎮 CodeMongUs: Hackathon Team Sync (Round 1 & 2)

> **Welcome to Phase 2 of the Hackathon!** This document serves as our central source of truth for everything we've built to qualify for Round 2, the underlying architecture, how the gameplay currently works, and our massive feature sprint for the next 24 hours.

---

## 🏆 Round 1 Summary: What We've Built So Far

We have successfully built **CodeMongUs**, a real-time, interactive collaborative web game. Most impressively, we built a complex network architecture that ensures conflict-free pair programming while managing game state dynamically.

### Core Features Shipped:
- **Authentication & Profiles**: Secure user sessions powered by Firebase Authentication. Players have dashboards that track total wins, losses, roles played, and game history.
- **Fluid Lobby System**: Players can spin up rooms, share access codes, and customize game settings natively (coding language, durations, difficulty). Real-time joins/leaves are managed via WebSockets.
- **Cinematic UI / UX Layer**: Utilizing Framer Motion and TailwindCSS, we implemented a highly polished "Neobrutalist Tech" aesthetic complete with suspenseful role reveals and dramatic ejection ceremonies.
- **Collaborative IDE**: We embedded the **Monaco Editor** (the engine behind VS Code). Crucially, we didn't just broadcast keystrokes—we implemented **Yjs CRDTs** (Conflict-free Replicated Data Types) ensuring true simultaneous multi-cursor collaboration with no desyncs.
- **Asymmetric Gameplay Mechanics**: 
    - **Crewmates 🟦** solve a real DSA (Data Structures & Algorithms) problem collaboratively. 
    - **The Impostor 🔴** blends in but has access to a **Sabotage Dashboard** (Flashbangs, Code Scramblers, Cursor Ghosts, and Lag Spikes) to secretly break the code.
- **Democratic Voting & Execution**: Players can call Emergency Meetings ("Report Bug") to hold anonymous votes. When time is up (or a commit is proposed), the backend pulls the code and runs it in a secure sandbox using the **Piston API** against hidden test cases. 
- **Deployment Architecture**: We launched the split-stack environment to production—frontend on Netlify and backend on Replit/Railway. 

---

## ⚙️ Technical Architecture Breakdown

Our project is a real-time state machine connected to a decentralized collaboration engine:

**1. The Frontend (React 19 + Vite + Zustand)**
Instead of heavy prop-drilling, we use `Zustand` for lightning-fast global state that reacts immediately to WebSockets. The IDE uses `y-monaco` to bind the code editor instance to our CRDT layer.

**2. The Backend Engine (Node.js + Express + Socket.io)**
The backend acts as the single source of truth. We bypassed standard REST API limitations by moving the core game logic into persistent Socket handlers organized by room (`GameRoom.js`). The `verifySocketToken` middleware prevents unauthorized actions by natively cross-referencing Firebase JWT tokens.

**3. The Yjs / WebSocket Layer (The Magic of CRDTs)**
Instead of computing what lines of code changed manually, our backend runs a `y-websocket` server. This architecture synchronizes binary changes automatically. This allows up to 8 players to mash the keyboard simultaneously without race conditions or overwriting each other.

**4. Remote Code Execution (Piston API)**
Because the players submit raw code, executing it on our main Node.js server is a fatal security risk. We offload execution to the `Piston API`, running user code in a secure, isolated Docker sandbox container.

---

## 🕹️ The Gameplay Logic (`GameRoom.js`)

Our game operates as an intelligent **State Machine**:

1. **Phase Transitions**: The game transitions rigidly through defined phases: `lobby ➔ roleReveal ➔ coding ➔ voting ➔ build ➔ gameEnd`. Global timers start and stop accordingly. 
2. **Hidden Roles**: When the host starts the game, the server randomly picks 1 Impostor. `roleReveal` sends secret payloads ONLY to specific Socket IDs. *The clients never download the entire list of roles*, making it unhackable from the browser.
3. **Emergency Meetings**: Any player can trigger `reportBug(uid)`. This halts the primary coding phase, logs the `remainingTime`, and jumps to the `voting` phase.
4. **Win Conditions**: 
    - At the end of voting (`resolveVoting`), if the ejected player is the last Impostor, **Crewmates Win**. If votes eliminate enough Crewmates that Impostors count ≥ Crewmates count, the **Impostor Wins**.
    - During the build phase (`runCodeExecution`), the final code is submitted to test against hidden assertions. If `allPassed` is true, **Crewmates Win**. Otherwise, the **Impostor Wins**.
5. **Drop-out Protections**: We implemented `leaveGameMidMatch`. If the Impostor drops their connection or closes the tab, the game instantly auto-resolves a Crewmate win to preserve the lobby experience.

---

## 🚀 Round 2 Sprints (24-Hour Hackathon Flight Plan)

To win the grand prize, we need to drastically increase the "WOW" factor. Here are the priority epics for the team in the next 24 hours:

### 1. AI-Driven Hint / Code Review System (High Technical Value)
- **Goal:** Integrate OpenAI (or Gemini) API so Crewmates can "Request Code Review."
- **Mechanic:** The LLM points out logic flaws without giving the answer. The catch? Requesting AI help costs the team 30 seconds of their running timer.

### 2. Spectator "GhostMode" (Improves UX)
- **Goal:** Stop dead players from just staring at a 'Game Over' screen.
- **Mechanic:** Eliminated players turn into "Ghosts". They can watch the live editor, see who is sabotaging, and chat exclusively with other ghosts.

### 3. Expanded Sabotages (High Entertainment Value)
- **Goal:** Give the Impostor more chaotic disruption tools.
- **"Dependency Hell" Sabotage:** Injects a massive block of boilerplate / import code instantly.
- **"Syntax Rot" Sabotage:** A targeted sabotage that silently deletes semicolons or changes variable declarations across the editor without triggering full-screen visual effects.

### 4. Advanced Crewmate Roles
- **Goal:** Break up the monotony of the standard crew class.
- **"QA Tester":** A crewmate who has a button to run the code execution locally once per game early without committing the final answer.
- **"Tech Lead":** A crewmate who gets a short-duration shield against Flashbangs or Scrambles.

### 5. Sound Design Polish
- **Goal:** Enhance the stressful, cinematic feel of the game.
- **Mechanic:** Implement the `Web Audio API` so alarms blare during sabotages, tension-building music plays in the final 30 seconds, and distinct mechanical keyboard sound effects play during typing.

### 6. Mobile Impostor Sabotage Dashboard
- **Goal:** Make the Impostor role impossible to figure out physically.
- **Mechanic:** Make the Sabotage UI hyper-responsive and accessible via `codemongus.netlify.app/dashboard` so a player can secretly tap sabotages on their phone under the table while pretending to code on their laptop!

---

*Let's assign these epics and get building! The code is among us...* 🔴
