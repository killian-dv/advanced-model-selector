import { type RefObject, useEffect } from "react";

interface UseHidePreviewOffscreenOptions {
  activeId: string | null;
  getItemElement: (modelId: string) => HTMLElement | undefined;
  onHidden: () => void;
  scrollContainerRef: RefObject<HTMLElement | null>;
}

export function useHidePreviewOffscreen({
  activeId,
  getItemElement,
  scrollContainerRef,
  onHidden,
}: UseHidePreviewOffscreenOptions) {
  useEffect(() => {
    const root = scrollContainerRef.current;
    if (!(activeId && root)) {
      return;
    }

    const element = getItemElement(activeId);
    if (!element) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          onHidden();
        }
      },
      { root, threshold: 0 }
    );

    observer.observe(element);
    return () => {
      observer.disconnect();
    };
  }, [activeId, getItemElement, onHidden, scrollContainerRef]);
}
