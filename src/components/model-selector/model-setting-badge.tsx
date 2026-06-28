import { BrainIcon, ZapIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import type { Model, ModelSettings } from "@/lib/models";
import { cn } from "@/lib/utils";

const listBadgeClassName =
  "!rounded-sm gap-1 border-0 bg-model-selector-badge font-medium text-foreground";

const selectableBadgeClassName = "!rounded-sm gap-1 border-0 font-medium";

interface ModelBadgeProps {
  icon?: ReactNode;
  label: string;
}

function ModelBadge({ icon, label }: ModelBadgeProps) {
  return (
    <Badge className={listBadgeClassName} variant="outline">
      {icon}
      {label}
    </Badge>
  );
}

export function ModelFastBadge({ label }: { label: string }) {
  return (
    <ModelBadge
      icon={<ZapIcon className="size-3 fill-amber-400 text-amber-400" />}
      label={label}
    />
  );
}

export function ModelHighBadge({ label }: { label: string }) {
  return <ModelBadge icon={<BrainIcon className="size-3" />} label={label} />;
}

interface SelectableSettingBadgeProps {
  label: string;
  onSelect: () => void;
  selected: boolean;
}

export function SelectableSettingBadge({
  label,
  selected,
  onSelect,
}: SelectableSettingBadgeProps) {
  return (
    <button
      className={cn(
        selectableBadgeClassName,
        "inline-flex h-6 cursor-default items-center px-2 font-normal text-sm transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring/50",
        selected
          ? "bg-model-selector-selected text-foreground"
          : "bg-model-selector-hover text-muted-foreground"
      )}
      onClick={onSelect}
      type="button"
    >
      {label}
    </button>
  );
}

interface ModelListBadgesProps {
  model: Model;
  settings: ModelSettings;
}

export function ModelListBadges({ model, settings }: ModelListBadgesProps) {
  const badges: ReactNode[] = [];

  if (model.capabilities.reasoning && settings.reasoning === "high") {
    badges.push(<ModelHighBadge key="high" label="High" />);
  }

  if (model.capabilities.speed && settings.speed === "fast") {
    badges.push(<ModelFastBadge key="fast" label="Fast" />);
  }

  if (badges.length === 0) {
    return null;
  }

  return <div className="flex shrink-0 gap-1">{badges}</div>;
}
