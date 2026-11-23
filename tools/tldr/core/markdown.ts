import { marked, type Token, type Tokens } from "marked"
import { preparePreview } from "@workspace/markdown/sanitize"

type Section =
  | { type: "markdown"; html: string }
  | { type: "example"; command: string }

function unwrap(text: string) {
  return text
    .replace(/\{\{(.+?)\}\}(?!\})/g, "$1")
    .replace(/\\([{}])\\\1/g, "$1$1")
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
    codespan({ ...token, text: unwrap(token.text) })

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
      sections.push({ type: "example", command: unwrap(command) })
    }
  }
  flush()
  return sections
}
