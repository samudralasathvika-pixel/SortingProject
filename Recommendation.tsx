import { useMemo } from "react";
import { algorithms } from "@/lib/sorting";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface RecommendationProps {
  array: number[];
  selectedId: string;
  onSelect: (id: string) => void;
}

interface ArrayProfile {
  n: number;
  sortedness: number; // 0..1, fraction of adjacent pairs already in order
  duplicateRatio: number; // 0..1
  isReversed: boolean;
  isTiny: boolean;
  isSmall: boolean;
  isLarge: boolean;
}

function profileArray(a: number[]): ArrayProfile {
  const n = a.length;
  let inOrder = 0;
  for (let i = 0; i < n - 1; i++) if (a[i] <= a[i + 1]) inOrder++;
  const sortedness = n > 1 ? inOrder / (n - 1) : 1;
  const unique = new Set(a).size;
  const duplicateRatio = n > 0 ? 1 - unique / n : 0;
  const isReversed = sortedness < 0.1;
  return {
    n,
    sortedness,
    duplicateRatio,
    isReversed,
    isTiny: n <= 12,
    isSmall: n <= 30,
    isLarge: n >= 60,
  };
}

interface Recommendation {
  id: string;
  reasons: string[];
}

function recommend(p: ArrayProfile): Recommendation {
  // Nearly sorted → Insertion Sort dominates (best-case O(n))
  if (p.sortedness >= 0.85 && p.n > 1) {
    return {
      id: "insertion",
      reasons: [
        `Array is ${Math.round(p.sortedness * 100)}% in order`,
        "Insertion Sort runs in near-linear time on nearly-sorted data",
      ],
    };
  }

  // Tiny array → Insertion Sort beats divide-and-conquer due to low overhead
  if (p.isTiny) {
    return {
      id: "insertion",
      reasons: [
        `Only ${p.n} elements`,
        "Insertion Sort has the lowest constant overhead for tiny inputs",
      ],
    };
  }

  // Reversed → Merge Sort guarantees O(n log n) (Quick Sort risks O(n²) on worst-case pivots)
  if (p.isReversed && p.n > 12) {
    return {
      id: "merge",
      reasons: [
        "Array is in reverse order",
        "Merge Sort guarantees O(n log n) regardless of input pattern",
      ],
    };
  }

  // Lots of duplicates + need stability → Merge Sort
  if (p.duplicateRatio >= 0.3 && p.n > 20) {
    return {
      id: "merge",
      reasons: [
        `${Math.round(p.duplicateRatio * 100)}% duplicate values`,
        "Merge Sort is stable — preserves order of equal elements",
      ],
    };
  }

  // Large random → Quick Sort (fast average case, in-place)
  if (p.isLarge) {
    return {
      id: "quick",
      reasons: [
        `Large input (n = ${p.n})`,
        "Quick Sort has the best average performance and uses O(log n) extra space",
      ],
    };
  }

  // Default mid-size random → Quick Sort
  return {
    id: "quick",
    reasons: [
      `Random input of size ${p.n}`,
      "Quick Sort offers the best general-purpose O(n log n) average time",
    ],
  };
}

export const Recommendation = ({
  array,
  selectedId,
  onSelect,
}: RecommendationProps) => {
  const profile = useMemo(() => profileArray(array), [array]);
  const rec = useMemo(() => recommend(profile), [profile]);
  const recAlgo = algorithms[rec.id];
  const isAlreadySelected = selectedId === rec.id;

  return (
    <div className="panel overflow-hidden">
      <div className="flex items-center gap-2 border-b border-border px-4 py-2">
        <Sparkles className="h-4 w-4 text-primary" />
        <h2 className="text-sm font-semibold text-foreground">
          Recommended for this array
        </h2>
      </div>
      <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-[1.2fr_1fr]">
        {/* Recommendation */}
        <div className="space-y-3">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-semibold text-primary text-glow">
              {recAlgo.meta.name}
            </span>
            <span className="code-font text-xs text-muted-foreground">
              {recAlgo.meta.average} avg
            </span>
          </div>
          <ul className="space-y-1.5 text-xs text-muted-foreground">
            {rec.reasons.map((r, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-primary">›</span>
                <span>{r}</span>
              </li>
            ))}
          </ul>
          <button
            onClick={() => onSelect(rec.id)}
            disabled={isAlreadySelected}
            className={cn(
              "code-font mt-1 rounded-md border px-3 py-1.5 text-xs transition-colors",
              isAlreadySelected
                ? "border-border bg-secondary/40 text-muted-foreground"
                : "border-primary/40 bg-primary/10 text-primary hover:bg-primary/20",
            )}
          >
            {isAlreadySelected ? "✓ Currently selected" : "Use this algorithm →"}
          </button>
        </div>

        {/* Array profile */}
        <div className="space-y-2 rounded-md border border-border/60 bg-secondary/30 p-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            Array Profile
          </p>
          <dl className="code-font space-y-1 text-xs">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">size</dt>
              <dd className="text-foreground">{profile.n}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">in-order pairs</dt>
              <dd className="text-foreground">
                {Math.round(profile.sortedness * 100)}%
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">duplicates</dt>
              <dd className="text-foreground">
                {Math.round(profile.duplicateRatio * 100)}%
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">pattern</dt>
              <dd className="text-foreground">
                {profile.sortedness >= 0.85
                  ? "nearly sorted"
                  : profile.isReversed
                    ? "reversed"
                    : "random"}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
};
