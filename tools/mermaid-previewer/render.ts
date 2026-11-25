import DOMPurify from "dompurify"
import mermaid from "mermaid"

mermaid.initialize({
  startOnLoad: false,
  securityLevel: "strict",
  suppressErrorRendering: true,
  htmlLabels: false,
  fontFamily: "system-ui, sans-serif",
  secure: [
    "secure",
    "securityLevel",
    "startOnLoad",
    "maxTextSize",
    "maxEdges",
    "suppressErrorRendering",
    "htmlLabels",
    "flowchart",
    "themeCSS",
  ],
})

let nextId = 0
let pending = Promise.resolve()

const rasterDataUrl = /^data:image\/(?:png|jpeg|gif|webp|avif|bmp);base64,/i

export function unwrapSource(source: string) {
  return (
    /^\s*(`{3,}|~{3,})mermaid[ \t]*\r?\n([\s\S]*?)\r?\n[ \t]*\1\s*$/i.exec(
      source
    )?.[2] ?? source
  )
}

async function render(source: string) {
  const definition = unwrapSource(source)
  // Mermaid can fetch image-node URLs while measuring them, before the SVG is isolated.
  if (definition.includes("@{")) {
    const { db } = await mermaid.mermaidAPI.getDiagramFromText(definition)
    const vertices = (
      db as { getVertices?: () => Map<string, { img?: string }> }
    ).getVertices?.()
    for (const { img } of vertices?.values() ?? []) {
      if (img && !rasterDataUrl.test(img)) {
        throw new Error(
          "Mermaid image nodes require an embedded raster data URL."
        )
      }
    }
  }

  const container = document.createElement("div")
  container.style.cssText =
    "position:fixed;inset:0;visibility:hidden;pointer-events:none"
  container.inert = true
  document.body.append(container)
  try {
    const { svg } = await mermaid.render(
      `mermaid-preview-${++nextId}`,
      definition,
      container
    )
    return prepareSvg(svg)
  } finally {
    container.remove()
  }
}

function prepareSvg(svg: string) {
  const fragment = DOMPurify.sanitize(svg, {
    USE_PROFILES: { html: true, svg: true, svgFilters: true },
    ADD_TAGS: ["foreignObject"],
    HTML_INTEGRATION_POINTS: { foreignobject: true },
    // The fragment already has namespaces. XMLSerializer writes the declarations.
    FORBID_ATTR: ["xmlns"],
    RETURN_DOM_FRAGMENT: true,
  })
  const diagram = fragment.querySelector("svg")
  if (!diagram) throw new Error("Invalid Mermaid SVG")

  // Journey and C4 supply SVG text inside their HTML label switches.
  // Use that fallback for preview and export so vector PDFs retain the labels.
  for (const label of diagram.querySelectorAll("switch")) {
    const text = label.querySelectorAll(":scope > text")
    if (text.length && label.firstElementChild?.localName === "foreignObject")
      label.replaceWith(...text)
  }
  // Mermaid assigns section labels the background class from their rectangles.
  for (const label of diagram.querySelectorAll<SVGTextElement>(
    "text.journey-section"
  )) {
    label.style.fill = label.getAttribute("fill") ?? "inherit"
  }
  // Use an absolute baseline so vector outlining can reorder RTL glyphs
  // without applying Mermaid's relative offset to an individual glyph.
  for (const label of diagram.querySelectorAll<SVGTextElement>(
    'text.messageText[y][dy="1em"]'
  )) {
    const baseline = Number(label.getAttribute("y"))
    if (Number.isFinite(baseline) && label.style.fontSize.endsWith("px")) {
      const offset = parseFloat(label.style.fontSize)
      label.setAttribute("y", String(baseline + offset))
      label.removeAttribute("dy")
    }
  }

  const viewBox = diagram
    .getAttribute("viewBox")
    ?.trim()
    .split(/[\s,]+/)
    .map(Number)

  const [, , width, height] = viewBox ?? []
  if (width !== undefined && height !== undefined) {
    diagram.setAttribute("width", String(Math.ceil(width)))
    diagram.setAttribute("height", String(Math.ceil(height)))
  }

  return new XMLSerializer().serializeToString(diagram)
}

export function renderDiagram(source: string) {
  // Mermaid keeps its parser and renderer state at the module level.
  const result = pending.then(() => render(source))
  pending = result.then(
    () => undefined,
    () => undefined
  )
  return result
}

export async function createRaster(
  url: string,
  {
    type,
    scale,
    white,
  }: {
    type: "image/png" | "image/jpeg" | "image/webp"
    scale: number
    white: boolean
  }
) {
  const image = new Image()
  image.src = url
  await image.decode()

  const canvas = document.createElement("canvas")
  try {
    canvas.width = image.naturalWidth * scale
    canvas.height = image.naturalHeight * scale
    const context = canvas.getContext("2d")
    if (!context) throw new Error("Canvas unavailable")
    if (white || type === "image/jpeg") {
      context.fillStyle = "#fff"
      context.fillRect(0, 0, canvas.width, canvas.height)
    }
    context.drawImage(image, 0, 0, canvas.width, canvas.height)
    return await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob?.type === type) resolve(blob)
          else reject(new Error("Image export failed"))
        },
        type,
        type === "image/png" ? undefined : 0.92
      )
    })
  } finally {
    canvas.width = canvas.height = 0
  }
}

export function createPng(url: string) {
  return createRaster(url, { type: "image/png", scale: 2, white: false })
}
