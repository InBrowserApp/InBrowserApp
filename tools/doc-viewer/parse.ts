import { parseMsDoc, renderMsDoc } from "@file-viewer/doc"
import { markParagraphs } from "./semantics"
import { inspectDocument } from "./preflight"
import type { DocDocument } from "./types"

export function parseDocument(buffer: ArrayBuffer, name: string): DocDocument {
  const info = inspectDocument(buffer, name)
  const parsed = parseMsDoc(buffer, { maxPictureBytes: buffer.byteLength })
  const approximatedLists = markParagraphs(parsed)
  const rendered = renderMsDoc(parsed, {
    reviewMode: "final",
    externalLinkPolicy: "block",
    externalResourcePolicy: "block",
  })
  const limited =
    info.limited ||
    approximatedLists ||
    rendered.warnings.length > 0 ||
    parsed.assets.some(
      (asset) =>
        asset.type === "attachment" ||
        asset.displayable === false ||
        asset.meta?.sourceKind === "linked"
    )
  return { html: rendered.html, css: rendered.css, ...info, limited }
}
