import { initWasm, Resvg } from "@resvg/resvg-wasm"
import wasmUrl from "@resvg/resvg-wasm/index_bg.wasm?url"
import { cjk, devanagari, thai } from "@workspace/libreoffice/fonts"
import bold from "../fonts/DejaVuSans-Bold.ttf?url"
import regular from "../fonts/DejaVuSans.ttf?url"
import emoji from "../fonts/NotoEmoji.ttf?url"
import type { SvgArtwork } from "./svg"

let ready: Promise<void> | undefined

async function fetchFont(url: string) {
  const response = await fetch(url)
  if (!response.ok) throw new Error("Diagram PDF font unavailable")
  return new Uint8Array(await response.arrayBuffer())
}

export async function outlineText(
  artwork: SvgArtwork,
  texts: SVGTextElement[],
  language?: string
) {
  const svg = artwork.root
  const labels = texts.map((text) => text.textContent).join("")
  const fontUrls = [regular, bold]
  if (
    /[\p{Script=Han}\p{Script=Hangul}\p{Script=Hiragana}\p{Script=Katakana}]/u.test(
      labels
    )
  ) {
    fontUrls.push(cjk)
  }
  if (/\p{Script=Thai}/u.test(labels)) fontUrls.push(thai)
  if (/\p{Script=Devanagari}/u.test(labels)) fontUrls.push(devanagari)
  if (/[\p{Extended_Pictographic}\p{Regional_Indicator}\u20e3]/u.test(labels)) {
    fontUrls.push(emoji)
  }

  ready ??= initWasm(fetch(wasmUrl)).catch((error) => {
    ready = undefined
    throw error
  })
  const [, fontBuffers] = await Promise.all([
    ready,
    Promise.all(fontUrls.map(fetchFont)),
  ])
  const originalIds = texts.map((text, index) => {
    if (text.id) return text.id
    let id = `inbrowser-pdf-label-${index}`
    while (svg.ownerDocument.getElementById(id)) id += "-"
    text.id = id
    return ""
  })
  const renderer = new Resvg(new XMLSerializer().serializeToString(svg), {
    font: {
      fontBuffers,
      defaultFontFamily: "DejaVu Sans",
      sansSerifFamily: "DejaVu Sans",
    },
    languages: language ? [language] : undefined,
  })
  try {
    const outlined = new DOMParser().parseFromString(
      renderer.toString(),
      "image/svg+xml"
    )
    // Preserve the original geometry and markers. Replace only the text glyphs.
    for (const [index, text] of texts.entries()) {
      const replacement = outlined.getElementById(text.id)
      if (!replacement) continue
      if (!originalIds[index]) replacement.removeAttribute("id")
      const transform = text.getAttribute("transform")
      if (transform) replacement.setAttribute("transform", transform)
      for (const path of replacement.querySelectorAll<SVGPathElement>("path")) {
        // Diagram styles for node paths must not recolor the new text paths.
        path.style.fill = path.getAttribute("fill") ?? "black"
        path.style.stroke = path.getAttribute("stroke") ?? "none"
      }
      text.replaceWith(replacement)
    }
    const bounds = renderer.getBBox()
    if (!bounds) return artwork
    try {
      return fitLabelBounds(artwork, bounds)
    } finally {
      bounds.free()
    }
  } finally {
    renderer.free()
  }
}

function fitLabelBounds(
  artwork: SvgArtwork,
  bounds: { x: number; y: number; width: number; height: number }
) {
  const root = artwork.root
  const [x, y, width, height] = root
    .getAttribute("viewBox")!
    .trim()
    .split(/[\s,]+/)
    .map(Number) as [number, number, number, number]
  const margin = 4
  const left = Math.min(x, bounds.x - margin)
  const top = Math.min(y, bounds.y - margin)
  const right = Math.max(x + width, bounds.x + bounds.width + margin)
  const bottom = Math.max(y + height, bounds.y + bounds.height + margin)
  const expandedWidth = right - left
  const expandedHeight = bottom - top
  if (expandedWidth <= width && expandedHeight <= height) return artwork

  const pixelsWide = (artwork.width * expandedWidth) / width
  const pixelsHigh = (artwork.height * expandedHeight) / height
  root.setAttribute(
    "viewBox",
    `${left} ${top} ${expandedWidth} ${expandedHeight}`
  )
  root.setAttribute("width", String(pixelsWide))
  root.setAttribute("height", String(pixelsHigh))
  root.style.width = `${pixelsWide}px`
  root.style.height = `${pixelsHigh}px`
  return { root, width: pixelsWide, height: pixelsHigh }
}
