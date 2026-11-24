import { useEffect, useId, useRef, useState } from "react"
import { Alert, AlertDescription } from "@workspace/ui/components/ui/alert"
import { Button } from "@workspace/ui/components/ui/button"
import {
  ToolPanelCard,
  ToolPanelCardContent,
} from "@workspace/ui/components/tool/tool-panel-card"
import { Download, LoaderCircle, TriangleAlert } from "@workspace/ui/icons"

import { encodeDownloads } from "./export"
import type { ChannelFiles, DownloadFormat } from "./core/formats"
import type englishMessages from "./messages/en.json"

type Messages = typeof englishMessages
type DownloadState =
  | { format: DownloadFormat; state: "ready"; files: ChannelFiles }
  | { format: Exclude<DownloadFormat, "wav">; state: "preparing" | "error" }

export function ChannelResults({
  filename,
  files,
  flacAvailable,
  messages: m,
}: {
  filename: string
  files: ChannelFiles
  flacAvailable: boolean
  messages: Messages
}) {
  const selectId = useId()
  const request = useRef<AbortController>(null)
  const playing = useRef<HTMLAudioElement>(null)
  const [download, setDownload] = useState<DownloadState>({
    format: "wav",
    state: "ready",
    files,
  })
  const dot = filename.lastIndexOf(".")
  const stem = dot > 0 ? filename.slice(0, dot) : filename
  const formatName = download.format.toUpperCase()
  const readyFiles = download.state === "ready" ? download.files : undefined
  const preparing = download.state === "preparing"

  useEffect(() => () => request.current?.abort(), [])

  async function chooseFormat(format: DownloadFormat) {
    request.current?.abort()
    if (format === "wav") {
      setDownload({ format, state: "ready", files })
      return
    }
    const { signal } = (request.current = new AbortController())
    setDownload({ format, state: "preparing" })
    const encoded = await encodeDownloads({ files, format }, signal).catch(
      () => null
    )
    if (signal.aborted) return
    setDownload(
      encoded
        ? { format, state: "ready", files: encoded }
        : { format, state: "error" }
    )
  }

  function pauseOtherPlayer(player: HTMLAudioElement) {
    if (playing.current !== player) playing.current?.pause()
    playing.current = player
  }

  return (
    <div className="grid gap-3">
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        <label htmlFor={selectId} className="text-sm font-medium">
          {m.formatLabel}
        </label>
        <select
          id={selectId}
          className="min-h-11 w-full max-w-full rounded-md border bg-background px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none sm:min-h-9 sm:w-auto"
          value={download.format}
          aria-describedby={!flacAvailable ? `${selectId}-note` : undefined}
          onChange={(event) =>
            void chooseFormat(event.currentTarget.value as DownloadFormat)
          }
        >
          <option value="wav">{m.wavOption}</option>
          <option value="flac" disabled={!flacAvailable}>
            {m.flacOption}
          </option>
          <option value="mp3">{m.mp3Option}</option>
        </select>
      </div>
      {!flacAvailable && (
        <p id={`${selectId}-note`} className="text-sm text-muted-foreground">
          {m.flacUnavailable}
        </p>
      )}
      <p
        role="status"
        className={
          preparing
            ? "flex items-center gap-2 text-sm text-muted-foreground"
            : "sr-only"
        }
      >
        {preparing ? (
          <>
            <LoaderCircle
              className="size-4 shrink-0 motion-safe:animate-spin"
              aria-hidden="true"
            />
            {m.preparingDownload.replace("{format}", formatName)}
          </>
        ) : readyFiles && download.format !== "wav" ? (
          m.ready
        ) : null}
      </p>
      {download.state === "error" && (
        <Alert variant="destructive" className="text-start">
          <TriangleAlert aria-hidden="true" />
          <AlertDescription className="flex flex-wrap items-center gap-2">
            <span>{m.exportError.replace("{format}", formatName)}</span>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => void chooseFormat(download.format)}
            >
              {m.retry}
            </Button>
          </AlertDescription>
        </Alert>
      )}
      <div className="grid min-w-0 gap-4 sm:grid-cols-2">
        <ChannelCard
          preview={files.left}
          download={readyFiles?.left}
          title={m.left}
          label={m.downloadLeft.replace("{format}", formatName)}
          filename={`${stem}-left.${download.format}`}
          onPlay={pauseOtherPlayer}
        />
        <ChannelCard
          preview={files.right}
          download={readyFiles?.right}
          title={m.right}
          label={m.downloadRight.replace("{format}", formatName)}
          filename={`${stem}-right.${download.format}`}
          onPlay={pauseOtherPlayer}
        />
      </div>
    </div>
  )
}

function useBlobUrl(blob?: Blob) {
  const [preview, setPreview] = useState<{ blob: Blob; url: string }>()
  useEffect(() => {
    if (!blob) {
      setPreview(undefined)
      return
    }
    const url = URL.createObjectURL(blob)
    setPreview({ blob, url })
    return () => URL.revokeObjectURL(url)
  }, [blob])
  return preview && preview.blob === blob ? preview.url : undefined
}

function ChannelCard({
  preview,
  download,
  title,
  label,
  filename,
  onPlay,
}: {
  preview: Blob
  download?: Blob
  title: string
  label: string
  filename: string
  onPlay: (player: HTMLAudioElement) => void
}) {
  const previewUrl = useBlobUrl(preview)
  const encodedUrl = useBlobUrl(download === preview ? undefined : download)
  const downloadUrl = download === preview ? previewUrl : encodedUrl
  return (
    <ToolPanelCard className="min-w-0">
      <ToolPanelCardContent className="gap-3">
        <h2 className="font-medium">{title}</h2>
        {/* oxlint-disable-next-line jsx-a11y/media-has-caption -- Preview plays user-supplied audio. */}
        <audio
          aria-label={title}
          className="w-full min-w-0"
          controls
          controlsList="nodownload"
          preload="metadata"
          src={previewUrl}
          onPlay={(event) => onPlay(event.currentTarget)}
        />
        {downloadUrl && (
          <Button
            asChild
            className="h-auto min-h-11 max-w-full self-start whitespace-normal sm:min-h-9"
          >
            <a href={downloadUrl} download={filename}>
              <Download data-icon="inline-start" aria-hidden="true" />
              {label}
            </a>
          </Button>
        )}
      </ToolPanelCardContent>
    </ToolPanelCard>
  )
}
