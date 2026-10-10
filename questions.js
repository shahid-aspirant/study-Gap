/**
 * StudyGap Diagnostic Question Bank - Java Foundations
 * 
 * Each question has:
 * - id: unique identifier
 * - question: the Java code or conceptual prompt
 * - codeSnippet: optional formatted code block
 * - options: 4 distinct choices
 * - correctIndex: 0-based index of the right answer
 * - primaryConcept: the immediate topic being tested
 * - foundationalPrereq: the underlying concept whose weakness causes mistakes here
 * - explanation: clear learning explanation
 * - trapExplanation: specific feedback explaining what misconception caused this error
 */

const JAVA_QUESTIONS = [
  {
    id: 1,
    primaryConcept: "Variables & Data Types",
    foundationalPrereq: "Memory & Data Types",
    question: "What is the output of the following Java code snippet?",
    codeSnippet: `int a = 5;\nint b = 2;\nSystem.out.println(a / b);`,
    options: [
      "2.5",
      "2",
      "3",
      "Compilation Error"
    ],
    correctIndex: 1,
    explanation: "In Java, dividing two integers ('int / int') performs integer division, discarding the decimal fraction. Hence 5 / 2 yields 2, not 2.5.",
    trapExplanation: "Choosing 2.5 indicates a misconception in how Java handles primitive integer arithmetic versus floating-point types."
  },
  {
    id: 2,
    primaryConcept: "Variables & Scope",
    foundationalPrereq: "Variable Lifetime & Declaration",
    question: "What happens when you compile and execute this code?",
    codeSnippet: `int x = 10;\nif (x > 5) {\n    int y = 20;\n}\nSystem.out.println(y);`,
    options: [
      "20",
      "10",
      "Compilation Error: cannot find symbol 'y'",
      "0"
    ],
    correctIndex: 2,
    explanation: "Variable 'y' is declared inside the block '{ ... }' of the if-statement. Its scope is limited to that block, so it cannot be accessed outside.",
    trapExplanation: "Expecting 20 shows a weak grasp of block scope and variable lifetime."
  },
  {
    id: 3,
    primaryConcept: "Operators & Expressions",
    foundationalPrereq: "Operator Precedence & Evaluation",
    question: "What will be printed to the console?",
    codeSnippet: `int count = 10;\nSystem.out.println(count++ + " and " + ++count);`,
    options: [
      "10 and 11",
      "10 and 12",
      "11 and 12",
      "11 and 11"
    ],
    correctIndex: 1,
    explanation: "count++ uses 10 then increments to 11. Then ++count increments 11 to 12 and uses 12. So output is '10 and 12'.",
    trapExplanation: "Choosing 10 and 11 indicates confusion between pre-increment (++x) and post-increment (x++)."
  },
  {
    id: 4,
    primaryConcept: "Conditionals & Logic",
    foundationalPrereq: "Boolean Logic & Short-Circuit",
    question: "What is printed when this condition is evaluated?",
    codeSnippet: `int p = 4;\nboolean check = (p > 5) && (++p > 3);\nSystem.out.println(p + ", " + check);`,
    options: [
      "5, true",
      "4, false",
      "5, false",
      "4, true"
    ],
    correctIndex: 1,
    explanation: "The '&&' operator is short-circuiting: because (p > 5) is false, Java skips evaluating (++p > 3). Therefore, 'p' remains 4 and check is false.",
    trapExplanation: "Thinking 'p' becomes 5 shows missing understanding of Short-Circuit Evaluation in boolean logic."
  },
  {
    id: 5,
    primaryConcept: "Loops & Iteration",
    foundationalPrereq: "Variables & State Tracking",
    question: "How many times does this loop print 'Study'?",
    codeSnippet: `for (int i = 0; i <= 4; i += 2) {\n    System.out.println("Study");\n}`,
    options: [
      "2 times",
      "3 times",
      "4 times",
      "5 times"
    ],
    correctIndex: 1,
    explanation: "The loop runs for i = 0, i = 2, and i = 4. When i increments to 6, 6 <= 4 is false. Hence it prints exactly 3 times.",
    trapExplanation: "Calculating wrong loop iterations typically stems from stepping over loop counter updates (state tracking)."
  },
  {
    id: 6,
    primaryConcept: "Loops & Iteration",
    foundationalPrereq: "Loop Termination & Conditionals",
    question: "What is the output of this loop with variable reassignment?",
    codeSnippet: `int total = 0;\nfor (int i = 1; i < 4; i++) {\n    total += i * 2;\n}\nSystem.out.println(total);`,
    options: [
      "12",
      "18",
      "8",
      "6"
    ],
    correctIndex: 0,
    explanation: "i takes values 1, 2, 3 (since i < 4). total = (1*2) + (2*2) + (3*2) = 2 + 4 + 6 = 12.",
    trapExplanation: "Errors here usually mean missing the loop boundary (i < 4 stops before 4) or accumulator variable update tracking."
  },
  {
    id: 7,
    primaryConcept: "Arrays & Indexing",
    foundationalPrereq: "Index Bounds & Off-By-One",
    question: "What is the result of running this Java snippet?",
    codeSnippet: `int[] scores = { 90, 85, 95 };\nSystem.out.println(scores[scores.length]);`,
    options: [
      "95",
      "0",
      "ArrayIndexOutOfBoundsException",
      "NullPointerException"
    ],
    correctIndex: 2,
    explanation: "Array length is 3, but indices are 0-based (0, 1, 2). Accessing scores[3] throws an ArrayIndexOutOfBoundsException at runtime.",
    trapExplanation: "Expecting 95 reveals an off-by-one index misconception (treating 1-based length as a valid 0-based index)."
  },
  {
    id: 8,
    primaryConcept: "Methods & Parameters",
    foundationalPrereq: "Pass-By-Value & Variable Mutation",
    question: "What will this code print?",
    codeSnippet: `public static void modify(int num) {\n    num = num + 10;\n}\npublic static void main(String[] args) {\n    int val = 5;\n    modify(val);\n    System.out.println(val);\n}`,
    options: [
      "15",
      "5",
      "0",
      "Compilation Error"
    ],
    correctIndex: 1,
    explanation: "Java is strictly pass-by-value. The method 'modify' receives a copy of 'val'. Changing 'num' inside the method does not affect 'val' in main().",
    trapExplanation: "Expecting 15 indicates the classic misconception that primitives are passed by reference in Java."
  }
];

