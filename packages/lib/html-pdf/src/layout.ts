export const pageStyle = `
  @page { size: A4; margin: 18mm; }
  :root { color-scheme: light; }
  body { margin: 0; color: #111; font-family: serif; font-size: 11pt; }
  main { overflow-wrap: anywhere; }
  .msdoc-root { padding: 0; }
  img { max-width: 100% !important; height: auto !important; }
  table { width: 100%; max-width: 100%; border-collapse: collapse; }
  td, th { overflow-wrap: anywhere; break-inside: avoid; }
  tr { break-inside: avoid; }
  p { orphans: 2; widows: 2; }
  .msdoc-page-break { display: block; break-after: page; height: 0; margin: 0; border: 0; }
`

/** Reject content extending beyond the rasterized page, rather than clipping. */
export function checkPage(page: HTMLElement) {
  const bounds = page.getBoundingClientRect()
  const inside = (rect: DOMRect) => {
    if (
      rect.width &&
      rect.height &&
      (rect.left < bounds.left - 1 ||
        rect.top < bounds.top - 1 ||
        rect.right > bounds.right + 1 ||
        rect.bottom > bounds.bottom + 1)
    )
      throw new Error("unsupported")
  }
  const walker = document.createTreeWalker(page, NodeFilter.SHOW_TEXT)
  const range = document.createRange()
  while (walker.nextNode()) {
    if (!walker.currentNode.textContent?.trim()) continue
    range.selectNodeContents(walker.currentNode)
    for (const rect of range.getClientRects()) inside(rect)
  }
  for (const image of page.querySelectorAll("img"))
    inside(image.getBoundingClientRect())
}
