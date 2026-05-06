import {
  ToolPanelCard,
  ToolPanelCardContent,
} from "@workspace/ui/components/tool/tool-panel-card"
import { Badge } from "@workspace/ui/components/ui/badge"
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"

import type { Station } from "../core/stations"
import type { RadioTimecodeMessages } from "../types"

type PreviewSymbol = Readonly<{
  offset: number
  symbol: string
}>

type PreviewCardProps = Readonly<{
  messages: RadioTimecodeMessages
  station: Station
  stationTime: string
  currentSymbol: string
  previewSymbols: readonly PreviewSymbol[]
}>

function PreviewCard({
  messages,
  station,
  stationTime,
  currentSymbol,
  previewSymbols,
}: PreviewCardProps) {
  return (
    <ToolPanelCard>
      <CardHeader className="border-b">
        <CardTitle>{messages.previewTitle}</CardTitle>
        <CardDescription>{messages.previewDescription}</CardDescription>
      </CardHeader>

      <ToolPanelCardContent className="gap-6 p-6">
        <dl className="grid gap-4 sm:grid-cols-3">
          <div className="flex flex-col gap-1">
            <dt className="text-sm text-muted-foreground">
              {messages.stationTimeLabel}
            </dt>
            <dd
              className="font-mono text-sm tabular-nums"
              data-testid="station-time"
            >
              {stationTime}
            </dd>
          </div>
          <div className="flex flex-col gap-1">
            <dt className="text-sm text-muted-foreground">
              {messages.timeZoneLabel}
            </dt>
            <dd className="font-mono text-sm">{station.timeZone}</dd>
          </div>
          <div className="flex flex-col gap-1">
            <dt className="text-sm text-muted-foreground">
              {messages.currentSymbolLabel}
            </dt>
            <dd
              className="font-mono text-sm tabular-nums"
              data-testid="current-symbol"
            >
              {currentSymbol}
            </dd>
          </div>
        </dl>

        <div className="flex flex-col gap-3 border-t pt-5">
          <p className="text-sm text-muted-foreground">
            {messages.upcomingSymbolsLabel}
          </p>
          <div
            className="grid grid-cols-4 gap-2 sm:grid-cols-6 lg:grid-cols-12"
            data-testid="symbol-preview"
          >
            {previewSymbols.map((item) => (
              <div
                key={item.offset}
                className="flex min-h-14 flex-col items-center justify-center gap-1 rounded-md border bg-muted/30 px-2 py-2"
              >
                <span className="text-xs text-muted-foreground">
                  +{item.offset}s
                </span>
                <Badge variant="secondary">{item.symbol}</Badge>
              </div>
            ))}
          </div>
        </div>
      </ToolPanelCardContent>
    </ToolPanelCard>
  )
}

export { PreviewCard }
export type { PreviewSymbol }
