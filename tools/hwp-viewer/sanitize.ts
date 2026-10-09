import DOMPurify from "dompurify"
import type { Page } from "./types"
const raster = /^data:image\/(?:png|jpeg|gif|webp|bmp);base64,[a-z\d+/=\s]+$/i
const vector = /^data:image\/svg\+xml;base64,([a-z\d+/=\s]+)$/i

function cleanSvg(source: string) {
  const clean = DOMPurify.sanitize(source, {
    USE_PROFILES: { svg: true, svgFilters: true },
    RETURN_DOM_FRAGMENT: true,
    FORBID_TAGS: [
      "style",
      "foreignObject",
      "a",
      "animate",
      "animateTransform",
      "set",
    ],
  })
  const svg = clean.firstElementChild
  if (!svg || svg.localName !== "svg" || clean.children.length !== 1)
    throw new Error("pageError")
  const limited = DOMPurify.removed.some((entry) =>
    "element" in entry
      ? entry.element instanceof Element &&
        ["image", "foreignObject", "style"].includes(entry.element.localName)
      : entry.attribute?.localName === "href" &&
        entry.from instanceof Element &&
        entry.from.localName === "image"
  )
  return { svg, limited }
}

export function sanitizePage(source: string): Page {
  const cleaned = cleanSvg(source)
  const svg = cleaned.svg
  let limited = cleaned.limited
  const pending: { svg: Element; reference: Attr | null }[] = [
    { svg, reference: null },
  ]
  // Charts can be SVG images nested inside the page SVG. Process them
  // iteratively, then serialize children before parents: no recursive stack
  // or arbitrary document/image count limit, and no unsanitized data SVG.
  for (let index = 0; index < pending.length; index++) {
    const current = pending[index]!.svg
    for (const node of [current, ...current.querySelectorAll("*")]) {
      // Snapshot the live map because unsafe attributes are removed below.
      for (const attribute of Array.from(node.attributes)) {
        const value = attribute.value
        if (attribute.localName === "href" && !value.startsWith("#")) {
          const embedded = node.localName === "image" && value.match(vector)
          if (embedded) {
            try {
              const bytes = Uint8Array.from(atob(embedded[1]!), (char) =>
                char.charCodeAt(0)
              )
              const source = new TextDecoder("utf-8", { fatal: true }).decode(
                bytes
              )
              const child = cleanSvg(source)
              limited ||= child.limited
              pending.push({ svg: child.svg, reference: attribute })
            } catch {
              limited = true
              node.removeAttributeNode(attribute)
            }
          } else if (!(node.localName === "image" && raster.test(value))) {
            limited ||= node.localName === "image"
            node.removeAttributeNode(attribute)
          }
        } else if (
          /@import|(?:image(?:-set)?|cross-fade|src)\s*\(|\\|\/\*/i.test(
            value
          ) ||
          /url\s*\(/i.test(
            value.replace(/url\(\s*["']?#[\w.-]+["']?\s*\)/gi, "")
          )
        ) {
          limited = true
          node.removeAttributeNode(attribute)
        }
      }
    }
  }
  const serializer = new XMLSerializer()
  for (let index = pending.length - 1; index > 0; index--) {
    const item = pending[index]!
    item.reference!.value = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(serializer.serializeToString(item.svg))}`
  }
  const box = svg
    .getAttribute("viewBox")
    ?.trim()
    .split(/[\s,]+/)
    .map(Number)
  const width = box?.[2] ?? Number.parseFloat(svg.getAttribute("width") ?? "")
  const height = box?.[3] ?? Number.parseFloat(svg.getAttribute("height") ?? "")
  if (
    !Number.isFinite(width) ||
    !Number.isFinite(height) ||
    width <= 0 ||
    height <= 0
  )
    throw new Error("pageError")
  return { svg: serializer.serializeToString(svg), width, height, limited }
}
