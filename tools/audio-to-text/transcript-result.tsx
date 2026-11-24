import { useEffect, useMemo, useState } from "react"
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
import { cn } from "@workspace/ui/lib/utils"
import { FORMATS, formatTranscript, timestamp } from "./core/transcript"
import { NativeSelect } from "./input-fields"
import type { Format, Segment } from "./core/transcript"
import type { Messages } from "./types"
import type { RefObject } from "react"

const PLAYBACK_EVENTS = ["play", "pause", "timeupdate", "seeking", "ended"]

function findCurrentSegment(segments: Segment[], milliseconds: number) {
  for (let index = segments.length - 1; index >= 0; index--) {
    const { start, end } = segments[index]!
    if (start <= milliseconds && milliseconds < end) return index
  }
  return -1
}

export function TranscriptResult({
  filename,
  messages: m,
  segments,
  audioRef,
  onEdit,
}: {
  filename: string
  messages: Messages
  segments: Segment[]
  audioRef: RefObject<HTMLAudioElement | null>
  onEdit: (index: number, text: string) => void
}) {
  const [format, setFormat] = useState<Format>("txt")
  const [currentSegment, setCurrentSegment] = useState(-1)
  const textToCopy = useMemo(
    () => formatTranscript(segments, "txt"),
    [segments]
  )
  const hasText = segments.some(({ text }) => text.trim())

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateCurrentSegment = () => {
      const time = audio.currentTime * 1000
      const index =
        audio.ended || (audio.paused && time === 0)
          ? -1
          : findCurrentSegment(segments, time)
      setCurrentSegment(index)
    }

    updateCurrentSegment()
    for (const event of PLAYBACK_EVENTS) {
      audio.addEventListener(event, updateCurrentSegment)
    }
    return () => {
      for (const event of PLAYBACK_EVENTS) {
        audio.removeEventListener(event, updateCurrentSegment)
      }
    }
  }, [audioRef, segments])

  function playFrom(milliseconds: number) {
    const audio = audioRef.current
    if (!audio) return
    audio.currentTime = milliseconds / 1000
    void audio.play().catch(() => audio.focus())
  }

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
            const current = index === currentSegment
            return (
              <li
                key={`${start}-${end}-${index}`}
                className={cn(
                  "grid items-start gap-x-2 border-s-2 border-s-transparent px-3 py-1.5 sm:grid-cols-[auto_minmax(0,1fr)]",
                  current && "border-s-primary bg-muted"
                )}
              >
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  dir="ltr"
                  className={cn(
                    "h-auto justify-self-start py-2 font-mono text-xs leading-5 tabular-nums",
                    !current && "text-muted-foreground"
                  )}
                  aria-label={m.playFrom.replace("{time}", time)}
                  aria-current={current ? "time" : undefined}
                  onClick={() => playFrom(start)}
                >
                  <Play data-icon="inline-start" aria-hidden="true" />
                  {time}
                </Button>
                <Textarea
                  aria-label={m.editSegment.replace("{time}", time)}
                  dir="auto"
                  rows={1}
                  className="min-h-9 min-w-0 resize-y border-transparent text-start leading-5 hover:bg-muted/40 supports-[field-sizing:content]:resize-none dark:bg-transparent"
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
