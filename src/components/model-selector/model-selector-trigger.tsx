import { ChevronDownIcon } from "lucide-react";
import type { Model } from "@/lib/models";
import { ProviderIcon } from "./provider-icon";

interface ModelSelectorTriggerLabelProps {
  model: Model;
}

export function ModelSelectorTriggerLabel({
  model,
}: ModelSelectorTriggerLabelProps) {
  return (
    <>
      <ProviderIcon providerKey={model.providerKey} />
      <span className="max-w-[140px] truncate">{model.name}</span>
      <ChevronDownIcon className="size-3.5 opacity-60" />
    </>
  );
}

export const modelSelectorTriggerClassName =
  "h-7 gap-1.5 px-2 font-medium text-xs";
