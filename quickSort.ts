import { AlgorithmModule, SortStep } from "./types";

const javaCode = `void quickSort(int[] a, int low, int high) {
  if (low < high) {
    int p = partition(a, low, high);
    quickSort(a, low, p - 1);
    quickSort(a, p + 1, high);
  }
}
int partition(int[] a, int low, int high) {
  int pivot = a[high];
  int i = low - 1;
  for (int j = low; j < high; j++) {
    if (a[j] < pivot) {
      i++;
      int t = a[i]; a[i] = a[j]; a[j] = t;
    }
  }
  int t = a[i + 1]; a[i + 1] = a[high]; a[high] = t;
  return i + 1;
}`;

function generateSteps(input: number[]): SortStep[] {
  const a = [...input];
  const steps: SortStep[] = [];
  const counters = { comparisons: 0, swaps: 0 };
  const sortedSet = new Set<number>();

  function partition(low: number, high: number): number {
    const pivot = a[high];
    steps.push({
      type: "set-pivot",
      indices: [high],
      array: [...a],
      line: 10,
      comparisons: counters.comparisons,
      swaps: counters.swaps,
      note: `pivot = ${pivot}`,
    });
    let i = low - 1;
    for (let j = low; j < high; j++) {
      counters.comparisons++;
      steps.push({
        type: "compare",
        indices: [j, high],
        array: [...a],
        line: 13,
        comparisons: counters.comparisons,
        swaps: counters.swaps,
      });
      if (a[j] < pivot) {
        i++;
        if (i !== j) {
          [a[i], a[j]] = [a[j], a[i]];
          counters.swaps++;
          steps.push({
            type: "swap",
            indices: [i, j],
            array: [...a],
            line: 15,
            comparisons: counters.comparisons,
            swaps: counters.swaps,
          });
        }
      }
    }
    [a[i + 1], a[high]] = [a[high], a[i + 1]];
    counters.swaps++;
    steps.push({
      type: "swap",
      indices: [i + 1, high],
      array: [...a],
      line: 18,
      comparisons: counters.comparisons,
      swaps: counters.swaps,
    });
    sortedSet.add(i + 1);
    steps.push({
      type: "mark-sorted",
      indices: [i + 1],
      array: [...a],
      line: 19,
      comparisons: counters.comparisons,
      swaps: counters.swaps,
    });
    return i + 1;
  }

  function quick(low: number, high: number) {
    if (low < high) {
      steps.push({
        type: "active",
        indices: Array.from({ length: high - low + 1 }, (_, k) => low + k),
        array: [...a],
        line: 2,
        comparisons: counters.comparisons,
        swaps: counters.swaps,
      });
      const p = partition(low, high);
      quick(low, p - 1);
      quick(p + 1, high);
    } else if (low === high) {
      sortedSet.add(low);
      steps.push({
        type: "mark-sorted",
        indices: [low],
        array: [...a],
        line: 2,
        comparisons: counters.comparisons,
        swaps: counters.swaps,
      });
    }
  }

  quick(0, a.length - 1);
  // Final pass to mark all sorted
  steps.push({
    type: "mark-sorted",
    indices: Array.from({ length: a.length }, (_, k) => k),
    array: [...a],
    line: 8,
    comparisons: counters.comparisons,
    swaps: counters.swaps,
  });
  return steps;
}

export const quickSort: AlgorithmModule = {
  meta: {
    id: "quick",
    name: "Quick Sort",
    best: "O(n log n)",
    average: "O(n log n)",
    worst: "O(n²)",
    space: "O(log n)",
    stable: false,
    description:
      "Picks a pivot, partitions the array around it, and recursively sorts each half.",
    javaCode,
  },
  generateSteps,
};
