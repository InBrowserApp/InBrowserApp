import {
  prepareNotebookDocument,
  restoreNotebookLinks,
  type Notebook,
} from "@workspace/notebook"
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
  restoreNotebookLinks(doc)
  return {
    preview: { ...preview, html, title },
    document: doc,
    file: new Blob(["<!doctype html>" + doc.documentElement.outerHTML], {
      type: "text/html;charset=utf-8",
    }),
    notes,
  }
}
