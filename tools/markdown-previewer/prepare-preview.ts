import createDOMPurify from "dompurify"

const raster = /^data:image\/(?:png|jpeg|gif|webp|avif|bmp);base64,/i

/** Markdown has no publisher CSS: keep semantic HTML, never active content. */
export function preparePreview(html: string) {
  const purifier = createDOMPurify(window)
  let localImages = false
  let remoteImages = false
  purifier.addHook("uponSanitizeAttribute", (_node, data) => {
    if (data.attrName === "id" || data.attrName === "name")
      data.attrValue = `markdown-${data.attrValue}`
    if (data.attrName !== "src" || raster.test(data.attrValue)) return
    if (/^(?:https?:)?\/\//i.test(data.attrValue)) remoteImages = true
    else localImages = true
    data.keepAttr = false
  })
  purifier.addHook("afterSanitizeAttributes", (node) => {
    if (node.localName === "input") {
      if (node.getAttribute("type") !== "checkbox") node.remove()
      else node.setAttribute("disabled", "")
    }
    if (node.localName !== "a") return
    let href = node.getAttribute("href")?.trim()
    if (href?.startsWith("#") && href.length > 1) {
      let fragment = href.slice(1)
      try {
        fragment = decodeURIComponent(fragment)
      } catch {
        /* Literal fragment. */
      }
      href = `#${encodeURIComponent(`markdown-${fragment}`)}`
    }
    node.removeAttribute("href")
    if (href && /^(?:#|https?:\/\/|mailto:)/i.test(href)) {
      node.setAttribute("href", href)
      node.setAttribute("rel", "noopener noreferrer")
      if (!href.startsWith("#")) node.setAttribute("target", "_blank")
    }
    if (!node.id && node.getAttribute("name"))
      node.id = node.getAttribute("name")!
  })
  const inert = document.createElement("template").content.ownerDocument
  const body = inert.createElement("div")
  body.innerHTML = html
  purifier.sanitize(body, {
    IN_PLACE: true,
    ALLOWED_TAGS: [
      "a",
      "abbr",
      "b",
      "blockquote",
      "br",
      "caption",
      "code",
      "dd",
      "del",
      "details",
      "div",
      "dl",
      "dt",
      "em",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "hr",
      "i",
      "img",
      "input",
      "kbd",
      "li",
      "mark",
      "ol",
      "p",
      "pre",
      "s",
      "samp",
      "small",
      "span",
      "strong",
      "sub",
      "summary",
      "sup",
      "table",
      "tbody",
      "td",
      "th",
      "thead",
      "tr",
      "ul",
    ],
    ALLOWED_ATTR: [
      "align",
      "alt",
      "checked",
      "colspan",
      "dir",
      "disabled",
      "href",
      "id",
      "lang",
      "name",
      "open",
      "rowspan",
      "src",
      "start",
      "title",
      "type",
    ],
    ALLOW_DATA_ATTR: false,
    ALLOW_ARIA_ATTR: false,
  })
  for (const element of body.querySelectorAll("table,pre")) {
    const wrapper = body.ownerDocument.createElement("div")
    wrapper.setAttribute("data-markdown-wide", "")
    wrapper.tabIndex = 0
    element.replaceWith(wrapper)
    wrapper.append(element)
  }
  // Keep export links directly from sanitization, then make preview links inert.
  // Never turn DOM metadata back into an active URL during export.
  const exportHtml = body.innerHTML
  for (const link of body.querySelectorAll("a[href]")) {
    link.setAttribute("data-markdown-link", link.getAttribute("href")!)
    link.removeAttribute("href")
    link.removeAttribute("rel")
    link.removeAttribute("target")
    link.setAttribute("role", "link")
    link.setAttribute("tabindex", "0")
  }
  return { html: body.innerHTML, exportHtml, localImages, remoteImages }
}
