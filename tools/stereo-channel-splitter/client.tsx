import { useEffect, useRef, useState } from "react"
import { Alert, AlertDescription } from "@workspace/ui/components/ui/alert"
import { Button } from "@workspace/ui/components/ui/button"
import {
  ToolPanelCard,
  ToolPanelCardContent,
} from "@workspace/ui/components/tool/tool-panel-card"
import {
  Download,
  LoaderCircle,
  Split,
  TriangleAlert,
  Upload,
} from "@workspace/ui/icons"
import { cn } from "@workspace/ui/lib/utils"

import { splitStereoFile, type SplitResult } from "./core/split"
import type englishMessages from "./messages/en.json"

type Messages = typeof englishMessages
type Channels = Extract<SplitResult, { left: Blob }>
type InputError = Extract<SplitResult, { error: string }>["error"] | "readError"
type Output = { file: File; channels: Channels }
type State = {
  output?: Output
} & (
  | { status: "idle" | "processing" | "ready" }
  | { status: "error"; error: InputError }
)

export default function StereoChannelSplitter({
  messages: m,
}: {
  messages: Messages
}) {
  const input = useRef<HTMLInputElement>(null)
  const request = useRef<AbortController>(null)
  const [state, setState] = useState<State>({ status: "idle" })
  const [dragging, setDragging] = useState(false)
  const { output, status } = state
  const processing = status === "processing"

  useEffect(() => () => request.current?.abort(), [])

  async function selectFile(file?: File) {
    if (!file) return
    request.current?.abort()
    const controller = new AbortController()
    request.current = controller
    const { signal } = controller
    setState((previous) => ({ status: "processing", output: previous.output }))
    const result = await splitStereoFile(file, signal).catch(
      () => ({ error: "readError" }) as const
    )
    if (signal.aborted) return
    setState((previous) =>
      "error" in result
        ? { status: "error", error: result.error, output: previous.output }
        : { status: "ready", output: { file, channels: result } }
    )
  }

  return (
    <div className="grid gap-4">
      <ToolPanelCard>
        <ToolPanelCardContent className="gap-3">
          <div
            className={cn(
              "rounded-lg border border-dashed transition-colors",
              dragging && "border-primary bg-primary/5"
            )}
            onDragOver={(event) => {
              if (!event.dataTransfer.types.includes("Files")) return
              event.preventDefault()
              event.dataTransfer.dropEffect = "copy"
              setDragging(true)
            }}
            onDragLeave={(event) => {
              if (
                !event.currentTarget.contains(
                  event.relatedTarget as Node | null
                )
              ) {
                setDragging(false)
              }
            }}
            onDrop={(event) => {
              event.preventDefault()
              setDragging(false)
              void selectFile(event.dataTransfer.files[0])
            }}
          >
            <input
              ref={input}
              type="file"
              accept="audio/*,.wav,.mp3,.m4a,.flac,.ogg,.oga,.aac,.opus,.webm"
              className="hidden"
              onChange={(event) => {
                void selectFile(event.currentTarget.files?.[0])
                event.currentTarget.value = ""
              }}
            />
            <div
              className={cn(output && "flex flex-wrap items-center gap-3 p-3")}
            >
              {output && (
                <>
                  <Split
                    className="size-5 shrink-0 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <p className="min-w-0 flex-1 basis-32 font-medium wrap-anywhere">
                    <bdi>{output.file.name}</bdi>
                  </p>
                </>
              )}
              <Button
                type="button"
                variant={output ? "outline" : "ghost"}
                aria-label={output ? m.changeFile : m.chooseFile}
                className={
                  output
                    ? "min-h-11 sm:min-h-0"
                    : "h-auto min-h-44 w-full flex-col gap-2 px-4 py-6 whitespace-normal"
                }
                onClick={() => input.current?.click()}
              >
                {output ? (
                  m.changeFile
                ) : (
                  <>
                    <Upload
                      className="mb-1 size-7 text-muted-foreground"
                      aria-hidden="true"
                    />
                    <span>{m.chooseFile}</span>
                    <span className="font-normal text-muted-foreground">
                      {m.dropHint}
                    </span>
                    <span className="mt-1 text-xs font-normal text-muted-foreground">
                      {m.formats}
                    </span>
                  </>
                )}
              </Button>
            </div>
          </div>
          <p className="text-center text-xs text-muted-foreground">
            {m.privacy}
          </p>
        </ToolPanelCardContent>
      </ToolPanelCard>

      <div
        role="status"
        className={processing ? "flex items-center gap-2 text-sm" : "sr-only"}
      >
        {processing ? (
          <>
            <LoaderCircle
              className="size-4 shrink-0 motion-safe:animate-spin"
              aria-hidden="true"
            />
            {m.processing}
          </>
        ) : status === "ready" ? (
          m.ready
        ) : null}
      </div>
      {status === "error" && (
        <Alert variant="destructive" className="text-start">
          <TriangleAlert aria-hidden="true" />
          <AlertDescription>{m[state.error]}</AlertDescription>
        </Alert>
      )}
      {output && <ChannelResults output={output} messages={m} />}
    </div>
  )
}

function ChannelResults({
  output,
  messages: m,
}: {
  output: Output
  messages: Messages
}) {
  const playing = useRef<HTMLAudioElement>(null)
  const dot = output.file.name.lastIndexOf(".")
  const stem = dot > 0 ? output.file.name.slice(0, dot) : output.file.name

  function pauseOtherPlayer(player: HTMLAudioElement) {
    if (playing.current !== player) playing.current?.pause()
    playing.current = player
  }

  return (
    <div className="grid min-w-0 gap-4 sm:grid-cols-2">
      <ChannelCard
        blob={output.channels.left}
        title={m.left}
        download={m.downloadLeft}
        filename={`${stem}-left.wav`}
        onPlay={pauseOtherPlayer}
      />
      <ChannelCard
        blob={output.channels.right}
        title={m.right}
        download={m.downloadRight}
        filename={`${stem}-right.wav`}
        onPlay={pauseOtherPlayer}
      />
    </div>
  )
}

function ChannelCard({
  blob,
  title,
  download,
  filename,
  onPlay,
}: {
  blob: Blob
  title: string
  download: string
  filename: string
  onPlay: (player: HTMLAudioElement) => void
}) {
  const [preview, setPreview] = useState<{ blob: Blob; url: string }>()
  const url = preview?.blob === blob ? preview.url : undefined
  useEffect(() => {
    const url = URL.createObjectURL(blob)
    setPreview({ blob, url })
    return () => URL.revokeObjectURL(url)
  }, [blob])

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
          src={url}
          onPlay={(event) => onPlay(event.currentTarget)}
        />
        {url && (
          <Button
            asChild
            className="h-auto min-h-11 max-w-full self-start whitespace-normal sm:min-h-9"
          >
            <a href={url} download={filename}>
              <Download data-icon="inline-start" aria-hidden="true" />
              {download}
            </a>
          </Button>
        )}
      </ToolPanelCardContent>
    </ToolPanelCard>
  )
}
