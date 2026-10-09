import type { PresentationDocument, SlideNode } from "@extend-ai/react-pptx"

export function preparePresentation(document: PresentationDocument) {
  // The legacy parser emits raster/metafile bytes, never browser markup.
  // Refuse URL assets and active/vector formats even if future parser versions
  // introduce them. A partial preview is always disclosed in the reader.
  for (const [id, asset] of Object.entries(document.assets)) {
    delete asset.url
    if (
      !asset.data ||
      !/^image\/(?:png|jpeg|gif|bmp|tiff|x-emf|x-wmf)$/i.test(asset.contentType)
    )
      delete document.assets[id]
  }
  document.embeddedFonts = []
  return document.slides.map((slide) => nodeText(slide.nodes))
}

function nodeText(nodes: SlideNode[]): string {
  return nodes
    .map((node) => {
      if (node.type === "group") return nodeText(node.children)
      const paragraphs =
        node.type === "shape"
          ? node.paragraphs
          : node.type === "table"
            ? node.rows.flatMap((row) => row.flatMap((cell) => cell.paragraphs))
            : []
      return (paragraphs ?? [])
        .map((paragraph) => paragraph.runs.map((run) => run.text).join(""))
        .join("\n")
    })
    .join("\n")
}

export function presentationError(
  reason: unknown
): "invalid" | "unsupported" | "protected" | "resourceLimit" | "empty" {
  if (reason instanceof Error) {
    if (reason.message === "EMPTY") return "empty"
    if (
      reason.message === "TOO_LARGE" ||
      reason instanceof RangeError ||
      /out of memory|allocation|memory access|unreachable/i.test(reason.message)
    )
      return "resourceLimit"
    if ("code" in reason) {
      if (reason.code === "encrypted-document") return "protected"
      if (reason.code === "resource-limit") return "resourceLimit"
      if (reason.code === "unsupported-format") return "unsupported"
    }
  }
  return "invalid"
}
