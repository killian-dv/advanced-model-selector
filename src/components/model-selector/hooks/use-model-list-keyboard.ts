import type { KeyboardEvent, RefObject } from "react";
import type { Model } from "@/lib/models";

interface UseModelListKeyboardOptions {
  highlightedId: string | null;
  highlightedIndex: number;
  highlightModelAtIndex: (
    index: number,
    modelList: Model[],
    onHighlight: (modelId: string, element: HTMLElement) => void
  ) => void;
  models: Model[];
  moveHighlight: (
    direction: 1 | -1,
    onHighlight: (modelId: string, element: HTMLElement) => void
  ) => void;
  onClose: () => void;
  onHighlight: (modelId: string, element: HTMLElement) => void;
  onSelect: (modelId: string) => void;
  searchInputRef: RefObject<HTMLInputElement | null>;
}

export function useModelListKeyboard({
  models,
  highlightedId,
  highlightedIndex,
  moveHighlight,
  highlightModelAtIndex,
  onHighlight,
  onSelect,
  onClose,
  searchInputRef,
}: UseModelListKeyboardOptions) {
  const handleSearchKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      moveHighlight(1, onHighlight);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (highlightedIndex <= 0) {
        searchInputRef.current?.focus();
        return;
      }
      moveHighlight(-1, onHighlight);
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      if (highlightedId) {
        onSelect(highlightedId);
      }
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      onClose();
      return;
    }

    if (event.key === "Home") {
      event.preventDefault();
      highlightModelAtIndex(0, models, onHighlight);
      return;
    }

    if (event.key === "End") {
      event.preventDefault();
      highlightModelAtIndex(models.length - 1, models, onHighlight);
    }
  };

  return { handleSearchKeyDown };
}
