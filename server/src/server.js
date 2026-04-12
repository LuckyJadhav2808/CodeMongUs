import 'dotenv/config';
import express from 'express';
import { createServer } from 'http';
import { Server as SocketIO } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

// Firebase (must import early to initialize)
import './config/firebase.js';

// Middleware
import { verifySocketToken } from './middleware/auth.js';

// Routes
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import gameRoutes from './routes/games.js';
import promptRoutes from './routes/prompts.js';
import reportRoutes from './routes/reports.js';
import practiceRoutes from './routes/practice.js';

// Game engine
import GameManager from './game/GameManager.js';
import { registerSocketHandlers } from './game/socketHandlers.js';

// Yjs collaborative editor
import YjsServer from './services/yjsServer.js';

// Piston health check
import { checkPistonHealth } from './services/piston.js';

// ─── CONFIG ───
const PORT = process.env.PORT || 3000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Build allowed origins list
const allowedOrigins = [
  FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:3000',
  'https://codemongus.netlify.app',
].filter(Boolean);

console.log('🌐 Allowed CORS origins:', allowedOrigins);

// ─── EXPRESS ───
const app = express();
const server = createServer(app);

app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginOpenerPolicy: false,
  crossOriginResourcePolicy: false,
  crossOriginEmbedderPolicy: false,
}));
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));
app.use(express.json({ limit: '1mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  message: { error: 'Too many requests, try again later' },
});
app.use('/api/', limiter);

// ─── ROUTES ───
app.get('/api/health', async (req, res) => {
  const piston = await checkPistonHealth();
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    activeRooms: gameManager.getActiveRoomCount(),
    piston: piston.ok ? `running (${piston.runtimes} runtimes)` : 'unreachable',
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/prompts', promptRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/practice', practiceRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// ─── SOCKET.IO ───
const io = new SocketIO(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true,
  },
  connectionStateRecovery: {
    maxDisconnectionDuration: 2 * 60 * 1000, // 2 minutes
  },
});

// Auth middleware for all socket connections
io.use(verifySocketToken);

// ─── YJS SERVER (mounted on same HTTP server at /yjs) ───
const yjsServer = new YjsServer(server);
yjsServer.start();

// Game manager (receives yjsServer ref for code retrieval & cleanup)
const gameManager = new GameManager(io, yjsServer);
registerSocketHandlers(io, gameManager);

// ─── START ───
server.listen(PORT, () => {
  console.log('');
  console.log('╔══════════════════════════════════════════════╗');
  console.log('║        🎮 CODESUS — Backend Server           ║');
  console.log('╠══════════════════════════════════════════════╣');
  console.log(`║  Express API:   http://localhost:${PORT}        ║`);
  console.log(`║  Socket.io:     ws://localhost:${PORT}          ║`);
  console.log(`║  Yjs Editor:    ws://localhost:${PORT}/yjs       ║`);
  console.log(`║  Frontend:      ${FRONTEND_URL}  ║`);
  console.log('╚══════════════════════════════════════════════╝');
  console.log('');
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down...');
  yjsServer.stop();
  server.close(() => process.exit(0));
});
