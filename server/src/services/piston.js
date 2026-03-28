import axios from 'axios';

const PISTON_URL = process.env.PISTON_API_URL || 'https://emkc.org/api/v2/piston';

const LANGUAGE_MAP = {
  javascript: { language: 'javascript', version: '18.15.0' },
  python: { language: 'python', version: '3.10.0' },
  typescript: { language: 'typescript', version: '5.0.3' },
};

/**
 * Execute code using Piston API and run test cases.
 * Returns { allPassed, passed, total, results: [{ input, expected, actual, passed }] }
 */
export async function executeCode(code, testCases, language = 'javascript') {
  const lang = LANGUAGE_MAP[language] || LANGUAGE_MAP.javascript;
  const results = [];
  let passed = 0;

  for (const tc of testCases) {
    try {
      // Wrap code + test call to capture output
      const fullCode = buildTestRunner(code, tc.input, language);

      const response = await axios.post(`${PISTON_URL}/execute`, {
        language: lang.language,
        version: lang.version,
        files: [{ content: fullCode }],
        stdin: '',
        args: [],
        compile_timeout: 10000,
        run_timeout: 5000,
      }, { timeout: 15000 });

      const run = response.data.run;
      const actual = (run.stdout || '').trim();
      const error = (run.stderr || '').trim();
      const testPassed = !error && actual === String(tc.expected);

      if (testPassed) passed++;
      results.push({
        input: tc.input,
        expected: String(tc.expected),
        actual: error || actual,
        passed: testPassed,
        visible: tc.visible !== false,
      });
    } catch (err) {
      results.push({
        input: tc.input,
        expected: String(tc.expected),
        actual: `Execution error: ${err.message}`,
        passed: false,
        visible: tc.visible !== false,
      });
    }
  }

  return {
    allPassed: passed === testCases.length,
    passed,
    total: testCases.length,
    results,
  };
}

function buildTestRunner(code, testInput, language) {
  if (language === 'python') {
    return `${code}\nprint(${testInput})`;
  }
  // JavaScript / TypeScript
  return `${code}\nconsole.log(${testInput});`;
}

/**
 * Check if Piston API is reachable.
 */
export async function checkPistonHealth() {
  try {
    const res = await axios.get(`${PISTON_URL}/runtimes`, { timeout: 5000 });
    return { ok: true, runtimes: res.data.length };
  } catch {
    return { ok: false };
  }
}
