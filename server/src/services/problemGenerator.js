/**
 * AI Problem Generator — Creates custom debugging prompts from user input.
 * Uses OpenRouter API to generate a bugged code snippet, hints, and test cases
 * that conform to our PROMPT_CATALOG schema.
 */

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '';

const MODELS = [
  'google/gemini-2.0-flash-001',
  'meta-llama/llama-3-8b-instruct',
];

/**
 * Generate a custom debugging problem from a topic description or code snippet.
 *
 * @param {string} input    - A topic (e.g. "binary search") or raw code snippet
 * @param {string} language - "javascript" | "python" | "cpp"
 * @returns {Promise<{success: boolean, prompt?: object, error?: string}>}
 */
export async function generateCustomProblem(input, language = 'javascript') {
  if (!OPENROUTER_API_KEY) {
    return { success: false, error: 'OpenRouter API key not configured' };
  }

  const langLabel = { javascript: 'JavaScript', python: 'Python', cpp: 'C++' }[language] || 'JavaScript';

  const systemPrompt = `You are a coding challenge generator for a multiplayer debugging game called CodeMongUs.

Your job is to create a SINGLE coding problem with INTENTIONALLY BUGGY starter code that players must debug.

STRICT RULES:
1. The starter code MUST contain 2-3 subtle bugs (off-by-one errors, wrong operators, bad initial values, etc).
2. The function must be self-contained — no imports, no I/O, just a pure function.
3. Generate exactly 3 test cases. The first 2 should be visible, the 3rd should be hidden.
4. Hints should guide players toward the bugs WITHOUT giving the exact fix.
5. Output ONLY valid JSON — no markdown, no backticks, no explanation.

You MUST respond with this EXACT JSON structure (for ${langLabel}):
{
  "title": "Short Problem Title",
  "category": "DSA — Topic",
  "difficulty": "easy|medium|hard",
  "description": "A 1-2 sentence description ending with: The code below has bugs — fix them!",
  "functionSignature": "function name(params)",
  "starterCode": "// 🐛 This code has bugs! Fix them to pass the tests.\\nfunction ...",
  "hints": ["Hint 1 about bug 1", "Hint 2 about bug 2", "Hint 3 general"],
  "testCases": [
    { "input": "functionCall(args)", "expected": "expectedOutput", "visible": true },
    { "input": "functionCall(args)", "expected": "expectedOutput", "visible": true },
    { "input": "functionCall(args)", "expected": "expectedOutput", "visible": false }
  ]
}

IMPORTANT for test cases:
- For JavaScript: "input" should be like "JSON.stringify(functionName(args))" or "functionName(args)" that produces a string output via console.log.
- For Python: "input" should be like "str(function_name(args))" or "function_name(args)" that produces output via print.
- For C++: "input" should be a code snippet that calls the function and prints via cout.
- "expected" must always be a string.`;

  const userMessage = input.includes('\n') || input.length > 100
    ? `Here is code the player wants to practice debugging. Introduce 2-3 subtle bugs into it, then generate the full JSON problem structure for ${langLabel}:\n\n\`\`\`\n${input}\n\`\`\``
    : `Generate a ${langLabel} debugging problem about: "${input}". Create a working function first, then introduce 2-3 subtle bugs into it. Return the full JSON problem structure.`;

  for (const model of MODELS) {
    try {
      const response = await fetch(OPENROUTER_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://codemongus.netlify.app',
          'X-Title': 'CodeMongUs ProblemGen',
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userMessage },
          ],
          max_tokens: 1500,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        console.warn(`⚠️ ProblemGen: Model ${model} returned ${response.status}, trying fallback...`);
        continue;
      }

      const data = await response.json();
      let content = data?.choices?.[0]?.message?.content?.trim();

      if (!content) continue;

      // Strip markdown code fences if the model wraps it
      content = content.replace(/^```(?:json)?\n?/i, '').replace(/\n?```$/i, '').trim();

      const parsed = JSON.parse(content);

      // Validate required fields
      if (!parsed.title || !parsed.starterCode || !parsed.testCases?.length) {
        console.warn(`⚠️ ProblemGen: Model ${model} returned incomplete JSON, trying fallback...`);
        continue;
      }

      console.log(`🧪 Custom problem generated via ${model}: "${parsed.title}"`);
      return { success: true, prompt: parsed };
    } catch (err) {
      console.warn(`⚠️ ProblemGen: Model ${model} failed:`, err.message);
      continue;
    }
  }

  return { success: false, error: 'All AI models failed to generate a problem. Try again.' };
}
