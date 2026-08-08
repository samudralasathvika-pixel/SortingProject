import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pause,
  Play,
  RotateCcw,
  Shuffle,
  SkipBack,
  SkipForward,
  ArrowDownUp,
  CheckCircle2,
} from "lucide-react";
import { AlgorithmMeta } from "@/lib/sorting";
import { cn } from "@/lib/utils";

interface ControlsProps {
  algorithms: AlgorithmMeta[];
  selectedId: string;
  onSelectAlgorithm: (id: string) => void;
  size: number;
  onSizeChange: (n: number) => void;
  speed: number;
  onSpeedChange: (n: number) => void;
  isPlaying: boolean;
  onPlayPause: () => void;
  onReset: () => void;
  onShuffle: () => void;
  onReverse: () => void;
  onNearlySorted: () => void;
  onStepForward: () => void;
  onStepBack: () => void;
  customInput: string;
  onCustomInputChange: (v: string) => void;
  onApplyCustom: () => void;
  disabled?: boolean;
}

const PRESET_SIZES = [10, 25, 40, 50, 75, 100];
const SPEED_LABELS: Record<number, string> = {
  1: "0.25×", 2: "0.5×", 3: "1×", 4: "2×", 5: "4×",
};

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <Label className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
    {children}
  </Label>
);

export const Controls = ({
  algorithms,
  selectedId,
  onSelectAlgorithm,
  size,
  onSizeChange,
  speed,
  onSpeedChange,
  isPlaying,
  onPlayPause,
  onReset,
  onShuffle,
  onReverse,
  onNearlySorted,
  onStepForward,
  onStepBack,
  customInput,
  onCustomInputChange,
  onApplyCustom,
  disabled,
}: ControlsProps) => {
  return (
    <div className="panel space-y-5 p-4">
      {/* Algorithm */}
      <div className="space-y-2">
        <SectionLabel>Algorithm</SectionLabel>
        <Select value={selectedId} onValueChange={onSelectAlgorithm}>
          <SelectTrigger className="bg-secondary/60">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {algorithms.map((a) => (
              <SelectItem key={a.id} value={a.id}>
                {a.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* ACTIONS */}
      <div className="space-y-2">
        <SectionLabel>Actions</SectionLabel>
        <Button
          onClick={onPlayPause}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {isPlaying ? (
            <><Pause className="mr-1.5 h-4 w-4" /> Pause</>
          ) : (
            <><Play className="mr-1.5 h-4 w-4" /> Sort</>
          )}
        </Button>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="secondary"
            onClick={onPlayPause}
            disabled={!isPlaying}
          >
            <Pause className="mr-1.5 h-4 w-4" /> Pause
          </Button>
          <Button
            variant="outline"
            onClick={onReset}
            disabled={disabled}
            className="border-destructive/40 bg-destructive/10 text-destructive hover:bg-destructive/20 hover:text-destructive"
          >
            <RotateCcw className="mr-1.5 h-4 w-4" /> Reset
          </Button>
        </div>
        {/* Step controls */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <Button
            variant="secondary"
            size="sm"
            onClick={onStepBack}
            disabled={disabled}
          >
            <SkipBack className="mr-1.5 h-3.5 w-3.5" /> Step Back
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={onStepForward}
            disabled={disabled}
          >
            Step Forward <SkipForward className="ml-1.5 h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* GENERATE ARRAY */}
      <div className="space-y-2">
        <SectionLabel>Generate Array</SectionLabel>
        <Button
          variant="outline"
          onClick={onShuffle}
          disabled={disabled}
          className="w-full border-primary/40 bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary"
        >
          <Shuffle className="mr-1.5 h-4 w-4" /> Random
        </Button>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={onReverse}
            disabled={disabled}
            className="min-w-0 px-2"
          >
            <ArrowDownUp className="mr-1 h-3.5 w-3.5 shrink-0" />
            <span className="truncate">Reverse</span>
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={onNearlySorted}
            disabled={disabled}
            className="min-w-0 px-2"
          >
            <CheckCircle2 className="mr-1 h-3.5 w-3.5 shrink-0" />
            <span className="truncate">Nearly Sorted</span>
          </Button>
        </div>
      </div>

      {/* PRESET SIZES */}
      <div className="space-y-2">
        <SectionLabel>Preset Sizes · n = {size}</SectionLabel>
        <div className="grid grid-cols-6 gap-1.5">
          {PRESET_SIZES.map((s) => (
            <button
              key={s}
              onClick={() => onSizeChange(s)}
              disabled={disabled}
              className={cn(
                "code-font rounded-md border px-2 py-1.5 text-xs transition-colors",
                size === s
                  ? "border-primary bg-primary/15 text-primary"
                  : "border-border bg-secondary/40 text-muted-foreground hover:text-foreground",
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Speed */}
      <div className="space-y-2">
        <Label className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          <span>Speed</span>
          <span className="code-font text-primary">{SPEED_LABELS[speed]}</span>
        </Label>
        <Slider
          value={[speed]}
          min={1}
          max={5}
          step={1}
          onValueChange={(v) => onSpeedChange(v[0])}
        />
      </div>

      {/* Custom array */}
      <div className="space-y-2 border-t border-border pt-4">
        <SectionLabel>Custom Array</SectionLabel>
        <Input
          value={customInput}
          onChange={(e) => onCustomInputChange(e.target.value)}
          placeholder="e.g. 5, 12, 3, 8, 21"
          className="code-font bg-secondary/60 text-sm"
        />
        <Button
          variant="secondary"
          onClick={onApplyCustom}
          disabled={disabled}
          className="w-full"
        >
          Apply Custom Array
        </Button>
        <p className="text-[10px] text-muted-foreground">
          Comma-separated integers between 1–100. Max 100 values.
        </p>
      </div>
    </div>
  );
};
