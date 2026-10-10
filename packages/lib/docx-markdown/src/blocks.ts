import type { BodyElement, DocParagraph, DocTable } from "@silurus/ooxml/docx"
import { escapeText, identifier, inlineRuns } from "./inline"
import type { Context } from "./inline"

function paragraph(p: DocParagraph, context: Context, cell: boolean): string {
  const anchors = (p.bookmarks ?? [])
    .map((id) => `<a id="${identifier("bookmark", id)}"></a>`)
    .join("")
  const text = inlineRuns(p.runs, context, cell)
  const comments = new Set((p.commentMarks ?? []).map(({ id }) => id))
  const refs = [...comments]
    .filter((id) =>
      context.model.comments?.some((comment) => comment.id === id)
    )
    .map((id) => `[^${identifier("comment", id)}]`)
    .join("")
  return anchors + text + refs
}

function headingLevel(p: DocParagraph): number {
  // The parser exposes the resolved outline level even for custom styles.
  if (
    "outlineLevel" in p &&
    typeof p.outlineLevel === "number" &&
    p.outlineLevel >= 0 &&
    p.outlineLevel < 9
  )
    return Math.min(p.outlineLevel + 1, 6)
  const heading = /^Heading([1-9])$/i.exec(p.styleId ?? "")
  return heading ? Math.min(Number(heading[1]), 6) : 0
}

function table(value: DocTable, context: Context, nested: boolean): string {
  const rows = value.rows.map((row) => {
    const cells: string[] = Array.from(
      { length: row.gridBefore ?? 0 },
      () => ""
    )
    for (const cell of row.cells) {
      cells.push(blocks(cell.content, context, true))
      for (let i = 1; i < cell.colSpan; i++) cells.push("")
    }
    for (let i = 0; i < (row.gridAfter ?? 0); i++) cells.push("")
    return cells
  })
  if (nested) return rows.map((row) => row.join(" · ")).join("<br>")
  const width = rows.reduce((max, row) => Math.max(max, row.length), 0)
  if (!width) return ""
  if (!value.rows[0]?.isHeader) rows.unshift([])
  const line = (row: string[]) =>
    `| ${Array.from({ length: width }, (_, i) => row[i] ?? "").join(" | ")} |`
  return [
    line(rows[0]!),
    line(Array.from({ length: width }, () => "---")),
    ...rows.slice(1).map(line),
  ].join("\n")
}

export function blocks(
  body: BodyElement[],
  context: Context,
  cell = false
): string {
  const output: string[] = []
  let listLevels: number[] = []
  for (const element of body) {
    if (element.type === "table") {
      output.push(table(element, context, cell))
      listLevels = []
    } else if (element.type === "paragraph") {
      const text = paragraph(element, context, cell).trim()
      if (!text) continue
      const level = headingLevel(element)
      if (cell) {
        const label = element.numbering?.text
        output.push(label ? `${escapeText(label)} ${text}` : text)
      } else if (level) {
        output.push(`${"#".repeat(level)} ${text.replace(/  \n/g, " ")}`)
        listLevels = []
      } else if (element.numbering) {
        const num = element.numbering
        const styleLevel = /^List(?:Bullet|Number)([2-9])$/i.exec(
          element.styleId ?? ""
        )
        const depth = Math.max(
          num.level,
          styleLevel ? Number(styleLevel[1]) - 1 : 0
        )
        // Normalize depth when a fragment starts at a nested level.
        while (listLevels.length && listLevels.at(-1)! > depth) listLevels.pop()
        if (listLevels.at(-1) !== depth) listLevels.push(depth)
        const indent = "    ".repeat(listLevels.length - 1)
        const decimal = /^\d{1,9}[.)]$/.test(num.text)
        const marker = decimal ? `${parseInt(num.text, 10)}.` : "-"
        const label =
          num.format === "bullet" || decimal ? "" : `${escapeText(num.text)} `
        output.push(
          `${indent}${marker} ${label}${text.replace(/\n/g, `\n${indent}${" ".repeat(marker.length + 1)}`)}`
        )
      } else {
        output.push(text)
        listLevels = []
      }
    }
  }
  return output.filter(Boolean).join(cell ? "<br><br>" : "\n\n")
}
