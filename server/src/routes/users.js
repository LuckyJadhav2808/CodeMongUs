import { Router } from 'express';
import { verifyToken, optionalAuth } from '../middleware/auth.js';
import { getUser, getLeaderboard } from '../models/User.js';

const router = Router();

// GET /api/users/:id/stats
router.get('/:id/stats', optionalAuth, async (req, res) => {
  try {
    const user = await getUser(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ stats: user.stats, achievements: user.achievements, username: user.username });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get user stats' });
  }
});

// GET /api/users/leaderboard?sort=wins&limit=20&period=all
router.get('/leaderboard', async (req, res) => {
  try {
    const { sort = 'stats.wins', limit = 20 } = req.query;
    const leaders = await getLeaderboard(parseInt(limit), sort);
    res.json({ leaderboard: leaders.map(u => ({ uid: u.uid, username: u.username, stats: u.stats })) });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get leaderboard' });
  }
});

export default router;
