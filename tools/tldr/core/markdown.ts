import { marked, type Token, type Tokens } from "marked"
import { preparePreview } from "@workspace/markdown/sanitize"

type ExamplePart = Readonly<{
  text: string
  kind: "text" | "value" | "options"
}>

type Section =
  | { type: "markdown"; html: string }
  | { type: "example"; command: string; parts: readonly ExamplePart[] }

function unescapeBraces(text: string) {
  return text.replace(/\\([{}])\\\1/g, "$1$1")
}

function exampleParts(source: string): ExamplePart[] {
  const parts: ExamplePart[] = []
  let offset = 0

  function appendText(end: number) {
    if (end > offset) {
      parts.push({
        text: unescapeBraces(source.slice(offset, end)),
        kind: "text",
      })
    }
  }

  for (const match of source.matchAll(/\{\{(.+?)\}\}(?!\})/g)) {
    const start = match.index
    appendText(start)
    const text = unescapeBraces(match[1]!)
    parts.push({
      text,
      kind: /^\[.+\|.+\]$/.test(text) ? "options" : "value",
    })
    offset = start + match[0].length
  }
  appendText(source.length)
  return parts
}

function plainCommand(parts: readonly ExamplePart[]) {
  return parts.map(({ text }) => text).join("")
}

function example(token: Token) {
  if (token.type === "code") return (token as Tokens.Code).text
  if (token.type === "paragraph") {
    const [first, ...tail] = (token as Tokens.Paragraph).tokens
    if (first?.type === "codespan" && !tail.length)
      return (first as Tokens.Codespan).text
  }
  return undefined
}

export function renderPage(markdown: string): Section[] {
  const renderer = new marked.Renderer()
  const heading = renderer.heading.bind(renderer)
  renderer.heading = (token) =>
    heading({ ...token, depth: Math.min(6, token.depth + 1) })
  const codespan = renderer.codespan.bind(renderer)
  renderer.codespan = (token) =>
    codespan({ ...token, text: plainCommand(exampleParts(token.text)) })

  const sections: Section[] = []
  let prose: Token[] = []

  function flush() {
    const { exportHtml } = preparePreview(marked.parser(prose, { renderer }))
    if (exportHtml) sections.push({ type: "markdown", html: exportHtml })
    prose = []
  }

  for (const token of marked.lexer(markdown)) {
    const command = example(token)
    if (command === undefined) prose.push(token)
    else {
      flush()
      const parts = exampleParts(command)
      sections.push({ type: "example", command: plainCommand(parts), parts })
    }
  }
  flush()
  return sections
}
