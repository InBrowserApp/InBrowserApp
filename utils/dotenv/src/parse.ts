import { serializeDotenv, toDotenvObject } from './serialize'
import type {
  DotenvDiagnostic,
  DotenvDiagnosticCode,
  DotenvDuplicateStrategy,
  DotenvEntry,
  DotenvLine,
  DotenvParserMode,
  ParseDotenvOptions,
  ParseDotenvResult,
} from './types'

const KEY_PATTERN = /^[A-Za-z_][A-Za-z0-9_]*$/

type ParsedLineResult =
  | { type: 'empty'; line: DotenvLine }
  | { type: 'comment'; line: DotenvLine }
  | { type: 'entry'; line: DotenvLine; entry: DotenvEntry }
  | { type: 'invalid'; line: DotenvLine; diagnostic: DotenvDiagnostic }

export function parseDotenv(input: string, options: ParseDotenvOptions = {}): ParseDotenvResult {
  const mode = options.mode ?? 'compatible'
  const duplicateStrategy = options.duplicateStrategy ?? 'last-wins'

  if (!input) {
    return {
      lines: [],
      entries: [],
      diagnostics: [],
      object: {},
      stats: {
        entryCount: 0,
        resolvedCount: 0,
        duplicateCount: 0,
        invalidLineCount: 0,
        commentCount: 0,
        emptyLineCount: 0,
      },
    }
  }

  const normalized = input.replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n')
  const rows = normalized.split('\n')
  const lines: DotenvLine[] = []
  const entries: DotenvEntry[] = []
  const diagnostics: DotenvDiagnostic[] = []
  let commentCount = 0
  let emptyLineCount = 0
  let invalidLineCount = 0

  for (const [index, raw] of rows.entries()) {
    const lineNumber = index + 1
    const parsed = parseLine(raw, lineNumber, mode)
    lines.push(parsed.line)

    if (parsed.type === 'comment') {
      commentCount += 1
      continue
    }

    if (parsed.type === 'empty') {
      emptyLineCount += 1
      continue
    }

    if (parsed.type === 'invalid') {
      invalidLineCount += 1
      diagnostics.push(parsed.diagnostic)
      continue
    }

    entries.push(parsed.entry)
  }

  const duplicateCount = markDuplicates(entries, duplicateStrategy, diagnostics, lines)

  return {
    lines,
    entries,
    diagnostics: diagnostics.sort((left, right) => left.line - right.line),
    object: toDotenvObject(entries),
    stats: {
      entryCount: entries.length,
      resolvedCount: entries.filter((entry) => entry.active).length,
      duplicateCount,
      invalidLineCount,
      commentCount,
      emptyLineCount,
    },
  }
}

export function parseDotenvToJson(input: string, options: ParseDotenvOptions = {}): string {
  return JSON.stringify(parseDotenv(input, options).object, null, 2)
}

export function normalizeDotenv(input: string, options: ParseDotenvOptions = {}): string {
  return serializeDotenv(parseDotenv(input, options).entries)
}

function parseLine(raw: string, lineNumber: number, mode: DotenvParserMode): ParsedLineResult {
  const trimmed = raw.trim()

  if (!trimmed) {
    return { type: 'empty', line: { type: 'empty', line: lineNumber, raw } }
  }

  if (raw.trimStart().startsWith('#')) {
    return {
      type: 'comment',
      line: { type: 'comment', line: lineNumber, raw, comment: raw.trimStart().slice(1).trim() },
    }
  }

  if (mode === 'strict' && raw !== raw.trimStart()) {
    return invalidLine(
      raw,
      lineNumber,
      'unexpected_whitespace',
      'Leading whitespace is not allowed.',
    )
  }

  let body = raw.trimStart()
  let hasExport = false

  if (/^export\b/.test(body)) {
    if (mode === 'strict') {
      return invalidLine(
        raw,
        lineNumber,
        'unsupported_export',
        'Strict mode does not allow export.',
      )
    }

    body = body.slice(6)
    if (!body.trim()) {
      return invalidLine(raw, lineNumber, 'empty_export', 'Export is missing a variable name.')
    }

    hasExport = true
    body = body.trimStart()
  }

  const equalsIndex = body.indexOf('=')
  if (equalsIndex === -1) {
    return invalidLine(raw, lineNumber, 'missing_equals', 'Expected "=" in assignment.')
  }

  const keySource = body.slice(0, equalsIndex)
  const valueSource = body.slice(equalsIndex + 1)

  if (mode === 'strict' && keySource !== keySource.trim()) {
    return invalidLine(
      raw,
      lineNumber,
      'unexpected_whitespace',
      'Strict mode does not allow spaces around the key.',
    )
  }

  if (mode === 'strict' && valueSource !== valueSource.trimStart()) {
    return invalidLine(
      raw,
      lineNumber,
      'unexpected_whitespace',
      'Strict mode does not allow spaces after "=".',
    )
  }

  const key = keySource.trim()
  if (!key) {
    return invalidLine(raw, lineNumber, 'blank_key', 'Variable name cannot be empty.')
  }

  if (!KEY_PATTERN.test(key)) {
    return invalidLine(
      raw,
      lineNumber,
      'invalid_key',
      'Variable names must use letters, numbers, and underscores.',
    )
  }

  const parsedValue = parseValue(valueSource, mode)
  if ('error' in parsedValue) {
    return invalidLine(raw, lineNumber, parsedValue.code, parsedValue.error)
  }

  const entry: DotenvEntry = {
    line: lineNumber,
    key,
    value: parsedValue.value,
    quote: parsedValue.quote,
    export: hasExport,
    inlineComment: parsedValue.inlineComment,
    duplicated: false,
    active: true,
  }

  return {
    type: 'entry',
    entry,
    line: { type: 'entry', raw, ...entry },
  }
}

