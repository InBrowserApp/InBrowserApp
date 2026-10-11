import createDOMPurify from "dompurify"

/** SVG is displayed only as an image, with no scripts, animation or network URLs. */
export function staticSvg(source: string) {
  const notes = { local: false, remote: false, active: false }
  const noteUrl = (value: string) => {
    if (/https?:|\/\//i.test(value)) notes.remote = true
    else notes.local = true
  }
  const purifier = createDOMPurify(window)
  const local = /^#[^\s"'()<>]+$/
  const raster = /^data:image\/(?:png|jpeg|gif|webp);base64,[a-z\d+/=\s]+$/i
  purifier.addHook("uponSanitizeElement", (_node, data) => {
    if (
      [
        "script",
        "style",
        "foreignobject",
        "animate",
        "animatemotion",
        "animatetransform",
        "set",
        "discard",
      ].includes(data.tagName)
    )
      notes.active = true
  })
  purifier.addHook("uponSanitizeAttribute", (_node, data) => {
    if (
      ["href", "xlink:href"].includes(data.attrName) &&
      !local.test(data.attrValue) &&
      !raster.test(data.attrValue)
    ) {
      data.keepAttr = false
      noteUrl(data.attrValue)
    }
    if (
      /url\s*\(|\\|\/\*/i.test(data.attrValue) &&
      !/^url\(\s*["']?#[\w:.-]+["']?\s*\)$/i.test(data.attrValue)
    ) {
      data.keepAttr = false
      noteUrl(data.attrValue)
    }
    if (data.attrName === "style") {
      const element = document.createElement("span")
      element.style.cssText = data.attrValue
      for (const property of Array.from(element.style)) {
        const value = element.style.getPropertyValue(property)
        if (/url\s*\(|\\|\/\*|image(?:-set)?\s*\(/i.test(value)) {
          element.style.removeProperty(property)
          noteUrl(value)
        }
      }
      data.attrValue = element.style.cssText
    }
  })
  const inert = document.createElement("template").content.ownerDocument
  const holder = inert.createElementNS("http://www.w3.org/2000/svg", "svg")
  holder.innerHTML = source
  purifier.sanitize(holder, {
    IN_PLACE: true,
    USE_PROFILES: { svg: true, svgFilters: true },
    FORBID_TAGS: [
      "script",
      "foreignObject",
      "style",
      "a",
      "animate",
      "animateMotion",
      "animateTransform",
      "set",
      "discard",
    ],
    FORBID_ATTR: ["xml:base"],
    ADD_TAGS: ["use"],
    ADD_DATA_URI_TAGS: ["image"],
    ALLOW_DATA_ATTR: false,
  })
  const root = holder.firstElementChild
  if (!root || root.localName !== "svg") return { url: null, notes }
  root.setAttribute("xmlns", "http://www.w3.org/2000/svg")
  return {
    notes,
    url:
      "data:image/svg+xml;charset=utf-8," +
      encodeURIComponent(new XMLSerializer().serializeToString(root)),
  }
}
