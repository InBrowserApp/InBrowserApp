import { useEffect, useId, useRef, useState } from "react"
import { Button } from "@workspace/ui/components/ui/button"
import {
  ToolPanelCard,
  ToolPanelCardContent,
} from "@workspace/ui/components/tool/tool-panel-card"
import { Download, Film, Upload } from "@workspace/ui/icons"
import { cn } from "@workspace/ui/lib/utils"
import type { Track } from "./extract"
import type messages from "./messages/en.json"

export type Messages = typeof messages

export default function VideoAudioExtractor({
  messages: m,
  language,
}: {
  messages: Messages
  language: string
}) {
  const input = useRef<HTMLInputElement>(null)
  const [video, setVideo] = useState<{ file: File; key: number }>()

  function select(file: File) {
    setVideo((previous) => ({ file, key: (previous?.key ?? 0) + 1 }))
  }

  return (
    <div className="flex min-w-0 flex-col gap-5">
      <ToolPanelCard>
        <ToolPanelCardContent>
          <div
            className="rounded-lg border border-dashed"
            onDragOver={(event) => {
              event.preventDefault()
              event.dataTransfer.dropEffect = "copy"
            }}
            onDrop={(event) => {
              event.preventDefault()
              const file = event.dataTransfer.files[0]
              if (file) select(file)
            }}
          >
            <input
              ref={input}
              type="file"
              accept="video/mp4,video/webm,.mp4,.webm"
              aria-hidden="true"
              tabIndex={-1}
              className="sr-only"
              onChange={(event) => {
                const file = event.currentTarget.files?.[0]
                if (file) select(file)
                event.currentTarget.value = ""
              }}
            />
            <div
              className={cn(video && "flex flex-wrap items-center gap-3 p-3")}
            >
              {video && (
                <>
                  <Film
                    className="size-5 shrink-0 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <p className="min-w-0 flex-1 basis-40 font-medium break-all">
                    <bdi>{video.file.name}</bdi>
                  </p>
                </>
              )}
              <Button
                type="button"
                variant={video ? "outline" : "ghost"}
                aria-label={video ? m.changeVideo : m.chooseVideo}
                className={
                  video
                    ? "min-h-11 sm:min-h-0"
                    : "h-auto min-h-44 w-full flex-col gap-2 rounded-lg whitespace-normal"
                }
                onClick={() => input.current?.click()}
              >
                {video ? (
                  m.changeVideo
                ) : (
                  <>
                    <Upload
                      className="mb-1 size-7 text-muted-foreground"
                      aria-hidden="true"
                    />
                    <span>{m.chooseVideo}</span>
                    <span className="font-normal text-muted-foreground">
                      {m.dropHint}
                    </span>
                  </>
                )}
              </Button>
            </div>
          </div>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            {m.privacy}
          </p>
        </ToolPanelCardContent>
      </ToolPanelCard>
      {video && (
        <TrackPicker
          key={video.key}
          file={video.file}
          messages={m}
          language={language}
        />
      )}
    </div>
  )
}

function TrackPicker({
  file,
  messages: m,
  language,
}: {
  file: File
  messages: Messages
  language: string
}) {
  const id = useId()
  const [tracks, setTracks] = useState<Track[] | null>()
  const [selected, setSelected] = useState<number>()
  useEffect(() => {
    let active = true
    let input: ReturnType<typeof import("./extract").openVideo> | undefined
    void import("./extract")
      .then(async ({ openVideo, readAudioTracks }) => {
        if (!active) return
        input = openVideo(file)
        const result = await readAudioTracks(input)
        if (active) setTracks(result)
      })
      .catch(() => {
        if (active) setTracks(null)
      })
    return () => {
      active = false
      input?.dispose()
    }
  }, [file])

  if (!tracks?.length) {
    return (
      <ToolPanelCard>
        <ToolPanelCardContent>
          <p role="status" className="text-sm text-muted-foreground">
            {tracks === undefined
              ? m.reading
              : tracks === null
                ? m.readError
                : m.noAudio}
          </p>
        </ToolPanelCardContent>
      </ToolPanelCard>
    )
  }

  const track =
    tracks.find((entry) => entry.number === selected) ??
    tracks.find((entry) => entry.output) ??
    tracks[0]!
  const languageNames = new Intl.DisplayNames(language, { type: "language" })
  const numbers = new Intl.NumberFormat(language)

  return (
    <ToolPanelCard>
      <ToolPanelCardContent className="flex flex-col gap-4">
        <div className="grid gap-2">
          <label htmlFor={id} className="text-sm font-medium">
            {m.audioTrack}
          </label>
          <select
            id={id}
            className="min-h-11 w-full min-w-0 rounded-md border bg-background px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none sm:min-h-9"
            value={track.number}
            onChange={(event) => setSelected(Number(event.currentTarget.value))}
          >
            {tracks.map(({ number, codec, language: code, name }) => (
              <option key={number} value={number}>
                {[
                  m.trackNumber.replace("{number}", numbers.format(number)),
                  code === "und" ? null : languageNames.of(code),
                  name,
                  codec === "aac" ? "AAC" : codec,
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </option>
            ))}
          </select>
        </div>
        <TrackPreview
          key={track.number}
          track={track}
          file={file}
          messages={m}
        />
      </ToolPanelCardContent>
    </ToolPanelCard>
  )
}

function TrackPreview({
  track,
  file,
  messages: m,
}: {
  track: Track
  file: File
  messages: Messages
}) {
  const [url, setUrl] = useState<string | null>()
  const [previewError, setPreviewError] = useState(false)
  const output = track.output

  useEffect(() => {
    if (!output) return
    const controller = new AbortController()
    let objectUrl: string | undefined
    void output
      .extract(controller.signal)
      .then((blob) => {
        if (controller.signal.aborted) return
        objectUrl = URL.createObjectURL(blob)
        setUrl(objectUrl)
      })
      .catch(() => {
        if (!controller.signal.aborted) setUrl(null)
      })
    return () => {
      controller.abort()
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [output])

  if (!url || !output) {
    return (
      <p role="status" className="text-sm text-muted-foreground">
        {!output
          ? m.unsupportedTrack
          : url === null
            ? m.exportError
            : m.preparing}
      </p>
    )
  }

  const { extension } = output
  const filename = `${file.name.replace(/\.[^.]+$/, "")}-track-${track.number}.${extension}`
  return (
    <div className="flex min-w-0 flex-col gap-3">
      {previewError ? (
        <p role="status" className="text-sm text-muted-foreground">
          {m.previewError}
        </p>
      ) : (
        <>
          <p className="text-sm font-medium">{m.preview}</p>
          {/* oxlint-disable-next-line jsx-a11y/media-has-caption -- Preview plays user-supplied audio. */}
          <audio
            aria-label={m.preview}
            className="w-full"
            controls
            preload="metadata"
            src={url}
            onError={() => setPreviewError(true)}
          />
        </>
      )}
      <Button asChild className="min-h-11 self-start sm:min-h-0">
        <a href={url} download={filename}>
          <Download data-icon="inline-start" aria-hidden="true" />
          {m.download.replace("{format}", extension.toUpperCase())}
        </a>
      </Button>
    </div>
  )
}
