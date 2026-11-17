import type { Diagnostic, ParseResult } from "../types"

export const ENV_KEY = /^[A-Za-z_][A-Za-z0-9_]*$/

// Resolve escaped delimiters across the whole assignment, as dotenv does.
const QUOTED_VALUE =
  /^(['"`])((?:\\\1|(?!\1)[\s\S])*)\1[^\S\r\n]*(?:#[^\r\n]*)?(?=\n|$)/

export function parseEnv(input: string): ParseResult {
  const source = input.replace(/\r\n?/g, "\n")
  const lines = source.split("\n")
  let offset = 0
  const offsets = lines.map((text) => {
    const start = offset
    offset += text.length + 1
    return start
  })
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
      const remaining = source.slice(
        offsets[index]! + lines[index]!.length - raw.length
      )
      const match = QUOTED_VALUE.exec(remaining)
      if (!match) {
        const close = closingQuote(remaining.slice(1), quote)
        const consumed =
          close === -1 ? remaining : remaining.slice(0, close + 2)
        index += consumed.split("\n").length - 1
        diagnostics.push({
          code: close === -1 ? "unclosedQuote" : "trailingText",
          severity: "error",
          line,
          key,
          quote,
        })
        continue
      }
      index += match[0].split("\n").length - 1
      value = match[2]!
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
    if (content[index] === "\\" && content[index + 1] === quote) {
      index++
    } else if (content[index] === quote) {
      return index
    }
  }
  return -1
}
