import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import {
  ToolPanelCard,
  ToolPanelCardContent,
} from "@workspace/ui/components/tool/tool-panel-card"

import type { CidrParserMessages, DetailItem } from "../types"

type DetailsCardProps = Readonly<{
  title: string
  description: string
  items: readonly DetailItem[]
  messages: CidrParserMessages
}>

function DetailsCard({
  title,
  description,
  items,
  messages,
}: DetailsCardProps) {
  return (
    <ToolPanelCard>
      <CardHeader className="border-b">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <ToolPanelCardContent className="gap-3 py-4">
        {items.map((item) => (
          <div
            key={item.label}
            className="flex flex-wrap items-start justify-between gap-3 rounded-xl border border-border/70 bg-card p-3"
          >
            <div className="min-w-0 flex-1">
              <p className="text-sm text-muted-foreground">{item.label}</p>
              <p
                dir="ltr"
                className="mt-1 text-left font-mono text-sm break-all text-foreground [unicode-bidi:isolate] sm:text-base"
              >
                {item.value}
              </p>
            </div>

            {item.copyValue ? (
              <ToolCopyButton
                value={item.copyValue}
                copyLabel={messages.copyLabel}
                copiedLabel={messages.copiedLabel}
                variant="ghost"
              />
            ) : null}
          </div>
        ))}
      </ToolPanelCardContent>
    </ToolPanelCard>
  )
}

export { DetailsCard }
