/**
 * AUTHORITATIVE PROBLEM TEST CASES REGISTRY
 * Contains validated public and hidden test cases for ALL 75 problems.
 * Mapped strictly by problem ID and slug. NEVER falls back to another problem.
 */

export interface TestCaseItem {
  input: any[];
  expected: any;
  description?: string;
}

export interface ProblemTestCasesEntry {
  id: string;
  slug: string;
  title: string;
  publicCases: TestCaseItem[];
  hiddenCases: TestCaseItem[];
}

export const PROBLEM_TEST_CASES_REGISTRY: Record<string, ProblemTestCasesEntry> = {
  "p-1": {
    "id": "p-1",
    "slug": "two-sum-indices",
    "title": "Pair Sum Target",
    "publicCases": [
      {
        "input": [
          [
            2,
            7,
            11,
            15
          ],
          9
        ],
        "expected": [
          0,
          1
        ]
      },
      {
        "input": [
          [
            3,
            2,
            4
          ],
          6
        ],
        "expected": [
          1,
          2
        ]
      },
      {
        "input": [
          [
            3,
            3
          ],
          6
        ],
        "expected": [
          0,
          1
        ]
      }
    ],
    "hiddenCases": [
      {
        "input": [
          [
            0,
            4,
            3,
            0
          ],
          0
        ],
        "expected": [
          0,
          3
        ]
      },
      {
        "input": [
          [
            -1,
            -2,
            -3,
            -4,
            -5
          ],
          -8
        ],
        "expected": [
          2,
          4
        ]
      },
      {
        "input": [
          [
            1000000,
            500,
            2000000
          ],
          1000500
        ],
        "expected": [
          0,
          1
        ]
      },
      {
        "input": [
          [
            1,
            5,
            8,
            12,
            19,
            25,
            30
          ],
          44
        ],
        "expected": [
          4,
          5
        ]
      }
    ]
  },
  "two-sum-indices": {
    "id": "p-1",
    "slug": "two-sum-indices",
    "title": "Pair Sum Target",
    "publicCases": [
      {
        "input": [
          [
            2,
            7,
            11,
            15
          ],
          9
        ],
        "expected": [
          0,
          1
        ]
      },
      {
        "input": [
          [
            3,
            2,
            4
          ],
          6
        ],
        "expected": [
          1,
          2
        ]
      },
      {
        "input": [
          [
            3,
            3
          ],
          6
        ],
        "expected": [
          0,
          1
        ]
      }
    ],
    "hiddenCases": [
      {
        "input": [
          [
            0,
            4,
            3,
            0
          ],
          0
        ],
        "expected": [
          0,
          3
        ]
      },
      {
        "input": [
          [
            -1,
            -2,
            -3,
            -4,
            -5
          ],
          -8
        ],
        "expected": [
          2,
          4
        ]
      },
      {
        "input": [
          [
            1000000,
            500,
            2000000
          ],
          1000500
        ],
        "expected": [
          0,
          1
        ]
      },
      {
        "input": [
          [
            1,
            5,
            8,
            12,
            19,
            25,
            30
          ],
          44
        ],
        "expected": [
          4,
          5
        ]
      }
    ]
  },
  "p-2": {
    "id": "p-2",
    "slug": "contains-duplicate-value",
    "title": "Detect Duplicate Value",
    "publicCases": [
      {
        "input": [
          [
            1,
            2,
            3,
            1
          ]
        ],
        "expected": true
      },
      {
        "input": [
          [
            1,
            2,
            3,
            4
          ]
        ],
        "expected": false
      },
      {
        "input": [
          [
            1,
            1,
            1,
            3,
            3,
            4,
            3,
            2,
            4,
            2
          ]
        ],
        "expected": true
      }
    ],
    "hiddenCases": [
      {
        "input": [
          [
            100,
            200,
            300,
            400,
            500,
            100
          ]
        ],
        "expected": true
      },
      {
        "input": [
          [
            -5,
            -4,
            -3,
            -2,
            -1,
            0,
            1,
            2,
            3
          ]
        ],
        "expected": false
      },
      {
        "input": [
          [
            99
          ]
        ],
        "expected": false
      },
      {
        "input": [
          [
            0,
            0
          ]
        ],
        "expected": true
      },
      {
        "input": [
          [
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            1
          ]
        ],
        "expected": true
      }
    ]
  },
  "contains-duplicate-value": {
    "id": "p-2",
    "slug": "contains-duplicate-value",
    "title": "Detect Duplicate Value",
    "publicCases": [
      {
        "input": [
          [
            1,
            2,
            3,
            1
          ]
        ],
        "expected": true
      },
      {
        "input": [
          [
            1,
            2,
            3,
            4
          ]
        ],
        "expected": false
      },
      {
        "input": [
          [
            1,
            1,
            1,
            3,
            3,
            4,
            3,
            2,
            4,
            2
          ]
        ],
        "expected": true
      }
    ],
    "hiddenCases": [
      {
        "input": [
          [
            100,
            200,
            300,
            400,
            500,
            100
          ]
        ],
        "expected": true
      },
      {
        "input": [
          [
            -5,
            -4,
            -3,
            -2,
            -1,
            0,
            1,
            2,
            3
          ]
        ],
        "expected": false
      },
      {
        "input": [
          [
            99
          ]
        ],
        "expected": false
      },
      {
        "input": [
          [
            0,
            0
          ]
        ],
        "expected": true
      },
      {
        "input": [
          [
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            1
          ]
        ],
        "expected": true
      }
    ]
  },
  "p-3": {
    "id": "p-3",
    "slug": "valid-anagram-frequency",
    "title": "Verify Anagram Strings",
    "publicCases": [
      {
        "input": [
          "anagram",
          "nagaram"
        ],
        "expected": true
      },
      {
        "input": [
          "rat",
          "car"
        ],
        "expected": false
      },
      {
        "input": [
          "listen",
          "silent"
        ],
        "expected": true
      }
    ],
    "hiddenCases": [
      {
        "input": [
          "abracadabra",
          "baracadarba"
        ],
        "expected": true
      },
      {
        "input": [
          "listen",
          "silent"
        ],
        "expected": true
      },
      {
        "input": [
          "hello",
          "world"
        ],
        "expected": false
      },
      {
        "input": [
          "a",
          "b"
        ],
        "expected": false
      }
    ]
  },
  "valid-anagram-frequency": {
    "id": "p-3",
    "slug": "valid-anagram-frequency",
    "title": "Verify Anagram Strings",
    "publicCases": [
      {
        "input": [
          "anagram",
          "nagaram"
        ],
        "expected": true
      },
      {
        "input": [
          "rat",
          "car"
        ],
        "expected": false
      },
      {
        "input": [
          "listen",
          "silent"
        ],
        "expected": true
      }
    ],
    "hiddenCases": [
      {
        "input": [
          "abracadabra",
          "baracadarba"
        ],
        "expected": true
      },
      {
        "input": [
          "listen",
          "silent"
        ],
        "expected": true
      },
      {
        "input": [
          "hello",
          "world"
        ],
        "expected": false
      },
      {
        "input": [
          "a",
          "b"
        ],
        "expected": false
      }
    ]
  },
  "p-4": {
    "id": "p-4",
    "slug": "group-anagrams-by-signature",
    "title": "Group Anagram Clusters",
    "publicCases": [
      {
        "input": [
          [
            "eat",
            "tea",
            "tan",
            "ate",
            "nat",
            "bat"
          ]
        ],
        "expected": [
          [
            "eat",
            "tea",
            "ate"
          ],
          [
            "tan",
            "nat"
          ],
          [
            "bat"
          ]
        ]
      },
      {
        "input": [
          [
            ""
          ]
        ],
        "expected": [
          [
            ""
          ]
        ]
      },
      {
        "input": [
          [
            "a"
          ]
        ],
        "expected": [
          [
            "a"
          ]
        ]
      }
    ],
    "hiddenCases": [
      {
        "input": [
          [
            "cab",
            "tin",
            "pew",
            "duh",
            "may",
            "ill",
            "buy",
            "bar",
            "max",
            "doc"
          ]
        ],
        "expected": [
          [
            "cab"
          ],
          [
            "tin"
          ],
          [
            "pew"
          ],
          [
            "duh"
          ],
          [
            "may"
          ],
          [
            "ill"
          ],
          [
            "buy"
          ],
          [
            "bar"
          ],
          [
            "max"
          ],
          [
            "doc"
          ]
        ]
      },
      {
        "input": [
          [
            "a",
            "a"
          ]
        ],
        "expected": [
          [
            "a",
            "a"
          ]
        ]
      },
      {
        "input": [
          [
            "z",
            "y",
            "z"
          ]
        ],
        "expected": [
          [
            "z",
            "z"
          ],
          [
            "y"
          ]
        ]
      }
    ]
  },
  "group-anagrams-by-signature": {
    "id": "p-4",
    "slug": "group-anagrams-by-signature",
    "title": "Group Anagram Clusters",
    "publicCases": [
      {
        "input": [
          [
            "eat",
            "tea",
            "tan",
            "ate",
            "nat",
            "bat"
          ]
        ],
        "expected": [
          [
            "eat",
            "tea",
            "ate"
          ],
          [
            "tan",
            "nat"
          ],
          [
            "bat"
          ]
        ]
      },
      {
        "input": [
          [
            ""
          ]
        ],
        "expected": [
          [
            ""
          ]
        ]
      },
      {
        "input": [
          [
            "a"
          ]
        ],
        "expected": [
          [
            "a"
          ]
        ]
      }
    ],
    "hiddenCases": [
      {
        "input": [
          [
            "cab",
            "tin",
            "pew",
            "duh",
            "may",
            "ill",
            "buy",
            "bar",
            "max",
            "doc"
          ]
        ],
        "expected": [
          [
            "cab"
          ],
          [
            "tin"
          ],
          [
            "pew"
          ],
          [
            "duh"
          ],
          [
            "may"
          ],
          [
            "ill"
          ],
          [
            "buy"
          ],
          [
            "bar"
          ],
          [
            "max"
          ],
          [
            "doc"
          ]
        ]
      },
      {
        "input": [
          [
            "a",
            "a"
          ]
        ],
        "expected": [
          [
            "a",
            "a"
          ]
        ]
      },
      {
        "input": [
          [
            "z",
            "y",
            "z"
          ]
        ],
        "expected": [
          [
            "z",
            "z"
          ],
          [
            "y"
          ]
        ]
      }
    ]
  },
  "p-5": {
    "id": "p-5",
    "slug": "longest-consecutive-sequence-linear",
    "title": "Longest Consecutive Sequence",
    "publicCases": [
      {
        "input": [
          [
            100,
            4,
            200,
            1,
            3,
            2
          ]
        ],
        "expected": 4
      },
      {
        "input": [
          [
            0,
            3,
            7,
            2,
            5,
            8,
            4,
            6,
            0,
            1
          ]
        ],
        "expected": 9
      },
      {
        "input": [
          []
        ],
        "expected": 0
      }
    ],
    "hiddenCases": [
      {
        "input": [
          [
            0,
            -1
          ]
        ],
        "expected": 2
      },
      {
        "input": [
          [
            9,
            1,
            4,
            7,
            3,
            -1,
            0,
            5,
            8,
            -1,
            6
          ]
        ],
        "expected": 7
      },
      {
        "input": [
          [
            1,
            2,
            0,
            1
          ]
        ],
        "expected": 3
      },
      {
        "input": [
          [
            10
          ]
        ],
        "expected": 1
      }
    ]
  },
  "longest-consecutive-sequence-linear": {
    "id": "p-5",
    "slug": "longest-consecutive-sequence-linear",
    "title": "Longest Consecutive Sequence",
    "publicCases": [
      {
        "input": [
          [
            100,
            4,
            200,
            1,
            3,
            2
          ]
        ],
        "expected": 4
      },
      {
        "input": [
          [
            0,
            3,
            7,
            2,
            5,
            8,
            4,
            6,
            0,
            1
          ]
        ],
        "expected": 9
      },
      {
        "input": [
          []
        ],
        "expected": 0
      }
    ],
    "hiddenCases": [
      {
        "input": [
          [
            0,
            -1
          ]
        ],
        "expected": 2
      },
      {
        "input": [
          [
            9,
            1,
            4,
            7,
            3,
            -1,
            0,
            5,
            8,
            -1,
            6
          ]
        ],
        "expected": 7
      },
      {
        "input": [
          [
            1,
            2,
            0,
            1
          ]
        ],
        "expected": 3
      },
      {
        "input": [
          [
            10
          ]
        ],
        "expected": 1
      }
    ]
  },
  "p-6": {
    "id": "p-6",
    "slug": "valid-palindrome-alphanumeric",
    "title": "Valid Palindrome String",
    "publicCases": [
      {
        "input": [
          "A man, a plan, a canal: Panama"
        ],
        "expected": true
      },
      {
        "input": [
          "race a car"
        ],
        "expected": false
      },
      {
        "input": [
          " "
        ],
        "expected": true
      }
    ],
    "hiddenCases": [
      {
        "input": [
          "0P"
        ],
        "expected": false
      },
      {
        "input": [
          "a."
        ],
        "expected": true
      },
      {
        "input": [
          "Live on time, emit no evil"
        ],
        "expected": true
      },
      {
        "input": [
          "ab_a"
        ],
        "expected": true
      }
    ]
  },
  "valid-palindrome-alphanumeric": {
    "id": "p-6",
    "slug": "valid-palindrome-alphanumeric",
    "title": "Valid Palindrome String",
    "publicCases": [
      {
        "input": [
          "A man, a plan, a canal: Panama"
        ],
        "expected": true
      },
      {
        "input": [
          "race a car"
        ],
        "expected": false
      },
      {
        "input": [
          " "
        ],
        "expected": true
      }
    ],
    "hiddenCases": [
      {
        "input": [
          "0P"
        ],
        "expected": false
      },
      {
        "input": [
          "a."
        ],
        "expected": true
      },
      {
        "input": [
          "Live on time, emit no evil"
        ],
        "expected": true
      },
      {
        "input": [
          "ab_a"
        ],
        "expected": true
      }
    ]
  },
  "p-7": {
    "id": "p-7",
    "slug": "two-sum-sorted-array",
    "title": "Two Sum II - Sorted Array",
    "publicCases": [
      {
        "input": [
          [
            2,
            7,
            11,
            15
          ],
          9
        ],
        "expected": [
          1,
          2
        ]
      },
      {
        "input": [
          [
            2,
            3,
            4
          ],
          6
        ],
        "expected": [
          1,
          3
        ]
      },
      {
        "input": [
          [
            -1,
            0
          ],
          -1
        ],
        "expected": [
          1,
          2
        ]
      }
    ],
    "hiddenCases": [
      {
        "input": [
          [
            1,
            2,
            3,
            4,
            4,
            9,
            56,
            90
          ],
          8
        ],
        "expected": [
          4,
          5
        ]
      },
      {
        "input": [
          [
            -10,
            -5,
            0,
            3,
            7
          ],
          -2
        ],
        "expected": [
          2,
          4
        ]
      },
      {
        "input": [
          [
            5,
            25,
            75
          ],
          100
        ],
        "expected": [
          2,
          3
        ]
      }
    ]
  },
  "two-sum-sorted-array": {
    "id": "p-7",
    "slug": "two-sum-sorted-array",
    "title": "Two Sum II - Sorted Array",
    "publicCases": [
      {
        "input": [
          [
            2,
            7,
            11,
            15
          ],
          9
        ],
        "expected": [
          1,
          2
        ]
      },
      {
        "input": [
          [
            2,
            3,
            4
          ],
          6
        ],
        "expected": [
          1,
          3
        ]
      },
      {
        "input": [
          [
            -1,
            0
          ],
          -1
        ],
        "expected": [
          1,
          2
        ]
      }
    ],
    "hiddenCases": [
      {
        "input": [
          [
            1,
            2,
            3,
            4,
            4,
            9,
            56,
            90
          ],
          8
        ],
        "expected": [
          4,
          5
        ]
      },
      {
        "input": [
          [
            -10,
            -5,
            0,
            3,
            7
          ],
          -2
        ],
        "expected": [
          2,
          4
        ]
      },
      {
        "input": [
          [
            5,
            25,
            75
          ],
          100
        ],
        "expected": [
          2,
          3
        ]
      }
    ]
  },
  "p-8": {
    "id": "p-8",
    "slug": "three-sum-triplets-zero",
    "title": "3Sum Zero Triplets",
    "publicCases": [
      {
        "input": [
          [
            -1,
            0,
            1,
            2,
            -1,
            -4
          ]
        ],
        "expected": [
          [
            -1,
            -1,
            2
          ],
          [
            -1,
            0,
            1
          ]
        ]
      },
      {
        "input": [
          [
            0,
            1,
            1
          ]
        ],
        "expected": []
      },
      {
        "input": [
          [
            0,
            0,
            0
          ]
        ],
        "expected": [
          [
            0,
            0,
            0
          ]
        ]
      }
    ],
    "hiddenCases": [
      {
        "input": [
          [
            0,
            0,
            0,
            0
          ]
        ],
        "expected": [
          [
            0,
            0,
            0
          ]
        ]
      },
      {
        "input": [
          [
            -2,
            0,
            1,
            1,
            2
          ]
        ],
        "expected": [
          [
            -2,
            0,
            2
          ],
          [
            -2,
            1,
            1
          ]
        ]
      },
      {
        "input": [
          [
            1,
            2,
            -2,
            -1
          ]
        ],
        "expected": []
      }
    ]
  },
  "three-sum-triplets-zero": {
    "id": "p-8",
    "slug": "three-sum-triplets-zero",
    "title": "3Sum Zero Triplets",
    "publicCases": [
      {
        "input": [
          [
            -1,
            0,
            1,
            2,
            -1,
            -4
          ]
        ],
        "expected": [
          [
            -1,
            -1,
            2
          ],
          [
            -1,
            0,
            1
          ]
        ]
      },
      {
        "input": [
          [
            0,
            1,
            1
          ]
        ],
        "expected": []
      },
      {
        "input": [
          [
            0,
            0,
            0
          ]
        ],
        "expected": [
          [
            0,
            0,
            0
          ]
        ]
      }
    ],
    "hiddenCases": [
      {
        "input": [
          [
            0,
            0,
            0,
            0
          ]
        ],
        "expected": [
          [
            0,
            0,
            0
          ]
        ]
      },
      {
        "input": [
          [
            -2,
            0,
            1,
            1,
            2
          ]
        ],
        "expected": [
          [
            -2,
            0,
            2
          ],
          [
            -2,
            1,
            1
          ]
        ]
      },
      {
        "input": [
          [
            1,
            2,
            -2,
            -1
          ]
        ],
        "expected": []
      }
    ]
  },
  "p-9": {
    "id": "p-9",
    "slug": "best-time-to-buy-and-sell-stock",
    "title": "Stock Trading Profit",
    "publicCases": [
      {
        "input": [
          [
            7,
            1,
            5,
            3,
            6,
            4
          ]
        ],
        "expected": 5
      },
      {
        "input": [
          [
            7,
            6,
            4,
            3,
            1
          ]
        ],
        "expected": 0
      },
      {
        "input": [
          [
            2,
            4,
            1
          ]
        ],
        "expected": 2
      }
    ],
    "hiddenCases": [
      {
        "input": [
          [
            3,
            2,
            6,
            5,
            0,
            3
          ]
        ],
        "expected": 4
      },
      {
        "input": [
          [
            1,
            2
          ]
        ],
        "expected": 1
      },
      {
        "input": [
          [
            2,
            1,
            2,
            1,
            0,
            1,
            2
          ]
        ],
        "expected": 2
      },
      {
        "input": [
          [
            7,
            6,
            5,
            4,
            3,
            2
          ]
        ],
        "expected": 0
      }
    ]
  },
  "best-time-to-buy-and-sell-stock": {
    "id": "p-9",
    "slug": "best-time-to-buy-and-sell-stock",
    "title": "Stock Trading Profit",
    "publicCases": [
      {
        "input": [
          [
            7,
            1,
            5,
            3,
            6,
            4
          ]
        ],
        "expected": 5
      },
      {
        "input": [
          [
            7,
            6,
            4,
            3,
            1
          ]
        ],
        "expected": 0
      },
      {
        "input": [
          [
            2,
            4,
            1
          ]
        ],
        "expected": 2
      }
    ],
    "hiddenCases": [
      {
        "input": [
          [
            3,
            2,
            6,
            5,
            0,
            3
          ]
        ],
        "expected": 4
      },
      {
        "input": [
          [
            1,
            2
          ]
        ],
        "expected": 1
      },
      {
        "input": [
          [
            2,
            1,
            2,
            1,
            0,
            1,
            2
          ]
        ],
        "expected": 2
      },
      {
        "input": [
          [
            7,
            6,
            5,
            4,
            3,
            2
          ]
        ],
        "expected": 0
      }
    ]
  },
  "p-10": {
    "id": "p-10",
    "slug": "longest-substring-without-repeating",
    "title": "Longest Unique Substring",
    "publicCases": [
      {
        "input": [
          "abcabcbb"
        ],
        "expected": 3
      },
      {
        "input": [
          "bbbbb"
        ],
        "expected": 1
      },
      {
        "input": [
          "pwwkew"
        ],
        "expected": 3
      },
      {
        "input": [
          ""
        ],
        "expected": 0
      }
    ],
    "hiddenCases": [
      {
        "input": [
          "dvdf"
        ],
        "expected": 3
      },
      {
        "input": [
          "anviaj"
        ],
        "expected": 5
      },
      {
        "input": [
          "tmmzuxt"
        ],
        "expected": 5
      },
      {
        "input": [
          " "
        ],
        "expected": 1
      }
    ]
  },
  "longest-substring-without-repeating": {
    "id": "p-10",
    "slug": "longest-substring-without-repeating",
    "title": "Longest Unique Substring",
    "publicCases": [
      {
        "input": [
          "abcabcbb"
        ],
        "expected": 3
      },
      {
        "input": [
          "bbbbb"
        ],
        "expected": 1
      },
      {
        "input": [
          "pwwkew"
        ],
        "expected": 3
      },
      {
        "input": [
          ""
        ],
        "expected": 0
      }
    ],
    "hiddenCases": [
      {
        "input": [
          "dvdf"
        ],
        "expected": 3
      },
      {
        "input": [
          "anviaj"
        ],
        "expected": 5
      },
      {
        "input": [
          "tmmzuxt"
        ],
        "expected": 5
      },
      {
        "input": [
          " "
        ],
        "expected": 1
      }
    ]
  },
  "p-11": {
    "id": "p-11",
    "slug": "longest-repeating-character-replacement",
    "title": "Character Replacement Window",
    "publicCases": [
      {
        "input": [
          "ABAB",
          2
        ],
        "expected": 4
      },
      {
        "input": [
          "AABABBA",
          1
        ],
        "expected": 4
      },
      {
        "input": [
          "AAAA",
          2
        ],
        "expected": 4
      }
    ],
    "hiddenCases": [
      {
        "input": [
          "ABAA",
          0
        ],
        "expected": 2
      },
      {
        "input": [
          "AABABBA",
          1
        ],
        "expected": 4
      },
      {
        "input": [
          "AAAA",
          2
        ],
        "expected": 4
      },
      {
        "input": [
          "ABCDE",
          1
        ],
        "expected": 2
      }
    ]
  },
  "longest-repeating-character-replacement": {
    "id": "p-11",
    "slug": "longest-repeating-character-replacement",
    "title": "Character Replacement Window",
    "publicCases": [
      {
        "input": [
          "ABAB",
          2
        ],
        "expected": 4
      },
      {
        "input": [
          "AABABBA",
          1
        ],
        "expected": 4
      },
      {
        "input": [
          "AAAA",
          2
        ],
        "expected": 4
      }
    ],
    "hiddenCases": [
      {
        "input": [
          "ABAA",
          0
        ],
        "expected": 2
      },
      {
        "input": [
          "AABABBA",
          1
        ],
        "expected": 4
      },
      {
        "input": [
          "AAAA",
          2
        ],
        "expected": 4
      },
      {
        "input": [
          "ABCDE",
          1
        ],
        "expected": 2
      }
    ]
  },
  "p-12": {
    "id": "p-12",
    "slug": "permutation-in-string-sliding",
    "title": "Permutation in String",
    "publicCases": [
      {
        "input": [
          "ab",
          "eidbaooo"
        ],
        "expected": true
      },
      {
        "input": [
          "ab",
          "eidboaoo"
        ],
        "expected": false
      },
      {
        "input": [
          "adc",
          "dcda"
        ],
        "expected": true
      }
    ],
    "hiddenCases": [
      {
        "input": [
          "ab",
          "eidbaooo"
        ],
        "expected": true
      },
      {
        "input": [
          "ab",
          "eidboaoo"
        ],
        "expected": false
      },
      {
        "input": [
          "hello",
          "ooolleoooleh"
        ],
        "expected": false
      }
    ]
  },
  "permutation-in-string-sliding": {
    "id": "p-12",
    "slug": "permutation-in-string-sliding",
    "title": "Permutation in String",
    "publicCases": [
      {
        "input": [
          "ab",
          "eidbaooo"
        ],
        "expected": true
      },
      {
        "input": [
          "ab",
          "eidboaoo"
        ],
        "expected": false
      },
      {
        "input": [
          "adc",
          "dcda"
        ],
        "expected": true
      }
    ],
    "hiddenCases": [
      {
        "input": [
          "ab",
          "eidbaooo"
        ],
        "expected": true
      },
      {
        "input": [
          "ab",
          "eidboaoo"
        ],
        "expected": false
      },
      {
        "input": [
          "hello",
          "ooolleoooleh"
        ],
        "expected": false
      }
    ]
  },
  "p-13": {
    "id": "p-13",
    "slug": "minimum-window-substring-optimal",
    "title": "Minimum Window Substring",
    "publicCases": [
      {
        "input": [
          "ADOBECODEBANC",
          "ABC"
        ],
        "expected": "BANC"
      },
      {
        "input": [
          "a",
          "a"
        ],
        "expected": "a"
      },
      {
        "input": [
          "a",
          "aa"
        ],
        "expected": ""
      }
    ],
    "hiddenCases": [
      {
        "input": [
          "a",
          "aa"
        ],
        "expected": ""
      },
      {
        "input": [
          "ADOBECODEBANC",
          "ABC"
        ],
        "expected": "BANC"
      },
      {
        "input": [
          "a",
          "b"
        ],
        "expected": ""
      }
    ]
  },
  "minimum-window-substring-optimal": {
    "id": "p-13",
    "slug": "minimum-window-substring-optimal",
    "title": "Minimum Window Substring",
    "publicCases": [
      {
        "input": [
          "ADOBECODEBANC",
          "ABC"
        ],
        "expected": "BANC"
      },
      {
        "input": [
          "a",
          "a"
        ],
        "expected": "a"
      },
      {
        "input": [
          "a",
          "aa"
        ],
        "expected": ""
      }
    ],
    "hiddenCases": [
      {
        "input": [
          "a",
          "aa"
        ],
        "expected": ""
      },
      {
        "input": [
          "ADOBECODEBANC",
          "ABC"
        ],
        "expected": "BANC"
      },
      {
        "input": [
          "a",
          "b"
        ],
        "expected": ""
      }
    ]
  },
  "p-14": {
    "id": "p-14",
    "slug": "valid-parentheses-matching",
    "title": "Valid Parentheses String",
    "publicCases": [
      {
        "input": [
          "()"
        ],
        "expected": true
      },
      {
        "input": [
          "()[]{}"
        ],
        "expected": true
      },
      {
        "input": [
          "(]"
        ],
        "expected": false
      },
      {
        "input": [
          "([)]"
        ],
        "expected": false
      }
    ],
    "hiddenCases": [
      {
        "input": [
          "{[]}"
        ],
        "expected": true
      },
      {
        "input": [
          "([)]"
        ],
        "expected": false
      },
      {
        "input": [
          "]"
        ],
        "expected": false
      },
      {
        "input": [
          "((("
        ],
        "expected": false
      }
    ]
  },
  "valid-parentheses-matching": {
    "id": "p-14",
    "slug": "valid-parentheses-matching",
    "title": "Valid Parentheses String",
    "publicCases": [
      {
        "input": [
          "()"
        ],
        "expected": true
      },
      {
        "input": [
          "()[]{}"
        ],
        "expected": true
      },
      {
        "input": [
          "(]"
        ],
        "expected": false
      },
      {
        "input": [
          "([)]"
        ],
        "expected": false
      }
    ],
    "hiddenCases": [
      {
        "input": [
          "{[]}"
        ],
        "expected": true
      },
      {
        "input": [
          "([)]"
        ],
        "expected": false
      },
      {
        "input": [
          "]"
        ],
        "expected": false
      },
      {
        "input": [
          "((("
        ],
        "expected": false
      }
    ]
  },
  "p-15": {
    "id": "p-15",
    "slug": "min-stack-constant-time",
    "title": "Constant Time Min Stack",
    "publicCases": [
      {
        "input": [
          [
            -2,
            0,
            -3
          ]
        ],
        "expected": [
          -3,
          0,
          -2
        ],
        "description": "push -2, 0, -3 -> getMin -3, pop -> top 0, getMin -2"
      }
    ],
    "hiddenCases": [
      {
        "input": [
          [
            -2,
            0,
            -3
          ]
        ],
        "expected": [
          -3,
          0,
          -2
        ]
      }
    ]
  },
  "min-stack-constant-time": {
    "id": "p-15",
    "slug": "min-stack-constant-time",
    "title": "Constant Time Min Stack",
    "publicCases": [
      {
        "input": [
          [
            -2,
            0,
            -3
          ]
        ],
        "expected": [
          -3,
          0,
          -2
        ],
        "description": "push -2, 0, -3 -> getMin -3, pop -> top 0, getMin -2"
      }
    ],
    "hiddenCases": [
      {
        "input": [
          [
            -2,
            0,
            -3
          ]
        ],
        "expected": [
          -3,
          0,
          -2
        ]
      }
    ]
  },
  "p-16": {
    "id": "p-16",
    "slug": "evaluate-reverse-polish-notation",
    "title": "Evaluate Reverse Polish Notation",
    "publicCases": [
      {
        "input": [
          [
            "2",
            "1",
            "+",
            "3",
            "*"
          ]
        ],
        "expected": 9
      },
      {
        "input": [
          [
            "4",
            "13",
            "5",
            "/",
            "+"
          ]
        ],
        "expected": 6
      },
      {
        "input": [
          [
            "10",
            "6",
            "9",
            "3",
            "+",
            "-11",
            "*",
            "/",
            "*",
            "17",
            "+",
            "5",
            "+"
          ]
        ],
        "expected": 22
      }
    ],
    "hiddenCases": [
      {
        "input": [
          [
            "4",
            "13",
            "5",
            "/",
            "+"
          ]
        ],
        "expected": 6
      },
      {
        "input": [
          [
            "10",
            "6",
            "9",
            "3",
            "+",
            "-11",
            "*",
            "/",
            "*",
            "17",
            "+",
            "5",
            "+"
          ]
        ],
        "expected": 22
      }
    ]
  },
  "evaluate-reverse-polish-notation": {
    "id": "p-16",
    "slug": "evaluate-reverse-polish-notation",
    "title": "Evaluate Reverse Polish Notation",
    "publicCases": [
      {
        "input": [
          [
            "2",
            "1",
            "+",
            "3",
            "*"
          ]
        ],
        "expected": 9
      },
      {
        "input": [
          [
            "4",
            "13",
            "5",
            "/",
            "+"
          ]
        ],
        "expected": 6
      },
      {
        "input": [
          [
            "10",
            "6",
            "9",
            "3",
            "+",
            "-11",
            "*",
            "/",
            "*",
            "17",
            "+",
            "5",
            "+"
          ]
        ],
        "expected": 22
      }
    ],
    "hiddenCases": [
      {
        "input": [
          [
            "4",
            "13",
            "5",
            "/",
            "+"
          ]
        ],
        "expected": 6
      },
      {
        "input": [
          [
            "10",
            "6",
            "9",
            "3",
            "+",
            "-11",
            "*",
            "/",
            "*",
            "17",
            "+",
            "5",
            "+"
          ]
        ],
        "expected": 22
      }
    ]
  },
  "p-17": {
    "id": "p-17",
    "slug": "daily-temperatures-monotonic-stack",
    "title": "Daily Temperatures Span",
    "publicCases": [
      {
        "input": [
          [
            73,
            74,
            75,
            71,
            69,
            72,
            76,
            73
          ]
        ],
        "expected": [
          1,
          1,
          4,
          2,
          1,
          1,
          0,
          0
        ]
      },
      {
        "input": [
          [
            30,
            40,
            50,
            60
          ]
        ],
        "expected": [
          1,
          1,
          1,
          0
        ]
      },
      {
        "input": [
          [
            30,
            60,
            90
          ]
        ],
        "expected": [
          1,
          1,
          0
        ]
      }
    ],
    "hiddenCases": [
      {
        "input": [
          [
            30,
            40,
            50,
            60
          ]
        ],
        "expected": [
          1,
          1,
          1,
          0
        ]
      },
      {
        "input": [
          [
            30,
            60,
            90
          ]
        ],
        "expected": [
          1,
          1,
          0
        ]
      }
    ]
  },
  "daily-temperatures-monotonic-stack": {
    "id": "p-17",
    "slug": "daily-temperatures-monotonic-stack",
    "title": "Daily Temperatures Span",
    "publicCases": [
      {
        "input": [
          [
            73,
            74,
            75,
            71,
            69,
            72,
            76,
            73
          ]
        ],
        "expected": [
          1,
          1,
          4,
          2,
          1,
          1,
          0,
          0
        ]
      },
      {
        "input": [
          [
            30,
            40,
            50,
            60
          ]
        ],
        "expected": [
          1,
          1,
          1,
          0
        ]
      },
      {
        "input": [
          [
            30,
            60,
            90
          ]
        ],
        "expected": [
          1,
          1,
          0
        ]
      }
    ],
    "hiddenCases": [
      {
        "input": [
          [
            30,
            40,
            50,
            60
          ]
        ],
        "expected": [
          1,
          1,
          1,
          0
        ]
      },
      {
        "input": [
          [
            30,
            60,
            90
          ]
        ],
        "expected": [
          1,
          1,
          0
        ]
      }
    ]
  },
  "p-18": {
    "id": "p-18",
    "slug": "container-with-most-water-optimal",
    "title": "Container With Most Water",
    "publicCases": [
      {
        "input": [
          [
            1,
            8,
            6,
            2,
            5,
            4,
            8,
            3,
            7
          ]
        ],
        "expected": 49
      },
      {
        "input": [
          [
            1,
            1
          ]
        ],
        "expected": 1
      },
      {
        "input": [
          [
            4,
            3,
            2,
            1,
            4
          ]
        ],
        "expected": 16
      }
    ],
    "hiddenCases": [
      {
        "input": [
          [
            1,
            2,
            1
          ]
        ],
        "expected": 2
      },
      {
        "input": [
          [
            4,
            3,
            2,
            1,
            4
          ]
        ],
        "expected": 16
      },
      {
        "input": [
          [
            1,
            2,
            4,
            3
          ]
        ],
        "expected": 4
      }
    ]
  },
  "container-with-most-water-optimal": {
    "id": "p-18",
    "slug": "container-with-most-water-optimal",
    "title": "Container With Most Water",
    "publicCases": [
      {
        "input": [
          [
            1,
            8,
            6,
            2,
            5,
            4,
            8,
            3,
            7
          ]
        ],
        "expected": 49
      },
      {
        "input": [
          [
            1,
            1
          ]
        ],
        "expected": 1
      },
      {
        "input": [
          [
            4,
            3,
            2,
            1,
            4
          ]
        ],
        "expected": 16
      }
    ],
    "hiddenCases": [
      {
        "input": [
          [
            1,
            2,
            1
          ]
        ],
        "expected": 2
      },
      {
        "input": [
          [
            4,
            3,
            2,
            1,
            4
          ]
        ],
        "expected": 16
      },
      {
        "input": [
          [
            1,
            2,
            4,
            3
          ]
        ],
        "expected": 4
      }
    ]
  },
  "p-19": {
    "id": "p-19",
    "slug": "trapping-rain-water-hard",
    "title": "Trapping Rain Water",
    "publicCases": [
      {
        "input": [
          [
            0,
            1,
            0,
            2,
            1,
            0,
            1,
            3,
            2,
            1,
            2,
            1
          ]
        ],
        "expected": 6
      },
      {
        "input": [
          [
            4,
            2,
            0,
            3,
            2,
            5
          ]
        ],
        "expected": 9
      },
      {
        "input": [
          []
        ],
        "expected": 0
      }
    ],
    "hiddenCases": [
      {
        "input": [
          [
            4,
            2,
            0,
            3,
            2,
            5
          ]
        ],
        "expected": 9
      },
      {
        "input": [
          [
            3,
            0,
            2,
            0,
            4
          ]
        ],
        "expected": 7
      }
    ]
  },
  "trapping-rain-water-hard": {
    "id": "p-19",
    "slug": "trapping-rain-water-hard",
    "title": "Trapping Rain Water",
    "publicCases": [
      {
        "input": [
          [
            0,
            1,
            0,
            2,
            1,
            0,
            1,
            3,
            2,
            1,
            2,
            1
          ]
        ],
        "expected": 6
      },
      {
        "input": [
          [
            4,
            2,
            0,
            3,
            2,
            5
          ]
        ],
        "expected": 9
      },
      {
        "input": [
          []
        ],
        "expected": 0
      }
    ],
    "hiddenCases": [
      {
        "input": [
          [
            4,
            2,
            0,
            3,
            2,
            5
          ]
        ],
        "expected": 9
      },
      {
        "input": [
          [
            3,
            0,
            2,
            0,
            4
          ]
        ],
        "expected": 7
      }
    ]
  },
  "p-20": {
    "id": "p-20",
    "slug": "reverse-linked-list-iterative",
    "title": "Reverse Linked List",
    "publicCases": [
      {
        "input": [
          [
            1,
            2,
            3,
            4,
            5
          ]
        ],
        "expected": [
          5,
          4,
          3,
          2,
          1
        ]
      },
      {
        "input": [
          [
            1,
            2
          ]
        ],
        "expected": [
          2,
          1
        ]
      },
      {
        "input": [
          []
        ],
        "expected": []
      }
    ],
    "hiddenCases": [
      {
        "input": [
          [
            1,
            2
          ]
        ],
        "expected": [
          2,
          1
        ]
      },
      {
        "input": [
          []
        ],
        "expected": []
      },
      {
        "input": [
          [
            10,
            20,
            30,
            40
          ]
        ],
        "expected": [
          40,
          30,
          20,
          10
        ]
      }
    ]
  },
  "reverse-linked-list-iterative": {
    "id": "p-20",
    "slug": "reverse-linked-list-iterative",
    "title": "Reverse Linked List",
    "publicCases": [
      {
        "input": [
          [
            1,
            2,
            3,
            4,
            5
          ]
        ],
        "expected": [
          5,
          4,
          3,
          2,
          1
        ]
      },
      {
        "input": [
          [
            1,
            2
          ]
        ],
        "expected": [
          2,
          1
        ]
      },
      {
        "input": [
          []
        ],
        "expected": []
      }
    ],
    "hiddenCases": [
      {
        "input": [
          [
            1,
            2
          ]
        ],
        "expected": [
          2,
          1
        ]
      },
      {
        "input": [
          []
        ],
        "expected": []
      },
      {
        "input": [
          [
            10,
            20,
            30,
            40
          ]
        ],
        "expected": [
          40,
          30,
          20,
          10
        ]
      }
    ]
  },
  "p-21": {
    "id": "p-21",
    "slug": "linked-list-cycle-detection",
    "title": "Linked List Cycle Detection",
    "publicCases": [
      {
        "input": [
          [
            3,
            2,
            0,
            -4
          ],
          1
        ],
        "expected": true
      },
      {
        "input": [
          [
            1,
            2
          ],
          0
        ],
        "expected": true
      },
      {
        "input": [
          [
            1
          ],
          -1
        ],
        "expected": false
      }
    ],
    "hiddenCases": [
      {
        "input": [
          [
            3,
            2,
            0,
            -4
          ],
          1
        ],
        "expected": true
      },
      {
        "input": [
          [
            1,
            2
          ],
          0
        ],
        "expected": true
      },
      {
        "input": [
          [
            1
          ],
          -1
        ],
        "expected": false
      }
    ]
  },
  "linked-list-cycle-detection": {
    "id": "p-21",
    "slug": "linked-list-cycle-detection",
    "title": "Linked List Cycle Detection",
    "publicCases": [
      {
        "input": [
          [
            3,
            2,
            0,
            -4
          ],
          1
        ],
        "expected": true
      },
      {
        "input": [
          [
            1,
            2
          ],
          0
        ],
        "expected": true
      },
      {
        "input": [
          [
            1
          ],
          -1
        ],
        "expected": false
      }
    ],
    "hiddenCases": [
      {
        "input": [
          [
            3,
            2,
            0,
            -4
          ],
          1
        ],
        "expected": true
      },
      {
        "input": [
          [
            1,
            2
          ],
          0
        ],
        "expected": true
      },
      {
        "input": [
          [
            1
          ],
          -1
        ],
        "expected": false
      }
    ]
  },
  "p-22": {
    "id": "p-22",
    "slug": "merge-two-sorted-lists-sentinel",
    "title": "Merge Two Sorted Lists",
    "publicCases": [
      {
        "input": [
          [
            1,
            2,
            4
          ],
          [
            1,
            3,
            4
          ]
        ],
        "expected": [
          1,
          1,
          2,
          3,
          4,
          4
        ]
      },
      {
        "input": [
          [],
          []
        ],
        "expected": []
      },
      {
        "input": [
          [],
          [
            0
          ]
        ],
        "expected": [
          0
        ]
      }
    ],
    "hiddenCases": [
      {
        "input": [
          [
            1,
            5
          ],
          [
            2,
            4,
            6
          ]
        ],
        "expected": [
          1,
          2,
          4,
          5,
          6
        ]
      },
      {
        "input": [
          [],
          [
            0
          ]
        ],
        "expected": [
          0
        ]
      }
    ]
  },
  "merge-two-sorted-lists-sentinel": {
    "id": "p-22",
    "slug": "merge-two-sorted-lists-sentinel",
    "title": "Merge Two Sorted Lists",
    "publicCases": [
      {
        "input": [
          [
            1,
            2,
            4
          ],
          [
            1,
            3,
            4
          ]
        ],
        "expected": [
          1,
          1,
          2,
          3,
          4,
          4
        ]
      },
      {
        "input": [
          [],
          []
        ],
        "expected": []
      },
      {
        "input": [
          [],
          [
            0
          ]
        ],
        "expected": [
          0
        ]
      }
    ],
    "hiddenCases": [
      {
        "input": [
          [
            1,
            5
          ],
          [
            2,
            4,
            6
          ]
        ],
        "expected": [
          1,
          2,
          4,
          5,
          6
        ]
      },
      {
        "input": [
          [],
          [
            0
          ]
        ],
        "expected": [
          0
        ]
      }
    ]
  },
  "p-23": {
    "id": "p-23",
    "slug": "remove-nth-node-from-end",
    "title": "Remove Nth Node From End",
    "publicCases": [
      {
        "input": [
          [
            1,
            2,
            3,
            4,
            5
          ],
          2
        ],
        "expected": [
          1,
          2,
          3,
          5
        ]
      },
      {
        "input": [
          [
            1
          ],
          1
        ],
        "expected": []
      },
      {
        "input": [
          [
            1,
            2
          ],
          1
        ],
        "expected": [
          1
        ]
      }
    ],
    "hiddenCases": [
      {
        "input": [
          [
            1,
            2,
            3,
            4,
            5
          ],
          2
        ],
        "expected": [
          1,
          2,
          3,
          5
        ]
      },
      {
        "input": [
          [
            1
          ],
          1
        ],
        "expected": []
      },
      {
        "input": [
          [
            1,
            2
          ],
          1
        ],
        "expected": [
          1
        ]
      }
    ]
  },
  "remove-nth-node-from-end": {
    "id": "p-23",
    "slug": "remove-nth-node-from-end",
    "title": "Remove Nth Node From End",
    "publicCases": [
      {
        "input": [
          [
            1,
            2,
            3,
            4,
            5
          ],
          2
        ],
        "expected": [
          1,
          2,
          3,
          5
        ]
      },
      {
        "input": [
          [
            1
          ],
          1
        ],
        "expected": []
      },
      {
        "input": [
          [
            1,
            2
          ],
          1
        ],
        "expected": [
          1
        ]
      }
    ],
    "hiddenCases": [
      {
        "input": [
          [
            1,
            2,
            3,
            4,
            5
          ],
          2
        ],
        "expected": [
          1,
          2,
          3,
          5
        ]
      },
      {
        "input": [
          [
            1
          ],
          1
        ],
        "expected": []
      },
      {
        "input": [
          [
            1,
            2
          ],
          1
        ],
        "expected": [
          1
        ]
      }
    ]
  },
  "p-24": {
    "id": "p-24",
    "slug": "binary-search-exact-target",
    "title": "Standard Binary Search",
    "publicCases": [
      {
        "input": [
          [
            -1,
            0,
            3,
            5,
            9,
            12
          ],
          9
        ],
        "expected": 4
      },
      {
        "input": [
          [
            -1,
            0,
            3,
            5,
            9,
            12
          ],
          2
        ],
        "expected": -1
      },
      {
        "input": [
          [
            5
          ],
          5
        ],
        "expected": 0
      }
    ],
    "hiddenCases": [
      {
        "input": [
          [
            2,
            5
          ],
          5
        ],
        "expected": 1
      },
      {
        "input": [
          [
            2,
            5
          ],
          2
        ],
        "expected": 0
      },
      {
        "input": [
          [
            -1,
            0,
            3,
            5,
            9,
            12
          ],
          13
        ],
        "expected": -1
      },
      {
        "input": [
          [
            5
          ],
          5
        ],
        "expected": 0
      }
    ]
  },
  "binary-search-exact-target": {
    "id": "p-24",
    "slug": "binary-search-exact-target",
    "title": "Standard Binary Search",
    "publicCases": [
      {
        "input": [
          [
            -1,
            0,
            3,
            5,
            9,
            12
          ],
          9
        ],
        "expected": 4
      },
      {
        "input": [
          [
            -1,
            0,
            3,
            5,
            9,
            12
          ],
          2
        ],
        "expected": -1
      },
      {
        "input": [
          [
            5
          ],
          5
        ],
        "expected": 0
      }
    ],
    "hiddenCases": [
      {
        "input": [
          [
            2,
            5
          ],
          5
        ],
        "expected": 1
      },
      {
        "input": [
          [
            2,
            5
          ],
          2
        ],
        "expected": 0
      },
      {
        "input": [
          [
            -1,
            0,
            3,
            5,
            9,
            12
          ],
          13
        ],
        "expected": -1
      },
      {
        "input": [
          [
            5
          ],
          5
        ],
        "expected": 0
      }
    ]
  },
  "p-25": {
    "id": "p-25",
    "slug": "search-a-2d-matrix-optimal",
    "title": "Search a 2D Matrix",
    "publicCases": [
      {
        "input": [
          [
            [
              1,
              3,
              5,
              7
            ],
            [
              10,
              11,
              16,
              20
            ],
            [
              23,
              30,
              34,
              60
            ]
          ],
          3
        ],
        "expected": true
      },
      {
        "input": [
          [
            [
              1,
              3,
              5,
              7
            ],
            [
              10,
              11,
              16,
              20
            ],
            [
              23,
              30,
              34,
              60
            ]
          ],
          13
        ],
        "expected": false
      }
    ],
    "hiddenCases": [
      {
        "input": [
          [
            [
              1,
              3,
              5,
              7
            ],
            [
              10,
              11,
              16,
              20
            ],
            [
              23,
              30,
              34,
              60
            ]
          ],
          3
        ],
        "expected": true
      },
      {
        "input": [
          [
            [
              1,
              3,
              5,
              7
            ],
            [
              10,
              11,
              16,
              20
            ],
            [
              23,
              30,
              34,
              60
            ]
          ],
          13
        ],
        "expected": false
      }
    ]
  },
  "search-a-2d-matrix-optimal": {
    "id": "p-25",
    "slug": "search-a-2d-matrix-optimal",
    "title": "Search a 2D Matrix",
    "publicCases": [
      {
        "input": [
          [
            [
              1,
              3,
              5,
              7
            ],
            [
              10,
              11,
              16,
              20
            ],
            [
              23,
              30,
              34,
              60
            ]
          ],
          3
        ],
        "expected": true
      },
      {
        "input": [
          [
            [
              1,
              3,
              5,
              7
            ],
            [
              10,
              11,
              16,
              20
            ],
            [
              23,
              30,
              34,
              60
            ]
          ],
          13
        ],
        "expected": false
      }
    ],
    "hiddenCases": [
      {
        "input": [
          [
            [
              1,
              3,
              5,
              7
            ],
            [
              10,
              11,
              16,
              20
            ],
            [
              23,
              30,
              34,
              60
            ]
          ],
          3
        ],
        "expected": true
      },
      {
        "input": [
          [
            [
              1,
              3,
              5,
              7
            ],
            [
              10,
              11,
              16,
              20
            ],
            [
              23,
              30,
              34,
              60
            ]
          ],
          13
        ],
        "expected": false
      }
    ]
  },
  "p-26": {
    "id": "p-26",
    "slug": "search-in-rotated-sorted-array",
    "title": "Rotated Sorted Array Search",
    "publicCases": [
      {
        "input": [
          [
            4,
            5,
            6,
            7,
            0,
            1,
            2
          ],
          0
        ],
        "expected": 4
      },
      {
        "input": [
          [
            4,
            5,
            6,
            7,
            0,
            1,
            2
          ],
          3
        ],
        "expected": -1
      },
      {
        "input": [
          [
            1
          ],
          0
        ],
        "expected": -1
      }
    ],
    "hiddenCases": [
      {
        "input": [
          [
            4,
            5,
            6,
            7,
            0,
            1,
            2
          ],
          0
        ],
        "expected": 4
      },
      {
        "input": [
          [
            4,
            5,
            6,
            7,
            0,
            1,
            2
          ],
          3
        ],
        "expected": -1
      },
      {
        "input": [
          [
            1
          ],
          0
        ],
        "expected": -1
      }
    ]
  },
  "search-in-rotated-sorted-array": {
    "id": "p-26",
    "slug": "search-in-rotated-sorted-array",
    "title": "Rotated Sorted Array Search",
    "publicCases": [
      {
        "input": [
          [
            4,
            5,
            6,
            7,
            0,
            1,
            2
          ],
          0
        ],
        "expected": 4
      },
      {
        "input": [
          [
            4,
            5,
            6,
            7,
            0,
            1,
            2
          ],
          3
        ],
        "expected": -1
      },
      {
        "input": [
          [
            1
          ],
          0
        ],
        "expected": -1
      }
    ],
    "hiddenCases": [
      {
        "input": [
          [
            4,
            5,
            6,
            7,
            0,
            1,
            2
          ],
          0
        ],
        "expected": 4
      },
      {
        "input": [
          [
            4,
            5,
            6,
            7,
            0,
            1,
            2
          ],
          3
        ],
        "expected": -1
      },
      {
        "input": [
          [
            1
          ],
          0
        ],
        "expected": -1
      }
    ]
  },
  "p-27": {
    "id": "p-27",
    "slug": "find-minimum-in-rotated-sorted-array",
    "title": "Find Minimum in Rotated Sorted Array",
    "publicCases": [
      {
        "input": [
          [
            3,
            4,
            5,
            1,
            2
          ]
        ],
        "expected": 1
      },
      {
        "input": [
          [
            4,
            5,
            6,
            7,
            0,
            1,
            2
          ]
        ],
        "expected": 0
      },
      {
        "input": [
          [
            11,
            13,
            15,
            17
          ]
        ],
        "expected": 11
      }
    ],
    "hiddenCases": [
      {
        "input": [
          [
            4,
            5,
            6,
            7,
            0,
            1,
            2
          ]
        ],
        "expected": 0
      },
      {
        "input": [
          [
            11,
            13,
            15,
            17
          ]
        ],
        "expected": 11
      }
    ]
  },
  "find-minimum-in-rotated-sorted-array": {
    "id": "p-27",
    "slug": "find-minimum-in-rotated-sorted-array",
    "title": "Find Minimum in Rotated Sorted Array",
    "publicCases": [
      {
        "input": [
          [
            3,
            4,
            5,
            1,
            2
          ]
        ],
        "expected": 1
      },
      {
        "input": [
          [
            4,
            5,
            6,
            7,
            0,
            1,
            2
          ]
        ],
        "expected": 0
      },
      {
        "input": [
          [
            11,
            13,
            15,
            17
          ]
        ],
        "expected": 11
      }
    ],
    "hiddenCases": [
      {
        "input": [
          [
            4,
            5,
            6,
            7,
            0,
            1,
            2
          ]
        ],
        "expected": 0
      },
      {
        "input": [
          [
            11,
            13,
            15,
            17
          ]
        ],
        "expected": 11
      }
    ]
  },
  "p-28": {
    "id": "p-28",
    "slug": "koko-eating-bananas-search-space",
    "title": "Koko Eating Bananas Rate",
    "publicCases": [
      {
        "input": [
          [
            3,
            6,
            7,
            11
          ],
          8
        ],
        "expected": 4
      },
      {
        "input": [
          [
            30,
            11,
            23,
            4,
            20
          ],
          5
        ],
        "expected": 30
      },
      {
        "input": [
          [
            30,
            11,
            23,
            4,
            20
          ],
          6
        ],
        "expected": 23
      }
    ],
    "hiddenCases": [
      {
        "input": [
          [
            30,
            11,
            23,
            4,
            20
          ],
          5
        ],
        "expected": 30
      },
      {
        "input": [
          [
            30,
            11,
            23,
            4,
            20
          ],
          6
        ],
        "expected": 23
      }
    ]
  },
  "koko-eating-bananas-search-space": {
    "id": "p-28",
    "slug": "koko-eating-bananas-search-space",
    "title": "Koko Eating Bananas Rate",
    "publicCases": [
      {
        "input": [
          [
            3,
            6,
            7,
            11
          ],
          8
        ],
        "expected": 4
      },
      {
        "input": [
          [
            30,
            11,
            23,
            4,
            20
          ],
          5
        ],
        "expected": 30
      },
      {
        "input": [
          [
            30,
            11,
            23,
            4,
            20
          ],
          6
        ],
        "expected": 23
      }
    ],
    "hiddenCases": [
      {
        "input": [
          [
            30,
            11,
            23,
            4,
            20
          ],
          5
        ],
        "expected": 30
      },
      {
        "input": [
          [
            30,
            11,
            23,
            4,
            20
          ],
          6
        ],
        "expected": 23
      }
    ]
  },
  "p-29": {
    "id": "p-29",
    "slug": "maximum-depth-of-binary-tree-dfs",
    "title": "Maximum Depth of Binary Tree",
    "publicCases": [
      {
        "input": [
          [
            3,
            9,
            20,
            null,
            null,
            15,
            7
          ]
        ],
        "expected": 3
      },
      {
        "input": [
          [
            1,
            null,
            2
          ]
        ],
        "expected": 2
      },
      {
        "input": [
          []
        ],
        "expected": 0
      }
    ],
    "hiddenCases": [
      {
        "input": [
          [
            1,
            null,
            2
          ]
        ],
        "expected": 2
      },
      {
        "input": [
          []
        ],
        "expected": 0
      },
      {
        "input": [
          [
            3,
            9,
            20,
            null,
            null,
            15,
            7
          ]
        ],
        "expected": 3
      }
    ]
  },
  "maximum-depth-of-binary-tree-dfs": {
    "id": "p-29",
    "slug": "maximum-depth-of-binary-tree-dfs",
    "title": "Maximum Depth of Binary Tree",
    "publicCases": [
      {
        "input": [
          [
            3,
            9,
            20,
            null,
            null,
            15,
            7
          ]
        ],
        "expected": 3
      },
      {
        "input": [
          [
            1,
            null,
            2
          ]
        ],
        "expected": 2
      },
      {
        "input": [
          []
        ],
        "expected": 0
      }
    ],
    "hiddenCases": [
      {
        "input": [
          [
            1,
            null,
            2
          ]
        ],
        "expected": 2
      },
      {
        "input": [
          []
        ],
        "expected": 0
      },
      {
        "input": [
          [
            3,
            9,
            20,
            null,
            null,
            15,
            7
          ]
        ],
        "expected": 3
      }
    ]
  },
  "p-30": {
    "id": "p-30",
    "slug": "invert-binary-tree-mirror",
    "title": "Invert Binary Tree",
    "publicCases": [
      {
        "input": [
          [
            4,
            2,
            7,
            1,
            3,
            6,
            9
          ]
        ],
        "expected": [
          4,
          7,
          2,
          9,
          6,
          3,
          1
        ]
      },
      {
        "input": [
          [
            2,
            1,
            3
          ]
        ],
        "expected": [
          2,
          3,
          1
        ]
      },
      {
        "input": [
          []
        ],
        "expected": []
      }
    ],
    "hiddenCases": [
      {
        "input": [
          [
            1,
            2
          ]
        ],
        "expected": [
          1,
          null,
          2
        ]
      },
      {
        "input": [
          []
        ],
        "expected": []
      }
    ]
  },
  "invert-binary-tree-mirror": {
    "id": "p-30",
    "slug": "invert-binary-tree-mirror",
    "title": "Invert Binary Tree",
    "publicCases": [
      {
        "input": [
          [
            4,
            2,
            7,
            1,
            3,
            6,
            9
          ]
        ],
        "expected": [
          4,
          7,
          2,
          9,
          6,
          3,
          1
        ]
      },
      {
        "input": [
          [
            2,
            1,
            3
          ]
        ],
        "expected": [
          2,
          3,
          1
        ]
      },
      {
        "input": [
          []
        ],
        "expected": []
      }
    ],
    "hiddenCases": [
      {
        "input": [
          [
            1,
            2
          ]
        ],
        "expected": [
          1,
          null,
          2
        ]
      },
      {
        "input": [
          []
        ],
        "expected": []
      }
    ]
  },
  "p-31": {
    "id": "p-31",
    "slug": "binary-tree-level-order-traversal",
    "title": "Binary Tree Level Order Traversal",
    "publicCases": [
      {
        "input": [
          [
            3,
            9,
            20,
            null,
            null,
            15,
            7
          ]
        ],
        "expected": [
          [
            3
          ],
          [
            9,
            20
          ],
          [
            15,
            7
          ]
        ]
      },
      {
        "input": [
          [
            1
          ]
        ],
        "expected": [
          [
            1
          ]
        ]
      },
      {
        "input": [
          []
        ],
        "expected": []
      }
    ],
    "hiddenCases": [
      {
        "input": [
          [
            3,
            9,
            20,
            null,
            null,
            15,
            7
          ]
        ],
        "expected": [
          [
            3
          ],
          [
            9,
            20
          ],
          [
            15,
            7
          ]
        ]
      },
      {
        "input": [
          [
            1
          ]
        ],
        "expected": [
          [
            1
          ]
        ]
      },
      {
        "input": [
          []
        ],
        "expected": []
      }
    ]
  },
  "binary-tree-level-order-traversal": {
    "id": "p-31",
    "slug": "binary-tree-level-order-traversal",
    "title": "Binary Tree Level Order Traversal",
    "publicCases": [
      {
        "input": [
          [
            3,
            9,
            20,
            null,
            null,
            15,
            7
          ]
        ],
        "expected": [
          [
            3
          ],
          [
            9,
            20
          ],
          [
            15,
            7
          ]
        ]
      },
      {
        "input": [
          [
            1
          ]
        ],
        "expected": [
          [
            1
          ]
        ]
      },
      {
        "input": [
          []
        ],
        "expected": []
      }
    ],
    "hiddenCases": [
      {
        "input": [
          [
            3,
            9,
            20,
            null,
            null,
            15,
            7
          ]
        ],
        "expected": [
          [
            3
          ],
          [
            9,
            20
          ],
          [
            15,
            7
          ]
        ]
      },
      {
        "input": [
          [
            1
          ]
        ],
        "expected": [
          [
            1
          ]
        ]
      },
      {
        "input": [
          []
        ],
        "expected": []
      }
    ]
  },
  "p-32": {
    "id": "p-32",
    "slug": "validate-binary-search-tree",
    "title": "Validate Binary Search Tree",
    "publicCases": [
      {
        "input": [
          [
            2,
            1,
            3
          ]
        ],
        "expected": true
      },
      {
        "input": [
          [
            5,
            1,
            4,
            null,
            null,
            3,
            6
          ]
        ],
        "expected": false
      }
    ],
    "hiddenCases": [
      {
        "input": [
          [
            2,
            1,
            3
          ]
        ],
        "expected": true
      },
      {
        "input": [
          [
            5,
            1,
            4,
            null,
            null,
            3,
            6
          ]
        ],
        "expected": false
      }
    ]
  },
  "validate-binary-search-tree": {
    "id": "p-32",
    "slug": "validate-binary-search-tree",
    "title": "Validate Binary Search Tree",
    "publicCases": [
      {
        "input": [
          [
            2,
            1,
            3
          ]
        ],
        "expected": true
      },
      {
        "input": [
          [
            5,
            1,
            4,
            null,
            null,
            3,
            6
          ]
        ],
        "expected": false
      }
    ],
    "hiddenCases": [
      {
        "input": [
          [
            2,
            1,
            3
          ]
        ],
        "expected": true
      },
      {
        "input": [
          [
            5,
            1,
            4,
            null,
            null,
            3,
            6
          ]
        ],
        "expected": false
      }
    ]
  },
  "p-33": {
    "id": "p-33",
    "slug": "lowest-common-ancestor-binary-tree",
    "title": "Lowest Common Ancestor of Binary Tree",
    "publicCases": [
      {
        "input": [
          [
            3,
            5,
            1,
            6,
            2,
            0,
            8,
            null,
            null,
            7,
            4
          ],
          5,
          1
        ],
        "expected": 3
      },
      {
        "input": [
          [
            3,
            5,
            1,
            6,
            2,
            0,
            8,
            null,
            null,
            7,
            4
          ],
          5,
          4
        ],
        "expected": 5
      }
    ],
    "hiddenCases": [
      {
        "input": [
          [
            3,
            5,
            1,
            6,
            2,
            0,
            8,
            null,
            null,
            7,
            4
          ],
          5,
          1
        ],
        "expected": 3
      },
      {
        "input": [
          [
            3,
            5,
            1,
            6,
            2,
            0,
            8,
            null,
            null,
            7,
            4
          ],
          5,
          4
        ],
        "expected": 5
      }
    ]
  },
  "lowest-common-ancestor-binary-tree": {
    "id": "p-55",
    "slug": "lowest-common-ancestor-binary-tree",
    "title": "Lowest Common Ancestor of a Binary Tree",
    "publicCases": [
      {
        "input": [
          [
            3,
            5,
            1,
            6,
            2,
            0,
            8
          ],
          5,
          1
        ],
        "expected": 3
      },
      {
        "input": [
          [
            3,
            5,
            1,
            6,
            2,
            0,
            8
          ],
          5,
          4
        ],
        "expected": 5
      },
      {
        "input": [
          [
            1,
            2
          ],
          1,
          2
        ],
        "expected": 1
      }
    ],
    "hiddenCases": [
      {
        "input": [
          [
            3,
            5,
            1,
            6,
            2,
            0,
            8
          ],
          5,
          1
        ],
        "expected": 3
      },
      {
        "input": [
          [
            3,
            5,
            1,
            6,
            2,
            0,
            8
          ],
          5,
          4
        ],
        "expected": 5
      },
      {
        "input": [
          [
            1,
            2
          ],
          1,
          2
        ],
        "expected": 1
      }
    ]
  },
  "p-34": {
    "id": "p-34",
    "slug": "implement-trie-prefix-tree",
    "title": "Implement Trie (Prefix Tree)",
    "publicCases": [
      {
        "input": [
          [
            "apple",
            "apple",
            "app",
            "app"
          ]
        ],
        "expected": [
          true,
          false,
          true
        ],
        "description": "insert apple -> search apple (true), search app (false), startsWith app (true)"
      }
    ],
    "hiddenCases": [
      {
        "input": [
          [
            "apple",
            "apple",
            "app",
            "app"
          ]
        ],
        "expected": [
          true,
          false,
          true
        ]
      }
    ]
  },
  "implement-trie-prefix-tree": {
    "id": "p-71",
    "slug": "implement-trie-prefix-tree",
    "title": "Implement Trie (Prefix Tree)",
    "publicCases": [
      {
        "input": [
          [
            "apple"
          ],
          "apple"
        ],
        "expected": true
      },
      {
        "input": [
          [
            "apple"
          ],
          "app"
        ],
        "expected": false
      },
      {
        "input": [
          [
            "apple",
            "app"
          ],
          "app"
        ],
        "expected": true
      }
    ],
    "hiddenCases": [
      {
        "input": [
          [
            "apple"
          ],
          "apple"
        ],
        "expected": true
      },
      {
        "input": [
          [
            "apple"
          ],
          "app"
        ],
        "expected": false
      },
      {
        "input": [
          [
            "apple",
            "app"
          ],
          "app"
        ],
        "expected": true
      }
    ]
  },
  "p-35": {
    "id": "p-35",
    "slug": "word-search-ii-trie-backtracking",
    "title": "Word Search Dictionary",
    "publicCases": [
      {
        "input": [
          [
            [
              "o",
              "a",
              "a",
              "n"
            ],
            [
              "e",
              "t",
              "a",
              "e"
            ],
            [
              "i",
              "h",
              "k",
              "r"
            ],
            [
              "i",
              "f",
              "l",
              "v"
            ]
          ],
          [
            "oath",
            "pea",
            "eat",
            "rain"
          ]
        ],
        "expected": [
          "eat",
          "oath"
        ]
      }
    ],
    "hiddenCases": [
      {
        "input": [
          [
            [
              "o",
              "a",
              "a",
              "n"
            ],
            [
              "e",
              "t",
              "a",
              "e"
            ],
            [
              "i",
              "h",
              "k",
              "r"
            ],
            [
              "i",
              "f",
              "l",
              "v"
            ]
          ],
          [
            "oath",
            "pea",
            "eat",
            "rain"
          ]
        ],
        "expected": [
          "eat",
          "oath"
        ]
      }
    ]
  },
  "word-search-ii-trie-backtracking": {
    "id": "p-35",
    "slug": "word-search-ii-trie-backtracking",
    "title": "Word Search Dictionary",
    "publicCases": [
      {
        "input": [
          [
            [
              "o",
              "a",
              "a",
              "n"
            ],
            [
              "e",
              "t",
              "a",
              "e"
            ],
            [
              "i",
              "h",
              "k",
              "r"
            ],
            [
              "i",
              "f",
              "l",
              "v"
            ]
          ],
          [
            "oath",
            "pea",
            "eat",
            "rain"
          ]
        ],
        "expected": [
          "eat",
          "oath"
        ]
      }
    ],
    "hiddenCases": [
      {
        "input": [
          [
            [
              "o",
              "a",
              "a",
              "n"
            ],
            [
              "e",
              "t",
              "a",
              "e"
            ],
            [
              "i",
              "h",
              "k",
              "r"
            ],
            [
              "i",
              "f",
              "l",
              "v"
            ]
          ],
          [
            "oath",
            "pea",
            "eat",
            "rain"
          ]
        ],
        "expected": [
          "eat",
          "oath"
        ]
      }
    ]
  },
  "p-36": {
    "id": "p-36",
    "slug": "top-k-frequent-elements",
    "title": "Top K Frequent Elements",
    "publicCases": [
      {
        "input": [
          [
            1,
            1,
            1,
            2,
            2,
            3
          ],
          2
        ],
        "expected": [
          1,
          2
        ]
      },
      {
        "input": [
          [
            1
          ],
          1
        ],
        "expected": [
          1
        ]
      }
    ],
    "hiddenCases": [
      {
        "input": [
          [
            4,
            1,
            -1,
            2,
            -1,
            2,
            3
          ],
          2
        ],
        "expected": [
          -1,
          2
        ]
      },
      {
        "input": [
          [
            1,
            2
          ],
          2
        ],
        "expected": [
          1,
          2
        ]
      },
      {
        "input": [
          [
            7,
            7,
            7,
            7
          ],
          1
        ],
        "expected": [
          7
        ]
      }
    ]
  },
  "top-k-frequent-elements": {
    "id": "p-67",
    "slug": "top-k-frequent-elements",
    "title": "Top K Frequent Elements",
    "publicCases": [
      {
        "input": [
          [
            1,
            1,
            1,
            2,
            2,
            3
          ],
          2
        ],
        "expected": [
          1,
          2
        ]
      },
      {
        "input": [
          [
            1
          ],
          1
        ],
        "expected": [
          1
        ]
      },
      {
        "input": [
          [
            4,
            4,
            4,
            6,
            6,
            7
          ],
          1
        ],
        "expected": [
          4
        ]
      }
    ],
    "hiddenCases": [
      {
        "input": [
          [
            4,
            1,
            -1,
            2,
            -1,
            2,
            3
          ],
          2
        ],
        "expected": [
          -1,
          2
        ]
      },
      {
        "input": [
          [
            1,
            2
          ],
          2
        ],
        "expected": [
          1,
          2
        ]
      }
    ]
  },
  "p-37": {
    "id": "p-37",
    "slug": "kth-largest-element-in-array",
    "title": "Kth Largest Element in Array",
    "publicCases": [
      {
        "input": [
          [
            3,
            2,
            1,
            5,
            6,
            4
          ],
          2
        ],
        "expected": 5
      },
      {
        "input": [
          [
            3,
            2,
            3,
            1,
            2,
            4,
            5,
            5,
            6
          ],
          4
        ],
        "expected": 4
      }
    ],
    "hiddenCases": [
      {
        "input": [
          [
            3,
            2,
            1,
            5,
            6,
            4
          ],
          2
        ],
        "expected": 5
      },
      {
        "input": [
          [
            3,
            2,
            3,
            1,
            2,
            4,
            5,
            5,
            6
          ],
          4
        ],
        "expected": 4
      }
    ]
  },
  "kth-largest-element-in-array": {
    "id": "p-37",
    "slug": "kth-largest-element-in-array",
    "title": "Kth Largest Element in Array",
    "publicCases": [
      {
        "input": [
          [
            3,
            2,
            1,
            5,
            6,
            4
          ],
          2
        ],
        "expected": 5
      },
      {
        "input": [
          [
            3,
            2,
            3,
            1,
            2,
            4,
            5,
            5,
            6
          ],
          4
        ],
        "expected": 4
      }
    ],
    "hiddenCases": [
      {
        "input": [
          [
            3,
            2,
            1,
            5,
            6,
            4
          ],
          2
        ],
        "expected": 5
      },
      {
        "input": [
          [
            3,
            2,
            3,
            1,
            2,
            4,
            5,
            5,
            6
          ],
          4
        ],
        "expected": 4
      }
    ]
  },
  "p-38": {
    "id": "p-38",
    "slug": "number-of-islands-grid-bfs-dfs",
    "title": "Number of Islands",
    "publicCases": [
      {
        "input": [
          [
            [
              "1",
              "1",
              "1",
              "1",
              "0"
            ],
            [
              "1",
              "1",
              "0",
              "1",
              "0"
            ],
            [
              "1",
              "1",
              "0",
              "0",
              "0"
            ],
            [
              "0",
              "0",
              "0",
              "0",
              "0"
            ]
          ]
        ],
        "expected": 1
      },
      {
        "input": [
          [
            [
              "1",
              "1",
              "0",
              "0",
              "0"
            ],
            [
              "1",
              "1",
              "0",
              "0",
              "0"
            ],
            [
              "0",
              "0",
              "1",
              "0",
              "0"
            ],
            [
              "0",
              "0",
              "0",
              "1",
              "1"
            ]
          ]
        ],
        "expected": 3
      }
    ],
    "hiddenCases": [
      {
        "input": [
          [
            [
              "1",
              "1",
              "1",
              "1",
              "0"
            ],
            [
              "1",
              "1",
              "0",
              "1",
              "0"
            ],
            [
              "1",
              "1",
              "0",
              "0",
              "0"
            ],
            [
              "0",
              "0",
              "0",
              "0",
              "0"
            ]
          ]
        ],
        "expected": 1
      },
      {
        "input": [
          [
            [
              "1",
              "1",
              "0",
              "0",
              "0"
            ],
            [
              "1",
              "1",
              "0",
              "0",
              "0"
            ],
            [
              "0",
              "0",
              "1",
              "0",
              "0"
            ],
            [
              "0",
              "0",
              "0",
              "1",
              "1"
            ]
          ]
        ],
        "expected": 3
      }
    ]
  },
  "number-of-islands-grid-bfs-dfs": {
    "id": "p-38",
    "slug": "number-of-islands-grid-bfs-dfs",
    "title": "Number of Islands",
    "publicCases": [
      {
        "input": [
          [
            [
              "1",
              "1",
              "1",
              "1",
              "0"
            ],
            [
              "1",
              "1",
              "0",
              "1",
              "0"
            ],
            [
              "1",
              "1",
              "0",
              "0",
              "0"
            ],
            [
              "0",
              "0",
              "0",
              "0",
              "0"
            ]
          ]
        ],
        "expected": 1
      },
      {
        "input": [
          [
            [
              "1",
              "1",
              "0",
              "0",
              "0"
            ],
            [
              "1",
              "1",
              "0",
              "0",
              "0"
            ],
            [
              "0",
              "0",
              "1",
              "0",
              "0"
            ],
            [
              "0",
              "0",
              "0",
              "1",
              "1"
            ]
          ]
        ],
        "expected": 3
      }
    ],
    "hiddenCases": [
      {
        "input": [
          [
            [
              "1",
              "1",
              "1",
              "1",
              "0"
            ],
            [
              "1",
              "1",
              "0",
              "1",
              "0"
            ],
            [
              "1",
              "1",
              "0",
              "0",
              "0"
            ],
            [
              "0",
              "0",
              "0",
              "0",
              "0"
            ]
          ]
        ],
        "expected": 1
      },
      {
        "input": [
          [
            [
              "1",
              "1",
              "0",
              "0",
              "0"
            ],
            [
              "1",
              "1",
              "0",
              "0",
              "0"
            ],
            [
              "0",
              "0",
              "1",
              "0",
              "0"
            ],
            [
              "0",
              "0",
              "0",
              "1",
              "1"
            ]
          ]
        ],
        "expected": 3
      }
    ]
  },
  "p-39": {
    "id": "p-39",
    "slug": "course-schedule-cycle-detection",
    "title": "Course Schedule Prerequisites",
    "publicCases": [
      {
        "input": [
          2,
          [
            [
              1,
              0
            ]
          ]
        ],
        "expected": true
      },
      {
        "input": [
          2,
          [
            [
              1,
              0
            ],
            [
              0,
              1
            ]
          ]
        ],
        "expected": false
      }
    ],
    "hiddenCases": [
      {
        "input": [
          2,
          [
            [
              1,
              0
            ]
          ]
        ],
        "expected": true
      },
      {
        "input": [
          2,
          [
            [
              1,
              0
            ],
            [
              0,
              1
            ]
          ]
        ],
        "expected": false
      }
    ]
  },
  "course-schedule-cycle-detection": {
    "id": "p-39",
    "slug": "course-schedule-cycle-detection",
    "title": "Course Schedule Prerequisites",
    "publicCases": [
      {
        "input": [
          2,
          [
            [
              1,
              0
            ]
          ]
        ],
        "expected": true
      },
      {
        "input": [
          2,
          [
            [
              1,
              0
            ],
            [
              0,
              1
            ]
          ]
        ],
        "expected": false
      }
    ],
    "hiddenCases": [
      {
        "input": [
          2,
          [
            [
              1,
              0
            ]
          ]
        ],
        "expected": true
      },
      {
        "input": [
          2,
          [
            [
              1,
              0
            ],
            [
              0,
              1
            ]
          ]
        ],
        "expected": false
      }
    ]
  },
  "p-40": {
    "id": "p-40",
    "slug": "pacific-atlantic-water-flow",
    "title": "Pacific Atlantic Water Flow",
    "publicCases": [
      {
        "input": [
          [
            [
              1,
              2,
              2,
              3,
              5
            ],
            [
              3,
              2,
              3,
              4,
              4
            ],
            [
              2,
              4,
              5,
              3,
              1
            ],
            [
              6,
              7,
              1,
              4,
              5
            ],
            [
              5,
              1,
              1,
              2,
              4
            ]
          ]
        ],
        "expected": [
          [
            0,
            4
          ],
          [
            1,
            3
          ],
          [
            1,
            4
          ],
          [
            2,
            2
          ],
          [
            3,
            0
          ],
          [
            3,
            1
          ],
          [
            4,
            0
          ]
        ]
      }
    ],
    "hiddenCases": [
      {
        "input": [
          [
            [
              1,
              2,
              2,
              3,
              5
            ],
            [
              3,
              2,
              3,
              4,
              4
            ],
            [
              2,
              4,
              5,
              3,
              1
            ],
            [
              6,
              7,
              1,
              4,
              5
            ],
            [
              5,
              1,
              1,
              2,
              4
            ]
          ]
        ],
        "expected": [
          [
            0,
            4
          ],
          [
            1,
            3
          ],
          [
            1,
            4
          ],
          [
            2,
            2
          ],
          [
            3,
            0
          ],
          [
            3,
            1
          ],
          [
            4,
            0
          ]
        ]
      }
    ]
  },
  "pacific-atlantic-water-flow": {
    "id": "p-56",
    "slug": "pacific-atlantic-water-flow",
    "title": "Pacific Atlantic Water Flow",
    "publicCases": [
      {
        "input": [
          [
            [
              1,
              2,
              2,
              3,
              5
            ],
            [
              3,
              2,
              3,
              4,
              4
            ],
            [
              2,
              4,
              5,
              3,
              1
            ],
            [
              6,
              7,
              1,
              4,
              5
            ],
            [
              5,
              1,
              1,
              2,
              4
            ]
          ]
        ],
        "expected": [
          [
            0,
            4
          ],
          [
            1,
            3
          ],
          [
            1,
            4
          ],
          [
            2,
            2
          ],
          [
            3,
            0
          ],
          [
            3,
            1
          ],
          [
            4,
            0
          ]
        ]
      },
      {
        "input": [
          [
            [
              1
            ]
          ]
        ],
        "expected": [
          [
            0,
            0
          ]
        ]
      }
    ],
    "hiddenCases": [
      {
        "input": [
          [
            [
              1,
              2,
              2,
              3,
              5
            ],
            [
              3,
              2,
              3,
              4,
              4
            ],
            [
              2,
              4,
              5,
              3,
              1
            ],
            [
              6,
              7,
              1,
              4,
              5
            ],
            [
              5,
              1,
              1,
              2,
              4
            ]
          ]
        ],
        "expected": [
          [
            0,
            4
          ],
          [
            1,
            3
          ],
          [
            1,
            4
          ],
          [
            2,
            2
          ],
          [
            3,
            0
          ],
          [
            3,
            1
          ],
          [
            4,
            0
          ]
        ]
      },
      {
        "input": [
          [
            [
              1
            ]
          ]
        ],
        "expected": [
          [
            0,
            0
          ]
        ]
      }
    ]
  },
  "p-41": {
    "id": "p-41",
    "slug": "climbing-stairs-memoization",
    "title": "Climbing Stairs Combinations",
    "publicCases": [
      {
        "input": [
          2
        ],
        "expected": 2
      },
      {
        "input": [
          3
        ],
        "expected": 3
      },
      {
        "input": [
          5
        ],
        "expected": 8
      }
    ],
    "hiddenCases": [
      {
        "input": [
          4
        ],
        "expected": 5
      },
      {
        "input": [
          5
        ],
        "expected": 8
      },
      {
        "input": [
          6
        ],
        "expected": 13
      }
    ]
  },
  "climbing-stairs-memoization": {
    "id": "p-41",
    "slug": "climbing-stairs-memoization",
    "title": "Climbing Stairs Combinations",
    "publicCases": [
      {
        "input": [
          2
        ],
        "expected": 2
      },
      {
        "input": [
          3
        ],
        "expected": 3
      },
      {
        "input": [
          5
        ],
        "expected": 8
      }
    ],
    "hiddenCases": [
      {
        "input": [
          4
        ],
        "expected": 5
      },
      {
        "input": [
          5
        ],
        "expected": 8
      },
      {
        "input": [
          6
        ],
        "expected": 13
      }
    ]
  },
  "p-42": {
    "id": "p-42",
    "slug": "house-robber-linear-dp",
    "title": "House Robber Optimal Loot",
    "publicCases": [
      {
        "input": [
          [
            1,
            2,
            3,
            1
          ]
        ],
        "expected": 4
      },
      {
        "input": [
          [
            2,
            7,
            9,
            3,
            1
          ]
        ],
        "expected": 12
      },
      {
        "input": [
          [
            0
          ]
        ],
        "expected": 0
      }
    ],
    "hiddenCases": [
      {
        "input": [
          [
            2,
            1,
            1,
            2
          ]
        ],
        "expected": 4
      },
      {
        "input": [
          [
            1,
            2,
            3,
            1
          ]
        ],
        "expected": 4
      }
    ]
  },
  "house-robber-linear-dp": {
    "id": "p-42",
    "slug": "house-robber-linear-dp",
    "title": "House Robber Optimal Loot",
    "publicCases": [
      {
        "input": [
          [
            1,
            2,
            3,
            1
          ]
        ],
        "expected": 4
      },
      {
        "input": [
          [
            2,
            7,
            9,
            3,
            1
          ]
        ],
        "expected": 12
      },
      {
        "input": [
          [
            0
          ]
        ],
        "expected": 0
      }
    ],
    "hiddenCases": [
      {
        "input": [
          [
            2,
            1,
            1,
            2
          ]
        ],
        "expected": 4
      },
      {
        "input": [
          [
            1,
            2,
            3,
            1
          ]
        ],
        "expected": 4
      }
    ]
  },
  "p-43": {
    "id": "p-43",
    "slug": "coin-change-fewest-coins",
    "title": "Coin Change Minimum Coins",
    "publicCases": [
      {
        "input": [
          [
            1,
            2,
            5
          ],
          11
        ],
        "expected": 3
      },
      {
        "input": [
          [
            2
          ],
          3
        ],
        "expected": -1
      },
      {
        "input": [
          [
            1
          ],
          0
        ],
        "expected": 0
      }
    ],
    "hiddenCases": [
      {
        "input": [
          [
            2
          ],
          3
        ],
        "expected": -1
      },
      {
        "input": [
          [
            1
          ],
          0
        ],
        "expected": 0
      },
      {
        "input": [
          [
            1,
            2,
            5
          ],
          11
        ],
        "expected": 3
      }
    ]
  },
  "coin-change-fewest-coins": {
    "id": "p-43",
    "slug": "coin-change-fewest-coins",
    "title": "Coin Change Minimum Coins",
    "publicCases": [
      {
        "input": [
          [
            1,
            2,
            5
          ],
          11
        ],
        "expected": 3
      },
      {
        "input": [
          [
            2
          ],
          3
        ],
        "expected": -1
      },
      {
        "input": [
          [
            1
          ],
          0
        ],
        "expected": 0
      }
    ],
    "hiddenCases": [
      {
        "input": [
          [
            2
          ],
          3
        ],
        "expected": -1
      },
      {
        "input": [
          [
            1
          ],
          0
        ],
        "expected": 0
      },
      {
        "input": [
          [
            1,
            2,
            5
          ],
          11
        ],
        "expected": 3
      }
    ]
  },
  "p-44": {
    "id": "p-44",
    "slug": "longest-common-subsequence-2d-dp",
    "title": "Longest Common Subsequence",
    "publicCases": [
      {
        "input": [
          "abcde",
          "ace"
        ],
        "expected": 3
      },
      {
        "input": [
          "abc",
          "abc"
        ],
        "expected": 3
      },
      {
        "input": [
          "abc",
          "def"
        ],
        "expected": 0
      }
    ],
    "hiddenCases": [
      {
        "input": [
          "abcde",
          "ace"
        ],
        "expected": 3
      },
      {
        "input": [
          "abc",
          "abc"
        ],
        "expected": 3
      },
      {
        "input": [
          "abc",
          "def"
        ],
        "expected": 0
      }
    ]
  },
  "longest-common-subsequence-2d-dp": {
    "id": "p-44",
    "slug": "longest-common-subsequence-2d-dp",
    "title": "Longest Common Subsequence",
    "publicCases": [
      {
        "input": [
          "abcde",
          "ace"
        ],
        "expected": 3
      },
      {
        "input": [
          "abc",
          "abc"
        ],
        "expected": 3
      },
      {
        "input": [
          "abc",
          "def"
        ],
        "expected": 0
      }
    ],
    "hiddenCases": [
      {
        "input": [
          "abcde",
          "ace"
        ],
        "expected": 3
      },
      {
        "input": [
          "abc",
          "abc"
        ],
        "expected": 3
      },
      {
        "input": [
          "abc",
          "def"
        ],
        "expected": 0
      }
    ]
  },
  "p-45": {
    "id": "p-45",
    "slug": "unique-paths-grid-combinatorics",
    "title": "Unique Paths Grid",
    "publicCases": [
      {
        "input": [
          3,
          7
        ],
        "expected": 28
      },
      {
        "input": [
          3,
          2
        ],
        "expected": 3
      },
      {
        "input": [
          1,
          1
        ],
        "expected": 1
      }
    ],
    "hiddenCases": [
      {
        "input": [
          3,
          7
        ],
        "expected": 28
      },
      {
        "input": [
          3,
          2
        ],
        "expected": 3
      },
      {
        "input": [
          1,
          1
        ],
        "expected": 1
      }
    ]
  },
  "unique-paths-grid-combinatorics": {
    "id": "p-45",
    "slug": "unique-paths-grid-combinatorics",
    "title": "Unique Paths Grid",
    "publicCases": [
      {
        "input": [
          3,
          7
        ],
        "expected": 28
      },
      {
        "input": [
          3,
          2
        ],
        "expected": 3
      },
      {
        "input": [
          1,
          1
        ],
        "expected": 1
      }
    ],
    "hiddenCases": [
      {
        "input": [
          3,
          7
        ],
        "expected": 28
      },
      {
        "input": [
          3,
          2
        ],
        "expected": 3
      },
      {
        "input": [
          1,
          1
        ],
        "expected": 1
      }
    ]
  },
  "p-46": {
    "id": "p-46",
    "slug": "edit-distance-levenshtein",
    "title": "Edit Distance (Levenshtein)",
    "publicCases": [
      {
        "input": [
          "horse",
          "ros"
        ],
        "expected": 3
      },
      {
        "input": [
          "intention",
          "execution"
        ],
        "expected": 5
      },
      {
        "input": [
          "",
          "a"
        ],
        "expected": 1
      }
    ],
    "hiddenCases": [
      {
        "input": [
          "horse",
          "ros"
        ],
        "expected": 3
      },
      {
        "input": [
          "intention",
          "execution"
        ],
        "expected": 5
      },
      {
        "input": [
          "",
          "a"
        ],
        "expected": 1
      }
    ]
  },
  "edit-distance-levenshtein": {
    "id": "p-46",
    "slug": "edit-distance-levenshtein",
    "title": "Edit Distance (Levenshtein)",
    "publicCases": [
      {
        "input": [
          "horse",
          "ros"
        ],
        "expected": 3
      },
      {
        "input": [
          "intention",
          "execution"
        ],
        "expected": 5
      },
      {
        "input": [
          "",
          "a"
        ],
        "expected": 1
      }
    ],
    "hiddenCases": [
      {
        "input": [
          "horse",
          "ros"
        ],
        "expected": 3
      },
      {
        "input": [
          "intention",
          "execution"
        ],
        "expected": 5
      },
      {
        "input": [
          "",
          "a"
        ],
        "expected": 1
      }
    ]
  },
  "p-47": {
    "id": "p-47",
    "slug": "subsets-power-set-backtracking",
    "title": "Subsets Power Set",
    "publicCases": [
      {
        "input": [
          [
            1,
            2,
            3
          ]
        ],
        "expected": [
          [],
          [
            1
          ],
          [
            1,
            2
          ],
          [
            1,
            2,
            3
          ],
          [
            1,
            3
          ],
          [
            2
          ],
          [
            2,
            3
          ],
          [
            3
          ]
        ]
      },
      {
        "input": [
          [
            0
          ]
        ],
        "expected": [
          [],
          [
            0
          ]
        ]
      }
    ],
    "hiddenCases": [
      {
        "input": [
          [
            1,
            2,
            3
          ]
        ],
        "expected": [
          [],
          [
            1
          ],
          [
            1,
            2
          ],
          [
            1,
            2,
            3
          ],
          [
            1,
            3
          ],
          [
            2
          ],
          [
            2,
            3
          ],
          [
            3
          ]
        ]
      },
      {
        "input": [
          [
            0
          ]
        ],
        "expected": [
          [],
          [
            0
          ]
        ]
      }
    ]
  },
  "subsets-power-set-backtracking": {
    "id": "p-47",
    "slug": "subsets-power-set-backtracking",
    "title": "Subsets Power Set",
    "publicCases": [
      {
        "input": [
          [
            1,
            2,
            3
          ]
        ],
        "expected": [
          [],
          [
            1
          ],
          [
            1,
            2
          ],
          [
            1,
            2,
            3
          ],
          [
            1,
            3
          ],
          [
            2
          ],
          [
            2,
            3
          ],
          [
            3
          ]
        ]
      },
      {
        "input": [
          [
            0
          ]
        ],
        "expected": [
          [],
          [
            0
          ]
        ]
      }
    ],
    "hiddenCases": [
      {
        "input": [
          [
            1,
            2,
            3
          ]
        ],
        "expected": [
          [],
          [
            1
          ],
          [
            1,
            2
          ],
          [
            1,
            2,
            3
          ],
          [
            1,
            3
          ],
          [
            2
          ],
          [
            2,
            3
          ],
          [
            3
          ]
        ]
      },
      {
        "input": [
          [
            0
          ]
        ],
        "expected": [
          [],
          [
            0
          ]
        ]
      }
    ]
  },
  "p-48": {
    "id": "p-48",
    "slug": "combination-sum-target",
    "title": "Combination Sum Target",
    "publicCases": [
      {
        "input": [
          [
            2,
            3,
            6,
            7
          ],
          7
        ],
        "expected": [
          [
            2,
            2,
            3
          ],
          [
            7
          ]
        ]
      },
      {
        "input": [
          [
            2,
            3,
            5
          ],
          8
        ],
        "expected": [
          [
            2,
            2,
            2,
            2
          ],
          [
            2,
            3,
            3
          ],
          [
            3,
            5
          ]
        ]
      }
    ],
    "hiddenCases": [
      {
        "input": [
          [
            2,
            3,
            6,
            7
          ],
          7
        ],
        "expected": [
          [
            2,
            2,
            3
          ],
          [
            7
          ]
        ]
      },
      {
        "input": [
          [
            2,
            3,
            5
          ],
          8
        ],
        "expected": [
          [
            2,
            2,
            2,
            2
          ],
          [
            2,
            3,
            3
          ],
          [
            3,
            5
          ]
        ]
      }
    ]
  },
  "combination-sum-target": {
    "id": "p-48",
    "slug": "combination-sum-target",
    "title": "Combination Sum Target",
    "publicCases": [
      {
        "input": [
          [
            2,
            3,
            6,
            7
          ],
          7
        ],
        "expected": [
          [
            2,
            2,
            3
          ],
          [
            7
          ]
        ]
      },
      {
        "input": [
          [
            2,
            3,
            5
          ],
          8
        ],
        "expected": [
          [
            2,
            2,
            2,
            2
          ],
          [
            2,
            3,
            3
          ],
          [
            3,
            5
          ]
        ]
      }
    ],
    "hiddenCases": [
      {
        "input": [
          [
            2,
            3,
            6,
            7
          ],
          7
        ],
        "expected": [
          [
            2,
            2,
            3
          ],
          [
            7
          ]
        ]
      },
      {
        "input": [
          [
            2,
            3,
            5
          ],
          8
        ],
        "expected": [
          [
            2,
            2,
            2,
            2
          ],
          [
            2,
            3,
            3
          ],
          [
            3,
            5
          ]
        ]
      }
    ]
  },
  "p-49": {
    "id": "p-49",
    "slug": "permutations-full-backtracking",
    "title": "Generate Permutations",
    "publicCases": [
      {
        "input": [
          [
            1,
            2,
            3
          ]
        ],
        "expected": [
          [
            1,
            2,
            3
          ],
          [
            1,
            3,
            2
          ],
          [
            2,
            1,
            3
          ],
          [
            2,
            3,
            1
          ],
          [
            3,
            1,
            2
          ],
          [
            3,
            2,
            1
          ]
        ]
      },
      {
        "input": [
          [
            0,
            1
          ]
        ],
        "expected": [
          [
            0,
            1
          ],
          [
            1,
            0
          ]
        ]
      }
    ],
    "hiddenCases": [
      {
        "input": [
          [
            1,
            2,
            3
          ]
        ],
        "expected": [
          [
            1,
            2,
            3
          ],
          [
            1,
            3,
            2
          ],
          [
            2,
            1,
            3
          ],
          [
            2,
            3,
            1
          ],
          [
            3,
            1,
            2
          ],
          [
            3,
            2,
            1
          ]
        ]
      },
      {
        "input": [
          [
            0,
            1
          ]
        ],
        "expected": [
          [
            0,
            1
          ],
          [
            1,
            0
          ]
        ]
      }
    ]
  },
  "permutations-full-backtracking": {
    "id": "p-49",
    "slug": "permutations-full-backtracking",
    "title": "Generate Permutations",
    "publicCases": [
      {
        "input": [
          [
            1,
            2,
            3
          ]
        ],
        "expected": [
          [
            1,
            2,
            3
          ],
          [
            1,
            3,
            2
          ],
          [
            2,
            1,
            3
          ],
          [
            2,
            3,
            1
          ],
          [
            3,
            1,
            2
          ],
          [
            3,
            2,
            1
          ]
        ]
      },
      {
        "input": [
          [
            0,
            1
          ]
        ],
        "expected": [
          [
            0,
            1
          ],
          [
            1,
            0
          ]
        ]
      }
    ],
    "hiddenCases": [
      {
        "input": [
          [
            1,
            2,
            3
          ]
        ],
        "expected": [
          [
            1,
            2,
            3
          ],
          [
            1,
            3,
            2
          ],
          [
            2,
            1,
            3
          ],
          [
            2,
            3,
            1
          ],
          [
            3,
            1,
            2
          ],
          [
            3,
            2,
            1
          ]
        ]
      },
      {
        "input": [
          [
            0,
            1
          ]
        ],
        "expected": [
          [
            0,
            1
          ],
          [
            1,
            0
          ]
        ]
      }
    ]
  },
  "p-50": {
    "id": "p-50",
    "slug": "single-number-xor-trick",
    "title": "Single Unique Number",
    "publicCases": [
      {
        "input": [
          [
            2,
            2,
            1
          ]
        ],
        "expected": 1
      },
      {
        "input": [
          [
            4,
            1,
            2,
            1,
            2
          ]
        ],
        "expected": 4
      },
      {
        "input": [
          [
            1
          ]
        ],
        "expected": 1
      }
    ],
    "hiddenCases": [
      {
        "input": [
          [
            1
          ]
        ],
        "expected": 1
      },
      {
        "input": [
          [
            4,
            1,
            2,
            1,
            2
          ]
        ],
        "expected": 4
      }
    ]
  },
  "single-number-xor-trick": {
    "id": "p-50",
    "slug": "single-number-xor-trick",
    "title": "Single Unique Number",
    "publicCases": [
      {
        "input": [
          [
            2,
            2,
            1
          ]
        ],
        "expected": 1
      },
      {
        "input": [
          [
            4,
            1,
            2,
            1,
            2
          ]
        ],
        "expected": 4
      },
      {
        "input": [
          [
            1
          ]
        ],
        "expected": 1
      }
    ],
    "hiddenCases": [
      {
        "input": [
          [
            1
          ]
        ],
        "expected": 1
      },
      {
        "input": [
          [
            4,
            1,
            2,
            1,
            2
          ]
        ],
        "expected": 4
      }
    ]
  },
  "p-51": {
    "id": "p-51",
    "slug": "spiral-matrix",
    "title": "Spiral Matrix Traversal",
    "publicCases": [
      {
        "input": [
          [
            [
              1,
              2,
              3
            ],
            [
              4,
              5,
              6
            ],
            [
              7,
              8,
              9
            ]
          ]
        ],
        "expected": [
          1,
          2,
          3,
          6,
          9,
          8,
          7,
          4,
          5
        ]
      },
      {
        "input": [
          [
            [
              1,
              2,
              3,
              4
            ],
            [
              5,
              6,
              7,
              8
            ],
            [
              9,
              10,
              11,
              12
            ]
          ]
        ],
        "expected": [
          1,
          2,
          3,
          4,
          8,
          12,
          11,
          10,
          9,
          5,
          6,
          7
        ]
      },
      {
        "input": [
          [
            [
              1
            ]
          ]
        ],
        "expected": [
          1
        ]
      }
    ],
    "hiddenCases": [
      {
        "input": [
          [
            [
              1,
              2,
              3
            ],
            [
              4,
              5,
              6
            ],
            [
              7,
              8,
              9
            ]
          ]
        ],
        "expected": [
          1,
          2,
          3,
          6,
          9,
          8,
          7,
          4,
          5
        ]
      },
      {
        "input": [
          [
            [
              1,
              2,
              3,
              4
            ],
            [
              5,
              6,
              7,
              8
            ],
            [
              9,
              10,
              11,
              12
            ]
          ]
        ],
        "expected": [
          1,
          2,
          3,
          4,
          8,
          12,
          11,
          10,
          9,
          5,
          6,
          7
        ]
      },
      {
        "input": [
          [
            [
              1
            ]
          ]
        ],
        "expected": [
          1
        ]
      }
    ]
  },
  "spiral-matrix": {
    "id": "p-51",
    "slug": "spiral-matrix",
    "title": "Spiral Matrix Traversal",
    "publicCases": [
      {
        "input": [
          [
            [
              1,
              2,
              3
            ],
            [
              4,
              5,
              6
            ],
            [
              7,
              8,
              9
            ]
          ]
        ],
        "expected": [
          1,
          2,
          3,
          6,
          9,
          8,
          7,
          4,
          5
        ]
      },
      {
        "input": [
          [
            [
              1,
              2,
              3,
              4
            ],
            [
              5,
              6,
              7,
              8
            ],
            [
              9,
              10,
              11,
              12
            ]
          ]
        ],
        "expected": [
          1,
          2,
          3,
          4,
          8,
          12,
          11,
          10,
          9,
          5,
          6,
          7
        ]
      },
      {
        "input": [
          [
            [
              1
            ]
          ]
        ],
        "expected": [
          1
        ]
      }
    ],
    "hiddenCases": [
      {
        "input": [
          [
            [
              1,
              2,
              3
            ],
            [
              4,
              5,
              6
            ],
            [
              7,
              8,
              9
            ]
          ]
        ],
        "expected": [
          1,
          2,
          3,
          6,
          9,
          8,
          7,
          4,
          5
        ]
      },
      {
        "input": [
          [
            [
              1,
              2,
              3,
              4
            ],
            [
              5,
              6,
              7,
              8
            ],
            [
              9,
              10,
              11,
              12
            ]
          ]
        ],
        "expected": [
          1,
          2,
          3,
          4,
          8,
          12,
          11,
          10,
          9,
          5,
          6,
          7
        ]
      },
      {
        "input": [
          [
            [
              1
            ]
          ]
        ],
        "expected": [
          1
        ]
      }
    ]
  },
  "p-52": {
    "id": "p-52",
    "slug": "word-search",
    "title": "Word Search in Grid",
    "publicCases": [
      {
        "input": [
          [
            [
              "A",
              "B",
              "C",
              "E"
            ],
            [
              "S",
              "F",
              "C",
              "S"
            ],
            [
              "A",
              "D",
              "E",
              "E"
            ]
          ],
          "ABCCED"
        ],
        "expected": true
      },
      {
        "input": [
          [
            [
              "A",
              "B",
              "C",
              "E"
            ],
            [
              "S",
              "F",
              "C",
              "S"
            ],
            [
              "A",
              "D",
              "E",
              "E"
            ]
          ],
          "SEE"
        ],
        "expected": true
      },
      {
        "input": [
          [
            [
              "A",
              "B",
              "C",
              "E"
            ],
            [
              "S",
              "F",
              "C",
              "S"
            ],
            [
              "A",
              "D",
              "E",
              "E"
            ]
          ],
          "ABCB"
        ],
        "expected": false
      }
    ],
    "hiddenCases": [
      {
        "input": [
          [
            [
              "A",
              "B",
              "C",
              "E"
            ],
            [
              "S",
              "F",
              "C",
              "S"
            ],
            [
              "A",
              "D",
              "E",
              "E"
            ]
          ],
          "ABCCED"
        ],
        "expected": true
      },
      {
        "input": [
          [
            [
              "A",
              "B",
              "C",
              "E"
            ],
            [
              "S",
              "F",
              "C",
              "S"
            ],
            [
              "A",
              "D",
              "E",
              "E"
            ]
          ],
          "SEE"
        ],
        "expected": true
      },
      {
        "input": [
          [
            [
              "A",
              "B",
              "C",
              "E"
            ],
            [
              "S",
              "F",
              "C",
              "S"
            ],
            [
              "A",
              "D",
              "E",
              "E"
            ]
          ],
          "ABCB"
        ],
        "expected": false
      }
    ]
  },
  "word-search": {
    "id": "p-52",
    "slug": "word-search",
    "title": "Word Search in Grid",
    "publicCases": [
      {
        "input": [
          [
            [
              "A",
              "B",
              "C",
              "E"
            ],
            [
              "S",
              "F",
              "C",
              "S"
            ],
            [
              "A",
              "D",
              "E",
              "E"
            ]
          ],
          "ABCCED"
        ],
        "expected": true
      },
      {
        "input": [
          [
            [
              "A",
              "B",
              "C",
              "E"
            ],
            [
              "S",
              "F",
              "C",
              "S"
            ],
            [
              "A",
              "D",
              "E",
              "E"
            ]
          ],
          "SEE"
        ],
        "expected": true
      },
      {
        "input": [
          [
            [
              "A",
              "B",
              "C",
              "E"
            ],
            [
              "S",
              "F",
              "C",
              "S"
            ],
            [
              "A",
              "D",
              "E",
              "E"
            ]
          ],
          "ABCB"
        ],
        "expected": false
      }
    ],
    "hiddenCases": [
      {
        "input": [
          [
            [
              "A",
              "B",
              "C",
              "E"
            ],
            [
              "S",
              "F",
              "C",
              "S"
            ],
            [
              "A",
              "D",
              "E",
              "E"
            ]
          ],
          "ABCCED"
        ],
        "expected": true
      },
      {
        "input": [
          [
            [
              "A",
              "B",
              "C",
              "E"
            ],
            [
              "S",
              "F",
              "C",
              "S"
            ],
            [
              "A",
              "D",
              "E",
              "E"
            ]
          ],
          "SEE"
        ],
        "expected": true
      },
      {
        "input": [
          [
            [
              "A",
              "B",
              "C",
              "E"
            ],
            [
              "S",
              "F",
              "C",
              "S"
            ],
            [
              "A",
              "D",
              "E",
              "E"
            ]
          ],
          "ABCB"
        ],
        "expected": false
      }
    ]
  },
  "p-53": {
    "id": "p-53",
    "slug": "house-robber-ii",
    "title": "House Robber in a Circle",
    "publicCases": [
      {
        "input": [
          [
            2,
            3,
            2
          ]
        ],
        "expected": 3
      },
      {
        "input": [
          [
            1,
            2,
            3,
            1
          ]
        ],
        "expected": 4
      },
      {
        "input": [
          [
            1,
            2,
            3
          ]
        ],
        "expected": 3
      },
      {
        "input": [
          [
            1
          ]
        ],
        "expected": 1
      }
    ],
    "hiddenCases": [
      {
        "input": [
          [
            2,
            3,
            2
          ]
        ],
        "expected": 3
      },
      {
        "input": [
          [
            1,
            2,
            3,
            1
          ]
        ],
        "expected": 4
      },
      {
        "input": [
          [
            1,
            2,
            3
          ]
        ],
        "expected": 3
      },
      {
        "input": [
          [
            1
          ]
        ],
        "expected": 1
      }
    ]
  },
  "house-robber-ii": {
    "id": "p-53",
    "slug": "house-robber-ii",
    "title": "House Robber in a Circle",
    "publicCases": [
      {
        "input": [
          [
            2,
            3,
            2
          ]
        ],
        "expected": 3
      },
      {
        "input": [
          [
            1,
            2,
            3,
            1
          ]
        ],
        "expected": 4
      },
      {
        "input": [
          [
            1,
            2,
            3
          ]
        ],
        "expected": 3
      },
      {
        "input": [
          [
            1
          ]
        ],
        "expected": 1
      }
    ],
    "hiddenCases": [
      {
        "input": [
          [
            2,
            3,
            2
          ]
        ],
        "expected": 3
      },
      {
        "input": [
          [
            1,
            2,
            3,
            1
          ]
        ],
        "expected": 4
      },
      {
        "input": [
          [
            1,
            2,
            3
          ]
        ],
        "expected": 3
      },
      {
        "input": [
          [
            1
          ]
        ],
        "expected": 1
      }
    ]
  },
  "p-54": {
    "id": "p-54",
    "slug": "kth-smallest-element-in-a-bst",
    "title": "Kth Smallest Element in a BST",
    "publicCases": [
      {
        "input": [
          [
            3,
            1,
            4,
            null,
            2
          ],
          1
        ],
        "expected": 1
      },
      {
        "input": [
          [
            5,
            3,
            6,
            2,
            4,
            null,
            null,
            1
          ],
          3
        ],
        "expected": 3
      },
      {
        "input": [
          [
            10,
            5,
            15
          ],
          2
        ],
        "expected": 10
      }
    ],
    "hiddenCases": [
      {
        "input": [
          [
            3,
            1,
            4,
            null,
            2
          ],
          1
        ],
        "expected": 1
      },
      {
        "input": [
          [
            5,
            3,
            6,
            2,
            4,
            null,
            null,
            1
          ],
          3
        ],
        "expected": 3
      },
      {
        "input": [
          [
            10,
            5,
            15
          ],
          2
        ],
        "expected": 10
      }
    ]
  },
  "kth-smallest-element-in-a-bst": {
    "id": "p-54",
    "slug": "kth-smallest-element-in-a-bst",
    "title": "Kth Smallest Element in a BST",
    "publicCases": [
      {
        "input": [
          [
            3,
            1,
            4,
            null,
            2
          ],
          1
        ],
        "expected": 1
      },
      {
        "input": [
          [
            5,
            3,
            6,
            2,
            4,
            null,
            null,
            1
          ],
          3
        ],
        "expected": 3
      },
      {
        "input": [
          [
            10,
            5,
            15
          ],
          2
        ],
        "expected": 10
      }
    ],
    "hiddenCases": [
      {
        "input": [
          [
            3,
            1,
            4,
            null,
            2
          ],
          1
        ],
        "expected": 1
      },
      {
        "input": [
          [
            5,
            3,
            6,
            2,
            4,
            null,
            null,
            1
          ],
          3
        ],
        "expected": 3
      },
      {
        "input": [
          [
            10,
            5,
            15
          ],
          2
        ],
        "expected": 10
      }
    ]
  },
  "p-55": {
    "id": "p-55",
    "slug": "lowest-common-ancestor-binary-tree",
    "title": "Lowest Common Ancestor of a Binary Tree",
    "publicCases": [
      {
        "input": [
          [
            3,
            5,
            1,
            6,
            2,
            0,
            8
          ],
          5,
          1
        ],
        "expected": 3
      },
      {
        "input": [
          [
            3,
            5,
            1,
            6,
            2,
            0,
            8
          ],
          5,
          4
        ],
        "expected": 5
      },
      {
        "input": [
          [
            1,
            2
          ],
          1,
          2
        ],
        "expected": 1
      }
    ],
    "hiddenCases": [
      {
        "input": [
          [
            3,
            5,
            1,
            6,
            2,
            0,
            8
          ],
          5,
          1
        ],
        "expected": 3
      },
      {
        "input": [
          [
            3,
            5,
            1,
            6,
            2,
            0,
            8
          ],
          5,
          4
        ],
        "expected": 5
      },
      {
        "input": [
          [
            1,
            2
          ],
          1,
          2
        ],
        "expected": 1
      }
    ]
  },
  "p-56": {
    "id": "p-56",
    "slug": "pacific-atlantic-water-flow",
    "title": "Pacific Atlantic Water Flow",
    "publicCases": [
      {
        "input": [
          [
            [
              1,
              2,
              2,
              3,
              5
            ],
            [
              3,
              2,
              3,
              4,
              4
            ],
            [
              2,
              4,
              5,
              3,
              1
            ],
            [
              6,
              7,
              1,
              4,
              5
            ],
            [
              5,
              1,
              1,
              2,
              4
            ]
          ]
        ],
        "expected": [
          [
            0,
            4
          ],
          [
            1,
            3
          ],
          [
            1,
            4
          ],
          [
            2,
            2
          ],
          [
            3,
            0
          ],
          [
            3,
            1
          ],
          [
            4,
            0
          ]
        ]
      },
      {
        "input": [
          [
            [
              1
            ]
          ]
        ],
        "expected": [
          [
            0,
            0
          ]
        ]
      }
    ],
    "hiddenCases": [
      {
        "input": [
          [
            [
              1,
              2,
              2,
              3,
              5
            ],
            [
              3,
              2,
              3,
              4,
              4
            ],
            [
              2,
              4,
              5,
              3,
              1
            ],
            [
              6,
              7,
              1,
              4,
              5
            ],
            [
              5,
              1,
              1,
              2,
              4
            ]
          ]
        ],
        "expected": [
          [
            0,
            4
          ],
          [
            1,
            3
          ],
          [
            1,
            4
          ],
          [
            2,
            2
          ],
          [
            3,
            0
          ],
          [
            3,
            1
          ],
          [
            4,
            0
          ]
        ]
      },
      {
        "input": [
          [
            [
              1
            ]
          ]
        ],
        "expected": [
          [
            0,
            0
          ]
        ]
      }
    ]
  },
  "p-57": {
    "id": "p-57",
    "slug": "course-schedule-ii",
    "title": "Course Schedule Order (TopoSort)",
    "publicCases": [
      {
        "input": [
          2,
          [
            [
              1,
              0
            ]
          ]
        ],
        "expected": [
          0,
          1
        ]
      },
      {
        "input": [
          4,
          [
            [
              1,
              0
            ],
            [
              2,
              0
            ],
            [
              3,
              1
            ],
            [
              3,
              2
            ]
          ]
        ],
        "expected": [
          0,
          1,
          2,
          3
        ]
      },
      {
        "input": [
          1,
          []
        ],
        "expected": [
          0
        ]
      }
    ],
    "hiddenCases": [
      {
        "input": [
          2,
          [
            [
              1,
              0
            ]
          ]
        ],
        "expected": [
          0,
          1
        ]
      },
      {
        "input": [
          4,
          [
            [
              1,
              0
            ],
            [
              2,
              0
            ],
            [
              3,
              1
            ],
            [
              3,
              2
            ]
          ]
        ],
        "expected": [
          0,
          1,
          2,
          3
        ]
      },
      {
        "input": [
          1,
          []
        ],
        "expected": [
          0
        ]
      }
    ]
  },
  "course-schedule-ii": {
    "id": "p-57",
    "slug": "course-schedule-ii",
    "title": "Course Schedule Order (TopoSort)",
    "publicCases": [
      {
        "input": [
          2,
          [
            [
              1,
              0
            ]
          ]
        ],
        "expected": [
          0,
          1
        ]
      },
      {
        "input": [
          4,
          [
            [
              1,
              0
            ],
            [
              2,
              0
            ],
            [
              3,
              1
            ],
            [
              3,
              2
            ]
          ]
        ],
        "expected": [
          0,
          1,
          2,
          3
        ]
      },
      {
        "input": [
          1,
          []
        ],
        "expected": [
          0
        ]
      }
    ],
    "hiddenCases": [
      {
        "input": [
          2,
          [
            [
              1,
              0
            ]
          ]
        ],
        "expected": [
          0,
          1
        ]
      },
      {
        "input": [
          4,
          [
            [
              1,
              0
            ],
            [
              2,
              0
            ],
            [
              3,
              1
            ],
            [
              3,
              2
            ]
          ]
        ],
        "expected": [
          0,
          1,
          2,
          3
        ]
      },
      {
        "input": [
          1,
          []
        ],
        "expected": [
          0
        ]
      }
    ]
  },
  "p-58": {
    "id": "p-58",
    "slug": "meeting-rooms-ii",
    "title": "Meeting Rooms II (Min Conference Rooms)",
    "publicCases": [
      {
        "input": [
          [
            [
              0,
              30
            ],
            [
              5,
              10
            ],
            [
              15,
              20
            ]
          ]
        ],
        "expected": 2
      },
      {
        "input": [
          [
            [
              7,
              10
            ],
            [
              2,
              4
            ]
          ]
        ],
        "expected": 1
      },
      {
        "input": [
          [
            [
              1,
              5
            ],
            [
              5,
              10
            ]
          ]
        ],
        "expected": 1
      }
    ],
    "hiddenCases": [
      {
        "input": [
          [
            [
              0,
              30
            ],
            [
              5,
              10
            ],
            [
              15,
              20
            ]
          ]
        ],
        "expected": 2
      },
      {
        "input": [
          [
            [
              7,
              10
            ],
            [
              2,
              4
            ]
          ]
        ],
        "expected": 1
      },
      {
        "input": [
          [
            [
              1,
              5
            ],
            [
              5,
              10
            ]
          ]
        ],
        "expected": 1
      }
    ]
  },
  "meeting-rooms-ii": {
    "id": "p-58",
    "slug": "meeting-rooms-ii",
    "title": "Meeting Rooms II (Min Conference Rooms)",
    "publicCases": [
      {
        "input": [
          [
            [
              0,
              30
            ],
            [
              5,
              10
            ],
            [
              15,
              20
            ]
          ]
        ],
        "expected": 2
      },
      {
        "input": [
          [
            [
              7,
              10
            ],
            [
              2,
              4
            ]
          ]
        ],
        "expected": 1
      },
      {
        "input": [
          [
            [
              1,
              5
            ],
            [
              5,
              10
            ]
          ]
        ],
        "expected": 1
      }
    ],
    "hiddenCases": [
      {
        "input": [
          [
            [
              0,
              30
            ],
            [
              5,
              10
            ],
            [
              15,
              20
            ]
          ]
        ],
        "expected": 2
      },
      {
        "input": [
          [
            [
              7,
              10
            ],
            [
              2,
              4
            ]
          ]
        ],
        "expected": 1
      },
      {
        "input": [
          [
            [
              1,
              5
            ],
            [
              5,
              10
            ]
          ]
        ],
        "expected": 1
      }
    ]
  },
  "p-59": {
    "id": "p-59",
    "slug": "non-overlapping-intervals",
    "title": "Non-Overlapping Intervals Removal",
    "publicCases": [
      {
        "input": [
          [
            [
              1,
              2
            ],
            [
              2,
              3
            ],
            [
              3,
              4
            ],
            [
              1,
              3
            ]
          ]
        ],
        "expected": 1
      },
      {
        "input": [
          [
            [
              1,
              2
            ],
            [
              1,
              2
            ],
            [
              1,
              2
            ]
          ]
        ],
        "expected": 2
      },
      {
        "input": [
          [
            [
              1,
              2
            ],
            [
              2,
              3
            ]
          ]
        ],
        "expected": 0
      }
    ],
    "hiddenCases": [
      {
        "input": [
          [
            [
              1,
              2
            ],
            [
              2,
              3
            ],
            [
              3,
              4
            ],
            [
              1,
              3
            ]
          ]
        ],
        "expected": 1
      },
      {
        "input": [
          [
            [
              1,
              2
            ],
            [
              1,
              2
            ],
            [
              1,
              2
            ]
          ]
        ],
        "expected": 2
      },
      {
        "input": [
          [
            [
              1,
              2
            ],
            [
              2,
              3
            ]
          ]
        ],
        "expected": 0
      }
    ]
  },
  "non-overlapping-intervals": {
    "id": "p-59",
    "slug": "non-overlapping-intervals",
    "title": "Non-Overlapping Intervals Removal",
    "publicCases": [
      {
        "input": [
          [
            [
              1,
              2
            ],
            [
              2,
              3
            ],
            [
              3,
              4
            ],
            [
              1,
              3
            ]
          ]
        ],
        "expected": 1
      },
      {
        "input": [
          [
            [
              1,
              2
            ],
            [
              1,
              2
            ],
            [
              1,
              2
            ]
          ]
        ],
        "expected": 2
      },
      {
        "input": [
          [
            [
              1,
              2
            ],
            [
              2,
              3
            ]
          ]
        ],
        "expected": 0
      }
    ],
    "hiddenCases": [
      {
        "input": [
          [
            [
              1,
              2
            ],
            [
              2,
              3
            ],
            [
              3,
              4
            ],
            [
              1,
              3
            ]
          ]
        ],
        "expected": 1
      },
      {
        "input": [
          [
            [
              1,
              2
            ],
            [
              1,
              2
            ],
            [
              1,
              2
            ]
          ]
        ],
        "expected": 2
      },
      {
        "input": [
          [
            [
              1,
              2
            ],
            [
              2,
              3
            ]
          ]
        ],
        "expected": 0
      }
    ]
  },
  "p-60": {
    "id": "p-60",
    "slug": "minimum-window-substring",
    "title": "Minimum Window Substring",
    "publicCases": [
      {
        "input": [
          "ADOBECODEBANC",
          "ABC"
        ],
        "expected": "BANC"
      },
      {
        "input": [
          "a",
          "a"
        ],
        "expected": "a"
      },
      {
        "input": [
          "a",
          "aa"
        ],
        "expected": ""
      }
    ],
    "hiddenCases": [
      {
        "input": [
          "ADOBECODEBANC",
          "ABC"
        ],
        "expected": "BANC"
      },
      {
        "input": [
          "a",
          "a"
        ],
        "expected": "a"
      },
      {
        "input": [
          "a",
          "aa"
        ],
        "expected": ""
      }
    ]
  },
  "minimum-window-substring": {
    "id": "p-60",
    "slug": "minimum-window-substring",
    "title": "Minimum Window Substring",
    "publicCases": [
      {
        "input": [
          "ADOBECODEBANC",
          "ABC"
        ],
        "expected": "BANC"
      },
      {
        "input": [
          "a",
          "a"
        ],
        "expected": "a"
      },
      {
        "input": [
          "a",
          "aa"
        ],
        "expected": ""
      }
    ],
    "hiddenCases": [
      {
        "input": [
          "ADOBECODEBANC",
          "ABC"
        ],
        "expected": "BANC"
      },
      {
        "input": [
          "a",
          "a"
        ],
        "expected": "a"
      },
      {
        "input": [
          "a",
          "aa"
        ],
        "expected": ""
      }
    ]
  },
  "p-61": {
    "id": "p-61",
    "slug": "trapping-rain-water",
    "title": "Trapping Rain Water",
    "publicCases": [
      {
        "input": [
          [
            0,
            1,
            0,
            2,
            1,
            0,
            1,
            3,
            2,
            1,
            2,
            1
          ]
        ],
        "expected": 6
      },
      {
        "input": [
          [
            4,
            2,
            0,
            3,
            2,
            5
          ]
        ],
        "expected": 9
      },
      {
        "input": [
          [
            1,
            2
          ]
        ],
        "expected": 0
      }
    ],
    "hiddenCases": [
      {
        "input": [
          [
            0,
            1,
            0,
            2,
            1,
            0,
            1,
            3,
            2,
            1,
            2,
            1
          ]
        ],
        "expected": 6
      },
      {
        "input": [
          [
            4,
            2,
            0,
            3,
            2,
            5
          ]
        ],
        "expected": 9
      },
      {
        "input": [
          [
            1,
            2
          ]
        ],
        "expected": 0
      }
    ]
  },
  "trapping-rain-water": {
    "id": "p-61",
    "slug": "trapping-rain-water",
    "title": "Trapping Rain Water",
    "publicCases": [
      {
        "input": [
          [
            0,
            1,
            0,
            2,
            1,
            0,
            1,
            3,
            2,
            1,
            2,
            1
          ]
        ],
        "expected": 6
      },
      {
        "input": [
          [
            4,
            2,
            0,
            3,
            2,
            5
          ]
        ],
        "expected": 9
      },
      {
        "input": [
          [
            1,
            2
          ]
        ],
        "expected": 0
      }
    ],
    "hiddenCases": [
      {
        "input": [
          [
            0,
            1,
            0,
            2,
            1,
            0,
            1,
            3,
            2,
            1,
            2,
            1
          ]
        ],
        "expected": 6
      },
      {
        "input": [
          [
            4,
            2,
            0,
            3,
            2,
            5
          ]
        ],
        "expected": 9
      },
      {
        "input": [
          [
            1,
            2
          ]
        ],
        "expected": 0
      }
    ]
  },
  "p-62": {
    "id": "p-62",
    "slug": "sliding-window-maximum",
    "title": "Sliding Window Maximum",
    "publicCases": [
      {
        "input": [
          [
            1,
            3,
            -1,
            -3,
            5,
            3,
            6,
            7
          ],
          3
        ],
        "expected": [
          3,
          3,
          5,
          5,
          6,
          7
        ]
      },
      {
        "input": [
          [
            1
          ],
          1
        ],
        "expected": [
          1
        ]
      },
      {
        "input": [
          [
            1,
            -1
          ],
          1
        ],
        "expected": [
          1,
          -1
        ]
      }
    ],
    "hiddenCases": [
      {
        "input": [
          [
            1,
            3,
            -1,
            -3,
            5,
            3,
            6,
            7
          ],
          3
        ],
        "expected": [
          3,
          3,
          5,
          5,
          6,
          7
        ]
      },
      {
        "input": [
          [
            1
          ],
          1
        ],
        "expected": [
          1
        ]
      },
      {
        "input": [
          [
            1,
            -1
          ],
          1
        ],
        "expected": [
          1,
          -1
        ]
      }
    ]
  },
  "sliding-window-maximum": {
    "id": "p-62",
    "slug": "sliding-window-maximum",
    "title": "Sliding Window Maximum",
    "publicCases": [
      {
        "input": [
          [
            1,
            3,
            -1,
            -3,
            5,
            3,
            6,
            7
          ],
          3
        ],
        "expected": [
          3,
          3,
          5,
          5,
          6,
          7
        ]
      },
      {
        "input": [
          [
            1
          ],
          1
        ],
        "expected": [
          1
        ]
      },
      {
        "input": [
          [
            1,
            -1
          ],
          1
        ],
        "expected": [
          1,
          -1
        ]
      }
    ],
    "hiddenCases": [
      {
        "input": [
          [
            1,
            3,
            -1,
            -3,
            5,
            3,
            6,
            7
          ],
          3
        ],
        "expected": [
          3,
          3,
          5,
          5,
          6,
          7
        ]
      },
      {
        "input": [
          [
            1
          ],
          1
        ],
        "expected": [
          1
        ]
      },
      {
        "input": [
          [
            1,
            -1
          ],
          1
        ],
        "expected": [
          1,
          -1
        ]
      }
    ]
  },
  "p-63": {
    "id": "p-63",
    "slug": "word-break",
    "title": "Word Break Problem",
    "publicCases": [
      {
        "input": [
          "leetcode",
          [
            "leet",
            "code"
          ]
        ],
        "expected": true
      },
      {
        "input": [
          "applepenapple",
          [
            "apple",
            "pen"
          ]
        ],
        "expected": true
      },
      {
        "input": [
          "catsandog",
          [
            "cats",
            "dog",
            "sand",
            "and",
            "cat"
          ]
        ],
        "expected": false
      }
    ],
    "hiddenCases": [
      {
        "input": [
          "leetcode",
          [
            "leet",
            "code"
          ]
        ],
        "expected": true
      },
      {
        "input": [
          "applepenapple",
          [
            "apple",
            "pen"
          ]
        ],
        "expected": true
      },
      {
        "input": [
          "catsandog",
          [
            "cats",
            "dog",
            "sand",
            "and",
            "cat"
          ]
        ],
        "expected": false
      }
    ]
  },
  "word-break": {
    "id": "p-63",
    "slug": "word-break",
    "title": "Word Break Problem",
    "publicCases": [
      {
        "input": [
          "leetcode",
          [
            "leet",
            "code"
          ]
        ],
        "expected": true
      },
      {
        "input": [
          "applepenapple",
          [
            "apple",
            "pen"
          ]
        ],
        "expected": true
      },
      {
        "input": [
          "catsandog",
          [
            "cats",
            "dog",
            "sand",
            "and",
            "cat"
          ]
        ],
        "expected": false
      }
    ],
    "hiddenCases": [
      {
        "input": [
          "leetcode",
          [
            "leet",
            "code"
          ]
        ],
        "expected": true
      },
      {
        "input": [
          "applepenapple",
          [
            "apple",
            "pen"
          ]
        ],
        "expected": true
      },
      {
        "input": [
          "catsandog",
          [
            "cats",
            "dog",
            "sand",
            "and",
            "cat"
          ]
        ],
        "expected": false
      }
    ]
  },
  "p-64": {
    "id": "p-64",
    "slug": "coin-change-ii",
    "title": "Coin Change II (Number of Ways)",
    "publicCases": [
      {
        "input": [
          5,
          [
            1,
            2,
            5
          ]
        ],
        "expected": 4
      },
      {
        "input": [
          3,
          [
            2
          ]
        ],
        "expected": 0
      },
      {
        "input": [
          10,
          [
            10
          ]
        ],
        "expected": 1
      }
    ],
    "hiddenCases": [
      {
        "input": [
          5,
          [
            1,
            2,
            5
          ]
        ],
        "expected": 4
      },
      {
        "input": [
          3,
          [
            2
          ]
        ],
        "expected": 0
      },
      {
        "input": [
          10,
          [
            10
          ]
        ],
        "expected": 1
      }
    ]
  },
  "coin-change-ii": {
    "id": "p-64",
    "slug": "coin-change-ii",
    "title": "Coin Change II (Number of Ways)",
    "publicCases": [
      {
        "input": [
          5,
          [
            1,
            2,
            5
          ]
        ],
        "expected": 4
      },
      {
        "input": [
          3,
          [
            2
          ]
        ],
        "expected": 0
      },
      {
        "input": [
          10,
          [
            10
          ]
        ],
        "expected": 1
      }
    ],
    "hiddenCases": [
      {
        "input": [
          5,
          [
            1,
            2,
            5
          ]
        ],
        "expected": 4
      },
      {
        "input": [
          3,
          [
            2
          ]
        ],
        "expected": 0
      },
      {
        "input": [
          10,
          [
            10
          ]
        ],
        "expected": 1
      }
    ]
  },
  "p-65": {
    "id": "p-65",
    "slug": "longest-increasing-subsequence",
    "title": "Longest Increasing Subsequence",
    "publicCases": [
      {
        "input": [
          [
            10,
            9,
            2,
            5,
            3,
            7,
            101,
            18
          ]
        ],
        "expected": 4
      },
      {
        "input": [
          [
            0,
            1,
            0,
            3,
            2,
            3
          ]
        ],
        "expected": 4
      },
      {
        "input": [
          [
            7,
            7,
            7,
            7,
            7,
            7,
            7
          ]
        ],
        "expected": 1
      }
    ],
    "hiddenCases": [
      {
        "input": [
          [
            10,
            9,
            2,
            5,
            3,
            7,
            101,
            18
          ]
        ],
        "expected": 4
      },
      {
        "input": [
          [
            0,
            1,
            0,
            3,
            2,
            3
          ]
        ],
        "expected": 4
      },
      {
        "input": [
          [
            7,
            7,
            7,
            7,
            7,
            7,
            7
          ]
        ],
        "expected": 1
      }
    ]
  },
  "longest-increasing-subsequence": {
    "id": "p-65",
    "slug": "longest-increasing-subsequence",
    "title": "Longest Increasing Subsequence",
    "publicCases": [
      {
        "input": [
          [
            10,
            9,
            2,
            5,
            3,
            7,
            101,
            18
          ]
        ],
        "expected": 4
      },
      {
        "input": [
          [
            0,
            1,
            0,
            3,
            2,
            3
          ]
        ],
        "expected": 4
      },
      {
        "input": [
          [
            7,
            7,
            7,
            7,
            7,
            7,
            7
          ]
        ],
        "expected": 1
      }
    ],
    "hiddenCases": [
      {
        "input": [
          [
            10,
            9,
            2,
            5,
            3,
            7,
            101,
            18
          ]
        ],
        "expected": 4
      },
      {
        "input": [
          [
            0,
            1,
            0,
            3,
            2,
            3
          ]
        ],
        "expected": 4
      },
      {
        "input": [
          [
            7,
            7,
            7,
            7,
            7,
            7,
            7
          ]
        ],
        "expected": 1
      }
    ]
  },
  "p-66": {
    "id": "p-66",
    "slug": "subsets-ii",
    "title": "Subsets II (With Duplicates)",
    "publicCases": [
      {
        "input": [
          [
            1,
            2,
            2
          ]
        ],
        "expected": [
          [],
          [
            1
          ],
          [
            1,
            2
          ],
          [
            1,
            2,
            2
          ],
          [
            2
          ],
          [
            2,
            2
          ]
        ]
      },
      {
        "input": [
          [
            0
          ]
        ],
        "expected": [
          [],
          [
            0
          ]
        ]
      }
    ],
    "hiddenCases": [
      {
        "input": [
          [
            1,
            2,
            2
          ]
        ],
        "expected": [
          [],
          [
            1
          ],
          [
            1,
            2
          ],
          [
            1,
            2,
            2
          ],
          [
            2
          ],
          [
            2,
            2
          ]
        ]
      },
      {
        "input": [
          [
            0
          ]
        ],
        "expected": [
          [],
          [
            0
          ]
        ]
      }
    ]
  },
  "subsets-ii": {
    "id": "p-66",
    "slug": "subsets-ii",
    "title": "Subsets II (With Duplicates)",
    "publicCases": [
      {
        "input": [
          [
            1,
            2,
            2
          ]
        ],
        "expected": [
          [],
          [
            1
          ],
          [
            1,
            2
          ],
          [
            1,
            2,
            2
          ],
          [
            2
          ],
          [
            2,
            2
          ]
        ]
      },
      {
        "input": [
          [
            0
          ]
        ],
        "expected": [
          [],
          [
            0
          ]
        ]
      }
    ],
    "hiddenCases": [
      {
        "input": [
          [
            1,
            2,
            2
          ]
        ],
        "expected": [
          [],
          [
            1
          ],
          [
            1,
            2
          ],
          [
            1,
            2,
            2
          ],
          [
            2
          ],
          [
            2,
            2
          ]
        ]
      },
      {
        "input": [
          [
            0
          ]
        ],
        "expected": [
          [],
          [
            0
          ]
        ]
      }
    ]
  },
  "p-67": {
    "id": "p-67",
    "slug": "top-k-frequent-elements",
    "title": "Top K Frequent Elements",
    "publicCases": [
      {
        "input": [
          [
            1,
            1,
            1,
            2,
            2,
            3
          ],
          2
        ],
        "expected": [
          1,
          2
        ]
      },
      {
        "input": [
          [
            1
          ],
          1
        ],
        "expected": [
          1
        ]
      },
      {
        "input": [
          [
            4,
            4,
            4,
            6,
            6,
            7
          ],
          1
        ],
        "expected": [
          4
        ]
      }
    ],
    "hiddenCases": [
      {
        "input": [
          [
            4,
            1,
            -1,
            2,
            -1,
            2,
            3
          ],
          2
        ],
        "expected": [
          -1,
          2
        ]
      },
      {
        "input": [
          [
            1,
            2
          ],
          2
        ],
        "expected": [
          1,
          2
        ]
      }
    ]
  },
  "p-68": {
    "id": "p-68",
    "slug": "daily-temperatures",
    "title": "Daily Temperatures (Days to Warmer Day)",
    "publicCases": [
      {
        "input": [
          [
            73,
            74,
            75,
            71,
            69,
            72,
            76,
            73
          ]
        ],
        "expected": [
          1,
          1,
          4,
          2,
          1,
          1,
          0,
          0
        ]
      },
      {
        "input": [
          [
            30,
            40,
            50,
            60
          ]
        ],
        "expected": [
          1,
          1,
          1,
          0
        ]
      },
      {
        "input": [
          [
            30,
            60,
            90
          ]
        ],
        "expected": [
          1,
          1,
          0
        ]
      }
    ],
    "hiddenCases": [
      {
        "input": [
          [
            73,
            74,
            75,
            71,
            69,
            72,
            76,
            73
          ]
        ],
        "expected": [
          1,
          1,
          4,
          2,
          1,
          1,
          0,
          0
        ]
      },
      {
        "input": [
          [
            30,
            40,
            50,
            60
          ]
        ],
        "expected": [
          1,
          1,
          1,
          0
        ]
      },
      {
        "input": [
          [
            30,
            60,
            90
          ]
        ],
        "expected": [
          1,
          1,
          0
        ]
      }
    ]
  },
  "daily-temperatures": {
    "id": "p-68",
    "slug": "daily-temperatures",
    "title": "Daily Temperatures (Days to Warmer Day)",
    "publicCases": [
      {
        "input": [
          [
            73,
            74,
            75,
            71,
            69,
            72,
            76,
            73
          ]
        ],
        "expected": [
          1,
          1,
          4,
          2,
          1,
          1,
          0,
          0
        ]
      },
      {
        "input": [
          [
            30,
            40,
            50,
            60
          ]
        ],
        "expected": [
          1,
          1,
          1,
          0
        ]
      },
      {
        "input": [
          [
            30,
            60,
            90
          ]
        ],
        "expected": [
          1,
          1,
          0
        ]
      }
    ],
    "hiddenCases": [
      {
        "input": [
          [
            73,
            74,
            75,
            71,
            69,
            72,
            76,
            73
          ]
        ],
        "expected": [
          1,
          1,
          4,
          2,
          1,
          1,
          0,
          0
        ]
      },
      {
        "input": [
          [
            30,
            40,
            50,
            60
          ]
        ],
        "expected": [
          1,
          1,
          1,
          0
        ]
      },
      {
        "input": [
          [
            30,
            60,
            90
          ]
        ],
        "expected": [
          1,
          1,
          0
        ]
      }
    ]
  },
  "p-69": {
    "id": "p-69",
    "slug": "rotting-oranges",
    "title": "Rotting Oranges Infection Grid",
    "publicCases": [
      {
        "input": [
          [
            [
              2,
              1,
              1
            ],
            [
              1,
              1,
              0
            ],
            [
              0,
              1,
              1
            ]
          ]
        ],
        "expected": 4
      },
      {
        "input": [
          [
            [
              2,
              1,
              1
            ],
            [
              0,
              1,
              1
            ],
            [
              1,
              0,
              1
            ]
          ]
        ],
        "expected": -1
      },
      {
        "input": [
          [
            [
              0,
              2
            ]
          ]
        ],
        "expected": 0
      }
    ],
    "hiddenCases": [
      {
        "input": [
          [
            [
              2,
              1,
              1
            ],
            [
              1,
              1,
              0
            ],
            [
              0,
              1,
              1
            ]
          ]
        ],
        "expected": 4
      },
      {
        "input": [
          [
            [
              2,
              1,
              1
            ],
            [
              0,
              1,
              1
            ],
            [
              1,
              0,
              1
            ]
          ]
        ],
        "expected": -1
      },
      {
        "input": [
          [
            [
              0,
              2
            ]
          ]
        ],
        "expected": 0
      }
    ]
  },
  "rotting-oranges": {
    "id": "p-69",
    "slug": "rotting-oranges",
    "title": "Rotting Oranges Infection Grid",
    "publicCases": [
      {
        "input": [
          [
            [
              2,
              1,
              1
            ],
            [
              1,
              1,
              0
            ],
            [
              0,
              1,
              1
            ]
          ]
        ],
        "expected": 4
      },
      {
        "input": [
          [
            [
              2,
              1,
              1
            ],
            [
              0,
              1,
              1
            ],
            [
              1,
              0,
              1
            ]
          ]
        ],
        "expected": -1
      },
      {
        "input": [
          [
            [
              0,
              2
            ]
          ]
        ],
        "expected": 0
      }
    ],
    "hiddenCases": [
      {
        "input": [
          [
            [
              2,
              1,
              1
            ],
            [
              1,
              1,
              0
            ],
            [
              0,
              1,
              1
            ]
          ]
        ],
        "expected": 4
      },
      {
        "input": [
          [
            [
              2,
              1,
              1
            ],
            [
              0,
              1,
              1
            ],
            [
              1,
              0,
              1
            ]
          ]
        ],
        "expected": -1
      },
      {
        "input": [
          [
            [
              0,
              2
            ]
          ]
        ],
        "expected": 0
      }
    ]
  },
  "p-70": {
    "id": "p-70",
    "slug": "number-of-connected-components",
    "title": "Connected Components in Undirected Graph",
    "publicCases": [
      {
        "input": [
          5,
          [
            [
              0,
              1
            ],
            [
              1,
              2
            ],
            [
              3,
              4
            ]
          ]
        ],
        "expected": 2
      },
      {
        "input": [
          5,
          [
            [
              0,
              1
            ],
            [
              1,
              2
            ],
            [
              2,
              3
            ],
            [
              3,
              4
            ]
          ]
        ],
        "expected": 1
      },
      {
        "input": [
          4,
          []
        ],
        "expected": 4
      }
    ],
    "hiddenCases": [
      {
        "input": [
          5,
          [
            [
              0,
              1
            ],
            [
              1,
              2
            ],
            [
              3,
              4
            ]
          ]
        ],
        "expected": 2
      },
      {
        "input": [
          5,
          [
            [
              0,
              1
            ],
            [
              1,
              2
            ],
            [
              2,
              3
            ],
            [
              3,
              4
            ]
          ]
        ],
        "expected": 1
      },
      {
        "input": [
          4,
          []
        ],
        "expected": 4
      }
    ]
  },
  "number-of-connected-components": {
    "id": "p-70",
    "slug": "number-of-connected-components",
    "title": "Connected Components in Undirected Graph",
    "publicCases": [
      {
        "input": [
          5,
          [
            [
              0,
              1
            ],
            [
              1,
              2
            ],
            [
              3,
              4
            ]
          ]
        ],
        "expected": 2
      },
      {
        "input": [
          5,
          [
            [
              0,
              1
            ],
            [
              1,
              2
            ],
            [
              2,
              3
            ],
            [
              3,
              4
            ]
          ]
        ],
        "expected": 1
      },
      {
        "input": [
          4,
          []
        ],
        "expected": 4
      }
    ],
    "hiddenCases": [
      {
        "input": [
          5,
          [
            [
              0,
              1
            ],
            [
              1,
              2
            ],
            [
              3,
              4
            ]
          ]
        ],
        "expected": 2
      },
      {
        "input": [
          5,
          [
            [
              0,
              1
            ],
            [
              1,
              2
            ],
            [
              2,
              3
            ],
            [
              3,
              4
            ]
          ]
        ],
        "expected": 1
      },
      {
        "input": [
          4,
          []
        ],
        "expected": 4
      }
    ]
  },
  "p-71": {
    "id": "p-71",
    "slug": "implement-trie-prefix-tree",
    "title": "Implement Trie (Prefix Tree)",
    "publicCases": [
      {
        "input": [
          [
            "apple"
          ],
          "apple"
        ],
        "expected": true
      },
      {
        "input": [
          [
            "apple"
          ],
          "app"
        ],
        "expected": false
      },
      {
        "input": [
          [
            "apple",
            "app"
          ],
          "app"
        ],
        "expected": true
      }
    ],
    "hiddenCases": [
      {
        "input": [
          [
            "apple"
          ],
          "apple"
        ],
        "expected": true
      },
      {
        "input": [
          [
            "apple"
          ],
          "app"
        ],
        "expected": false
      },
      {
        "input": [
          [
            "apple",
            "app"
          ],
          "app"
        ],
        "expected": true
      }
    ]
  },
  "p-72": {
    "id": "p-72",
    "slug": "merge-k-sorted-lists",
    "title": "Merge K Sorted Lists",
    "publicCases": [
      {
        "input": [
          [
            [
              1,
              4,
              5
            ],
            [
              1,
              3,
              4
            ],
            [
              2,
              6
            ]
          ]
        ],
        "expected": [
          1,
          1,
          2,
          3,
          4,
          4,
          5,
          6
        ]
      },
      {
        "input": [
          []
        ],
        "expected": []
      },
      {
        "input": [
          [
            []
          ]
        ],
        "expected": []
      }
    ],
    "hiddenCases": [
      {
        "input": [
          [
            [
              1,
              4,
              5
            ],
            [
              1,
              3,
              4
            ],
            [
              2,
              6
            ]
          ]
        ],
        "expected": [
          1,
          1,
          2,
          3,
          4,
          4,
          5,
          6
        ]
      },
      {
        "input": [
          []
        ],
        "expected": []
      },
      {
        "input": [
          [
            []
          ]
        ],
        "expected": []
      }
    ]
  },
  "merge-k-sorted-lists": {
    "id": "p-72",
    "slug": "merge-k-sorted-lists",
    "title": "Merge K Sorted Lists",
    "publicCases": [
      {
        "input": [
          [
            [
              1,
              4,
              5
            ],
            [
              1,
              3,
              4
            ],
            [
              2,
              6
            ]
          ]
        ],
        "expected": [
          1,
          1,
          2,
          3,
          4,
          4,
          5,
          6
        ]
      },
      {
        "input": [
          []
        ],
        "expected": []
      },
      {
        "input": [
          [
            []
          ]
        ],
        "expected": []
      }
    ],
    "hiddenCases": [
      {
        "input": [
          [
            [
              1,
              4,
              5
            ],
            [
              1,
              3,
              4
            ],
            [
              2,
              6
            ]
          ]
        ],
        "expected": [
          1,
          1,
          2,
          3,
          4,
          4,
          5,
          6
        ]
      },
      {
        "input": [
          []
        ],
        "expected": []
      },
      {
        "input": [
          [
            []
          ]
        ],
        "expected": []
      }
    ]
  },
  "p-73": {
    "id": "p-73",
    "slug": "median-of-two-sorted-arrays",
    "title": "Median of Two Sorted Arrays",
    "publicCases": [
      {
        "input": [
          [
            1,
            3
          ],
          [
            2
          ]
        ],
        "expected": 2
      },
      {
        "input": [
          [
            1,
            2
          ],
          [
            3,
            4
          ]
        ],
        "expected": 2.5
      },
      {
        "input": [
          [
            0,
            0
          ],
          [
            0,
            0
          ]
        ],
        "expected": 0
      }
    ],
    "hiddenCases": [
      {
        "input": [
          [
            1,
            3
          ],
          [
            2
          ]
        ],
        "expected": 2
      },
      {
        "input": [
          [
            1,
            2
          ],
          [
            3,
            4
          ]
        ],
        "expected": 2.5
      },
      {
        "input": [
          [
            0,
            0
          ],
          [
            0,
            0
          ]
        ],
        "expected": 0
      }
    ]
  },
  "median-of-two-sorted-arrays": {
    "id": "p-73",
    "slug": "median-of-two-sorted-arrays",
    "title": "Median of Two Sorted Arrays",
    "publicCases": [
      {
        "input": [
          [
            1,
            3
          ],
          [
            2
          ]
        ],
        "expected": 2
      },
      {
        "input": [
          [
            1,
            2
          ],
          [
            3,
            4
          ]
        ],
        "expected": 2.5
      },
      {
        "input": [
          [
            0,
            0
          ],
          [
            0,
            0
          ]
        ],
        "expected": 0
      }
    ],
    "hiddenCases": [
      {
        "input": [
          [
            1,
            3
          ],
          [
            2
          ]
        ],
        "expected": 2
      },
      {
        "input": [
          [
            1,
            2
          ],
          [
            3,
            4
          ]
        ],
        "expected": 2.5
      },
      {
        "input": [
          [
            0,
            0
          ],
          [
            0,
            0
          ]
        ],
        "expected": 0
      }
    ]
  },
  "p-74": {
    "id": "p-74",
    "slug": "design-add-and-search-words-data-structure",
    "title": "Word Dictionary with Wildcard Search",
    "publicCases": [
      {
        "input": [
          [
            "bad",
            "dad",
            "mad"
          ],
          "pad"
        ],
        "expected": false
      },
      {
        "input": [
          [
            "bad",
            "dad",
            "mad"
          ],
          ".ad"
        ],
        "expected": true
      },
      {
        "input": [
          [
            "bad",
            "dad",
            "mad"
          ],
          "b.."
        ],
        "expected": true
      }
    ],
    "hiddenCases": [
      {
        "input": [
          [
            "bad",
            "dad",
            "mad"
          ],
          "pad"
        ],
        "expected": false
      },
      {
        "input": [
          [
            "bad",
            "dad",
            "mad"
          ],
          ".ad"
        ],
        "expected": true
      },
      {
        "input": [
          [
            "bad",
            "dad",
            "mad"
          ],
          "b.."
        ],
        "expected": true
      }
    ]
  },
  "design-add-and-search-words-data-structure": {
    "id": "p-74",
    "slug": "design-add-and-search-words-data-structure",
    "title": "Word Dictionary with Wildcard Search",
    "publicCases": [
      {
        "input": [
          [
            "bad",
            "dad",
            "mad"
          ],
          "pad"
        ],
        "expected": false
      },
      {
        "input": [
          [
            "bad",
            "dad",
            "mad"
          ],
          ".ad"
        ],
        "expected": true
      },
      {
        "input": [
          [
            "bad",
            "dad",
            "mad"
          ],
          "b.."
        ],
        "expected": true
      }
    ],
    "hiddenCases": [
      {
        "input": [
          [
            "bad",
            "dad",
            "mad"
          ],
          "pad"
        ],
        "expected": false
      },
      {
        "input": [
          [
            "bad",
            "dad",
            "mad"
          ],
          ".ad"
        ],
        "expected": true
      },
      {
        "input": [
          [
            "bad",
            "dad",
            "mad"
          ],
          "b.."
        ],
        "expected": true
      }
    ]
  },
  "p-75": {
    "id": "p-75",
    "slug": "alien-dictionary",
    "title": "Alien Dictionary Character Ordering",
    "publicCases": [
      {
        "input": [
          [
            "wrt",
            "wrf",
            "er",
            "ett",
            "rftt"
          ]
        ],
        "expected": "wertf"
      },
      {
        "input": [
          [
            "z",
            "x"
          ]
        ],
        "expected": "zx"
      },
      {
        "input": [
          [
            "z",
            "x",
            "z"
          ]
        ],
        "expected": ""
      }
    ],
    "hiddenCases": [
      {
        "input": [
          [
            "wrt",
            "wrf",
            "er",
            "ett",
            "rftt"
          ]
        ],
        "expected": "wertf"
      },
      {
        "input": [
          [
            "z",
            "x"
          ]
        ],
        "expected": "zx"
      },
      {
        "input": [
          [
            "z",
            "x",
            "z"
          ]
        ],
        "expected": ""
      }
    ]
  },
  "alien-dictionary": {
    "id": "p-75",
    "slug": "alien-dictionary",
    "title": "Alien Dictionary Character Ordering",
    "publicCases": [
      {
        "input": [
          [
            "wrt",
            "wrf",
            "er",
            "ett",
            "rftt"
          ]
        ],
        "expected": "wertf"
      },
      {
        "input": [
          [
            "z",
            "x"
          ]
        ],
        "expected": "zx"
      },
      {
        "input": [
          [
            "z",
            "x",
            "z"
          ]
        ],
        "expected": ""
      }
    ],
    "hiddenCases": [
      {
        "input": [
          [
            "wrt",
            "wrf",
            "er",
            "ett",
            "rftt"
          ]
        ],
        "expected": "wertf"
      },
      {
        "input": [
          [
            "z",
            "x"
          ]
        ],
        "expected": "zx"
      },
      {
        "input": [
          [
            "z",
            "x",
            "z"
          ]
        ],
        "expected": ""
      }
    ]
  }
};

/**
 * Safely retrieve problem test cases by ID or Slug.
 * Returns null if problem does not exist. NEVER falls back to a different problem.
 */
export function getProblemTestCasesEntry(problemIdOrSlug: string): ProblemTestCasesEntry | null {
  if (!problemIdOrSlug) return null;
  const clean = problemIdOrSlug.toLowerCase().trim();
  return PROBLEM_TEST_CASES_REGISTRY[clean] || null;
}
