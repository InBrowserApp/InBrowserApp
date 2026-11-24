import type { WorkflowDiagnostic } from "./protocol"

function attachLocations(source: string, diagnostics: WorkflowDiagnostic[]) {
  let offset = 0
  const lines = source.split("\n").map((text) => {
    const line = { text, start: offset }
    offset += text.length + 1
    return line
  })

  return diagnostics.map(({ line, column, ...detail }) => {
    const lineNumber = Math.max(1, line)
    const columnNumber = Math.max(1, column)
    const { text, start } = lines[lineNumber - 1] ?? {
      text: "",
      start: source.length,
    }
    const indent = Array.from(text)
      .slice(0, columnNumber - 1)
      .join("").length

    return {
      ...detail,
      location: {
        line: lineNumber,
        column: columnNumber,
        offset: start + indent,
      },
    }
  })
}

export { attachLocations }
