import { Router } from 'express';
import { verifyToken } from '../middleware/auth.js';
import { createReport, getReports, resolveReport } from '../models/Report.js';

const router = Router();

// POST /api/reports
router.post('/', verifyToken, async (req, res) => {
  try {
    const { reportedUid, gameSessionId, reason, details } = req.body;
    if (!reportedUid || !reason) {
      return res.status(400).json({ error: 'reportedUid and reason are required' });
    }
    const report = await createReport({
      reporterUid: req.user.uid,
      reportedUid, gameSessionId, reason, details,
    });
    res.status(201).json({ report });
  } catch (err) {
    res.status(500).json({ error: 'Failed to submit report' });
  }
});

// GET /api/reports?status=pending
router.get('/', verifyToken, async (req, res) => {
  try {
    const reports = await getReports(req.query.status || null);
    res.json({ reports });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get reports' });
  }
});

// PUT /api/reports/:id/resolve
router.put('/:id/resolve', verifyToken, async (req, res) => {
  try {
    const { resolution } = req.body; // 'resolved' | 'dismissed'
    await resolveReport(req.params.id, req.user.uid, resolution);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to resolve report' });
  }
});

export default router;
