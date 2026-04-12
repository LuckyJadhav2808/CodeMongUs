# 🔌 CodeMongUs: Socket Event Contract

> **INSTRUCTIONS FOR THE TEAMS:** 
> Both Team A and Team B must copy and paste this exact list of Socket Events into their AI prompts. This acts as the "Contract." If both AIs use these exact names, the Front-End and Back-End will connect flawlessly on the first try with zero conflicts.

---

### Epic 1: AI Hints
*   **Client Emits:** `socket.emit('game:requestHint')`
    *   *Trigger:* When Crewmate clicks Oracle button.
*   **Server Emits:** `io.to(room).emit('game:aiHint', { hintText: "Your string here" })`
    *   *Trigger:* After AI generates the hint and deducts 30 seconds.

### Epic 2: Ghost Spectator Mode
*   **Client Emits:** `socket.emit('chat:ghostMessage', { text: "Boo!" })`
    *   *Trigger:* When an eliminated player hits enter in the ChatBox.
*   **Server Emits:** `io.to(roomCode + '_ghosts').emit('chat:ghostMessage', { sender: "user", text: "Boo!" })`
    *   *Trigger:* Broadcasts ONLY to the invisible ghost room.

### Epic 3: Jammer Sabotage
*   **Client Emits:** `socket.emit('game:sabotageJammer')`
    *   *Trigger:* When Impostor clicks Jammer on Dashboard.
*   **Server Emits:** `io.to(room).emit('game:jammed', { durationSeconds: 15 })`
    *   *Trigger:* Tells React to lock the ChatBox input.

### Epic 4: Commit Overhaul
*   **Client Emits:** `socket.emit('game:proposeCommit')` (Unchanged from Round 1, but Server now rejects if Impostor).
*   **Server Emits:** `io.to(room).emit('game:commitFailed', { attemptsRemaining: 2 })`
    *   *Trigger:* If tests fail, instead of ending game, server sends this so React can show a Toast and resume coding.

### Epic 5: End Game (AI Taunts)
*   **Server Emits:** (Modify existing `game:end`) 
    *   *Old Payload:* `{ winner: 'impostor', players: [...] }`
    *   *New Payload:* `{ winner: 'impostor', players: [...], aiTaunt: "You forgot the base case, rookies." }`
