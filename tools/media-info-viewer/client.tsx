import { useRef, useState } from "react"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/ui/alert"
import { Button } from "@workspace/ui/components/ui/button"
import {
  ToolPanelCard,
  ToolPanelCardContent,
} from "@workspace/ui/components/tool/tool-panel-card"
import {
  FileText,
  LoaderCircle,
  TriangleAlert,
  Upload,
  X,
} from "@workspace/ui/icons"
import { cn } from "@workspace/ui/lib/utils"
import { Results } from "./components/results"
import { fileSize } from "./core/report"
import { useAnalysis } from "./use-analysis"
import type { Messages } from "./types"

const ACCEPT =
  "audio/*,video/*,.mkv,.flac,.ogg,.opus,.m4a,.m4v,.mov,.avi,.webm,.mts,.m2ts,.ts,.vob,.wmv,.wma,.aiff,.aif,.ac3,.dts"

export default function MediaInfoViewer({
  messages: m,
  language,
}: {
  messages: Messages
  language: string
}) {
  const [file, setFile] = useState<File | null>(null)
  const [dragging, setDragging] = useState(false)
  const depth = useRef(0)
  const input = useRef<HTMLInputElement>(null)
  const { reply, busy } = useAnalysis(file)
  const result = reply && "result" in reply ? reply.result : null
  const error =
    file?.size === 0
      ? m.emptyFile
      : reply && "error" in reply
        ? m[reply.error]
        : ""
  function select(next: File | null) {
    depth.current = 0
    setDragging(false)
    setFile(next)
  }
  return (
    <div className="flex min-w-0 flex-col gap-6">
      <input
        ref={input}
        aria-label={m.chooseFile}
        className="sr-only"
        tabIndex={-1}
        type="file"
        accept={ACCEPT}
        onChange={(event) => {
          const selected = event.target.files?.[0]
          if (selected) select(selected)
          event.target.value = ""
        }}
      />
      <ToolPanelCard>
        <ToolPanelCardContent className="gap-3">
          <div
            onDragEnter={(event) => {
              event.preventDefault()
              depth.current++
              setDragging(true)
            }}
            onDragOver={(event) => {
              event.preventDefault()
              event.dataTransfer.dropEffect = "copy"
            }}
            onDragLeave={(event) => {
              event.preventDefault()
              if (--depth.current <= 0) setDragging(false)
            }}
            onDrop={(event) => {
              event.preventDefault()
              const dropped = event.dataTransfer.files[0]
              if (dropped) select(dropped)
            }}
            className={cn(
              "rounded-lg border border-dashed transition-colors",
              dragging && "border-foreground bg-muted"
            )}
          >
            {file ? (
              <div className="flex flex-wrap items-center gap-3 p-4">
                <FileText className="size-8 shrink-0 text-muted-foreground" />
                <div className="min-w-0 flex-1 basis-40">
                  <p className="font-medium break-all">
                    <bdi>{file.name}</bdi>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {fileSize(file.size, language)}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => input.current?.click()}
                >
                  {m.changeFile}
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={m.removeFile}
                  onClick={() => select(null)}
                >
                  <X />
                </Button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => input.current?.click()}
                className="flex min-h-56 w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-lg p-6 text-center hover:bg-muted/30 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              >
                <Upload className="size-7 text-muted-foreground" />
                <span className="text-base font-medium">{m.chooseFile}</span>
                <span className="text-sm text-muted-foreground">
                  {m.dropHint}
                </span>
                <span className="text-xs text-muted-foreground">
                  {m.formats}
                </span>
              </button>
            )}
          </div>
          <p className="text-center text-xs text-muted-foreground">
            {m.privacy}
          </p>
        </ToolPanelCardContent>
      </ToolPanelCard>
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className={
          busy
            ? "flex flex-col items-center gap-2 rounded-xl border border-dashed p-8 text-center"
            : "sr-only"
        }
      >
        {busy ? (
          <>
            <LoaderCircle className="size-6 animate-spin text-muted-foreground" />
            <p className="font-medium">{m.reading}</p>
            <p className="text-sm text-muted-foreground">{m.readingHint}</p>
          </>
        ) : result ? (
          `${m.overview}. ${m.video}: ${result.media?.track.filter((track) => track["@type"] === "Video").length}. ${m.audio}: ${result.media?.track.filter((track) => track["@type"] === "Audio").length}.`
        ) : (
          ""
        )}
      </div>
      {error ? (
        <Alert variant="destructive" role="alert">
          <TriangleAlert />
          <AlertTitle>{m.errorTitle}</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}
      {result && file ? (
        <Results result={result} file={file} messages={m} language={language} />
      ) : null}
    </div>
  )
}
