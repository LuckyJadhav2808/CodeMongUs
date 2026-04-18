import { Router } from 'express';
import { verifyToken } from '../middleware/auth.js';
import { resolvePromptForGame, getCatalogList } from '../data/promptCatalog.js';
import { executeCode } from '../services/localExecutor.js';
import { askOracle } from '../services/aiService.js';

const router = Router();

/**
 * GET /api/practice/prompts — Return the full prompt catalog for selection.
 */
router.get('/prompts', verifyToken, (req, res) => {
  const prompts = getCatalogList();
  res.json({ success: true, prompts });
});

/**
 * GET /api/practice/prompt/:id — Return a single resolved prompt with starter code.
 */
router.get('/prompt/:id', verifyToken, (req, res) => {
  const { id } = req.params;
  const language = req.query.language || 'javascript';
  const prompt = resolvePromptForGame(id, language);
  if (!prompt) {
    return res.status(404).json({ success: false, error: 'Prompt not found' });
  }
  res.json({ success: true, prompt });
});

/**
 * POST /api/practice/execute — Run code against a prompt's test cases via Piston.
 */
router.post('/execute', verifyToken, async (req, res) => {
  try {
    const { code, promptId, language = 'javascript' } = req.body;
    if (!code || !promptId) {
      return res.status(400).json({ success: false, error: 'Missing code or promptId' });
    }

    const prompt = resolvePromptForGame(promptId, language);
    if (!prompt) {
      return res.status(404).json({ success: false, error: 'Prompt not found' });
    }

    const results = await executeCode(code, prompt.testCases, language);
    res.json({ success: true, ...results });
  } catch (err) {
    console.error('Practice execute error:', err.message);
    res.status(500).json({ success: false, error: 'Execution failed' });
  }
});

/**
 * POST /api/practice/hint — Get an AI Oracle hint for the current code.
 */
router.post('/hint', verifyToken, async (req, res) => {
  try {
    const { code, promptId, language = 'javascript' } = req.body;
    if (!promptId) {
      return res.status(400).json({ success: false, error: 'Missing promptId' });
    }

    const prompt = resolvePromptForGame(promptId, language);
    if (!prompt) {
      return res.status(404).json({ success: false, error: 'Prompt not found' });
    }

    const result = await askOracle(
      code || '',
      prompt.description,
      prompt.functionSignature
    );

    if (!result.success) {
      return res.status(500).json({ success: false, error: result.error || 'Oracle failed' });
    }

    res.json({ success: true, hint: result.hint });
  } catch (err) {
    console.error('Practice hint error:', err.message);
    res.status(500).json({ success: false, error: 'Hint generation failed' });
  }
});

export default router;
