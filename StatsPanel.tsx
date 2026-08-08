import { AlgorithmMeta } from "@/lib/sorting";

interface StatsPanelProps {
  meta: AlgorithmMeta;
  comparisons: number;
  swaps: number;
  stepIndex: number;
  totalSteps: number;
}

const Stat = ({ label, value }: { label: string; value: string | number }) => (
  <div className="flex flex-col rounded-lg border border-border bg-secondary/40 px-3 py-2">
    <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
      {label}
    </span>
    <span className="code-font text-base font-semibold text-foreground">
      {value}
    </span>
  </div>
);

export const StatsPanel = ({
  meta,
  comparisons,
  swaps,
  stepIndex,
  totalSteps,
}: StatsPanelProps) => {
  return (
    <div className="panel space-y-4 p-4">
      <div>
        <h3 className="text-sm font-semibold text-foreground">{meta.name}</h3>
        <p className="mt-1 text-xs text-muted-foreground">{meta.description}</p>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Stat label="Best" value={meta.best} />
        <Stat label="Average" value={meta.average} />
        <Stat label="Worst" value={meta.worst} />
        <Stat label="Space" value={meta.space} />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Stat label="Comparisons" value={comparisons} />
        <Stat label="Swaps" value={swaps} />
      </div>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Stable: <span className="text-foreground">{meta.stable ? "Yes" : "No"}</span></span>
        <span>
          Step <span className="code-font text-foreground">{stepIndex + 1}</span> /{" "}
          <span className="code-font">{totalSteps}</span>
        </span>
      </div>
    </div>
  );
};
