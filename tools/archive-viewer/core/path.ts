import type { ArchiveEntry } from "./types"

const ENTRY_KIND_SORT_RANK = {
  directory: 0,
  file: 1,
  symlink: 1,
  other: 1,
} as const

function normalizeArchivePath(inputPath: string): string {
  const normalized = inputPath
    .trim()
    .replace(/\\/g, "/")
    .replace(/^\.\//, "")
    .replace(/^\/+/, "")

  if (!normalized || normalized === "." || normalized === "..") return ""
  return normalized
}

function splitPathSegments(path: string): string[] {
  return path
    .split("/")
    .map((segment) => segment.trim())
    .filter((segment) => segment.length > 0)
}

function toDirectoryPath(segments: readonly string[]): string {
  if (!segments.length) return ""
  return `${segments.join("/")}/`
}

function normalizeDirectoryPath(path: string): string {
  return toDirectoryPath(splitPathSegments(path))
}

function extractExtension(path: string): string {
  const fileName = path.split("/").pop()!
  const dotIndex = fileName.lastIndexOf(".")
  if (dotIndex <= 0 || dotIndex === fileName.length - 1) return ""
  return fileName.slice(dotIndex + 1).toLowerCase()
}

function sortEntries(entries: readonly ArchiveEntry[]): ArchiveEntry[] {
  return [...entries].sort((left, right) => {
    const kindDelta =
      ENTRY_KIND_SORT_RANK[left.kind] - ENTRY_KIND_SORT_RANK[right.kind]
    if (kindDelta !== 0) return kindDelta

    return left.path.localeCompare(right.path)
  })
}

function stripSuffix(value: string, suffix: string): string {
  if (!value.toLowerCase().endsWith(suffix)) return value
  return value.slice(0, Math.max(0, value.length - suffix.length))
}

function safeDownloadName(path: string): string {
  return path.split("/").filter(Boolean).pop() || "archive-entry.bin"
}

export {
  extractExtension,
  normalizeArchivePath,
  normalizeDirectoryPath,
  safeDownloadName,
  sortEntries,
  splitPathSegments,
  stripSuffix,
  toDirectoryPath,
}
