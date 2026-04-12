# 🎮 CodeMongUs — Virtual Round Presentation Prep
> **Complete guide: PPT Script + Prototype Demo Script + Q&A Bank + Code Deep-Dives**

---

# PART 0 — 📊 PPT SLIDE-BY-SLIDE SCRIPT

> **Tone:** Confident, clear, and conversational. Don't just read the slide — explain it. Make the judges feel like they're understanding something cool, not sitting in a lecture.
> **Total PPT Time:** ~5–6 minutes across all slides.

---

## 🖥️ SLIDE 2 — Problem Statement

> **🔑 Keywords to remember:** `Passive platforms` · `Debugging gap` · `Low engagement` · `Use Case diagram` · `60 vs 40`

### What to say:

> "Let's start with the problem. If you look at the existing coding platforms today — LeetCode, HackerRank, Replit — they all let you *write* code. But none of them really teach you how to *think* under pressure, collaborate with a team, or catch bugs someone else secretly introduced."

> "There are three core problems. First — platforms are **passive**. You solve problems in isolation, there's no human interaction, no stakes. Second — **debugging is the most critical real-world skill**, but it's never taught in an engaging way. You're debugging your own code, not someone else's sabotage. Third — **low engagement kills retention**. Studies show active learning through gameplay achieves 60% retention vs 40% for traditional lectures — and that data is right there on the slide."

> "Now look at the **Use Case Diagram** on the right. This shows exactly *who* is affected by the problem. We have three actors:"
> - "**Developers and Teams** — they need to write code, debug issues, and collaborate — but current tools don't simulate the pressure of a real team environment."
> - "**Students** — they want to learn coding and practice problems, but solo grinding isn't effective."
> - "**Instructors** — they want to teach concepts but have no tool that makes code review genuinely engaging."

> "This diagram shows the overlap — all three groups need collaborative, pressure-based coding practice. That's the gap we identified."

> "In one line: **Current platforms let you write code. They don't make you defend it.**"

---

## 🖥️ SLIDE 3 — Proposed Solution

> **🔑 Keywords to remember:** `Social deduction` · `Shared editor` · `Role-based` · `5 problem-solving pillars` · `Active Bug Hunting`

### What to say:

> "So our solution is **CodeMongUs** — a real-time multiplayer game where coding meets social deduction. The concept is simple: players enter a shared code editor and work together to debug a code challenge. But there's a twist — one player is secretly the **Impostor**, and their job is to *introduce* bugs, not fix them."

> "Look at the flow diagram in the center. Crewmates and the Impostor both join the same shared editor. Crewmates are trying to complete the task — write correct code and pass test cases. The Impostor is secretly sabotaging the code and introducing errors. Players must identify the Impostor before time runs out."

> "Now look at the **Key Features** — six of them:"
> - "**Real-Time Collaborative Editor** — powered by Monaco and Yjs, same as VS Code and Google Docs."
> - "**Role-Based Gameplay** — server assigns private roles, no one knows who the Impostor is."
> - "**Sabotage System** — Impostor has 4 abilities to disrupt the team."
> - "**Voting & Discussion** — emergency meetings where players debate and vote."
> - "**Code Execution Engine** — Piston API runs code in a sandbox against test cases."
> - "**Timed Game Rounds** — everything happens under pressure."

> "On the right side, you'll see **5 pillars of how our solution solves the problem:**"
> 1. "**Active Bug Hunting** — players aggressively scan code for sabotage, building real debugging instincts."
> 2. "**Live Collaboration** — forced pair-programming in real time. You can't solve it alone."
> 3. "**Technical Execution** — you actually have to write and fix correct code under pressure."
> 4. "**Timed Deliberation** — debate, defend your commits, and vote — all within a clock."
> 5. "**Gamified Learning** — it turns what used to be tedious code review into something people *want* to play."

> "This isn't a drill — it's the closest simulator to a real team debugging session we could build."

---

## 🖥️ SLIDE 4 — Technology Stack

> **🔑 Keywords to remember:** `React+Vite=speed` · `Monaco=VS Code engine` · `Yjs=CRDT` · `Socket.io=real-time` · `Piston=sandboxed execution` · `Firebase=auth` · `Docker=consistent deployment`

### What to say:

> "Let me walk you through the tech stack — I'll keep this tight but thorough because every choice here was deliberate."

> **Frontend — starting from the left panel:**

> "We use **React 19 with Vite** as our foundation. React gives us a component-based UI, and Vite replaced Webpack because it's drastically faster — it uses native ES modules, so hot reloads are nearly instant during development."

> "**Tailwind CSS** handles our styling. It gives us responsive utility classes without writing a single line of custom CSS for layout. We built a custom design token system on top of it — our own color palette, border styles, and shadow system that gives the app its 'Among Us' neobrutalist look."

> "**Framer Motion** is our animation library. Every transition you see — the role reveal, modal animations, vote card movements — that's Framer Motion. Smooth spring-based animations with two lines of code."

> "**Monaco Editor** — this is critical. Monaco is the exact same editor engine that powers VS Code. It gives us syntax highlighting, bracket matching, multi-cursor support, and line numbers out of the box — inside the browser."

> "**Yjs with WebSockets** is how we make that editor collaborative. Yjs implements a data structure called a **CRDT — Conflict-free Replicated Data Type**. Think of it like this: if two players type at the exact same position at the same time, instead of one overwriting the other, their changes are mathematically merged. This is the same technology that powers Notion and Google Docs. We built a custom WebSocket layer on top to transmit the binary deltas."

> "**Zustand** is our state manager. It's much lighter than Redux — no boilerplate, no reducers — just a single store that React components subscribe to. Perfect for real-time event-driven games."

> **Backend — right panel:**

