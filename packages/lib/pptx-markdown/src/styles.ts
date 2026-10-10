import { attr, child, children, descendants, is, P } from "./xml"
import type { Element } from "./xml"

export function placeholder(shape: Element): Element | undefined {
  return descendants(shape, "ph", P)[0]
}
function placeholderShape(
  root: Element | undefined,
  source: Element,
  byType = false
): Element | undefined {
  const ph = placeholder(source)
  if (!ph) return
  const key = byType ? "type" : "idx"
  const fallback = byType ? "obj" : "0"
  return descendants(root, "sp", P).find((shape) => {
    const other = placeholder(shape)
    return (
      other && (attr(ph, key) ?? fallback) === (attr(other, key) ?? fallback)
    )
  })
}
export type TextStyle = {
  layout?: Element
  master?: Element
  masterStyle?: Element
  defaultStyle?: Element
}
function textBody(shape?: Element): Element | undefined {
  return child(shape, "txBody", P) ?? child(shape, "txBody")
}
function levelStyle(style: Element | undefined, level: number): Element[] {
  return [child(style, `lvl${level + 1}pPr`), child(style, "defPPr")].filter(
    (node): node is Element => Boolean(node)
  )
}
export function paragraphProperties(
  paragraph: Element,
  body: Element,
  style: TextStyle
): Element[] {
  const own = child(paragraph, "pPr")
  const level = paragraphLevel(paragraph)
  const inherited = (shape?: Element) => {
    const body = textBody(shape)
    const paragraph = children(body).find(
      (item) => is(item, "p") && paragraphLevel(item) === level
    )
    return [
      child(paragraph, "pPr"),
      ...levelStyle(child(body, "lstStyle"), level),
    ]
  }
  return [
    own,
    ...levelStyle(child(body, "lstStyle"), level),
    ...inherited(style.layout),
    ...inherited(style.master),
    ...levelStyle(style.masterStyle, level),
    ...levelStyle(style.defaultStyle, level),
  ].filter((node): node is Element => Boolean(node))
}
export function paragraphLevel(paragraph: Element): number {
  const level = Number(attr(child(paragraph, "pPr"), "lvl") ?? 0)
  if (!Number.isInteger(level) || level < 0 || level > 8)
    throw new Error("invalid")
  return level
}
export function bullet(properties: Element[]): Element | undefined {
  for (const item of properties) {
    const value = children(item).find(
      (node) =>
        node.uri === item.uri &&
        ["buNone", "buChar", "buAutoNum", "buBlip"].includes(node.name)
    )
    if (value) return value.name === "buNone" ? undefined : value
  }
  return undefined
}

export function shapeStyle(
  shape: Element,
  layout: Element | undefined,
  master: Element | undefined,
  defaults?: Element
): TextStyle {
  const inherited = placeholderShape(layout, shape)
  const parent = placeholderShape(master, inherited ?? shape, true)
  const type =
    attr(placeholder(shape), "type") ??
    (inherited && attr(placeholder(inherited), "type")) ??
    "obj"
  const title = type === "title" || type === "ctrTitle"
  const kind = title
    ? "titleStyle"
    : placeholder(shape) && ["body", "obj", "subTitle"].includes(type)
      ? "bodyStyle"
      : "otherStyle"
  return {
    layout: inherited,
    master: parent,
    masterStyle: child(child(master, "txStyles", P), kind, P),
    defaultStyle: defaults,
  }
}
