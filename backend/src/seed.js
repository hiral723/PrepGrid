import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

// Inline schema to avoid import issues
const questionSchema = new mongoose.Schema({
  title: String, slug: String, description: String,
  examples: [{ input: String, output: String, explanation: String }],
  constraints: [String], hints: [String],
  difficulty: String, topic: String, tags: [String],
  testCases: [{ input: String, expectedOutput: String, isHidden: Boolean }],
  starterCode: { javascript: String, python: String, java: String, cpp: String },
  acceptanceRate: Number, solvedCount: Number, attemptCount: Number
}, { timestamps: true });

const Question = mongoose.model('Question', questionSchema);

const QUESTIONS = [
  {
    title: 'Two Sum',
    slug: 'two-sum',
    description: 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.',
    examples: [
      { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'nums[0] + nums[1] = 2 + 7 = 9, so we return [0, 1].' },
      { input: 'nums = [3,2,4], target = 6', output: '[1,2]' }
    ],
    constraints: ['2 <= nums.length <= 10^4', '-10^9 <= nums[i] <= 10^9', '-10^9 <= target <= 10^9', 'Only one valid answer exists.'],
    hints: ['Try using a hash map to store seen numbers', 'For each number, check if (target - number) exists in the map'],
    difficulty: 'Easy', topic: 'Arrays', tags: ['hash-table', 'array'],
    testCases: [
      { input: '[2,7,11,15]\n9', expectedOutput: '[0,1]', isHidden: false },
      { input: '[3,2,4]\n6', expectedOutput: '[1,2]', isHidden: false },
      { input: '[3,3]\n6', expectedOutput: '[0,1]', isHidden: true }
    ],
    starterCode: {
      javascript: '/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nfunction twoSum(nums, target) {\n  // Your solution here\n};\n',
      python: 'def two_sum(nums, target):\n    # Your solution here\n    pass\n',
      java: 'class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Your solution here\n    }\n}\n',
      cpp: 'class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        // Your solution here\n    }\n};\n'
    },
    acceptanceRate: 49, solvedCount: 0, attemptCount: 0
  },
  {
    title: 'Valid Parentheses',
    slug: 'valid-parentheses',
    description: "Given a string `s` containing just the characters `'('`, `')'`, `'{'`, `'}'`, `'['` and `']'`, determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.\n3. Every close bracket has a corresponding open bracket of the same type.",
    examples: [
      { input: 's = "()"', output: 'true' },
      { input: 's = "()[]{}"', output: 'true' },
      { input: 's = "(]"', output: 'false' }
    ],
    constraints: ['1 <= s.length <= 10^4', 's consists of parentheses only ()[]{}'],
    hints: ['Use a stack data structure', 'Push opening brackets, pop and check on closing brackets'],
    difficulty: 'Easy', topic: 'Stack/Queue', tags: ['stack', 'string'],
    testCases: [
      { input: '()', expectedOutput: 'true', isHidden: false },
      { input: '()[]{}'  , expectedOutput: 'true', isHidden: false },
      { input: '(]', expectedOutput: 'false', isHidden: false },
      { input: '([)]', expectedOutput: 'false', isHidden: true }
    ],
    starterCode: {
      javascript: '/**\n * @param {string} s\n * @return {boolean}\n */\nfunction isValid(s) {\n  // Your solution here\n};\n',
      python: 'def is_valid(s: str) -> bool:\n    # Your solution here\n    pass\n',
      java: 'class Solution {\n    public boolean isValid(String s) {\n        // Your solution here\n    }\n}\n',
      cpp: 'class Solution {\npublic:\n    bool isValid(string s) {\n        // Your solution here\n    }\n};\n'
    },
    acceptanceRate: 40, solvedCount: 0, attemptCount: 0
  },
  {
    title: 'Reverse a Linked List',
    slug: 'reverse-linked-list',
    description: 'Given the `head` of a singly linked list, reverse the list, and return the reversed list.',
    examples: [
      { input: 'head = [1,2,3,4,5]', output: '[5,4,3,2,1]' },
      { input: 'head = [1,2]', output: '[2,1]' }
    ],
    constraints: ['The number of nodes in the list is in range [0, 5000]', '-5000 <= Node.val <= 5000'],
    hints: ['Try both iterative and recursive approaches', 'Keep track of prev, curr, and next pointers'],
    difficulty: 'Easy', topic: 'Linked Lists', tags: ['linked-list', 'recursion'],
    testCases: [
      { input: '[1,2,3,4,5]', expectedOutput: '[5,4,3,2,1]', isHidden: false },
      { input: '[1,2]', expectedOutput: '[2,1]', isHidden: false }
    ],
    starterCode: {
      javascript: '// Definition for singly-linked list node\n// function ListNode(val, next) { this.val = val; this.next = next || null; }\n\nfunction reverseList(head) {\n  // Your solution here\n};\n',
      python: 'def reverse_list(head):\n    # Your solution here\n    pass\n',
      java: 'class Solution {\n    public ListNode reverseList(ListNode head) {\n        // Your solution here\n    }\n}\n',
      cpp: 'class Solution {\npublic:\n    ListNode* reverseList(ListNode* head) {\n        // Your solution here\n    }\n};\n'
    },
    acceptanceRate: 73, solvedCount: 0, attemptCount: 0
  },
  {
    title: 'Maximum Subarray',
    slug: 'maximum-subarray',
    description: "Given an integer array `nums`, find the subarray with the largest sum, and return its sum.\n\nA subarray is a contiguous non-empty sequence of elements within an array.",
    examples: [
      { input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]', output: '6', explanation: 'The subarray [4,-1,2,1] has the largest sum 6.' },
      { input: 'nums = [1]', output: '1' },
      { input: 'nums = [5,4,-1,7,8]', output: '23' }
    ],
    constraints: ['1 <= nums.length <= 10^5', '-10^4 <= nums[i] <= 10^4'],
    hints: ["Try Kadane's algorithm", 'At each position, decide: extend previous subarray or start fresh'],
    difficulty: 'Medium', topic: 'DP', tags: ['array', 'dynamic-programming', 'divide-and-conquer'],
    testCases: [
      { input: '[-2,1,-3,4,-1,2,1,-5,4]', expectedOutput: '6', isHidden: false },
      { input: '[1]', expectedOutput: '1', isHidden: false },
      { input: '[5,4,-1,7,8]', expectedOutput: '23', isHidden: true }
    ],
    starterCode: {
      javascript: '/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction maxSubArray(nums) {\n  // Your solution here\n};\n',
      python: 'def max_sub_array(nums):\n    # Your solution here\n    pass\n',
      java: 'class Solution {\n    public int maxSubArray(int[] nums) {\n        // Your solution here\n    }\n}\n',
      cpp: 'class Solution {\npublic:\n    int maxSubArray(vector<int>& nums) {\n        // Your solution here\n    }\n};\n'
    },
    acceptanceRate: 50, solvedCount: 0, attemptCount: 0
  },
  {
    title: 'Binary Tree Level Order Traversal',
    slug: 'binary-tree-level-order-traversal',
    description: "Given the `root` of a binary tree, return the level order traversal of its nodes' values (i.e., from left to right, level by level).",
    examples: [
      { input: 'root = [3,9,20,null,null,15,7]', output: '[[3],[9,20],[15,7]]' },
      { input: 'root = [1]', output: '[[1]]' },
      { input: 'root = []', output: '[]' }
    ],
    constraints: ['The number of nodes in the tree is in range [0, 2000]', '-1000 <= Node.val <= 1000'],
    hints: ['Use BFS with a queue', 'Process each level completely before moving to the next'],
    difficulty: 'Medium', topic: 'Trees', tags: ['tree', 'bfs', 'binary-tree'],
    testCases: [
      { input: '[3,9,20,null,null,15,7]', expectedOutput: '[[3],[9,20],[15,7]]', isHidden: false },
      { input: '[1]', expectedOutput: '[[1]]', isHidden: false }
    ],
    starterCode: {
      javascript: 'function levelOrder(root) {\n  // Your solution here\n};\n',
      python: 'def level_order(root):\n    # Your solution here\n    pass\n',
      java: 'class Solution {\n    public List<List<Integer>> levelOrder(TreeNode root) {\n        // Your solution here\n    }\n}\n',
      cpp: 'class Solution {\npublic:\n    vector<vector<int>> levelOrder(TreeNode* root) {\n        // Your solution here\n    }\n};\n'
    },
    acceptanceRate: 65, solvedCount: 0, attemptCount: 0
  },
  {
    title: 'Longest Common Subsequence',
    slug: 'longest-common-subsequence',
    description: 'Given two strings `text1` and `text2`, return the length of their longest common subsequence. If there is no common subsequence, return `0`.\n\nA subsequence is a sequence that can be derived from one sequence by deleting some elements without changing the order of the remaining elements.',
    examples: [
      { input: 'text1 = "abcde", text2 = "ace"', output: '3', explanation: 'The LCS is "ace" which has length 3.' },
      { input: 'text1 = "abc", text2 = "abc"', output: '3' },
      { input: 'text1 = "abc", text2 = "def"', output: '0' }
    ],
    constraints: ['1 <= text1.length, text2.length <= 1000', 'text1 and text2 consist of only lowercase English characters.'],
    hints: ['Use 2D DP table dp[i][j] = LCS of text1[0..i] and text2[0..j]', 'If characters match, dp[i][j] = dp[i-1][j-1] + 1, else max of dp[i-1][j] and dp[i][j-1]'],
    difficulty: 'Hard', topic: 'DP', tags: ['string', 'dynamic-programming'],
    testCases: [
      { input: 'abcde\nace', expectedOutput: '3', isHidden: false },
      { input: 'abc\nabc', expectedOutput: '3', isHidden: false },
      { input: 'abc\ndef', expectedOutput: '0', isHidden: true }
    ],
    starterCode: {
      javascript: 'function longestCommonSubsequence(text1, text2) {\n  // Your solution here\n};\n',
      python: 'def longest_common_subsequence(text1, text2):\n    # Your solution here\n    pass\n',
      java: 'class Solution {\n    public int longestCommonSubsequence(String text1, String text2) {\n        // Your solution here\n    }\n}\n',
      cpp: 'class Solution {\npublic:\n    int longestCommonSubsequence(string text1, string text2) {\n        // Your solution here\n    }\n};\n'
    },
    acceptanceRate: 57, solvedCount: 0, attemptCount: 0
  },
  {
    title: 'Number of Islands',
    slug: 'number-of-islands',
    description: "Given an `m x n` 2D binary grid which represents a map of `'1'`s (land) and `'0'`s (water), return the number of islands.\n\nAn island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically.",
    examples: [
      { input: 'grid = [["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]', output: '1' },
      { input: 'grid = [["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]', output: '3' }
    ],
    constraints: ['m == grid.length', 'n == grid[i].length', '1 <= m, n <= 300', "grid[i][j] is '0' or '1'"],
    hints: ['Use DFS or BFS to explore connected land cells', 'Mark visited cells to avoid double counting'],
    difficulty: 'Medium', topic: 'Graphs', tags: ['array', 'dfs', 'bfs', 'union-find'],
    testCases: [
      { input: '[["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]', expectedOutput: '1', isHidden: false },
      { input: '[["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]', expectedOutput: '3', isHidden: false }
    ],
    starterCode: {
      javascript: 'function numIslands(grid) {\n  // Your solution here\n};\n',
      python: 'def num_islands(grid):\n    # Your solution here\n    pass\n',
      java: 'class Solution {\n    public int numIslands(char[][] grid) {\n        // Your solution here\n    }\n}\n',
      cpp: 'class Solution {\npublic:\n    int numIslands(vector<vector<char>>& grid) {\n        // Your solution here\n    }\n};\n'
    },
    acceptanceRate: 58, solvedCount: 0, attemptCount: 0
  },
  {
    title: 'Find All Anagrams in a String',
    slug: 'find-all-anagrams-in-a-string',
    description: 'Given two strings `s` and `p`, return an array of all the start indices of `p`\'s anagrams in `s`. You may return the answer in any order.',
    examples: [
      { input: 's = "cbaebabacd", p = "abc"', output: '[0,6]', explanation: 'The substring s[0..2] is "cba" — anagram of "abc". The substring s[6..8] is "bac" — also an anagram.' },
      { input: 's = "abab", p = "ab"', output: '[0,1,2]' }
    ],
    constraints: ['1 <= s.length, p.length <= 3 * 10^4', 's and p consist of lowercase English letters'],
    hints: ['Sliding window + frequency count', 'Maintain a window of size p.length and compare character counts'],
    difficulty: 'Medium', topic: 'Strings', tags: ['hash-table', 'string', 'sliding-window'],
    testCases: [
      { input: 'cbaebabacd\nabc', expectedOutput: '[0,6]', isHidden: false },
      { input: 'abab\nab', expectedOutput: '[0,1,2]', isHidden: false }
    ],
    starterCode: {
      javascript: 'function findAnagrams(s, p) {\n  // Your solution here\n};\n',
      python: 'def find_anagrams(s, p):\n    # Your solution here\n    pass\n',
      java: 'class Solution {\n    public List<Integer> findAnagrams(String s, String p) {\n        // Your solution here\n    }\n}\n',
      cpp: 'class Solution {\npublic:\n    vector<int> findAnagrams(string s, string p) {\n        // Your solution here\n    }\n};\n'
    },
    acceptanceRate: 49, solvedCount: 0, attemptCount: 0
  },
  {
    title: 'Merge K Sorted Lists',
    slug: 'merge-k-sorted-lists',
    description: 'You are given an array of `k` linked-lists, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return it.',
    examples: [
      { input: 'lists = [[1,4,5],[1,3,4],[2,6]]', output: '[1,1,2,3,4,4,5,6]' },
      { input: 'lists = []', output: '[]' }
    ],
    constraints: ['k == lists.length', '0 <= k <= 10^4', '0 <= lists[i].length <= 500'],
    hints: ['Use a min-heap (priority queue) to efficiently get the next smallest element', 'Or use divide and conquer: merge pairs of lists'],
    difficulty: 'Hard', topic: 'Linked Lists', tags: ['linked-list', 'divide-and-conquer', 'heap'],
    testCases: [
      { input: '[[1,4,5],[1,3,4],[2,6]]', expectedOutput: '[1,1,2,3,4,4,5,6]', isHidden: false }
    ],
    starterCode: {
      javascript: 'function mergeKLists(lists) {\n  // Your solution here\n};\n',
      python: 'def merge_k_lists(lists):\n    # Your solution here\n    pass\n',
      java: 'class Solution {\n    public ListNode mergeKLists(ListNode[] lists) {\n        // Your solution here\n    }\n}\n',
      cpp: 'class Solution {\npublic:\n    ListNode* mergeKLists(vector<ListNode*>& lists) {\n        // Your solution here\n    }\n};\n'
    },
    acceptanceRate: 50, solvedCount: 0, attemptCount: 0
  },
  {
    title: 'Second Highest Salary',
    slug: 'second-highest-salary',
    description: 'Write a SQL query to find the second highest salary from the `Employee` table.\n\n```\nEmployee table:\n+----+--------+\n| id | salary |\n+----+--------+\n| 1  | 100    |\n| 2  | 200    |\n| 3  | 300    |\n+----+--------+\n```\nReturn the second highest salary. If there is no second highest salary, return `null`.',
    examples: [
      { input: 'Employee = [{id:1,salary:100},{id:2,salary:200},{id:3,salary:300}]', output: '200' },
      { input: 'Employee = [{id:1,salary:100}]', output: 'null' }
    ],
    constraints: ['The Employee table has columns id and salary'],
    hints: ['Use LIMIT and OFFSET', 'Or use subquery with MAX excluding the overall MAX'],
    difficulty: 'Medium', topic: 'SQL', tags: ['database', 'sql'],
    testCases: [
      { input: 'SELECT SecondHighestSalary', expectedOutput: '200', isHidden: false }
    ],
    starterCode: {
      javascript: '-- SQL Query\nSELECT MAX(salary) AS SecondHighestSalary\nFROM Employee\nWHERE salary < (\n    -- Your subquery here\n);\n',
      python: '# SQL Query\nSELECT MAX(salary) AS SecondHighestSalary\nFROM Employee\nWHERE salary < (\n    # Your subquery here\n);\n',
      java: '-- SQL Query\n',
      cpp: '-- SQL Query\n'
    },
    acceptanceRate: 37, solvedCount: 0, attemptCount: 0
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing
    await Question.deleteMany({});
    console.log('Cleared existing questions');

    // Insert
    const inserted = await Question.insertMany(QUESTIONS);
    console.log(`✅ Seeded ${inserted.length} questions`);

    await mongoose.disconnect();
    console.log('Done!');
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  }
}

