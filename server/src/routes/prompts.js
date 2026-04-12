import { Router } from 'express';
import { verifyToken } from '../middleware/auth.js';
import { getAllPrompts, getRandomPrompt, getPromptsByDifficulty, createPrompt } from '../models/Prompt.js';

const router = Router();

// GET /api/prompts
router.get('/', async (req, res) => {
  try {
    const { difficulty } = req.query;
    const prompts = difficulty
      ? await getPromptsByDifficulty(difficulty)
      : await getAllPrompts();
    res.json({ prompts });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get prompts' });
  }
});

// GET /api/prompts/random?difficulty=easy
router.get('/random', async (req, res) => {
  try {
    const prompt = await getRandomPrompt(req.query.difficulty || null);
    res.json({ prompt });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get random prompt' });
  }
});

// POST /api/prompts — Create prompt (admin)
router.post('/', verifyToken, async (req, res) => {
  try {
    const { title, description, difficulty, language, functionSignature, starterCode, testCases } = req.body;
    if (!title || !description || !difficulty) {
      return res.status(400).json({ error: 'title, description, and difficulty are required' });
    }
    const prompt = await createPrompt({
      title, description, difficulty, language: language || 'javascript',
      functionSignature: functionSignature || '',
      starterCode: starterCode || '',
      testCases: testCases || [],
    });
    res.status(201).json({ prompt });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create prompt' });
  }
});

// POST /api/prompts/generate — AI-generate a custom debugging problem
router.post('/generate', verifyToken, async (req, res) => {
  try {
    const { input, language = 'javascript' } = req.body;
    if (!input || input.trim().length < 3) {
      return res.status(400).json({ success: false, error: 'Please provide a topic or code snippet (min 3 chars)' });
    }

    const { generateCustomProblem } = await import('../services/problemGenerator.js');
    const result = await generateCustomProblem(input.trim(), language);

    if (!result.success) {
      return res.status(500).json({ success: false, error: result.error });
    }

    // Register into in-memory catalog with a unique ID
    const { registerCustomPrompt, resolvePromptForGame } = await import('../data/promptCatalog.js');
    const customId = `custom-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    registerCustomPrompt(customId, result.prompt, language);

    // Resolve it so the frontend can use it immediately
    const resolved = resolvePromptForGame(customId, language);

    res.json({ success: true, promptId: customId, prompt: resolved });
  } catch (err) {
    console.error('Generate prompt error:', err);
    res.status(500).json({ success: false, error: 'Failed to generate custom problem' });
  }
});

export default router;
