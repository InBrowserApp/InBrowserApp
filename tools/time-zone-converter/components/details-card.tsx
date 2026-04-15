import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import {
  ToolPanelCard,
  ToolPanelCardContent,
} from "@workspace/ui/components/tool/tool-panel-card"
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"

import type { DetailsCardProps } from "../types"

function DetailsCard({ messages, details }: DetailsCardProps) {
  const rows = [
    {
      label: messages.iso8601Label,
      value: details?.iso8601 ?? "",
    },
    {
      label: messages.utcLabel,
      value: details?.utc ?? "",
    },
    {
      label: messages.unixMillisecondsLabel,
      value: details?.unixMilliseconds ?? "",
    },
    {
      label: messages.unixSecondsLabel,
      value: details?.unixSeconds ?? "",
    },
  ] as const

  return (
    <ToolPanelCard data-testid="time-zone-details-card">
      <CardHeader className="border-b">
        <CardTitle>{messages.detailsLabel}</CardTitle>
        <CardDescription>{messages.meta.description}</CardDescription>
      </CardHeader>
      <ToolPanelCardContent className="gap-4">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex flex-col gap-3 rounded-xl border border-border/70 bg-muted/20 p-3 md:flex-row md:items-center md:justify-between"
          >
            <div className="grid gap-1">
              <p className="text-sm font-medium text-foreground">{row.label}</p>
              <code className="rounded-md bg-background px-2 py-1 font-mono text-sm break-all text-foreground">
                {row.value || "—"}
              </code>
            </div>
            <ToolCopyButton
              value={row.value}
              copyLabel={messages.copyLabel}
              copiedLabel={messages.copiedLabel}
              variant="ghost"
            />
          </div>
        ))}
      </ToolPanelCardContent>
    </ToolPanelCard>
  )
}

export { DetailsCard }
