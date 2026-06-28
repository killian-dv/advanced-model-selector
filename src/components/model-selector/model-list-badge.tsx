import { BrainIcon, ZapIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import type { Model } from "@/lib/models";

interface ModelBadgeProps {
  icon: ReactNode;
  label: string;
}

function ModelBadge({ icon, label }: ModelBadgeProps) {
  return (
    <Badge
      className="!rounded-sm gap-1 border-0 bg-model-selector-badge font-medium text-foreground"
      variant="outline"
    >
      {icon}
      {label}
    </Badge>
  );
}

function ModelFastBadge({ label }: { label: string }) {
  return (
    <ModelBadge
      icon={<ZapIcon className="size-3 fill-amber-400 text-amber-400" />}
      label={label}
    />
  );
}

function ModelHighBadge({ label }: { label: string }) {
  return <ModelBadge icon={<BrainIcon className="size-3" />} label={label} />;
}

interface ModelListBadgeProps {
  model: Model;
}

export function ModelListBadge({ model }: ModelListBadgeProps) {
  if (!model.badge) {
    return null;
  }

  if (model.badge.variant === "fast") {
    return <ModelFastBadge label={model.badge.label} />;
  }

  return <ModelHighBadge label={model.badge.label} />;
}
