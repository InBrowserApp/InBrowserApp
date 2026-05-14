import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/ui/alert"
import {
  CardDescription,
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
import { Spinner } from "@workspace/ui/components/ui/spinner"
import {
  ToolPanelCard,
  ToolPanelCardContent,
} from "@workspace/ui/components/tool/tool-panel-card"
import { ImageIcon, TriangleAlert } from "@workspace/ui/icons"

import { formatPercent } from "../core/color"
import type { PaletteSwatch } from "../core/types"
import { ExportPanel } from "./export-panel"
import { SwatchGrid } from "./swatch-grid"
import type { ImagePaletteExtractorMessages } from "./types"

type ResultsCardProps = Readonly<{
  error: string
  fileName: string
  isExtracting: boolean
  messages: ImagePaletteExtractorMessages
  swatches: readonly PaletteSwatch[]
  totalPixels: number
}>

function ResultsCard({
  error,
  fileName,
  isExtracting,
  messages,
  swatches,
  totalPixels,
}: ResultsCardProps) {
  const dominant = swatches[0] ?? null

  return (
    <ToolPanelCard>
      <CardHeader className="border-b">
        <CardTitle>{messages.resultsTitle}</CardTitle>
        <CardDescription>{messages.resultsDescription}</CardDescription>
      </CardHeader>
      <ToolPanelCardContent className="gap-5">
        {error ? (
          <Alert variant="destructive">
            <TriangleAlert />
            <AlertTitle>{messages.errorTitle}</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}

        {isExtracting ? (
          <Empty className="border border-dashed bg-muted/20">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Spinner />
              </EmptyMedia>
              <EmptyTitle>{messages.loadingTitle}</EmptyTitle>
              <EmptyDescription>{messages.loadingDescription}</EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : null}

        {!isExtracting && !error && swatches.length === 0 ? (
          <Empty className="border border-dashed bg-muted/20">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <ImageIcon />
              </EmptyMedia>
              <EmptyTitle>{messages.emptyResultTitle}</EmptyTitle>
              <EmptyDescription>
                {messages.emptyResultDescription}
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : null}

        {!isExtracting && swatches.length > 0 ? (
          <>
            <div className="overflow-hidden rounded-full border bg-muted">
              <div className="flex h-5">
                {swatches.map((color) => (
                  <div
                    aria-label={`${color.hex} ${formatPercent(color.ratio)}`}
                    className="min-w-1"
                    key={color.hex}
                    role="img"
                    style={{
                      backgroundColor: color.hex,
                      flexGrow: color.count,
                    }}
                    title={`${color.hex} ${formatPercent(color.ratio)}`}
                  />
                ))}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <StatBadge
                label={messages.extractedColorsLabel}
                value={String(swatches.length)}
              />
              <StatBadge
                label={messages.sampledPixelsLabel}
                value={totalPixels.toLocaleString()}
              />
              <StatBadge
                color={dominant?.hex}
                label={messages.dominantColorLabel}
                value={dominant?.hex ?? "-"}
              />
            </div>

            <SwatchGrid messages={messages} swatches={swatches} />
            <ExportPanel
              fileName={fileName || "palette"}
              messages={messages}
              swatches={swatches}
            />
          </>
        ) : null}
      </ToolPanelCardContent>
    </ToolPanelCard>
  )
}

function StatBadge({
  color,
  label,
  value,
}: Readonly<{
  color?: string
  label: string
  value: string
}>) {
  return (
    <div className="flex flex-col gap-2 rounded-lg border bg-muted/20 p-3">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <span className="flex items-center gap-2 font-mono text-sm font-semibold">
        {color ? (
          <span
            aria-hidden="true"
            className="size-3 rounded-full border"
            style={{ backgroundColor: color }}
          />
        ) : null}
        {value}
      </span>
    </div>
  )
}

export { ResultsCard }
