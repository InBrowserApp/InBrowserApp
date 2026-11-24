import DOMPurify from "dompurify"

export function sanitizeGraphSvg(markup: string) {
  const fragment = DOMPurify.sanitize(markup, {
    USE_PROFILES: { svg: true, svgFilters: true },
    FORBID_TAGS: ["image"],
    FORBID_ATTR: ["xmlns", "xmlns:xlink"],
    RETURN_DOM_FRAGMENT: true,
  })
  const graph = fragment.querySelector("svg")
  return graph ? new XMLSerializer().serializeToString(graph) : undefined
}
