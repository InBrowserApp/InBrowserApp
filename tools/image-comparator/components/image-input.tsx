import { useId, useRef, useState } from "react"
import { Button } from "@workspace/ui/components/ui/button"
import { ImageUp, LoaderCircle } from "@workspace/ui/icons"
import { cn } from "@workspace/ui/lib/utils"
import type { Messages } from "../types"
import type { useImageSource } from "../use-image-source"

export function ImageInput({
  label,
  source,
  messages: m,
  numbers,
}: {
  label: string
  source: ReturnType<typeof useImageSource>
  messages: Messages
  numbers: Intl.NumberFormat
}) {
  const labelId = useId()
  const actionId = useId()
  const picker = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const { image, status, open } = source

  return (
    <div
      className={cn(
        "min-w-0 rounded-lg border bg-card px-3 py-3 sm:px-4",
        !image && "border-dashed",
        dragging && "border-primary bg-accent"
      )}
      onDragOver={(event) => {
        if (!event.dataTransfer.types.includes("Files")) return
        event.preventDefault()
        setDragging(true)
      }}
      onDragLeave={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null))
          setDragging(false)
      }}
      onDrop={(event) => {
        event.preventDefault()
        setDragging(false)
        const file = event.dataTransfer.files[0]
        if (file) void open(file)
      }}
    >
      <input
        ref={picker}
        type="file"
        hidden
        accept="image/*"
        aria-labelledby={labelId}
        onChange={(event) => {
          const file = event.currentTarget.files?.[0]
          event.currentTarget.value = ""
          if (file) void open(file)
        }}
      />
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <div className="min-w-0 flex-1 basis-28">
          <p id={labelId} className="text-sm font-medium">
            {label}
          </p>
          {image ? (
            <p
              className="truncate text-sm text-muted-foreground"
              title={image.file.name}
            >
              <bdi>{image.file.name}</bdi>
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">{m.dropHint}</p>
          )}
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="min-h-9"
          aria-labelledby={`${actionId} ${labelId}`}
          onClick={() => picker.current?.click()}
        >
          <ImageUp data-icon="inline-start" aria-hidden="true" />
          <span id={actionId}>{image ? m.replaceImage : m.chooseImage}</span>
        </Button>
      </div>
      {image && (
        <p
          className="mt-1 w-fit text-xs text-muted-foreground tabular-nums"
          dir="ltr"
        >
          {numbers.format(image.bitmap.width)} ×{" "}
          {numbers.format(image.bitmap.height)}
        </p>
      )}
      {status === "loading" && (
        <p
          className="mt-2 flex items-center gap-2 text-sm text-muted-foreground"
          role="status"
        >
          <LoaderCircle
            className="size-4 motion-safe:animate-spin"
            aria-hidden="true"
          />
          {m.loadingImage}
        </p>
      )}
      {status === "error" && (
        <p className="mt-2 text-sm text-destructive" role="alert">
          {m.invalidImage}
        </p>
      )}
    </div>
  )
}
