import type { ArchiveEntry, ArchiveEntryKind } from '../types'

export type ArchiveExplorerRow = {
  path: string
  name: string
  kind: ArchiveEntryKind
  extension: string
  size: number
  modifiedAt: Date | null
}

type DirectoryBucket = {
  directories: Map<string, ArchiveExplorerRow>
  files: ArchiveExplorerRow[]
}

export type ArchiveExplorerIndex = Map<string, ArchiveExplorerRow[]>

export function buildRows(entries: ArchiveEntry[], currentDirectory: string): ArchiveExplorerRow[] {
  return getRowsForDirectory(buildRowIndex(entries), currentDirectory)
}

export function buildRowIndex(entries: ArchiveEntry[]): ArchiveExplorerIndex {
  const buckets = new Map<string, DirectoryBucket>()
  ensureDirectoryBucket(buckets, '')

  for (const entry of entries) {
    const segments = splitPathSegments(entry.path)
    if (!segments.length) continue

    let parentSegments: string[] = []
    const lastSegmentIndex = segments.length - 1

    for (let index = 0; index < segments.length; index += 1) {
      const name = segments[index]
      if (!name) {
        continue
      }

      const parentPath = toDirectoryPath(parentSegments)
      const isLeaf = index === lastSegmentIndex
      const isLeafDirectory = isLeaf && entry.kind === 'directory'

      if (!isLeaf || isLeafDirectory) {
        const directoryPath = toDirectoryPath([...parentSegments, name])
        const bucket = ensureDirectoryBucket(buckets, parentPath)
        const existing = bucket.directories.get(directoryPath)

        if (!existing || isLeafDirectory) {
          bucket.directories.set(directoryPath, {
            path: directoryPath,
            name,
            kind: 'directory',
            extension: '',
            size: 0,
            modifiedAt: isLeafDirectory ? entry.modifiedAt : null,
          })
        }

        ensureDirectoryBucket(buckets, directoryPath)
      }

      if (isLeaf && !isLeafDirectory) {
        ensureDirectoryBucket(buckets, parentPath).files.push({
          path: entry.path,
          name,
          kind: entry.kind,
          extension: entry.extension,
          size: entry.size,
          modifiedAt: entry.modifiedAt,
        })
      }

      parentSegments = [...parentSegments, name]
    }
  }

  return new Map([...buckets.entries()].map(([path, bucket]) => [path, sortBucketRows(bucket)]))
}

export function getRowsForDirectory(
  index: ArchiveExplorerIndex,
  currentDirectory: string,
): ArchiveExplorerRow[] {
  return index.get(normalizeDirectoryPath(currentDirectory)) ?? []
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

function ensureDirectoryBucket(
  buckets: Map<string, DirectoryBucket>,
  path: string,
): DirectoryBucket {
  const existing = buckets.get(path)
  if (existing) {
    return existing
  }

  const nextBucket: DirectoryBucket = {
    directories: new Map<string, ArchiveExplorerRow>(),
    files: [],
  }
  buckets.set(path, nextBucket)
  return nextBucket
}

function sortBucketRows(bucket: DirectoryBucket): ArchiveExplorerRow[] {
  const sortedDirectories = [...bucket.directories.values()].sort((left, right) =>
    left.name.localeCompare(right.name),
  )
  const sortedFiles = bucket.files.sort((left, right) => left.name.localeCompare(right.name))
  return [...sortedDirectories, ...sortedFiles]
}
