import {
  normalizeDirectoryPath,
  splitPathSegments,
  toDirectoryPath,
} from "./path"

import type { ArchiveEntry, ArchiveEntryKind } from "./types"

type ArchiveExplorerRow = Readonly<{
  path: string
  name: string
  kind: ArchiveEntryKind
  extension: string
  size: number
  modifiedAt: Date | null
}>

type DirectoryBucket = {
  directories: Map<string, ArchiveExplorerRow>
  files: ArchiveExplorerRow[]
}

type ArchiveExplorerIndex = Map<string, ArchiveExplorerRow[]>

function buildRows(
  entries: readonly ArchiveEntry[],
  currentDirectory: string
): ArchiveExplorerRow[] {
  return getRowsForDirectory(buildRowIndex(entries), currentDirectory)
}

function buildRowIndex(entries: readonly ArchiveEntry[]): ArchiveExplorerIndex {
  const buckets = new Map<string, DirectoryBucket>()
  ensureDirectoryBucket(buckets, "")

  for (const entry of entries) {
    const segments = splitPathSegments(entry.path)
    if (!segments.length) continue

    let parentSegments: string[] = []
    const lastSegmentIndex = segments.length - 1

    for (let index = 0; index < segments.length; index += 1) {
      const name = segments[index]!
      const parentPath = toDirectoryPath(parentSegments)
      const isLeaf = index === lastSegmentIndex
      const isLeafDirectory = isLeaf && entry.kind === "directory"

      if (!isLeaf || isLeafDirectory) {
        upsertDirectoryRow({
          buckets,
          parentPath,
          directoryPath: toDirectoryPath([...parentSegments, name]),
          name,
          modifiedAt: isLeafDirectory ? entry.modifiedAt : null,
        })
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

  return new Map(
    [...buckets.entries()].map(([path, bucket]) => [
      path,
      sortBucketRows(bucket),
    ])
  )
}

function getRowsForDirectory(
  index: ArchiveExplorerIndex,
  currentDirectory: string
): ArchiveExplorerRow[] {
  return index.get(normalizeDirectoryPath(currentDirectory)) ?? []
}

function upsertDirectoryRow(params: {
  buckets: Map<string, DirectoryBucket>
  parentPath: string
  directoryPath: string
  name: string
  modifiedAt: Date | null
}) {
  const bucket = ensureDirectoryBucket(params.buckets, params.parentPath)
  const existing = bucket.directories.get(params.directoryPath)

  if (!existing || params.modifiedAt) {
    bucket.directories.set(params.directoryPath, {
      path: params.directoryPath,
      name: params.name,
      kind: "directory",
      extension: "",
      size: 0,
      modifiedAt: params.modifiedAt,
    })
  }

  ensureDirectoryBucket(params.buckets, params.directoryPath)
}

function ensureDirectoryBucket(
  buckets: Map<string, DirectoryBucket>,
  path: string
): DirectoryBucket {
  const existing = buckets.get(path)
  if (existing) return existing

  const nextBucket = {
    directories: new Map<string, ArchiveExplorerRow>(),
    files: [],
  }
  buckets.set(path, nextBucket)
  return nextBucket
}

function sortBucketRows(bucket: DirectoryBucket): ArchiveExplorerRow[] {
  const sortedDirectories = [...bucket.directories.values()].sort(
    (left, right) => left.name.localeCompare(right.name)
  )
  const sortedFiles = bucket.files.sort((left, right) =>
    left.name.localeCompare(right.name)
  )
  return [...sortedDirectories, ...sortedFiles]
}

export { buildRowIndex, buildRows, getRowsForDirectory }
export type { ArchiveExplorerRow }
