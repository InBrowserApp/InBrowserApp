import createDOMPurify from "dompurify"

// The frame can read local book assets, but cannot execute or retrieve content.
const policy = [
  "default-src 'none'",
  "script-src 'none'",
  "style-src 'unsafe-inline' blob: data:",
  "img-src blob: data:",
  "font-src blob: data:",
  "base-uri 'none'",
  "form-action 'none'",
].join("; ")

const localResource = /^(?:blob:|data:|#)/i
const animationTags = [
  "animate",
  "set",
  "animatecolor",
  "animatemotion",
  "animatetransform",
  "discard",
]

function hasRemoteStyle(value: string) {
  return Array.from(
    value.matchAll(/(?:url\(\s*|@import\s+)["']?([^\s"')]+)/gi),
    (match) => match[1]!
  ).some((url) => !localResource.test(url))
}

export function readingDocument(html: string) {
  const purifier = createDOMPurify(window)
  let limited = false
  purifier.addHook("uponSanitizeElement", (node, data) => {
    if (
      [
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
        "use",
        ...animationTags,
      ].includes(data.tagName) ||
      (data.tagName === "meta" &&
        (node as Element).getAttribute("http-equiv")?.trim().toLowerCase() ===
          "refresh") ||
      (data.tagName === "style" && hasRemoteStyle(node.textContent ?? ""))
    )
      limited = true
  })
  purifier.addHook("uponSanitizeAttribute", (_node, data) => {
    if (
      data.attrName.startsWith("on") ||
      ["srcdoc", "ping", "autofocus", "contenteditable"].includes(
        data.attrName
      ) ||
      (data.attrName === "style" && hasRemoteStyle(data.attrValue)) ||
      (/^(?:href|xlink:href|src)$/.test(data.attrName) &&
        /^\s*(?:javascript|vbscript):/i.test(data.attrValue))
    )
      limited = true
  })
  purifier.addHook("afterSanitizeAttributes", (node) => {
    // Only surviving, sanitized links may become reader commands. Book-supplied
    // data attributes must not forge commands on otherwise inert elements.
    node.removeAttribute("data-epub-href")
    const navigable =
      node.localName === "a" ||
      node.localName === "area" ||
      node.namespaceURI === "http://www.w3.org/1998/Math/MathML"
    if (navigable) {
      const href = node.getAttribute("href") ?? node.getAttribute("xlink:href")
      node.removeAttribute("href")
      node.removeAttribute("xlink:href")
      if (href) {
        node.setAttribute("data-epub-href", href)
        node.setAttribute("role", "link")
        node.setAttribute("tabindex", "0")
      }
    }
    for (const name of ["src", "srcset", "poster", "href", "xlink:href"]) {
      const value = node.getAttribute(name)
      if (!value) continue
      if (name === "srcset" || !localResource.test(value)) {
        node.removeAttribute(name)
        limited = true
      }
    }
    node.removeAttribute("target")
    node.removeAttribute("download")
  })
  const root = purifier.sanitize(html, {
    WHOLE_DOCUMENT: true,
    RETURN_DOM: true,
    ADD_TAGS: ["link"],
    FORBID_TAGS: [
      "script",
      "base",
      "meta",
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
      ...animationTags,
    ],
    FORBID_ATTR: ["autofocus", "contenteditable", "ping", "srcdoc"],
    ALLOWED_URI_REGEXP:
      /^(?:(?:https?|mailto|tel|blob):|data:image\/|[^a-z]|[a-z+.-]+(?:[^a-z+.-:]|$))/i,
  }) as HTMLElement
  const doc = root.ownerDocument
  const head = root.querySelector("head")!
  const csp = doc.createElement("meta")
  csp.httpEquiv = "Content-Security-Policy"
  csp.content = policy
  head.prepend(csp)
  const style = doc.createElement("style")
  style.id = "reader-presentation"
  style.textContent = `
    :root { color-scheme: light; font-size: 18px; }
    body { box-sizing: border-box; margin: 0 auto !important;
      padding: 24px !important; max-width: 68ch; font-size: 1rem !important;
      line-height: 1.65; overflow-wrap: anywhere; }
    img, svg { max-width: 100%; height: auto; }
    a { overflow-wrap: anywhere; }
    [data-epub-href] { color: LinkText; text-decoration: underline;
      cursor: pointer; }
    :focus-visible { outline: 2px solid currentColor; outline-offset: 3px; }
    @media (max-width: 480px) { body { padding: 20px 16px !important; } }
  `
  head.append(style)
  return { html: "<!doctype html>" + root.outerHTML, limited }
}
