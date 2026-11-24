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

export async function createPng(url: string) {
  const image = new Image()
  image.src = url
  await image.decode()

  const canvas = document.createElement("canvas")
  canvas.width = image.naturalWidth * 2
  canvas.height = image.naturalHeight * 2
  const context = canvas.getContext("2d")
  if (!context) throw new Error("Canvas unavailable")
  context.drawImage(image, 0, 0, canvas.width, canvas.height)

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob)
      else reject(new Error("PNG export failed"))
    }, "image/png")
  })
}

export function download(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  link.click()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}
