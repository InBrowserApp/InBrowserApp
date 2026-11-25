import type { MsDocParseResult, ParagraphBlock } from "@file-viewer/doc"

/** Retain available paragraph semantics through the engine's HTML renderer. */
export function markParagraphs(parsed: MsDocParseResult) {
  let approximatedLists = false
  function mark(paragraph: ParagraphBlock) {
    const state = paragraph.paraState
    const outline = state.sprm_2640
    if (outline instanceof Uint8Array && outline[0]! < 9) {
      paragraph.styleName = `inbrowser heading ${outline[0]! + 1}`
    } else if (state.listId && state.listId > 0 && state.listLevel != null) {
      const kind = /list number/i.test(paragraph.styleName)
        ? "ordered"
        : "bullet"
      paragraph.styleName = `inbrowser list ${state.listLevel} ${kind}`
      approximatedLists = true
    }
  }
  for (const block of parsed.blocks) {
    if (block.type === "paragraph") mark(block)
    if (block.type === "table")
      for (const row of block.rows)
        for (const cell of row.cells)
          for (const paragraph of cell.paragraphs) mark(paragraph)
  }
  return approximatedLists
}

export function structureLists(doc: Document, main: HTMLElement) {
  for (const parent of [main, ...main.querySelectorAll<HTMLElement>("td,th")]) {
    let previous: Element | null = null
    let list: HTMLOListElement | HTMLUListElement | null = null
    let key = ""
    for (const block of Array.from(parent.children)) {
      const match = /msdoc-style-inbrowser-list-(\d+)-(ordered|bullet)/.exec(
        block.className
      )
      if (!match) {
        list = null
        previous = block
        continue
      }
      if (!list || key !== match[0] || previous?.nextElementSibling !== block) {
        list = doc.createElement(match[2] === "ordered" ? "ol" : "ul")
        list.style.paddingInlineStart = `${1.5 + Number(match[1]) * 1.5}em`
        block.before(list)
        key = match[0]
      }
      const item = doc.createElement("li")
      list.append(item)
      item.append(block)
      previous = list
    }
  }
}
