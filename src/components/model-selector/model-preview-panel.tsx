import type { CSSProperties, HTMLAttributes, Ref } from "react";
import { Separator } from "@/components/ui/separator";
import {
  getModelById,
  type ModelSettings,
  type ReasoningLevel,
  type SpeedMode,
} from "@/lib/models";
import { cn } from "@/lib/utils";
import { ModelMetricsBar } from "./model-metrics-bar";
import { SelectableSettingBadge } from "./model-setting-badge";
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

const REASONING_OPTIONS: { label: string; value: ReasoningLevel }[] = [
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
];

const SPEED_OPTIONS: { label: string; value: SpeedMode }[] = [
  { label: "Standard", value: "standard" },
  { label: "Fast", value: "fast" },
];

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

  const { reasoning: hasReasoning, speed: hasSpeed } = model.capabilities;
  const hasConfiguration = hasReasoning || hasSpeed;

  const setReasoning = (reasoning: ReasoningLevel) => {
    onSettingsChange({ ...settings, reasoning });
  };

  const setSpeed = (speed: SpeedMode) => {
    onSettingsChange({ ...settings, speed });
  };

  return (
    <div
      className={cn(
        "z-[60] w-72 rounded-lg bg-popover text-popover-foreground shadow-lg outline-hidden ring-1 ring-foreground/10",
        className
      )}
      data-model-preview-panel
      ref={panelRef}
      style={style}
      {...rest}
      {...floatingProps}
    >
      <div className="p-4">
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
      </div>

      {hasConfiguration ? (
        <>
          <Separator />
          <div className="space-y-2 p-4">
            <h4 className="font-mono font-semibold text-foreground/70 text-xs uppercase">
              Configuration
            </h4>

            {hasReasoning ? (
              <div className="flex flex-col gap-1.5">
                <span className="text-muted-foreground text-sm">Reasoning</span>
                <div className="flex flex-wrap gap-1.5">
                  {REASONING_OPTIONS.map((option) => (
                    <SelectableSettingBadge
                      key={option.value}
                      label={option.label}
                      onSelect={() => {
                        setReasoning(option.value);
                      }}
                      selected={settings.reasoning === option.value}
                    />
                  ))}
                </div>
              </div>
            ) : null}

            {hasSpeed ? (
              <div className="flex flex-col gap-1.5">
                <span className="text-muted-foreground text-sm">Speed</span>
                <div className="flex flex-wrap gap-1.5">
                  {SPEED_OPTIONS.map((option) => (
                    <SelectableSettingBadge
                      key={option.value}
                      label={option.label}
                      onSelect={() => {
                        setSpeed(option.value);
                      }}
                      selected={settings.speed === option.value}
                    />
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </>
      ) : null}
    </div>
  );
}
