import createDOMPurify from "dompurify"
import type { Source } from "./types"

const resource = /url\s*\(|@|image(?:-set)?\s*\(|\\|\/\*|<|>/i
const raster = /^data:image\/(?:png|jpeg|gif|webp|avif|bmp);base64,/i

export function prepare(source: Source) {
  if (resource.test(source.css)) throw new Error("unsupported")
  const purifier = createDOMPurify(window)
  let unsafe = false
  purifier.addHook("uponSanitizeAttribute", (_node, data) => {
    if (
      (data.attrName === "style" && resource.test(data.attrValue)) ||
      (data.attrName === "src" && !raster.test(data.attrValue)) ||
      ["srcset", "background", "poster"].includes(data.attrName)
    ) {
      unsafe = true
      data.keepAttr = false
    }
  })
  const inert = document.createElement("template")
  inert.innerHTML = source.html
  const content = purifier.sanitize(inert.content, {
    RETURN_DOM_FRAGMENT: true,
    ALLOWED_TAGS: [
      "div",
      "p",
      "span",
      "br",
      "hr",
      "a",
      "b",
      "i",
      "strong",
      "em",
      "s",
      "u",
      "sub",
      "sup",
      "img",
      "table",
      "thead",
      "tbody",
      "tfoot",
      "tr",
      "td",
      "th",
      "colgroup",
      "col",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
    ],
    ALLOWED_ATTR: [
      "class",
      "style",
      "src",
      "alt",
      "width",
      "height",
      "colspan",
      "rowspan",
      "dir",
    ],
    ALLOW_DATA_ATTR: false,
  })
  if (
    unsafe ||
    purifier.removed.some(
      (entry) => "element" in entry && entry.element.nodeName !== "BODY"
    )
  )
    throw new Error("unsupported")
  if (
    content.querySelector(
      ".msdoc-attachment,.msdoc-image-fallback,img:not([src])"
    )
  )
    throw new Error("unsupported")
  const text = content.textContent!.replace(/\s/g, "")
  const imageCount = content.querySelectorAll("img").length
  if (!text && !imageCount) throw new Error("invalid")
  const main = document.createElement("main")
  main.id = "pdf-content"
  main.append(content)
  let css = source.css
  const rules = new Map<string, string>()
  // Paged.js's undisplayed filter treats inline styles without display as
  // hidden. Stylesheet classes retain the styles and explicit page breaks.
  for (const element of main.querySelectorAll<HTMLElement>("[style]")) {
    // Reflow does not retain keep-with-next/keep-together constraints. In
    // Firefox, retaining these on a heading before a table can make Paged.js
    // restart the table after emitting some of its rows. Explicit breaks stay.
    for (const property of ["break-after", "break-inside"])
      if (element.style.getPropertyValue(property) === "avoid")
        element.style.removeProperty(property)
    const style = element.style.cssText
    let name = rules.get(style)
    if (!name) {
      name = `pdf-inline-${rules.size}`
      rules.set(style, name)
      css += `\n#pdf-content .${name}{${style}}`
    }
    element.classList.add(name)
    element.removeAttribute("style")
  }
  const fragment = document.createDocumentFragment()
  fragment.append(main)
  return { fragment, css, text, imageCount }
}
