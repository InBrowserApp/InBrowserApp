import { parseMsDoc, renderMsDoc } from "@file-viewer/doc"
import type { ParagraphBlock } from "@file-viewer/doc"
import { inspectDocument } from "@workspace/legacy-doc"

export function parseDocument(buffer: ArrayBuffer, name: string) {
  inspectDocument(buffer, name, true)
  const parsed = parseMsDoc(buffer, { maxPictureBytes: buffer.byteLength })
  if (
    parsed.warnings.length ||
    parsed.assets.some(
      (asset) =>
        asset.type !== "image" ||
        asset.displayable === false ||
        asset.meta?.sourceKind !== "embedded" ||
        !/^image\/(png|jpeg|gif|webp|avif|bmp)$/.test(asset.mime)
    )
  )
    throw new Error("unsupported")
  const paragraph = (block: ParagraphBlock) => {
    const state = block.paraState
    if (
      (state.listId != null && state.listId > 0) ||
      state.frameWidth ||
      state.frameHeight ||
      state.frameLeft ||
      state.frameTop ||
      block.inlines.some((inline) => inline.type === "attachment")
    )
      throw new Error("unsupported")
  }
  for (const block of parsed.blocks) {
    if (block.type === "attachments") throw new Error("unsupported")
    if (block.type === "paragraph") paragraph(block)
    if (block.type === "table") {
      if (block.depth > 1) throw new Error("unsupported")
      for (const row of block.rows)
        for (const cell of row.cells) cell.paragraphs.forEach(paragraph)
    }
  }
  const { html, css } = renderMsDoc(parsed, {
    reviewMode: "final",
    externalLinkPolicy: "block",
    externalResourcePolicy: "block",
  })
  return { html, css }
}
