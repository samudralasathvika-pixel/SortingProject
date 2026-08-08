import { AlgorithmModule, SortStep } from "./types";

const javaCode = `void bubbleSort(int[] a) {
  int n = a.length;
  for (int i = 0; i < n - 1; i++) {
    for (int j = 0; j < n - i - 1; j++) {
      if (a[j] > a[j + 1]) {
        int temp = a[j];
        a[j] = a[j + 1];
        a[j + 1] = temp;
      }
    }
  }
}`;

function generateSteps(input: number[]): SortStep[] {
  const a = [...input];
  const steps: SortStep[] = [];
  let comparisons = 0;
  let swaps = 0;
  const n = a.length;

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      comparisons++;
      steps.push({
        type: "compare",
        indices: [j, j + 1],
        array: [...a],
        line: 5,
        comparisons,
        swaps,
      });
      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        swaps++;
        steps.push({
          type: "swap",
          indices: [j, j + 1],
          array: [...a],
          line: 8,
          comparisons,
          swaps,
        });
      }
    }
    steps.push({
      type: "mark-sorted",
      indices: [n - i - 1],
      array: [...a],
      line: 3,
      comparisons,
      swaps,
    });
  }
  steps.push({
    type: "mark-sorted",
    indices: [0],
    array: [...a],
    line: 12,
    comparisons,
    swaps,
  });
  return steps;
}

export const bubbleSort: AlgorithmModule = {
  meta: {
    id: "bubble",
    name: "Bubble Sort",
    best: "O(n)",
    average: "O(n²)",
    worst: "O(n²)",
    space: "O(1)",
    stable: true,
    description:
      "Repeatedly steps through the list, compares adjacent pairs and swaps them if they are in the wrong order.",
    javaCode,
  },
  generateSteps,
};
