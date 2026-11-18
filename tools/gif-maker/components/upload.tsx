import { useRef, useState, type Ref } from "react"
import { Button } from "@workspace/ui/components/ui/button"
import { ImageUp, LoaderCircle } from "@workspace/ui/icons"
import { cn } from "@workspace/ui/lib/utils"

import { IMAGE_ACCEPT } from "../files"
import type { Messages } from "../types"

type UploadProps = {
  messages: Messages
  compact: boolean
  disabled: boolean
  reading: boolean
  buttonRef: Ref<HTMLButtonElement>
  onFiles: (files: File[]) => void
}

export function Upload({
  messages,
  compact,
  disabled,
  reading,
  buttonRef,
  onFiles,
}: UploadProps) {
  const input = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)

  return (
    <div
      className={cn(
        "flex flex-col items-center gap-3 rounded-xl border border-dashed bg-muted/25 px-4 text-center transition-colors",
        compact
          ? "py-4 sm:flex-row sm:justify-between sm:text-start"
          : "justify-center py-10 sm:py-12",
        dragOver && "border-primary bg-primary/5"
      )}
      onDragOver={(event) => {
        if (!event.dataTransfer.types.includes("Files")) return
        event.preventDefault()
        event.dataTransfer.dropEffect = disabled ? "none" : "copy"
        setDragOver(!disabled)
      }}
      onDragLeave={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node)) {
          setDragOver(false)
        }
      }}
      onDrop={(event) => {
        event.preventDefault()
        setDragOver(false)
        if (!disabled) onFiles(Array.from(event.dataTransfer.files))
      }}
    >
      <input
        ref={input}
        type="file"
        name="images"
        accept={IMAGE_ACCEPT}
        multiple
        hidden
        disabled={disabled}
        onChange={(event) => {
          onFiles(Array.from(event.currentTarget.files ?? []))
          event.currentTarget.value = ""
        }}
      />
      <div
        className={cn(
          "flex flex-col items-center gap-1",
          compact && "sm:items-start"
        )}
      >
        {!compact && (
          <ImageUp
            aria-hidden="true"
            className="mb-2 size-8 text-muted-foreground"
          />
        )}
        <p className="text-sm font-medium">{messages.dropImages}</p>
        <p className="text-sm text-muted-foreground">{messages.fileHint}</p>
      </div>
      <Button
        ref={buttonRef}
        type="button"
        disabled={disabled}
        variant={compact ? "outline" : "default"}
        onClick={() => input.current?.click()}
        className="h-auto min-h-9 shrink-0 whitespace-normal"
      >
        {reading && (
          <LoaderCircle
            aria-hidden="true"
            data-icon="inline-start"
            className="motion-safe:animate-spin"
          />
        )}
        {reading ? messages.readingImages : messages.addImages}
      </Button>
    </div>
  )
}
