const SVG_NS = "http://www.w3.org/2000/svg"
const XLINK_NS = "http://www.w3.org/1999/xlink"
const PIXELS_PER_MM = 96 / 25.4
const PAPER_MARGIN = 12 * PIXELS_PER_MM
const MAX_PAGE_PIXELS = 19_200 // 14,400 PDF points at 96 px/in.
const PIXELS_PER_UNIT: Readonly<Record<string, number>> = {
  "": 1,
  px: 1,
  in: 96,
  cm: PIXELS_PER_MM * 10,
  mm: PIXELS_PER_MM,
  q: PIXELS_PER_MM / 4,
  pt: 96 / 72,
  pc: 16,
}

const PAPER_SIZES = {
  a4: [210, 297],
  letter: [215.9, 279.4],
} as const

export type PageSize = "original" | keyof typeof PAPER_SIZES

export type SvgArtwork = ReturnType<typeof prepareSvg>

export const embeddedRaster =
  /^data:image\/(?:png|jpeg|gif|webp);base64,[a-z\d+/=\s]+$/i

function absolutePixels(length: string) {
  const match = length
    .trim()
    .match(/^([+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?)([a-z]*)$/i)
  if (!match) return 0
  const unit = match[2]!.toLowerCase()
  if (!Object.hasOwn(PIXELS_PER_UNIT, unit)) return 0
  const pixels = Number(match[1]) * PIXELS_PER_UNIT[unit]!
  if (!Number.isFinite(pixels) || pixels <= 0)
    throw new Error("Invalid SVG size")
  return pixels
}

function parseSvg(source: string) {
  const parser = new DOMParser()
  let svg: Element = parser.parseFromString(
    source,
    "image/svg+xml"
  ).documentElement
  if (svg.getElementsByTagNameNS("*", "parsererror").length) {
    throw new Error("Invalid SVG")
  }
  if (svg.localName === "svg" && !svg.namespaceURI) {
    svg.setAttribute("xmlns", SVG_NS)
    svg = parser.parseFromString(svg.outerHTML, "image/svg+xml").documentElement
  }
  if (svg.localName !== "svg" || svg.namespaceURI !== SVG_NS) {
    throw new Error("Invalid SVG")
  }

  // svg2pdf dispatches on tagName, so use unprefixed names in the SVG namespace.
  for (const element of [svg, ...svg.querySelectorAll("*")]) {
    if (!element.prefix || element.namespaceURI !== SVG_NS) continue
    const unprefixed = svg.ownerDocument.createElementNS(
      SVG_NS,
      element.localName
    )
    for (const attribute of element.attributes) {
      unprefixed.setAttributeNS(
        attribute.namespaceURI,
        attribute.name,
        attribute.value
      )
    }
    unprefixed.append(...element.childNodes)
    element.replaceWith(unprefixed)
    if (element === svg) svg = unprefixed
  }
  return svg as SVGSVGElement
}

function prepareReferences(root: SVGSVGElement) {
  for (const element of [root, ...root.querySelectorAll("*")]) {
    const instructions = Array.from(element.childNodes).filter(
      (child) => child.nodeType === Node.PROCESSING_INSTRUCTION_NODE
    )
    for (const instruction of instructions) instruction.remove()

    const references = [
      element.getAttributeNode("href"),
      element.getAttributeNodeNS(XLINK_NS, "href"),
    ]
    for (const attribute of references) {
      if (!attribute) continue
      const value = attribute.value.trim()
      const local =
        value.startsWith("#") &&
        (element.localName !== "use" ||
          root.ownerDocument.getElementById(value.slice(1)))
      if (
        local ||
        (element.localName === "image" && embeddedRaster.test(value))
      ) {
        attribute.value = value
      } else {
        element.removeAttributeNode(attribute)
      }
    }
  }
}

function normalizeGradients(root: SVGSVGElement) {
  for (const gradient of root.querySelectorAll(
    "linearGradient, radialGradient"
  )) {
    if (gradient.getAttribute("gradientUnits") === "userSpaceOnUse") continue
    // svg2pdf expects fractional object-bounding-box coordinates.
    for (const attr of ["x1", "y1", "x2", "y2", "cx", "cy", "r", "fx", "fy"]) {
      const value = gradient.getAttribute(attr)?.trim()
      if (value?.endsWith("%"))
        gradient.setAttribute(attr, String(parseFloat(value) / 100))
    }
  }
}

export function prepareSvg(source: string) {
  const root = parseSvg(source)
  const viewBox = (root.getAttribute("viewBox") ?? "")
    .trim()
    .split(/[\s,]+/)
    .map(Number)
  const [, , boxWidth, boxHeight] = viewBox
  const validBox =
    viewBox.length === 4 &&
    viewBox.every(Number.isFinite) &&
    boxWidth! > 0 &&
    boxHeight! > 0
  const aspect = validBox ? boxWidth! / boxHeight! : 2
  const declaredWidth = absolutePixels(
    root.style.getPropertyValue("width") || root.getAttribute("width") || ""
  )
  const declaredHeight = absolutePixels(
    root.style.getPropertyValue("height") || root.getAttribute("height") || ""
  )
  const width =
    declaredWidth ||
    (declaredHeight ? declaredHeight * aspect : validBox ? boxWidth! : 300)
  const height =
    declaredHeight ||
    (declaredWidth ? declaredWidth / aspect : validBox ? boxHeight! : 150)
  if (
    !Number.isFinite(width) ||
    !Number.isFinite(height) ||
    width <= 0 ||
    height <= 0
  ) {
    throw new Error("Invalid SVG size")
  }
  if (!validBox) root.setAttribute("viewBox", `0 0 ${width} ${height}`)
  root.setAttribute("width", String(width))
  root.setAttribute("height", String(height))
  root.style.setProperty("width", `${width}px`, "important")
  root.style.setProperty("height", `${height}px`, "important")

  prepareReferences(root)
  normalizeGradients(root)

  // SVG image mode keeps the preview isolated from the page DOM and external loads.
  const preview = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(new XMLSerializer().serializeToString(root))}`
  return { root, width, height, preview }
}

export function pageLayout(
  artwork: { width: number; height: number },
  size: PageSize
) {
  const { width, height } = artwork
  if (size === "original") {
    const scale = Math.min(1, MAX_PAGE_PIXELS / Math.max(width, height))
    const pageWidth = width * scale
    const pageHeight = height * scale
    return {
      width: pageWidth,
      height: pageHeight,
      artworkWidth: pageWidth,
      artworkHeight: pageHeight,
      x: 0,
      y: 0,
    }
  }

  const [short, long] = PAPER_SIZES[size]
  const landscape = width > height
  const pageWidth = (landscape ? long : short) * PIXELS_PER_MM
  const pageHeight = (landscape ? short : long) * PIXELS_PER_MM
  const scale = Math.min(
    (pageWidth - 2 * PAPER_MARGIN) / width,
    (pageHeight - 2 * PAPER_MARGIN) / height
  )
  const artworkWidth = width * scale
  const artworkHeight = height * scale
  return {
    width: pageWidth,
    height: pageHeight,
    artworkWidth,
    artworkHeight,
    x: (pageWidth - artworkWidth) / 2,
    y: (pageHeight - artworkHeight) / 2,
  }
}

export function millimeters(pixels: number) {
  return pixels / PIXELS_PER_MM
}
