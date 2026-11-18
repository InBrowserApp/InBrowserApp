import { useEffect, useRef, useState } from "react"
import { Button } from "@workspace/ui/components/ui/button"
import {
  ToolPanelCard,
  ToolPanelCardContent,
} from "@workspace/ui/components/tool/tool-panel-card"
import { Film, Upload } from "@workspace/ui/icons"
import { cn } from "@workspace/ui/lib/utils"
import { Workspace } from "./workspace"
import type { Messages } from "./types"

export default function VideoFrameExtractor({
  messages: m,
  language,
}: {
  messages: Messages
  language: string
}) {
  const [source, setSource] = useState<{ file: File; url: string }>()
  const [dragging, setDragging] = useState(false)
  const input = useRef<HTMLInputElement>(null)
  const dragDepth = useRef(0)

  useEffect(() => {
    return source ? () => URL.revokeObjectURL(source.url) : undefined
  }, [source])

  function select(file: File) {
    setSource({ file, url: URL.createObjectURL(file) })
  }

  return (
    <div className="flex min-w-0 flex-col gap-5">
      <input
        ref={input}
        type="file"
        accept="video/*,.mp4,.m4v,.webm,.mov,.ogv,.mkv"
        aria-label={m.chooseVideo}
        aria-hidden="true"
        tabIndex={-1}
        className="sr-only"
        onChange={(event) => {
          const file = event.currentTarget.files?.[0]
          if (file) select(file)
          event.currentTarget.value = ""
        }}
      />
      <ToolPanelCard>
        <ToolPanelCardContent>
          <div
            className={cn(
              "rounded-lg border border-dashed",
              dragging && "border-primary bg-primary/5"
            )}
            onDragEnter={(event) => {
              event.preventDefault()
              if (++dragDepth.current === 1) setDragging(true)
            }}
            onDragOver={(event) => {
              event.preventDefault()
              event.dataTransfer.dropEffect = "copy"
            }}
            onDragLeave={() => {
              if (--dragDepth.current === 0) setDragging(false)
            }}
            onDrop={(event) => {
              event.preventDefault()
              dragDepth.current = 0
              setDragging(false)
              const file = event.dataTransfer.files[0]
              if (file) select(file)
            }}
          >
            {source ? (
              <div className="flex flex-wrap items-center gap-3 p-3">
                <Film
                  className="size-5 shrink-0 text-muted-foreground"
                  aria-hidden="true"
                />
                <p className="min-w-0 flex-1 basis-24 font-medium break-all">
                  <bdi>{source.file.name}</bdi>
                </p>
                <Button
                  type="button"
                  variant="outline"
                  className="min-h-11 sm:min-h-0"
                  onClick={() => input.current?.click()}
                >
                  {m.changeVideo}
                </Button>
              </div>
            ) : (
              <button
                type="button"
                aria-labelledby="frame-picker-label"
                aria-describedby="frame-picker-hint frame-picker-formats"
                className="flex min-h-48 w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-lg px-4 py-6 text-center hover:bg-muted/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                onClick={() => input.current?.click()}
              >
                <Upload
                  className="mb-1 size-7 text-muted-foreground"
                  aria-hidden="true"
                />
                <span id="frame-picker-label" className="font-medium">
                  {m.chooseVideo}
                </span>
                <span
                  id="frame-picker-hint"
                  className="text-sm text-muted-foreground"
                >
                  {m.dropHint}
                </span>
                <span
                  id="frame-picker-formats"
                  className="text-xs text-muted-foreground"
                >
                  {m.formats}
                </span>
              </button>
            )}
          </div>
          {!source && (
            <p className="mt-3 text-center text-xs text-muted-foreground">
              {m.privacy}
            </p>
          )}
        </ToolPanelCardContent>
      </ToolPanelCard>
      {source && (
        <Workspace
          key={source.url}
          source={source}
          messages={m}
          language={language}
        />
      )}
    </div>
  )
}
