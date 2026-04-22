import { diffArrays, diffWordsWithSpace } from "diff"

type TextDiffCompareOptions = Readonly<{
  ignoreCase: boolean
  ignoreWhitespace: boolean
}>

type DiffTokenKind = "equal" | "add" | "remove"
type DiffRowKind = "equal" | "add" | "remove" | "replace"

type DiffToken = Readonly<{
  kind: DiffTokenKind
  value: string
}>

type DiffSide = Readonly<{
  lineNumber: number | null
  text: string
  tokens: readonly DiffToken[]
}>

type DiffRow = Readonly<{
  kind: DiffRowKind
  original: DiffSide
  modified: DiffSide
}>

type DiffStats = Readonly<{
  originalLineCount: number
  modifiedLineCount: number
  unchanged: number
  changed: number
  added: number
  removed: number
}>

type TextDiffResult = Readonly<{
  rows: readonly DiffRow[]
  stats: DiffStats
  unifiedText: string
}>

function splitIntoLines(text: string) {
  const normalized = text.replace(/\r\n?/gu, "\n")

  if (normalized.length === 0) {
    return [] as string[]
  }

  return normalized.split("\n")
}

function normalizeLine(line: string, options: TextDiffCompareOptions) {
  let next = line

  if (options.ignoreWhitespace) {
    next = next.replace(/\s+/gu, "")
  }

  if (options.ignoreCase) {
    next = next.toLocaleLowerCase()
  }

  return next
}

function createTokens(
  value: string,
  kind: DiffTokenKind
): readonly DiffToken[] {
  return value.length === 0 ? [] : [{ kind, value }]
}

function createSide(
  lineNumber: number | null,
  text: string,
  tokens: readonly DiffToken[]
): DiffSide {
  return {
    lineNumber,
    text,
    tokens,
  }
}

function createInlineTokens(
  originalText: string,
  modifiedText: string,
  options: TextDiffCompareOptions
) {
  const originalTokens: DiffToken[] = []
  const modifiedTokens: DiffToken[] = []

  for (const change of diffWordsWithSpace(originalText, modifiedText, {
    ignoreCase: options.ignoreCase,
  })) {
    if (change.added) {
      modifiedTokens.push({ kind: "add", value: change.value })
      continue
    }

    if (change.removed) {
      originalTokens.push({ kind: "remove", value: change.value })
      continue
    }

    originalTokens.push({ kind: "equal", value: change.value })
    modifiedTokens.push({ kind: "equal", value: change.value })
  }

  return {
    originalTokens:
      originalTokens.length > 0
        ? originalTokens
        : createTokens(originalText, "equal"),
    modifiedTokens:
      modifiedTokens.length > 0
        ? modifiedTokens
        : createTokens(modifiedText, "equal"),
  }
}

function createChangedRows(
  originalLines: readonly string[],
  modifiedLines: readonly string[],
  originalStart: number,
  modifiedStart: number,
  options: TextDiffCompareOptions
) {
  const rows: DiffRow[] = []
  const total = Math.max(originalLines.length, modifiedLines.length)

  for (let index = 0; index < total; index += 1) {
    const originalText = originalLines[index]
    const modifiedText = modifiedLines[index]

    if (originalText !== undefined && modifiedText !== undefined) {
      const inlineTokens = createInlineTokens(
        originalText,
        modifiedText,
        options
      )

      rows.push({
        kind: "replace",
        original: createSide(
          originalStart + index,
          originalText,
          inlineTokens.originalTokens
        ),
        modified: createSide(
          modifiedStart + index,
          modifiedText,
          inlineTokens.modifiedTokens
        ),
      })
      continue
    }

    if (originalText !== undefined) {
      rows.push({
        kind: "remove",
        original: createSide(
          originalStart + index,
          originalText,
          createTokens(originalText, "remove")
        ),
        modified: createSide(null, "", []),
      })
      continue
    }

    rows.push({
      kind: "add",
      original: createSide(null, "", []),
      modified: createSide(
        modifiedStart + index,
        modifiedText!,
        createTokens(modifiedText!, "add")
      ),
    })
  }

  return rows
}

