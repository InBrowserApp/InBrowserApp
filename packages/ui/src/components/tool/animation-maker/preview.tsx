import { useEffect, useState } from "react"
import { Button } from "@workspace/ui/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { Download, Play, Square } from "@workspace/ui/icons"

import type { AnimationResult } from "@workspace/raster-image/animation-worker"
import type { Messages } from "./types"

function useObjectUrl(blob: Blob | null) {
  const [url, setUrl] = useState("")
  useEffect(() => {
    if (!blob) {
      setUrl("")
      return
    }
    const nextUrl = URL.createObjectURL(blob)
    setUrl(nextUrl)
    return () => URL.revokeObjectURL(nextUrl)
  }, [blob])
  return url
}

type PreviewProps = {
  result: AnimationResult
  downloadName: string
  width: number
  height: number
  language: string
  messages: Messages
}

export function Preview({
  result,
  downloadName,
  width,
  height,
  language,
  messages,
}: PreviewProps) {
  const [playing, setPlaying] = useState(false)
  const downloadUrl = useObjectUrl(result.animation)
  const posterUrl = useObjectUrl(result.poster)
  const playingUrl = useObjectUrl(playing ? result.animation : null)
  const dimensions = new Intl.NumberFormat(language, { useGrouping: false })
  const size = new Intl.NumberFormat(language, {
    style: "unit",
    unit: "kilobyte",
    maximumFractionDigits: 1,
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h2>{messages.preview}</h2>
        </CardTitle>
        <CardDescription className="tabular-nums">
          <bdi>
            {dimensions.format(width)} × {dimensions.format(height)}
          </bdi>
          {" · "}
          <bdi>{size.format(result.animation.size / 1000)}</bdi>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex min-h-36 items-center justify-center overflow-hidden rounded-lg border bg-muted/35">
          {posterUrl && (
            <img
              alt={messages.preview}
              src={(playing && playingUrl) || posterUrl}
              width={width}
              height={height}
              className="h-auto max-h-64 max-w-full object-contain"
            />
          )}
        </div>
      </CardContent>
      <CardFooter className="flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          className="h-auto min-h-9 whitespace-normal"
          onClick={() => setPlaying(!playing)}
        >
          {playing ? (
            <Square aria-hidden="true" data-icon="inline-start" />
          ) : (
            <Play aria-hidden="true" data-icon="inline-start" />
          )}
          {playing ? messages.stop : messages.play}
        </Button>
        {downloadUrl && (
          <Button asChild className="h-auto min-h-9 whitespace-normal">
            <a href={downloadUrl} download={downloadName}>
              <Download aria-hidden="true" data-icon="inline-start" />
              {messages.download}
            </a>
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
