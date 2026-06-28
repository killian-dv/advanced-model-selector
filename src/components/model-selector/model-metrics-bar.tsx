import { motion } from "motion/react";

const SEGMENT_COUNT = 10;
const MAX_VALUE = 5;
const BLEND_ZONE = { start: 5, end: 10 } as const;
const RED_ZONE_MAX = 2;
const ORANGE_ZONE_MAX = 4;

const TIMING = {
  fillDelay: 0.12,
  fillStagger: 0.045,
  fillDuration: 0.32,
  colorSettleDuration: 0.22,
  colorSettleRatio: 0.4,
} as const;

const EASE_FILL = [0.22, 1, 0.36, 1] as const;
const EASE_COLOR = [0.4, 0, 0.2, 1] as const;

type MetricVariant = "default" | "cost";
type Rgb = [number, number, number];

const RED: Rgb = [239, 68, 68];
const ORANGE: Rgb = [249, 115, 22];
const GREEN: Rgb = [16, 185, 129];

const VARIANT_CONFIG = {
  default: {
    anchors: [
      { max: RED_ZONE_MAX, color: RED },
      { max: ORANGE_ZONE_MAX, color: ORANGE },
    ],
    blendFrom: ORANGE,
    blendTo: GREEN,
    animationStart: RED,
  },
  cost: {
    anchors: [
      { max: RED_ZONE_MAX, color: GREEN },
      { max: ORANGE_ZONE_MAX, color: ORANGE },
    ],
    blendFrom: ORANGE,
    blendTo: RED,
    animationStart: GREEN,
  },
} as const satisfies Record<
  MetricVariant,
  {
    anchors: { max: number; color: Rgb }[];
    blendFrom: Rgb;
    blendTo: Rgb;
    animationStart: Rgb;
  }
>;

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

function toCss(color: Rgb) {
  return `rgb(${color[0]} ${color[1]} ${color[2]})`;
}

function getBlendAmount(filledCount: number) {
  const span = BLEND_ZONE.end - BLEND_ZONE.start;
  return Math.min(1, Math.max(0, (filledCount - BLEND_ZONE.start) / span));
}

function getFilledCount(value: number, variant: MetricVariant) {
  if (variant === "cost") {
    return Math.round(((MAX_VALUE - value + 1) / MAX_VALUE) * SEGMENT_COUNT);
  }

  return Math.round((value / MAX_VALUE) * SEGMENT_COUNT);
}

function getScoreColor(filledCount: number, variant: MetricVariant): Rgb {
  const config = VARIANT_CONFIG[variant];

  for (const anchor of config.anchors) {
    if (filledCount <= anchor.max) {
      return anchor.color;
    }
  }

  return blendRgb(config.blendFrom, config.blendTo, getBlendAmount(filledCount));
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
  const { animationStart } = VARIANT_CONFIG[variant];

  return toCss(blendRgb(animationStart, finalColor, progress));
}

interface MetricSegmentProps {
  appearDelay: number;
  colorSettleDelay: number;
  finalColor: string;
  isFilled: boolean;
  isLeadingEdge: boolean;
  progressiveColor: string;
}

function MetricSegment({
  isFilled,
  appearDelay,
  colorSettleDelay,
  progressiveColor,
  finalColor,
  isLeadingEdge,
}: MetricSegmentProps) {
  return (
    <span className="relative h-4 w-2 justify-self-center overflow-hidden rounded-full bg-muted">
      <motion.span
        animate={{
          backgroundColor: isFilled ? finalColor : progressiveColor,
          scaleY: isFilled ? 1 : 0,
        }}
        className="absolute inset-0 rounded-full"
        initial={{
          backgroundColor: progressiveColor,
          scaleY: 0,
        }}
        style={{ transformOrigin: "bottom" }}
        transition={{
          backgroundColor: isLeadingEdge
            ? {
                delay: colorSettleDelay,
                duration: TIMING.colorSettleDuration,
                ease: EASE_COLOR,
              }
            : { duration: 0 },
          scaleY: {
            delay: isFilled ? appearDelay : 0,
            duration: TIMING.fillDuration,
            ease: EASE_FILL,
          },
        }}
      />
    </span>
  );
}

export interface ModelMetricsBarProps {
  label: string;
  resetKey: string;
  value: number;
  variant?: MetricVariant;
}

export function ModelMetricsBar({
  resetKey,
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
          const appearDelay = TIMING.fillDelay + index * TIMING.fillStagger;
          const colorSettleDelay =
            appearDelay + TIMING.fillDuration * TIMING.colorSettleRatio;

          return (
            <MetricSegment
              appearDelay={appearDelay}
              colorSettleDelay={colorSettleDelay}
              finalColor={finalColor}
              isFilled={isFilled}
              isLeadingEdge={isFilled && index < filledCount - 1}
              key={`${resetKey}-${label}-${String(index)}`}
              progressiveColor={
                isFilled
                  ? getProgressiveColor(index, filledCount, variant)
                  : finalColor
              }
            />
          );
        })}
      </div>
    </div>
  );
}
