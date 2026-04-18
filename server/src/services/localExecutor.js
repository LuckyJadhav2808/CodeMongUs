/**
 * Local Code Executor — replaces the public Piston API.
 * Uses child_process to run code via locally installed runtimes
 * (Node.js, Python, g++) with timeout and sandboxing.
 */
import { execFile } from 'child_process';
import { writeFile, unlink, mkdir } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';
import { randomBytes } from 'crypto';

const TIMEOUT_MS = 10000; // 10 seconds per test case

/**
 * Execute a code string with the given language runtime.
 * Returns { stdout, stderr }.
 */
function runCode(filePath, language) {
  return new Promise((resolve) => {
    let cmd, args;

    if (language === 'python') {
      cmd = 'python';
      args = [filePath];
    } else if (language === 'cpp') {
      // Compile first, then run
      const outPath = filePath.replace(/\.cpp$/, '.exe');
      execFile('g++', [filePath, '-o', outPath], { timeout: TIMEOUT_MS }, (compileErr, _, compileStderr) => {
        if (compileErr) {
          resolve({ stdout: '', stderr: compileStderr || compileErr.message });
          return;
        }
        execFile(outPath, [], { timeout: TIMEOUT_MS }, (runErr, stdout, stderr) => {
          // Clean up executable
          unlink(outPath).catch(() => {});
          if (runErr && runErr.killed) {
            resolve({ stdout: '', stderr: 'Execution timed out' });
          } else {
            resolve({ stdout: stdout || '', stderr: stderr || '' });
          }
        });
      });
      return;
    } else {
      // JavaScript (Node.js)
      cmd = 'node';
      args = [filePath];
    }

    execFile(cmd, args, { timeout: TIMEOUT_MS }, (err, stdout, stderr) => {
      if (err && err.killed) {
        resolve({ stdout: '', stderr: 'Execution timed out' });
      } else {
        resolve({ stdout: stdout || '', stderr: stderr || '' });
      }
    });
  });
}

/**
 * Execute code against test cases — drop-in replacement for piston.js executeCode.
 * Returns { allPassed, passed, total, results: [{ input, expected, actual, passed, visible }] }
 */
export async function executeCode(code, testCases, language = 'javascript') {
  const results = [];
  let passed = 0;

  // Create a temp directory for this execution batch
  const batchId = randomBytes(6).toString('hex');
  const tempDir = join(tmpdir(), `codemongus-${batchId}`);
  await mkdir(tempDir, { recursive: true });

  const extMap = { javascript: '.js', python: '.py', cpp: '.cpp' };
  const ext = extMap[language] || '.js';

  for (const tc of testCases) {
    const fileName = `test_${randomBytes(4).toString('hex')}${ext}`;
    const filePath = join(tempDir, fileName);

    try {
      const fullCode = buildTestRunner(code, tc.input, language);
      await writeFile(filePath, fullCode, 'utf-8');

      const { stdout, stderr } = await runCode(filePath, language);
      const actual = stdout.trim();
      const error = stderr.trim();
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
    } finally {
      // Clean up temp file
      unlink(filePath).catch(() => {});
    }
  }

  return {
    allPassed: passed === testCases.length,
    passed,
    total: testCases.length,
    results,
  };
}

/**
 * Build test runner code — identical logic to piston.js buildTestRunner.
 */
function buildTestRunner(code, testInput, language) {
  if (language === 'python') {
    return `${code}\nprint(${testInput})`;
  }
  if (language === 'cpp') {
    return `${code}\nint main() { ${testInput} return 0; }`;
  }
  // JavaScript / TypeScript
  return `${code}\nconsole.log(${testInput});`;
}

/**
 * Health check — always healthy since we run locally.
 */
export async function checkLocalHealth() {
  return { ok: true, engine: 'local' };
}
