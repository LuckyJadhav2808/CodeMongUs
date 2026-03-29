/**
 * Built-in prompt catalog — works without Firebase.
 * Each prompt has JS + Python + C++ starter code WITH INTENTIONAL BUGS.
 * Crewmates must DEBUG the code, not write from scratch.
 */

const PROMPT_CATALOG = [
  // ═══════════════ DSA — Arrays ═══════════════
  {
    id: 'two-sum',
    title: 'Two Sum',
    category: 'DSA — Arrays',
    difficulty: 'easy',
    description: 'Given an array of integers and a target, return the indices of two numbers that add up to the target. The code below has bugs — fix them!',
    functionSignature: { javascript: 'function twoSum(nums, target)', python: 'def two_sum(nums, target):', cpp: 'vector<int> twoSum(vector<int>& nums, int target)' },
    starterCode: {
      javascript: '// 🐛 This code has bugs! Fix them to pass the tests.\nfunction twoSum(nums, target) {\n  const map = {};\n  for (let i = 0; i <= nums.length; i++) { // Bug 1: off-by-one\n    const complement = target + nums[i]; // Bug 2: should be subtract\n    if (map[complement] !== undefined) {\n      return [complement, i]; // Bug 3: should return map[complement]\n    }\n    map[nums[i]] = i;\n  }\n  return [];\n}\n',
      python: '# 🐛 This code has bugs! Fix them to pass the tests.\ndef two_sum(nums, target):\n    lookup = {}\n    for i in range(len(nums) + 1):  # Bug 1: off-by-one\n        complement = target + nums[i]  # Bug 2: should subtract\n        if complement in lookup:\n            return [complement, i]  # Bug 3: return lookup[complement]\n        lookup[nums[i]] = i\n    return []\n',
      cpp: '#include <vector>\n#include <unordered_map>\n#include <iostream>\nusing namespace std;\n\n// 🐛 This code has bugs! Fix them to pass the tests.\nvector<int> twoSum(vector<int>& nums, int target) {\n    unordered_map<int,int> mp;\n    for (int i = 0; i <= nums.size(); i++) { // Bug 1: off-by-one\n        int complement = target + nums[i]; // Bug 2: should subtract\n        if (mp.count(complement)) {\n            return {complement, i}; // Bug 3: return mp[complement]\n        }\n        mp[nums[i]] = i;\n    }\n    return {};\n}\n',
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
    functionSignature: { javascript: 'function maxSubArray(nums)', python: 'def max_sub_array(nums):', cpp: 'int maxSubArray(vector<int>& nums)' },
    starterCode: {
      javascript: '// 🐛 This code has bugs! Fix them to pass the tests.\nfunction maxSubArray(nums) {\n  let maxSum = 0; // Bug 1: should be -Infinity or nums[0]\n  let currentSum = 0;\n  for (let i = 0; i < nums.length; i++) {\n    currentSum = currentSum + nums[i];\n    if (currentSum > maxSum) {\n      maxSum = currentSum;\n    }\n    if (currentSum > 0) { // Bug 2: should be < 0 to reset\n      currentSum = 0;\n    }\n  }\n  return maxSum;\n}\n',
      python: '# 🐛 This code has bugs! Fix them to pass the tests.\ndef max_sub_array(nums):\n    max_sum = 0  # Bug 1: should be float("-inf") or nums[0]\n    current_sum = 0\n    for num in nums:\n        current_sum = current_sum + num\n        if current_sum > max_sum:\n            max_sum = current_sum\n        if current_sum > 0:  # Bug 2: should be < 0\n            current_sum = 0\n    return max_sum\n',
      cpp: '#include <vector>\n#include <iostream>\n#include <climits>\nusing namespace std;\n\n// 🐛 This code has bugs! Fix them to pass the tests.\nint maxSubArray(vector<int>& nums) {\n    int maxSum = 0; // Bug 1: should be INT_MIN or nums[0]\n    int currentSum = 0;\n    for (int i = 0; i < nums.size(); i++) {\n        currentSum += nums[i];\n        if (currentSum > maxSum) maxSum = currentSum;\n        if (currentSum > 0) currentSum = 0; // Bug 2: should be < 0\n    }\n    return maxSum;\n}\n',
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
    description: 'Rotate an array to the right by k steps. The code below has bugs — fix them!',
    functionSignature: { javascript: 'function rotateArray(nums, k)', python: 'def rotate_array(nums, k):', cpp: 'vector<int> rotateArray(vector<int>& nums, int k)' },
    starterCode: {
      javascript: '// 🐛 This code has bugs! Fix them to pass the tests.\nfunction rotateArray(nums, k) {\n  const n = nums.length;\n  // Bug: k not normalized, wrong slice order\n  const rotated = nums.slice(k).concat(nums.slice(0, k));\n  return rotated;\n}\n',
      python: '# 🐛 This code has bugs! Fix them to pass the tests.\ndef rotate_array(nums, k):\n    n = len(nums)\n    # Bug: k not normalized, wrong slice order\n    return nums[k:] + nums[:k]\n',
      cpp: '#include <vector>\n#include <iostream>\nusing namespace std;\n\n// 🐛 This code has bugs! Fix them to pass the tests.\nvector<int> rotateArray(vector<int>& nums, int k) {\n    int n = nums.size();\n    // Bug: k not normalized, wrong slice direction\n    vector<int> result(nums.begin() + k, nums.end());\n    result.insert(result.end(), nums.begin(), nums.begin() + k);\n    return result;\n}\n',
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
    description: 'Reverse the characters in a string. The code below has bugs — fix them!',
    functionSignature: { javascript: 'function reverseString(str)', python: 'def reverse_string(s):', cpp: 'string reverseString(string s)' },
    starterCode: {
      javascript: '// 🐛 This code has bugs! Fix them to pass the tests.\nfunction reverseString(str) {\n  let result = "";\n  for (let i = str.length; i >= 0; i--) { // Bug: off-by-one start index\n    result += str[i];\n  }\n  return result;\n}\n',
      python: '# 🐛 This code has bugs! Fix them to pass the tests.\ndef reverse_string(s):\n    result = ""\n    for i in range(len(s), -1, -1):  # Bug: off-by-one\n        result += s[i]  # Bug: index error at len(s)\n    return result\n',
      cpp: '#include <string>\n#include <iostream>\nusing namespace std;\n\n// 🐛 This code has bugs! Fix them to pass the tests.\nstring reverseString(string s) {\n    string result = "";\n    for (int i = s.length(); i >= 0; i--) { // Bug: off-by-one\n        result += s[i];\n    }\n    return result;\n}\n',
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
    functionSignature: { javascript: 'function isPalindrome(str)', python: 'def is_palindrome(s):', cpp: 'bool isPalindrome(string s)' },
    starterCode: {
      javascript: '// 🐛 This code has bugs! Fix them to pass the tests.\nfunction isPalindrome(str) {\n  // Bug 1: not converting to lowercase\n  const reversed = str.split("").reverse().join("");\n  return str == reversed; // Bug 2: loose comparison without case\n}\n',
      python: '# 🐛 This code has bugs! Fix them to pass the tests.\ndef is_palindrome(s):\n    # Bug: not converting to lowercase\n    return s == s[::-1]\n',
      cpp: '#include <string>\n#include <iostream>\n#include <algorithm>\nusing namespace std;\n\n// 🐛 This code has bugs! Fix them to pass the tests.\nbool isPalindrome(string s) {\n    // Bug: not converting to lowercase\n    string rev = s;\n    reverse(rev.begin(), rev.end());\n    return s == rev;\n}\n',
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
    description: 'Check if two strings are anagrams (ignore case and spaces). The code below has bugs — fix them!',
    functionSignature: { javascript: 'function isAnagram(a, b)', python: 'def is_anagram(a, b):', cpp: 'bool isAnagram(string a, string b)' },
    starterCode: {
      javascript: '// 🐛 This code has bugs! Fix them to pass the tests.\nfunction isAnagram(a, b) {\n  // Bug 1: not removing spaces, Bug 2: not lowering case\n  const sortA = a.split("").sort().join("");\n  const sortB = b.split("").sort().join("");\n  return sortA === sortB;\n}\n',
      python: '# 🐛 This code has bugs! Fix them to pass the tests.\ndef is_anagram(a, b):\n    # Bug: not removing spaces or lowering case\n    return sorted(a) == sorted(b)\n',
      cpp: '#include <string>\n#include <iostream>\n#include <algorithm>\nusing namespace std;\n\n// 🐛 This code has bugs! Fix them to pass the tests.\nbool isAnagram(string a, string b) {\n    // Bug: not removing spaces or lowering case\n    sort(a.begin(), a.end());\n    sort(b.begin(), b.end());\n    return a == b;\n}\n',
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
    description: 'Implement bubble sort. The code below has bugs — fix them!',
    functionSignature: { javascript: 'function bubbleSort(arr)', python: 'def bubble_sort(arr):', cpp: 'vector<int> bubbleSort(vector<int> arr)' },
    starterCode: {
      javascript: '// 🐛 This code has bugs! Fix them to pass the tests.\nfunction bubbleSort(arr) {\n  const n = arr.length;\n  for (let i = 0; i < n; i++) {\n    for (let j = 0; j < n; j++) { // Bug: j should go to n-i-1\n      if (arr[j] < arr[j + 1]) { // Bug: should be > for ascending\n        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];\n      }\n    }\n  }\n  return arr;\n}\n',
      python: '# 🐛 This code has bugs! Fix them to pass the tests.\ndef bubble_sort(arr):\n    n = len(arr)\n    for i in range(n):\n        for j in range(n):  # Bug: should be n-i-1\n            if arr[j] < arr[j + 1]:  # Bug: should be >\n                arr[j], arr[j + 1] = arr[j + 1], arr[j]\n    return arr\n',
      cpp: '#include <vector>\n#include <iostream>\nusing namespace std;\n\n// 🐛 This code has bugs! Fix them to pass the tests.\nvector<int> bubbleSort(vector<int> arr) {\n    int n = arr.size();\n    for (int i = 0; i < n; i++) {\n        for (int j = 0; j < n; j++) { // Bug: should be n-i-1\n            if (arr[j] < arr[j+1]) { // Bug: should be >\n                swap(arr[j], arr[j+1]);\n            }\n        }\n    }\n    return arr;\n}\n',
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
    description: 'Implement merge sort. The code below has bugs — fix them!',
    functionSignature: { javascript: 'function mergeSort(arr)', python: 'def merge_sort(arr):', cpp: 'vector<int> mergeSort(vector<int> arr)' },
    starterCode: {
      javascript: '// 🐛 This code has bugs! Fix them to pass the tests.\nfunction mergeSort(arr) {\n  if (arr.length < 2) return arr; // Bug: should be <= 1 (actually this is ok, < 2 is fine)\n  const mid = Math.floor(arr.length / 2);\n  const left = mergeSort(arr.slice(0, mid));\n  const right = mergeSort(arr.slice(mid));\n  return merge(left, right);\n}\n\nfunction merge(left, right) {\n  const result = [];\n  let i = 0, j = 0;\n  while (i < left.length && j < right.length) {\n    if (left[i] > right[j]) { // Bug: should be <= for stable ascending\n      result.push(left[i++]);\n    } else {\n      result.push(right[j++]);\n    }\n  }\n  return result; // Bug: missing concat of remaining elements\n}\n',
      python: '# 🐛 This code has bugs! Fix them to pass the tests.\ndef merge_sort(arr):\n    if len(arr) <= 1:\n        return arr\n    mid = len(arr) // 2\n    left = merge_sort(arr[:mid])\n    right = merge_sort(arr[mid:])\n    return merge(left, right)\n\ndef merge(left, right):\n    result = []\n    i = j = 0\n    while i < len(left) and j < len(right):\n        if left[i] > right[j]:  # Bug: should be <=\n            result.append(left[i])\n            i += 1\n        else:\n            result.append(right[j])\n            j += 1\n    return result  # Bug: missing remaining elements\n',
      cpp: '#include <vector>\n#include <iostream>\nusing namespace std;\n\n// 🐛 This code has bugs! Fix them to pass the tests.\nvector<int> mergeSort(vector<int> arr) {\n    if (arr.size() <= 1) return arr;\n    int mid = arr.size() / 2;\n    vector<int> left(arr.begin(), arr.begin() + mid);\n    vector<int> right(arr.begin() + mid, arr.end());\n    left = mergeSort(left);\n    right = mergeSort(right);\n    // Merge\n    vector<int> result;\n    int i = 0, j = 0;\n    while (i < left.size() && j < right.size()) {\n        if (left[i] > right[j]) result.push_back(left[i++]); // Bug: should be <=\n        else result.push_back(right[j++]);\n    }\n    return result; // Bug: missing remaining elements\n}\n',
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
    description: 'Implement binary search. The code below has bugs — fix them!',
    functionSignature: { javascript: 'function binarySearch(arr, target)', python: 'def binary_search(arr, target):', cpp: 'int binarySearch(vector<int>& arr, int target)' },
    starterCode: {
      javascript: '// 🐛 This code has bugs! Fix them to pass the tests.\nfunction binarySearch(arr, target) {\n  let low = 0;\n  let high = arr.length; // Bug: should be arr.length - 1\n  while (low < high) { // Bug: should be low <= high\n    const mid = Math.floor((low + high) / 2);\n    if (arr[mid] === target) return mid;\n    if (arr[mid] < target) low = mid; // Bug: should be mid + 1\n    else high = mid; // Bug: should be mid - 1\n  }\n  return -1;\n}\n',
      python: '# 🐛 This code has bugs! Fix them to pass the tests.\ndef binary_search(arr, target):\n    low = 0\n    high = len(arr)  # Bug: should be len(arr) - 1\n    while low < high:  # Bug: should be <=\n        mid = (low + high) // 2\n        if arr[mid] == target:\n            return mid\n        if arr[mid] < target:\n            low = mid  # Bug: should be mid + 1\n        else:\n            high = mid  # Bug: should be mid - 1\n    return -1\n',
      cpp: '#include <vector>\n#include <iostream>\nusing namespace std;\n\n// 🐛 This code has bugs! Fix them to pass the tests.\nint binarySearch(vector<int>& arr, int target) {\n    int low = 0;\n    int high = arr.size(); // Bug: should be size() - 1\n    while (low < high) { // Bug: should be <=\n        int mid = (low + high) / 2;\n        if (arr[mid] == target) return mid;\n        if (arr[mid] < target) low = mid; // Bug: mid + 1\n        else high = mid; // Bug: mid - 1\n    }\n    return -1;\n}\n',
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
    description: 'Implement linear search. The code below has bugs — fix them!',
    functionSignature: { javascript: 'function linearSearch(arr, target)', python: 'def linear_search(arr, target):', cpp: 'int linearSearch(vector<int>& arr, int target)' },
    starterCode: {
      javascript: '// 🐛 This code has bugs! Fix them to pass the tests.\nfunction linearSearch(arr, target) {\n  for (let i = 0; i <= arr.length; i++) { // Bug: off-by-one\n    if (arr[i] == target) return i + 1; // Bug: returning i+1 instead of i\n  }\n  return 0; // Bug: should return -1\n}\n',
      python: '# 🐛 This code has bugs! Fix them to pass the tests.\ndef linear_search(arr, target):\n    for i in range(len(arr) + 1):  # Bug: off-by-one\n        if arr[i] == target:\n            return i + 1  # Bug: should return i\n    return 0  # Bug: should return -1\n',
      cpp: '#include <vector>\n#include <iostream>\nusing namespace std;\n\n// 🐛 This code has bugs! Fix them to pass the tests.\nint linearSearch(vector<int>& arr, int target) {\n    for (int i = 0; i <= arr.size(); i++) { // Bug: off-by-one\n        if (arr[i] == target) return i + 1; // Bug: i+1 instead of i\n    }\n    return 0; // Bug: should be -1\n}\n',
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
    description: 'Reverse an array (simulating a linked list reversal). The code below has bugs — fix them!',
    functionSignature: { javascript: 'function reverseList(arr)', python: 'def reverse_list(arr):', cpp: 'vector<int> reverseList(vector<int> arr)' },
    starterCode: {
      javascript: '// 🐛 This code has bugs! Fix them to pass the tests.\nfunction reverseList(arr) {\n  let left = 0;\n  let right = arr.length; // Bug: should be arr.length - 1\n  while (left < right) {\n    const temp = arr[left];\n    arr[left] = arr[right];\n    arr[right] = temp;\n    left++;\n    // Bug: missing right--\n  }\n  return arr;\n}\n',
      python: '# 🐛 This code has bugs! Fix them to pass the tests.\ndef reverse_list(arr):\n    left = 0\n    right = len(arr)  # Bug: should be len(arr) - 1\n    while left < right:\n        arr[left], arr[right] = arr[right], arr[left]\n        left += 1\n        # Bug: missing right -= 1\n    return arr\n',
      cpp: '#include <vector>\n#include <iostream>\nusing namespace std;\n\n// 🐛 This code has bugs! Fix them to pass the tests.\nvector<int> reverseList(vector<int> arr) {\n    int left = 0;\n    int right = arr.size(); // Bug: should be size() - 1\n    while (left < right) {\n        swap(arr[left], arr[right]);\n        left++;\n        // Bug: missing right--\n    }\n    return arr;\n}\n',
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
    description: 'Return "Fizz"/"Buzz"/"FizzBuzz" or the number as string. The code below has bugs — fix them!',
    functionSignature: { javascript: 'function fizzBuzz(n)', python: 'def fizz_buzz(n):', cpp: 'string fizzBuzz(int n)' },
    starterCode: {
      javascript: '// 🐛 This code has bugs! Fix them to pass the tests.\nfunction fizzBuzz(n) {\n  if (n % 3 === 0) return "Fizz"; // Bug: must check 15 first\n  if (n % 5 === 0) return "Buzz";\n  if (n % 15 === 0) return "FizzBuzz"; // Bug: this is unreachable\n  return n; // Bug: should return String(n)\n}\n',
      python: '# 🐛 This code has bugs! Fix them to pass the tests.\ndef fizz_buzz(n):\n    if n % 3 == 0:  # Bug: must check 15 first\n        return "Fizz"\n    if n % 5 == 0:\n        return "Buzz"\n    if n % 15 == 0:  # Bug: unreachable\n        return "FizzBuzz"\n    return n  # Bug: should return str(n)\n',
      cpp: '#include <string>\n#include <iostream>\nusing namespace std;\n\n// 🐛 This code has bugs! Fix them to pass the tests.\nstring fizzBuzz(int n) {\n    if (n % 3 == 0) return "Fizz"; // Bug: must check 15 first\n    if (n % 5 == 0) return "Buzz";\n    if (n % 15 == 0) return "FizzBuzz"; // Bug: unreachable\n    return to_string(n);\n}\n',
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
    functionSignature: { javascript: 'function fibonacci(n)', python: 'def fibonacci(n):', cpp: 'int fibonacci(int n)' },
    starterCode: {
      javascript: '// 🐛 This code has bugs! Fix them to pass the tests.\nfunction fibonacci(n) {\n  if (n <= 0) return 1; // Bug: F(0) should be 0\n  if (n === 1) return 1;\n  let a = 1, b = 1; // Bug: a should start at 0\n  for (let i = 2; i < n; i++) { // Bug: should be i <= n\n    const temp = a + b;\n    a = b;\n    b = temp;\n  }\n  return b;\n}\n',
      python: '# 🐛 This code has bugs! Fix them to pass the tests.\ndef fibonacci(n):\n    if n <= 0:\n        return 1  # Bug: F(0) should be 0\n    if n == 1:\n        return 1\n    a, b = 1, 1  # Bug: a should be 0\n    for i in range(2, n):  # Bug: should be range(2, n+1)\n        a, b = b, a + b\n    return b\n',
      cpp: '#include <iostream>\nusing namespace std;\n\n// 🐛 This code has bugs! Fix them to pass the tests.\nint fibonacci(int n) {\n    if (n <= 0) return 1; // Bug: F(0) should be 0\n    if (n == 1) return 1;\n    int a = 1, b = 1; // Bug: a should be 0\n    for (int i = 2; i < n; i++) { // Bug: should be i <= n\n        int temp = a + b;\n        a = b;\n        b = temp;\n    }\n    return b;\n}\n',
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
    functionSignature: { javascript: 'function factorial(n)', python: 'def factorial(n):', cpp: 'long long factorial(int n)' },
    starterCode: {
      javascript: '// 🐛 This code has bugs! Fix them to pass the tests.\nfunction factorial(n) {\n  if (n === 0) return 0; // Bug: 0! is 1\n  let result = 0; // Bug: should start at 1\n  for (let i = 1; i <= n; i++) {\n    result = result + i; // Bug: should multiply, not add\n  }\n  return result;\n}\n',
      python: '# 🐛 This code has bugs! Fix them to pass the tests.\ndef factorial(n):\n    if n == 0:\n        return 0  # Bug: 0! is 1\n    result = 0  # Bug: should be 1\n    for i in range(1, n + 1):\n        result = result + i  # Bug: should multiply\n    return result\n',
      cpp: '#include <iostream>\nusing namespace std;\n\n// 🐛 This code has bugs! Fix them to pass the tests.\nlong long factorial(int n) {\n    if (n == 0) return 0; // Bug: 0! is 1\n    long long result = 0; // Bug: should be 1\n    for (int i = 1; i <= n; i++) {\n        result = result + i; // Bug: should multiply\n    }\n    return result;\n}\n',
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
    description: 'Flatten a deeply nested array. The code below has bugs — fix them!',
    functionSignature: { javascript: 'function flatten(arr)', python: 'def flatten(arr):', cpp: 'vector<int> flatten(vector<vector<int>>& arr)' },
    starterCode: {
      javascript: '// 🐛 This code has bugs! Fix them to pass the tests.\nfunction flatten(arr) {\n  const result = [];\n  for (let i = 0; i < arr.length; i++) {\n    if (typeof arr[i] === "object") { // Bug: should use Array.isArray\n      result.push(flatten(arr[i])); // Bug: should use push(...) or concat\n    } else {\n      result.push(arr[i]);\n    }\n  }\n  return result;\n}\n',
      python: '# 🐛 This code has bugs! Fix them to pass the tests.\ndef flatten(arr):\n    result = []\n    for item in arr:\n        if type(item) == list:  # Bug: should use isinstance\n            result.append(flatten(item))  # Bug: should extend, not append\n        else:\n            result.append(item)\n    return result\n',
      cpp: '#include <vector>\n#include <iostream>\nusing namespace std;\n\n// 🐛 This code has bugs! Fix them to pass the tests.\nvector<int> flatten(vector<vector<int>>& arr) {\n    vector<int> result;\n    for (auto& inner : arr) {\n        result.push_back(inner[0]); // Bug: should iterate all elements\n    }\n    return result;\n}\n',
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
    description: 'Implement a debounce function. The code below has bugs — fix them!',
    functionSignature: { javascript: 'function debounce(fn, wait)', python: 'def debounce(fn, wait):', cpp: 'function<void()> debounce(function<void()> fn, int waitMs)' },
    starterCode: {
      javascript: '// 🐛 This code has bugs! Fix them to pass the tests.\nfunction debounce(fn, wait) {\n  let timer;\n  return function() {\n    // Bug: not clearing previous timer\n    timer = setTimeout(fn, wait);\n  };\n}\n',
      python: '# 🐛 This code has bugs! Fix them to pass the tests.\nimport time\nimport threading\n\ndef debounce(fn, wait):\n    timer = [None]\n    def debounced():\n        # Bug: not cancelling previous timer\n        timer[0] = threading.Timer(wait / 1000, fn)\n        timer[0].start()\n    return debounced\n',
      cpp: '#include <functional>\n#include <chrono>\n#include <iostream>\nusing namespace std;\n\n// 🐛 This code has bugs! Fix them to pass the tests.\nfunction<void()> debounce(function<void()> fn, int waitMs) {\n    // Bug: not clearing previous call\n    return fn;\n}\n',
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
