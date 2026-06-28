import {
  autoUpdate,
  flip,
  offset,
  safePolygon,
  shift,
  useFloating,
  useHover,
  useInteractions,
} from "@floating-ui/react";
import { useCallback, useMemo, useState } from "react";

const PREVIEW_GAP = 12;

export function useFloatingPreview(enabled: boolean) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const { refs, floatingStyles, context } = useFloating({
    open: enabled && activeId !== null,
    onOpenChange: (open) => {
      if (!open) {
        setActiveId(null);
      }
    },
    placement: "right",
    middleware: [
      offset(PREVIEW_GAP),
      flip({ fallbackPlacements: ["left", "right"] }),
      shift({ padding: 12 }),
    ],
    whileElementsMounted: autoUpdate,
  });

  const hover = useHover(context, {
    enabled,
    move: false,
    delay: { open: 0, close: 80 },
    handleClose: safePolygon({
      blockPointerEvents: true,
      buffer: 1,
      requireIntent: false,
    }),
  });

  const { getReferenceProps, getFloatingProps } = useInteractions([hover]);

  const activate = useCallback(
    (id: string, element: HTMLElement) => {
      refs.setReference(element);
      setActiveId(id);
    },
    [refs]
  );

  const deactivate = useCallback(() => {
    setActiveId(null);
  }, []);

  const referenceProps = useMemo(
    () => getReferenceProps({ onMouseEnter: undefined }),
    [getReferenceProps]
  );

  return {
    activeId,
    activate,
    deactivate,
    refs,
    floatingStyles,
    referenceProps,
    floatingProps: getFloatingProps(),
  };
}
