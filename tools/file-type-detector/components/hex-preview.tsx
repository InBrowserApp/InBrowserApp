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
import type { Inspection, Messages } from "../types"

export function HexPreview({
  result,
  messages: m,
}: {
  result: Inspection
  messages: Messages
}) {
  return (
    <ToolPanelCard className="min-w-0">
      <CardHeader className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 space-y-2">
          <CardTitle>{m.hexTitle}</CardTitle>
          <CardDescription>{m.hexDescription}</CardDescription>
        </div>
        <ToolCopyButton
          value={result.hex}
          copyLabel={m.copyHex}
          copiedLabel={m.copied}
        />
      </CardHeader>
      <ToolPanelCardContent>
        {result.hex ? (
          <div
            className="overflow-x-auto rounded-lg border bg-muted/30 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            role="region"
            aria-label={m.hexTitle}
            // oxlint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- The horizontal scroll region needs keyboard access.
            tabIndex={0}
          >
            <pre
              className="w-max min-w-full p-4 font-mono text-xs leading-6 tabular-nums"
              dir="ltr"
              translate="no"
            >
              <span
                className="grid grid-cols-[10ch_49ch_auto] text-muted-foreground"
                translate="yes"
              >
                <span>{m.offset}</span>
                <span>{m.hex}</span>
                <span>{m.ascii}</span>
              </span>
              {result.hex}
            </pre>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">{m.hexEmpty}</p>
        )}
      </ToolPanelCardContent>
    </ToolPanelCard>
  )
}
