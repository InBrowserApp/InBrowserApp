import { Alert, AlertDescription } from "@workspace/ui/components/ui/alert"
import { Button } from "@workspace/ui/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { Input } from "@workspace/ui/components/ui/input"
import { Download, ImageIcon, TriangleAlert } from "@workspace/ui/icons"

import type { CssGradientGeneratorMessages } from "../types"

type RasterExportFormat = "png" | "jpeg" | "webp"

type ExportCardProps = Readonly<{
  exportHeight: number
  exportWidth: number
  messages: CssGradientGeneratorMessages
  onExportHeightChange: (value: number) => void
  onExportImage: (format: RasterExportFormat) => Promise<void>
  onExportWidthChange: (value: number) => void
  showError: boolean
  svgDownloadUrl: string | null
}>

function ExportCard({
  exportHeight,
  exportWidth,
  messages,
  onExportHeightChange,
  onExportImage,
  onExportWidthChange,
  showError,
  svgDownloadUrl,
}: ExportCardProps) {
  const rasterActions = [
    { format: "png", label: messages.downloadPng, variant: "default" },
    { format: "jpeg", label: messages.downloadJpg, variant: "outline" },
    { format: "webp", label: messages.downloadWebp, variant: "outline" },
  ] as const satisfies readonly Readonly<{
    format: RasterExportFormat
    label: string
    variant: "default" | "outline"
  }>[]

  return (
    <Card className="overflow-hidden">
      <CardHeader className="gap-4 border-b bg-[linear-gradient(135deg,rgba(14,165,233,0.07),rgba(255,255,255,0.96))]">
        <div className="space-y-1">
          <CardTitle>{messages.exportTitle}</CardTitle>
          <CardDescription>{messages.exportSubtitle}</CardDescription>
        </div>

        <div className="inline-flex w-fit items-center gap-2 rounded-full border bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm">
          <ImageIcon className="size-3.5" />
          {exportWidth} x {exportHeight}
        </div>
      </CardHeader>

      <CardContent className="grid gap-5">
        {showError ? (
          <Alert variant="destructive">
            <TriangleAlert />
            <AlertDescription>{messages.pngUnsupported}</AlertDescription>
          </Alert>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <div className="text-sm font-medium">{messages.exportWidth}</div>
            <Input
              min={64}
              onChange={(event) => {
                onExportWidthChange(Number(event.target.value))
              }}
              type="number"
              value={exportWidth}
            />
          </div>

          <div className="grid gap-2">
            <div className="text-sm font-medium">{messages.exportHeight}</div>
            <Input
              min={64}
              onChange={(event) => {
                onExportHeightChange(Number(event.target.value))
              }}
              type="number"
              value={exportHeight}
            />
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {rasterActions.map((action) => (
            <Button
              className="justify-start"
              key={action.format}
              onClick={() => {
                void onExportImage(action.format)
              }}
              type="button"
              variant={action.variant}
            >
              <Download data-icon="inline-start" />
              {action.label}
            </Button>
          ))}

          {svgDownloadUrl ? (
            <Button
              asChild
              className="justify-start"
              type="button"
              variant="outline"
            >
              <a download="css-gradient.svg" href={svgDownloadUrl}>
                <Download data-icon="inline-start" />
                {messages.downloadSvg}
              </a>
            </Button>
          ) : null}
        </div>
      </CardContent>
    </Card>
  )
}

export { ExportCard }
