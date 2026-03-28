import { Router } from 'express';
import { verifyToken } from '../middleware/auth.js';
import { createOrUpdateUser, getUser, updateUser, checkUsername, deleteUser } from '../models/User.js';
import { auth } from '../config/firebase.js';

const router = Router();

// POST /api/auth/profile — Create or sync profile on login
router.post('/profile', verifyToken, async (req, res) => {
  try {
    const profile = await createOrUpdateUser(req.user.uid, {
      username: req.body.username || req.user.name,
      email: req.user.email,
      picture: req.user.picture,
      isAnonymous: req.user.isAnonymous || false,
    });
    res.json({ success: true, profile });
  } catch (err) {
    console.error('Create profile error:', err);
    res.status(500).json({ error: 'Failed to create profile' });
  }
});

// GET /api/auth/profile — Get current user profile
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const profile = await getUser(req.user.uid);
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    res.json({ profile });
  } catch (err) {
    console.error('Get profile error:', err);
    res.status(500).json({ error: 'Failed to get profile' });
  }
});

// PUT /api/auth/profile — Update profile
router.put('/profile', verifyToken, async (req, res) => {
  try {
    const { username, avatarUrl } = req.body;
    const updates = {};
    if (username) updates.username = username;
    if (avatarUrl) updates.avatarUrl = avatarUrl;
    await updateUser(req.user.uid, updates);
    res.json({ success: true, updates });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// GET /api/auth/check-username/:username
router.get('/check-username/:username', async (req, res) => {
  try {
    const result = await checkUsername(req.params.username);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to check username' });
  }
});

// DELETE /api/auth/account — Delete account
router.delete('/account', verifyToken, async (req, res) => {
  try {
    await deleteUser(req.user.uid);
    if (auth) await auth.deleteUser(req.user.uid);
    res.json({ success: true, message: 'Account deleted' });
  } catch (err) {
    console.error('Delete account error:', err);
    res.status(500).json({ error: 'Failed to delete account' });
  }
});

// POST /api/auth/guest/promote — Convert guest to permanent
router.post('/guest/promote', verifyToken, async (req, res) => {
  try {
    await updateUser(req.user.uid, { isAnonymous: false, email: req.user.email });
    res.json({ success: true, message: 'Account promoted to permanent' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to promote account' });
  }
});

export default router;
