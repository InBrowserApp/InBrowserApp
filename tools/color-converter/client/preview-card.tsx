import {
  ToolPanelCard,
  ToolPanelCardContent,
} from "@workspace/ui/components/tool/tool-panel-card"
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"

import type { ColorConverterMessages } from "./types"

type PreviewCardProps = Readonly<{
  hexValue: string
  keywordValue: string
  messages: ColorConverterMessages
  rgbValue: string
  swatchStyle: string
}>

function SummaryRow({
  label,
  value,
}: Readonly<{ label: string; value: string }>) {
  return (
    <div className="grid gap-1 rounded-xl border bg-muted/20 p-3">
      <div className="text-xs font-medium text-muted-foreground uppercase">
        {label}
      </div>
      <code className="font-mono text-xs break-all">{value}</code>
    </div>
  )
}

export function PreviewCard({
  hexValue,
  keywordValue,
  messages,
  rgbValue,
  swatchStyle,
}: PreviewCardProps) {
  return (
    <ToolPanelCard>
      <CardHeader className="border-b">
        <CardTitle>{messages.previewTitle}</CardTitle>
        <CardDescription>{messages.meta.description}</CardDescription>
      </CardHeader>
      <ToolPanelCardContent className="gap-6">
        <div
          className="rounded-2xl border p-4"
          style={{
            backgroundImage:
              "linear-gradient(45deg, rgb(226 232 240) 25%, transparent 25%), linear-gradient(-45deg, rgb(226 232 240) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, rgb(226 232 240) 75%), linear-gradient(-45deg, transparent 75%, rgb(226 232 240) 75%)",
            backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
            backgroundSize: "20px 20px",
          }}
        >
          <div
            className="h-36 rounded-xl border border-border/70 shadow-xs"
            data-testid="preview-swatch"
            style={{ background: swatchStyle }}
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <SummaryRow label="HEX" value={hexValue} />
          <SummaryRow label="RGB" value={rgbValue} />
          <SummaryRow label={messages.keywordLabel} value={keywordValue} />
        </div>
      </ToolPanelCardContent>
    </ToolPanelCard>
  )
}
