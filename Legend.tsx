interface LegendProps {}

const ITEMS: { color: string; label: string }[] = [
  { color: "hsl(var(--bar-default))", label: "Unsorted" },
  { color: "hsl(var(--bar-compare))", label: "Comparing" },
  { color: "hsl(var(--bar-swap))", label: "Swapping" },
  { color: "hsl(var(--bar-active))", label: "Active / Write" },
  { color: "hsl(var(--bar-pivot))", label: "Pivot" },
  { color: "hsl(var(--bar-sorted))", label: "Sorted" },
];

export const Legend = (_: LegendProps) => {
  return (
    <div className="panel flex flex-wrap items-center gap-x-5 gap-y-2 px-4 py-3">
      {ITEMS.map((it) => (
        <div key={it.label} className="flex items-center gap-2">
          <span
            className="inline-block h-3 w-3 rounded-sm"
            style={{ backgroundColor: it.color }}
          />
          <span className="text-xs text-muted-foreground">{it.label}</span>
        </div>
      ))}
    </div>
  );
};
