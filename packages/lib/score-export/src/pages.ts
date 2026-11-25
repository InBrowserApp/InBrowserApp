const SVG_NS = "http://www.w3.org/2000/svg"
const pixelsPerMillimeter = 96 / 25.4
export const paperWidth = Math.round(210 * pixelsPerMillimeter)
export const paperHeight = (paperWidth * 297) / 210
export const paperSizes = {
  a4: { width: paperWidth, height: paperHeight },
  letter: { width: 816, height: 1056 },
} as const
export type ScorePaper = keyof typeof paperSizes

const margin = Math.round(12 * pixelsPerMillimeter)
export function scoreContentWidth(size: ScorePaper) {
  return paperSizes[size].width - 2 * margin
}

export function scoreFilename(name: string) {
  return (
    name
      // oxlint-disable-next-line no-control-regex -- Replace characters unsuitable for download filenames.
      .replace(/[<>:"/\\|?*\u0000-\u001f]/g, "_")
      .trim()
      .replace(/^\.+|\.+$/g, "") || "score"
  )
}

export async function inScoreHost<T>(
  width: number,
  render: (host: HTMLDivElement) => T | Promise<T>
) {
  const host = document.createElement("div")
  host.dir = "ltr"
  host.style.cssText = `position:fixed;left:-10000px;top:0;visibility:hidden;color:black;width:${width}px`
  document.body.append(host)
  try {
    return await render(host)
  } finally {
    host.remove()
  }
}

function makePage(width: number, height: number) {
  const page = document.createElementNS(SVG_NS, "svg")
  page.setAttribute("width", String(width))
  page.setAttribute("height", String(height))
  page.setAttribute("viewBox", `0 0 ${width} ${height}`)
  page.setAttribute("color", "black")
  return page
}

export function serializeImagePage(page: SVGSVGElement, scale: number) {
  const copy = page.cloneNode(true) as SVGSVGElement
  copy.setAttribute(
    "width",
    String(Math.round(Number(page.getAttribute("width")) * scale))
  )
  copy.setAttribute(
    "height",
    String(Math.round(Number(page.getAttribute("height")) * scale))
  )
  const background = document.createElementNS(SVG_NS, "rect")
  background.setAttribute("width", "100%")
  background.setAttribute("height", "100%")
  background.setAttribute("fill", "white")
  copy.prepend(background)
  return new XMLSerializer().serializeToString(copy)
}

export function scorePagePreviewBlob(page: SVGSVGElement) {
  return new Blob([serializeImagePage(page, 1)], { type: "image/svg+xml" })
}

export function placeFullPage(score: SVGSVGElement, size: ScorePaper = "a4") {
  const { width, height } = paperSizes[size]
  return placeScore(score, width, height)
}

function placeScore(score: SVGSVGElement, width: number, height: number) {
  const page = makePage(width, height)
  score.setAttribute("width", String(width))
  score.setAttribute("height", String(height))
  page.append(score)
  return page
}

export function cropScorePage(source: SVGSVGElement) {
  const ink = source.getBBox()
  const padding = 12
  const left = Math.floor(ink.x) - padding
  const top = Math.floor(ink.y) - padding
  const width = Math.ceil(ink.x + ink.width) + padding - left
  const height = Math.ceil(ink.y + ink.height) + padding - top
  const score = source.cloneNode(true) as SVGSVGElement
  score.setAttribute("viewBox", `${left} ${top} ${width} ${height}`)
  return placeScore(score, width, height)
}

function measure(section: SVGSVGElement, contentWidth: number) {
  const box = section.getAttribute("viewBox")!.trim().split(/\s+/).map(Number)
  const [, , width, height] = box
  if (!width || !height || height < 0) return null
  const scale = Math.min(1, contentWidth / width)
  return { section, width: width * scale, height: height * scale }
}

type Section = NonNullable<ReturnType<typeof measure>>

export function flowScorePages(
  tunes: SVGSVGElement[][],
  size: ScorePaper = "a4"
) {
  const { width, height } = paperSizes[size]
  const contentWidth = scoreContentWidth(size)
  const contentHeight = height - 2 * margin
  const pages: SVGSVGElement[] = []
  let page: SVGSVGElement | undefined
  let y = 0
  function place(sections: Section[], gap: number) {
    const groupHeight = sections.reduce(
      (total, section) => total + section.height,
      0
    )
    if (!page || y + gap + groupHeight > contentHeight) {
      page = makePage(width, height)
      pages.push(page)
      y = 0
    }
    if (y) y += gap
    const scale = Math.min(1, contentHeight / groupHeight)
    for (const { section, width, height } of sections) {
      section.setAttribute("x", String(margin))
      section.setAttribute("y", String(margin + y))
      section.setAttribute("width", String(width * scale))
      section.setAttribute("height", String(height * scale))
      page.append(section)
      y += height * scale
    }
  }

  for (const tune of tunes) {
    const sections = tune
      .map((section) => measure(section, contentWidth))
      .filter((section) => section !== null)
    if (!sections.length) continue
    // Keep introductory text with the first system when a tune starts near a page break.
    const firstSystem = sections.findIndex(({ section }) =>
      section.querySelector(".abcjs-staff-wrapper")
    )
    const startCount = Math.max(1, firstSystem + 1)
    place(sections.slice(0, startCount), 18)
    for (const section of sections.slice(startCount)) place([section], 0)
  }
  return pages
}
