/**
 * AI Service — Oracle Hint Generator
 * Uses OpenRouter API (with Gemini Flash fallback) to provide
 * cryptic debugging hints without giving away the answer.
 */

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '';

// Models to try in order (primary → fallback)
const MODELS = [
  'google/gemini-2.0-flash-001',
  'meta-llama/llama-3-8b-instruct',
];

/**
 * Build the system prompt that constrains the AI to give hints, not answers.
 */
function buildSystemPrompt(description, functionSignature) {
  return `You are a helpful Senior Developer acting as a hint system in a multiplayer debugging game called CodeMongUs.
Players are given buggy code and must find and fix the bugs to pass test cases.

RULES FOR YOUR HINTS:
- Give exactly ONE clear, understandable hint in 1-2 sentences.
- Clearly name the concept or logical flaw (e.g., "off-by-one error", "wrong comparison operator", "incorrect initial value").
- Do NOT write the corrected code or give the exact fix.
- Do NOT reference specific line numbers.
- Use plain English that any beginner programmer can understand.
- Be direct and helpful, not vague or mysterious.

PROBLEM CONTEXT:
Title/Description: ${description}
Function Signature: ${functionSignature}`;
}

/**
 * Ask the Oracle AI for a hint based on the player's current code.
 *
 * @param {string} code        - The current code from the Yjs editor
 * @param {string} description - The problem description
 * @param {string} functionSig - The function signature
 * @returns {Promise<{success: boolean, hint?: string, error?: string}>}
 */
export async function askOracle(code, description, functionSig) {
  if (!OPENROUTER_API_KEY) {
    return { success: false, error: 'OpenRouter API key not configured' };
  }

  const systemPrompt = buildSystemPrompt(description, functionSig);
  const userMessage = `Here is the player's current code:\n\`\`\`\n${code}\n\`\`\`\n\nGive them a cryptic Oracle hint about what might be wrong.`;

  for (const model of MODELS) {
    try {
      const response = await fetch(OPENROUTER_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://codemongus.netlify.app',
          'X-Title': 'CodeMongUs Oracle',
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userMessage },
          ],
          max_tokens: 120,
          temperature: 0.8,
        }),
      });

      if (!response.ok) {
        console.warn(`⚠️ Oracle: Model ${model} returned ${response.status}, trying fallback...`);
        continue;
      }

      const data = await response.json();
      const hint = data?.choices?.[0]?.message?.content?.trim();

      if (hint) {
        console.log(`🔮 Oracle hint generated via ${model}`);
        return { success: true, hint };
      }
    } catch (err) {
      console.warn(`⚠️ Oracle: Model ${model} failed:`, err.message);
      continue;
    }
  }

  return { success: false, error: 'All AI models failed. Try again later.' };
}
