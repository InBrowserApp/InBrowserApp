import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import {
  ToolPanelCard,
  ToolPanelCardContent,
} from "@workspace/ui/components/tool/tool-panel-card"
import {
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"

import type { CssBoxShadowMessages } from "../client/types"

type OutputCardProps = Readonly<{
  cssOutput: string
  messages: CssBoxShadowMessages
}>

function OutputCard({ cssOutput, messages }: OutputCardProps) {
  return (
    <ToolPanelCard>
      <CardHeader className="border-b">
        <CardTitle>{messages.outputTitle}</CardTitle>
        <CardDescription>{messages.outputHint}</CardDescription>
        <CardAction>
          <ToolCopyButton
            copiedLabel={messages.copiedLabel}
            copyLabel={messages.copyLabel}
            value={cssOutput}
          />
        </CardAction>
      </CardHeader>
      <ToolPanelCardContent>
        <pre
          className="overflow-x-auto rounded-xl border bg-muted/20 p-4 font-mono text-sm leading-6"
          data-testid="shadow-output"
        >
          <code>{cssOutput}</code>
        </pre>
      </ToolPanelCardContent>
    </ToolPanelCard>
  )
}

export { OutputCard }
