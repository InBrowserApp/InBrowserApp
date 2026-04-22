import {
  ToolPanelCard,
  ToolPanelCardContent,
} from "@workspace/ui/components/tool/tool-panel-card"
import { CardHeader, CardTitle } from "@workspace/ui/components/ui/card"
import { Input } from "@workspace/ui/components/ui/input"

import { PanelField } from "./panel-field"
import type { EditableUrlDraft, UrlParserBuilderMessages } from "../types"

type TextDraftField = Exclude<keyof EditableUrlDraft, "queryParams">

type UrlRouteCardProps = Readonly<{
  draft: EditableUrlDraft
  messages: UrlParserBuilderMessages
  onFieldChange: (field: TextDraftField, value: string) => void
}>

function UrlRouteCard({ draft, messages, onFieldChange }: UrlRouteCardProps) {
  return (
    <ToolPanelCard>
      <CardHeader className="border-b">
        <CardTitle>{messages.routeCardLabel}</CardTitle>
      </CardHeader>

      <ToolPanelCardContent className="grid gap-4 pt-4">
        <PanelField label={messages.pathLabel}>
          <Input
            name="pathname"
            autoComplete="off"
            spellCheck={false}
            aria-label={messages.pathLabel}
            value={draft.pathname}
            onChange={(event) => {
              onFieldChange("pathname", event.target.value)
            }}
          />
        </PanelField>

        <PanelField label={messages.hashLabel}>
          <Input
            name="hash"
            autoComplete="off"
            spellCheck={false}
            aria-label={messages.hashLabel}
            value={draft.hash}
            onChange={(event) => {
              onFieldChange("hash", event.target.value)
            }}
          />
        </PanelField>
      </ToolPanelCardContent>
    </ToolPanelCard>
  )
}

export { UrlRouteCard }
