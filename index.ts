import { bubbleSort } from "./bubbleSort";
import { insertionSort } from "./insertionSort";
import { selectionSort } from "./selectionSort";
import { quickSort } from "./quickSort";
import { mergeSort } from "./mergeSort";
import { AlgorithmModule } from "./types";

export const algorithms: Record<string, AlgorithmModule> = {
  bubble: bubbleSort,
  insertion: insertionSort,
  selection: selectionSort,
  quick: quickSort,
  merge: mergeSort,
};

export const algorithmList = Object.values(algorithms);
export type AlgorithmId = keyof typeof algorithms;
export * from "./types";