> "The backend is **Node.js with Express**. Node is non-blocking and event-driven — ideal for a game server that handles hundreds of simultaneous connections without thread management. Express handles our REST API endpoints."

> "**Socket.io** is the backbone of real-time communication. It manages all game events — room creation, role assignment, voting, sabotage, phase transitions. It also handles automatic reconnection and falls back to HTTP polling if WebSockets fail."

> "**Firebase** handles Authentication and our database. Firebase Auth issues a JWT token to every user on login. Our backend *verifies* that token using the Firebase Admin SDK on every single socket connection. No token, no entry into any room."

> **APIs and Frameworks — bottom section:**

> "**Piston API** is our code execution engine. When crewmates commit their code, we don't run it on our own server — that would be a massive security risk. Instead we send it to Piston, which runs it in a completely isolated container with a 5-second timeout and no network access. It's like a mini Judge0."

> "**DiceBear API** generates the unique character avatars — procedural, deterministic SVG generation based on a seed string. Every player gets a distinct look instantly, no image uploads required."

> "**Docker** ensures our deployment is consistent across environments. We have separate Dockerfiles for the frontend (served by Nginx) and backend, so there are no 'it works on my machine' surprises."

> "And finally our **custom Gameplay Dataset** — the `promptCatalog.js` file — contains 10 hand-crafted DSA challenges with *intentional bugs* pre-planted in the starter code. Each has JavaScript, Python, and C++ variants, and up to 3 progressive hints. This is our proprietary game content."

---

## 🖥️ SLIDE 5 — Implementation / System Workflow

> **🔑 Keywords to remember:** `6 phases` · `Firebase→Lobby→RoleReveal→Coding→Vote→Build` · `Timer snapshot` · `Crewmate vs Impostor views` · `Send to Judge`

### What to say:

> "This slide shows the **full system workflow** — I'll walk you through the flowchart on the left, then we can see it in the screenshots on the right."

> "The game has **6 phases** that run in sequence:"

> "**Phase 1 — Authentication.** Every user authenticates through Firebase before touching any game logic. They get a JWT token that the server validates. No anonymous access at all."

> "**Phase 2 — Lobby.** Players join a room using a 4-digit code — like sharing a Kahoot pin. The lobby updates in real time as players join. The host configures the challenge and timer."

> "**Phase 3 — Role Reveal.** When the host starts the game, the server randomly picks one Impostor from the player pool. It privately sends each player their own role — crewmate sees blue, impostor sees red — via a direct socket message to their individual connection ID. No one else can see it."

> "**Phase 4 — Coding Sprint.** This is the main phase. The shared Monaco editor opens with buggy starter code already in it. Crewmates are trying to fix it. The Impostor is secretly breaking it more. On the left side of the diagram, you see the Crewmate branch: write code, fix bugs, pass test cases. On the right, the Impostor branch: inject bugs, use typos, use sabotages like Flashbang and Lag Spike."

> "**Phase 4a — Sabotages.** The Impostor can trigger four different disruptions: Flashbang — a blinding white flash on crewmate screens for 5 seconds. Typo Injection — randomly deletes 3 syntax characters from the shared code. Cursor Ghosting — hides the Impostor's cursor for 10 seconds so they can type undetected. Lag Spike — freezes all crewmate keyboards for 3 seconds."

> "**Branching point — Report Bug?** At any time, a crewmate can hit Report Bug. This immediately saves the remaining coding timer to memory, stops the clock, and calls an Emergency Meeting."

> "**Phase 5 — Emergency Meeting & Vote.** All players are now in the voting screen. 60 seconds on the clock. They can debate in the live chat, then cast anonymous votes to eject a suspect. If there's a tie or majority skip, no one is ejected and coding resumes with the saved timer. If someone gets a clear majority vote, they're ejected and their role is revealed."

> "**Phase 6 — Commit & Build.** When time expires or crewmates trigger an early commit vote, the final code from the shared Yjs document is grabbed by the server and sent to the **Piston API** — our sandboxed Judge. It runs the code against hidden test cases. If all tests pass — Crewmates win, code compiled. If any test fails — Impostor wins."

> "Now look at the **screenshots on the right.** Top left — the Impostor's view with the sabotage panel open. Top right — the Crewmate's view, focused on debugging. Bottom left — the Crew Assembly lobby screen. Bottom right — the Emergency Meeting interface with the vote grid and live chat."

> "Every single one of these screens is fully functional in our deployed prototype."

---

## 🖥️ SLIDE 6 — Impact & Future Horizon

> **🔑 Keywords to remember:** `5 benefits` · `2 target users` · `3 business models` · `Classroom+Ranked+GitHub` · `Multi-language scalability`

### What to say:

> "Let's talk about real-world impact."

> **Benefits of the solution — top left:**

> "Our solution delivers **five concrete benefits.** First, it **enhances debugging proficiency** — players build the instinct to spot bugs fast because their survival depends on it. Second, it **strengthens teamwork and communication** — you must coordinate with crewmates in real time under pressure. Third, it **promotes engaging, interactive learning** — retention is dramatically higher when you're emotionally invested in the outcome. Fourth, it **develops problem-solving and analytical abilities** — reading unfamiliar buggy code and reasoning about it is a core engineering skill. Fifth, it **supports effective team-building environments** — companies can use this for onboarding or hiring evaluations."

> **Target Users — middle left:**

> "We have **two primary target users.** CS Students who need high-speed, collaborative DSA practice — instead of grinding alone on LeetCode, they're playing with friends and learning faster. And Engineering Leaders — for stress-testing candidates during hiring or running immersive onboarding sessions where new hires collaborate on a real debugging challenge together."

> **Possible Improvements — bottom left:**

> "We've already identified two key improvements for the next version: introducing difficulty levels and custom challenge upload so instructors can design their own buggy code scenarios, and enhancing security with server-side anti-cheat mechanisms."

