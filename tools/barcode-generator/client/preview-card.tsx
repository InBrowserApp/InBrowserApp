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
  messages: BarcodeGeneratorMessages
  pngUrl: string | null
  previewUrl: string | null
  svgUrl: string | null
}>

function PreviewCard({
  error,
  isRendering,
  messages,
  pngUrl,
  previewUrl,
  svgUrl,
}: PreviewCardProps) {
  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>{messages.preview}</CardTitle>
        <CardDescription>{messages.meta.description}</CardDescription>
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
      <CardFooter className="justify-between gap-3">
        <span className="text-sm text-muted-foreground">
          {messages.download}
        </span>
        <div className="flex items-center gap-2">
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
        </div>
      </CardFooter>
    </Card>
  )
}

export { PreviewCard }
