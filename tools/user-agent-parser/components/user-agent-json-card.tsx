import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import {
  ToolPanelCard,
  ToolPanelCardContent,
  ToolPanelCardFooter,
} from "@workspace/ui/components/tool/tool-panel-card"
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
import { FileJson2 } from "@workspace/ui/icons"

import type { UserAgentParserMessages } from "../client/types"
import { HighlightedJson } from "./highlighted-json"

type UserAgentJsonCardProps = Readonly<{
  jsonOutput: string
  messages: UserAgentParserMessages
}>

function UserAgentJsonCard({ jsonOutput, messages }: UserAgentJsonCardProps) {
  const hasOutput = jsonOutput.length > 0

  return (
    <ToolPanelCard>
      <CardHeader className="border-b">
        <CardTitle>{messages["json-output"]}</CardTitle>
        <CardDescription>{messages["empty-state"]}</CardDescription>
      </CardHeader>
      <ToolPanelCardContent className="min-h-0 gap-4">
        {hasOutput ? (
          <HighlightedJson
            ariaLabel={messages["json-output"]}
            value={jsonOutput}
          />
        ) : (
          <Empty className="min-h-72 flex-1 border-0 p-0">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <FileJson2 />
              </EmptyMedia>
              <EmptyTitle>{messages["json-output"]}</EmptyTitle>
              <EmptyDescription>{messages["empty-state"]}</EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
      </ToolPanelCardContent>
      <ToolPanelCardFooter className="justify-end gap-3 border-t">
        <ToolCopyButton
          value={jsonOutput}
          copyLabel={messages.copyLabel}
          copiedLabel={messages.copiedLabel}
          disabled={!hasOutput}
        />
      </ToolPanelCardFooter>
    </ToolPanelCard>
  )
}

export { UserAgentJsonCard }
