import { preparePreview } from "@workspace/notebook"
import type { Notebook } from "@workspace/notebook"
import type { Messages } from "../types"
import { readableImage } from "./images"

export async function notebookDocument(
  notebook: Notebook,
  title: string,
  signal: AbortSignal,
  m: Messages
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
  const notes = [m.safePreview, m.layoutNotice]
  if (preview.notes.local) notes.push(m.localResources)
  if (preview.notes.remote) notes.push(m.remoteResources)
  if (preview.limited) notes.push(m.limited)
  if (unavailableImage) notes.push(m.imageUnavailable)
  const aside = doc.createElement("aside")
  aside.className = "nb-cell nb-notice"
  for (const text of notes) {
    const paragraph = doc.createElement("p")
    paragraph.textContent = text
    aside.append(paragraph)
  }
  doc.body.prepend(aside)
  const html = "<!doctype html>" + doc.documentElement.outerHTML
  // These managed destinations were validated by the shared notebook sanitizer.
  for (const link of doc.querySelectorAll("[data-web-link]")) {
    const href = link.getAttribute("data-web-link")!
    link.removeAttribute("data-web-link")
    link.setAttribute("href", href)
    link.setAttribute("rel", "noopener noreferrer")
    if (!href.startsWith("#")) link.setAttribute("target", "_blank")
  }
  return {
    preview: { ...preview, html, title },
    document: doc,
    file: new Blob(["<!doctype html>" + doc.documentElement.outerHTML], {
      type: "text/html;charset=utf-8",
    }),
    notes,
  }
}
