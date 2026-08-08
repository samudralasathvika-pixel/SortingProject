import { useMemo } from "react";
import { SortStep } from "@/lib/sorting";
import { cn } from "@/lib/utils";

interface BarsCanvasProps {
  step: SortStep;
  maxValue: number;
  sortedSet: Set<number>;
}

function colorForIndex(
  i: number,
  step: SortStep,
  sortedSet: Set<number>,
): string {
  if (step.type === "mark-sorted" && step.indices.includes(i)) {
    return "hsl(var(--bar-sorted))";
  }
  if (sortedSet.has(i)) return "hsl(var(--bar-sorted))";
  if (step.indices.includes(i)) {
    switch (step.type) {
      case "compare":
        return "hsl(var(--bar-compare))";
      case "swap":
        return "hsl(var(--bar-swap))";
      case "overwrite":
        return "hsl(var(--bar-active))";
      case "set-pivot":
        return "hsl(var(--bar-pivot))";
      case "active":
        return "hsl(var(--bar-active))";
      default:
        return "hsl(var(--bar-default))";
    }
  }
  return "hsl(var(--bar-default))";
}

export const BarsCanvas = ({ step, maxValue, sortedSet }: BarsCanvasProps) => {
  const arr = step.array;
  const n = arr.length;
  const showLabels = n <= 25;
  const gap = useMemo(() => (n > 60 ? 1 : n > 30 ? 2 : 4), [n]);

  return (
    <div
      className="panel relative h-[420px] w-full overflow-hidden p-4"
      role="img"
      aria-label={`Visualization of array of length ${n}`}
    >
      <div
        className="flex h-full w-full items-end"
        style={{ gap: `${gap}px` }}
      >
        {arr.map((v, i) => {
          const heightPct = (v / maxValue) * 100;
          const color = colorForIndex(i, step, sortedSet);
          const isActive = step.indices.includes(i);
          return (
            <div
              key={i}
              className={cn(
                "flex flex-1 flex-col items-center justify-end rounded-t-sm transition-[height,background-color] duration-150 ease-out",
              )}
              style={{
                height: `${heightPct}%`,
                backgroundColor: color,
                boxShadow: isActive
                  ? "0 0 12px hsl(var(--primary) / 0.5)"
                  : undefined,
              }}
              title={`${v}`}
            >
              {showLabels && (
                <span className="mb-1 text-[10px] font-medium text-foreground/80 code-font">
                  {v}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
