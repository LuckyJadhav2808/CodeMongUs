/**
 * SabotageManager — Handles 4 impostor sabotage abilities with cooldowns.
 */
const ABILITIES = {
  flashbang: { cooldown: 30, duration: 5000, name: 'Flashbang' },
  typo:      { cooldown: 20, duration: 0,    name: 'Typo Injection' },
  ghost:     { cooldown: 25, duration: 10000, name: 'Cursor Ghosting' },
  lag:       { cooldown: 45, duration: 3000,  name: 'Lag Spike' },
};

export default class SabotageManager {
  constructor(io, roomCode) {
    this.io = io;
    this.roomCode = roomCode;
    this.cooldowns = {};  // { abilityId: expiresAt timestamp }
  }

  /**
   * Attempt to use a sabotage ability. Returns { success, error }.
   */
  use(abilityId, impostorSocketId, crewmateSockets) {
    const ability = ABILITIES[abilityId];
    if (!ability) return { success: false, error: 'Unknown sabotage ability' };

    // Check cooldown
    const now = Date.now();
    if (this.cooldowns[abilityId] && now < this.cooldowns[abilityId]) {
      const remaining = Math.ceil((this.cooldowns[abilityId] - now) / 1000);
      return { success: false, error: `On cooldown: ${remaining}s remaining` };
    }

    // Set cooldown
    this.cooldowns[abilityId] = now + (ability.cooldown * 1000);

    // Broadcast effect to crewmates only (never reveal who sabotaged)
    switch (abilityId) {
      case 'flashbang':
        // Force light mode on all crewmate editors for 5 seconds
        crewmateSockets.forEach(sid => {
          this.io.to(sid).emit('sabotage:flashbang', { duration: ability.duration });
        });
        break;

      case 'typo':
        // Tell crewmate clients to randomly delete 3 syntax characters
        crewmateSockets.forEach(sid => {
          this.io.to(sid).emit('sabotage:typo', { count: 3 });
        });
        break;

      case 'ghost':
        // Hide impostor's cursor for all crewmates for 10 seconds
        crewmateSockets.forEach(sid => {
          this.io.to(sid).emit('sabotage:ghost', { duration: ability.duration });
        });
        break;

      case 'lag':
        // Freeze crewmate keyboards for 3 seconds
        crewmateSockets.forEach(sid => {
          this.io.to(sid).emit('sabotage:lag', { duration: ability.duration });
        });
        break;
    }

    // Confirm to impostor
    this.io.to(impostorSocketId).emit('sabotage:confirmed', {
      ability: abilityId,
      cooldown: ability.cooldown,
    });

    console.log(`🔧 [${this.roomCode}] Sabotage: ${ability.name}`);
    return { success: true, ability: abilityId };
  }

  getCooldowns() {
    const now = Date.now();
    const result = {};
    for (const [id, expiresAt] of Object.entries(this.cooldowns)) {
      result[id] = Math.max(0, Math.ceil((expiresAt - now) / 1000));
    }
    return result;
  }

  destroy() {
    this.cooldowns = {};
  }
}
