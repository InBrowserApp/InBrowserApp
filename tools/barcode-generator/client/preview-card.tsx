import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/ui/alert"
import { Button } from "@workspace/ui/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { Download, LoaderCircle, TriangleAlert } from "@workspace/ui/icons"

import type { BarcodeGeneratorMessages } from "./types"

type PreviewCardProps = Readonly<{
  error: string
  isRendering: boolean
  jpegUrl: string | null
  messages: BarcodeGeneratorMessages
  pngUrl: string | null
  previewUrl: string | null
  svgUrl: string | null
  webpUrl: string | null
}>

function PreviewCard({
  error,
  isRendering,
  jpegUrl,
  messages,
  pngUrl,
  previewUrl,
  svgUrl,
  webpUrl,
}: PreviewCardProps) {
  return (
    <Card className="w-full">
      <CardHeader className="border-b">
        <CardTitle>{messages.preview}</CardTitle>
        <CardDescription>{messages.previewDescription}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4">
        {error ? (
          <Alert variant="destructive">
            <TriangleAlert />
            <AlertTitle>{messages.preview}</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}

        <div className="flex min-h-72 flex-1 items-center justify-center rounded-xl border bg-muted/20 p-4">
          {isRendering ? (
            <LoaderCircle className="size-5 animate-spin text-muted-foreground" />
          ) : previewUrl ? (
            <img
              alt={messages.meta.name}
              className="max-h-full max-w-full object-contain"
              src={previewUrl}
            />
          ) : (
            <div className="h-full w-full rounded-lg border border-dashed bg-muted/30" />
          )}
        </div>
      </CardContent>
      <CardFooter className="flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <span className="text-sm text-muted-foreground">
          {messages.download}
        </span>
        <div className="grid w-full gap-2 sm:w-auto sm:grid-cols-2 lg:flex">
          {pngUrl ? (
            <Button asChild variant="outline">
              <a download="barcode.png" href={pngUrl}>
                <Download className="size-4" />
                PNG
              </a>
            </Button>
          ) : (
            <Button disabled variant="outline">
              <Download className="size-4" />
              PNG
            </Button>
          )}
          {svgUrl ? (
            <Button asChild variant="outline">
              <a download="barcode.svg" href={svgUrl}>
                <Download className="size-4" />
                SVG
              </a>
            </Button>
          ) : (
            <Button disabled variant="outline">
              <Download className="size-4" />
              SVG
            </Button>
          )}
          {jpegUrl ? (
            <Button asChild variant="outline">
              <a download="barcode.jpeg" href={jpegUrl}>
                <Download className="size-4" />
                JPEG
              </a>
            </Button>
          ) : (
            <Button disabled variant="outline">
              <Download className="size-4" />
              JPEG
            </Button>
          )}
          {webpUrl ? (
            <Button asChild variant="outline">
              <a download="barcode.webp" href={webpUrl}>
                <Download className="size-4" />
                WebP
              </a>
            </Button>
          ) : (
            <Button disabled variant="outline">
              <Download className="size-4" />
              WebP
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}

export { PreviewCard }
