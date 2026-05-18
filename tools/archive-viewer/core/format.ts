import type { ArchiveEntry, ArchiveEntryKind, ArchiveFormat } from "./types"

type ArchiveSummary = Readonly<{
  entries: number
  files: number
  directories: number
  uncompressedSize: number
}>

const byteFormatter = new Intl.NumberFormat(undefined, {
  maximumFractionDigits: 1,
  minimumFractionDigits: 0,
})

function formatBytes(value: number): string {
  if (!Number.isFinite(value) || value <= 0) return "0 B"

  const units = ["B", "KB", "MB", "GB", "TB"] as const
  let size = value
  let unitIndex = 0

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex += 1
  }

  return `${byteFormatter.format(size)} ${units[unitIndex]}`
}

function formatDate(value: Date | null): string {
  if (!value) return "-"
  return value.toLocaleString()
}

function getFormatLabel(format: ArchiveFormat): string {
  const labels: Record<ArchiveFormat, string> = {
    zip: "ZIP",
    tar: "TAR",
    gz: "GZ",
    tgz: "TGZ",
  }

  return labels[format]
}

function getKindLabel(
  kind: ArchiveEntryKind,
  labels: Record<ArchiveEntryKind, string>
): string {
  return labels[kind]
}

function summarizeEntries(entries: readonly ArchiveEntry[]): ArchiveSummary {
  return entries.reduce<ArchiveSummary>(
    (summary, entry) => ({
      entries: summary.entries + 1,
      files: summary.files + (entry.kind === "file" ? 1 : 0),
      directories: summary.directories + (entry.kind === "directory" ? 1 : 0),
      uncompressedSize:
        summary.uncompressedSize + (entry.kind === "file" ? entry.size : 0),
    }),
    {
      entries: 0,
      files: 0,
      directories: 0,
      uncompressedSize: 0,
    }
  )
}

export {
  formatBytes,
  formatDate,
  getFormatLabel,
  getKindLabel,
  summarizeEntries,
}
export type { ArchiveSummary }
