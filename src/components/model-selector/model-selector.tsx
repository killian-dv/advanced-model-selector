import { FloatingPortal } from "@floating-ui/react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { ModelSettings } from "@/lib/models";
import { useModelSelector } from "./hooks/use-model-selector";
import { ModelList } from "./model-list";
import { ModelPreviewPanel } from "./model-preview-panel";
import {
  ModelSelectorTriggerLabel,
  modelSelectorTriggerClassName,
} from "./model-selector-trigger";

interface ModelSelectorProps {
  onValueChange?: (modelId: string, settings: ModelSettings) => void;
  value?: string;
}

export function ModelSelector(props: ModelSelectorProps) {
  const {
    open,
    handleOpenChange,
    selectedModel,
    searchInputRef,
    menuRef,
    filteredModels,
    getSettings,
    highlightedId,
    preview,
    handleHighlight,
    handleClearHighlight,
    closeMenu,
    handleSelect,
    setSearchQuery,
    searchQuery,
    value,
    previewModelId,
    previewSettings,
    setPreviewPanelRef,
    updateSettings,
  } = useModelSelector(props);

  return (
    <>
      <Popover onOpenChange={handleOpenChange} open={open}>
        <PopoverTrigger
          render={
            <Button
              aria-expanded={open}
              aria-haspopup="listbox"
              className={modelSelectorTriggerClassName}
              variant="outline"
            />
          }
        >
          <ModelSelectorTriggerLabel model={selectedModel} />
        </PopoverTrigger>

        <PopoverContent
          align="start"
          className="w-72 p-0 shadow-lg"
          initialFocus={searchInputRef}
          onMouseDown={(event) => {
            event.stopPropagation();
          }}
          side="top"
          sideOffset={8}
        >
          <div ref={menuRef}>
            <ModelList
              activeReferenceProps={preview.referenceProps}
              getSettings={getSettings}
              highlightedId={highlightedId}
              models={filteredModels}
              onClearHighlight={handleClearHighlight}
              onClose={closeMenu}
              onHighlight={handleHighlight}
              onQueryChange={setSearchQuery}
              onSelect={handleSelect}
              query={searchQuery}
              searchInputRef={searchInputRef}
              selectedId={value}
            />
          </div>
        </PopoverContent>
      </Popover>

      {open && previewModelId && previewSettings ? (
        <FloatingPortal>
          <ModelPreviewPanel
            floatingProps={preview.floatingProps}
            modelId={previewModelId}
            onSettingsChange={(settings) => {
              updateSettings(previewModelId, settings);
            }}
            panelRef={setPreviewPanelRef}
            settings={previewSettings}
            style={preview.floatingStyles}
          />
        </FloatingPortal>
      ) : null}
    </>
  );
}
