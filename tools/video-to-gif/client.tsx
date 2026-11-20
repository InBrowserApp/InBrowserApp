import { useEffect, useRef, useState } from "react"
import { Button } from "@workspace/ui/components/ui/button"
import {
  ToolPanelCard,
  ToolPanelCardContent,
} from "@workspace/ui/components/tool/tool-panel-card"
import { Film, Upload } from "@workspace/ui/icons"
import { cn } from "@workspace/ui/lib/utils"
import { Workspace } from "./workspace"
import type { Messages, PreviewMessages } from "./types"

export default function VideoToGif({
  messages: m,
  previewMessages,
  language,
}: {
  messages: Messages
  previewMessages: PreviewMessages
  language: string
}) {
  const [source, setSource] = useState<{ file: File; url: string }>()
  const [dragging, setDragging] = useState(false)
  const input = useRef<HTMLInputElement>(null)
  const dragDepth = useRef(0)

  useEffect(
    () => (source ? () => URL.revokeObjectURL(source.url) : undefined),
    [source]
  )

  function open(file: File) {
    setSource({ file, url: URL.createObjectURL(file) })
  }

  return (
    <div className="flex min-w-0 flex-col gap-4">
      <input
        ref={input}
        type="file"
        accept="video/*,.mp4,.m4v,.webm,.mov,.ogv,.mkv"
        hidden
        onChange={(event) => {
          const file = event.currentTarget.files?.[0]
          if (file) open(file)
          event.currentTarget.value = ""
        }}
      />
      <ToolPanelCard>
        <ToolPanelCardContent className="gap-3">
          <div
            className={cn(
              "rounded-lg border border-dashed",
              dragging && "border-primary bg-primary/5"
            )}
            onDragEnter={(event) => {
              event.preventDefault()
              if (++dragDepth.current === 1) setDragging(true)
            }}
            onDragOver={(event) => event.preventDefault()}
            onDragLeave={() => {
              if (--dragDepth.current === 0) setDragging(false)
            }}
            onDrop={(event) => {
              event.preventDefault()
              dragDepth.current = 0
              setDragging(false)
              const file = event.dataTransfer.files[0]
              if (file) open(file)
            }}
          >
            {source ? (
              <div className="flex flex-wrap items-center gap-3 p-3">
                <Film
                  className="size-5 shrink-0 text-muted-foreground"
                  aria-hidden="true"
                />
                <p className="min-w-0 flex-1 basis-32 font-medium break-all">
                  <bdi>{source.file.name}</bdi>
                </p>
                <Button
                  type="button"
                  variant="outline"
                  className="h-auto min-h-10 whitespace-normal"
                  onClick={() => input.current?.click()}
                >
                  {m.changeVideo}
                </Button>
              </div>
            ) : (
              <div className="flex min-h-52 flex-col items-center justify-center gap-2 px-4 py-6 text-center">
                <Upload
                  className="mb-1 size-7 text-muted-foreground"
                  aria-hidden="true"
                />
                <Button
                  type="button"
                  className="h-auto min-h-11 whitespace-normal"
                  aria-describedby="gif-video-formats"
                  onClick={() => input.current?.click()}
                >
                  {m.chooseVideo}
                </Button>
                <p className="text-sm text-muted-foreground">{m.dropVideo}</p>
                <p
                  id="gif-video-formats"
                  className="text-xs text-muted-foreground"
                >
                  {m.formats}
                </p>
              </div>
            )}
          </div>
          {!source && (
            <p className="text-center text-xs text-muted-foreground">
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
          previewMessages={previewMessages}
          language={language}
        />
      )}
    </div>
  )
}