> **Future Scope — top right:**

> "Three major features on our roadmap. **Classroom Mode** — let instructors create assignment-based rooms where student performance is tracked and graded. **Ranked System** — ELO-style leaderboards so players can track their debugging improvement over time. **GitHub PR Integration** — the most exciting one — instead of our hand-crafted prompts, pull real pull requests from GitHub repos and make teams review and debug actual production code."

> **Scalability — middle right:**

> "The architecture is built to scale. Currently we store game state in memory on the server, which supports hundreds of rooms simultaneously. For enterprise scale, we add a **Redis layer** so game state persists and multiple server instances can share room data. The prompt catalog is language-agnostic — adding Go, Rust, or Java is just adding a new entry to the catalog. Schools, colleges, companies, EdTech platforms, tournament organizers — all are viable deployment targets."

> **Business Model — bottom right:**

> "We have a clear three-tier business model. **B2C Freemium** — free to play with cosmetic micro-transactions like custom avatars and cursor trails. This drives adoption and community growth. **B2B Education** — licensed to bootcamps and universities for gamified coding tests. Semester licenses, LMS integration, instructor analytics dashboards. **B2B Enterprise** — paid private servers for tech companies who want to use CodeMongUs for Agile team-building, pair programming training, or competitive internal hackathons."

> "The total addressable market spans EdTech, developer tooling, and corporate training — three industries that are all actively looking for more engaging ways to teach technical skills."

> "Thank you. That's CodeMongUs — where every bug is a battle, and every vote counts."

---
---

# PART 1 — 🎬 PROTOTYPE DEMO SCRIPT

> **Tone:** Natural, confident, conversational. Speak like you're showing a friend something cool — not reading off a script.
> **Total Demo Time:** ~5–7 minutes.

---

## 📌 Step 1 — Introduction & The Problem

> **🔑 Keywords:** `LeetCode alone` · `no stakes` · `social deduction + coding` · `pair programming meets Among Us`

> "Good [morning/afternoon], everyone. My name is [Your Name], and today I want to introduce you to **CodeMongUs** — a project we built because we genuinely felt that learning Data Structures and Algorithms the traditional way is... honestly kind of boring."

> "Think about it — you open LeetCode, you stare at a problem alone, you maybe watch a YouTube tutorial, and then you move on. There's no collaboration, no stakes, no real reason to stay focused. The retention is low because the engagement is almost zero."

> "So we asked ourselves: what if we could make DSA practice feel like a *game*? And not just any game — what if we took the social deduction mechanics of *Among Us* and combined it with competitive coding? That's exactly what CodeMongUs is."

> "In short: it's a real-time multiplayer game where players collaborate in a shared code editor to solve a DSA problem — but one of them is secretly the **Impostor**, whose job is to sabotage the code while blending in. Think of it as pair programming meets social deduction."

---

## 📌 Step 2 — Solution Overview

> **🔑 Keywords:** `Firebase login` · `room code like Kahoot` · `private role` · `shared editor` · `Report Bug = pause`

> "Players sign in through **Firebase Authentication**. Once logged in, they create or join a room using a short code — exactly like Kahoot."

> "The host picks a DSA challenge and sets the timer. When the game starts, each player gets a **private role** — Crewmate or Impostor. Only you know your own role."

> "Crewmates must debug the shared code together. The Impostor secretly breaks it more. Any crewmate can hit **Report Bug** to pause the game and call a vote."

---

## 📌 Step 3 — LIVE DEMO

> **Tip: Have two browser windows side-by-side — Player 1 (you) and Player 2 (teammate). Practice this at least 5 times.**

### Login Screen
> **🔑 Keywords:** `Firebase JWT` · `secure token` · `no anonymous access`

> "Here's the login screen. Firebase handles all the security — token signing, validation, refresh. Let me log in as Player 1."

*[Log in. Navigate to Dashboard.]*

---

### Dashboard
> **🔑 Keywords:** `game history` · `room code` · `Socket.io real-time join`

> "After login you see the dashboard — game history, wins, losses, role breakdown. I'll create a new room, pick 'Two Sum', set 4 minutes. Player 2 joins with the code. The lobby updates instantly — that's Socket.io."

*[Create room → share code → Player 2 joins.]*

---

### Role Reveal
> **🔑 Keywords:** `server-side role` · `private socket` · `Framer Motion animation` · `no cheating via network`

> "I press Start. The server randomly picks roles and sends each privately via their own socket ID. Watch — I see red IMPOSTOR, Player 2 sees blue CREWMATE. No one can sniff the other's role from the network."

*[Both screens show role reveal animation.]*

---

### Coding Bay
> **🔑 Keywords:** `Monaco = VS Code engine` · `Yjs CRDT` · `real-time cursor sync` · `intentional bugs` · `3 hints`

> "We're in the coding bay — Monaco Editor, same as VS Code. Watch as I type on the left — changes appear on the right instantly. That's **Yjs CRDT** — the same tech as Google Docs. Even simultaneous typing merges correctly."

> "The starter code already has bugs in it — players must debug it, not write from scratch. Crewmates get up to 3 progressive hints."

*[Type code, show cursor sync, show hint button.]*

---

### Sabotage Panel
> **🔑 Keywords:** `Impostor-only UI` · `4 abilities with cooldown` · `crewmate-only broadcast` · `no identify who triggered`

> "Switching to the Impostor view — I have the Sabotage button. 4 abilities, each with a cooldown: **Flashbang** (5s white blind), **Typo Injection** (delete 3 syntax chars), **Cursor Ghost** (hide my cursor 10s), **Lag Spike** (freeze keyboards 3s)."

> "Watch — Flashbang hits Player 2's screen. They can't see a thing. And they never know *who* did it — that's the social deduction element."