function summarizeRows(
  rows: readonly DiffRow[],
  originalLineCount: number,
  modifiedLineCount: number
): DiffStats {
  let unchanged = 0
  let changed = 0
  let added = 0
  let removed = 0

  for (const row of rows) {
    if (row.kind === "equal") {
      unchanged += 1
    } else if (row.kind === "replace") {
      changed += 1
    } else if (row.kind === "add") {
      added += 1
    } else {
      removed += 1
    }
  }

  return {
    originalLineCount,
    modifiedLineCount,
    unchanged,
    changed,
    added,
    removed,
  }
}

function formatUnifiedText(rows: readonly DiffRow[]) {
  const lines = ["--- original", "+++ modified"]

  for (const row of rows) {
    if (row.kind === "equal") {
      lines.push(`  ${row.original.text}`)
      continue
    }

    if (row.kind === "add") {
      lines.push(`+ ${row.modified.text}`)
      continue
    }

    if (row.kind === "remove") {
      lines.push(`- ${row.original.text}`)
      continue
    }

    lines.push(`- ${row.original.text}`)
    lines.push(`+ ${row.modified.text}`)
  }

  return lines.join("\n")
}

function compareText(
  originalText: string,
  modifiedText: string,
  options: TextDiffCompareOptions
): TextDiffResult {
  const originalLines = splitIntoLines(originalText)
  const modifiedLines = splitIntoLines(modifiedText)
  const normalizedOriginal = originalLines.map((line) =>
    normalizeLine(line, options)
  )
  const normalizedModified = modifiedLines.map((line) =>
    normalizeLine(line, options)
  )
  const rows: DiffRow[] = []
  let originalIndex = 0
  let modifiedIndex = 0

  const changes = diffArrays(normalizedOriginal, normalizedModified)

  for (let index = 0; index < changes.length; index += 1) {
    const change = changes[index]!
    const count = change.value.length

    if (change.removed || change.added) {
      const next = changes[index + 1]

      if (change.removed && next?.added) {
        const removedCount = count
        const addedCount = next.value.length

        rows.push(
          ...createChangedRows(
            originalLines.slice(originalIndex, originalIndex + removedCount),
            modifiedLines.slice(modifiedIndex, modifiedIndex + addedCount),
            originalIndex + 1,
            modifiedIndex + 1,
            options
          )
        )

        originalIndex += removedCount
        modifiedIndex += addedCount
        index += 1
        continue
      }

      if (change.removed) {
        rows.push(
          ...createChangedRows(
            originalLines.slice(originalIndex, originalIndex + count),
            [],
            originalIndex + 1,
            modifiedIndex + 1,
            options
          )
        )
        originalIndex += count
        continue
      }

      rows.push(
        ...createChangedRows(
          [],
          modifiedLines.slice(modifiedIndex, modifiedIndex + count),
          originalIndex + 1,
          modifiedIndex + 1,
          options
        )
      )
      modifiedIndex += count
      continue
    }

    const originalSlice = originalLines.slice(
      originalIndex,
      originalIndex + count
    )
    const modifiedSlice = modifiedLines.slice(
      modifiedIndex,
      modifiedIndex + count
    )

    for (let sliceIndex = 0; sliceIndex < count; sliceIndex += 1) {
      rows.push({
        kind: "equal",
        original: createSide(
          originalIndex + sliceIndex + 1,
          originalSlice[sliceIndex]!,
          createTokens(originalSlice[sliceIndex]!, "equal")
        ),
        modified: createSide(
          modifiedIndex + sliceIndex + 1,
          modifiedSlice[sliceIndex]!,
          createTokens(modifiedSlice[sliceIndex]!, "equal")
        ),
      })
    }

    originalIndex += count
    modifiedIndex += count
  }

  return {
    rows,
    stats: summarizeRows(rows, originalLines.length, modifiedLines.length),
    unifiedText: formatUnifiedText(rows),
  }
}

export { compareText, splitIntoLines }
export type {
  DiffRow,
  DiffRowKind,
  DiffSide,
  DiffStats,
  DiffToken,
  DiffTokenKind,
  TextDiffCompareOptions,
  TextDiffResult,
}
