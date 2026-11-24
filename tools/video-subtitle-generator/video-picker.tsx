import { useRef, useState } from "react"
import { Button } from "@workspace/ui/components/ui/button"
import { Film, Lock, Upload } from "@workspace/ui/icons"
import { cn } from "@workspace/ui/lib/utils"
import type { Controls } from "./types"

export function VideoPicker({
  file,
  disabled,
  onVideo,
  messages: m,
}: {
  file: File | null
  disabled: boolean
  onVideo: (file: File) => void
  messages: Controls
}) {
  const input = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  return (
    <div
      className={cn(
        file &&
          dragging &&
          "rounded-lg outline-2 outline-offset-4 outline-primary"
      )}
      onDragOver={(event) => {
        if (!event.dataTransfer.types.includes("Files")) return
        event.preventDefault()
        event.dataTransfer.dropEffect = disabled ? "none" : "copy"
        setDragging(!disabled)
      }}
      onDragLeave={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null))
          setDragging(false)
      }}
      onDrop={(event) => {
        event.preventDefault()
        setDragging(false)
        const video = event.dataTransfer.files[0]
        if (!disabled && video) onVideo(video)
      }}
    >
      <input
        ref={input}
        type="file"
        accept="video/*,.mp4,.mkv,.webm,.mov"
        aria-label={m.chooseVideo}
        hidden
        disabled={disabled}
        onChange={(event) => {
          const video = event.currentTarget.files?.[0]
          if (video) onVideo(video)
          event.currentTarget.value = ""
        }}
      />
      {file ? (
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="flex min-w-0 items-center gap-2 text-sm font-medium">
            <Film
              className="size-4 shrink-0 text-muted-foreground"
              aria-hidden
            />
            <span className="wrap-anywhere" dir="auto">
              {file.name}
            </span>
          </p>
          <Button
            type="button"
            variant="outline"
            onClick={() => input.current?.click()}
            disabled={disabled}
          >
            {m.changeVideo}
          </Button>
        </div>
      ) : (
        <div
          className={cn(
            "grid justify-items-center gap-4 rounded-xl border border-dashed bg-muted/35 px-4 py-9 text-center sm:py-12",
            dragging && "border-primary bg-primary/5"
          )}
        >
          <div className="grid size-12 place-items-center rounded-xl border bg-background shadow-xs">
            <Film className="size-6 text-muted-foreground" aria-hidden />
          </div>
          <div className="space-y-1">
            <p className="font-medium">{m.dropVideo}</p>
            <p className="text-sm text-muted-foreground">{m.formats}</p>
          </div>
          <Button type="button" onClick={() => input.current?.click()}>
            <Upload aria-hidden />
            {m.chooseVideo}
          </Button>
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Lock className="size-3" aria-hidden />
            {m.localProcessing}
          </p>
        </div>
      )}
    </div>
  )
}