*[Trigger Flashbang, show effect on Player 2.]*

---

### Emergency Meeting & Voting
> **🔑 Keywords:** `timer snapshot` · `live chat debate` · `anonymous tally` · `clear majority` · `role revealed on eject`

> "Player 2 hits Report Bug. Timer is saved. Voting screen animates in on both windows. Players debate in live chat, then vote by clicking a name card. The server tallies — if someone gets a clear majority, they're ejected and their role is revealed."

*[Both vote → show result banner.]*

---

### Commit & Game End
> **🔑 Keywords:** `consensus vote` · `50% crewmate majority` · `Piston sandbox` · `all tests pass = crewmates win` · `auto stats update`

> "When time runs out or crewmates do an early commit vote (majority needed), the code goes to the **Piston API** — sandboxed container, 5-second timeout. All tests pass → **Crewmates win**. Any failure → **Impostor wins**. Stats update in Firebase automatically."

*[Show GameEnd screen.]*

---

## 📌 Step 4 — Architecture Summary

> **🔑 Keywords:** `React+Vite frontend` · `Node+Express backend` · `Socket.io events` · `Yjs /yjs endpoint` · `Firebase Admin verify` · `Piston offloaded`

> "Frontend: React 19 + Vite. State: Zustand. Backend: Node.js dual-server — Socket.io for game events at `/`, Yjs WebSocket for editor sync at `/yjs`. Auth: Firebase JWT verified server-side on every connection. Code execution: Piston API — never runs on our server."

---

## 📌 Step 5 — Closing

> **🔑 Keywords:** `social + competitive` · `working prototype` · `server-enforced rules` · `real business value`

> "What we've built is more than a game — it's proof that technical practice can be genuinely social and competitive. The rules are all enforced server-side, the UI is production-ready, and there's a clear business path. Thank you — happy to take questions."

---
---

# PART 2 — ❓ Q&A BANK

> Practice answering these out loud. Being able to speak the answer naturally — not reading it — is what impresses judges.

---

## 🔷 Section A: Tech Stack Questions

**Q1. Why did you use Socket.io instead of pure WebSockets?**
> Socket.io gives us automatic reconnection, fallback to HTTP long-polling if WebSockets fail, room-based broadcasting (`io.to(roomCode).emit`), and event-based messaging out of the box. Plain WebSockets require us to build all of that from scratch. For a game with rooms, timers, and events — Socket.io was the right tool.

**Q2. You're using two WebSocket connections — Socket.io AND Yjs's y-websocket. Why two?**
> They serve fundamentally different purposes. Socket.io carries all game logic — role assignments, votes, sabotages, phase transitions. Yjs's WebSocket is specifically optimized for CRDT document sync — it handles the binary delta encoding and merge logic that makes collaborative editing work. Merging them would make each system less correct. On the server, they share the same HTTP server, just at different paths: `/` for Socket.io, `/yjs` for Yjs.

**Q3. What is a CRDT and why does it matter here?**
> CRDT stands for Conflict-free Replicated Data Type. It's a data structure that can be safely merged from multiple sources without conflicts, without needing a "master" copy. In our case, Yjs uses a CRDT called `Y.Text` to represent the code. When two players type at the same time, their changes are merged mathematically — not by "last write wins" overwriting. This is why collaborative editors like ours never have data loss or overwrite bugs.

**Q4. Why Firebase for authentication instead of building your own auth?**
> Building authentication correctly is one of the hardest things in software — token signing, refresh logic, secure storage, hashing — all of it. Firebase Auth gives us production-grade security in one line of code. Our focus was on the game logic, not reinventing the auth wheel. We still verify the Firebase JWT server-side using the Firebase Admin SDK, so we have full control over authorization.

**Q5. Why Zustand instead of Redux for state management?**
> Redux adds a lot of boilerplate — actions, reducers, selectors — for what is, in our case, a moderately complex game state. Zustand lets us define a single store, update it directly, and subscribe to slices of it in components. It's simpler, faster to write, and has a tiny bundle size. For real-time event-driven apps, Zustand's simplicity is a real advantage.

**Q6. What is the Piston API and is it production-safe?**
> Piston is an open-source, sandboxed code execution engine maintained by the community. It runs each code submission in an isolated container with a strict timeout (5 seconds) and memory limit. We don't run user code on our own server at all — every execution is offloaded to Piston. For a hackathon, this is a solid, free solution. In production, we'd evaluate self-hosting Piston or using alternatives like Judge0 Enterprise for better control.

**Q7. What is Vite, and why use it over Create React App?**
> Vite is a modern build tool that uses native ES modules in the browser during development, which means almost zero wait time when you save a file — it only re-bundles what changed. Create React App uses Webpack which re-bundles everything, making it slow for larger projects. Vite is now the industry standard for new React projects.

**Q8. How does TailwindCSS fit in? Did you use a component library?**
> No component library — we built our own design system from scratch using Tailwind utility classes. We defined custom design tokens (colors, shadows, border widths) in `tailwind.config.js` that match our Neobrutalist theme — things like `shadow-chunky`, `border-on-surface`, `bg-primary`. Every component is hand-built because we needed full control over the "Among Us" aesthetic.

**Q9. Why Node.js for the backend and not Python/Django or Java?**
> Node.js is an excellent choice for real-time, event-driven servers because it's non-blocking and single-threaded. It's not great for heavy CPU computation, but our backend doesn't do that — code execution is offloaded to Piston. Node.js + Socket.io is literally the most common pairing for real-time multiplayer games. Also, using JavaScript on both ends means the entire team can work across the stack.

**Q10. How did you handle CORS between your frontend (Netlify) and backend?**
> We explicitly whitelist allowed origins in the Express CORS config and in the Socket.io CORS config — both point to our Netlify domain. The Firebase JWT token is sent on every socket connection and verified server-side, so even if someone tricks the CORS header, they can't join a room without a valid token.

