import createDOMPurify from "dompurify"
import type { Messages, OdtDocument, PagePart, Preview } from "./types"

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

export function preparePreview(source: OdtDocument, m: Messages): Preview {
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
      node.setAttribute("data-odt-reference", `user-content-${href.slice(1)}`)
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
  doc.title = source.title
  const main = doc.createElement("main")
  main.append(sanitize(source.html))
  const empty =
    !main.textContent?.trim() && !main.querySelector("img[src],table")
  if (empty) {
    const p = doc.createElement("p")
    p.textContent = m.noContent
    main.append(p)
  }
  const parts = Object.entries(source.parts) as [PagePart, string][]
  if (parts.length) {
    const details = doc.createElement("details")
    const summary = doc.createElement("summary")
    summary.textContent = m.pageParts
    const help = doc.createElement("p")
    help.textContent = m.pagePartsHelp
    details.append(summary, help)
    for (const [key, html] of parts) {
      const section = doc.createElement("section")
      const label = doc.createElement("h2")
      label.textContent = m[key]
      section.append(label, sanitize(html))
      details.append(section)
    }
    doc.body.append(details)
  }
  doc.body.append(main)
  const breakIds = new Set(source.breaks.map((id) => `user-content-${id}`))
  for (const anchor of doc.querySelectorAll("a[id]")) {
    if (!breakIds.has(anchor.id)) continue
    const rule = doc.createElement("hr")
    rule.setAttribute("aria-label", m.pageBreak)
    const block = anchor.closest("p,h1,h2,h3,h4,h5,h6")
    if (block) {
      block.insertAdjacentElement(
        anchor.id.endsWith("-after") ? "afterend" : "beforebegin",
        rule
      )
      anchor.remove()
    } else anchor.replaceWith(rule)
  }
  for (const block of doc.querySelectorAll("p,h1,h2,h3,h4,h5,h6,td,th,li"))
    block.setAttribute("dir", "auto")
  const prefix = `odt-heading-${crypto.randomUUID()}-`
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
        level: Number(heading.tagName.slice(1)),
      }
    }
  )
  const csp = doc.createElement("meta")
  csp.httpEquiv = "Content-Security-Policy"
  csp.content = policy
  doc.head.prepend(csp)
  const style = doc.createElement("style")
  style.textContent = `
    :root { color-scheme: light; }
    body { box-sizing: border-box; margin: 0 auto; padding: 32px;
      max-width: 84ch; color: #202124; background: white;
      font-family: Georgia, serif; font-size: 18px; line-height: 1.65;
      overflow-wrap: anywhere; }
    main { display: flow-root; }
    h1,h2,h3,h4,h5,h6 { line-height: 1.3; }
    img { max-width: 100%; height: auto !important; }
    table { max-width: 100%; border-collapse: collapse; }
    td,th { border: 1px solid #ccc; padding: .4em .6em; }
    pre { white-space: pre-wrap; }
    aside[role=note] { border-inline-start: 2px solid #ccc; padding-inline-start: 1em; font-size: .9em; }
    details { margin-block-end: 2em; border-bottom: 1px solid #ddd; padding-block-end: .75em; font: 14px/1.6 system-ui,sans-serif; }
    summary { cursor: pointer; }
    details h2 { font-size: 1em; }
    hr { border: 0; border-top: 1px dashed #aaa; margin-block: 2em; clear: both; }
    [data-odt-reference] { color: LinkText; text-decoration: underline; cursor: pointer; }
    :focus-visible { outline: 2px solid currentColor; outline-offset: 3px; }
    @media(max-width:480px) { body { padding: 20px 16px; } }
  `
  doc.head.append(style)
  return {
    html: "<!doctype html>" + doc.documentElement.outerHTML,
    limited,
    outline,
    empty,
  }
}
