export type JsonDiffOperation = 'add' | 'remove' | 'replace'

export interface JsonParseError {
  readonly message: string
  readonly line?: number
  readonly column?: number
}

export interface JsonParseResult {
  readonly value?: unknown
  readonly error?: JsonParseError
}

export interface JsonDiffEntry {
  readonly op: JsonDiffOperation
  readonly jsonPath: string
  readonly jsonPointer: string
  readonly oldValue?: unknown
  readonly newValue?: unknown
}

export interface JsonPatchOperation {
  readonly op: JsonDiffOperation
  readonly path: string
  readonly value?: unknown
}

const identifierPattern = /^[A-Za-z_$][A-Za-z0-9_$]*$/

export function parseJsonWithError(input: string): JsonParseResult {
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

export function diffJsonValues(original: unknown, modified: unknown): JsonDiffEntry[] {
  const diffs: JsonDiffEntry[] = []
  collectDiffs(original, modified, [], diffs)
  return diffs
}

export function toJsonPatch(entries: readonly JsonDiffEntry[]): JsonPatchOperation[] {
  const patch = entries.map((entry) => {
    if (entry.op === 'remove') {
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
  diffs: JsonDiffEntry[],
): void {
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
          op: 'add',
          jsonPath: toJsonPath(nextSegments),
          jsonPointer: toJsonPointer(nextSegments),
          newValue: modified[index],
        })
        continue
      }

      if (!hasModified) {
        diffs.push({
          op: 'remove',
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
    const keys = [...new Set([...Object.keys(original), ...Object.keys(modified)])].sort()

    for (const key of keys) {
      const hasOriginal = key in original
      const hasModified = key in modified
      const nextSegments = [...segments, key]

      if (!hasOriginal) {
        diffs.push({
          op: 'add',
          jsonPath: toJsonPath(nextSegments),
          jsonPointer: toJsonPointer(nextSegments),
          newValue: modified[key],
        })
        continue
      }

      if (!hasModified) {
        diffs.push({
          op: 'remove',
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
    op: 'replace',
    jsonPath: toJsonPath(segments),
    jsonPointer: toJsonPointer(segments),
    oldValue: original,
    newValue: modified,
  })
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function toJsonPath(segments: readonly (string | number)[]): string {
  if (segments.length === 0) {
    return '$'
  }

  return segments.reduce<string>((path, segment) => {
    if (typeof segment === 'number') {
      return `${path}[${segment}]`
    }

    if (identifierPattern.test(segment)) {
      return `${path}.${segment}`
    }

    return `${path}[${JSON.stringify(segment)}]`
  }, '$')
}

function toJsonPointer(segments: readonly (string | number)[]): string {
  if (segments.length === 0) {
    return ''
  }

  return `/${segments.map((segment) => escapeJsonPointerSegment(String(segment))).join('/')}`
}

function escapeJsonPointerSegment(segment: string): string {
  return segment.replaceAll('~', '~0').replaceAll('/', '~1')
}

function reorderArrayRemovalsInPatch(patch: JsonPatchOperation[]): void {
  const removeIndexesByParent = new Map<string, number[]>()

  for (let index = 0; index < patch.length; index += 1) {
    const operation = patch[index]
    if (operation?.op !== 'remove') {
      continue
    }

    const parsed = parseArrayRemovePath(operation.path)
    if (!parsed) {
      continue
    }

    const existing = removeIndexesByParent.get(parsed.parentPointer)
    if (existing) {
      existing.push(index)
      continue
    }

    removeIndexesByParent.set(parsed.parentPointer, [index])
  }

  for (const indexes of removeIndexesByParent.values()) {
    if (indexes.length < 2) {
      continue
    }

    const sortedByDescendingArrayIndex = indexes
      .map((patchIndex) => ({ patchIndex, operation: patch[patchIndex]! }))
      .sort((left, right) => {
        const leftIndex = parseArrayRemovePath(left.operation.path)?.index ?? 0
        const rightIndex = parseArrayRemovePath(right.operation.path)?.index ?? 0
        return rightIndex - leftIndex
      })

    for (let index = 0; index < indexes.length; index += 1) {
      patch[indexes[index]!] = sortedByDescendingArrayIndex[index]!.operation
    }
  }
}

function parseArrayRemovePath(path: string): { parentPointer: string; index: number } | null {
  if (!path.startsWith('/')) {
    return null
  }

  const segments = path.slice(1).split('/')
  const lastSegment = segments[segments.length - 1]

  if (!lastSegment || !/^(0|[1-9]\d*)$/.test(lastSegment)) {
    return null
  }

  const parentPointer = segments.length === 1 ? '' : `/${segments.slice(0, -1).join('/')}`

  return {
    parentPointer,
    index: Number.parseInt(lastSegment, 10),
  }
}

function toLineColumn(input: string, position: number): { line: number; column: number } {
  const limit = Math.min(Math.max(position, 0), input.length)
  let line = 1
  let column = 1

  for (let index = 0; index < limit; index += 1) {
    if (input[index] === '\n') {
      line += 1
      column = 1
    } else {
      column += 1
    }
  }

  return { line, column }
}
