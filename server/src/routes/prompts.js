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

export default router;
