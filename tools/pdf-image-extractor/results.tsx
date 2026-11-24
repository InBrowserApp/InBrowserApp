import { useEffect, useRef, useState } from "react"
import { Alert, AlertDescription } from "@workspace/ui/components/ui/alert"
import { Button } from "@workspace/ui/components/ui/button"
import { Download, FileArchive, LoaderCircle } from "@workspace/ui/icons"
import type { Messages } from "./client"
import type { ExtractedImage } from "./pdf-images"

function ImageCard({
  image,
  messages,
  number,
}: {
  image: ExtractedImage
  messages: Messages
  number: Intl.NumberFormat
}) {
  const [url, setUrl] = useState("")
  useEffect(() => {
    const next = URL.createObjectURL(image.blob)
    setUrl(next)
    return () => URL.revokeObjectURL(next)
  }, [image.blob])

  const format = image.blob.type === "image/jpeg" ? "JPG" : "PNG"
  return (
    <li className="min-w-0 overflow-hidden rounded-xl border bg-card text-card-foreground">
      <div className="flex aspect-[16/10] items-center justify-center overflow-hidden border-b bg-muted/50 p-3">
        {url && (
          <img
            alt=""
            className="h-full w-full object-contain"
            decoding="async"
            height={image.height}
            loading="lazy"
            src={url}
            width={image.width}
          />
        )}
      </div>
      <div className="space-y-2.5 p-3.5">
        <div>
          <p className="text-sm font-medium wrap-anywhere">
            <bdi>{image.name}</bdi>
          </p>
          <p className="mt-1 flex flex-wrap items-center gap-x-1.5 text-xs text-muted-foreground">
            <span>
              {messages.firstPage.replace("{page}", number.format(image.page))}
            </span>
            <span aria-hidden="true">·</span>
            <span dir="ltr">
              {number.format(image.width)} × {number.format(image.height)} px
            </span>
            <span aria-hidden="true">·</span>
            <span>{format}</span>
          </p>
        </div>
        {url && (
          <Button asChild className="w-full" variant="outline">
            <a
              aria-label={messages.downloadImage.replace("{name}", image.name)}
              data-astro-prefetch="false"
              download={image.name}
              href={url}
            >
              <Download aria-hidden="true" data-icon="inline-start" />
              {messages.download}
            </a>
          </Button>
        )}
      </div>
    </li>
  )
}

export function ImageResults({
  file,
  images,
  messages,
  number,
}: {
  file: File
  images: ExtractedImage[]
  messages: Messages
  number: Intl.NumberFormat
}) {
  const [zip, setZip] = useState<"idle" | "busy" | "error">("idle")
  const mounted = useRef(false)
  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
    }
  }, [])

  async function downloadZip() {
    setZip("busy")
    try {
      const { makeZip } = await import("./zip")
      const archive = await makeZip(images)
      if (!mounted.current) return
      const href = URL.createObjectURL(archive)
      const link = document.createElement("a")
      link.href = href
      link.download = `${file.name.replace(/\.pdf$/i, "") || "pdf"}-images.zip`
      link.click()
      setTimeout(() => URL.revokeObjectURL(href), 1_000)
      setZip("idle")
    } catch {
      setZip("error")
    }
  }

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-lg font-semibold">
          {messages.results}
          <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground tabular-nums">
            {number.format(images.length)}
          </span>
        </h2>
        <Button
          className="w-full sm:w-auto"
          disabled={zip === "busy"}
          onClick={downloadZip}
          size="lg"
          type="button"
        >
          {zip === "busy" ? (
            <LoaderCircle
              aria-hidden="true"
              className="motion-safe:animate-spin"
            />
          ) : (
            <FileArchive aria-hidden="true" />
          )}
          {zip === "busy" ? messages.preparingZip : messages.downloadZip}
        </Button>
      </div>
      {zip === "error" && (
        <Alert variant="destructive">
          <AlertDescription>{messages.zipError}</AlertDescription>
        </Alert>
      )}
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((image) => (
          <ImageCard
            key={image.name}
            image={image}
            messages={messages}
            number={number}
          />
        ))}
      </ul>
    </section>
  )
}
