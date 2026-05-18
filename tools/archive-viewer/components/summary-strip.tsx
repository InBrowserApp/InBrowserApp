import type { ArchiveHandle } from "../core/types"
import type { ArchiveSummary } from "../core/format"
import type { ArchiveViewerMessages } from "../types"

type SummaryStripProps = Readonly<{
  archiveSize: string
  handle: ArchiveHandle | null
  messages: ArchiveViewerMessages
  summary: ArchiveSummary
  uncompressedSize: string
}>

function SummaryStrip({
  archiveSize,
  handle,
  messages,
  summary,
  uncompressedSize,
}: SummaryStripProps) {
  if (!handle) return null

  const items = [
    [messages.summaryFormat, handle.format.toUpperCase()],
    [messages.summaryCompressed, archiveSize],
    [messages.summaryUncompressed, uncompressedSize],
    [messages.summaryEntries, String(summary.entries)],
    [messages.summaryFiles, String(summary.files)],
    [messages.summaryFolders, String(summary.directories)],
  ] as const

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
      {items.map(([label, value]) => (
        <div
          key={label}
          className="rounded-lg border border-border/70 bg-card/80 p-3"
        >
          <p className="text-xs font-medium text-muted-foreground uppercase">
            {label}
          </p>
          <p className="mt-1 truncate text-sm font-medium">{value}</p>
        </div>
      ))}
    </div>
  )
}

export { SummaryStrip }
