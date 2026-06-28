import type { HTMLAttributes } from "react";
import type { Model, ModelSettings } from "@/lib/models";
import { cn } from "@/lib/utils";
import { ModelListBadges } from "./model-setting-badge";
import { ProviderIcon } from "./provider-icon";

export interface ModelListItemProps {
  activeReferenceProps?: HTMLAttributes<HTMLButtonElement>;
  id: string;
  isHighlighted: boolean;
  isSelected: boolean;
  itemRef: (node: HTMLButtonElement | null) => void;
  model: Model;
  onMouseEnter: (element: HTMLElement) => void;
  onSelect: () => void;
  settings: ModelSettings;
}

export function ModelListItem({
  model,
  settings,
  isHighlighted,
  isSelected,
  onSelect,
  onMouseEnter,
  activeReferenceProps,
  itemRef,
  id,
}: ModelListItemProps) {
  return (
    <button
      aria-selected={isSelected}
      className={cn(
        "flex w-full cursor-default items-start gap-2 rounded-lg px-2.5 py-2 text-left outline-hidden transition-colors focus-visible:ring-2 focus-visible:ring-ring/50",
        isSelected && "bg-model-selector-selected",
        isHighlighted && !isSelected && "bg-model-selector-hover",
        !(isSelected || isHighlighted) && "hover:bg-model-selector-hover"
      )}
      id={id}
      onClick={onSelect}
      onMouseEnter={(event) => {
        onMouseEnter(event.currentTarget);
      }}
      ref={itemRef}
      role="option"
      type="button"
      {...(isHighlighted ? activeReferenceProps : {})}
    >
      <ModelListItemContent model={model} settings={settings} />
    </button>
  );
}

function ModelListItemContent({
  model,
  settings,
}: {
  model: Model;
  settings: ModelSettings;
}) {
  return (
    <div className="min-w-0 flex-1">
      <div className="flex items-start justify-between gap-2">
        <div className="font-medium text-sm">{model.name}</div>
        <ModelListBadges model={model} settings={settings} />
      </div>
      <div className="mt-0.5 flex items-center gap-1.5 text-muted-foreground text-sm">
        <ProviderIcon providerKey={model.providerKey} />
        <span>{model.provider}</span>
      </div>
    </div>
  );
}
