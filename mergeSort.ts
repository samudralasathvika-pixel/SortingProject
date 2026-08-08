import { AlgorithmModule, SortStep } from "./types";

const javaCode = `void mergeSort(int[] a, int l, int r) {
  if (l < r) {
    int m = (l + r) / 2;
    mergeSort(a, l, m);
    mergeSort(a, m + 1, r);
    merge(a, l, m, r);
  }
}
void merge(int[] a, int l, int m, int r) {
  int[] L = Arrays.copyOfRange(a, l, m + 1);
  int[] R = Arrays.copyOfRange(a, m + 1, r + 1);
  int i = 0, j = 0, k = l;
  while (i < L.length && j < R.length) {
    if (L[i] <= R[j]) a[k++] = L[i++];
    else a[k++] = R[j++];
  }
  while (i < L.length) a[k++] = L[i++];
  while (j < R.length) a[k++] = R[j++];
}`;

function generateSteps(input: number[]): SortStep[] {
  const a = [...input];
  const steps: SortStep[] = [];
  const counters = { comparisons: 0, swaps: 0 };

  function merge(l: number, m: number, r: number) {
    const L = a.slice(l, m + 1);
    const R = a.slice(m + 1, r + 1);
    let i = 0, j = 0, k = l;
    while (i < L.length && j < R.length) {
      counters.comparisons++;
      steps.push({
        type: "compare",
        indices: [l + i, m + 1 + j],
        array: [...a],
        line: 15,
        comparisons: counters.comparisons,
        swaps: counters.swaps,
      });
      if (L[i] <= R[j]) {
        a[k] = L[i];
        counters.swaps++;
        steps.push({
          type: "overwrite",
          indices: [k],
          array: [...a],
          line: 15,
          comparisons: counters.comparisons,
          swaps: counters.swaps,
        });
        i++; k++;
      } else {
        a[k] = R[j];
        counters.swaps++;
        steps.push({
          type: "overwrite",
          indices: [k],
          array: [...a],
          line: 16,
          comparisons: counters.comparisons,
          swaps: counters.swaps,
        });
        j++; k++;
      }
    }
    while (i < L.length) {
      a[k] = L[i];
      counters.swaps++;
      steps.push({
        type: "overwrite",
        indices: [k],
        array: [...a],
        line: 18,
        comparisons: counters.comparisons,
        swaps: counters.swaps,
      });
      i++; k++;
    }
    while (j < R.length) {
      a[k] = R[j];
      counters.swaps++;
      steps.push({
        type: "overwrite",
        indices: [k],
        array: [...a],
        line: 19,
        comparisons: counters.comparisons,
        swaps: counters.swaps,
      });
      j++; k++;
    }
    // Mark range as merged/sorted-in-this-pass
    steps.push({
      type: "mark-sorted",
      indices: Array.from({ length: r - l + 1 }, (_, idx) => l + idx),
      array: [...a],
      line: 8,
      comparisons: counters.comparisons,
      swaps: counters.swaps,
    });
  }

  function ms(l: number, r: number) {
    if (l < r) {
      const m = Math.floor((l + r) / 2);
      steps.push({
        type: "active",
        indices: Array.from({ length: r - l + 1 }, (_, k) => l + k),
        array: [...a],
        line: 3,
        comparisons: counters.comparisons,
        swaps: counters.swaps,
      });
      ms(l, m);
      ms(m + 1, r);
      merge(l, m, r);
    }
  }

  ms(0, a.length - 1);
  steps.push({
    type: "mark-sorted",
    indices: Array.from({ length: a.length }, (_, k) => k),
    array: [...a],
    line: 9,
    comparisons: counters.comparisons,
    swaps: counters.swaps,
  });
  return steps;
}

export const mergeSort: AlgorithmModule = {
  meta: {
    id: "merge",
    name: "Merge Sort",
    best: "O(n log n)",
    average: "O(n log n)",
    worst: "O(n log n)",
    space: "O(n)",
    stable: true,
    description:
      "Recursively divides the array into halves, sorts each half, then merges them back together.",
    javaCode,
  },
  generateSteps,
};
