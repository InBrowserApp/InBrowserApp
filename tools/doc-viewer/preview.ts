import createDOMPurify from "dompurify"
import { structureLists } from "./semantics"
import type { Messages, DocDocument, Preview } from "./types"

const forbidden = [
  "script",
  "style",
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
]
const resourceStyle = /url\s*\(|@import\b|image(?:-set)?\s*\(|\\|\/\*/i
const raster = /^data:image\/(?:png|jpeg|gif|webp|avif|bmp);base64,/i
const policy =
  "default-src 'none'; script-src 'none'; style-src 'unsafe-inline'; img-src data:; base-uri 'none'; form-action 'none'"

export function preparePreview(source: DocDocument, m: Messages): Preview {
  let limited = source.limited
  const purifier = createDOMPurify(window)
  purifier.addHook("uponSanitizeElement", (_node, data) => {
    if (forbidden.includes(data.tagName)) limited = true
  })
  purifier.addHook("uponSanitizeAttribute", (_node, data) => {
    if (data.attrName === "style" && resourceStyle.test(data.attrValue)) {
      data.keepAttr = false
      limited = true
    }
    if (data.attrName === "src" && !raster.test(data.attrValue)) {
      data.keepAttr = false
      limited = true
    }
    if (
      ["srcset", "background", "poster", "xlink:href"].includes(data.attrName)
    ) {
      data.keepAttr = false
      limited = true
    }
  })
  purifier.addHook("afterSanitizeAttributes", (node) => {
    const href = node.getAttribute("href")
    node.removeAttribute("href")
    if (node.localName === "a" && href?.startsWith("#")) {
      node.setAttribute("data-doc-reference", `user-content-${href.slice(1)}`)
      node.setAttribute("role", "link")
      node.setAttribute("tabindex", "0")
    }
    if (node.localName === "img" && !node.getAttribute("src")) limited = true
  })
  const sanitize = (html: string) =>
    purifier.sanitize(html, {
      RETURN_DOM_FRAGMENT: true,
      USE_PROFILES: { html: true },
      FORBID_TAGS: forbidden,
      FORBID_ATTR: [
        "srcdoc",
        "ping",
        "autofocus",
        "contenteditable",
        "target",
        "download",
      ],
      ALLOW_DATA_ATTR: false,
      SANITIZE_NAMED_PROPS: true,
      ALLOWED_URI_REGEXP:
        /^(?:#|data:image\/(?:png|jpeg|gif|webp|avif|bmp);base64,)/i,
    })
  const doc = document.implementation.createHTMLDocument("")
  doc.title = m.documentBody
  const main = doc.createElement("main")
  main.append(sanitize(source.html))
  for (const attachment of main.querySelectorAll(
    ".msdoc-attachments,.msdoc-attachment"
  )) {
    attachment.remove()
    limited = true
  }
  for (const image of main.querySelectorAll(
    "img:not([src]),.msdoc-image-fallback"
  )) {
    const marker = doc.createElement("span")
    marker.textContent = "▧"
    marker.setAttribute("role", "img")
    marker.setAttribute("aria-label", m.limited)
    marker.setAttribute("title", m.limited)
    image.replaceWith(marker)
    limited = true
  }
  const empty =
    !main.textContent?.trim() && !main.querySelector("img[src],table")
  if (empty) {
    const p = doc.createElement("p")
    p.textContent = m.noContent
    main.append(p)
  }
  doc.body.append(main)
  for (const block of doc.querySelectorAll("p,h1,h2,h3,h4,h5,h6,td,th,li"))
    block.setAttribute("dir", "auto")
  for (const paragraph of main.querySelectorAll("p[class]")) {
    const level =
      /msdoc-style-(?:heading|标题|標題|inbrowser-heading)-?([1-9])(?:\s|$)/i.exec(
        paragraph.className
      )?.[1]
    if (!level) continue
    const heading = doc.createElement(`h${Math.min(6, Number(level))}`)
    for (const attribute of paragraph.attributes)
      heading.setAttribute(attribute.name, attribute.value)
    heading.setAttribute("aria-level", level)
    heading.append(...paragraph.childNodes)
    paragraph.replaceWith(heading)
  }
  structureLists(doc, main)
  for (const block of main.querySelectorAll<HTMLElement>("[style]")) {
    if (block.style.breakBefore !== "page") continue
    const rule = doc.createElement("hr")
    rule.className = "msdoc-page-break"
    block.before(rule)
  }
  for (const rule of main.querySelectorAll(".msdoc-page-break"))
    rule.setAttribute("aria-label", m.pageBreak)
  const prefix = `doc-heading-${crypto.randomUUID()}-`
  const outline = Array.from(
    main.querySelectorAll("h1,h2,h3,h4,h5,h6"),
    (heading, index) => {
      // Preserve an existing bookmark ID by placing a separate outline target.
      const target = doc.createElement("span")
      target.id = `${prefix}${index}`
      heading.prepend(target)
      return {
        id: target.id,
        label: heading.textContent?.trim() || m.documentBody,
        level: Number(
          heading.getAttribute("aria-level") || heading.tagName.slice(1)
        ),
      }
    }
  )
  const csp = doc.createElement("meta")
  csp.httpEquiv = "Content-Security-Policy"
  csp.content = policy
  doc.head.prepend(csp)
  const style = doc.createElement("style")
  style.textContent =
    source.css +
    `
    :root { color-scheme: light; }
    body { box-sizing: border-box; margin: 0 auto; padding: 32px;
      max-width: 84ch; color: #202124; background: white;
      font-family: Georgia, serif; font-size: 18px; line-height: 1.65;
      overflow-wrap: anywhere; }
    main { display: flow-root; }
    h1,h2,h3,h4,h5,h6 { line-height: 1.3; }
    img { max-width: 100% !important; height: auto !important; }
    table { max-width: 100%; border-collapse: collapse; }
    td,th { border: 1px solid #ccc; padding: .4em .6em; }
    pre { white-space: pre-wrap; }
    hr { border: 0; border-top: 1px dashed #aaa; margin-block: 2em; clear: both; }
    [data-doc-reference] { color: LinkText; text-decoration: underline; cursor: pointer; }
    :focus-visible { outline: 2px solid currentColor; outline-offset: 3px; }
    @media(max-width:480px) { body { padding: 20px 16px; } }
  `
  doc.head.append(style)
  return {
    html: "<!doctype html>" + doc.documentElement.outerHTML,
    limited,
    outline,
  }
}
