export type JsonDiffOperation = "add" | "remove" | "replace"

type JsonParseError = Readonly<{
  message: string
  line?: number
  column?: number
}>

type JsonParseResult = Readonly<{
  value?: unknown
  error?: JsonParseError
}>

export type JsonDiffEntry = Readonly<{
  op: JsonDiffOperation
  jsonPath: string
  jsonPointer: string
  oldValue?: unknown
  newValue?: unknown
}>

type JsonPatchOperation = Readonly<{
  op: JsonDiffOperation
  path: string
  value?: unknown
}>

const IDENTIFIER_PATTERN = /^[A-Za-z_$][A-Za-z0-9_$]*$/

function parseJsonWithError(input: string): JsonParseResult {
  if (!input.trim()) {
    return {}
  }

  try {
    return { value: JSON.parse(input) }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    const positionMatch = message.match(/position\s+(\d+)/i)

    if (!positionMatch) {
      return { error: { message } }
    }

    const position = Number.parseInt(positionMatch[1]!, 10)
    const { line, column } = toLineColumn(input, position)

    return {
      error: {
        message,
        line,
        column,
      },
    }
  }
}

function diffJsonValues(original: unknown, modified: unknown): JsonDiffEntry[] {
  const diffs: JsonDiffEntry[] = []
  collectDiffs(original, modified, [], diffs)
  return diffs
}

function toJsonPatch(entries: readonly JsonDiffEntry[]): JsonPatchOperation[] {
  const patch = entries.map((entry) => {
    if (entry.op === "remove") {
      return {
        op: entry.op,
        path: entry.jsonPointer,
      }
    }

    return {
      op: entry.op,
      path: entry.jsonPointer,
      value: entry.newValue,
    }
  })

  reorderArrayRemovalsInPatch(patch)
  return patch
}

function collectDiffs(
  original: unknown,
  modified: unknown,
  segments: readonly (string | number)[],
  diffs: JsonDiffEntry[]
) {
  if (Object.is(original, modified)) {
    return
  }

  if (Array.isArray(original) && Array.isArray(modified)) {
    const maxLength = Math.max(original.length, modified.length)

    for (let index = 0; index < maxLength; index += 1) {
      const hasOriginal = index < original.length
      const hasModified = index < modified.length
      const nextSegments = [...segments, index]

      if (!hasOriginal) {
        diffs.push({
          op: "add",
          jsonPath: toJsonPath(nextSegments),
          jsonPointer: toJsonPointer(nextSegments),
          newValue: modified[index],
        })
        continue
      }

      if (!hasModified) {
        diffs.push({
          op: "remove",
          jsonPath: toJsonPath(nextSegments),
          jsonPointer: toJsonPointer(nextSegments),
          oldValue: original[index],
        })
        continue
      }

      collectDiffs(original[index], modified[index], nextSegments, diffs)
    }

    return
  }

  if (isRecord(original) && isRecord(modified)) {
    const keys = [
      ...new Set([...Object.keys(original), ...Object.keys(modified)]),
    ].sort()

    for (const key of keys) {
      const hasOriginal = key in original
      const hasModified = key in modified
      const nextSegments = [...segments, key]

      if (!hasOriginal) {
        diffs.push({
          op: "add",
          jsonPath: toJsonPath(nextSegments),
          jsonPointer: toJsonPointer(nextSegments),
          newValue: modified[key],
        })
        continue
      }

      if (!hasModified) {
        diffs.push({
          op: "remove",
          jsonPath: toJsonPath(nextSegments),
          jsonPointer: toJsonPointer(nextSegments),
          oldValue: original[key],
        })
        continue
      }

      collectDiffs(original[key], modified[key], nextSegments, diffs)
    }

    return
  }

  diffs.push({
    op: "replace",
    jsonPath: toJsonPath(segments),
    jsonPointer: toJsonPointer(segments),
    oldValue: original,
    newValue: modified,
  })
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function toJsonPath(segments: readonly (string | number)[]) {
  if (segments.length === 0) {
    return "$"
  }

  return segments.reduce<string>((path, segment) => {
    if (typeof segment === "number") {
      return `${path}[${segment}]`
    }

    if (IDENTIFIER_PATTERN.test(segment)) {
      return `${path}.${segment}`
    }

    return `${path}[${JSON.stringify(segment)}]`
  }, "$")
}

function toJsonPointer(segments: readonly (string | number)[]) {
  if (segments.length === 0) {
    return ""
  }

  return `/${segments
    .map((segment) => escapeJsonPointerSegment(String(segment)))
    .join("/")}`
}

function escapeJsonPointerSegment(segment: string) {
  return segment.replaceAll("~", "~0").replaceAll("/", "~1")
}

function reorderArrayRemovalsInPatch(patch: JsonPatchOperation[]) {
  const removeIndexesByParent = new Map<
    string,
    { patchIndex: number; arrayIndex: number }[]
  >()

  for (let index = 0; index < patch.length; index += 1) {
    const operation = patch[index]

    if (operation?.op !== "remove") {
      continue
    }

    const parsed = parseArrayRemovePath(operation.path)

    if (!parsed) {
      continue
    }

    const existingIndexes = removeIndexesByParent.get(parsed.parentPointer)

    if (existingIndexes) {
      existingIndexes.push({
        patchIndex: index,
        arrayIndex: parsed.index,
      })
      continue
    }

    removeIndexesByParent.set(parsed.parentPointer, [
      {
        patchIndex: index,
        arrayIndex: parsed.index,
      },
    ])
  }

  for (const removals of removeIndexesByParent.values()) {
    if (removals.length < 2) {
      continue
    }

    const sortedByDescendingArrayIndex = [...removals].sort(
      (left, right) => right.arrayIndex - left.arrayIndex
    )
    const sortedOperations = sortedByDescendingArrayIndex.map(
      (removal) => patch[removal.patchIndex]!
    )

    for (let index = 0; index < removals.length; index += 1) {
      patch[removals[index]!.patchIndex] = sortedOperations[index]!
    }
  }
}

function parseArrayRemovePath(path: string) {
  if (!path.startsWith("/")) {
    return null
  }

  const segments = path.slice(1).split("/")
  const lastSegment = segments[segments.length - 1]

  if (!lastSegment || !/^(0|[1-9]\d*)$/.test(lastSegment)) {
    return null
  }

  return {
    parentPointer:
      segments.length === 1 ? "" : `/${segments.slice(0, -1).join("/")}`,
    index: Number.parseInt(lastSegment, 10),
  }
}

function toLineColumn(input: string, position: number) {
  const limit = Math.min(Math.max(position, 0), input.length)
  let line = 1
  let column = 1

  for (let index = 0; index < limit; index += 1) {
    if (input[index] === "\n") {
      line += 1
      column = 1
      continue
    }

    column += 1
  }

  return { line, column }
}

export { diffJsonValues, parseJsonWithError, toJsonPatch }
