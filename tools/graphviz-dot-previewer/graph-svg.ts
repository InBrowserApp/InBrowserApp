import DOMPurify from "dompurify"

export function graphSvgUrl(markup: string) {
  const fragment = DOMPurify.sanitize(markup, {
    USE_PROFILES: { svg: true, svgFilters: true },
    FORBID_TAGS: ["image"],
    FORBID_ATTR: ["xmlns", "xmlns:xlink"],
    RETURN_DOM_FRAGMENT: true,
  })
  const graph = fragment.querySelector("svg")
  if (!graph) return undefined
  return `data:image/svg+xml,${encodeURIComponent(new XMLSerializer().serializeToString(graph))}`
}