function parseValue(
  rawValue: string,
  mode: DotenvParserMode,
):
  | { value: string; quote: DotenvEntry['quote']; inlineComment: string | null }
  | {
      error: string
      code: Extract<
        DotenvDiagnosticCode,
        'unclosed_quote' | 'unexpected_content' | 'unexpected_whitespace'
      >
    } {
  const valueText = mode === 'compatible' ? rawValue.trimStart() : rawValue

  if (valueText.startsWith("'")) {
    const closingIndex = valueText.indexOf("'", 1)
    if (closingIndex === -1) {
      return { code: 'unclosed_quote', error: 'Single-quoted values must close on the same line.' }
    }

    const remainder = valueText.slice(closingIndex + 1)
    const remainderResult = parseQuotedRemainder(remainder)
    if ('error' in remainderResult) return remainderResult

    return {
      value: valueText.slice(1, closingIndex),
      quote: 'single',
      inlineComment: remainderResult.inlineComment,
    }
  }

  if (valueText.startsWith('"')) {
    const closingIndex = findDoubleQuoteEnd(valueText)
    if (closingIndex === -1) {
      return { code: 'unclosed_quote', error: 'Double-quoted values must close on the same line.' }
    }

    const decoded = decodeDoubleQuotedValue(valueText.slice(1, closingIndex))
    const remainder = valueText.slice(closingIndex + 1)
    const remainderResult = parseQuotedRemainder(remainder)
    if ('error' in remainderResult) return remainderResult

    return {
      value: decoded,
      quote: 'double',
      inlineComment: remainderResult.inlineComment,
    }
  }

  const commentIndex = findInlineCommentStart(valueText)
  const beforeComment = commentIndex === -1 ? valueText : valueText.slice(0, commentIndex)
  const inlineComment = commentIndex === -1 ? null : valueText.slice(commentIndex + 1).trim()

  if (mode === 'strict' && beforeComment !== beforeComment.trimEnd()) {
    return {
      code: 'unexpected_whitespace',
      error: 'Strict mode does not allow trailing spaces in bare values.',
    }
  }

  return {
    value: beforeComment.trimEnd(),
    quote: 'none',
    inlineComment,
  }
}

function parseQuotedRemainder(
  remainder: string,
):
  | { inlineComment: string | null }
  | { error: string; code: Extract<DotenvDiagnosticCode, 'unexpected_content'> } {
  if (!remainder.trim()) {
    return { inlineComment: null }
  }

  const trimmed = remainder.trimStart()
  if (!trimmed.startsWith('#')) {
    return { code: 'unexpected_content', error: 'Unexpected content after a quoted value.' }
  }

  return { inlineComment: trimmed.slice(1).trim() }
}

function findInlineCommentStart(value: string): number {
  for (let index = 0; index < value.length; index += 1) {
    if (value[index] !== '#') continue
    if (index === 0) continue
    if (/\s/.test(value[index - 1] ?? '')) return index
  }

  return -1
}

function findDoubleQuoteEnd(value: string): number {
  let escaped = false

  for (let index = 1; index < value.length; index += 1) {
    const character = value[index]

    if (escaped) {
      escaped = false
      continue
    }

    if (character === '\\') {
      escaped = true
      continue
    }

    if (character === '"') return index
  }

  return -1
}

function decodeDoubleQuotedValue(value: string): string {
  let output = ''
  let escaped = false

  for (const character of value) {
    if (!escaped) {
      if (character === '\\') {
        escaped = true
        continue
      }

      output += character
      continue
    }

    escaped = false
    switch (character) {
      case 'n':
        output += '\n'
        break
      case 'r':
        output += '\r'
        break
      case 't':
        output += '\t'
        break
      case '"':
        output += '"'
        break
      case '\\':
        output += '\\'
        break
      default:
        output += character
        break
    }
  }

  if (escaped) {
    output += '\\'
  }

  return output
}

function invalidLine(
  raw: string,
  lineNumber: number,
  code: Exclude<DotenvDiagnosticCode, 'duplicate_key'>,
  message: string,
): ParsedLineResult {
  return {
    type: 'invalid',
    line: { type: 'invalid', line: lineNumber, raw, code, message },
    diagnostic: { line: lineNumber, code, severity: 'error', message },
  }
}

function markDuplicates(
  entries: DotenvEntry[],
  duplicateStrategy: DotenvDuplicateStrategy,
  diagnostics: DotenvDiagnostic[],
  lines: DotenvLine[],
): number {
  const grouped = new Map<string, number[]>()

  for (const [index, entry] of entries.entries()) {
    const indexes = grouped.get(entry.key) ?? []
    indexes.push(index)
    grouped.set(entry.key, indexes)
  }

  let duplicateCount = 0

  for (const [key, indexes] of grouped.entries()) {
    if (indexes.length < 2) continue

    const activeIndex =
      duplicateStrategy === 'last-wins' ? indexes[indexes.length - 1]! : indexes[0]!

    for (const index of indexes) {
      const entry = entries[index]
      if (!entry) continue

      entry.duplicated = true
      entry.active = index === activeIndex

      const line = lines.find((item) => item.line === entry.line)
      if (line?.type === 'entry') {
        line.duplicated = entry.duplicated
        line.active = entry.active
      }

      if (entry.active) continue

      duplicateCount += 1
      diagnostics.push({
        line: entry.line,
        code: 'duplicate_key',
        severity: 'warning',
        key,
        message:
          duplicateStrategy === 'last-wins'
            ? `Duplicate key "${key}". A later value overrides this entry.`
            : `Duplicate key "${key}". An earlier value keeps precedence over this entry.`,
      })
    }
  }

  return duplicateCount
}
