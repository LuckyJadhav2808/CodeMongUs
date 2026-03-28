/**
 * TimerManager — Handles per-phase countdown timers with tick broadcasting.
 */
export default class TimerManager {
  constructor(io, roomCode) {
    this.io = io;
    this.roomCode = roomCode;
    this.interval = null;
    this.seconds = 0;
    this.onExpire = null;
  }

  start(seconds, onExpire) {
    this.stop();
    this.seconds = seconds;
    this.onExpire = onExpire;

    this.io.to(this.roomCode).emit('timer:start', { seconds });

    this.interval = setInterval(() => {
      this.seconds--;
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
    return this.seconds;
  }

  destroy() {
    this.stop();
    this.onExpire = null;
  }
}