---

## 🔷 Section B: Prototype / Feature Questions

**Q11. How many players can play at once in a single room?**
> The room is capped at 8 players (1 Impostor, up to 7 Crewmates). This mirrors the original Among Us lobby size and keeps the social deduction aspect balanced. The `GameRoom.addPlayer()` method enforces this: if `players.size >= 8`, new joins are rejected.

**Q12. How do you make sure only the Impostor sees the Sabotage button?**
> The role is stored server-side and only sent to each player's own socket via `io.to(player.socketId).emit(...)`. The client receives their role and stores it in the Zustand store as `myRole`. The React component `ActionButtons.jsx` uses a conditional: `{myRole === 'impostor' && <SabotageButton />}` — so it's never even rendered in the DOM for Crewmates.

**Q13. What happens if the Impostor leaves the game mid-match?**
> We handle this gracefully in `GameRoom.leaveGameMidMatch()`. When a player leaves, we mark them as `'left'` and re-check win conditions. If `impostorsAlive === 0`, Crewmates win immediately. If `impostorsAlive >= crewmatesAlive`, the Impostor wins. We deliberately don't expose the leaving player's role to maintain fairness — just their username.

**Q14. What happens if a player disconnects mid-game?**
> Socket.io fires a `disconnect` event. Our `socketHandlers.js` catches this and calls `leaveGameMidMatch()` — same logic as a voluntary leave. Additionally, our `reconnectPlayer()` method in GameRoom catches the same UID connecting back and restores their full game state, timer, and role reveal — all in one event.

**Q15. What if two players call Report Bug at the same time?**
> We have a `_meetingPending` flag on the GameRoom. The first Report Bug call sets this to `true` and schedules the transition. Any subsequent calls during that 2-second window return an error: `'A meeting is already being called'`. The flag resets when the Coding phase resumes.

**Q16. Can the Impostor vote in the Emergency Meeting?**
> Yes! This is intentional and central to the social deduction mechanics. The Impostor votes just like everyone else. They can vote for a Crewmate to deflect suspicion. The voting system doesn't know or check roles — it only checks `status: 'alive'`.

**Q17. How does the voting tie-breaking work?**
> In `resolveVoting()`, we tally votes into an object. If two players have the same vote count (`isTie = true`), no one is ejected. If the "skip" count is greater than or equal to the highest individual vote count, no one is ejected either. A player is only ejected if they have a clear majority.

**Q18. What DSA problems does the game currently include?**
> We have 10 built-in challenges in our `promptCatalog.js`: Two Sum, Maximum Subarray, Reverse String, Palindrome Check, Bubble Sort, Binary Search, FizzBuzz, Fibonacci, Factorial, and Linear Search. Each challenge has support for JavaScript, Python, and C++. Crucially, the starter code given to players has **intentional bugs** — the game is about *debugging*, not writing from scratch. That's the core mechanic.

**Q19. How does the hint system work, and can the Impostor use hints?**
> Only Crewmates can request hints — enforced server-side. When a Crewmate requests one, the server sends the hint to **all players in the room** (including the Impostor). This is a deliberate design choice — the Impostor also seeing the hint creates tension and makes them adapt their sabotage strategy. There are up to 3 hints per challenge, unlocked progressively.

**Q20. What happens when the coding timer hits zero?**
> The timer calls `transitionTo('build')`. This grabs the current code from the Yjs document via `yjsServer.getCode(roomCode)`, sends it to the Piston API for execution against test cases. If all tests pass, Crewmates win. If any fail, Impostor wins. The `runCodeExecution()` method handles this entirely asynchronously with proper error handling — if Piston is unreachable, it defaults to an Impostor win.

---

## 🔷 Section C: Business Model & Future

**Q21. Who is your target audience?**
> Three main segments: (1) **Students** in CS programs who need to practice DSA but find solo practice boring — CodeMongUs makes it a social activity you want to do more of. (2) **Coding bootcamps** looking for interactive tools for live sessions. (3) **Tech companies** running internal hackathons or team-building events — CodeMongUs is a novel way to do live coding challenges together.

**Q22. How will you make money?**
> We see a freemium model: free tier with a limited challenge catalog and up to 4 players. A **Pro tier** at ~$5–10/month unlocks more challenges, more player slots, and private room analytics for instructors. An **Enterprise tier** for companies/universities would include custom challenge upload, team performance dashboards, and LMS integration (Canvas, Moodle). Room hosting for tournaments could also be a paid feature.

**Q23. Are there competitors? What makes you different?**
> Direct competitors in this exact space don't really exist. Adjacent products include LeetCode (no multiplayer, no social), CodinGame (has multiplayer but no social deduction), and Kahoot (social but no real coding). Our unique angle is the fusion of *social deduction* with *collaborative debugging*. You're not racing against someone — you're cooperating with a traitor. That tension is what makes it uniquely engaging.

**Q24. How would you scale this for 100,000 users?**
> Currently, all game state lives in memory on the Node.js server in a `Map` of `GameRoom` objects. For scale: (1) We'd move game state to **Redis** for persistence and horizontal scaling. (2) Use Socket.io's Redis adapter so multiple Node.js instances can share room state. (3) Add a load balancer (like AWS ALB) to distribute connections. (4) Piston can be self-hosted on dedicated execution nodes. Firebase handles auth at scale natively.

**Q25. What are the next features you'd build?**
> Top 5 on our roadmap:
> 1. **Multiple Impostors** — 2 Impostors for 6+ player rooms, like real Among Us
> 2. **Custom Challenge Upload** — let hosts paste their own LeetCode problem and starter code
> 3. **Spectator Mode** — watch ongoing games without playing
> 4. **Ranked Matchmaking** — ELO-style rating system for competitive play
> 5. **AI-Powered Bug Injection** — use an LLM to generate context-specific bugs in starter code instead of pre-written ones

