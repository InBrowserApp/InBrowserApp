import { useEffect, useRef, useState } from "react"
import { Download, ImageIcon } from "@workspace/ui/icons"
import { Button } from "@workspace/ui/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { archiveImages } from "./core/zip"
import type { Output } from "./core/conversion"
import type { Messages } from "./messages"

function saveFile(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = name
  link.click()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export function Results({
  images,
  countLabel,
  incomplete,
  busy,
  messages: m,
}: {
  images: readonly Output[]
  countLabel: string
  incomplete: boolean
  busy: boolean
  messages: Messages
}) {
  const active = useRef<AbortController | null>(null)
  const [packing, setPacking] = useState(false)
  const [error, setError] = useState(false)
  useEffect(() => () => active.current?.abort(), [])

  async function downloadZip() {
    if (active.current) return
    const controller = new AbortController()
    active.current = controller
    setPacking(true)
    setError(false)
    try {
      const blob = await archiveImages(images, controller.signal)
      saveFile(blob, "converted-images.zip")
    } catch {
      if (!controller.signal.aborted) setError(true)
    } finally {
      active.current = null
      if (!controller.signal.aborted) setPacking(false)
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <CardTitle>{m.results}</CardTitle>
          <CardDescription role="status">
            {countLabel}
            {incomplete && <span className="block">{m.incomplete}</span>}
          </CardDescription>
        </div>
        <Button
          type="button"
          disabled={busy || packing || images.length === 0}
          onClick={downloadZip}
        >
          <Download data-icon="inline-start" />
          {packing ? m.packing : m.downloadZip}
        </Button>
      </CardHeader>
      {error && (
        <p role="alert" className="px-6 text-sm text-destructive">
          {m.zipError}
        </p>
      )}
      {images.length > 0 && (
        <CardContent>
          <ul className="max-h-96 divide-y overflow-y-auto rounded-lg border">
            {images.map((image) => (
              <li
                key={image.name}
                className="flex items-center gap-3 px-3 py-2"
              >
                <ImageIcon
                  aria-hidden="true"
                  className="size-4 shrink-0 text-muted-foreground"
                />
                <div className="min-w-0 flex-1">
                  <p
                    dir="auto"
                    title={image.name}
                    className="truncate text-sm font-medium"
                  >
                    {image.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    <bdi dir="ltr">
                      {image.width} × {image.height} px
                    </bdi>
                  </p>
                </div>
                <Button
                  aria-label={m.download.replace("{name}", () => image.name)}
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => saveFile(image.blob, image.name)}
                >
                  <Download />
                </Button>
              </li>
            ))}
          </ul>
        </CardContent>
      )}
    </Card>
  )
}
