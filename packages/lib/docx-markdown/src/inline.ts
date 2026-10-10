import type { DocRun, DocxDocumentModel } from "@silurus/ooxml/docx"
import type { Labels } from "./types"

type InlineRun = Exclude<DocRun, { type: "field" }>

export type Context = {
  model: DocxDocumentModel
  labels: Labels
  hasText: boolean
  anchors: Set<string>
}

// Escape source syntax, including block markers. Only our generated Markdown
// and anchors are interpreted; source HTML and entity references stay literal.
export function escapeText(text: string): string {
  return text
    .replace(/\r\n?/g, "\n")
    .replace(/&/g, "&amp;")
    .replace(/[\\`*_{}[\]<>#!|~+\-=.()]/g, "\\$&")
}

export function identifier(kind: string, id: string): string {
  const bytes = new TextEncoder().encode(id)
  return `${kind}-${Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("")}`
}

export function sourceText(
  text: string,
  context: Context,
  cell = false
): string {
  if (text.trim()) context.hasText = true
  return escapeText(text).replace(/\n/g, cell ? "<br>" : "  \n")
}

function emphasis(
  value: string,
  run: { bold?: boolean; italic?: boolean; strikethrough?: boolean }
): string {
  if (!value.trim()) return value
  const before = value.match(/^\s*/)?.[0] ?? ""
  const after = value.match(/\s*$/)?.[0] ?? ""
  let text = value.trim()
  if (run.bold) text = `**${text}**`
  if (run.italic) text = `*${text}*`
  if (run.strikethrough) text = `<del>${text}</del>`
  return before + text + after
}

export function inlineRuns(
  runs: DocRun[],
  context: Context,
  cell: boolean
): string {
  const merged: InlineRun[] = []
  for (const source of runs) {
    if (["deletion", "moveFrom"].includes(source.revision?.kind ?? "")) continue
    const run: InlineRun =
      source.type === "field"
        ? ({
            ...source,
            type: "text",
            text: source.fallbackText,
            hyperlink: null,
          } as InlineRun)
        : source
    const previous = merged.at(-1)
    if (
      run.type === "text" &&
      previous?.type === "text" &&
      !run.noteRef &&
      !previous.noteRef &&
      Boolean(run.bold) === Boolean(previous.bold) &&
      Boolean(run.italic) === Boolean(previous.italic) &&
      Boolean(run.strikethrough) === Boolean(previous.strikethrough) &&
      (run.hyperlink ?? null) === (previous.hyperlink ?? null) &&
      (run.hyperlinkAnchor ?? null) === (previous.hyperlinkAnchor ?? null)
    ) {
      merged[merged.length - 1] = {
        ...previous,
        text: previous.text + run.text,
      }
    } else merged.push(run)
  }
  return merged.map((run) => inline(run, context, cell)).join("")
}

function link(text: string, url: string): string {
  // Keep unsupported schemes as visible text; never create an active URL.
  if (!/^(https?:|mailto:|ftp:)/i.test(url))
    return `${text} (${escapeText(url)})`
  const destination = url.replace(/[\s<>\\|\p{Cc}]/gu, (char) =>
    encodeURIComponent(char)
  )
  return `[${text}](<${destination}>)`
}

function inline(run: InlineRun, context: Context, cell: boolean): string {
  if (run.type === "text") {
    const note = run.noteRef
    if (note) {
      const notes =
        note.kind === "footnote"
          ? context.model.footnotes
          : note.kind === "endnote"
            ? context.model.endnotes
            : undefined
      if (notes?.some(({ id }) => id === note.id))
        return `[^${identifier(note.kind, note.id)}]`
    }
    const text = emphasis(sourceText(run.text, context, cell), run)
    if (run.hyperlink) return link(text, run.hyperlink)
    if (run.hyperlinkAnchor && context.anchors.has(run.hyperlinkAnchor))
      return `[${text}](#${identifier("bookmark", run.hyperlinkAnchor)})`
    return text
  }
  if (run.type === "ptab") return " "
  if (run.type === "break") return cell ? "<br>" : "  \n"
  if (run.type === "anchorHost") return ""
  if (run.type === "shape") {
    const text =
      run.textBlocks
        ?.map((block) => sourceText(block.text, context, cell))
        .join(cell ? "<br>" : "  \n") ||
      (run.textPath ? sourceText(run.textPath.string, context, cell) : "")
    return text || escapeText(context.labels.shape)
  }
  return escapeText(context.labels[run.type === "math" ? "equation" : run.type])
}
