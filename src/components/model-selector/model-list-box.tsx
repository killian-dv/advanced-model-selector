import type { ReactNode, Ref } from "react";

interface ModelListBoxProps {
  children: ReactNode;
  id: string;
  ref?: Ref<HTMLDivElement>;
}

export function ModelListBox({ id, children, ref }: ModelListBoxProps) {
  return (
    <div
      className="scroll-fade no-scrollbar flex max-h-64 flex-col gap-px overflow-y-auto p-1"
      id={id}
      ref={ref}
      role="listbox"
    >
      {children}
    </div>
  );
}
