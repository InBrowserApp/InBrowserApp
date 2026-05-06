import hljs from "highlight.js/lib/core"

import {
  normalizeCode,
  type HighlightToken,
  type RenderMode,
} from "../core/tokens"
import { registerHighlightLanguages } from "./languages"

const highlighter = hljs.newInstance()

registerHighlightLanguages(highlighter)

const collectTokens = (
  node: Node,
  classes: readonly string[],
  out: HighlightToken[]
) => {
  if (node.nodeType === Node.TEXT_NODE) {
    const text = node.textContent ?? ""

    if (text.length > 0) {
      out.push({ text, classes })
    }

    return
  }

  if (node.nodeType !== Node.ELEMENT_NODE) {
    return
  }

  const element = node as HTMLElement
  const nextClasses =
    element.classList.length > 0
      ? [...classes, ...Array.from(element.classList)]
      : classes

  element.childNodes.forEach((child) => {
    collectTokens(child, nextClasses, out)
  })
}

const highlightCodeToTokens = (
  code: string,
  language: string,
  mode: RenderMode
): HighlightToken[] => {
  const normalized = normalizeCode(code)

  if (
    !normalized.trim() ||
    mode === "plain" ||
    typeof DOMParser === "undefined"
  ) {
    return [{ text: normalized, classes: [] }]
  }

  try {
    const result =
      language === "auto"
        ? highlighter.highlightAuto(normalized)
        : highlighter.highlight(normalized, { language })
    const doc = new DOMParser().parseFromString(result.value, "text/html")
    const tokens: HighlightToken[] = []

    doc.body.childNodes.forEach((node) => {
      collectTokens(node, [], tokens)
    })

    return tokens.length > 0 ? tokens : [{ text: normalized, classes: [] }]
  } catch {
    return [{ text: normalized, classes: [] }]
  }
}

export { highlightCodeToTokens }
