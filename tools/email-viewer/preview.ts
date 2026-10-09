import createDOMPurify from "dompurify"
import { contentId, rasterImage } from "./mime"
import type { Email } from "./types"

const policy =
  "default-src 'none'; script-src 'none'; style-src 'unsafe-inline'; img-src blob: data:; base-uri 'none'; form-action 'none'"
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
]

// Remove resource-bearing CSS before the frame parses it. Escapes/comments
// are excluded too, so they cannot disguise a resource-loading token.
const resourceStyle = /url\s*\(|@import\b|image(?:-set)?\s*\(|\\|\/\*/i

function documentHtml(root: HTMLElement) {
  const head = root.querySelector("head")!
  const csp = root.ownerDocument.createElement("meta")
  csp.httpEquiv = "Content-Security-Policy"
  csp.content = policy
  head.prepend(csp)
  const style = root.ownerDocument.createElement("style")
  style.textContent = `
    :root { color-scheme: light; }
    body { margin: 0 auto !important; padding: 24px !important;
      box-sizing: border-box; min-width: 0 !important; max-width: 90ch;
      font-family: Arial, sans-serif; font-size: 16px; line-height: 1.6;
      overflow-wrap: anywhere; }
    img { max-width: 100%; height: auto; }
    pre { white-space: pre-wrap; overflow-wrap: anywhere; }
    blockquote { margin-inline: 1em 0; padding-inline-start: 1em;
      border-inline-start: 2px solid #ddd; }
    @media (max-width: 480px) { body { padding: 16px !important; } }
  `
  head.append(style)
  return "<!doctype html>" + root.outerHTML
}

export function preparePreview(email: Email) {
  const urls: string[] = []
  const images = new Map<string, string>()
  try {
    for (const item of email.attachments) {
      if (!item.cid || !item.bytes || !rasterImage.test(item.type)) continue
      const url = URL.createObjectURL(
        new Blob([item.bytes], { type: item.type })
      )
      urls.push(url)
      images.set(item.cid, url)
    }
    let limited = false
    const purifier = createDOMPurify(window)
    purifier.addHook("uponSanitizeElement", (node, data) => {
      if (forbidden.includes(data.tagName)) limited = true
      if (
        data.tagName === "style" &&
        resourceStyle.test(node.textContent || "")
      ) {
        node.textContent = ""
        limited = true
      }
    })
    purifier.addHook("uponSanitizeAttribute", (_node, data) => {
      if (
        data.attrName.startsWith("on") ||
        ["srcdoc", "ping", "autofocus", "contenteditable"].includes(
          data.attrName
        )
      )
        limited = true
      if (data.attrName === "style" && resourceStyle.test(data.attrValue)) {
        data.keepAttr = false
        limited = true
      }
      if (data.attrName === "src") {
        let value = data.attrValue.trim()
        if (/^cid:/i.test(value)) {
          try {
            value = decodeURIComponent(value.slice(4))
          } catch {
            value = value.slice(4)
          }
          const local = images.get(contentId(value))
          if (local) {
            data.attrValue = local
            return
          }
        }
        if (/^data:image\/(?:png|jpeg|gif|webp|avif|bmp);base64,/i.test(value))
          return
        data.keepAttr = false
        limited = true
      }
      if (
        ["href", "xlink:href", "srcset", "background", "poster"].includes(
          data.attrName
        )
      ) {
        data.keepAttr = false
        if (data.attrName !== "href" && data.attrName !== "xlink:href")
          limited = true
      }
    })
    const root = purifier.sanitize(email.html, {
      WHOLE_DOCUMENT: true,
      RETURN_DOM: true,
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
      ALLOWED_URI_REGEXP:
        /^(?:blob:|data:image\/(?:png|jpeg|gif|webp|avif|bmp);base64,)/i,
    }) as HTMLElement
    const plain = document.implementation.createHTMLDocument("")
    const text = plain.createElement("pre")
    text.dir = "auto"
    text.style.fontFamily = "inherit"
    text.textContent = email.text
    plain.body.append(text)
    return {
      html: documentHtml(root),
      plainHtml: documentHtml(plain.documentElement),
      limited,
      dispose: () => urls.forEach((url) => URL.revokeObjectURL(url)),
    }
  } catch (reason) {
    urls.forEach((url) => URL.revokeObjectURL(url))
    throw reason
  }
}