**Q26. What's your go-to-market strategy?**
> Phase 1 is community-led growth — launch on Product Hunt, share on r/learnprogramming and tech Discord servers. Phase 2 is partnerships with coding bootcamps (offer free institution accounts). Phase 3 is B2B enterprise outreach to companies like Codeday, HackerRank competitors, and university CS departments.

---

## 🔷 Section D: Security & Edge Cases

**Q27. What if someone modifies the JavaScript on the client to claim they're the Impostor?**
> It's not possible. The role is **never stored on the client in a modifiable way that affects server logic**. The server (`GameRoom.js`) is the single source of truth for roles. If a Crewmate tries to emit `sabotage:use`, the server checks `player.role !== 'impostor'` and rejects it with an error. The client-side `myRole` is only used for UI rendering — it has zero authority.

**Q28. Could a player execute malicious code through the code editor?**
> No. The code runs on the **Piston API's servers** — completely isolated and containerized. Piston enforces a 5-second run timeout, no network access, and memory limits. Even if someone writes `while(true) {}` or `rm -rf /`, it can't affect our server or other users' data.

**Q29. Is there rate limiting on the API?**
> Yes. We use `express-rate-limit` with a limit of 200 requests per 15 minutes on all `/api/` routes. Socket.io connections are authenticated via Firebase JWT middleware before any game handler runs, which prevents anonymous flooding.

**Q30. What does Helmet do in your backend?**
> `helmet` is an Express middleware that sets a collection of security-oriented HTTP headers — Content Security Policy, X-Frame-Options, Strict-Transport-Security, etc. It's a one-line best practice that protects against a class of common web attacks like clickjacking and XSS with almost no effort.

---

## 🔷 Section E: General / Open-ended

**Q31. What was the hardest technical challenge you faced?**
> The hardest was getting the Yjs collaborative editor to work correctly without "echo loops." When your local editor change fires a Yjs `update` event, we'd send it to the server. The server broadcasts it back to everyone — including you. Without a guard, you'd apply your own change twice, causing duplications. We solved this by tagging every update with an `origin` field: local changes have no tag, remote changes are tagged `'remote'`. In the `updateHandler`, we check `if (origin === 'remote') return` — so we never re-apply our own changes. Simple, but took us a while to debug.

**Q32. What would you do differently if you started over?**
> We'd plan the state management more carefully upfront. We started with local component state and migrated to Zustand mid-development. Also, we'd containerize with Docker from day one instead of debugging deployment environment differences at the end. And we'd write a small suite of socket event integration tests early — bugs in the voting flow were hard to catch manually.

**Q33. How did you divide the work among the team?**
> [Personalize this answer. General template:] We split along Frontend/Backend lines initially. [Name] owned the game engine — GameRoom, SabotageManager, Piston integration. [Name] built the React UI — the editor, voting modal, role reveal animations. We used a shared GitHub repo with feature branches and reviewed each other's PRs. The toughest coordination point was making sure Socket.io event names matched exactly on both sides.

**Q34. Did you work with any real users? Any user feedback?**
> [If yes: describe what you learned.] We ran informal playtests with [classmates/friends] and got two major pieces of feedback: (1) The sabotage effects are fun but hard to notice — so we added the Flashbang screen shake effect to make it obvious. (2) Players wanted a chat during the voting phase specifically — so we embedded the chat directly in the VotingModal.

**Q35. What data do you store, and how do you handle user privacy?**
> We store: user account info (Firebase UID, display name), game session records (room code, prompts used, who won), and per-player stats (wins, losses, role history). We don't store code submissions after a game ends. Firebase Firestore is our database. All data is protected by Firebase Security Rules and only accessible to authenticated users who belong to that game session.

---
---

# PART 3 — 🔬 CODE DEEP-DIVES

> These are the most important logical pieces of your project. Understand them deeply — judges often ask "walk me through how X actually works."

---

## 🔬 1. The Impostor Role Assignment Logic

**File:** `server/src/game/GameRoom.js` — `startGame()` method

```javascript
// Assign roles: 1 impostor, rest crewmates
const uids = [...this.players.keys()];
const impostorIdx = Math.floor(Math.random() * uids.length);
uids.forEach((uid, i) => {
  this.players.get(uid).role = i === impostorIdx ? 'impostor' : 'crewmate';
});
```

### How to explain it:
> "We convert the players Map into an array of UIDs. We pick a random index using `Math.random()`. Whatever player is at that index becomes the Impostor — everyone else is a Crewmate. It's that simple. The complexity comes in what happens *next*: we send each player their role **privately**, via `io.to(player.socketId).emit(...)`. Each player's socketId is unique to their connection — think of it like a private DM. No player ever receives another player's role data."

### Why it's clever:
- `Math.floor(Math.random() * uids.length)` is a standard weighted random — every player has exactly equal probability of being the Impostor
- Roles are assigned and stored server-side only — the client sees them but cannot modify the server's truth

---

## 🔬 2. The Phase State Machine

**File:** `server/src/game/GameRoom.js` — `transitionTo()` method

```javascript
const PHASES = ['lobby', 'roleReveal', 'coding', 'voting', 'build', 'gameEnd'];

transitionTo(phase) {
  this.phase = phase;
  switch (phase) {
    case 'roleReveal': /* send roles, start 5s timer → coding */
    case 'coding':    /* send prompt, start coding timer → build */
    case 'voting':    /* save coding time, start 60s vote timer → resolveVoting */
    case 'build':     /* run code execution → gameEnd */
    case 'gameEnd':   /* broadcast winners, save to Firebase */
  }
  this.broadcastState();
}
```

