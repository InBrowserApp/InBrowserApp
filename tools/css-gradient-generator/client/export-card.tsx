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
import { Download, TriangleAlert } from "@workspace/ui/icons"

import type { CssGradientGeneratorMessages } from "../types"

type ExportCardProps = Readonly<{
  exportHeight: number
  exportWidth: number
  messages: CssGradientGeneratorMessages
  onExportHeightChange: (value: number) => void
  onExportPng: () => Promise<void>
  onExportWidthChange: (value: number) => void
  showError: boolean
  svgDownloadUrl: string | null
}>

function ExportCard({
  exportHeight,
  exportWidth,
  messages,
  onExportHeightChange,
  onExportPng,
  onExportWidthChange,
  showError,
  svgDownloadUrl,
}: ExportCardProps) {
  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>{messages.exportTitle}</CardTitle>
        <CardDescription>{messages.exportSubtitle}</CardDescription>
      </CardHeader>

      <CardContent className="grid gap-4">
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

        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() => {
              void onExportPng()
            }}
            type="button"
          >
            {messages.downloadPng}
          </Button>
          {svgDownloadUrl ? (
            <Button asChild variant="outline">
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
