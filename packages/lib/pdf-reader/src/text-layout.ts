import type { PDFPageProxy, PageViewport } from "pdfjs-dist"

type TextContent = Awaited<ReturnType<PDFPageProxy["getTextContent"]>>
type Run = { text: string; x: number; rtl: boolean }
type Line = {
  runs: Run[]
  x: number
  y: number
  height: number
  rtl: boolean
}
export type PdfReflowBlock = {
  kind: "heading" | "paragraph"
  text: string
}

export function joinWrappedText(left: string, right: string) {
  if (left.endsWith("\u00ad")) return left.slice(0, -1) + right
  if (left.endsWith("-") && /^\p{Ll}/u.test(right)) return left + right
  const eastAsianEnd =
    /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}。！？、]$/u
  const eastAsianStart =
    /^[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}。！？、]/u
  return (
    left +
    (eastAsianEnd.test(left) && eastAsianStart.test(right) ? "" : " ") +
    right
  )
}

function lineText(line: Line) {
  if (!line.rtl) {
    let text = ""
    let rtlRuns: Run[] = []
    function flush() {
      for (const run of rtlRuns.sort((a, b) => b.x - a.x)) text += run.text
      rtlRuns = []
    }
    for (const [index, run] of line.runs.entries()) {
      if (
        run.rtl ||
        (rtlRuns.length && !run.text.trim() && line.runs[index + 1]?.rtl)
      )
        rtlRuns.push(run)
      else {
        flush()
        text += run.text
      }
    }
    flush()
    return text.trim()
  }
  // PDF.js returns logical text within each item, but RTL glyph items may
  // arrive in physical left-to-right order. Keep embedded LTR runs together.
  const runs: Pick<Run, "text" | "rtl">[] = []
  const visual = line.runs.filter((run, index) => {
    const next = line.runs[index + 1]
    const before = line.runs[index - 1]
    return (
      run.text.trim() ||
      !next?.rtl ||
      !/^\p{M}+$/u.test(before?.text ?? "") ||
      Math.abs(next.x - run.x) > 0.01
    )
  })
  for (const item of visual.sort((a, b) => b.x - a.x)) {
    const previous = runs.at(-1)
    if (previous && !previous.rtl && !item.rtl)
      previous.text = item.text + previous.text
    else runs.push({ text: item.text, rtl: item.rtl })
  }
  return runs
    .map(({ text }) => text)
    .join("")
    .trim()
}

function normalizeGlyphs(text: string) {
  // Unshape presentation forms without changing symbols such as ² or ½.
  return text.replace(
    /[\u2e80-\u2fdf\uf900-\ufaff\ufb50-\ufdff\ufe70-\ufefc]/g,
    (glyph) => glyph.normalize("NFKC")
  )
}

export function reflowPdfText({ items }: TextContent, viewport: PageViewport) {
  const lines: Line[] = []
  let current: Line | undefined
  let vertical = false
  for (const item of items) {
    if (!("str" in item)) continue
    const [x, y] = viewport.convertToViewportPoint(
      item.transform[4]!,
      item.transform[5]!
    )
    const height = Math.max(
      item.height,
      Math.hypot(item.transform[2]!, item.transform[3]!),
      1
    )
    if (item.dir === "ttb") vertical = true
    const shift = current ? Math.abs(y! - current.y) : 0
    const raisedInline =
      current &&
      height < 0.8 * current.height &&
      shift <= 0.75 * current.height &&
      x! > current.x
    if (item.str.trim()) {
      if (
        !current ||
        (!vertical &&
          !raisedInline &&
          shift > Math.max(height, current.height) * 0.45)
      ) {
        current = { runs: [], x: x!, y: y!, height, rtl: item.dir === "rtl" }
        lines.push(current)
      }
      current.height = Math.max(current.height, height)
    }
    if (item.str)
      current?.runs.push({ text: item.str, x: x!, rtl: item.dir === "rtl" })
    if (item.hasEOL) current = undefined
  }
  if (!lines.length) return []

  if (!vertical) lines.sort((a, b) => a.y - b.y)
  const heights = lines.map((line) => line.height).sort((a, b) => a - b)
  const bodyHeight = heights[Math.floor((heights.length - 1) / 2)]!
  const blocks: PdfReflowBlock[] = []
  let previous: Line | undefined
  for (const line of lines) {
    line.rtl = line.runs.find(({ text }) => /\p{L}/u.test(text))?.rtl ?? false
    const text = normalizeGlyphs(lineText(line))
    const heading = line.height > bodyHeight * 1.35 && text.length <= 140
    const last = blocks.at(-1)
    if (
      !last ||
      heading ||
      last.kind === "heading" ||
      (previous &&
        !vertical &&
        (line.y - previous.y > bodyHeight * 1.7 ||
          line.rtl !== previous.rtl ||
          (!line.rtl && line.x - previous.x > bodyHeight)))
    )
      blocks.push({ kind: heading ? "heading" : "paragraph", text })
    else last.text = joinWrappedText(last.text, text)
    previous = line
  }
  return blocks
}

export function reflowRecognizedText(text: string): PdfReflowBlock[] {
  return text
    .trim()
    .split(/\r?\n\s*\r?\n/)
    .map((paragraph) =>
      paragraph
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean)
        .reduce(
          (left, right) => (left ? joinWrappedText(left, right) : right),
          ""
        )
    )
    .filter(Boolean)
    .map((text) => ({ kind: "paragraph", text }))
}