seed();

// Additional questions to add to the existing QUESTIONS array
// Copy these into the QUESTIONS array in seed.js

const EXTRA_QUESTIONS = [
  {
    title: 'Climbing Stairs',
    slug: 'climbing-stairs',
    description: 'You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?',
    examples: [{ input: 'n = 2', output: '2', explanation: 'Two ways: 1+1 or 2' }, { input: 'n = 3', output: '3', explanation: 'Three ways: 1+1+1, 1+2, 2+1' }],
    constraints: ['1 <= n <= 45'],
    hints: ['This is essentially Fibonacci', 'dp[i] = dp[i-1] + dp[i-2]'],
    difficulty: 'Easy', topic: 'DP', tags: ['dynamic-programming', 'math'],
    testCases: [{ input: '2', expectedOutput: '2', isHidden: false }, { input: '3', expectedOutput: '3', isHidden: false }, { input: '5', expectedOutput: '8', isHidden: true }],
    starterCode: { javascript: 'function climbStairs(n) {\n  // Your solution here\n};\n', python: 'def climb_stairs(n):\n    pass\n', java: 'class Solution {\n    public int climbStairs(int n) {\n        \n    }\n}\n', cpp: 'class Solution {\npublic:\n    int climbStairs(int n) {\n        \n    }\n};\n' },
    acceptanceRate: 51, solvedCount: 0, attemptCount: 0
  },
  {
    title: 'Best Time to Buy and Sell Stock',
    slug: 'best-time-to-buy-sell-stock',
    description: 'You are given an array prices where prices[i] is the price of a given stock on the ith day. You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock. Return the maximum profit you can achieve. If you cannot achieve any profit, return 0.',
    examples: [{ input: 'prices = [7,1,5,3,6,4]', output: '5', explanation: 'Buy on day 2 (price=1) and sell on day 5 (price=6), profit = 5' }],
    constraints: ['1 <= prices.length <= 10^5', '0 <= prices[i] <= 10^4'],
    hints: ['Track the minimum price seen so far', 'At each step, calculate profit if sold today'],
    difficulty: 'Easy', topic: 'Arrays', tags: ['array', 'dynamic-programming'],
    testCases: [{ input: '[7,1,5,3,6,4]', expectedOutput: '5', isHidden: false }, { input: '[7,6,4,3,1]', expectedOutput: '0', isHidden: false }],
    starterCode: { javascript: 'function maxProfit(prices) {\n  // Your solution here\n};\n', python: 'def max_profit(prices):\n    pass\n', java: 'class Solution {\n    public int maxProfit(int[] prices) {\n        \n    }\n}\n', cpp: 'class Solution {\npublic:\n    int maxProfit(vector<int>& prices) {\n        \n    }\n};\n' },
    acceptanceRate: 54, solvedCount: 0, attemptCount: 0
  },
  {
    title: 'Palindrome Check',
    slug: 'valid-palindrome',
    description: 'A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Given a string s, return true if it is a palindrome, or false otherwise.',
    examples: [{ input: 's = "A man, a plan, a canal: Panama"', output: 'true' }, { input: 's = "race a car"', output: 'false' }],
    constraints: ['1 <= s.length <= 2 * 10^5'],
    hints: ['Use two pointers from both ends', 'Skip non-alphanumeric characters'],
    difficulty: 'Easy', topic: 'Strings', tags: ['two-pointers', 'string'],
    testCases: [{ input: '"A man, a plan, a canal: Panama"', expectedOutput: 'true', isHidden: false }, { input: '"race a car"', expectedOutput: 'false', isHidden: false }],
    starterCode: { javascript: 'function isPalindrome(s) {\n  // Your solution here\n};\n', python: 'def is_palindrome(s):\n    pass\n', java: 'class Solution {\n    public boolean isPalindrome(String s) {\n        \n    }\n}\n', cpp: 'class Solution {\npublic:\n    bool isPalindrome(string s) {\n        \n    }\n};\n' },
    acceptanceRate: 43, solvedCount: 0, attemptCount: 0
  },
  {
    title: 'Majority Element',
    slug: 'majority-element',
    description: 'Given an array nums of size n, return the majority element. The majority element is the element that appears more than ⌊n / 2⌋ times. You may assume that the majority element always exists in the array.',
    examples: [{ input: 'nums = [3,2,3]', output: '3' }, { input: 'nums = [2,2,1,1,1,2,2]', output: '2' }],
    constraints: ['n == nums.length', '1 <= n <= 5 * 10^4'],
    hints: ["Try Boyer-Moore Voting Algorithm", 'Or use a hash map to count frequencies'],
    difficulty: 'Easy', topic: 'Arrays', tags: ['array', 'hash-table', 'sorting'],
    testCases: [{ input: '[3,2,3]', expectedOutput: '3', isHidden: false }, { input: '[2,2,1,1,1,2,2]', expectedOutput: '2', isHidden: false }],
    starterCode: { javascript: 'function majorityElement(nums) {\n  // Your solution here\n};\n', python: 'def majority_element(nums):\n    pass\n', java: 'class Solution {\n    public int majorityElement(int[] nums) {\n        \n    }\n}\n', cpp: 'class Solution {\npublic:\n    int majorityElement(vector<int>& nums) {\n        \n    }\n};\n' },
    acceptanceRate: 64, solvedCount: 0, attemptCount: 0
  },
  {
    title: 'Coin Change',
    slug: 'coin-change',
    description: 'You are given an integer array coins representing coins of different denominations and an integer amount representing a total amount of money. Return the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return -1.',
    examples: [{ input: 'coins = [1,2,5], amount = 11', output: '3', explanation: '11 = 5 + 5 + 1' }, { input: 'coins = [2], amount = 3', output: '-1' }],
    constraints: ['1 <= coins.length <= 12', '1 <= coins[i] <= 2^31 - 1', '0 <= amount <= 10^4'],
    hints: ['Use bottom-up DP', 'dp[i] = minimum coins needed to make amount i'],
    difficulty: 'Medium', topic: 'DP', tags: ['array', 'dynamic-programming', 'breadth-first-search'],
    testCases: [{ input: '[1,2,5]\n11', expectedOutput: '3', isHidden: false }, { input: '[2]\n3', expectedOutput: '-1', isHidden: false }],
    starterCode: { javascript: 'function coinChange(coins, amount) {\n  // Your solution here\n};\n', python: 'def coin_change(coins, amount):\n    pass\n', java: 'class Solution {\n    public int coinChange(int[] coins, int amount) {\n        \n    }\n}\n', cpp: 'class Solution {\npublic:\n    int coinChange(vector<int>& coins, int amount) {\n        \n    }\n};\n' },
    acceptanceRate: 42, solvedCount: 0, attemptCount: 0
  },
  {
    title: 'Product of Array Except Self',
    slug: 'product-of-array-except-self',
    description: 'Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i]. You must write an algorithm that runs in O(n) time and without using the division operation.',
    examples: [{ input: 'nums = [1,2,3,4]', output: '[24,12,8,6]' }, { input: 'nums = [-1,1,0,-3,3]', output: '[0,0,9,0,0]' }],
    constraints: ['2 <= nums.length <= 10^5'],
    hints: ['Use prefix and suffix products', 'Left pass then right pass'],
    difficulty: 'Medium', topic: 'Arrays', tags: ['array', 'prefix-sum'],
    testCases: [{ input: '[1,2,3,4]', expectedOutput: '[24,12,8,6]', isHidden: false }, { input: '[-1,1,0,-3,3]', expectedOutput: '[0,0,9,0,0]', isHidden: false }],
    starterCode: { javascript: 'function productExceptSelf(nums) {\n  // Your solution here\n};\n', python: 'def product_except_self(nums):\n    pass\n', java: 'class Solution {\n    public int[] productExceptSelf(int[] nums) {\n        \n    }\n}\n', cpp: 'class Solution {\npublic:\n    vector<int> productExceptSelf(vector<int>& nums) {\n        \n    }\n};\n' },
    acceptanceRate: 65, solvedCount: 0, attemptCount: 0
  },
  {
    title: 'Search in Rotated Sorted Array',
    slug: 'search-rotated-sorted-array',
    description: 'There is an integer array nums sorted in ascending order (with distinct values). Prior to being passed to your function, nums is possibly rotated at an unknown pivot index. Given the array nums and an integer target, return the index of target if it is in nums, or -1 if it is not.',
    examples: [{ input: 'nums = [4,5,6,7,0,1,2], target = 0', output: '4' }, { input: 'nums = [4,5,6,7,0,1,2], target = 3', output: '-1' }],
    constraints: ['1 <= nums.length <= 5000', 'All values are unique'],
    hints: ['Use modified binary search', 'Determine which half is sorted'],
    difficulty: 'Medium', topic: 'Binary Search', tags: ['array', 'binary-search'],
    testCases: [{ input: '[4,5,6,7,0,1,2]\n0', expectedOutput: '4', isHidden: false }, { input: '[4,5,6,7,0,1,2]\n3', expectedOutput: '-1', isHidden: false }],
    starterCode: { javascript: 'function search(nums, target) {\n  // Your solution here\n};\n', python: 'def search(nums, target):\n    pass\n', java: 'class Solution {\n    public int search(int[] nums, int target) {\n        \n    }\n}\n', cpp: 'class Solution {\npublic:\n    int search(vector<int>& nums, int target) {\n        \n    }\n};\n' },
    acceptanceRate: 39, solvedCount: 0, attemptCount: 0
  },
  {
    title: 'House Robber',
    slug: 'house-robber',
    description: 'You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed. Adjacent houses have security systems connected — if two adjacent houses are broken into on the same night, the police will be alerted. Given an integer array nums representing the amount of money of each house, return the maximum amount of money you can rob tonight without alerting the police.',
    examples: [{ input: 'nums = [1,2,3,1]', output: '4', explanation: 'Rob house 1 (1) then house 3 (3)' }, { input: 'nums = [2,7,9,3,1]', output: '12' }],
    constraints: ['1 <= nums.length <= 100', '0 <= nums[i] <= 400'],
    hints: ['dp[i] = max(dp[i-1], dp[i-2] + nums[i])'],
    difficulty: 'Medium', topic: 'DP', tags: ['array', 'dynamic-programming'],
    testCases: [{ input: '[1,2,3,1]', expectedOutput: '4', isHidden: false }, { input: '[2,7,9,3,1]', expectedOutput: '12', isHidden: false }],
    starterCode: { javascript: 'function rob(nums) {\n  // Your solution here\n};\n', python: 'def rob(nums):\n    pass\n', java: 'class Solution {\n    public int rob(int[] nums) {\n        \n    }\n}\n', cpp: 'class Solution {\npublic:\n    int rob(vector<int>& nums) {\n        \n    }\n};\n' },
    acceptanceRate: 50, solvedCount: 0, attemptCount: 0
  },
  {
    title: 'Lowest Common Ancestor of BST',
    slug: 'lowest-common-ancestor-bst',
    description: 'Given a binary search tree (BST), find the lowest common ancestor (LCA) node of two given nodes in the BST. The LCA is defined as the lowest node in the tree that has both p and q as descendants (a node can be a descendant of itself).',
    examples: [{ input: 'root = [6,2,8,0,4,7,9], p = 2, q = 8', output: '6' }, { input: 'root = [6,2,8,0,4,7,9], p = 2, q = 4', output: '2' }],
    constraints: ['The number of nodes in the tree is in the range [2, 10^5]'],
    hints: ['If both p and q are less than root, go left', 'If both are greater, go right', 'Otherwise root is the LCA'],
    difficulty: 'Medium', topic: 'Trees', tags: ['tree', 'binary-search-tree', 'recursion'],
    testCases: [{ input: '[6,2,8,0,4,7,9]\n2\n8', expectedOutput: '6', isHidden: false }],
    starterCode: { javascript: 'function lowestCommonAncestor(root, p, q) {\n  // Your solution here\n};\n', python: 'def lowest_common_ancestor(root, p, q):\n    pass\n', java: 'class Solution {\n    public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {\n        \n    }\n}\n', cpp: 'class Solution {\npublic:\n    TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {\n        \n    }\n};\n' },
    acceptanceRate: 62, solvedCount: 0, attemptCount: 0
  },
  {
    title: 'Word Search',
    slug: 'word-search',
    description: 'Given an m x n grid of characters board and a string word, return true if word exists in the grid. The word can be constructed from letters of sequentially adjacent cells (horizontally or vertically). The same letter cell may not be used more than once.',
    examples: [{ input: 'board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCCED"', output: 'true' }],
    constraints: ['m == board.length', '1 <= m, n <= 6', '1 <= word.length <= 15'],
    hints: ['Use DFS with backtracking', 'Mark cells as visited, then unmark on backtrack'],
    difficulty: 'Medium', topic: 'Backtracking', tags: ['array', 'backtracking', 'dfs'],
    testCases: [{ input: '[["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]]\nABCCED', expectedOutput: 'true', isHidden: false }],
    starterCode: { javascript: 'function exist(board, word) {\n  // Your solution here\n};\n', python: 'def exist(board, word):\n    pass\n', java: 'class Solution {\n    public boolean exist(char[][] board, String word) {\n        \n    }\n}\n', cpp: 'class Solution {\npublic:\n    bool exist(vector<vector<char>>& board, string word) {\n        \n    }\n};\n' },
    acceptanceRate: 40, solvedCount: 0, attemptCount: 0
  },
];
// END EXTRA_QUESTIONS - add these to the QUESTIONS array in seed.js