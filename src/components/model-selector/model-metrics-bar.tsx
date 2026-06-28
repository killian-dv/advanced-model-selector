import { cn } from "@/lib/utils";

const SEGMENT_COUNT = 10;
const MAX_VALUE = 5;

interface ModelMetricsBarProps {
  label: string;
  value: number;
}

export function ModelMetricsBar({ label, value }: ModelMetricsBarProps) {
  const filledCount = Math.round((value / MAX_VALUE) * SEGMENT_COUNT);

  return (
    <div className="flex flex-col gap-1">
      <span className="font-mono text-muted-foreground text-xs uppercase">
        {label}
      </span>
      <div className="grid w-full grid-cols-10 gap-1">
        {Array.from({ length: SEGMENT_COUNT }, (_, index) => (
          <span
            className={cn(
              "h-4 w-2 justify-self-center rounded-full bg-muted",
              index < filledCount && "bg-emerald-500"
            )}
            key={label + String(index)}
          />
        ))}
      </div>
    </div>
  );
}
