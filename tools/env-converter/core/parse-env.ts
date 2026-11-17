import type { Diagnostic, ParseResult } from "../types"

export const ENV_KEY = /^[A-Za-z_][A-Za-z0-9_]*$/

export function parseEnv(input: string): ParseResult {
  const lines = input.replace(/\r\n?/g, "\n").split("\n")
  const values: Record<string, string> = Object.create(null)
  const diagnostics: Diagnostic[] = []
  const firstLines = new Map<string, number>()

  for (let index = 0; index < lines.length; index++) {
    const line = index + 1
    const text = lines[index]!.trimStart()
    if (!text.trim() || text.startsWith("#")) continue
    const assignment = text.replace(/^export\s+/, "")
    const equals = assignment.indexOf("=")
    if (equals === -1) {
      diagnostics.push({ code: "assignment", severity: "error", line })
      continue
    }
    const key = assignment.slice(0, equals).trim()
    if (!ENV_KEY.test(key)) {
      diagnostics.push({ code: "invalidKey", severity: "error", line, key })
      continue
    }
    const raw = assignment.slice(equals + 1).trimStart()
    const quote = raw[0]
    let value: string
    if (quote === '"' || quote === "'" || quote === "`") {
      let content = raw.slice(1)
      let close = closingQuote(content, quote)
      while (close === -1 && index + 1 < lines.length) {
        content += `\n${lines[++index]}`
        close = closingQuote(content, quote)
      }
      if (close === -1) {
        diagnostics.push({
          code: "unclosedQuote",
          severity: "error",
          line,
          key,
          quote,
        })
        continue
      }
      const trailing = content.slice(close + 1).trim()
      if (trailing && !trailing.startsWith("#")) {
        diagnostics.push({ code: "trailingText", severity: "error", line, key })
        continue
      }
      value = content.slice(0, close)
      if (quote === '"')
        value = value.replace(/\\n/g, "\n").replace(/\\r/g, "\r")
    } else {
      value = raw.split("#", 1)[0]!.trim()
      if (/^[“”‘’]/.test(value)) {
        diagnostics.push({ code: "smartQuote", severity: "warning", line, key })
      }
    }
    const previousLine = firstLines.get(key)
    if (previousLine !== undefined) {
      diagnostics.push({
        code: "duplicate",
        severity: "warning",
        line,
        key,
        previousLine,
      })
    } else {
      firstLines.set(key, line)
    }
    values[key] = value
  }
  return { values, diagnostics }
}

function closingQuote(content: string, quote: string) {
  for (let index = 0; index < content.length; index++) {
    if (
      content[index] === "\\" &&
      content[index + 1] === quote &&
      content.indexOf(quote, index + 2) !== -1
    ) {
      index++
    } else if (content[index] === quote) {
      return index
    }
  }
  return -1
}
