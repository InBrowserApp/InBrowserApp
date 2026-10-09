import { readingPosition } from "./reading-position"

export type ReadingLocation = {
  path: number[]
  offset?: number
  top: number
  left: number
  scrollX: number
  scrollY: number
}

/** A DOM path survives a chapter reload; a live Range does not. */
export function captureReadingLocation(doc: Document): ReadingLocation {
  const position = readingPosition(doc)
  const target = position?.target
  let node: Node =
    target && "startContainer" in target
      ? target.startContainer
      : (target ?? doc.body)
  const path: number[] = []
  while (node !== doc.body && node.parentNode) {
    const parent = node.parentNode
    path.unshift(Array.prototype.indexOf.call(parent.childNodes, node))
    node = parent
  }
  return {
    path,
    offset: target && "startOffset" in target ? target.startOffset : undefined,
    top: position?.top ?? 0,
    left: position?.left ?? 0,
    scrollX: doc.defaultView!.scrollX,
    scrollY: doc.defaultView!.scrollY,
  }
}

export function restoreReadingLocation(
  doc: Document,
  location: ReadingLocation
) {
  let node: Node | undefined = doc.body
  for (const index of location.path) node = node?.childNodes[index]
  let target: Element | Range | undefined
  if (node?.nodeType === Node.TEXT_NODE && location.offset !== undefined) {
    const range = doc.createRange()
    const offset = Math.min(location.offset, node.textContent!.length)
    range.setStart(node, offset)
    range.setEnd(node, Math.min(offset + 1, node.textContent!.length))
    target = range
  } else if (node?.nodeType === Node.ELEMENT_NODE) target = node as Element
  if (target) {
    const bounds = target.getBoundingClientRect()
    doc.defaultView!.scrollBy(
      bounds.left - location.left,
      bounds.top - location.top
    )
  } else doc.defaultView!.scrollTo(location.scrollX, location.scrollY)
}
