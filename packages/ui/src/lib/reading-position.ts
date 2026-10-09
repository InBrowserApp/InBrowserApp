/** Keep a character on the visible line stable when a document reflows. */
export function readingPosition(doc: Document) {
  const view = doc.defaultView!
  const body = doc.body.getBoundingClientRect()
  const x = Math.max(
    1,
    Math.min(view.innerWidth - 1, body.left + body.width / 2)
  )
  const y = Math.min(16, view.innerHeight / 2)
  const caret = doc.caretPositionFromPoint?.(x, y)
  let range: Range | null = null
  if (caret) {
    range = doc.createRange()
    range.setStart(caret.offsetNode, caret.offset)
    range.collapse(true)
  } else range = doc.caretRangeFromPoint?.(x, y) ?? null
  if (range?.startContainer.nodeType === Node.TEXT_NODE) {
    const node = range.startContainer
    const offset = Math.min(
      range.startOffset,
      Math.max(0, node.textContent!.length - 1)
    )
    range.setStart(node, offset)
    range.setEnd(node, Math.min(offset + 1, node.textContent!.length))
    const bounds = range.getBoundingClientRect()
    if (bounds.bottom > 0 && bounds.top < view.innerHeight)
      return { target: range, left: bounds.left, top: bounds.top }
  }
  const target = Array.from(
    doc.body.querySelectorAll("p,pre,h1,h2,h3,h4,li,table,img")
  ).find((element) => element.getBoundingClientRect().bottom > 0)
  if (!target) return null
  const bounds = target.getBoundingClientRect()
  return { target, left: bounds.left, top: bounds.top }
}
