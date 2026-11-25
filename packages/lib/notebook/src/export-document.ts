import { readableImage } from "@workspace/web-document"
import { preparePreview } from "./prepare-preview"
import type { Messages, Notebook } from "./types"

export async function prepareNotebookDocument(
  notebook: Notebook,
  title: string,
  signal: AbortSignal,
  m: Messages & { imageUnavailable: string }
) {
  const preview = await preparePreview(notebook, m, signal)
  const doc = new DOMParser().parseFromString(preview.html, "text/html")
  doc.title = title
  let unavailableImage = false
  const decoded = new Map<string, boolean>()
  for (const image of doc.querySelectorAll("img")) {
    const src = image.getAttribute("src") || ""
    if (!src) {
      const placeholder = doc.createElement("p")
      placeholder.className = "nb-notice"
      placeholder.textContent = image.alt || m.missingAttachment
      image.replaceWith(placeholder)
      continue
    }
    let readable = decoded.get(src)
    if (readable === undefined) {
      readable = await readableImage(src, signal)
      decoded.set(src, readable)
    }
    if (!readable) {
      const placeholder = doc.createElement("p")
      placeholder.className = "nb-notice"
      placeholder.textContent = [image.alt, m.imageUnavailable]
        .filter(Boolean)
        .join(" · ")
      image.replaceWith(placeholder)
      unavailableImage = true
    }
  }
  signal.throwIfAborted()
  return { preview, doc, unavailableImage }
}

export function restoreNotebookLinks(doc: Document) {
  // These managed destinations were validated by the shared notebook sanitizer.
  for (const link of doc.querySelectorAll("[data-web-link]")) {
    const href = link.getAttribute("data-web-link")!
    link.removeAttribute("data-web-link")
    link.setAttribute("href", href)
    link.setAttribute("rel", "noopener noreferrer")
    if (!href.startsWith("#")) link.setAttribute("target", "_blank")
  }
}
