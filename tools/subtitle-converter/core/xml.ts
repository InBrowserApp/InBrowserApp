import { SubtitleError, type Cue } from "./formats"
import { cleanMarkup, escapeXml } from "./text"
import { parseTime } from "./time"

function attribute(node: Element, name: string) {
  return Array.from(node.attributes).find(
    (attr) => attr.localName.split(":").pop() === name
  )?.value
}

function xmlText(node: Node, preserve = false): string {
  if (node.nodeType === 3)
    return escapeXml(
      preserve ? node.textContent! : node.textContent!.replace(/\s+/g, " ")
    )
  if (node.nodeType !== 1) return ""
  const element = node as Element
  if (element.localName === "br") return "\n"
  const space = attribute(element, "space")
  let text = Array.from(node.childNodes)
    .map((child) => xmlText(child, space ? space === "preserve" : preserve))
    .join("")
  const tags = [
    ["fontWeight", "bold", "b"],
    ["fontStyle", "italic", "i"],
    ["textDecoration", "underline", "u"],
  ] as const
  for (const [name, value, tag] of tags)
    if (attribute(element, name) === value) text = `<${tag}>${text}</${tag}>`
  return text
}

export function parseXml(text: string, fps: number): Cue[] {
  // Parse inert XML data. Parsed nodes are never inserted into the page.
  const doc = new DOMParser().parseFromString(text, "application/xml")
  if (doc.querySelector("parsererror")) throw new SubtitleError("invalid")
  const root = doc.documentElement
  if (root.localName === "transcript")
    return Array.from(root.getElementsByTagName("text")).map((node) => {
      const start = Number(node.getAttribute("start")) * 1000
      const dur = node.getAttribute("dur")
      if (!node.hasAttribute("start") || dur === null)
        throw new SubtitleError("invalid")
      return {
        start,
        end: start + Number(dur) * 1000,
        text: cleanMarkup(xmlText(node, true)),
      }
    })
  if (root.localName === "timedtext")
    return Array.from(root.getElementsByTagName("p")).map((node) => {
      if (!node.hasAttribute("t") || !node.hasAttribute("d"))
        throw new SubtitleError("invalid")
      const start = Number(node.getAttribute("t"))
      return {
        start,
        end: start + Number(node.getAttribute("d")),
        text: cleanMarkup(xmlText(node, true)),
      }
    })
  if (root.localName !== "tt") throw new SubtitleError("unsupported")
  const baseRate = Number(attribute(root, "frameRate") ?? fps)
  const multiplier = (attribute(root, "frameRateMultiplier") ?? "1 1")
    .split(/\s+/)
    .map(Number)
  fps = (baseRate * multiplier[0]!) / multiplier[1]!
  const tickRate = Number(
    attribute(root, "tickRate") ??
      (attribute(root, "frameRate")
        ? fps * Number(attribute(root, "subFrameRate") ?? 1)
        : 1)
  )
  if (
    !Number.isFinite(fps) ||
    fps <= 0 ||
    !Number.isFinite(tickRate) ||
    tickRate <= 0
  )
    throw new SubtitleError("timing")
  const cues: Cue[] = []
  function visit(node: Element, parentStart: number, parentEnd: number) {
    const start =
      parentStart +
      parseTime(`${attribute(node, "begin") ?? "0s"}`, fps, tickRate)
    const endAttr = attribute(node, "end")
    const duration = attribute(node, "dur")
    const end = Math.min(
      parentEnd,
      endAttr ? parentStart + parseTime(endAttr, fps, tickRate) : Infinity,
      duration ? start + parseTime(duration, fps, tickRate) : Infinity
    )
    if (node.localName === "p") {
      cues.push({ start, end, text: cleanMarkup(xmlText(node)) })
      return end
    }
    let cursor = start
    for (const child of Array.from(node.children)) {
      if (!["body", "div", "p"].includes(child.localName)) continue
      const childEnd = visit(
        child,
        attribute(node, "timeContainer") === "seq" ? cursor : start,
        end
      )
      cursor = childEnd
    }
    return Number.isFinite(end) ? end : cursor
  }
  visit(root, 0, Infinity)
  return cues
}

export function parseSami(text: string): Cue[] {
  const matches = [
    ...text.matchAll(
      /<sync\b[^>]*\bstart\s*=\s*["']?(\d+)["']?[^>]*>([\s\S]*?)(?=<sync\b|<\/body|<\/sami|$(?![\s\S]))/gi
    ),
  ]
  return matches.flatMap((match, index) => {
    const body = cleanMarkup(
      match[2]!.replace(/<\/p\s*>/gi, "\n").replace(/<p\b[^>]*>/gi, "\n")
    )
    const start = Number(match[1]!)
    return body
      ? [
          {
            start,
            end: matches[index + 1]
              ? Number(matches[index + 1]![1]!)
              : start + 2000,
            text: body,
          },
        ]
      : []
  })
}
