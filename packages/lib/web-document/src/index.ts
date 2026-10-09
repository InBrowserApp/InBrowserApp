import createDOMPurify from "dompurify"
import {
  cleanStyle,
  cleanStylesheet,
  noteResource,
  readerStyle,
} from "./styles"
import type { ResourceNotes } from "./styles"

const forbidden = [
  "script",
  "iframe",
  "object",
  "embed",
  "form",
  "input",
  "button",
  "select",
  "textarea",
  "audio",
  "video",
  "source",
  "track",
  "base",
  "meta",
  "link",
  "svg",
  "math",
  "template",
  "canvas",
]
const raster = /^data:image\/(?:png|jpeg|gif|webp|avif|bmp);base64,/i
const policy =
  "default-src 'none'; script-src 'none'; style-src 'unsafe-inline'; img-src data:; font-src data:; base-uri 'none'; form-action 'none'"

export type WebDocument = {
  html: string
  title: string
  outline: { id: string; label: string; level: number }[]
  notes: ResourceNotes
  empty: boolean
}

export function prepareWebDocument(
  source: string,
  options: { xhtml?: boolean; emptyText: string; headingText: string }
): WebDocument {
  const notes: ResourceNotes = { local: false, remote: false, active: false }
  // Parse in a template contents owner document: there is no browsing context
  // or custom-element registry, so even pre-sanitization resources stay inert.
  const inert = document.createElement("template").content.ownerDocument
  const root = inert.createElement("html")
  if (options.xhtml) {
    const parsed = new DOMParser().parseFromString(
      source,
      "application/xhtml+xml"
    )
    if (
      parsed.querySelector("parsererror") ||
      parsed.documentElement.localName !== "html" ||
      parsed.documentElement.namespaceURI !== "http://www.w3.org/1999/xhtml"
    )
      throw new Error("INVALID")
    for (const attribute of Array.from(parsed.documentElement.attributes))
      root.setAttribute(attribute.name, attribute.value)
    // HTML documents cannot import CDATA nodes. Convert their literal text
    // before import; the sanitizer then treats it like any other text node.
    const walker = parsed.createTreeWalker(
      parsed,
      NodeFilter.SHOW_CDATA_SECTION
    )
    const sections: Node[] = []
    while (walker.nextNode()) sections.push(walker.currentNode)
    for (const section of sections)
      section.parentNode!.replaceChild(
        parsed.createTextNode(section.textContent || ""),
        section
      )
    root.append(
      ...Array.from(parsed.documentElement.childNodes, (node) =>
        inert.importNode(node, true)
      )
    )
  } else {
    root.innerHTML = source
    // innerHTML's fragment parser omits the outer html attributes. Recover
    // only language/direction through the same inert parser, never raw output.
    const opening = source.match(/<html(?=[\s>])[^>]*>/i)?.[0]
    if (opening) {
      const holder = inert.createElement("div")
      holder.innerHTML = opening.replace(/^<html/i, "<div") + "</div>"
      for (const name of ["lang", "dir"]) {
        const value = holder.firstElementChild?.getAttribute(name)
        if (value) root.setAttribute(name, value)
      }
    }
  }
  const purifier = createDOMPurify(window)
  purifier.addHook("uponSanitizeElement", (node, data) => {
    if (forbidden.includes(data.tagName)) notes.active = true
    if (data.tagName === "style")
      node.textContent = cleanStylesheet(node.textContent || "", notes).replace(
        /<\/style/gi,
        "<\\/style"
      )
    if (data.tagName === "link") {
      const href = (node as Element).getAttribute("href")
      if (href) noteResource(href, notes)
    }
  })
  purifier.addHook("uponSanitizeAttribute", (_node, data) => {
    if (data.attrName.startsWith("on")) notes.active = true
    if (data.attrName === "style")
      data.attrValue = cleanStyle(data.attrValue, notes)
    if (data.attrName === "src" && !raster.test(data.attrValue)) {
      noteResource(data.attrValue, notes)
      data.keepAttr = false
    }
    if (
      ["srcset", "background", "poster", "xlink:href"].includes(data.attrName)
    ) {
      noteResource(data.attrValue, notes)
      data.keepAttr = false
    }
  })
  purifier.addHook("afterSanitizeAttributes", (node) => {
    const href = node.getAttribute("href")?.trim()
    node.removeAttribute("href")
    if (
      node.localName === "a" &&
      href &&
      /^(?:#|https?:\/\/|mailto:)/i.test(href)
    ) {
      node.setAttribute("data-web-link", href)
      node.setAttribute("role", "link")
      node.setAttribute("tabindex", "0")
    }
    if (node.localName === "a" && node.getAttribute("name") && !node.id)
      node.id = node.getAttribute("name")!
  })
  purifier.sanitize(root, {
    IN_PLACE: true,
    WHOLE_DOCUMENT: true,
    USE_PROFILES: { html: true },
    ADD_TAGS: ["title"],
    FORBID_TAGS: forbidden,
    FORBID_ATTR: [
      "srcdoc",
      "ping",
      "autofocus",
      "contenteditable",
      "target",
      "download",
      "is",
    ],
    ALLOW_DATA_ATTR: false,
  })
  const head =
    root.querySelector("head") ??
    root.insertBefore(inert.createElement("head"), root.firstChild)
  const body =
    root.querySelector("body") ?? root.appendChild(inert.createElement("body"))
  const title = head.querySelector("title")?.textContent?.trim() || ""
  const text = inert.createTreeWalker(body, NodeFilter.SHOW_TEXT)
  let readable = false
  while (text.nextNode()) {
    if (
      text.currentNode.textContent?.trim() &&
      !text.currentNode.parentElement?.closest("style,title")
    ) {
      readable = true
      break
    }
  }
  const empty = !readable && !body.querySelector("img[src],table")
  if (empty) {
    const p = inert.createElement("p")
    p.textContent = options.emptyText
    body.append(p)
  }
  for (const element of body.querySelectorAll("table,pre")) {
    const wrapper = inert.createElement("div")
    wrapper.setAttribute("data-web-wide", "")
    wrapper.tabIndex = 0
    element.replaceWith(wrapper)
    wrapper.append(element)
  }
  const prefix = `web-heading-${crypto.randomUUID()}-`
  const outline = Array.from(
    body.querySelectorAll("h1,h2,h3,h4,h5,h6"),
    (heading, index) => {
      const target = inert.createElement("span")
      target.id = `${prefix}${index}`
      heading.prepend(target)
      return {
        id: target.id,
        label: heading.textContent?.trim() || options.headingText,
        level: Number(heading.localName.slice(1)),
      }
    }
  )
  const csp = inert.createElement("meta")
  csp.httpEquiv = "Content-Security-Policy"
  csp.content = policy
  const style = inert.createElement("style")
  style.textContent = readerStyle
  head.prepend(style)
  // CSP must precede every element, including document-provided CSS.
  head.prepend(csp)
  return {
    html: "<!doctype html>" + root.outerHTML,
    title,
    outline,
    notes,
    empty,
  }
}
