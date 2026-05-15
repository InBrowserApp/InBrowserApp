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
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@workspace/ui/components/ui/empty"
import {
  Download,
  LayoutGrid,
  LoaderCircle,
  TriangleAlert,
} from "@workspace/ui/icons"

import type { QrCodeGeneratorMessages } from "./types"

type PreviewCardProps = Readonly<{
  error: string
  isRendering: boolean
  jpgUrl: string | null
  messages: QrCodeGeneratorMessages
  missing: boolean
  pngUrl: string | null
  previewUrl: string | null
  svgUrl: string | null
  webpUrl: string | null
}>

function DownloadButton({
  extension,
  href,
  label,
}: Readonly<{
  extension: "jpg" | "png" | "svg" | "webp"
  href: string | null
  label: string
}>) {
  if (!href) {
    return (
      <Button className="w-full" disabled variant="outline">
        <Download data-icon="inline-start" />
        {label}
      </Button>
    )
  }

  return (
    <Button asChild className="w-full" variant="outline">
      <a download={`qrcode.${extension}`} href={href}>
        <Download data-icon="inline-start" />
        {label}
      </a>
    </Button>
  )
}

function PreviewCard({
  error,
  isRendering,
  jpgUrl,
  messages,
  missing,
  pngUrl,
  previewUrl,
  svgUrl,
  webpUrl,
}: PreviewCardProps) {
  return (
    <Card className="w-full min-w-0 xl:sticky xl:top-6 xl:self-start">
      <CardHeader className="border-b">
        <CardTitle>{messages.previewTitle}</CardTitle>
        <CardDescription>{messages.previewDescription}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {error ? (
          <Alert variant="destructive">
            <TriangleAlert />
            <AlertTitle>{messages.renderErrorTitle}</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}

        <div className="flex min-h-80 items-center justify-center rounded-xl border bg-muted/20 p-4">
          {isRendering ? (
            <LoaderCircle
              className="animate-spin text-muted-foreground"
              data-icon="inline-start"
            />
          ) : previewUrl ? (
            <img
              alt={messages.qrAlt}
              className="max-h-full max-w-full object-contain"
              src={previewUrl}
            />
          ) : (
            <Empty>
              <EmptyMedia variant="icon">
                <LayoutGrid />
              </EmptyMedia>
              <EmptyHeader>
                <EmptyTitle>{messages.emptyTitle}</EmptyTitle>
                <EmptyDescription>
                  {missing ? messages.emptyDescription : messages.payloadEmpty}
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          )}
        </div>
      </CardContent>
      <CardFooter className="grid grid-cols-2 items-stretch gap-2 sm:grid-cols-4">
        <DownloadButton
          extension="png"
          href={pngUrl}
          label={messages.pngDownloadLabel}
        />
        <DownloadButton
          extension="jpg"
          href={jpgUrl}
          label={messages.jpgDownloadLabel}
        />
        <DownloadButton
          extension="webp"
          href={webpUrl}
          label={messages.webpDownloadLabel}
        />
        <DownloadButton
          extension="svg"
          href={svgUrl}
          label={messages.svgDownloadLabel}
        />
      </CardFooter>
    </Card>
  )
}

export { PreviewCard }
