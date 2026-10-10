import { openArchive, resolvePath } from "./archive"
import type { Part, Archive } from "./archive"
import { attr, child, children, descendants, is, P, R } from "./xml"
import type { Element } from "./xml"
import { placeholder, shapeStyle } from "./styles"
import { escapeText, paragraphs } from "./text"
import type { Context } from "./text"
import type { Labels } from "./types"

function table(node: Element, part: Part, context: Context): string {
  const width = children(child(node, "tblGrid")).length
  const rows = children(node)
    .filter((item) => is(item, "tr"))
    .map((row) =>
      children(row)
        .filter((item) => is(item, "tc"))
        .map((cell) =>
          paragraphs(child(cell, "txBody"), part, context, {}, true)
        )
    )
  const columns = Math.max(width, ...rows.map((row) => row.length))
  if (!columns || !rows.length) return ""
  const line = (cells: string[]) =>
    `| ${Array.from({ length: columns }, (_, i) => cells[i] ?? "").join(" | ")} |`
  const firstRow = ["1", "true"].includes(
    attr(child(node, "tblPr"), "firstRow") ?? ""
  )
  return [
    line(firstRow ? rows.shift()! : []),
    line(Array<string>(columns).fill("---")),
    ...rows.map(line),
  ].join("\n")
}

function slideContent(
  part: Part,
  context: Context,
  archive: Archive,
  defaults: Element | undefined,
  notes = false
) {
  const layout = notes ? undefined : archive.related(part, "slideLayout")
  const master = layout ? archive.related(layout, "slideMaster") : undefined
  if (
    (layout && !is(layout.root, "sldLayout", P)) ||
    (master && !is(master.root, "sldMaster", P))
  )
    throw new Error("invalid")
  const content: string[] = []
  const titles: string[] = []
  const tree = child(child(part.root, "cSld", P), "spTree", P)
  if (!tree) throw new Error("invalid")
  const pending = children(tree).reverse()
  while (pending.length) {
    const node = pending.pop()!
    if (
      is(node, "nvGrpSpPr", P) ||
      is(node, "grpSpPr", P) ||
      is(node, "extLst", P)
    )
      continue
    if (is(node, "grpSp", P)) {
      pending.push(...children(node).reverse())
      continue
    }
    if (is(node, "sp", P)) {
      const style = shapeStyle(node, layout?.root, master?.root, defaults)
      const type =
        attr(placeholder(node), "type") ??
        (style.layout && attr(placeholder(style.layout), "type")) ??
        "obj"
      if (notes && ["sldImg", "sldNum", "dt", "ftr", "hdr"].includes(type))
        continue
      const text = paragraphs(child(node, "txBody", P), part, context, style)
      if (text) {
        if (!notes && ["title", "ctrTitle"].includes(type))
          titles.push(text.replace(/\n/g, "<br>"))
        else content.push(text)
      } else if (!placeholder(node))
        content.push(escapeText(context.labels.shape))
      continue
    }
    const tables = descendants(node, "tbl")
    if (tables.length) {
      content.push(...tables.map((item) => table(item, part, context)))
      continue
    }
    const contains = (name: string) => {
      const stack = [node]
      while (stack.length) {
        const item = stack.pop()!
        if (item.name === name) return true
        stack.push(...children(item))
      }
      return false
    }
    const kind = contains("oleObj")
      ? "object"
      : contains("videoFile") || contains("audioFile") || contains("media")
        ? "media"
        : contains("chart")
          ? "chart"
          : is(node, "pic", P)
            ? "image"
            : is(node, "cxnSp", P)
              ? "shape"
              : "object"
    content.push(escapeText(context.labels[kind]))
  }
  return {
    title: titles.join(" / "),
    text: content.filter(Boolean).join("\n\n"),
  }
}

export function formatPresentation(bytes: Uint8Array, labels: Labels): string {
  const archive = openArchive(bytes)
  const { main } = archive
  if (!is(main.root, "presentation", P)) throw new Error("invalid")
  const list = child(main.root, "sldIdLst", P)
  const slides = children(list)
    .filter((node) => is(node, "sldId", P))
    .map((node) => {
      const id = attr(node, "id", R)
      const rel = id && main.relationships.get(id)
      if (!rel || rel.type !== "slide" || rel.external)
        throw new Error("invalid")
      return resolvePath(main.path, rel.target)
    })
  if (!slides.length) throw new Error("noText")
  if (new Set(slides).size !== slides.length) throw new Error("invalid")
  const context: Context = {
    labels,
    hasText: false,
    slides: new Map(slides.map((path, i) => [path, i + 1])),
  }
  const defaults = child(main.root, "defaultTextStyle", P)
  const sections = slides.map((path, index) => {
    const part = archive.part(path)
    if (!is(part.root, "sld", P)) throw new Error("invalid")
    const { title, text } = slideContent(part, context, archive, defaults)
    const heading = escapeText(
      labels.slide.replace("{number}", String(index + 1))
    )
    const section = [
      `<a id="slide-${index + 1}"></a>`,
      `# ${heading}${title ? ` — ${title}` : ""}`,
    ]
    if (["0", "false"].includes(attr(part.root, "show") ?? ""))
      section.push(escapeText(labels.hidden))
    section.push(text)
    const notes = archive.related(part, "notesSlide")
    if (notes) {
      if (!is(notes.root, "notes", P)) throw new Error("invalid")
      const content = slideContent(notes, context, archive, undefined, true)
      if (content.text)
        section.push(`## ${escapeText(labels.notes)}\n\n${content.text}`)
    }
    return section.filter(Boolean).join("\n\n")
  })
  if (!context.hasText) throw new Error("noText")
  return sections.join("\n\n") + "\n"
}
