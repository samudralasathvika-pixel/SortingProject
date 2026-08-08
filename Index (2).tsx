import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { algorithms, algorithmList, SortStep } from "@/lib/sorting";
import { getCode, type CodeLanguage } from "@/lib/sorting/codeSnippets";
import { BarsCanvas } from "@/components/visualizer/BarsCanvas";
import { CodePanel } from "@/components/visualizer/CodePanel";
import { Controls } from "@/components/visualizer/Controls";
import { StatsPanel } from "@/components/visualizer/StatsPanel";
import { Legend } from "@/components/visualizer/Legend";
import { ComparisonTable } from "@/components/visualizer/ComparisonTable";
import { Recommendation } from "@/components/visualizer/Recommendation";
import { toast } from "@/components/ui/sonner";

const DEFAULT_SIZE = 25;
const SPEED_MS: Record<number, number> = {
  1: 400, 2: 200, 3: 80, 4: 30, 5: 8,
};

function randomArray(n: number): number[] {
  return Array.from({ length: n }, () => Math.floor(Math.random() * 95) + 5);
}

function reversedArray(n: number): number[] {
  const step = 95 / Math.max(n - 1, 1);
  return Array.from({ length: n }, (_, i) => Math.round(100 - i * step));
}

function nearlySortedArray(n: number): number[] {
  const step = 95 / Math.max(n - 1, 1);
  const a = Array.from({ length: n }, (_, i) => Math.round(5 + i * step));
  // Swap a few random adjacent pairs (~10% of n, min 1)
  const swaps = Math.max(1, Math.floor(n * 0.1));
  for (let s = 0; s < swaps; s++) {
    const i = Math.floor(Math.random() * (n - 1));
    [a[i], a[i + 1]] = [a[i + 1], a[i]];
  }
  return a;
}

