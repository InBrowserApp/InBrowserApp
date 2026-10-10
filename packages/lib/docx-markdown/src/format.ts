import type {
  BodyElement,
  DocxDocumentModel,
  HeadersFooters,
} from "@silurus/ooxml/docx"
import type { Labels } from "./types"
import { blocks } from "./blocks"
import { escapeText, identifier, sourceText } from "./inline"
import type { Context } from "./inline"

export function formatDocument(
  model: DocxDocumentModel,
  labels: Labels
): string {
  if (model.parseError) throw new Error("invalid")
  const context: Context = { model, labels, hasText: false, anchors: new Set() }
  const stories = (kind: "headers" | "footers") => {
    const groups: HeadersFooters[] = [model[kind]]
    for (const item of model.body)
      if (item.type === "sectionBreak" && item[kind]) groups.push(item[kind]!)
    return groups.flatMap((group) =>
      Object.values(group).flatMap((story) => (story ? [story.body] : []))
    )
  }
  const headers = stories("headers")
  const footers = stories("footers")
  function collectAnchors(body: BodyElement[]) {
    for (const element of body) {
      if (element.type === "paragraph")
        for (const id of element.bookmarks ?? []) context.anchors.add(id)
      if (element.type === "table")
        for (const row of element.rows)
          for (const cell of row.cells) collectAnchors(cell.content)
    }
  }
  for (const body of [
    model.body,
    ...headers,
    ...footers,
    ...(model.footnotes ?? []).map((note) => note.content),
    ...(model.endnotes ?? []).map((note) => note.content),
  ])
    collectAnchors(body)
  const sections = [blocks(model.body, context)]
  function section(title: string, content: string[]) {
    const values = content.filter(Boolean)
    if (values.length)
      sections.push(`## ${escapeText(title)}\n\n${values.join("\n\n")}`)
  }
  section(labels.headers, [
    ...new Set(headers.map((body) => blocks(body, context))),
  ])
  section(labels.footers, [
    ...new Set(footers.map((body) => blocks(body, context))),
  ])
  const definition = (id: string, text: string) =>
    `[^${id}]: ${text.replace(/\n/g, "\n    ")}`
  for (const kind of ["footnote", "endnote"] as const) {
    section(
      labels[`${kind}s`],
      (model[`${kind}s`] ?? []).map((note) =>
        definition(identifier(kind, note.id), blocks(note.content, context))
      )
    )
  }
  section(
    labels.comments,
    (model.comments ?? []).map((comment) => {
      const author = comment.author
        ? `${sourceText(comment.author, context)}: `
        : ""
      const parent = model.comments?.find(({ id }) => id === comment.parentId)
      const reply = parent
        ? `${escapeText(labels.replyTo)} [^${identifier("comment", parent.id)}]. `
        : ""
      return definition(
        identifier("comment", comment.id),
        author + reply + sourceText(comment.text, context)
      )
    })
  )
  if (!context.hasText) throw new Error("noText")
  return sections.filter(Boolean).join("\n\n") + "\n"
}
