import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useFloatingPreview } from "@/hooks/use-floating-preview";
import { filterModels } from "@/lib/filter-models";
import {
  DEFAULT_MODEL_ID,
  getDefaultSettings,
  getModelById,
  MODELS,
  type Model,
  type ModelSettings,
} from "@/lib/models";
import { isInteractionInsideMenuOrPreview } from "../lib/is-popover-interaction-contained";

interface UseModelSelectorOptions {
  onValueChange?: (modelId: string, settings: ModelSettings) => void;
  value?: string;
}

export function useModelSelector({
  value = DEFAULT_MODEL_ID,
  onValueChange,
}: UseModelSelectorOptions) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const [settingsByModel, setSettingsByModel] = useState<
    Record<string, ModelSettings>
  >({});

  const previewPanelRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const prevOpenRef = useRef(false);

  const selectedModel = getModelById(value) ?? MODELS[0];
  const preview = useFloatingPreview(open);
  const filteredModels = useMemo(
    () => filterModels(MODELS, searchQuery),
    [searchQuery]
  );

  const getDefaultHighlightId = useCallback(
    (models: Model[]) => {
      const selectedInList = models.find((model) => model.id === value);
      return selectedInList?.id ?? models[0]?.id ?? null;
    },
    [value]
  );

  const getSettings = useCallback(
    (modelId: string): ModelSettings => {
      const existing = settingsByModel[modelId];
      if (existing) {
        return existing;
      }

      const model = getModelById(modelId);
      return model ? getDefaultSettings(model) : getDefaultSettings(MODELS[0]);
    },
    [settingsByModel]
  );

  const resetMenuState = useCallback(() => {
    setSearchQuery("");
    setHighlightedId(null);
    preview.deactivate();
  }, [preview]);

  const closeMenu = useCallback(() => {
    setOpen(false);
    resetMenuState();
  }, [resetMenuState]);

  useEffect(() => {
    if (open && !prevOpenRef.current) {
      setHighlightedId(getDefaultHighlightId(filteredModels));
    }
    prevOpenRef.current = open;
  }, [open, getDefaultHighlightId, filteredModels]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const frame = requestAnimationFrame(() => {
      searchInputRef.current?.focus();
    });

    return () => {
      cancelAnimationFrame(frame);
    };
  }, [open]);

  useEffect(() => {
    if (
      highlightedId &&
      !filteredModels.some((model) => model.id === highlightedId)
    ) {
      setHighlightedId(getDefaultHighlightId(filteredModels));
    }
  }, [filteredModels, highlightedId, getDefaultHighlightId]);

  useEffect(() => {
    if (
      preview.activeId &&
      !filteredModels.some((model) => model.id === preview.activeId)
    ) {
      preview.deactivate();
    }
  }, [filteredModels, preview.activeId, preview]);

  const updateSettings = useCallback(
    (modelId: string, settings: ModelSettings) => {
      setSettingsByModel((current) => ({
        ...current,
        [modelId]: settings,
      }));

      if (modelId === value) {
        onValueChange?.(modelId, settings);
      }
    },
    [onValueChange, value]
  );

  const handleOpenChange = useCallback(
    (
      nextOpen: boolean,
      eventDetails?: { cancel: () => void; event: Event; reason: string }
    ) => {
      if (
        !nextOpen &&
        eventDetails &&
        isInteractionInsideMenuOrPreview(
          menuRef.current,
          previewPanelRef.current,
          eventDetails
        )
      ) {
        eventDetails.cancel();
        return;
      }

      setOpen(nextOpen);
      if (!nextOpen) {
        resetMenuState();
      }
    },
    [resetMenuState]
  );

  const handleSelect = useCallback(
    (modelId: string) => {
      const settings = getSettings(modelId);
      onValueChange?.(modelId, settings);
      closeMenu();
    },
    [closeMenu, getSettings, onValueChange]
  );

  const handleClearHighlight = useCallback(() => {
    setHighlightedId(null);
    preview.deactivate();
  }, [preview]);

  const handleHighlight = useCallback(
    (modelId: string, element: HTMLElement) => {
      setHighlightedId(modelId);
      preview.activate(modelId, element);
    },
    [preview]
  );

  const setPreviewPanelRef = useCallback(
    (node: HTMLDivElement | null) => {
      previewPanelRef.current = node;
      preview.refs.setFloating(node);
    },
    [preview.refs]
  );

  const previewModelId = preview.activeId;
  const previewSettings = previewModelId ? getSettings(previewModelId) : null;

  return {
    closeMenu,
    filteredModels,
    getSettings,
    handleClearHighlight,
    handleHighlight,
    handleOpenChange,
    handleSelect,
    highlightedId,
    menuRef,
    open,
    preview,
    previewModelId,
    previewSettings,
    searchInputRef,
    searchQuery,
    selectedModel,
    setPreviewPanelRef,
    setSearchQuery,
    updateSettings,
    value,
  };
}
