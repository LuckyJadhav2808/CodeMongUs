import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { auth } from '../../config/firebase';
import {
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import Button from '../common/Button';

// ─── Floating background elements ─────────────────────────────────
const FLOATING_ITEMS = [
  { emoji: '👾', size: 'text-4xl', x: '8%', delay: 0, duration: 6 },
  { emoji: '{', size: 'text-5xl', x: '15%', delay: 1.5, duration: 7 },
  { emoji: '}', size: 'text-5xl', x: '85%', delay: 0.8, duration: 8 },
  { emoji: ';', size: 'text-4xl', x: '75%', delay: 2, duration: 5 },
  { emoji: '🐛', size: 'text-3xl', x: '92%', delay: 0.5, duration: 9 },
  { emoji: '/>', size: 'text-3xl', x: '25%', delay: 3, duration: 6.5 },
  { emoji: '( )', size: 'text-3xl', x: '60%', delay: 1, duration: 7.5 },
  { emoji: '🎮', size: 'text-3xl', x: '45%', delay: 2.5, duration: 8.5 },
  { emoji: '⚡', size: 'text-2xl', x: '35%', delay: 0.2, duration: 6 },
  { emoji: '🔍', size: 'text-2xl', x: '70%', delay: 1.8, duration: 7 },
];

function FloatingElement({ emoji, size, x, delay, duration }) {
  return (
    <motion.div
      className={`absolute ${size} pointer-events-none select-none opacity-[0.12] font-mono font-bold text-on-surface`}
      style={{ left: x }}
      initial={{ y: '110vh', rotate: 0 }}
      animate={{
        y: '-10vh',
        rotate: [0, 15, -10, 8, 0],
      }}
      transition={{
        y: { duration, repeat: Infinity, delay, ease: 'linear' },
        rotate: { duration: duration * 0.8, repeat: Infinity, delay, ease: 'easeInOut' },
      }}
    >
      {emoji}
    </motion.div>
  );
}

// ─── Feature cards data ───────────────────────────────────────────
const FEATURES = [
  {
    icon: '👥',
    title: 'The Crew',
    description: 'Collaborate in real-time to solve coding challenges. Write, debug, and ship code together before the timer runs out!',
    color: 'secondary',
    borderColor: '#001aa4',
    bgClass: '!bg-secondary-container',
  },
  {
    icon: '👾',
    title: 'The Impostor',
    description: "Sabotage the code from within! Trigger flashbangs, inject typos, cause lag spikes, and ghost cursors while pretending to help.",
    color: 'primary',
    borderColor: '#4f0001',
    bgClass: '!bg-primary-container',
  },
  {
    icon: '🗳️',
    title: 'Emergency Meetings',
    description: 'Suspect someone? Call a meeting, debate who the impostor is, and vote them out before they destroy the codebase!',
    color: 'tertiary',
    borderColor: '#4e4e00',
    bgClass: '!bg-tertiary-container',
  },
];

// ─── Sabotage showcase data ───────────────────────────────────────
const SABOTAGES = [
  { icon: '💥', name: 'Flashbang', desc: 'Blind all crewmates with a white flash' },
  { icon: '🔤', name: 'Typo Injection', desc: 'Secretly delete syntax characters' },
  { icon: '🐌', name: 'Lag Spike', desc: 'Freeze keyboards for 3 seconds' },
  { icon: '👻', name: 'Ghost Cursors', desc: 'Fake cursor overlay to confuse' },
];

export default function LoginScreen({ onLogin }) {
  const [showLogin, setShowLogin] = useState(false);
  const [mode, setMode] = useState('signin');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const resetForm = () => {
    setError(null);
    setUsername('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  const toggleMode = () => {
    resetForm();
    setMode(mode === 'signin' ? 'signup' : 'signin');
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields.');
      return;
    }
    if (mode === 'signup') {
      if (!username.trim()) {
        setError('Please enter your in-game name.');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
    }

    setLoading(true);
    try {
      let result;
      if (mode === 'signup') {
        result = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(result.user, { displayName: username });
      } else {
        result = await signInWithEmailAndPassword(auth, email, password);
      }
      onLogin(result.user);
    } catch (err) {
      console.error('Auth failed:', err);
      const msg = err.code === 'auth/email-already-in-use'
        ? 'This email is already registered. Try signing in.'
        : err.code === 'auth/invalid-credential'
        ? 'Invalid email or password.'
        : err.code === 'auth/weak-password'
        ? 'Password is too weak (min 6 characters).'
        : err.code === 'auth/user-not-found'
        ? 'No account found with this email.'
        : err.message;
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      onLogin(result.user);
    } catch (err) {
      console.error('Google login failed:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #f3f6ff 0%, #caceff 40%, #ff776622 100%)' }}
    >
      {/* ═══ Floating Background Elements ═══ */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {FLOATING_ITEMS.map((item, i) => (
          <FloatingElement key={i} {...item} />
        ))}
      </div>

      {/* ═══ Main Content ═══ */}
      <div className="relative z-10">
        <AnimatePresence mode="wait">
          {!showLogin ? (
            /* ─────────────────── LANDING VIEW ─────────────────── */
            <motion.div
              key="landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.4 }}
            >
              {/* ── Hero Section ── */}
              <section className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
                {/* Logo */}
                <motion.div
                  initial={{ scale: 0, rotate: -15 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', damping: 10, delay: 0.2 }}
                >
                  <div className="relative inline-block mb-4">
                    <motion.span
                      className="text-7xl block"
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      🎮
                    </motion.span>
                  </div>
                  <h1 className="font-display font-extrabold text-5xl md:text-7xl text-on-surface leading-tight text-outline-black mb-3">
                    <span className="text-primary">{'<'}</span>
                    Code
                    <span className="text-secondary">M👾ng</span>
                    Us
                    <span className="text-primary">{'/>'}</span>
                  </h1>
                </motion.div>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="font-body text-on-surface-variant text-lg md:text-xl italic mb-2"
                >
                  Debug together. Trust no one.
                </motion.p>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="font-body text-on-surface-variant/70 text-sm max-w-md mb-10"
                >
                  A multiplayer social deduction game where programmers collaborate
                  on real code — but one of you is secretly sabotaging everything.
                </motion.p>

                {/* CTA buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                  className="flex flex-col sm:flex-row gap-4 mb-12"
                >
                  <Button variant="primary" size="lg" icon="🚀" onClick={() => setShowLogin(true)}>
                    Connect to Mainframe
                  </Button>
                  <Button variant="ghost" size="lg" icon="⬇️" onClick={() => {
                    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                  }}>
                    How It Works
                  </Button>
                </motion.div>

                {/* Scroll indicator */}
                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-on-surface-variant/40 text-sm font-display"
                >
                  ↓ Scroll to explore
                </motion.div>
              </section>

              {/* ── How It Works ── */}
              <section id="how-it-works" className="py-20 px-4 max-w-6xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ duration: 0.5 }}
                  className="text-center mb-14"
                >
                  <span className="badge-blue mb-3 inline-block">HOW IT WORKS</span>
                  <h2 className="font-display font-extrabold text-3xl md:text-4xl text-on-surface text-outline-black">
                    Code. Deceive. Survive.
                  </h2>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {FEATURES.map((feature, i) => (
                    <motion.div
                      key={feature.title}
                      initial={{ opacity: 0, y: 40 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-50px' }}
                      transition={{ delay: i * 0.15, duration: 0.5 }}
                    >
                      <div
                        className={`card-container ${feature.bgClass} h-full`}
                        style={{ borderColor: feature.borderColor, boxShadow: `4px 4px 0px ${feature.borderColor}` }}
                      >
                        <span className="text-4xl block mb-3">{feature.icon}</span>
                        <h3 className="font-display font-extrabold text-xl mb-2">{feature.title}</h3>
                        <p className="font-body text-on-surface-variant text-sm leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>

              {/* ── Sabotage Showcase ── */}
              <section className="py-20 px-4 max-w-4xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ duration: 0.5 }}
                  className="text-center mb-10"
                >
                  <span className="badge-red mb-3 inline-block">IMPOSTOR ABILITIES</span>
                  <h2 className="font-display font-extrabold text-3xl md:text-4xl text-on-surface text-outline-black">
                    Sabotage Arsenal
                  </h2>
                  <p className="font-body text-on-surface-variant text-sm mt-2 max-w-lg mx-auto">
                    As the impostor, you have powerful abilities to disrupt the crew's progress.
                  </p>
                </motion.div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {SABOTAGES.map((sab, i) => (
                    <motion.div
                      key={sab.name}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1, type: 'spring', damping: 12 }}
                      whileHover={{ scale: 1.05, rotate: [-1, 1, 0] }}
                    >
                      <div className="card text-center h-full">
                        <span className="text-3xl block mb-2">{sab.icon}</span>
                        <h4 className="font-display font-bold text-sm mb-1">{sab.name}</h4>
                        <p className="font-body text-on-surface-variant text-[11px] leading-snug">{sab.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>

              {/* ── Game Stats Bar ── */}
              <section className="py-16 px-4">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="max-w-3xl mx-auto"
                >
                  <div className="card-container !bg-surface-low flex flex-wrap justify-around gap-6 text-center">
                    {[
                      { value: '4–8', label: 'Players per game' },
                      { value: '1', label: 'Hidden impostor' },
                      { value: '∞', label: 'Coding challenges' },
                      { value: '⚡', label: 'Real-time sync' },
                    ].map((stat) => (
                      <div key={stat.label}>
                        <p className="font-display font-extrabold text-3xl text-secondary">{stat.value}</p>
                        <p className="font-body text-on-surface-variant text-xs mt-1">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </section>

              {/* ── Final CTA ── */}
              <section className="py-20 px-4 text-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: 'spring', damping: 15 }}
                >
                  <h2 className="font-display font-extrabold text-3xl md:text-4xl text-on-surface text-outline-black mb-4">
                    Ready to find the bug?
                  </h2>
                  <p className="font-body text-on-surface-variant mb-8 max-w-md mx-auto">
                    Join a crew. Write some code. And figure out who's been sabotaging the build.
                  </p>
                  <Button variant="primary" size="lg" icon="🎮" onClick={() => setShowLogin(true)}>
                    Start Playing Now
                  </Button>
                </motion.div>
              </section>

              {/* Footer */}
              <footer className="py-8 text-center border-t-3 border-outline-variant/30">
                <p className="font-display font-bold text-sm text-on-surface-variant">
                  <span className="text-primary">{'<'}</span>
                  Code
                  <span className="text-secondary">M👾ng</span>
                  Us
                  <span className="text-primary">{'/>'}</span>
                  <span className="text-on-surface-variant/50 ml-3 font-body font-normal text-xs">
                    Built for coders who trust no one.
                  </span>
                </p>
              </footer>
            </motion.div>
          ) : (
            /* ─────────────────── LOGIN VIEW ─────────────────── */
            <motion.div
              key="login"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.4 }}
              className="min-h-screen flex items-center justify-center p-6"
            >
              <div className="max-w-md w-full">
                {/* Back button */}
                <motion.button
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  onClick={() => { setShowLogin(false); resetForm(); }}
                  className="mb-4 font-display font-bold text-sm text-on-surface-variant hover:text-on-surface transition-colors flex items-center gap-2"
                >
                  ← Back to landing
                </motion.button>

                <div className="card !shadow-chunky-lg text-center">
                  {/* Logo */}
                  <motion.div
                    initial={{ scale: 0, rotate: -10 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.2, type: 'spring', damping: 10 }}
                    className="mb-6"
                  >
                    <span className="text-6xl block mb-3">🎮</span>
                    <h1 className="font-display font-extrabold text-4xl text-on-surface leading-tight">
                      <span className="text-primary">{'<'}</span>Code<span className="text-secondary">M👾ng</span>Us<span className="text-primary">{'/>'}</span>
                    </h1>
                    <p className="font-body text-on-surface-variant text-sm mt-2 italic">
                      Debug together. Trust no one.
                    </p>
                  </motion.div>

                  {/* Mode Toggle */}
                  <div className="flex mb-6 bg-surface-container rounded-full border-3 border-on-surface p-1 gap-1">
                    <button
                      onClick={() => mode !== 'signin' && toggleMode()}
                      className={`flex-1 py-2 rounded-full font-display font-bold text-sm transition-all duration-200
                        ${mode === 'signin'
                          ? 'bg-secondary text-on-secondary shadow-chunky-sm'
                          : 'text-on-surface-variant hover:text-on-surface'}`}
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => mode !== 'signup' && toggleMode()}
                      className={`flex-1 py-2 rounded-full font-display font-bold text-sm transition-all duration-200
                        ${mode === 'signup'
                          ? 'bg-primary text-on-primary shadow-chunky-sm'
                          : 'text-on-surface-variant hover:text-on-surface'}`}
                    >
                      Sign Up
                    </button>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleEmailAuth} className="space-y-3 text-left">
                    <AnimatePresence mode="wait">
                      {mode === 'signup' && (
                        <motion.div
                          key="username"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <label className="block font-display font-bold text-xs text-on-surface-variant mb-1 uppercase tracking-wider">
                            In-Game Name
                          </label>
                          <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Your crewmate name..."
                            className="input-field"
                            maxLength={20}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div>
                      <label className="block font-display font-bold text-xs text-on-surface-variant mb-1 uppercase tracking-wider">
                        Email
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="input-field"
                      />
                    </div>

                    <div>
                      <label className="block font-display font-bold text-xs text-on-surface-variant mb-1 uppercase tracking-wider">
                        Password
                      </label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="input-field"
                      />
                    </div>

                    <AnimatePresence mode="wait">
                      {mode === 'signup' && (
                        <motion.div
                          key="confirm"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <label className="block font-display font-bold text-xs text-on-surface-variant mb-1 uppercase tracking-wider">
                            Confirm Password
                          </label>
                          <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="••••••••"
                            className="input-field"
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {error && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-error text-xs font-body bg-error/10 border-2 border-error/30 rounded-xl px-3 py-2"
                      >
                        ⚠️ {error}
                      </motion.p>
                    )}

                    <Button
                      variant={mode === 'signup' ? 'primary' : 'secondary'}
                      icon={mode === 'signup' ? '🚀' : '🔐'}
                      disabled={loading}
                      className="w-full !mt-4"
                      onClick={handleEmailAuth}
                    >
                      {loading
                        ? 'Loading...'
                        : mode === 'signup'
                        ? 'Create Account'
                        : 'Sign In'}
                    </Button>
                  </form>

                  {/* Divider */}
                  <div className="flex items-center gap-3 my-5">
                    <div className="flex-1 h-[2px] bg-outline-variant" />
                    <span className="text-xs font-display text-on-surface-variant">OR</span>
                    <div className="flex-1 h-[2px] bg-outline-variant" />
                  </div>

                  {/* Google */}
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <button
                      onClick={handleGoogle}
                      disabled={loading}
                      className="w-full flex items-center justify-center gap-3 px-6 py-3 rounded-2xl
                        border-3 border-on-surface bg-white text-on-surface font-display font-bold text-sm
                        shadow-chunky-sm hover:shadow-chunky active:shadow-none
                        active:translate-x-[2px] active:translate-y-[2px] transition-all duration-150
                        disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      Continue with Google
                    </button>
                  </motion.div>

                  <p className="text-[10px] text-on-surface-variant mt-6 font-body">
                    Find the impostor sabotaging the codebase. 4–8 players.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
