import { prepareWebDocument } from "./index"
import { printStyles, reflowStyles } from "./print-styles"

export function preparePrintDocument(source: string, xhtml = false) {
  // Reject binary input after decoding UTF-16 byte sequences.
  // oxlint-disable-next-line no-control-regex
  if (/[\u0000-\u0008\u000e-\u001f]/.test(source)) throw new Error("invalid")
  const document = prepareWebDocument(source, {
    xhtml,
    emptyText: "",
    headingText: "",
    print: true,
  })
  if (document.empty) throw new Error("invalid")
  if (document.notes.local || document.notes.remote)
    throw new Error("unsupported")
  const inert =
    globalThis.document.createElement("template").content.ownerDocument
  // This second parse sees only the already-sanitized, resource-contained HTML.
  const html = new DOMParser().parseFromString(
    document.html,
    "text/html"
  ).documentElement
  const css = Array.from(html.querySelectorAll("style"), (style) => {
    const value = style.textContent || ""
    style.remove()
    return value
  }).join("\n")
  const body = html.querySelector("body")!
  const content = inert.createElement("div")
  content.className = "pdf-html"
  for (const name of ["lang", "dir"]) {
    const value = html.getAttribute(name)
    if (value) content.setAttribute(name, value)
  }
  const main = inert.createElement("div")
  for (const attribute of Array.from(body.attributes))
    main.setAttribute(attribute.name, attribute.value)
  main.classList.add("pdf-body")
  main.append(...Array.from(body.childNodes))
  content.append(main)
  return { html: content.outerHTML, css: printStyles(css) + reflowStyles }
}
