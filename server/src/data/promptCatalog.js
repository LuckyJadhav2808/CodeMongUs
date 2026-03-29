/**
 * Built-in prompt catalog — works without Firebase.
 * Each prompt has JS + Python + C++ starter code and test cases.
 */

const PROMPT_CATALOG = [
  // ═══════════════ DSA — Arrays ═══════════════
  {
    id: 'two-sum',
    title: 'Two Sum',
    category: 'DSA — Arrays',
    difficulty: 'easy',
    description: 'Given an array of integers and a target, return the indices of two numbers that add up to the target. You may assume each input has exactly one solution.',
    functionSignature: { javascript: 'function twoSum(nums, target)', python: 'def two_sum(nums, target):', cpp: 'vector<int> twoSum(vector<int>& nums, int target)' },
    starterCode: {
      javascript: '// Return an array of two indices\nfunction twoSum(nums, target) {\n  // Your code here\n}\n',
      python: '# Return a list of two indices\ndef two_sum(nums, target):\n    # Your code here\n    pass\n',
      cpp: '#include <vector>\n#include <iostream>\nusing namespace std;\n\nvector<int> twoSum(vector<int>& nums, int target) {\n    // Your code here\n    return {};\n}\n',
    },
    testCases: [
      { input: { javascript: 'JSON.stringify(twoSum([2,7,11,15], 9))', python: 'str(two_sum([2,7,11,15], 9))', cpp: 'vector<int> v1={2,7,11,15}; auto r=twoSum(v1,9); cout<<r[0]<<","<<r[1];' }, expected: '[0,1]', visible: true },
      { input: { javascript: 'JSON.stringify(twoSum([3,2,4], 6))', python: 'str(two_sum([3,2,4], 6))', cpp: 'vector<int> v2={3,2,4}; auto r2=twoSum(v2,6); cout<<r2[0]<<","<<r2[1];' }, expected: '[1,2]', visible: true },
      { input: { javascript: 'JSON.stringify(twoSum([3,3], 6))', python: 'str(two_sum([3,3], 6))', cpp: 'vector<int> v3={3,3}; auto r3=twoSum(v3,6); cout<<r3[0]<<","<<r3[1];' }, expected: '[0,1]', visible: false },
    ],
  },
  {
    id: 'find-max-subarray',
    title: 'Maximum Subarray Sum',
    category: 'DSA — Arrays',
    difficulty: 'medium',
    description: 'Find the contiguous subarray (containing at least one number) which has the largest sum and return that sum. Use Kadane\'s algorithm for optimal O(n) solution.',
    functionSignature: { javascript: 'function maxSubArray(nums)', python: 'def max_sub_array(nums):', cpp: 'int maxSubArray(vector<int>& nums)' },
    starterCode: {
      javascript: 'function maxSubArray(nums) {\n  // Your code here\n}\n',
      python: 'def max_sub_array(nums):\n    # Your code here\n    pass\n',
      cpp: '#include <vector>\n#include <iostream>\nusing namespace std;\n\nint maxSubArray(vector<int>& nums) {\n    // Your code here\n    return 0;\n}\n',
    },
    testCases: [
      { input: { javascript: 'maxSubArray([-2,1,-3,4,-1,2,1,-5,4])', python: 'max_sub_array([-2,1,-3,4,-1,2,1,-5,4])', cpp: 'vector<int> v={-2,1,-3,4,-1,2,1,-5,4}; cout<<maxSubArray(v);' }, expected: '6', visible: true },
      { input: { javascript: 'maxSubArray([1])', python: 'max_sub_array([1])', cpp: 'vector<int> v={1}; cout<<maxSubArray(v);' }, expected: '1', visible: true },
      { input: { javascript: 'maxSubArray([-1,-2,-3])', python: 'max_sub_array([-1,-2,-3])', cpp: 'vector<int> v={-1,-2,-3}; cout<<maxSubArray(v);' }, expected: '-1', visible: false },
    ],
  },
  {
    id: 'rotate-array',
    title: 'Rotate Array',
    category: 'DSA — Arrays',
    difficulty: 'medium',
    description: 'Given an array, rotate it to the right by k steps. Return the rotated array.',
    functionSignature: { javascript: 'function rotateArray(nums, k)', python: 'def rotate_array(nums, k):', cpp: 'vector<int> rotateArray(vector<int>& nums, int k)' },
    starterCode: {
      javascript: 'function rotateArray(nums, k) {\n  // Return the rotated array\n}\n',
      python: 'def rotate_array(nums, k):\n    # Return the rotated list\n    pass\n',
      cpp: '#include <vector>\n#include <iostream>\nusing namespace std;\n\nvector<int> rotateArray(vector<int>& nums, int k) {\n    // Return the rotated vector\n    return {};\n}\n',
    },
    testCases: [
      { input: { javascript: 'JSON.stringify(rotateArray([1,2,3,4,5,6,7], 3))', python: 'str(rotate_array([1,2,3,4,5,6,7], 3))', cpp: 'vector<int> v={1,2,3,4,5,6,7}; auto r=rotateArray(v,3); for(auto x:r) cout<<x<<",";' }, expected: '[5,6,7,1,2,3,4]', visible: true },
      { input: { javascript: 'JSON.stringify(rotateArray([1,2], 1))', python: 'str(rotate_array([1,2], 1))', cpp: 'vector<int> v={1,2}; auto r=rotateArray(v,1); for(auto x:r) cout<<x<<",";' }, expected: '[2,1]', visible: true },
      { input: { javascript: 'JSON.stringify(rotateArray([1], 5))', python: 'str(rotate_array([1], 5))', cpp: 'vector<int> v={1}; auto r=rotateArray(v,5); for(auto x:r) cout<<x<<",";' }, expected: '[1]', visible: false },
    ],
  },

  // ═══════════════ DSA — Strings ═══════════════
  {
    id: 'reverse-string',
    title: 'Reverse a String',
    category: 'DSA — Strings',
    difficulty: 'easy',
    description: 'Write a function that reverses the characters in a given string.',
    functionSignature: { javascript: 'function reverseString(str)', python: 'def reverse_string(s):', cpp: 'string reverseString(string s)' },
    starterCode: {
      javascript: 'function reverseString(str) {\n  // Your code here\n}\n',
      python: 'def reverse_string(s):\n    # Your code here\n    pass\n',
      cpp: '#include <string>\n#include <iostream>\nusing namespace std;\n\nstring reverseString(string s) {\n    // Your code here\n    return "";\n}\n',
    },
    testCases: [
      { input: { javascript: 'reverseString("hello")', python: 'reverse_string("hello")', cpp: 'cout<<reverseString("hello");' }, expected: 'olleh', visible: true },
      { input: { javascript: 'reverseString("world")', python: 'reverse_string("world")', cpp: 'cout<<reverseString("world");' }, expected: 'dlrow', visible: true },
      { input: { javascript: 'reverseString("")', python: 'reverse_string("")', cpp: 'cout<<reverseString("");' }, expected: '', visible: false },
    ],
  },
  {
    id: 'palindrome-check',
    title: 'Palindrome Check',
    category: 'DSA — Strings',
    difficulty: 'easy',
    description: 'Check if a string is a palindrome (reads the same forwards and backwards). Ignore case.',
    functionSignature: { javascript: 'function isPalindrome(str)', python: 'def is_palindrome(s):', cpp: 'bool isPalindrome(string s)' },
    starterCode: {
      javascript: 'function isPalindrome(str) {\n  // Return true or false\n}\n',
      python: 'def is_palindrome(s):\n    # Return True or False\n    pass\n',
      cpp: '#include <string>\n#include <iostream>\n#include <algorithm>\nusing namespace std;\n\nbool isPalindrome(string s) {\n    // Return true or false\n    return false;\n}\n',
    },
    testCases: [
      { input: { javascript: 'isPalindrome("racecar")', python: 'is_palindrome("racecar")', cpp: 'cout<<(isPalindrome("racecar")?"true":"false");' }, expected: 'true', visible: true },
      { input: { javascript: 'isPalindrome("hello")', python: 'is_palindrome("hello")', cpp: 'cout<<(isPalindrome("hello")?"true":"false");' }, expected: 'false', visible: true },
      { input: { javascript: 'isPalindrome("a")', python: 'is_palindrome("a")', cpp: 'cout<<(isPalindrome("a")?"true":"false");' }, expected: 'true', visible: false },
    ],
  },
  {
    id: 'anagram-check',
    title: 'Anagram Check',
    category: 'DSA — Strings',
    difficulty: 'medium',
    description: 'Given two strings, check if one is an anagram of the other (same characters, different order). Ignore case and spaces.',
    functionSignature: { javascript: 'function isAnagram(a, b)', python: 'def is_anagram(a, b):', cpp: 'bool isAnagram(string a, string b)' },
    starterCode: {
      javascript: 'function isAnagram(a, b) {\n  // Return true or false\n}\n',
      python: 'def is_anagram(a, b):\n    # Return True or False\n    pass\n',
      cpp: '#include <string>\n#include <iostream>\n#include <algorithm>\nusing namespace std;\n\nbool isAnagram(string a, string b) {\n    // Return true or false\n    return false;\n}\n',
    },
    testCases: [
      { input: { javascript: 'isAnagram("listen", "silent")', python: 'is_anagram("listen", "silent")', cpp: 'cout<<(isAnagram("listen","silent")?"true":"false");' }, expected: 'true', visible: true },
      { input: { javascript: 'isAnagram("hello", "world")', python: 'is_anagram("hello", "world")', cpp: 'cout<<(isAnagram("hello","world")?"true":"false");' }, expected: 'false', visible: true },
      { input: { javascript: 'isAnagram("Astronomer", "Moon starer")', python: 'is_anagram("Astronomer", "Moon starer")', cpp: 'cout<<(isAnagram("Astronomer","Moon starer")?"true":"false");' }, expected: 'true', visible: false },
    ],
  },

  // ═══════════════ DSA — Sorting ═══════════════
  {
    id: 'bubble-sort',
    title: 'Bubble Sort',
    category: 'DSA — Sorting',
    difficulty: 'easy',
    description: 'Implement the bubble sort algorithm. Return the sorted array in ascending order.',
    functionSignature: { javascript: 'function bubbleSort(arr)', python: 'def bubble_sort(arr):', cpp: 'vector<int> bubbleSort(vector<int> arr)' },
    starterCode: {
      javascript: 'function bubbleSort(arr) {\n  // Sort in-place and return\n}\n',
      python: 'def bubble_sort(arr):\n    # Sort and return\n    pass\n',
      cpp: '#include <vector>\n#include <iostream>\nusing namespace std;\n\nvector<int> bubbleSort(vector<int> arr) {\n    // Sort and return\n    return arr;\n}\n',
    },
    testCases: [
      { input: { javascript: 'JSON.stringify(bubbleSort([5,3,8,1,2]))', python: 'str(bubble_sort([5,3,8,1,2]))', cpp: 'auto r=bubbleSort({5,3,8,1,2}); for(auto x:r) cout<<x<<",";' }, expected: '[1,2,3,5,8]', visible: true },
      { input: { javascript: 'JSON.stringify(bubbleSort([1]))', python: 'str(bubble_sort([1]))', cpp: 'auto r=bubbleSort({1}); for(auto x:r) cout<<x<<",";' }, expected: '[1]', visible: true },
      { input: { javascript: 'JSON.stringify(bubbleSort([3,3,1,1,2]))', python: 'str(bubble_sort([3,3,1,1,2]))', cpp: 'auto r=bubbleSort({3,3,1,1,2}); for(auto x:r) cout<<x<<",";' }, expected: '[1,1,2,3,3]', visible: false },
    ],
  },
  {
    id: 'merge-sort',
    title: 'Merge Sort',
    category: 'DSA — Sorting',
    difficulty: 'hard',
    description: 'Implement the merge sort algorithm using the divide-and-conquer approach. Return the sorted array.',
    functionSignature: { javascript: 'function mergeSort(arr)', python: 'def merge_sort(arr):', cpp: 'vector<int> mergeSort(vector<int> arr)' },
    starterCode: {
      javascript: 'function mergeSort(arr) {\n  // Divide, conquer, merge\n}\n',
      python: 'def merge_sort(arr):\n    # Divide, conquer, merge\n    pass\n',
      cpp: '#include <vector>\n#include <iostream>\nusing namespace std;\n\nvector<int> mergeSort(vector<int> arr) {\n    // Divide, conquer, merge\n    return arr;\n}\n',
    },
    testCases: [
      { input: { javascript: 'JSON.stringify(mergeSort([38,27,43,3,9,82,10]))', python: 'str(merge_sort([38,27,43,3,9,82,10]))', cpp: 'auto r=mergeSort({38,27,43,3,9,82,10}); for(auto x:r) cout<<x<<",";' }, expected: '[3,9,10,27,38,43,82]', visible: true },
      { input: { javascript: 'JSON.stringify(mergeSort([5,1]))', python: 'str(merge_sort([5,1]))', cpp: 'auto r=mergeSort({5,1}); for(auto x:r) cout<<x<<",";' }, expected: '[1,5]', visible: true },
      { input: { javascript: 'JSON.stringify(mergeSort([]))', python: 'str(merge_sort([]))', cpp: 'auto r=mergeSort({}); cout<<r.size();' }, expected: '[]', visible: false },
    ],
  },

  // ═══════════════ DSA — Searching ═══════════════
  {
    id: 'binary-search',
    title: 'Binary Search',
    category: 'DSA — Searching',
    difficulty: 'medium',
    description: 'Implement binary search on a sorted array. Return the index of the target, or -1 if not found.',
    functionSignature: { javascript: 'function binarySearch(arr, target)', python: 'def binary_search(arr, target):', cpp: 'int binarySearch(vector<int>& arr, int target)' },
    starterCode: {
      javascript: 'function binarySearch(arr, target) {\n  // Return index or -1\n}\n',
      python: 'def binary_search(arr, target):\n    # Return index or -1\n    pass\n',
      cpp: '#include <vector>\n#include <iostream>\nusing namespace std;\n\nint binarySearch(vector<int>& arr, int target) {\n    // Return index or -1\n    return -1;\n}\n',
    },
    testCases: [
      { input: { javascript: 'binarySearch([1,3,5,7,9,11], 7)', python: 'binary_search([1,3,5,7,9,11], 7)', cpp: 'vector<int> v={1,3,5,7,9,11}; cout<<binarySearch(v,7);' }, expected: '3', visible: true },
      { input: { javascript: 'binarySearch([1,3,5,7,9,11], 4)', python: 'binary_search([1,3,5,7,9,11], 4)', cpp: 'vector<int> v={1,3,5,7,9,11}; cout<<binarySearch(v,4);' }, expected: '-1', visible: true },
      { input: { javascript: 'binarySearch([2], 2)', python: 'binary_search([2], 2)', cpp: 'vector<int> v={2}; cout<<binarySearch(v,2);' }, expected: '0', visible: false },
    ],
  },
  {
    id: 'linear-search',
    title: 'Linear Search',
    category: 'DSA — Searching',
    difficulty: 'easy',
    description: 'Implement linear search. Return the index of the first occurrence of the target, or -1 if not found.',
    functionSignature: { javascript: 'function linearSearch(arr, target)', python: 'def linear_search(arr, target):', cpp: 'int linearSearch(vector<int>& arr, int target)' },
    starterCode: {
      javascript: 'function linearSearch(arr, target) {\n  // Return index or -1\n}\n',
      python: 'def linear_search(arr, target):\n    # Return index or -1\n    pass\n',
      cpp: '#include <vector>\n#include <iostream>\nusing namespace std;\n\nint linearSearch(vector<int>& arr, int target) {\n    // Return index or -1\n    return -1;\n}\n',
    },
    testCases: [
      { input: { javascript: 'linearSearch([4,2,7,1,9], 7)', python: 'linear_search([4,2,7,1,9], 7)', cpp: 'vector<int> v={4,2,7,1,9}; cout<<linearSearch(v,7);' }, expected: '2', visible: true },
      { input: { javascript: 'linearSearch([4,2,7,1,9], 5)', python: 'linear_search([4,2,7,1,9], 5)', cpp: 'vector<int> v={4,2,7,1,9}; cout<<linearSearch(v,5);' }, expected: '-1', visible: true },
      { input: { javascript: 'linearSearch([], 1)', python: 'linear_search([], 1)', cpp: 'vector<int> v={}; cout<<linearSearch(v,1);' }, expected: '-1', visible: false },
    ],
  },

  // ═══════════════ DSA — Linked List ═══════════════
  {
    id: 'reverse-linked-list',
    title: 'Reverse Linked List (Array Sim)',
    category: 'DSA — Linked List',
    difficulty: 'medium',
    description: 'Given an array representing linked list values, reverse the array (simulating reversing a linked list). Return the reversed array.',
    functionSignature: { javascript: 'function reverseList(arr)', python: 'def reverse_list(arr):', cpp: 'vector<int> reverseList(vector<int> arr)' },
    starterCode: {
      javascript: 'function reverseList(arr) {\n  // Reverse the array\n}\n',
      python: 'def reverse_list(arr):\n    # Reverse the list\n    pass\n',
      cpp: '#include <vector>\n#include <iostream>\n#include <algorithm>\nusing namespace std;\n\nvector<int> reverseList(vector<int> arr) {\n    // Reverse the vector\n    return arr;\n}\n',
    },
    testCases: [
      { input: { javascript: 'JSON.stringify(reverseList([1,2,3,4,5]))', python: 'str(reverse_list([1,2,3,4,5]))', cpp: 'auto r=reverseList({1,2,3,4,5}); for(auto x:r) cout<<x<<",";' }, expected: '[5,4,3,2,1]', visible: true },
      { input: { javascript: 'JSON.stringify(reverseList([1]))', python: 'str(reverse_list([1]))', cpp: 'auto r=reverseList({1}); for(auto x:r) cout<<x<<",";' }, expected: '[1]', visible: true },
      { input: { javascript: 'JSON.stringify(reverseList([]))', python: 'str(reverse_list([]))', cpp: 'auto r=reverseList({}); cout<<r.size();' }, expected: '[]', visible: false },
    ],
  },

  // ═══════════════ General ═══════════════
  {
    id: 'fizzbuzz',
    title: 'FizzBuzz',
    category: 'General',
    difficulty: 'easy',
    description: 'Return "Fizz" for multiples of 3, "Buzz" for multiples of 5, "FizzBuzz" for both, or the number as a string.',
    functionSignature: { javascript: 'function fizzBuzz(n)', python: 'def fizz_buzz(n):', cpp: 'string fizzBuzz(int n)' },
    starterCode: {
      javascript: 'function fizzBuzz(n) {\n  // Your code here\n}\n',
      python: 'def fizz_buzz(n):\n    # Your code here\n    pass\n',
      cpp: '#include <string>\n#include <iostream>\nusing namespace std;\n\nstring fizzBuzz(int n) {\n    // Your code here\n    return "";\n}\n',
    },
    testCases: [
      { input: { javascript: 'fizzBuzz(3)', python: 'fizz_buzz(3)', cpp: 'cout<<fizzBuzz(3);' }, expected: 'Fizz', visible: true },
      { input: { javascript: 'fizzBuzz(5)', python: 'fizz_buzz(5)', cpp: 'cout<<fizzBuzz(5);' }, expected: 'Buzz', visible: true },
      { input: { javascript: 'fizzBuzz(15)', python: 'fizz_buzz(15)', cpp: 'cout<<fizzBuzz(15);' }, expected: 'FizzBuzz', visible: true },
      { input: { javascript: 'String(fizzBuzz(7))', python: 'str(fizz_buzz(7))', cpp: 'cout<<fizzBuzz(7);' }, expected: '7', visible: false },
    ],
  },
  {
    id: 'fibonacci',
    title: 'Fibonacci Number',
    category: 'General',
    difficulty: 'easy',
    description: 'Return the nth Fibonacci number. F(0)=0, F(1)=1, F(n)=F(n-1)+F(n-2).',
    functionSignature: { javascript: 'function fibonacci(n)', python: 'def fibonacci(n):', cpp: 'int fibonacci(int n)' },
    starterCode: {
      javascript: 'function fibonacci(n) {\n  // Return the nth Fibonacci number\n}\n',
      python: 'def fibonacci(n):\n    # Return the nth Fibonacci number\n    pass\n',
      cpp: '#include <iostream>\nusing namespace std;\n\nint fibonacci(int n) {\n    // Return the nth Fibonacci number\n    return 0;\n}\n',
    },
    testCases: [
      { input: { javascript: 'fibonacci(0)', python: 'fibonacci(0)', cpp: 'cout<<fibonacci(0);' }, expected: '0', visible: true },
      { input: { javascript: 'fibonacci(1)', python: 'fibonacci(1)', cpp: 'cout<<fibonacci(1);' }, expected: '1', visible: true },
      { input: { javascript: 'fibonacci(10)', python: 'fibonacci(10)', cpp: 'cout<<fibonacci(10);' }, expected: '55', visible: false },
    ],
  },
  {
    id: 'factorial',
    title: 'Factorial',
    category: 'General',
    difficulty: 'easy',
    description: 'Return the factorial of n (n!). 0! = 1.',
    functionSignature: { javascript: 'function factorial(n)', python: 'def factorial(n):', cpp: 'long long factorial(int n)' },
    starterCode: {
      javascript: 'function factorial(n) {\n  // Return n!\n}\n',
      python: 'def factorial(n):\n    # Return n!\n    pass\n',
      cpp: '#include <iostream>\nusing namespace std;\n\nlong long factorial(int n) {\n    // Return n!\n    return 0;\n}\n',
    },
    testCases: [
      { input: { javascript: 'factorial(5)', python: 'factorial(5)', cpp: 'cout<<factorial(5);' }, expected: '120', visible: true },
      { input: { javascript: 'factorial(0)', python: 'factorial(0)', cpp: 'cout<<factorial(0);' }, expected: '1', visible: true },
      { input: { javascript: 'factorial(10)', python: 'factorial(10)', cpp: 'cout<<factorial(10);' }, expected: '3628800', visible: false },
    ],
  },

  // ═══════════════ Hard ═══════════════
  {
    id: 'flatten-array',
    title: 'Flatten Nested Array',
    category: 'Hard',
    difficulty: 'hard',
    description: 'Write a function that flattens a deeply nested array into a single-level array.',
    functionSignature: { javascript: 'function flatten(arr)', python: 'def flatten(arr):', cpp: 'vector<int> flatten(vector<vector<int>>& arr)' },
    starterCode: {
      javascript: 'function flatten(arr) {\n  // Flatten deeply nested array\n}\n',
      python: 'def flatten(arr):\n    # Flatten deeply nested list\n    pass\n',
      cpp: '#include <vector>\n#include <iostream>\nusing namespace std;\n\n// For C++ we use a simple 2D flatten\nvector<int> flatten(vector<vector<int>>& arr) {\n    vector<int> result;\n    // Flatten and return\n    return result;\n}\n',
    },
    testCases: [
      { input: { javascript: 'JSON.stringify(flatten([1,[2,[3,[4]]],5]))', python: 'str(flatten([1,[2,[3,[4]]],5]))', cpp: 'vector<vector<int>> v={{1,2},{3,4},{5}}; auto r=flatten(v); for(auto x:r) cout<<x<<",";' }, expected: '[1,2,3,4,5]', visible: true },
      { input: { javascript: 'JSON.stringify(flatten([[1,2],[3,4]]))', python: 'str(flatten([[1,2],[3,4]]))', cpp: 'vector<vector<int>> v={{1,2},{3,4}}; auto r=flatten(v); for(auto x:r) cout<<x<<",";' }, expected: '[1,2,3,4]', visible: true },
      { input: { javascript: 'JSON.stringify(flatten([]))', python: 'str(flatten([]))', cpp: 'vector<vector<int>> v={}; auto r=flatten(v); cout<<r.size();' }, expected: '[]', visible: false },
    ],
  },
  {
    id: 'debounce',
    title: 'Debounce Function',
    category: 'Hard',
    difficulty: 'hard',
    description: 'Implement a debounce function that delays invoking the provided function until after `wait` milliseconds have elapsed since the last invocation. Return the debounced function.',
    functionSignature: { javascript: 'function debounce(fn, wait)', python: 'def debounce(fn, wait):', cpp: 'function<void()> debounce(function<void()> fn, int waitMs)' },
    starterCode: {
      javascript: 'function debounce(fn, wait) {\n  // Return a debounced version of fn\n}\n',
      python: 'import time\nimport threading\n\ndef debounce(fn, wait):\n    # Return a debounced version of fn\n    pass\n',
      cpp: '#include <functional>\n#include <chrono>\n#include <iostream>\nusing namespace std;\n\n// Return a debounced version of fn\nfunction<void()> debounce(function<void()> fn, int waitMs) {\n    // Your code here\n    return fn;\n}\n',
    },
    testCases: [
      { input: { javascript: 'typeof debounce(() => {}, 100)', python: 'callable(debounce(lambda: None, 100))', cpp: 'auto d=debounce([](){},100); cout<<"function";' }, expected: 'function', visible: true },
    ],
  },
];

