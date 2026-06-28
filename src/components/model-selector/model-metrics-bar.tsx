import { motion } from "motion/react";
import { cn } from "@/lib/utils";

const SEGMENT_COUNT = 10;
const MAX_VALUE = 5;

const FILL_STAGGER_S = 0.045;
const FILL_DELAY_S = 0.12;
const FILL_DURATION_S = 0.32;
const COLOR_SETTLE_DURATION_S = 0.22;

const RED: [number, number, number] = [239, 68, 68];
const ORANGE: [number, number, number] = [249, 115, 22];
const GREEN: [number, number, number] = [16, 185, 129];

const GREEN_ZONE_START = 5;
const GREEN_ZONE_END = 10;

type MetricVariant = "default" | "cost";
type Rgb = [number, number, number];

function lerp(start: number, end: number, amount: number) {
  return start + (end - start) * amount;
}

function blendRgb(from: Rgb, to: Rgb, amount: number): Rgb {
  return [
    Math.round(lerp(from[0], to[0], amount)),
    Math.round(lerp(from[1], to[1], amount)),
    Math.round(lerp(from[2], to[2], amount)),
  ];
}

function mixRgb(from: Rgb, to: Rgb, amount: number) {
  const blended = blendRgb(from, to, amount);
  return toCss(blended);
}

function toCss(color: Rgb) {
  return `rgb(${color[0]} ${color[1]} ${color[2]})`;
}

function getBlendAmount(filledCount: number) {
  const span = GREEN_ZONE_END - GREEN_ZONE_START;

  if (span <= 0) {
    return 0;
  }

  return Math.min(1, Math.max(0, (filledCount - GREEN_ZONE_START) / span));
}

function getScoreColor(filledCount: number, variant: MetricVariant): Rgb {
  if (variant === "cost") {
    if (filledCount <= 2) {
      return GREEN;
    }

    if (filledCount <= 4) {
      return ORANGE;
    }

    return blendRgb(ORANGE, RED, getBlendAmount(filledCount));
  }

  if (filledCount <= 2) {
    return RED;
  }

  if (filledCount <= 4) {
    return ORANGE;
  }

  return blendRgb(ORANGE, GREEN, getBlendAmount(filledCount));
}

function getFilledCount(value: number, variant: MetricVariant) {
  if (variant === "cost") {
    return Math.round(((MAX_VALUE - value + 1) / MAX_VALUE) * SEGMENT_COUNT);
  }

  return Math.round((value / MAX_VALUE) * SEGMENT_COUNT);
}

function getProgressiveColor(
  index: number,
  filledCount: number,
  variant: MetricVariant
) {
  const finalColor = getScoreColor(filledCount, variant);

  if (filledCount <= 1) {
    return toCss(finalColor);
  }

  const progress = index / (filledCount - 1);
  const startColor = variant === "cost" ? GREEN : RED;

  return mixRgb(startColor, finalColor, progress);
}

interface ModelMetricsBarProps {
  animationKey: string;
  label: string;
  value: number;
  variant?: MetricVariant;
}

export function ModelMetricsBar({
  animationKey,
  label,
  value,
  variant = "default",
}: ModelMetricsBarProps) {
  const filledCount = getFilledCount(value, variant);
  const finalColor = toCss(getScoreColor(filledCount, variant));

  return (
    <div className="flex flex-col gap-1">
      <span className="font-mono text-muted-foreground text-xs uppercase">
        {label}
      </span>
      <div className="grid w-full grid-cols-10 gap-1">
        {Array.from({ length: SEGMENT_COUNT }, (_, index) => {
          const isFilled = index < filledCount;
          const appearDelay = FILL_DELAY_S + index * FILL_STAGGER_S;
          const colorSettleDelay = appearDelay + FILL_DURATION_S * 0.4;
          const progressiveColor = isFilled
            ? getProgressiveColor(index, filledCount, variant)
            : finalColor;
          const isLeadingEdge = isFilled && index < filledCount - 1;

          return (
            <span
              className="relative h-4 w-2 justify-self-center overflow-hidden rounded-full bg-muted"
              key={`${animationKey}-${label}-${String(index)}`}
            >
              <motion.span
                animate={{
                  backgroundColor: isFilled ? finalColor : progressiveColor,
                  scaleY: isFilled ? 1 : 0,
                }}
                className={cn("absolute inset-0 rounded-full")}
                initial={{
                  backgroundColor: progressiveColor,
                  scaleY: 0,
                }}
                style={{
                  transformOrigin: "bottom",
                }}
                transition={{
                  backgroundColor: isLeadingEdge
                    ? {
                        delay: colorSettleDelay,
                        duration: COLOR_SETTLE_DURATION_S,
                        ease: [0.4, 0, 0.2, 1],
                      }
                    : { duration: 0 },
                  scaleY: {
                    delay: isFilled ? appearDelay : 0,
                    duration: FILL_DURATION_S,
                    ease: [0.22, 1, 0.36, 1],
                  },
                }}
              />
            </span>
          );
        })}
      </div>
    </div>
  );
}
