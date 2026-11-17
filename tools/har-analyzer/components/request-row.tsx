import { memo } from "react"
import { TableRow, TableCell } from "@workspace/ui/components/ui/table"
import { formatBytes, formatTime, requestName } from "../core/analysis"
import { StatusBadge } from "./status-badge"
import { Waterfall } from "./timing"
import type { Capture, Entry, Messages } from "../types"

export const RequestRow = memo(function RequestRow({
  entry,
  capture,
  lang,
  messages: m,
  onInspect,
}: {
  entry: Entry
  capture: Capture
  lang: string
  messages: Messages
  onInspect: (entry: Entry, trigger: HTMLButtonElement) => void
}) {
  return (
    <TableRow>
      <TableCell className="hidden font-mono text-xs sm:table-cell">
        {entry.method}
      </TableCell>
      <TableCell>
        <button
          type="button"
          onClick={(event) => onInspect(entry, event.currentTarget)}
          aria-haspopup="dialog"
          title={entry.url}
          className="flex min-h-11 w-full min-w-0 flex-col justify-center gap-1 rounded-sm text-start hover:text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none sm:min-h-9"
        >
          <span dir="ltr" className="block w-full truncate font-medium">
            {requestName(entry.url)}
          </span>
          <span
            dir="ltr"
            className="block w-full truncate font-mono text-[10px] text-muted-foreground"
          >
            {entry.url}
          </span>
          <span className="flex w-full flex-wrap items-center gap-2 font-mono text-[10px] tabular-nums sm:hidden">
            <span>{entry.method}</span>
            <StatusBadge entry={entry} />
            <span>{formatTime(entry.duration, lang, "—")}</span>
            <span>{formatBytes(entry.transferSize, lang, "—")}</span>
          </span>
        </button>
      </TableCell>
      <TableCell className="hidden sm:table-cell">
        <StatusBadge entry={entry} />
      </TableCell>
      <TableCell
        title={entry.transferSize === null ? m.unknown : undefined}
        className="hidden font-mono text-xs tabular-nums sm:table-cell"
      >
        {formatBytes(entry.transferSize, lang, "—")}
      </TableCell>
      <TableCell
        title={entry.duration === null ? m.unknown : undefined}
        className="hidden font-mono text-xs tabular-nums sm:table-cell"
      >
        {formatTime(entry.duration, lang, "—")}
      </TableCell>
      <TableCell>
        <Waterfall entry={entry} capture={capture} lang={lang} messages={m} />
      </TableCell>
    </TableRow>
  )
})
