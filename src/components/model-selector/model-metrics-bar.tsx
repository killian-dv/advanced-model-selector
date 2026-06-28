import { InfoIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const SEGMENT_COUNT = 5;

interface ModelMetricsBarProps {
  label: string;
  showInfo?: boolean;
  value: number;
}

export function ModelMetricsBar({
  label,
  value,
  showInfo = false,
}: ModelMetricsBarProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex w-24 shrink-0 items-center gap-1 text-muted-foreground text-xs">
        <span>{label}</span>
        {showInfo ? <InfoIcon className="size-3 opacity-60" /> : null}
      </div>
      <div className="flex flex-1 gap-1">
        {Array.from({ length: SEGMENT_COUNT }, (_, index) => (
          <span
            className={cn(
              "h-2 flex-1 rounded-full bg-muted",
              index < value && "bg-emerald-500"
            )}
            key={label + String(index)}
          />
        ))}
      </div>
    </div>
  );
}
