import { attr, child, children, is, R } from "./xml"
import type { Element } from "./xml"
import { resolvePath } from "./archive"
import type { Part } from "./archive"
import type { Labels } from "./types"
import { bullet, paragraphLevel, paragraphProperties } from "./styles"
import type { TextStyle } from "./styles"

export type Context = {
  labels: Labels
  hasText: boolean
  slides: Map<string, number>
}
export function escapeText(text: string): string {
  return text
    .replace(/\r\n?/g, "\n")
    .replace(/&/g, "&amp;")
    .replace(/[\\`*_{}[\]<>#!|~+\-=.()]/g, "\\$&")
}
function literal(text: string, context: Context): string {
  if (text.trim()) context.hasText = true
  return escapeText(text).replace(/\n/g, "<br>")
}
type Run = {
  text: string
  bold: boolean
  italic: boolean
  strike: boolean
  link?: string
}
function runStyle(properties: Element[], key: string): string | undefined {
  return properties
    .map((node) => attr(node, key))
    .find((value) => value !== undefined)
}
function linked(
  text: string,
  id: string,
  part: Part,
  context: Context
): string {
  const rel = part.relationships.get(id)
  if (!rel) throw new Error("invalid")
  if (rel.external) {
    if (!/^(https?:|mailto:|ftp:)/i.test(rel.target)) return text
    const url = rel.target.replace(/[\s<>\\|\p{Cc}]/gu, (value) =>
      encodeURIComponent(value)
    )
    return `[${text}](<${url}>)`
  }
  if (rel.type !== "slide") return text
  const slide = context.slides.get(resolvePath(part.path, rel.target))
  return slide ? `[${text}](#slide-${slide})` : text
}
function render(run: Run, part: Part, context: Context): string {
  let text = literal(run.text, context)
  // Known inline tags avoid delimiter ambiguity across adjacent formatted runs.
  if (text.trim()) {
    if (run.bold) text = `<strong>${text}</strong>`
    if (run.italic) text = `<em>${text}</em>`
    if (run.strike) text = `<del>${text}</del>`
  }
  return run.link ? linked(text, run.link, part, context) : text
}
function inline(
  paragraph: Element,
  properties: Element[],
  part: Part,
  context: Context
): string {
  const output: string[] = []
  let previous: Run | undefined
  const flush = () => {
    if (previous) output.push(render(previous, part, context))
    previous = undefined
  }
  for (const node of children(paragraph)) {
    if (is(node, "pPr") || is(node, "endParaRPr")) continue
    if (is(node, "br")) {
      flush()
      output.push("<br>")
      continue
    }
    if (is(node, "r") || is(node, "fld")) {
      const own = child(node, "rPr")
      const styles = [
        own,
        ...properties.map((item) => child(item, "defRPr")),
      ].filter((item): item is Element => Boolean(item))
      const link = styles
        .map((item) => attr(child(item, "hlinkClick"), "id", R))
        .find(Boolean)
      const run: Run = {
        text: child(node, "t")?.text ?? "",
        bold: ["1", "true"].includes(runStyle(styles, "b") ?? ""),
        italic: ["1", "true"].includes(runStyle(styles, "i") ?? ""),
        strike: ["sngStrike", "dblStrike"].includes(
          runStyle(styles, "strike") ?? ""
        ),
        link,
      }
      if (
        previous &&
        previous.bold === run.bold &&
        previous.italic === run.italic &&
        previous.strike === run.strike &&
        previous.link === run.link
      )
        previous.text += run.text
      else {
        flush()
        previous = run
      }
    } else {
      flush()
      output.push(
        escapeText(
          context.labels[
            node.name === "m" ||
            node.name === "oMath" ||
            node.name === "oMathPara"
              ? "equation"
              : "object"
          ]
        )
      )
    }
  }
  flush()
  return output
    .join("")
    .replace(/^[ \t]+/, (value) =>
      value.replace(/ /g, "&#32;").replace(/\t/g, "&#9;")
    )
}

export function paragraphs(
  body: Element | undefined,
  part: Part,
  context: Context,
  style: TextStyle = {},
  cell = false
): string {
  if (!body) return ""
  const output: string[] = []
  const levels: number[] = []
  const counters = new Map<number, number>()
  const widths = new Map<number, number>()
  const kinds = new Map<number, string>()
  let inList = false
  for (const paragraph of children(body).filter((node) => is(node, "p"))) {
    const properties = paragraphProperties(paragraph, body, style)
    const value = inline(paragraph, properties, part, context)
    if (!value.trim()) continue
    const marker = bullet(properties)
    if (!marker || cell) {
      if (inList) {
        levels.length = 0
        counters.clear()
        widths.clear()
        kinds.clear()
      }
      output.push(value)
      inList = false
      continue
    }
    const level = paragraphLevel(paragraph)
    while (levels.length && levels.at(-1)! > level) {
      const removed = levels.pop()!
      counters.delete(removed)
      widths.delete(removed)
      kinds.delete(removed)
    }
    if (levels.at(-1) !== level) levels.push(level)
    if (kinds.get(level) !== marker.name) counters.delete(level)
    kinds.set(level, marker.name)
    const start = attr(marker, "startAt")
    const number = counters.get(level) ?? Number(start ?? 1)
    if (!Number.isInteger(number) || number < 1) throw new Error("invalid")
    const prefix = marker.name === "buAutoNum" ? `${number}. ` : "- "
    counters.set(level, number + 1)
    widths.set(level, Math.max(4, prefix.length))
    const indent = levels
      .slice(0, -1)
      .reduce((sum, item) => sum + widths.get(item)!, 0)
    const line = `${" ".repeat(indent)}${prefix}${value}`
    if (inList) output[output.length - 1] += `\n${line}`
    else output.push(line)
    inList = true
  }
  return output.join(cell ? "<br>" : "\n\n")
}
