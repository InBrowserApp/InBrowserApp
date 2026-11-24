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
import { Download, LoaderCircle } from "@workspace/ui/icons"
import { cn } from "@workspace/ui/lib/utils"
import { FORMATS, formatTranscript, hasTranscriptText } from "./core/transcript"
import { NativeSelect } from "./input-fields"
import { TimedTranscriptRows } from "./timed-transcript-rows"
import type { Format, Transcript } from "./core/transcript"
import type { Messages } from "./types"
import type { RefObject } from "react"

export function TranscriptResult({
  filename,
  messages: m,
  transcript,
  audioRef,
  transcribing,
  preview,
  onChange,
}: {
  filename: string
  messages: Messages
  transcript: Transcript
  audioRef: RefObject<HTMLAudioElement | null>
  transcribing: boolean
  preview?: string
  onChange: (next: Transcript) => void
}) {
  const [format, setFormat] = useState<Format>("txt")
  const timed = transcript.kind === "timed"
  const selectedFormat = timed && !transcribing ? format : "txt"
  const extension = selectedFormat === "plain" ? "txt" : selectedFormat
  const textToCopy = useMemo(() => {
    if (transcribing) return ""
    return transcript.kind === "plain"
      ? transcript.text
      : formatTranscript(transcript.segments, "txt")
  }, [transcript, transcribing])
  const hasText = hasTranscriptText(transcript)
  const hint = transcribing
    ? m.partialHint
    : timed
      ? m.editHint
      : m.plainEditHint

  function download() {
    const basename = filename.replace(/\.[^.]+$/, "") || filename
    const text =
      transcript.kind === "plain"
        ? transcript.text
        : formatTranscript(transcript.segments, selectedFormat)
    const url = URL.createObjectURL(
      new Blob([text], { type: FORMATS[extension] })
    )
    const link = document.createElement("a")
    link.href = url
    link.download = `${basename}${transcribing ? ".partial" : ""}.${extension}`
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
            <p className="text-sm text-muted-foreground">{hint}</p>
          </div>
          <div className="flex max-w-full flex-wrap items-center gap-2">
            {!transcribing && (
              <ToolCopyButton
                className="h-auto min-h-10 max-w-full whitespace-normal"
                value={textToCopy}
                copyLabel={m.copy}
                copiedLabel={m.copied}
                failedLabel={m.copyError}
                disabled={!hasText}
              />
            )}
            <div className="flex flex-wrap items-center gap-2">
              {timed && !transcribing && (
                <NativeSelect
                  aria-label={m.exportFormat}
                  className="w-fit max-w-full"
                  value={format}
                  onChange={(event) =>
                    setFormat(event.currentTarget.value as Format)
                  }
                >
                  <option value="txt">{m.timedTxt}</option>
                  <option value="plain">{m.plainTxt}</option>
                  <option value="srt">SRT</option>
                  <option value="vtt">VTT</option>
                </NativeSelect>
              )}
              <Button
                type="button"
                className="h-auto min-h-10 whitespace-normal"
                disabled={!hasText}
                onClick={download}
              >
                <Download data-icon="inline-start" aria-hidden="true" />
                {transcribing
                  ? m.downloadPartial
                  : m.download.replace("{format}", extension.toUpperCase())}
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div
          className={cn(
            "overflow-hidden rounded-lg border",
            !timed && "focus-within:ring-2 focus-within:ring-ring/50"
          )}
        >
          {transcript.kind === "timed" ? (
            <TimedTranscriptRows
              segments={transcript.segments}
              audioRef={audioRef}
              messages={m}
              transcribing={transcribing}
              onEdit={(index, text) =>
                onChange({
                  kind: "timed",
                  segments: transcript.segments.map((segment, i) =>
                    i === index ? { ...segment, text } : segment
                  ),
                })
              }
            />
          ) : transcribing ? (
            hasText && (
              <p
                dir="auto"
                className="max-h-[36rem] overflow-y-auto px-4 py-3 text-sm leading-6 wrap-anywhere whitespace-pre-wrap"
              >
                {transcript.text}
              </p>
            )
          ) : (
            <Textarea
              aria-label={m.transcript}
              dir="auto"
              rows={6}
              value={transcript.text}
              className="max-h-[36rem] min-h-40 resize-y rounded-none border-0 px-4 py-3 text-start leading-6 focus-visible:ring-0 dark:bg-transparent"
              onChange={(event) =>
                onChange({
                  kind: "plain",
                  text: event.currentTarget.value,
                })
              }
            />
          )}
          {transcribing && (
            <div
              className={cn(
                "grid gap-2 bg-muted/25 px-4 py-3",
                hasText && "border-t"
              )}
            >
              {preview && (
                <div role="group" aria-label={m.livePreview}>
                  <p
                    dir="auto"
                    className="text-sm leading-6 wrap-anywhere text-muted-foreground"
                  >
                    {preview}
                  </p>
                </div>
              )}
              <p className="flex items-center gap-2 text-xs text-muted-foreground">
                <LoaderCircle
                  className="size-4 shrink-0 motion-safe:animate-spin"
                  aria-hidden="true"
                />
                {m.transcribing}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
