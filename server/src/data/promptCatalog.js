/**
 * Built-in prompt catalog — works without Firebase.
 * Each prompt has JS + Python + C++ starter code WITH INTENTIONAL BUGS.
 * Crewmates must DEBUG the code, not write from scratch.
 * Hints are hidden and unlockable — they do NOT appear in the code.
 */

const PROMPT_CATALOG = [
  {
    id: 'two-sum',
    title: 'Two Sum',
    category: 'DSA — Arrays',
    difficulty: 'easy',
    description: 'Given an array of integers and a target, return the indices of two numbers that add up to the target. The code below has bugs — fix them!',
    hints: [
      'Check the loop boundary — are you iterating too far?',
      'How do you find a complement? Think about subtraction.',
      'What should the return value contain — raw values or stored indices?',
    ],
    functionSignature: { javascript: 'function twoSum(nums, target)', python: 'def two_sum(nums, target):', cpp: 'vector<int> twoSum(vector<int>& nums, int target)' },
    starterCode: {
      javascript: '// 🐛 This code has bugs! Fix them to pass the tests.\nfunction twoSum(nums, target) {\n  const map = {};\n  for (let i = 0; i <= nums.length; i++) {\n    const complement = target + nums[i];\n    if (map[complement] !== undefined) {\n      return [complement, i];\n    }\n    map[nums[i]] = i;\n  }\n  return [];\n}\n',
      python: '# 🐛 This code has bugs! Fix them to pass the tests.\ndef two_sum(nums, target):\n    lookup = {}\n    for i in range(len(nums) + 1):\n        complement = target + nums[i]\n        if complement in lookup:\n            return [complement, i]\n        lookup[nums[i]] = i\n    return []\n',
      cpp: '#include <vector>\n#include <unordered_map>\n#include <iostream>\nusing namespace std;\n\nvector<int> twoSum(vector<int>& nums, int target) {\n    unordered_map<int,int> mp;\n    for (int i = 0; i <= nums.size(); i++) {\n        int complement = target + nums[i];\n        if (mp.count(complement)) {\n            return {complement, i};\n        }\n        mp[nums[i]] = i;\n    }\n    return {};\n}\n',
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
    description: 'Find the contiguous subarray with the largest sum. The code below has bugs — fix them!',
    hints: [
      'What should maxSum be initialized to for arrays with all negative numbers?',
      'When should you reset currentSum — when it helps or hurts?',
      'Think about what happens when currentSum drops below zero.',
    ],
    functionSignature: { javascript: 'function maxSubArray(nums)', python: 'def max_sub_array(nums):', cpp: 'int maxSubArray(vector<int>& nums)' },
    starterCode: {
      javascript: '// 🐛 This code has bugs! Fix them to pass the tests.\nfunction maxSubArray(nums) {\n  let maxSum = 0;\n  let currentSum = 0;\n  for (let i = 0; i < nums.length; i++) {\n    currentSum = currentSum + nums[i];\n    if (currentSum > maxSum) {\n      maxSum = currentSum;\n    }\n    if (currentSum > 0) {\n      currentSum = 0;\n    }\n  }\n  return maxSum;\n}\n',
      python: '# 🐛 This code has bugs! Fix them to pass the tests.\ndef max_sub_array(nums):\n    max_sum = 0\n    current_sum = 0\n    for num in nums:\n        current_sum = current_sum + num\n        if current_sum > max_sum:\n            max_sum = current_sum\n        if current_sum > 0:\n            current_sum = 0\n    return max_sum\n',
      cpp: '#include <vector>\n#include <iostream>\n#include <climits>\nusing namespace std;\n\nint maxSubArray(vector<int>& nums) {\n    int maxSum = 0;\n    int currentSum = 0;\n    for (int i = 0; i < nums.size(); i++) {\n        currentSum += nums[i];\n        if (currentSum > maxSum) maxSum = currentSum;\n        if (currentSum > 0) currentSum = 0;\n    }\n    return maxSum;\n}\n',
    },
    testCases: [
      { input: { javascript: 'maxSubArray([-2,1,-3,4,-1,2,1,-5,4])', python: 'max_sub_array([-2,1,-3,4,-1,2,1,-5,4])', cpp: 'vector<int> v={-2,1,-3,4,-1,2,1,-5,4}; cout<<maxSubArray(v);' }, expected: '6', visible: true },
      { input: { javascript: 'maxSubArray([1])', python: 'max_sub_array([1])', cpp: 'vector<int> v={1}; cout<<maxSubArray(v);' }, expected: '1', visible: true },
      { input: { javascript: 'maxSubArray([-1,-2,-3])', python: 'max_sub_array([-1,-2,-3])', cpp: 'vector<int> v={-1,-2,-3}; cout<<maxSubArray(v);' }, expected: '-1', visible: false },
    ],
  },
  {
    id: 'reverse-string',
    title: 'Reverse a String',
    category: 'DSA — Strings',
    difficulty: 'easy',
    description: 'Reverse the characters in a string. The code below has bugs — fix them!',
    hints: [
      'What is the last valid index of a string of length n?',
      'Check the starting index of your loop carefully.',
      'Accessing an index equal to the length gives undefined.',
    ],
    functionSignature: { javascript: 'function reverseString(str)', python: 'def reverse_string(s):', cpp: 'string reverseString(string s)' },
    starterCode: {
      javascript: '// 🐛 This code has bugs! Fix them to pass the tests.\nfunction reverseString(str) {\n  let result = "";\n  for (let i = str.length; i >= 0; i--) {\n    result += str[i];\n  }\n  return result;\n}\n',
      python: '# 🐛 This code has bugs! Fix them to pass the tests.\ndef reverse_string(s):\n    result = ""\n    for i in range(len(s), -1, -1):\n        result += s[i]\n    return result\n',
      cpp: '#include <string>\n#include <iostream>\nusing namespace std;\n\nstring reverseString(string s) {\n    string result = "";\n    for (int i = s.length(); i >= 0; i--) {\n        result += s[i];\n    }\n    return result;\n}\n',
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
    description: 'Check if a string is a palindrome (ignore case). The code below has bugs — fix them!',
    hints: [
      'Are you handling uppercase vs lowercase letters?',
      'Try converting the string before comparing.',
      'What does case-insensitive mean for the comparison?',
    ],
    functionSignature: { javascript: 'function isPalindrome(str)', python: 'def is_palindrome(s):', cpp: 'bool isPalindrome(string s)' },
    starterCode: {
      javascript: '// 🐛 This code has bugs! Fix them to pass the tests.\nfunction isPalindrome(str) {\n  const reversed = str.split("").reverse().join("");\n  return str == reversed;\n}\n',
      python: '# 🐛 This code has bugs! Fix them to pass the tests.\ndef is_palindrome(s):\n    return s == s[::-1]\n',
      cpp: '#include <string>\n#include <iostream>\n#include <algorithm>\nusing namespace std;\n\nbool isPalindrome(string s) {\n    string rev = s;\n    reverse(rev.begin(), rev.end());\n    return s == rev;\n}\n',
    },
    testCases: [
      { input: { javascript: 'isPalindrome("racecar")', python: 'is_palindrome("racecar")', cpp: 'cout<<(isPalindrome("racecar")?"true":"false");' }, expected: 'true', visible: true },
      { input: { javascript: 'isPalindrome("hello")', python: 'is_palindrome("hello")', cpp: 'cout<<(isPalindrome("hello")?"true":"false");' }, expected: 'false', visible: true },
      { input: { javascript: 'isPalindrome("RaceCar")', python: 'is_palindrome("RaceCar")', cpp: 'cout<<(isPalindrome("RaceCar")?"true":"false");' }, expected: 'true', visible: false },
    ],
  },
  {
    id: 'bubble-sort',
    title: 'Bubble Sort',
    category: 'DSA — Sorting',
    difficulty: 'easy',
    description: 'Implement bubble sort. The code below has bugs — fix them!',
    hints: [
      'The inner loop should not go all the way to the end every pass.',
      'Which direction should the comparison go for ascending order?',
      'Think about what > vs < means for swapping neighbors.',
    ],
    functionSignature: { javascript: 'function bubbleSort(arr)', python: 'def bubble_sort(arr):', cpp: 'vector<int> bubbleSort(vector<int> arr)' },
    starterCode: {
      javascript: '// 🐛 This code has bugs! Fix them to pass the tests.\nfunction bubbleSort(arr) {\n  const n = arr.length;\n  for (let i = 0; i < n; i++) {\n    for (let j = 0; j < n; j++) {\n      if (arr[j] < arr[j + 1]) {\n        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];\n      }\n    }\n  }\n  return arr;\n}\n',
      python: '# 🐛 This code has bugs! Fix them to pass the tests.\ndef bubble_sort(arr):\n    n = len(arr)\n    for i in range(n):\n        for j in range(n):\n            if arr[j] < arr[j + 1]:\n                arr[j], arr[j + 1] = arr[j + 1], arr[j]\n    return arr\n',
      cpp: '#include <vector>\n#include <iostream>\nusing namespace std;\n\nvector<int> bubbleSort(vector<int> arr) {\n    int n = arr.size();\n    for (int i = 0; i < n; i++) {\n        for (int j = 0; j < n; j++) {\n            if (arr[j] < arr[j+1]) {\n                swap(arr[j], arr[j+1]);\n            }\n        }\n    }\n    return arr;\n}\n',
    },
    testCases: [
      { input: { javascript: 'JSON.stringify(bubbleSort([5,3,8,1,2]))', python: 'str(bubble_sort([5,3,8,1,2]))', cpp: 'auto r=bubbleSort({5,3,8,1,2}); for(auto x:r) cout<<x<<",";' }, expected: '[1,2,3,5,8]', visible: true },
      { input: { javascript: 'JSON.stringify(bubbleSort([1]))', python: 'str(bubble_sort([1]))', cpp: 'auto r=bubbleSort({1}); for(auto x:r) cout<<x<<",";' }, expected: '[1]', visible: true },
      { input: { javascript: 'JSON.stringify(bubbleSort([3,3,1,1,2]))', python: 'str(bubble_sort([3,3,1,1,2]))', cpp: 'auto r=bubbleSort({3,3,1,1,2}); for(auto x:r) cout<<x<<",";' }, expected: '[1,1,2,3,3]', visible: false },
    ],
  },
  {
    id: 'binary-search',
    title: 'Binary Search',
    category: 'DSA — Searching',
    difficulty: 'medium',
    description: 'Implement binary search. The code below has bugs — fix them!',
    hints: [
      'What should "high" be initialized to?',
      'Should the while condition use < or <=?',
      'After comparing, how should low and high update relative to mid?',
    ],
    functionSignature: { javascript: 'function binarySearch(arr, target)', python: 'def binary_search(arr, target):', cpp: 'int binarySearch(vector<int>& arr, int target)' },
    starterCode: {
      javascript: '// 🐛 This code has bugs! Fix them to pass the tests.\nfunction binarySearch(arr, target) {\n  let low = 0;\n  let high = arr.length;\n  while (low < high) {\n    const mid = Math.floor((low + high) / 2);\n    if (arr[mid] === target) return mid;\n    if (arr[mid] < target) low = mid;\n    else high = mid;\n  }\n  return -1;\n}\n',
      python: '# 🐛 This code has bugs! Fix them to pass the tests.\ndef binary_search(arr, target):\n    low = 0\n    high = len(arr)\n    while low < high:\n        mid = (low + high) // 2\n        if arr[mid] == target:\n            return mid\n        if arr[mid] < target:\n            low = mid\n        else:\n            high = mid\n    return -1\n',
      cpp: '#include <vector>\n#include <iostream>\nusing namespace std;\n\nint binarySearch(vector<int>& arr, int target) {\n    int low = 0;\n    int high = arr.size();\n    while (low < high) {\n        int mid = (low + high) / 2;\n        if (arr[mid] == target) return mid;\n        if (arr[mid] < target) low = mid;\n        else high = mid;\n    }\n    return -1;\n}\n',
    },
    testCases: [
      { input: { javascript: 'binarySearch([1,3,5,7,9,11], 7)', python: 'binary_search([1,3,5,7,9,11], 7)', cpp: 'vector<int> v={1,3,5,7,9,11}; cout<<binarySearch(v,7);' }, expected: '3', visible: true },
      { input: { javascript: 'binarySearch([1,3,5,7,9,11], 4)', python: 'binary_search([1,3,5,7,9,11], 4)', cpp: 'vector<int> v={1,3,5,7,9,11}; cout<<binarySearch(v,4);' }, expected: '-1', visible: true },
      { input: { javascript: 'binarySearch([2], 2)', python: 'binary_search([2], 2)', cpp: 'vector<int> v={2}; cout<<binarySearch(v,2);' }, expected: '0', visible: false },
    ],
  },
  {
    id: 'fizzbuzz',
    title: 'FizzBuzz',
    category: 'General',
    difficulty: 'easy',
    description: 'Return "Fizz"/"Buzz"/"FizzBuzz" or the number as string. The code below has bugs — fix them!',
    hints: [
      'The order of your if-checks matters — which divisibility should you test first?',
      'If a number is divisible by both 3 and 5, which branch runs?',
      'The return type should always be a string.',
    ],
    functionSignature: { javascript: 'function fizzBuzz(n)', python: 'def fizz_buzz(n):', cpp: 'string fizzBuzz(int n)' },
    starterCode: {
      javascript: '// 🐛 This code has bugs! Fix them to pass the tests.\nfunction fizzBuzz(n) {\n  if (n % 3 === 0) return "Fizz";\n  if (n % 5 === 0) return "Buzz";\n  if (n % 15 === 0) return "FizzBuzz";\n  return n;\n}\n',
      python: '# 🐛 This code has bugs! Fix them to pass the tests.\ndef fizz_buzz(n):\n    if n % 3 == 0:\n        return "Fizz"\n    if n % 5 == 0:\n        return "Buzz"\n    if n % 15 == 0:\n        return "FizzBuzz"\n    return n\n',
      cpp: '#include <string>\n#include <iostream>\nusing namespace std;\n\nstring fizzBuzz(int n) {\n    if (n % 3 == 0) return "Fizz";\n    if (n % 5 == 0) return "Buzz";\n    if (n % 15 == 0) return "FizzBuzz";\n    return to_string(n);\n}\n',
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
    description: 'Return the nth Fibonacci number. The code below has bugs — fix them!',
    hints: [
      'What is F(0)? Make sure the base case returns the right value.',
      'Check the initial values of your two tracking variables.',
      'Does your loop run enough iterations?',
    ],
    functionSignature: { javascript: 'function fibonacci(n)', python: 'def fibonacci(n):', cpp: 'int fibonacci(int n)' },
    starterCode: {
      javascript: '// 🐛 This code has bugs! Fix them to pass the tests.\nfunction fibonacci(n) {\n  if (n <= 0) return 1;\n  if (n === 1) return 1;\n  let a = 1, b = 1;\n  for (let i = 2; i < n; i++) {\n    const temp = a + b;\n    a = b;\n    b = temp;\n  }\n  return b;\n}\n',
      python: '# 🐛 This code has bugs! Fix them to pass the tests.\ndef fibonacci(n):\n    if n <= 0:\n        return 1\n    if n == 1:\n        return 1\n    a, b = 1, 1\n    for i in range(2, n):\n        a, b = b, a + b\n    return b\n',
      cpp: '#include <iostream>\nusing namespace std;\n\nint fibonacci(int n) {\n    if (n <= 0) return 1;\n    if (n == 1) return 1;\n    int a = 1, b = 1;\n    for (int i = 2; i < n; i++) {\n        int temp = a + b;\n        a = b;\n        b = temp;\n    }\n    return b;\n}\n',
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
    description: 'Return n! (factorial). The code below has bugs — fix them!',
    hints: [
      'What is 0 factorial? It is not zero.',
      'What should the result variable start at?',
      'Are you using the right arithmetic operation inside the loop?',
    ],
    functionSignature: { javascript: 'function factorial(n)', python: 'def factorial(n):', cpp: 'long long factorial(int n)' },
    starterCode: {
      javascript: '// 🐛 This code has bugs! Fix them to pass the tests.\nfunction factorial(n) {\n  if (n === 0) return 0;\n  let result = 0;\n  for (let i = 1; i <= n; i++) {\n    result = result + i;\n  }\n  return result;\n}\n',
      python: '# 🐛 This code has bugs! Fix them to pass the tests.\ndef factorial(n):\n    if n == 0:\n        return 0\n    result = 0\n    for i in range(1, n + 1):\n        result = result + i\n    return result\n',
      cpp: '#include <iostream>\nusing namespace std;\n\nlong long factorial(int n) {\n    if (n == 0) return 0;\n    long long result = 0;\n    for (int i = 1; i <= n; i++) {\n        result = result + i;\n    }\n    return result;\n}\n',
    },
    testCases: [
      { input: { javascript: 'factorial(5)', python: 'factorial(5)', cpp: 'cout<<factorial(5);' }, expected: '120', visible: true },
      { input: { javascript: 'factorial(0)', python: 'factorial(0)', cpp: 'cout<<factorial(0);' }, expected: '1', visible: true },
      { input: { javascript: 'factorial(10)', python: 'factorial(10)', cpp: 'cout<<factorial(10);' }, expected: '3628800', visible: false },
    ],
  },
  {
    id: 'linear-search',
    title: 'Linear Search',
    category: 'DSA — Searching',
    difficulty: 'easy',
    description: 'Implement linear search. The code below has bugs — fix them!',
    hints: [
      'Check the loop boundary for off-by-one errors.',
      'What index should be returned when the element is found?',
      'What should be returned when the element is NOT found?',
    ],
    functionSignature: { javascript: 'function linearSearch(arr, target)', python: 'def linear_search(arr, target):', cpp: 'int linearSearch(vector<int>& arr, int target)' },
    starterCode: {
      javascript: '// 🐛 This code has bugs! Fix them to pass the tests.\nfunction linearSearch(arr, target) {\n  for (let i = 0; i <= arr.length; i++) {\n    if (arr[i] == target) return i + 1;\n  }\n  return 0;\n}\n',
      python: '# 🐛 This code has bugs! Fix them to pass the tests.\ndef linear_search(arr, target):\n    for i in range(len(arr) + 1):\n        if arr[i] == target:\n            return i + 1\n    return 0\n',
      cpp: '#include <vector>\n#include <iostream>\nusing namespace std;\n\nint linearSearch(vector<int>& arr, int target) {\n    for (int i = 0; i <= arr.size(); i++) {\n        if (arr[i] == target) return i + 1;\n    }\n    return 0;\n}\n',
    },
    testCases: [
      { input: { javascript: 'linearSearch([4,2,7,1,9], 7)', python: 'linear_search([4,2,7,1,9], 7)', cpp: 'vector<int> v={4,2,7,1,9}; cout<<linearSearch(v,7);' }, expected: '2', visible: true },
      { input: { javascript: 'linearSearch([4,2,7,1,9], 5)', python: 'linear_search([4,2,7,1,9], 5)', cpp: 'vector<int> v={4,2,7,1,9}; cout<<linearSearch(v,5);' }, expected: '-1', visible: true },
      { input: { javascript: 'linearSearch([], 1)', python: 'linear_search([], 1)', cpp: 'vector<int> v={}; cout<<linearSearch(v,1);' }, expected: '-1', visible: false },
    ],
  },
];

// ═══════════════════════════════════════════════
//  EXPORTS
// ═══════════════════════════════════════════════

export function getPromptById(id) {
  return PROMPT_CATALOG.find(p => p.id === id) || null;
}

export function getRandomCatalogPrompt(difficulty = null) {
  let pool = PROMPT_CATALOG;
  if (difficulty) pool = pool.filter(p => p.difficulty === difficulty);
  if (pool.length === 0) pool = PROMPT_CATALOG;
  return pool[Math.floor(Math.random() * pool.length)];
}

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
 * Get hints for a prompt (by ID). Returns an array of hint strings.
 */
export function getHints(promptId) {
  const prompt = getPromptById(promptId);
  return prompt?.hints || [];
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
    hintCount: prompt.hints?.length || 0,
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
