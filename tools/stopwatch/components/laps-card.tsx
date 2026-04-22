import { useEffect, useMemo, useState } from "react"

import {
  ToolPanelCard,
  ToolPanelCardContent,
  ToolPanelCardFooter,
} from "@workspace/ui/components/tool/tool-panel-card"
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { Button } from "@workspace/ui/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/ui/table"
import { Download, Trash2 } from "@workspace/ui/icons"

import { buildLapCsv, buildLapRows } from "../core/laps"
import { formatStopwatch } from "../core/format"

import type { StopwatchMessages } from "../types"

const CSV_FILENAME = "stopwatch-laps.csv"

type LapsCardProps = Readonly<{
  messages: StopwatchMessages
  laps: readonly number[]
  onClear: () => void
}>

function LapsCard({ messages, laps, onClear }: LapsCardProps) {
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)

  const lapRows = useMemo(() => buildLapRows(laps), [laps])
  const csvContent = useMemo(
    () =>
      buildLapCsv(lapRows, {
        lap: messages.lapTimeLabel,
        total: messages.totalTimeLabel,
        lapMilliseconds: messages.lapMillisecondsLabel,
        totalMilliseconds: messages.totalMillisecondsLabel,
      }),
    [lapRows, messages]
  )

  useEffect(() => {
    if (!csvContent) {
      setDownloadUrl(null)
      return
    }

    const nextUrl = URL.createObjectURL(
      new Blob([csvContent], { type: "text/csv;charset=utf-8" })
    )

    setDownloadUrl(nextUrl)

    return () => {
      URL.revokeObjectURL(nextUrl)
    }
  }, [csvContent])

  return (
    <ToolPanelCard>
      <CardHeader className="border-b">
        <CardTitle>{messages.lapsLabel}</CardTitle>
        <CardDescription>{messages.lapsDescription}</CardDescription>
      </CardHeader>

      <ToolPanelCardContent className="gap-4 pt-4">
        {lapRows.length ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>{messages.lapTimeLabel}</TableHead>
                <TableHead>{messages.totalTimeLabel}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lapRows.map((row) => (
                <TableRow key={row.key} data-testid="lap-row">
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    #{row.index}
                  </TableCell>
                  <TableCell className="font-mono tabular-nums">
                    {formatStopwatch(row.lapTime)}
                  </TableCell>
                  <TableCell className="font-mono tabular-nums">
                    {formatStopwatch(row.totalTime)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p
            className="py-8 text-center text-sm text-muted-foreground"
            data-testid="no-laps"
          >
            {messages.noLapsLabel}
          </p>
        )}
      </ToolPanelCardContent>

      <ToolPanelCardFooter className="flex flex-wrap items-center justify-end gap-3 border-t">
        {downloadUrl ? (
          <Button asChild type="button" variant="ghost" size="sm">
            <a
              href={downloadUrl}
              download={CSV_FILENAME}
              data-testid="export-csv"
            >
              <Download data-icon="inline-start" />
              {messages.exportLabel} CSV
            </a>
          </Button>
        ) : (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled
            data-testid="export-csv"
          >
            <Download data-icon="inline-start" />
            {messages.exportLabel} CSV
          </Button>
        )}

        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={lapRows.length === 0}
          data-testid="clear-laps"
          onClick={onClear}
        >
          <Trash2 data-icon="inline-start" />
          {messages.clearLabel}
        </Button>
      </ToolPanelCardFooter>
    </ToolPanelCard>
  )
}

export { LapsCard }
