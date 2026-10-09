import { prepareWebDocument } from "@workspace/web-document"
import type { Bundle, Messages } from "./types"
import { imageData } from "./core/images"
import { text } from "./core/text"
import { staticSvg } from "./static-svg"

export function fragment(
  html: string,
  attachments: Record<string, Bundle>,
  m: Messages,
  svg?: string
) {
  const inert = document.createElement("template").content.ownerDocument
  const root = inert.createElement("div")
  root.innerHTML = html
  const images = new Map<string, string>()
  let missing = false
  const svgNotes = { local: false, remote: false, active: false }
  const replaceSvg = (element: Element, source: string) => {
    const { url, notes } = staticSvg(source)
    for (const key of ["local", "remote", "active"] as const)
      svgNotes[key] ||= notes[key]
    const image = inert.createElement("img")
    image.alt = m.attachment
    if (url) {
      image.id = `notebook-svg-${crypto.randomUUID()}`
      images.set(image.id, url)
    } else {
      image.alt = m.missingAttachment
      missing = true
    }
    element.replaceWith(image)
  }
  if (svg !== undefined) {
    const placeholder = root.appendChild(inert.createElement("span"))
    replaceSvg(placeholder, svg)
  }
  for (const element of root.querySelectorAll("svg"))
    replaceSvg(element, element.outerHTML)
  for (const image of root.querySelectorAll("img[src]")) {
    const src = image.getAttribute("src")!
    if (!src.startsWith("attachment:")) continue
    let name = src.slice(11)
    try {
      name = decodeURIComponent(name)
    } catch {
      /* Literal attachment name. */
    }
    const bundle = Object.hasOwn(attachments, name) ? attachments[name]! : {}
    const raster = imageData(bundle)
    if (raster) image.setAttribute("src", raster)
    else if (Object.hasOwn(bundle, "image/svg+xml"))
      replaceSvg(image, text(bundle["image/svg+xml"]))
    else {
      image.removeAttribute("src")
      image.setAttribute("alt", m.missingAttachment)
      missing = true
    }
  }
  const clean = prepareWebDocument(root.innerHTML, {
    emptyText: "",
    headingText: m.markdown,
  })
  const doc = new DOMParser().parseFromString(clean.html, "text/html")
  // Output styles must not restyle other cells or the reader controls.
  for (const style of doc.body.querySelectorAll("style")) style.remove()
  for (const element of doc.body.querySelectorAll<HTMLElement>("[style]")) {
    for (const property of [
      "position",
      "inset",
      "top",
      "right",
      "bottom",
      "left",
      "z-index",
    ])
      element.style.removeProperty(property)
  }
  for (const [id, url] of images)
    doc.getElementById(id)!.setAttribute("src", url)
  for (const key of ["local", "remote", "active"] as const)
    clean.notes[key] ||= svgNotes[key]
  clean.notes.local ||= missing
  return { body: doc.body, notes: clean.notes }
}
