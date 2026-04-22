import {
  ToolPanelCard,
  ToolPanelCardContent,
} from "@workspace/ui/components/tool/tool-panel-card"
import { CardHeader, CardTitle } from "@workspace/ui/components/ui/card"
import { Input } from "@workspace/ui/components/ui/input"

import { PanelField } from "./panel-field"
import type { EditableUrlDraft, UrlParserBuilderMessages } from "../types"

type TextDraftField = Exclude<keyof EditableUrlDraft, "queryParams">

type UrlAuthorityCardProps = Readonly<{
  draft: EditableUrlDraft
  invalidField: "protocol" | "hostname" | "port" | null
  messages: UrlParserBuilderMessages
  onFieldChange: (field: TextDraftField, value: string) => void
}>

function UrlAuthorityCard({
  draft,
  invalidField,
  messages,
  onFieldChange,
}: UrlAuthorityCardProps) {
  return (
    <ToolPanelCard>
      <CardHeader className="border-b">
        <CardTitle>{messages.authorityCardLabel}</CardTitle>
      </CardHeader>

      <ToolPanelCardContent className="grid gap-4 pt-4 sm:grid-cols-2">
        <PanelField label={messages.protocolLabel}>
          <Input
            name="protocol"
            autoComplete="off"
            spellCheck={false}
            aria-label={messages.protocolLabel}
            aria-invalid={invalidField === "protocol"}
            value={draft.protocol}
            onChange={(event) => {
              onFieldChange("protocol", event.target.value)
            }}
          />
        </PanelField>

        <PanelField label={messages.hostnameLabel}>
          <Input
            name="hostname"
            autoComplete="off"
            spellCheck={false}
            aria-label={messages.hostnameLabel}
            aria-invalid={invalidField === "hostname"}
            value={draft.hostname}
            onChange={(event) => {
              onFieldChange("hostname", event.target.value)
            }}
          />
        </PanelField>

        <PanelField label={messages.usernameLabel}>
          <Input
            name="username"
            autoComplete="off"
            spellCheck={false}
            aria-label={messages.usernameLabel}
            value={draft.username}
            onChange={(event) => {
              onFieldChange("username", event.target.value)
            }}
          />
        </PanelField>

        <PanelField label={messages.passwordLabel}>
          <Input
            name="password"
            autoComplete="off"
            spellCheck={false}
            aria-label={messages.passwordLabel}
            value={draft.password}
            onChange={(event) => {
              onFieldChange("password", event.target.value)
            }}
          />
        </PanelField>

        <PanelField className="sm:col-span-2" label={messages.portLabel}>
          <Input
            name="port"
            inputMode="numeric"
            autoComplete="off"
            spellCheck={false}
            aria-label={messages.portLabel}
            aria-invalid={invalidField === "port"}
            value={draft.port}
            onChange={(event) => {
              onFieldChange("port", event.target.value)
            }}
          />
        </PanelField>
      </ToolPanelCardContent>
    </ToolPanelCard>
  )
}

export { UrlAuthorityCard }
