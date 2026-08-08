import { algorithmList } from "@/lib/sorting";
import { cn } from "@/lib/utils";

interface ComparisonTableProps {
  selectedId: string;
}

export const ComparisonTable = ({ selectedId }: ComparisonTableProps) => {
  return (
    <div className="panel overflow-hidden">
      <div className="border-b border-border px-4 py-2">
        <h2 className="text-sm font-semibold text-foreground">
          Algorithm Comparison
        </h2>
        <p className="text-xs text-muted-foreground">
          Quick side-by-side reference of all five sorting techniques.
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-muted/30 text-muted-foreground">
            <tr>
              <th className="px-4 py-2 font-medium">Algorithm</th>
              <th className="px-3 py-2 font-medium">Best</th>
              <th className="px-3 py-2 font-medium">Average</th>
              <th className="px-3 py-2 font-medium">Worst</th>
              <th className="px-3 py-2 font-medium">Space</th>
              <th className="px-3 py-2 font-medium">Stable</th>
              <th className="px-4 py-2 font-medium">Best Used For</th>
            </tr>
          </thead>
          <tbody className="code-font">
            {algorithmList.map((a) => {
              const isActive = a.meta.id === selectedId;
              const useCase: Record<string, string> = {
                bubble: "Teaching · tiny inputs",
                insertion: "Nearly-sorted / small n",
                selection: "Few writes needed",
                quick: "General-purpose, in-place",
                merge: "Stable sort · linked lists",
              };
              return (
                <tr
                  key={a.meta.id}
                  className={cn(
                    "border-t border-border/60 transition-colors",
                    isActive
                      ? "bg-primary/10 text-foreground"
                      : "text-muted-foreground hover:bg-muted/20",
                  )}
                >
                  <td className="px-4 py-2 font-sans font-medium text-foreground">
                    {a.meta.name}
                  </td>
                  <td className="px-3 py-2">{a.meta.best}</td>
                  <td className="px-3 py-2">{a.meta.average}</td>
                  <td className="px-3 py-2">{a.meta.worst}</td>
                  <td className="px-3 py-2">{a.meta.space}</td>
                  <td className="px-3 py-2">
                    {a.meta.stable ? "Yes" : "No"}
                  </td>
                  <td className="px-4 py-2 font-sans">
                    {useCase[a.meta.id] ?? "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
