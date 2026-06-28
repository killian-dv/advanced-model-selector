import { useCallback, useEffect, useRef } from "react";
import type { Model } from "@/lib/models";

export function useModelItemRefs(models: Model[]) {
  const itemRefs = useRef(new Map<string, HTMLButtonElement>());

  useEffect(() => {
    const validIds = new Set(models.map((model) => model.id));
    for (const id of itemRefs.current.keys()) {
      if (!validIds.has(id)) {
        itemRefs.current.delete(id);
      }
    }
  }, [models]);

  const setItemRef = useCallback(
    (modelId: string, node: HTMLButtonElement | null) => {
      if (node) {
        itemRefs.current.set(modelId, node);
        return;
      }
      itemRefs.current.delete(modelId);
    },
    []
  );

  const highlightModel = useCallback(
    (
      modelId: string,
      onHighlight: (modelId: string, element: HTMLElement) => void
    ) => {
      const element = itemRefs.current.get(modelId);
      if (!element) {
        return;
      }

      onHighlight(modelId, element);
      element.scrollIntoView({ block: "nearest" });
    },
    []
  );

  const highlightModelAtIndex = useCallback(
    (
      index: number,
      modelList: Model[],
      onHighlight: (modelId: string, element: HTMLElement) => void
    ) => {
      const model = modelList[index];
      if (!model) {
        return;
      }

      highlightModel(model.id, onHighlight);
    },
    [highlightModel]
  );

  const getItemElement = useCallback(
    (modelId: string) => itemRefs.current.get(modelId),
    []
  );

  return {
    getItemElement,
    highlightModel,
    highlightModelAtIndex,
    setItemRef,
  };
}