// Concept hierarchy mapping: Higher concepts depend on foundational concepts
const CONCEPT_DEPENDENCIES = {
  "Loops & Iteration": ["Variables & State Tracking", "Loop Termination & Conditionals"],
  "Arrays & Indexing": ["Index Bounds & Off-By-One", "Loops & Iteration"],
  "Conditionals & Logic": ["Boolean Logic & Short-Circuit", "Operator Precedence & Evaluation"],
  "Operators & Expressions": ["Memory & Data Types", "Operator Precedence & Evaluation"],
  "Methods & Parameters": ["Pass-By-Value & Variable Mutation", "Variable Lifetime & Declaration"]
};

// Remediation guides for each weak foundational concept
const CONCEPT_REMEDIATION = {
  "Memory & Data Types": {
    conceptName: "Primitive Data Types & Integer Arithmetic",
    whyItMatters: "Java treats integers and floats strictly. Understanding how memory stores primitives prevents unexpected truncation and truncation bugs in calculations.",
    quickRule: "Remember: 'int / int' always cuts off decimals. If you need fractional results, cast at least one operand: `(double) a / b`.",
    practiceQuestion: "What does `double d = 7 / 2;` evaluate to in Java? (Answer: `3.0`, because 7/2 evaluates to 3 first before widening)."
  },
  "Variable Lifetime & Declaration": {
    conceptName: "Variable Scope & Block Lifetime",
    whyItMatters: "Variables only live inside the `{ ... }` curly braces where they were born. Trying to read them outside produces compiler symbol errors.",
    quickRule: "Declare variables in the outer block if you need to use their updated value after an `if` condition or `for` loop.",
    practiceQuestion: "If you need a loop counter after the loop finishes, where should `int i` be declared? (Answer: Before the `for` statement)."
  },
  "Operator Precedence & Evaluation": {
    conceptName: "Increment Operators & Order of Operations",
    whyItMatters: "Postfix (`x++`) uses the current value first, then increments. Prefix (`++x`) increments first, then provides the value. Mixing these creates subtle bugs.",
    quickRule: "Rule of thumb: Write `x++;` as its own separate line in production code instead of embedding it into complex expressions.",
    practiceQuestion: "If `int k = 3;`, what does `k++ + k` produce? (Answer: 3 + 4 = 7)."
  },
  "Boolean Logic & Short-Circuit": {
    conceptName: "Short-Circuit Logical Operators",
    whyItMatters: "`&&` and `||` stop checking right away if the first condition determines the whole outcome (`false && ...` skips right side).",
    quickRule: "Never put critical side-effects (like incrementing a counter) inside the right-hand condition of an `&&` or `||` check.",
    practiceQuestion: "Does `false && (++count > 0)` increment `count`? (Answer: No, the second part never executes)."
  },
  "Variables & State Tracking": {
    conceptName: "Mental Variable State Tracing",
    whyItMatters: "Loops are simply variables changing over time. If you cannot trace variable values on paper step-by-step, complex loops and algorithms will always fail.",
    quickRule: "Use a 3-column Trace Table: [Iteration | Variable Value | Condition Check].",
    practiceQuestion: "In `for(int i=0; i<3; i++)`, list every value `i` takes during execution. (Answer: 0, 1, 2, and finally 3 when it terminates)."
  },
  "Loop Termination & Conditionals": {
    conceptName: "Loop Boundary & Termination Conditions",
    whyItMatters: "Confusing `<` with `<=` causes off-by-one errors and infinite loops that crash programs.",
    quickRule: "Check edge conditions: What is the very first value? What is the very last value that is allowed into the loop?",
    practiceQuestion: "How many times does `for(int i=1; i<=5; i++)` run vs `for(int i=1; i<5; i++)`? (Answer: 5 times vs 4 times)."
  },
  "Index Bounds & Off-By-One": {
    conceptName: "Zero-Based Indexing & Bounds",
    whyItMatters: "Java arrays start at index `0`. An array of size `N` has valid indices `0` to `N - 1`. `array[N]` is always an out-of-bounds crash.",
    quickRule: "Always stop loops at `i < array.length`, never `i <= array.length`.",
    practiceQuestion: "What is the highest valid index of an array initialized with `new int[10]`? (Answer: 9)."
  },
  "Pass-By-Value & Variable Mutation": {
    conceptName: "Java Parameter Passing (Pass-By-Value)",
    whyItMatters: "Java never passes primitive variables directly to methods; it passes a copy. Modifying the copy leaves the original caller variable unchanged.",
    quickRule: "If a method needs to compute a new value for a primitive, return it: `val = modify(val);`.",
    practiceQuestion: "Can a void method `swap(int a, int b)` change the caller's two variables in Java? (Answer: No, because Java is strictly pass-by-value)."
  }
};

// Global export for node/browser
if (typeof globalThis !== 'undefined') {
  globalThis.JAVA_QUESTIONS = JAVA_QUESTIONS;
  globalThis.CONCEPT_DEPENDENCIES = CONCEPT_DEPENDENCIES;
  globalThis.CONCEPT_REMEDIATION = CONCEPT_REMEDIATION;
}

