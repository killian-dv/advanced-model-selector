import type { HTMLAttributes, RefObject } from "react";
import { useId, useRef } from "react";
import type { Model } from "@/lib/models";
import { useHidePreviewOffscreen } from "./hooks/use-hide-preview-offscreen";
import { useModelListNavigation } from "./hooks/use-model-list-navigation";
import { ModelListBox } from "./model-list-box";
import { ModelListEmpty } from "./model-list-empty";
import { ModelListItem } from "./model-list-item";
import { ModelListSearch } from "./model-list-search";

export interface ModelListProps {
  activeReferenceProps?: HTMLAttributes<HTMLButtonElement>;
  highlightedId: string | null;
  models: Model[];
  onClearHighlight: () => void;
  onClose: () => void;
  onHighlight: (modelId: string, element: HTMLElement) => void;
  onQueryChange: (query: string) => void;
  onSelect: (modelId: string) => void;
  query: string;
  searchInputRef: RefObject<HTMLInputElement | null>;
  selectedId: string;
}

export function ModelList({
  models,
  query,
  selectedId,
  highlightedId,
  onSelect,
  onQueryChange,
  onHighlight,
  onClearHighlight,
  onClose,
  searchInputRef,
  activeReferenceProps,
}: ModelListProps) {
  const listboxId = useId();
  const listScrollRef = useRef<HTMLDivElement>(null);
  const { handleSearchKeyDown, setItemRef, getItemElement } =
    useModelListNavigation({
      highlightedId,
      models,
      onClose,
      onHighlight,
      onSelect,
      searchInputRef,
    });

  useHidePreviewOffscreen({
    activeId: highlightedId,
    getItemElement,
    onHidden: onClearHighlight,
    scrollContainerRef: listScrollRef,
  });

  const activeDescendantId =
    highlightedId == null ? undefined : `${listboxId}-option-${highlightedId}`;

  return (
    <div className="flex flex-col" data-model-selector-menu>
      <ModelListSearch
        activeDescendantId={activeDescendantId}
        listboxId={listboxId}
        onKeyDown={handleSearchKeyDown}
        onQueryChange={onQueryChange}
        query={query}
        searchInputRef={searchInputRef}
      />

      <ModelListBox id={listboxId} ref={listScrollRef}>
        {models.length === 0 ? (
          <ModelListEmpty />
        ) : (
          models.map((model) => (
            <ModelListItem
              activeReferenceProps={activeReferenceProps}
              id={`${listboxId}-option-${model.id}`}
              isHighlighted={highlightedId === model.id}
              isSelected={selectedId === model.id}
              itemRef={(node) => {
                setItemRef(model.id, node);
              }}
              key={model.id}
              model={model}
              onMouseEnter={(element) => {
                onHighlight(model.id, element);
              }}
              onSelect={() => {
                onSelect(model.id);
              }}
            />
          ))
        )}
      </ModelListBox>
    </div>
  );
}
