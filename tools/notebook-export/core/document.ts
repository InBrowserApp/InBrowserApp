import { prepareNotebookDocument, type Notebook } from "@workspace/notebook"
import type { Messages } from "../types"

export async function notebookDocument(
  notebook: Notebook,
  title: string,
  signal: AbortSignal,
  m: Messages
) {
  const { preview, doc, unavailableImage } = await prepareNotebookDocument(
    notebook,
    title,
    signal,
    m
  )
  const notes = [m.safePreview, m.layoutNotice]
  if (preview.notes.local) notes.push(m.localResources)
  if (preview.notes.remote) notes.push(m.remoteResources)
  if (preview.limited) notes.push(m.limited)
  if (unavailableImage) notes.push(m.imageUnavailable)
  // The interface already presents these notes outside the reading frame.
  const html = "<!doctype html>" + doc.documentElement.outerHTML
  const aside = doc.createElement("aside")
  aside.className = "nb-cell nb-notice"
  for (const text of notes) {
    const paragraph = doc.createElement("p")
    paragraph.textContent = text
    aside.append(paragraph)
  }
  doc.body.prepend(aside)
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
