export type StepType =
  | "compare"
  | "swap"
  | "overwrite"
  | "mark-sorted"
  | "set-pivot"
  | "active"
  | "clear";

export interface SortStep {
  type: StepType;
  /** Indices currently being touched / highlighted */
  indices: number[];
  /** Snapshot of the array AFTER this step is applied */
  array: number[];
  /** Java code line (1-indexed) being executed for this step */
  line: number;
  /** Comparisons counter snapshot AFTER step */
  comparisons: number;
  /** Swaps counter snapshot AFTER step */
  swaps: number;
  /** Optional human-readable note */
  note?: string;
}

export interface AlgorithmMeta {
  id: string;
  name: string;
  best: string;
  average: string;
  worst: string;
  space: string;
  stable: boolean;
  description: string;
  /** Java code shown in the side panel; lines are 1-indexed for highlighting */
  javaCode: string;
}

export interface AlgorithmModule {
  meta: AlgorithmMeta;
  generateSteps: (input: number[]) => SortStep[];
}
