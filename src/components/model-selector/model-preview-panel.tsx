import type { CSSProperties, HTMLAttributes, Ref } from "react";
import { Separator } from "@/components/ui/separator";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  getModelById,
  type ModelSettings,
  type ReasoningLevel,
  type SpeedMode,
} from "@/lib/models";
import { cn } from "@/lib/utils";
import { ModelMetricsBar } from "./model-metrics-bar";
import { ProviderIcon } from "./provider-icon";

interface ModelPreviewPanelProps {
  className?: string;
  floatingProps?: HTMLAttributes<HTMLDivElement>;
  modelId: string;
  onSettingsChange: (settings: ModelSettings) => void;
  panelRef?: Ref<HTMLDivElement>;
  settings: ModelSettings;
  style?: CSSProperties;
}

export function ModelPreviewPanel({
  modelId,
  settings,
  onSettingsChange,
  className,
  style,
  floatingProps,
  panelRef,
  ...rest
}: ModelPreviewPanelProps) {
  const model = getModelById(modelId);

  if (!model) {
    return null;
  }

  const setReasoning = (reasoning: ReasoningLevel) => {
    onSettingsChange({ ...settings, reasoning });
  };

  const setSpeed = (speed: SpeedMode) => {
    onSettingsChange({ ...settings, speed });
  };

  return (
    <div
      className={cn(
        "z-[60] w-72 rounded-lg bg-popover p-4 text-popover-foreground shadow-lg outline-hidden ring-1 ring-foreground/10",
        className
      )}
      data-model-preview-panel
      ref={panelRef}
      style={style}
      {...rest}
      {...floatingProps}
    >
      <div className="space-y-1">
        <h3 className="font-semibold text-base">{model.name}</h3>
        <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
          <ProviderIcon providerKey={model.providerKey} />
          <span>{model.provider}</span>
        </div>
      </div>

      <p className="mt-3 text-muted-foreground text-sm leading-relaxed">
        {model.description}
      </p>

      <div className="mt-4 space-y-2">
        <ModelMetricsBar
          label="Intelligence"
          value={model.metrics.intelligence}
        />
        <ModelMetricsBar label="Speed" value={model.metrics.speed} />
        <ModelMetricsBar label="Context" value={model.metrics.context} />
        <ModelMetricsBar label="Cost" showInfo value={model.metrics.cost} />
      </div>

      <Separator className="my-4" />

      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <span className="text-muted-foreground text-xs">Reasoning</span>
          <ToggleGroup
            onValueChange={(value) => {
              const next = value[0];
              if (next === "low" || next === "medium" || next === "high") {
                setReasoning(next);
              }
            }}
            spacing={0}
            value={[settings.reasoning]}
            variant="outline"
          >
            <ToggleGroupItem className="px-2.5 text-xs" value="low">
              Low
            </ToggleGroupItem>
            <ToggleGroupItem className="px-2.5 text-xs" value="medium">
              Medium
            </ToggleGroupItem>
            <ToggleGroupItem className="px-2.5 text-xs" value="high">
              High
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        <div className="flex items-center justify-between gap-3">
          <span className="text-muted-foreground text-xs">Speed</span>
          <ToggleGroup
            onValueChange={(value) => {
              const next = value[0];
              if (next === "standard" || next === "fast") {
                setSpeed(next);
              }
            }}
            spacing={0}
            value={[settings.speed]}
            variant="outline"
          >
            <ToggleGroupItem className="px-2.5 text-xs" value="standard">
              Standard
            </ToggleGroupItem>
            <ToggleGroupItem className="px-2.5 text-xs" value="fast">
              Fast
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>
    </div>
  );
}
