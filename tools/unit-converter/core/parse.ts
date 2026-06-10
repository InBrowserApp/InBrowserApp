// Lenient numeric input parsing.
//
// We keep the raw input string in component state and only format on output,
// which sidesteps the locale decimal/grouping ambiguity. Parsing accepts
// spaces and underscores as visual separators, treats a lone comma as a
// decimal point, and otherwise drops commas as thousands grouping.

type ParseResult =
  | Readonly<{ kind: "empty" }>
  | Readonly<{ kind: "invalid" }>
  | Readonly<{ kind: "valid"; value: number }>

const NUMERIC_PATTERN = /^[+-]?(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?$/

function parseNumber(raw: string): ParseResult {
  const trimmed = raw.trim()

  if (trimmed.length === 0) {
    return { kind: "empty" }
  }

  let normalized = trimmed.replace(/[\s_]/g, "")

  if (normalized.includes(",") && !normalized.includes(".")) {
    normalized = normalized.replace(/,/g, ".")
  } else {
    normalized = normalized.replace(/,/g, "")
  }

  if (!NUMERIC_PATTERN.test(normalized)) {
    return { kind: "invalid" }
  }

  const value = Number(normalized)

  if (!Number.isFinite(value)) {
    return { kind: "invalid" }
  }

  return { kind: "valid", value }
}

export { parseNumber }
export type { ParseResult }
