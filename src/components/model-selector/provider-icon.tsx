import type { Model } from "@/lib/models";
import { cn } from "@/lib/utils";

const PROVIDER_ICONS: Record<Model["providerKey"], string> = {
  anthropic: "/icons/claude.svg",
  openai: "/icons/openai.svg",
  google: "/icons/gemini.svg",
};

interface ProviderIconProps {
  className?: string;
  providerKey: Model["providerKey"];
}

export function ProviderIcon({ providerKey, className }: ProviderIconProps) {
  return (
    <img
      alt=""
      className={cn("size-4 shrink-0", className)}
      height={16}
      src={PROVIDER_ICONS[providerKey]}
      width={16}
    />
  );
}
