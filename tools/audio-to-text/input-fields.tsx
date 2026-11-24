import { useRef, useState } from "react"
import { Button } from "@workspace/ui/components/ui/button"
import { File, Upload } from "@workspace/ui/icons"
import { cn } from "@workspace/ui/lib/utils"
import type { ComponentProps, Ref } from "react"
import type { Messages } from "./types"

export type AudioSource = { file: File; url: string }

export function NativeSelect({
  className,
  ...props
}: ComponentProps<"select">) {
  return (
    <select
      {...props}
      className={cn(
        "h-10 w-full min-w-0 rounded-lg border border-input bg-background px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50",
        className
      )}
    />
  )
}

export function AudioPicker({
  source,
  messages: m,
  disabled,
  audioRef,
  onFile,
}: {
  source?: AudioSource
  messages: Messages
  disabled: boolean
  audioRef: Ref<HTMLAudioElement>
  onFile: (file: File) => void
}) {
  const input = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)

  return (
    <div
      className={cn(
        "grid min-w-0 content-center justify-items-center gap-3 rounded-xl border border-dashed border-border bg-muted/35 p-4 text-center sm:p-6",
        dragOver && "border-primary bg-primary/5"
      )}
      onDragOver={(event) => {
        if (!event.dataTransfer.types.includes("Files")) return
        event.preventDefault()
        event.dataTransfer.dropEffect = disabled ? "none" : "copy"
        setDragOver(!disabled)
      }}
      onDragLeave={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setDragOver(false)
        }
      }}
      onDrop={(event) => {
        event.preventDefault()
        setDragOver(false)
        const file = event.dataTransfer.files[0]
        if (!disabled && file) onFile(file)
      }}
    >
      <div className="flex size-10 items-center justify-center rounded-lg border bg-background text-muted-foreground">
        {source ? (
          <File className="size-5" aria-hidden="true" />
        ) : (
          <Upload className="size-5" aria-hidden="true" />
        )}
      </div>
      {source ? (
        <>
          <p className="w-full text-sm font-medium wrap-anywhere" dir="auto">
            {source.file.name}
          </p>
          {/* oxlint-disable-next-line jsx-a11y/media-has-caption */}
          <audio
            ref={audioRef}
            src={source.url}
            controls
            preload="metadata"
            className="w-full min-w-0 dark:[color-scheme:dark]"
            aria-label={m.playback}
          />
        </>
      ) : (
        <div className="space-y-1">
          <p className="text-sm font-medium">{m.dropFile}</p>
          <p className="text-xs text-muted-foreground">{m.formats}</p>
        </div>
      )}
      <Button
        type="button"
        variant="outline"
        disabled={disabled}
        className="h-auto min-h-9 whitespace-normal"
        onClick={() => input.current?.click()}
      >
        {source ? m.replaceFile : m.chooseFile}
      </Button>
      <input
        ref={input}
        type="file"
        accept="audio/*,.mp3,.wav,.m4a,.flac,.ogg,.webm,.aac,.opus"
        hidden
        aria-label={m.chooseFile}
        disabled={disabled}
        onChange={(event) => {
          const file = event.currentTarget.files?.[0]
          if (file) onFile(file)
          event.currentTarget.value = ""
        }}
      />
    </div>
  )
}
