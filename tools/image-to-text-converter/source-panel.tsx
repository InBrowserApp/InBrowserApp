import { useCallback, useEffect, useRef, useState } from "react"

import { Button } from "@workspace/ui/components/ui/button"
import { CardHeader, CardTitle } from "@workspace/ui/components/ui/card"
import {
  ToolPanelCard,
  ToolPanelCardContent,
} from "@workspace/ui/components/tool/tool-panel-card"
import { ImageUp } from "@workspace/ui/icons"
import { cn } from "@workspace/ui/lib/utils"
import type { Messages } from "./messages"

const imageTypes = ["image/png", "image/jpeg", "image/webp"]

function isSupportedImage(file: File) {
  return (
    imageTypes.includes(file.type) ||
    (!file.type && /\.(png|jpe?g|webp)$/i.test(file.name))
  )
}

export function SourcePanel({
  image,
  messages: m,
  onImage,
  children,
}: {
  image: File | null
  messages: Messages
  onImage: (file: File) => void
  children: React.ReactNode
}) {
  const picker = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<{ image: File; url: string } | null>(
    null
  )
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState<"invalidImage" | "pasteFallback" | null>(
    null
  )

  const selectFile = useCallback(
    (file: File) => {
      if (!isSupportedImage(file)) {
        setError("invalidImage")
        return
      }
      setError(null)
      onImage(file)
    },
    [onImage]
  )

  useEffect(() => {
    if (!image) return
    const url = URL.createObjectURL(image)
    setPreview({ image, url })
    return () => URL.revokeObjectURL(url)
  }, [image])

  useEffect(() => {
    function paste(event: ClipboardEvent) {
      const file = Array.from(event.clipboardData?.files ?? []).find((entry) =>
        entry.type.startsWith("image/")
      )
      if (!file) return
      event.preventDefault()
      selectFile(file)
    }
    window.addEventListener("paste", paste)
    return () => window.removeEventListener("paste", paste)
  }, [selectFile])

  async function pasteImage() {
    try {
      const items = await navigator.clipboard.read()
      for (const item of items) {
        const type = item.types.find((type) => imageTypes.includes(type))
        if (!type) continue
        const blob = await item.getType(type)
        const extension = type === "image/jpeg" ? "jpg" : type.slice(6)
        selectFile(new File([blob], `screenshot.${extension}`, { type }))
        return
      }
    } catch {
      // The keyboard paste path works without the clipboard-read permission.
    }
    setError("pasteFallback")
  }

  return (
    <ToolPanelCard className="min-w-0">
      <CardHeader>
        <CardTitle>{m.image}</CardTitle>
      </CardHeader>
      <ToolPanelCardContent className="gap-3">
        <input
          ref={picker}
          type="file"
          hidden
          accept={imageTypes.join(",")}
          aria-label={m.chooseImage}
          onChange={(event) => {
            const file = event.currentTarget.files?.[0]
            if (file) selectFile(file)
            event.currentTarget.value = ""
          }}
        />
        <div
          className={cn(
            "flex min-h-48 min-w-0 flex-col items-center justify-center gap-3 rounded-xl border border-dashed bg-muted/30 p-4 text-center",
            dragging && "border-primary bg-accent"
          )}
          onDragOver={(event) => {
            event.preventDefault()
            setDragging(true)
          }}
          onDragLeave={(event) => {
            if (
              !event.currentTarget.contains(event.relatedTarget as Node | null)
            )
              setDragging(false)
          }}
          onDrop={(event) => {
            event.preventDefault()
            setDragging(false)
            const file = event.dataTransfer.files[0]
            if (file) selectFile(file)
          }}
        >
          {image ? (
            <>
              {preview?.image === image ? (
                <img
                  src={preview.url}
                  alt={m.preview}
                  className="max-h-64 max-w-full rounded-md object-contain"
                />
              ) : null}
              <p dir="auto" className="max-w-full text-sm break-all">
                {image.name}
              </p>
            </>
          ) : (
            <>
              <ImageUp
                className="size-8 text-muted-foreground"
                aria-hidden="true"
              />
              <p className="max-w-xs text-sm text-muted-foreground">
                {m.dropHint}
              </p>
            </>
          )}
          <div className="flex flex-wrap justify-center gap-2">
            <Button
              type="button"
              variant={image ? "outline" : "default"}
              onClick={() => picker.current?.click()}
            >
              {image ? m.changeImage : m.chooseImage}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => void pasteImage()}
            >
              {m.pasteImage}
            </Button>
          </div>
        </div>
        {error ? (
          <p role="status" className="text-sm text-muted-foreground">
            {m[error]}
          </p>
        ) : null}
        {children}
      </ToolPanelCardContent>
    </ToolPanelCard>
  )
}
