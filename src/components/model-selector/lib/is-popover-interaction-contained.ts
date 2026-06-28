interface PopoverInteractionDetails {
  event: Event;
  reason: string;
}

function containsNode(
  container: HTMLElement | null,
  node: EventTarget | null
): node is Node {
  return node instanceof Node && container?.contains(node) === true;
}

function isFocusMovingWithin(
  container: HTMLElement | null,
  event: FocusEvent
): boolean {
  return containsNode(container, event.relatedTarget);
}

export function isInteractionInsideElement(
  element: HTMLElement | null,
  eventDetails: PopoverInteractionDetails
): boolean {
  if (!element) {
    return false;
  }

  const { event, reason } = eventDetails;

  if (containsNode(element, event.target)) {
    return true;
  }

  if (reason === "focus-out" && event instanceof FocusEvent) {
    return isFocusMovingWithin(element, event);
  }

  return false;
}

export function isInteractionInsideMenuOrPreview(
  menu: HTMLElement | null,
  preview: HTMLDivElement | null,
  eventDetails: PopoverInteractionDetails
): boolean {
  return (
    isInteractionInsideElement(preview, eventDetails) ||
    isInteractionInsideElement(menu, eventDetails)
  );
}
