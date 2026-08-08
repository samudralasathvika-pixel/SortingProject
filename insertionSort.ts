import { AlgorithmModule, SortStep } from "./types";

const javaCode = `void insertionSort(int[] a) {
  int n = a.length;
  for (int i = 1; i < n; i++) {
    int key = a[i];
    int j = i - 1;
    while (j >= 0 && a[j] > key) {
      a[j + 1] = a[j];
      j = j - 1;
    }
    a[j + 1] = key;
  }
}`;

function generateSteps(input: number[]): SortStep[] {
  const a = [...input];
  const steps: SortStep[] = [];
  let comparisons = 0;
  let swaps = 0;
  const n = a.length;

  for (let i = 1; i < n; i++) {
    const key = a[i];
    steps.push({
      type: "active",
      indices: [i],
      array: [...a],
      line: 4,
      comparisons,
      swaps,
      note: `key = ${key}`,
    });
    let j = i - 1;
    while (j >= 0) {
      comparisons++;
      steps.push({
        type: "compare",
        indices: [j, i],
        array: [...a],
        line: 7,
        comparisons,
        swaps,
      });
      if (a[j] > key) {
        a[j + 1] = a[j];
        swaps++;
        steps.push({
          type: "overwrite",
          indices: [j, j + 1],
          array: [...a],
          line: 8,
          comparisons,
          swaps,
        });
        j--;
      } else {
        break;
      }
    }
    a[j + 1] = key;
    steps.push({
      type: "overwrite",
      indices: [j + 1],
      array: [...a],
      line: 11,
      comparisons,
      swaps,
    });
  }
  for (let k = 0; k < n; k++) {
    steps.push({
      type: "mark-sorted",
      indices: [k],
      array: [...a],
      line: 13,
      comparisons,
      swaps,
    });
  }
  return steps;
}

export const insertionSort: AlgorithmModule = {
  meta: {
    id: "insertion",
    name: "Insertion Sort",
    best: "O(n)",
    average: "O(n²)",
    worst: "O(n²)",
    space: "O(1)",
    stable: true,
    description:
      "Builds the final sorted array one item at a time by inserting each element into its proper position.",
    javaCode,
  },
  generateSteps,
};
