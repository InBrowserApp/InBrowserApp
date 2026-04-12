import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"

import {
  ASCII_ART_FONT_DEFINITIONS,
  type AsciiArtMetrics,
} from "../core/ascii-art"

import type { AsciiArtGeneratorLocalizedCatalog } from "../types"

type MetricsCardProps = Readonly<{
  messages: AsciiArtGeneratorLocalizedCatalog
  metrics: AsciiArtMetrics
}>

function MetricsCard({ messages, metrics }: MetricsCardProps) {
  const fontLabel =
    ASCII_ART_FONT_DEFINITIONS.find((font) => font.value === metrics.font)
      ?.label ?? metrics.font

  const metricItems = [
    {
      label: messages.fontMetric,
      value: fontLabel,
    },
    {
      label: messages.alignMetric,
      value:
        {
          left: messages.leftAlign,
          center: messages.centerAlign,
          right: messages.rightAlign,
        }[metrics.align] ?? messages.leftAlign,
    },
    {
      label: messages.widthMetric,
      value: String(metrics.configuredWidth),
    },
    {
      label: messages.linesMetric,
      value: String(metrics.lineCount),
    },
    {
      label: messages.widestLineMetric,
      value: String(metrics.maxLineWidth),
    },
    {
      label: messages.charactersMetric,
      value: String(metrics.charCount),
    },
  ] as const

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>{messages.metricsTitle}</CardTitle>
        <CardDescription>{messages.metricsDescription}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
        {metricItems.map((item) => (
          <div
            key={item.label}
            className="rounded-xl border border-border/70 bg-muted/20 px-3 py-3"
          >
            <p className="text-xs text-muted-foreground">{item.label}</p>
            <p className="mt-1 text-sm font-medium">{item.value}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export { MetricsCard }
