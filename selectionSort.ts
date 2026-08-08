import { AlgorithmModule, SortStep } from "./types";

const javaCode = `void selectionSort(int[] a) {
  int n = a.length;
  for (int i = 0; i < n - 1; i++) {
    int minIdx = i;
    for (int j = i + 1; j < n; j++) {
      if (a[j] < a[minIdx]) {
        minIdx = j;
      }
    }
    int temp = a[minIdx];
    a[minIdx] = a[i];
    a[i] = temp;
  }
}`;

function generateSteps(input: number[]): SortStep[] {
  const a = [...input];
  const steps: SortStep[] = [];
  let comparisons = 0;
  let swaps = 0;
  const n = a.length;

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    steps.push({
      type: "set-pivot",
      indices: [minIdx],
      array: [...a],
      line: 4,
      comparisons,
      swaps,
    });
    for (let j = i + 1; j < n; j++) {
      comparisons++;
      steps.push({
        type: "compare",
        indices: [j, minIdx],
        array: [...a],
        line: 7,
        comparisons,
        swaps,
      });
      if (a[j] < a[minIdx]) {
        minIdx = j;
        steps.push({
          type: "set-pivot",
          indices: [minIdx],
          array: [...a],
          line: 8,
          comparisons,
          swaps,
        });
      }
    }
    if (minIdx !== i) {
      [a[i], a[minIdx]] = [a[minIdx], a[i]];
      swaps++;
      steps.push({
        type: "swap",
        indices: [i, minIdx],
        array: [...a],
        line: 13,
        comparisons,
        swaps,
      });
    }
    steps.push({
      type: "mark-sorted",
      indices: [i],
      array: [...a],
      line: 14,
      comparisons,
      swaps,
    });
  }
  steps.push({
    type: "mark-sorted",
    indices: [n - 1],
    array: [...a],
    line: 15,
    comparisons,
    swaps,
  });
  return steps;
}

export const selectionSort: AlgorithmModule = {
  meta: {
    id: "selection",
    name: "Selection Sort",
    best: "O(n²)",
    average: "O(n²)",
    worst: "O(n²)",
    space: "O(1)",
    stable: false,
    description:
      "Divides the input into a sorted and an unsorted region, repeatedly selecting the minimum from the unsorted region.",
    javaCode,
  },
  generateSteps,
};