### How to explain it:
> "The entire game is a state machine. There are 6 phases: lobby, roleReveal, coding, voting, build, and gameEnd. The `transitionTo()` method is the single function that controls all phase changes — it updates the phase, runs phase-specific logic (start a timer, broadcast an event, etc.), and then broadcasts the new state to all clients. This centralization means there's no way for the game to get into an inconsistent state — every transition is controlled and logged."

### The clever bit about voting resuming coding:
```javascript
case 'voting':
  // Save remaining coding time BEFORE stopping the timer
  this._codingTimeRemaining = this.timer.getRemaining();
  this.timer.stop();

case 'coding':
  // Use remaining time if resuming after a meeting
  const codingDuration = this._codingTimeRemaining ?? this.phaseDurations.coding;
  this._codingTimeRemaining = null; // consumed
```

> "When a meeting is called, we snapshot how many seconds are left on the coding timer. When the meeting resolves (and no one wins), we resume coding with exactly that many seconds remaining — not the full duration. This is one of those small rule-based details that makes the game feel fair."

---

## 🔬 3. The Sabotage System (Server Side)

**File:** `server/src/game/SabotageManager.js`

```javascript
const ABILITIES = {
  flashbang: { cooldown: 30, duration: 5000, name: 'Flashbang' },
  typo:      { cooldown: 20, duration: 0,    name: 'Typo Injection' },
  ghost:     { cooldown: 25, duration: 10000, name: 'Cursor Ghosting' },
  lag:       { cooldown: 45, duration: 3000,  name: 'Lag Spike' },
};

use(abilityId, impostorSocketId, crewmateSockets) {
  // 1. Validate ability exists
  // 2. Check cooldown using timestamp comparison (Date.now())
  // 3. Set cooldown: this.cooldowns[abilityId] = now + (cooldown * 1000)
  // 4. Broadcast effect ONLY to crewmate sockets — never to the room
  // 5. Confirm to impostor only
}
```

### How to explain it:
> "Every sabotage ability is defined as a config object — cooldown in seconds, duration in milliseconds. The cooldown is stored as an expiry timestamp: `Date.now() + (cooldown * 1000)`. On each use attempt, we check if `Date.now() < expiresAt`. This is more reliable than countdown timers and works even after server restarts."

> "The key rule for social deduction: we use `crewmateSockets.forEach(sid => this.io.to(sid).emit(...))` to send the sabotage effect **only to crewmate socket IDs**. The impostor gets a private `sabotage:confirmed` event. The room broadcast never happens — so crewmates experience the effect but don't see a message saying 'Impostor used Flashbang'. They just get hit and have to figure it out."

---

## 🔬 4. The Voting Tally & Tie-Breaking Logic

**File:** `server/src/game/GameRoom.js` — `resolveVoting()`

```javascript
resolveVoting() {
  const tally = {};
  for (const target of Object.values(this.votes)) {
    tally[target] = (tally[target] || 0) + 1;
  }

  let maxVotes = 0, eliminated = null, isTie = false;
  for (const [target, count] of Object.entries(tally)) {
    if (target === 'skip') continue;
    if (count > maxVotes) { maxVotes = count; eliminated = target; isTie = false; }
    else if (count === maxVotes) { isTie = true; }
  }

  const skipCount = tally['skip'] || 0;
  if (isTie || skipCount >= maxVotes) eliminated = null; // no ejection
}
```

### How to explain it:
> "After all votes are in, we tally them into an object like `{ 'player1': 2, 'player2': 1, 'skip': 1 }`. We then scan through to find the max. If any other player ties the max, we set `isTie = true`. If the skip count equals or exceeds the leading vote count, we also clear the elimination. This means you need a *clear majority*, not just a plurality, to eject someone. In a 4-player game, if votes are 2-1-1, the player with 2 is correctly ejected. If votes are 1-1-1-skip, no one is ejected."

---

## 🔬 5. Yjs Real-Time Sync — The "No Echo" Problem

**File:** `src/hooks/useYjs.js` — `useEffect()`

```javascript
// Listen for local doc changes and send tagged updates
const updateHandler = (update, origin) => {
  if (origin === 'remote') return; // Don't echo remote updates back!
  if (ws.readyState === WebSocket.OPEN) {
    const tagged = new Uint8Array(1 + update.length);
    tagged[0] = MSG_DOC_UPDATE;   // Tag byte: 0 = document update
    tagged.set(update, 1);
    ws.send(tagged);
  }
};
doc.on('update', updateHandler);

// When receiving:
if (msgType === MSG_DOC_UPDATE) {
  Y.applyUpdate(doc, payload, 'remote'); // Tag as 'remote' origin
}
```

### How to explain it:
> "This is one of the most important pieces of the whole system. Every time the Yjs document changes, it fires an `update` event with two arguments: the binary delta, and the `origin` — who caused the change. When we receive an update from the server and apply it with `Y.applyUpdate(doc, payload, 'remote')`, we pass `'remote'` as the origin. When the update event fires as a result, our handler sees `origin === 'remote'` and returns immediately — it doesn't send the update back to the server. This breaks the potential infinite echo loop where A sends to server, server sends to A, A sends back to server, forever."

---

## 🔬 6. The Commit Proposal Consensus System

**File:** `server/src/game/socketHandlers.js` — `commit:propose` and `commit:respond`

```javascript
// Propose: calculate minimum approvals needed
const needed = Math.ceil(crewmates.length / 2);

// Store proposal state on room
room._commitProposal = { code, votes: {}, needed, approvals: 0, rejections: 0 };

// Respond:
if (proposal.approvals >= proposal.needed) {
  // Approved → run code
}
const rejected = proposal.rejections > proposal.total - proposal.needed;
if (rejected) {
  // Definitively rejected → clear proposal
}
```

