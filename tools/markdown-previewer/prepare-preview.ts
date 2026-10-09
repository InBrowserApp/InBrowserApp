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
      node.setAttribute("data-markdown-link", href)
      node.setAttribute("role", "link")
      node.setAttribute("tabindex", "0")
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
  return { html: body.innerHTML, localImages, remoteImages }
}

export function exportBody(html: string) {
  const template = document.createElement("template")
  template.innerHTML = html
  for (const link of template.content.querySelectorAll(
    "[data-markdown-link]"
  )) {
    const href = link
      .getAttribute("data-markdown-link")!
      .trim()
      .replace(/^(?:https?|mailto):/i, (scheme) => scheme.toLowerCase())
    link.removeAttribute("data-markdown-link")
    link.removeAttribute("href")
    // Revalidate when turning inert preview metadata into an active link.
    if (
      !href.startsWith("#") &&
      !href.startsWith("https://") &&
      !href.startsWith("http://") &&
      !href.startsWith("mailto:")
    )
      continue
    link.setAttribute("href", href)
    link.setAttribute("rel", "noopener noreferrer")
    if (!href.startsWith("#")) link.setAttribute("target", "_blank")
  }
  return template.innerHTML
}