/**
 * Get a prompt by ID.
 */
export function getPromptById(id) {
  return PROMPT_CATALOG.find(p => p.id === id) || null;
}

/**
 * Get a random prompt, optionally filtered by difficulty.
 */
export function getRandomCatalogPrompt(difficulty = null) {
  let pool = PROMPT_CATALOG;
  if (difficulty) pool = pool.filter(p => p.difficulty === difficulty);
  if (pool.length === 0) pool = PROMPT_CATALOG;
  return pool[Math.floor(Math.random() * pool.length)];
}

/**
 * Get the full catalog for frontend display (lightweight — no starter code or test cases).
 */
export function getCatalogList() {
  return PROMPT_CATALOG.map(p => ({
    id: p.id,
    title: p.title,
    category: p.category,
    difficulty: p.difficulty,
    description: p.description,
    languages: Object.keys(p.starterCode),
  }));
}

/**
 * Resolve a prompt for a game — returns the full prompt shaped for a specific language.
 */
export function resolvePromptForGame(promptId, language = 'javascript') {
  const prompt = promptId === 'random'
    ? getRandomCatalogPrompt()
    : getPromptById(promptId);

  if (!prompt) return null;

  return {
    id: prompt.id,
    title: prompt.title,
    category: prompt.category,
    difficulty: prompt.difficulty,
    description: prompt.description,
    language,
    functionSignature: prompt.functionSignature[language] || prompt.functionSignature.javascript,
    starterCode: prompt.starterCode[language] || prompt.starterCode.javascript,
    testCases: prompt.testCases.map(tc => ({
      input: tc.input[language] || tc.input.javascript,
      expected: tc.expected,
      visible: tc.visible,
    })),
  };
}

export default PROMPT_CATALOG;
