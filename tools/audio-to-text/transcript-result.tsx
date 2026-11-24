import { useMemo, useState } from "react"
import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import { Button } from "@workspace/ui/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { Textarea } from "@workspace/ui/components/ui/textarea"
import { Download, Play } from "@workspace/ui/icons"
import { FORMATS, formatTranscript, timestamp } from "./core/transcript"
import { NativeSelect } from "./input-fields"
import type { Format, Segment } from "./core/transcript"
import type { Messages } from "./client"

export function TranscriptResult({
  filename,
  messages: m,
  segments,
  onEdit,
  onPlay,
}: {
  filename: string
  messages: Messages
  segments: Segment[]
  onEdit: (index: number, text: string) => void
  onPlay: (milliseconds: number) => void
}) {
  const [format, setFormat] = useState<Format>("txt")
  const textToCopy = useMemo(
    () => formatTranscript(segments, "txt"),
    [segments]
  )
  const hasText = segments.some(({ text }) => text.trim())

  function download() {
    const url = URL.createObjectURL(
      new Blob([formatTranscript(segments, format)], { type: FORMATS[format] })
    )
    const link = document.createElement("a")
    link.href = url
    link.download = `${filename.replace(/\.[^.]+$/, "") || filename}.${format}`
    link.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  return (
    <Card>
      <CardHeader className="gap-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0 space-y-1">
            <CardTitle>
              <h2>{m.transcript}</h2>
            </CardTitle>
            <p className="text-sm text-muted-foreground">{m.editHint}</p>
          </div>
          <div className="flex max-w-full flex-wrap items-center gap-2">
            <ToolCopyButton
              className="h-auto min-h-10 max-w-full whitespace-normal"
              value={textToCopy}
              copyLabel={m.copy}
              copiedLabel={m.copied}
              failedLabel={m.copyError}
              disabled={!hasText}
            />
            <div className="flex flex-wrap items-center gap-2">
              <NativeSelect
                aria-label={m.exportFormat}
                className="w-fit"
                value={format}
                onChange={(event) =>
                  setFormat(event.currentTarget.value as Format)
                }
              >
                {Object.keys(FORMATS).map((key) => (
                  <option key={key} value={key}>
                    {key.toUpperCase()}
                  </option>
                ))}
              </NativeSelect>
              <Button
                type="button"
                className="h-auto min-h-10 whitespace-normal"
                disabled={!hasText}
                onClick={download}
              >
                <Download data-icon="inline-start" aria-hidden="true" />
                {m.download.replace("{format}", format.toUpperCase())}
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ol className="max-h-[36rem] divide-y overflow-y-auto rounded-lg border">
          {segments.map(({ start, end, text }, index) => {
            const time = timestamp(start)
            return (
              <li
                key={`${start}-${end}-${index}`}
                className="flex flex-wrap items-start gap-2 px-3 py-2 sm:flex-nowrap"
              >
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  dir="ltr"
                  className="font-mono text-xs text-muted-foreground tabular-nums"
                  aria-label={m.playFrom.replace("{time}", time)}
                  onClick={() => onPlay(start)}
                >
                  <Play data-icon="inline-start" aria-hidden="true" />
                  {time}
                </Button>
                <Textarea
                  aria-label={m.editSegment.replace("{time}", time)}
                  dir="auto"
                  rows={1}
                  className="min-h-9 min-w-0 flex-1 basis-full resize-y border-transparent px-2.5 text-start hover:bg-muted/40 supports-[field-sizing:content]:resize-none sm:basis-auto"
                  value={text}
                  onChange={(event) => onEdit(index, event.currentTarget.value)}
                />
              </li>
            )
          })}
        </ol>
      </CardContent>
    </Card>
  )
}
