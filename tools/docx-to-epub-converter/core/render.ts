import type {
  BodyElement,
  DocParagraph,
  DocRun,
  DocTable,
} from "@silurus/ooxml/docx"

type ImageRun = Extract<DocRun, { type: "image" }>
type Note = { id: string; label: string }
export type RenderContext = {
  doc: Document
  signal: AbortSignal
  image: (run: ImageRun) => Promise<string | null>
  note: (kind: string, id: string) => Note | undefined
  imageUnavailable: string
  anchors: Set<string>
  missing: boolean
}

function headingLevel(p: DocParagraph) {
  if (p.outlineLevel !== undefined && p.outlineLevel >= 0 && p.outlineLevel < 9)
    return Math.min(p.outlineLevel + 1, 6)
  const style = /^Heading([1-9])$/i.exec(p.styleId ?? "")
  return style ? Math.min(Number(style[1]), 6) : 0
}

function bookmark(name: string) {
  const bytes = new TextEncoder().encode(name)
  return `word-bookmark-${Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("")}`
}

function inlineText(
  doc: Document,
  run: Extract<DocRun, { type: "text" | "field" }>
) {
  const text = run.type === "field" ? run.fallbackText : run.text
  let result: Node = doc.createTextNode(text)
  for (const tag of [
    run.bold && "strong",
    run.italic && "em",
    run.underline && "u",
    run.strikethrough && "s",
    run.vertAlign === "super" && "sup",
    run.vertAlign === "sub" && "sub",
  ]) {
    if (!tag) continue
    const wrapper = doc.createElement(tag)
    wrapper.append(result)
    result = wrapper
  }
  if (run.type === "text") {
    const external = run.hyperlink?.trim()
    const anchor =
      run.hyperlinkAnchor ||
      (external?.startsWith("#") ? external.slice(1) : "")
    const href = anchor ? `#${bookmark(anchor)}` : external
    if (href && /^(?:#|https?:|mailto:)/i.test(href)) {
      const link = doc.createElement("a")
      link.setAttribute("href", href)
      link.append(result)
      return link
    }
  }
  return result
}

async function paragraph(
  node: HTMLElement,
  p: DocParagraph,
  ctx: RenderContext
) {
  const { doc } = ctx
  if (p.bidi) node.dir = "rtl"
  for (const name of p.bookmarks || []) {
    const id = bookmark(name)
    if (ctx.anchors.has(id)) continue
    ctx.anchors.add(id)
    const anchor = doc.createElement("span")
    anchor.id = id
    node.append(anchor)
  }
  for (const run of p.runs) {
    ctx.signal.throwIfAborted()
    if (run.revision?.kind === "deletion" || run.revision?.kind === "moveFrom")
      continue
    switch (run.type) {
      case "text":
      case "field": {
        const ref = run.type === "text" ? run.noteRef : undefined
        const note = ref && ctx.note(ref.kind, ref.id)
        if (note) {
          const link = doc.createElement("a")
          link.href = `#${note.id}`
          const label = doc.createElement("sup")
          label.textContent = note.label
          link.append(label)
          node.append(link)
        } else node.append(inlineText(doc, run))
        break
      }
      case "image": {
        const src = await ctx.image(run)
        if (src) {
          const image = doc.createElement("img")
          image.src = src
          image.alt = ""
          node.append(image)
        } else {
          ctx.missing = true
          node.append(ctx.imageUnavailable)
        }
        break
      }
      case "break":
        if (run.breakType === "line") node.append(doc.createElement("br"))
        break
      case "ptab":
        node.append(" ")
        break
      case "shape": {
        const text =
          run.textBlocks
            ?.map((block) => block.text)
            .join(" ")
            .trim() || run.textPath?.string
        if (text) node.append(text)
        ctx.missing = true
        break
      }
      case "chart":
      case "math":
        ctx.missing = true
        break
    }
  }
}

async function table(value: DocTable, ctx: RenderContext) {
  const result = ctx.doc.createElement("table")
  const body = ctx.doc.createElement("tbody")
  result.append(body)
  let merges = new Map<number, HTMLTableCellElement>()
  for (const row of value.rows) {
    const tr = ctx.doc.createElement("tr")
    const next = new Map<number, HTMLTableCellElement>()
    let column = row.gridBefore || 0
    if (column) {
      const blank = ctx.doc.createElement("td")
      blank.colSpan = column
      tr.append(blank)
    }
    for (const cell of row.cells) {
      const start = column
      column += cell.colSpan
      const previous = merges.get(start)
      if (cell.vMerge === false && previous) {
        previous.rowSpan++
        next.set(start, previous)
        continue
      }
      const tag = row.isHeader ? "th" : "td"
      const td = ctx.doc.createElement(tag)
      if (cell.colSpan > 1) td.colSpan = cell.colSpan
      await renderBlocks(td, cell.content, ctx, false)
      tr.append(td)
      if (cell.vMerge === true) next.set(start, td)
    }
    if (row.gridAfter) {
      const blank = ctx.doc.createElement("td")
      blank.colSpan = row.gridAfter
      tr.append(blank)
    }
    merges = next
    body.append(tr)
  }
  return result
}

type List = { depth: number; id: number; element: HTMLElement }
const counters: Record<string, string> = {
  lowerLetter: "a",
  upperLetter: "A",
  lowerRoman: "i",
  upperRoman: "I",
}

function listItem(root: HTMLElement, p: DocParagraph, lists: List[]) {
  const number = p.numbering!
  const style = /^List(?:Bullet|Number)([2-9])$/i.exec(p.styleId ?? "")
  const depth = Math.max(number.level, style ? Number(style[1]) - 1 : 0)
  while (lists.length && lists.at(-1)!.depth > depth) lists.pop()
  let list = lists.at(-1)
  if (list?.depth === depth && list.id !== number.numId) {
    lists.pop()
    list = lists.at(-1)
  }
  const doc = root.ownerDocument
  if (list?.depth !== depth) {
    const element = doc.createElement(number.format === "bullet" ? "ul" : "ol")
    const counter = counters[number.format]
    if (counter) element.setAttribute("type", counter)
    const parent = list?.element.lastElementChild ?? root
    parent.append(element)
    list = { id: number.numId, depth, element }
    lists.push(list)
  }
  const item = doc.createElement("li")
  const value = /^\d{1,9}(?:[.)]|$)/.exec(number.text)
  if (value && list.element.localName === "ol")
    item.value = Number.parseInt(value[0], 10)
  list.element.append(item)
  return item
}

export async function renderBlocks(
  root: HTMLElement,
  blocks: BodyElement[],
  ctx: RenderContext,
  headings = true
) {
  const lists: List[] = []
  for (const [index, block] of blocks.entries()) {
    ctx.signal.throwIfAborted()
    if (index > 0 && index % 64 === 0)
      await new Promise<void>((resolve) => setTimeout(resolve, 0))
    if (block.type === "table") {
      lists.length = 0
      root.append(await table(block, ctx))
    } else if (block.type === "paragraph") {
      const level = headings ? headingLevel(block) : 0
      if (!level && block.numbering) {
        await paragraph(listItem(root, block, lists), block, ctx)
        continue
      }
      lists.length = 0
      const node = ctx.doc.createElement(level ? `h${level}` : "p")
      await paragraph(node, block, ctx)
      if (node.childNodes.length) root.append(node)
    }
  }
}
