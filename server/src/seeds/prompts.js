/**
 * Seed script for coding prompts.
 * Run: node src/seeds/prompts.js
 */
import 'dotenv/config';
import { createPrompt } from '../models/Prompt.js';
import '../config/firebase.js';

const PROMPTS = [
  {
    title: 'Sum of Two Numbers',
    description: 'Write a function that takes two numbers and returns their sum.',
    difficulty: 'easy',
    language: 'javascript',
    functionSignature: 'function add(a, b)',
    starterCode: 'function add(a, b) {\n  // Your code here\n}\n',
    testCases: [
      { input: 'add(1, 2)', expected: '3', visible: true },
      { input: 'add(-1, 1)', expected: '0', visible: true },
      { input: 'add(100, 200)', expected: '300', visible: false },
    ],
  },
  {
    title: 'Reverse a String',
    description: 'Write a function that reverses a given string.',
    difficulty: 'easy',
    language: 'javascript',
    functionSignature: 'function reverseString(str)',
    starterCode: 'function reverseString(str) {\n  // Your code here\n}\n',
    testCases: [
      { input: 'reverseString("hello")', expected: 'olleh', visible: true },
      { input: 'reverseString("world")', expected: 'dlrow', visible: true },
      { input: 'reverseString("")', expected: '', visible: false },
    ],
  },
  {
    title: 'FizzBuzz',
    description: 'Write a function that returns "Fizz" for multiples of 3, "Buzz" for multiples of 5, "FizzBuzz" for both, or the number as a string.',
    difficulty: 'easy',
    language: 'javascript',
    functionSignature: 'function fizzBuzz(n)',
    starterCode: 'function fizzBuzz(n) {\n  // Your code here\n}\n',
    testCases: [
      { input: 'fizzBuzz(3)', expected: 'Fizz', visible: true },
      { input: 'fizzBuzz(5)', expected: 'Buzz', visible: true },
      { input: 'fizzBuzz(15)', expected: 'FizzBuzz', visible: true },
      { input: 'fizzBuzz(7)', expected: '7', visible: false },
    ],
  },
  {
    title: 'Palindrome Check',
    description: 'Write a function that checks if a string is a palindrome (reads the same forwards and backwards).',
    difficulty: 'medium',
    language: 'javascript',
    functionSignature: 'function isPalindrome(str)',
    starterCode: 'function isPalindrome(str) {\n  // Your code here\n}\n',
    testCases: [
      { input: 'isPalindrome("racecar")', expected: 'true', visible: true },
      { input: 'isPalindrome("hello")', expected: 'false', visible: true },
      { input: 'isPalindrome("a")', expected: 'true', visible: false },
      { input: 'isPalindrome("")', expected: 'true', visible: false },
    ],
  },
  {
    title: 'Find Maximum in Array',
    description: 'Write a function that finds the maximum value in an array of numbers.',
    difficulty: 'easy',
    language: 'javascript',
    functionSignature: 'function findMax(arr)',
    starterCode: 'function findMax(arr) {\n  // Your code here\n}\n',
    testCases: [
      { input: 'findMax([1, 5, 3, 9, 2])', expected: '9', visible: true },
      { input: 'findMax([-1, -5, -3])', expected: '-1', visible: true },
      { input: 'findMax([42])', expected: '42', visible: false },
    ],
  },
  {
    title: 'Flatten Nested Array',
    description: 'Write a function that flattens a nested array into a single-level array.',
    difficulty: 'hard',
    language: 'javascript',
    functionSignature: 'function flatten(arr)',
    starterCode: 'function flatten(arr) {\n  // Your code here\n}\n',
    testCases: [
      { input: 'JSON.stringify(flatten([1, [2, [3, [4]]], 5]))', expected: '[1,2,3,4,5]', visible: true },
      { input: 'JSON.stringify(flatten([[1, 2], [3, 4]]))', expected: '[1,2,3,4]', visible: true },
      { input: 'JSON.stringify(flatten([]))', expected: '[]', visible: false },
    ],
  },
];

async function seed() {
  console.log('🌱 Seeding coding prompts...');
  for (const prompt of PROMPTS) {
    const result = await createPrompt(prompt);
    console.log(`  ✅ ${result.title || result.id}`);
  }
  console.log(`🌱 Done! Seeded ${PROMPTS.length} prompts.`);
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
