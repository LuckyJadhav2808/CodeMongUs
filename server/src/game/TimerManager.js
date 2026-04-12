/**
 * TimerManager — Handles per-phase countdown timers with tick broadcasting.
 * Uses wall-clock anchoring to prevent drift over long durations.
 */
export default class TimerManager {
  constructor(io, roomCode) {
    this.io = io;
    this.roomCode = roomCode;
    this.interval = null;
    this.seconds = 0;
    this.onExpire = null;
    this._startedAt = null;   // wall-clock anchor (ms)
    this._totalSeconds = 0;   // original duration for this phase
  }

  start(seconds, onExpire) {
    this.stop();
    this.seconds = seconds;
    this._totalSeconds = seconds;
    this._startedAt = Date.now();
    this.onExpire = onExpire;

    this.io.to(this.roomCode).emit('timer:start', { seconds });

    this.interval = setInterval(() => {
      // Calculate remaining from wall-clock to avoid drift
      const elapsed = Math.floor((Date.now() - this._startedAt) / 1000);
      this.seconds = Math.max(0, this._totalSeconds - elapsed);
      this.io.to(this.roomCode).emit('timer:tick', { seconds: this.seconds });

      if (this.seconds <= 0) {
        this.stop();
        if (this.onExpire) this.onExpire();
      }
    }, 1000);
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  getRemaining() {
    if (!this._startedAt) return this.seconds;
    const elapsed = Math.floor((Date.now() - this._startedAt) / 1000);
    return Math.max(0, this._totalSeconds - elapsed);
  }

  /**
   * Adjust the timer by a delta (positive = add time, negative = subtract).
   * Clamps to a minimum of 1 second so the timer doesn't instantly expire.
   */
  adjust(deltaSecs) {
    this._totalSeconds = Math.max(1, this._totalSeconds + deltaSecs);
    this.seconds = this.getRemaining();
    // Immediately broadcast the adjusted time so clients stay in sync
    this.io.to(this.roomCode).emit('timer:tick', { seconds: this.seconds });
  }

  destroy() {
    this.stop();
    this.onExpire = null;
  }
}