### How to explain it:
> "Crewmates can collectively decide to submit the code for testing via a consensus vote. The threshold is a simple majority: `Math.ceil(crewmates.length / 2)`. So in a 4-crewmate game, you need 2 approvals. The Impostor cannot vote on commit proposals — only Crewmates can. The Impostor can't propose a commit either. Early approval runs the code immediately, cutting short the remaining timer — which is great if crewmates are confident, but risky if the Impostor has injected bugs. The proposal auto-expires after 15 seconds if not enough votes come in."

---

## 🔬 7. The Win Condition Logic

**File:** `server/src/game/GameRoom.js` — `checkWinCondition()`

```javascript
checkWinCondition() {
  const alive = this.getAlivePlayers();
  const impostorsAlive = alive.filter(p => p.role === 'impostor').length;
  const crewmatesAlive = alive.filter(p => p.role === 'crewmate').length;

  if (impostorsAlive === 0) {
    this.winner = 'crewmates'; return true;
  }
  if (impostorsAlive >= crewmatesAlive) {
    this.winner = 'impostor'; return true;
  }
  return false;
}
```

### How to explain it:
> "There are three ways to end the game: (1) All Impostors are voted out — Crewmates win. (2) Impostors outnumber or equal Crewmates — Impostor wins. (3) Timer ends and code is executed — if all test cases pass, Crewmates win; if any fail, Impostor wins. This is checked after every vote resolution and after any player leaves. The separation of concerns is clean — `checkWinCondition()` only asks 'is the game over?' and the caller decides what happens next."

---

## 🔬 8. The Intentional Bug Strategy in Challenges

**File:** `server/src/data/promptCatalog.js`

### Example — Two Sum (buggy starter code):
```javascript
function twoSum(nums, target) {
  const map = {};
  for (let i = 0; i <= nums.length; i++) {  // BUG 1: <= causes off-by-one (goes past array)
    const complement = target + nums[i];      // BUG 2: should be target - nums[i]
    if (map[complement] !== undefined) {
      return [complement, i];                 // BUG 3: should return [map[complement], i]
    }
    map[nums[i]] = i;
  }
  return [];
}
```

### Three deliberate bugs:
1. `i <= nums.length` — off-by-one error. Should be `i < nums.length`. Accessing `nums[nums.length]` gives `undefined`.
2. `target + nums[i]` — wrong operation. Should be `target - nums[i]` to find the complement.
3. `return [complement, i]` — returns the *value* instead of the *index* stored in `map`.

### How to explain it:
> "The game is fundamentally about debugging, not writing from scratch. Every challenge in our catalog has 2–3 intentional bugs planted in the starter code. The bugs are realistic — off-by-one errors, wrong operators, wrong return values — the kind of mistakes a real developer might actually make. Players can unlock hints progressively. The Impostor's goal is to make the code look like it's fixed when it actually still breaks test cases, or to introduce new bugs while flying under the radar."

---

## 💡 QUICK REFERENCE — KEY NUMBERS TO REMEMBER

| Fact | Value |
|---|---|
| Max players per room | 8 |
| Role Reveal phase duration | 5 seconds |
| Default coding timer | 4 minutes (240s) |
| Voting phase duration | 60 seconds |
| Build/execution window | 30 seconds |
| Flashbang cooldown | 30 seconds |
| Typo Injection cooldown | 20 seconds |
| Cursor Ghost duration | 10 seconds |
| Lag Spike duration | 3 seconds |
| Max hints per challenge | 3 |
| Commit proposal expiry | 15 seconds |
| Socket.io reconnection window | 2 minutes |
| API rate limit | 200 requests / 15 minutes |
| DSA challenges in catalog | 10 |
| Supported languages | JavaScript, Python, C++ |
| Active learning retention | 60% (vs 40% lecture) |

---

## 💡 MASTER KEYWORD CHEAT SHEET

| Slide / Section | Keywords |
|---|---|
| Problem Statement | `Passive platforms` · `Debugging gap` · `60 vs 40 retention` · `Use case 3 actors` |
| Proposed Solution | `Social deduction` · `Shared editor` · `5 pillars` · `Active Bug Hunting` |
| Tech Stack — Frontend | `React+Vite=speed` · `Monaco=VS Code` · `Yjs=CRDT=no conflict` · `Zustand=simple state` |
| Tech Stack — Backend | `Node=non-blocking` · `Socket.io=events+rooms` · `Firebase Admin=JWT verify` |
| Tech Stack — APIs | `Piston=sandbox isolation` · `DiceBear=procedural avatar` · `Docker=consistent deploy` |
| System Workflow | `6 phases` · `Timer snapshot on vote` · `Private socket role` · `Piston judge` |
| Impact | `5 benefits` · `2 target users` · `3 business tiers` |
| Future | `Classroom mode` · `Ranked+ELO` · `GitHub PR integration` |
| Business Model | `B2C Freemium` · `B2B Education` · `B2B Enterprise` |
| Role Logic | `Math.random pick` · `Private socketId emit` · `Server source of truth` |
| Phase Machine | `transitionTo()` · `6 states` · `_codingTimeRemaining snapshot` |
| Sabotage | `Timestamp cooldown` · `Crewmate-only emit` · `No room broadcast` |
| Voting | `Tally object` · `isTie flag` · `skipCount >= maxVotes` |
| Yjs Echo Fix | `origin: 'remote'` · `tagged Uint8Array` · `no re-apply own changes` |
| Commit Consensus | `Math.ceil(n/2)` · `Impostor excluded` · `15s auto-expire` |
| Win Conditions | `3 ways to end` · `impostors >= crewmates` · `all tests must pass` |

---

*Good luck with the virtual round! You built something genuinely impressive — own it confidently.* 🚀
