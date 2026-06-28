import type { RefObject } from "react";
import { useCallback } from "react";
import type { Model } from "@/lib/models";
import { useModelItemRefs } from "./use-model-item-refs";
import { useModelListKeyboard } from "./use-model-list-keyboard";

interface UseModelListNavigationOptions {
  highlightedId: string | null;
  models: Model[];
  onClose: () => void;
  onHighlight: (modelId: string, element: HTMLElement) => void;
  onSelect: (modelId: string) => void;
  searchInputRef: RefObject<HTMLInputElement | null>;
}

export function useModelListNavigation({
  models,
  highlightedId,
  onHighlight,
  onSelect,
  onClose,
  searchInputRef,
}: UseModelListNavigationOptions) {
  const { setItemRef, highlightModel, highlightModelAtIndex, getItemElement } =
    useModelItemRefs(models);

  const highlightedIndex = models.findIndex(
    (model) => model.id === highlightedId
  );

  const moveHighlight = useCallback(
    (
      direction: 1 | -1,
      highlight: (modelId: string, element: HTMLElement) => void
    ) => {
      if (models.length === 0) {
        return;
      }

      const startIndex = highlightedIndex >= 0 ? highlightedIndex : 0;
      const nextIndex = Math.max(
        0,
        Math.min(models.length - 1, startIndex + direction)
      );
      const nextModel = models[nextIndex];
      highlightModel(nextModel.id, highlight);
    },
    [highlightModel, highlightedIndex, models]
  );

  const { handleSearchKeyDown } = useModelListKeyboard({
    highlightedId,
    highlightedIndex,
    highlightModelAtIndex,
    models,
    moveHighlight,
    onClose,
    onHighlight,
    onSelect,
    searchInputRef,
  });

  return {
    getItemElement,
    handleSearchKeyDown,
    setItemRef,
  };
}
