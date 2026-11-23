import { useEffect, useRef, useState } from "react"
import {
  ToolPanelCard,
  ToolPanelCardContent,
} from "@workspace/ui/components/tool/tool-panel-card"
import { Button } from "@workspace/ui/components/ui/button"
import { Upload } from "@workspace/ui/icons"
import type { Messages } from "./types"
import { Workspace } from "./workspace"

function clearRecordingFragment() {
  const { pathname, search } = window.location
  window.history.replaceState(window.history.state, "", pathname + search)
}

export default function VideoTrimmer({
  messages: m,
  language,
}: {
  messages: Messages
  language: string
}) {
  const picker = useRef<HTMLInputElement>(null)
  const recordingRequest = useRef<AbortController>(null)
  const [source, setSource] = useState<{ file: File; url: string }>()
  const [handoff, setHandoff] = useState<"opening" | "failed">()
  const [dragging, setDragging] = useState(false)

  useEffect(() => {
    return () => {
      if (source) URL.revokeObjectURL(source.url)
    }
  }, [source])

  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.slice(1))
    const url = params.get("recording")
    const name = params.get("name")
    if (!url?.startsWith(`blob:${window.location.origin}/`) || !name) return

    const controller = new AbortController()
    recordingRequest.current = controller
    setHandoff("opening")
    void (async () => {
      try {
        const response = await fetch(url, { signal: controller.signal })
        const blob = await response.blob()
        if (controller.signal.aborted) return
        const file = new File([blob], name, { type: blob.type })
        setSource({ file, url: URL.createObjectURL(file) })
        setHandoff(undefined)
      } catch {
        if (!controller.signal.aborted) setHandoff("failed")
      } finally {
        if (!controller.signal.aborted) clearRecordingFragment()
      }
    })()
    return () => controller.abort()
  }, [])

  function selectVideo(file: File) {
    if (handoff === "opening") {
      recordingRequest.current?.abort()
      clearRecordingFragment()
    }
    setHandoff(undefined)
    setSource({ file, url: URL.createObjectURL(file) })
  }

  return (
    <div className="grid min-w-0 gap-4">
      <input
        ref={picker}
        type="file"
        accept=".mp4,.webm,video/mp4,video/webm"
        hidden
        onChange={(event) => {
          const file = event.currentTarget.files?.[0]
          if (file) selectVideo(file)
          event.currentTarget.value = ""
        }}
      />
      <ToolPanelCard>
        <ToolPanelCardContent>
          <div
            className={
              source
                ? "flex min-w-0 flex-wrap items-center justify-between gap-3 rounded-lg"
                : `grid min-h-44 place-content-center justify-items-center gap-2 rounded-lg border border-dashed px-4 py-5 text-center ${dragging ? "border-primary bg-accent" : "border-border bg-muted/30"}`
            }
            onDragOver={(event) => {
              if (!event.dataTransfer.types.includes("Files")) return
              event.preventDefault()
              setDragging(true)
            }}
            onDragLeave={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget as Node))
                setDragging(false)
            }}
            onDrop={(event) => {
              event.preventDefault()
              setDragging(false)
              const file = event.dataTransfer.files[0]
              if (file) selectVideo(file)
            }}
          >
            {source && (
              <p className="min-w-0 text-sm font-medium break-all">
                <bdi>{source.file.name}</bdi>
              </p>
            )}
            <Button
              type="button"
              variant={source ? "outline" : "default"}
              className="h-auto min-h-11 whitespace-normal sm:min-h-9"
              onClick={() => picker.current?.click()}
            >
              {!source && <Upload aria-hidden="true" />}
              {source ? m.replaceVideo : m.chooseVideo}
            </Button>
            {!source && (
              <p className="text-sm text-muted-foreground">{m.dropVideo}</p>
            )}
          </div>
          {handoff === "opening" && (
            <p role="status" className="text-sm text-muted-foreground">
              {m.loading}
            </p>
          )}
          {handoff === "failed" && (
            <p role="alert" className="text-sm text-destructive">
              {m.recordingError}
            </p>
          )}
        </ToolPanelCardContent>
      </ToolPanelCard>
      {source && (
        <Workspace
          key={source.url}
          source={source}
          language={language}
          messages={m}
        />
      )}
    </div>
  )
}
