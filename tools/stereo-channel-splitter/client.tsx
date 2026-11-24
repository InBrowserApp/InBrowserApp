import { useEffect, useRef, useState } from "react"
import { Alert, AlertDescription } from "@workspace/ui/components/ui/alert"
import { Button } from "@workspace/ui/components/ui/button"
import {
  ToolPanelCard,
  ToolPanelCardContent,
} from "@workspace/ui/components/tool/tool-panel-card"
import { LoaderCircle, Split, TriangleAlert, Upload } from "@workspace/ui/icons"
import { cn } from "@workspace/ui/lib/utils"

import { ChannelResults } from "./channel-results"
import type { SplitResult } from "./split"
import type englishMessages from "./messages/en.json"

type Messages = typeof englishMessages
type Channels = Exclude<SplitResult, { error: string }>
type InputError = Extract<SplitResult, { error: string }>["error"] | "readError"
type Output = { id: number; file: File; channels: Channels }
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
    const result = await import("./split")
      .then(({ splitStereoFile }) => splitStereoFile(file, signal))
      .catch(() => ({ error: "readError" }) as const)
    if (signal.aborted) return
    setState((previous) =>
      "error" in result
        ? { status: "error", error: result.error, output: previous.output }
        : {
            status: "ready",
            output: {
              id: (previous.output?.id ?? 0) + 1,
              file,
              channels: result,
            },
          }
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
      {output && (
        <ChannelResults
          key={output.id}
          filename={output.file.name}
          {...output.channels}
          messages={m}
        />
      )}
    </div>
  )
}
