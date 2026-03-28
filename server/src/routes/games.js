import { Router } from 'express';
import { verifyToken } from '../middleware/auth.js';
import { getSession, getGameHistory } from '../models/GameSession.js';

const router = Router();

// GET /api/games/:id
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const session = await getSession(req.params.id);
    if (!session) return res.status(404).json({ error: 'Game not found' });
    res.json({ game: session });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get game' });
  }
});

// GET /api/games/history/:userId
router.get('/history/:userId', verifyToken, async (req, res) => {
  try {
    const { limit = 20 } = req.query;
    const games = await getGameHistory(req.params.userId, parseInt(limit));
    res.json({ games });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get game history' });
  }
});

export default router;
