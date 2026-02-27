import type { ArchiveEntry, ArchiveEntryKind } from '../types'

export type ArchiveExplorerRow = {
  path: string
  name: string
  kind: ArchiveEntryKind
  extension: string
  size: number
  modifiedAt: Date | null
}

export function buildRows(entries: ArchiveEntry[], currentDirectory: string): ArchiveExplorerRow[] {
  const currentSegments = splitPathSegments(currentDirectory)

  const directories = new Map<string, ArchiveExplorerRow>()
  const files: ArchiveExplorerRow[] = []

  for (const entry of entries) {
    const segments = splitPathSegments(entry.path)
    if (!segments.length) continue
    if (!hasPrefixSegments(segments, currentSegments)) continue
    if (segments.length <= currentSegments.length) continue

    const nextName = segments[currentSegments.length]
    if (!nextName) continue

    const isDirectChild = segments.length === currentSegments.length + 1

    if (isDirectChild && entry.kind !== 'directory') {
      files.push({
        path: entry.path,
        name: nextName,
        kind: entry.kind,
        extension: entry.extension,
        size: entry.size,
        modifiedAt: entry.modifiedAt,
      })
      continue
    }

    const directoryPath = toDirectoryPath([...currentSegments, nextName])
    const existing = directories.get(directoryPath)

    if (!existing || (entry.kind === 'directory' && isDirectChild)) {
      directories.set(directoryPath, {
        path: directoryPath,
        name: nextName,
        kind: 'directory',
        extension: '',
        size: 0,
        modifiedAt: entry.kind === 'directory' && isDirectChild ? entry.modifiedAt : null,
      })
    }
  }

  const sortedDirectories = [...directories.values()].sort((left, right) =>
    left.name.localeCompare(right.name),
  )
  const sortedFiles = files.sort((left, right) => left.name.localeCompare(right.name))

  return [...sortedDirectories, ...sortedFiles]
}

export function splitPathSegments(path: string): string[] {
  return path
    .split('/')
    .map((segment) => segment.trim())
    .filter((segment) => segment.length > 0)
}

export function toDirectoryPath(segments: string[]): string {
  if (!segments.length) return ''
  return `${segments.join('/')}/`
}

export function normalizeDirectoryPath(path: string): string {
  return toDirectoryPath(splitPathSegments(path))
}

function hasPrefixSegments(pathSegments: string[], prefixSegments: string[]): boolean {
  if (prefixSegments.length > pathSegments.length) {
    return false
  }

  for (let index = 0; index < prefixSegments.length; index += 1) {
    if (pathSegments[index] !== prefixSegments[index]) {
      return false
    }
  }

  return true
}
