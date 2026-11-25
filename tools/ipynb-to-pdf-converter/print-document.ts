import { openNotebook, preparePreview } from "@workspace/notebook"
import type { Messages } from "./types"

const layout = `
  pre, code { white-space: pre-wrap !important; overflow-wrap: anywhere; }
  .nb-section-label { font: 12px/1.5 system-ui, sans-serif; color: #555; margin-block: 8px; }
  @media print {
    html, body { margin: 0 !important; width: auto !important; }
    body { padding: 0 !important; max-width: none; font-size: 10pt; line-height: 1.45; }
    .nb-cell { margin-block-end: 12pt; padding-block-end: 12pt; }
    .nb-section-label, .nb-label, .nb-output-label, h1, h2, h3, h4, h5, h6 {
      break-after: avoid;
    }
    [data-web-wide] { overflow: visible !important; }
    pre { font-size: 8.5pt; orphans: 2; widows: 2; }
    table { width: 100%; table-layout: fixed; }
    th, td { overflow-wrap: anywhere; white-space: normal; }
    tr { break-inside: avoid; }
    img { max-height: 8.5in; object-fit: contain; break-inside: avoid; }
    h1, h2, h3, p { orphans: 2; widows: 2; }
  }
`

export async function prepareNotebookPrint(
  file: File,
  lang: string,
  m: Messages,
  signal: AbortSignal
) {
  const notebook = await openNotebook(file, signal)
  const preview = await preparePreview(notebook, m, signal)
  const doc = new DOMParser().parseFromString(preview.html, "text/html")
  doc.documentElement.lang = lang
  doc.title = file.name.replace(/\.ipynb$/i, "")
  for (const section of doc.querySelectorAll("details.nb-section")) {
    const container = doc.createElement("div")
    const label = doc.createElement("p")
    label.className = "nb-section-label"
    const summary = section.querySelector("summary")
    label.textContent = summary?.textContent ?? ""
    summary?.remove()
    container.append(label, ...section.childNodes)
    section.replaceWith(container)
  }
  const style = doc.createElement("style")
  style.textContent = layout
  doc.head.append(style)
  return "<!doctype html>" + doc.documentElement.outerHTML
}
