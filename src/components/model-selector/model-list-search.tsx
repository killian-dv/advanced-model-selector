import { SearchIcon } from "lucide-react";
import type { KeyboardEvent, RefObject } from "react";
import { Input } from "@/components/ui/input";

interface ModelListSearchProps {
  activeDescendantId?: string;
  listboxId: string;
  onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
  onQueryChange: (query: string) => void;
  query: string;
  searchInputRef: RefObject<HTMLInputElement | null>;
}

export function ModelListSearch({
  query,
  listboxId,
  activeDescendantId,
  onQueryChange,
  onKeyDown,
  searchInputRef,
}: ModelListSearchProps) {
  return (
    <div className="relative p-1 pb-0">
      <Input
        aria-activedescendant={activeDescendantId}
        aria-autocomplete="list"
        aria-controls={listboxId}
        aria-expanded={true}
        autoComplete="off"
        className="h-8 border-input/30 bg-input/30 pr-8 shadow-none"
        onChange={(event) => {
          onQueryChange(event.target.value);
        }}
        onKeyDown={onKeyDown}
        onMouseDown={(event) => {
          event.stopPropagation();
        }}
        placeholder="Search models..."
        ref={searchInputRef}
        role="combobox"
        value={query}
      />
      <SearchIcon className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 opacity-50" />
    </div>
  );
}