const Index = () => {
  const [algoId, setAlgoId] = useState<string>("bubble");
  const [size, setSize] = useState<number>(DEFAULT_SIZE);
  const [baseArray, setBaseArray] = useState<number[]>(() =>
    randomArray(DEFAULT_SIZE),
  );
  const [speed, setSpeed] = useState<number>(3);
  const [stepIndex, setStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [customInput, setCustomInput] = useState("");
  const [language, setLanguage] = useState<CodeLanguage>("java");
  const timerRef = useRef<number | null>(null);

  const algo = algorithms[algoId];

  const steps: SortStep[] = useMemo(() => {
    return algo.generateSteps(baseArray);
  }, [algo, baseArray]);

  // Reset cursor when steps change
  useEffect(() => {
    setStepIndex(0);
    setIsPlaying(false);
  }, [steps]);

  const initialStep: SortStep = useMemo(
    () => ({
      type: "clear",
      indices: [],
      array: baseArray,
      line: 1,
      comparisons: 0,
      swaps: 0,
    }),
    [baseArray],
  );

  const currentStep = stepIndex === 0 ? initialStep : steps[stepIndex - 1];
  const maxValue = useMemo(() => Math.max(...baseArray, 1), [baseArray]);

  // Human-readable description of the current step's action
  const actionLabel = useMemo(() => {
    if (stepIndex === 0) return "Idle — press Play to start";
    const s = currentStep;
    const arr = s.array;
    const v = (i: number) => (i >= 0 && i < arr.length ? arr[i] : "?");
    switch (s.type) {
      case "compare": {
        const [i, j] = s.indices;
        return `Comparing ${v(i)} (idx ${i}) and ${v(j)} (idx ${j})`;
      }
      case "swap": {
        const [i, j] = s.indices;
        return `Swapping ${v(j)} ↔ ${v(i)} at idx ${i} and ${j}`;
      }
      case "overwrite": {
        const i = s.indices[s.indices.length - 1];
        return `Writing ${v(i)} into idx ${i}`;
      }
      case "set-pivot": {
        const i = s.indices[0];
        return s.note ?? `Selecting pivot ${v(i)} at idx ${i}`;
      }
      case "active": {
        if (s.note) return s.note;
        if (s.indices.length === 1) return `Working on idx ${s.indices[0]} (value ${v(s.indices[0])})`;
        return `Processing range idx ${s.indices[0]}–${s.indices[s.indices.length - 1]}`;
      }
      case "mark-sorted": {
        if (s.indices.length === 1) return `Marking idx ${s.indices[0]} as sorted`;
        return `Marking ${s.indices.length} elements as sorted`;
      }
      default:
        return "Ready";
    }
  }, [currentStep, stepIndex]);

  // Persistent sorted set for visual stickiness as the algorithm marks indices
  const sortedSet = useMemo(() => {
    const s = new Set<number>();
    for (let i = 0; i < stepIndex; i++) {
      const st = steps[i];
      if (st.type === "mark-sorted") {
        st.indices.forEach((idx) => s.add(idx));
      }
    }
    return s;
  }, [steps, stepIndex]);

  // Playback loop
  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) window.clearTimeout(timerRef.current);
      return;
    }
    if (stepIndex >= steps.length) {
      setIsPlaying(false);
      return;
    }
    timerRef.current = window.setTimeout(() => {
      setStepIndex((i) => Math.min(i + 1, steps.length));
    }, SPEED_MS[speed]);
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [isPlaying, stepIndex, steps.length, speed]);

  const handlePlayPause = () => {
    if (stepIndex >= steps.length) {
      setStepIndex(0);
    }
    setIsPlaying((p) => !p);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setStepIndex(0);
  };

  const handleShuffle = useCallback(() => {
    setBaseArray(randomArray(size));
  }, [size]);

  const handleReverse = useCallback(() => {
    setBaseArray(reversedArray(size));
  }, [size]);

  const handleNearlySorted = useCallback(() => {
    setBaseArray(nearlySortedArray(size));
  }, [size]);

  const handleSizeChange = (n: number) => {
    setSize(n);
    setBaseArray(randomArray(n));
  };

  const handleApplyCustom = () => {
    const parts = customInput
      .split(/[,\s]+/)
      .map((p) => p.trim())
      .filter(Boolean);
    const nums = parts.map((p) => Number(p));
    if (nums.length < 2 || nums.some((n) => !Number.isFinite(n))) {
      toast.error("Please enter at least 2 valid integers.");
      return;
    }
    if (nums.length > 100) {
      toast.error("Maximum 100 values.");
      return;
    }
    const clamped = nums.map((n) => Math.max(1, Math.min(100, Math.round(n))));
    setBaseArray(clamped);
    setSize(clamped.length);
    toast.success(`Loaded custom array of length ${clamped.length}`);
  };

  const stepForward = () =>
    setStepIndex((i) => Math.min(i + 1, steps.length));
  const stepBack = () => setStepIndex((i) => Math.max(i - 1, 0));

  return (
    <main className="min-h-screen pb-12">
      {/* Header */}
      <header className="border-b border-border/60 bg-background/40 backdrop-blur">
        <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between px-6 py-5">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
              Sort<span className="text-primary text-glow">Specter</span>
            </h1>
            <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
              Haunt every comparison, swap and pivot — sorting algorithms
              visualized side-by-side with their source code.
            </p>
          </div>
          <div className="hidden items-center gap-2 text-xs text-muted-foreground sm:flex">
            <span className="code-font">{algo.meta.name}</span>
            <span>·</span>
            <span className="code-font">n = {baseArray.length}</span>
          </div>
        </div>
      </header>

      <div className="mx-auto mt-6 grid w-full max-w-[1600px] grid-cols-1 gap-4 px-4 sm:px-6 lg:grid-cols-[340px_1fr]">
        {/* Left rail */}
        <aside className="space-y-4">
          <Controls
            algorithms={algorithmList.map((a) => a.meta)}
            selectedId={algoId}
            onSelectAlgorithm={setAlgoId}
            size={size}
            onSizeChange={handleSizeChange}
            speed={speed}
            onSpeedChange={setSpeed}
            isPlaying={isPlaying}
            onPlayPause={handlePlayPause}
            onReset={handleReset}
            onShuffle={handleShuffle}
            onReverse={handleReverse}
            onNearlySorted={handleNearlySorted}
            onStepForward={stepForward}
            onStepBack={stepBack}
            customInput={customInput}
            onCustomInputChange={setCustomInput}
            onApplyCustom={handleApplyCustom}
          />
          <StatsPanel
            meta={algo.meta}
            comparisons={currentStep.comparisons}
            swaps={currentStep.swaps}
            stepIndex={stepIndex}
            totalSteps={steps.length}
          />
        </aside>

        {/* Main canvas + code (parallel) */}
        <section className="space-y-4">
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.4fr_1fr]">
            <BarsCanvas
              step={currentStep}
              maxValue={maxValue}
              sortedSet={sortedSet}
            />
            <CodePanel
              code={getCode(algoId, language)}
              activeLine={currentStep.line}
              actionLabel={actionLabel}
              language={language}
              onLanguageChange={setLanguage}
            />
          </div>
          <Legend />
          <div className="panel px-4 py-3 text-xs text-muted-foreground">
            <span className="text-foreground">Tip:</span> the highlighted Java
            line on the right corresponds to the action animating on the left —
            comparisons, swaps, writes and pivot picks all stay perfectly in
            sync. Use <span className="code-font text-foreground">Step ◀ ▶</span> to
            walk through one operation at a time.
          </div>
          <ComparisonTable selectedId={algoId} />
          <Recommendation
            array={baseArray}
            selectedId={algoId}
            onSelect={setAlgoId}
          />
        </section>
      </div>
    </main>
  );
};

export default Index;
