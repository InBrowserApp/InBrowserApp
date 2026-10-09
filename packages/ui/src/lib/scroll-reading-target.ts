/** Scroll a reading target without moving the iframe's ancestor viewports. */
export function scrollReadingTarget(
  doc: Document,
  target: Pick<Element, "getBoundingClientRect"> | null | undefined
) {
  if (target) doc.defaultView?.scrollBy(0, target.getBoundingClientRect().top)
}
