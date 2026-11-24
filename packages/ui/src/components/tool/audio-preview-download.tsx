import { useEffect, useState } from "react"
import { Button } from "@workspace/ui/components/ui/button"
import { Download } from "@workspace/ui/icons"

export function AudioPreviewDownload({
  wav,
  filename,
  previewLabel,
  downloadLabel,
}: {
  wav: ArrayBuffer
  filename: string
  previewLabel: string
  downloadLabel: string
}) {
  const [url, setUrl] = useState("")
  useEffect(() => {
    const url = URL.createObjectURL(new Blob([wav], { type: "audio/wav" }))
    setUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [wav])
  return (
    <div className="flex flex-wrap items-center gap-3 border-t pt-4">
      {/* oxlint-disable-next-line jsx-a11y/media-has-caption -- Preview plays user-supplied audio. */}
      <audio
        className="h-11 min-w-0 grow basis-52"
        controls
        preload="metadata"
        src={url || undefined}
        aria-label={previewLabel}
      />
      <Button asChild className="min-h-11 w-full sm:w-auto">
        <a href={url || undefined} download={filename}>
          <Download data-icon="inline-start" aria-hidden="true" />
          {downloadLabel}
        </a>
      </Button>
    </div>
  )
}
