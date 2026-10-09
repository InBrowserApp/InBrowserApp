import createDOMPurify from "dompurify"
import mathStyle from "./vendor/math.css?raw"
import type { Messages, Preview } from "./types"

const policy =
  "default-src 'none'; script-src 'none'; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'"
const readerStyle = `
html{color-scheme:light;background:#fff;color:#202020;overflow-wrap:anywhere}
body{margin:0}.fl-article{color:#202020;max-width:48rem;font-size:1rem;padding:1.5rem clamp(.75rem,4vw,2rem) 4rem}
.fl-article p{text-align:start}.fl-section{font-family:inherit}
.fl-date,.fl-secnum,.fl-caption,.fl-quote,.fl-quotation,.fl-toc-num{color:#555}
.fl-verbatim,.fl-toc{background:#f6f6f6;border-color:#ddd}
.fl-ref,.fl-cite a,.fl-toc a{color:#1746ae;text-decoration:underline;cursor:pointer}
[data-latex-wide]{max-width:100%;overflow:auto;outline-offset:-2px}
.fl-display-math{justify-content:start;min-width:0}
.fl-display-math math{margin-inline:auto;flex-shrink:0}
.fl-tabular{overflow-wrap:normal}
[data-latex-inline-math]{display:inline-block;max-width:100%;overflow-x:auto;vertical-align:middle}
math{font-family:math}.fl-abstract,.fl-quote,.fl-quotation{margin-inline:1em}
.fl-bibliography dl{grid-template-columns:fit-content(25%) minmax(0,1fr)}
.latex-image{border:1px dashed #aaa;padding:.75em;color:#555;text-align:start}
*{box-sizing:border-box}:focus-visible{outline:2px solid #1746ae;outline-offset:2px}
`

export function preparePreview(
  html: string,
  css: string,
  m: Messages
): Preview {
  const inert = document.createElement("template").content.ownerDocument
  const body = inert.createElement("body")
  body.innerHTML = html
  let images = false
  for (const image of body.querySelectorAll("img")) {
    images = true
    const placeholder = inert.createElement("p")
    placeholder.className = "latex-image"
    placeholder.textContent = `${m.imagePlaceholder}: ${image.getAttribute("alt") || image.getAttribute("src") || "—"}`
    image.replaceWith(placeholder)
  }
  const purifier = createDOMPurify(window)
  purifier.addHook("uponSanitizeAttribute", (_node, data) => {
    if (data.attrName === "style") {
      const holder = inert.createElement("span")
      holder.setAttribute("style", data.attrValue)
      data.attrValue = [
        "text-align",
        "font-size",
        "font-style",
        "font-weight",
        "vertical-align",
      ]
        .map((name) => {
          const value = holder.style.getPropertyValue(name)
          return value && !/url\(|var\(|image|expression|[\\<>]/i.test(value)
            ? `${name}:${value}`
            : ""
        })
        .filter(Boolean)
        .join(";")
    }
  })
  purifier.addHook("afterSanitizeAttributes", (node) => {
    const href = node.getAttribute("href")
    node.removeAttribute("href")
    if (node.localName === "a" && href?.startsWith("#")) {
      node.setAttribute("data-latex-link", href.slice(1))
      node.setAttribute("role", "link")
      node.setAttribute("tabindex", "0")
    }
  })
  purifier.sanitize(body, {
    IN_PLACE: true,
    WHOLE_DOCUMENT: true,
    USE_PROFILES: { html: true, mathMl: true },
    FORBID_TAGS: [
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
      "img",
      "annotation",
      "annotation-xml",
      "template",
      "canvas",
    ],
    FORBID_ATTR: [
      "src",
      "srcset",
      "srcdoc",
      "background",
      "poster",
      "xlink:href",
      "ping",
      "autofocus",
      "contenteditable",
      "target",
      "download",
      "is",
    ],
    ALLOW_DATA_ATTR: false,
  })
  if (!body.textContent?.trim() && !body.querySelector("math,table")) {
    const p = inert.createElement("p")
    p.textContent = m.noContent
    body.append(p)
  }
  for (const element of body.querySelectorAll("table,pre")) {
    const wrapper = inert.createElement("div")
    wrapper.setAttribute("data-latex-wide", "")
    wrapper.tabIndex = 0
    element.replaceWith(wrapper)
    wrapper.append(element)
  }
  // Preserve MathML's native display value. Changing math itself to an
  // inline-block turns its direct children into separate vertical boxes.
  for (const math of body.querySelectorAll('math[display="inline"]')) {
    const wrapper = inert.createElement("span")
    wrapper.setAttribute("data-latex-inline-math", "")
    wrapper.tabIndex = 0
    math.replaceWith(wrapper)
    wrapper.append(math)
  }
  for (const math of body.querySelectorAll<HTMLElement>(".fl-display-math"))
    math.tabIndex = 0
  const prefix = `latex-heading-${crypto.randomUUID()}-`
  const outline = Array.from(
    body.querySelectorAll("h1,h2,h3,h4,h5,h6"),
    (heading, index) => {
      const target = inert.createElement("span")
      target.id = `${prefix}${index}`
      heading.prepend(target)
      return {
        id: target.id,
        label: heading.textContent?.trim() || m.documentBody,
        level: Number(heading.localName.slice(1)),
      }
    }
  )
  const head = inert.createElement("head")
  const csp = inert.createElement("meta")
  csp.httpEquiv = "Content-Security-Policy"
  csp.content = policy
  const style = inert.createElement("style")
  style.textContent = (mathStyle + css + readerStyle).replace(
    /<\/style/gi,
    "<\\/style"
  )
  head.append(csp, style)
  return {
    html: `<!doctype html><html>${head.outerHTML}${body.outerHTML}</html>`,
    outline,
    images,
  }
}
