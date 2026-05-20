import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import {
  ToolPanelCard,
  ToolPanelCardContent,
  ToolPanelCardFooter,
} from "@workspace/ui/components/tool/tool-panel-card"
import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@workspace/ui/components/ui/field"
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { Badge } from "@workspace/ui/components/ui/badge"
import { Input } from "@workspace/ui/components/ui/input"

import type { UuidV5Messages } from "../types"

type UuidV5ResultCardProps = Readonly<{
  messages: UuidV5Messages
  resultId: string
  uuid: string
  hasNamespaceError: boolean
}>

function UuidV5ResultCard({
  messages,
  resultId,
  uuid,
  hasNamespaceError,
}: UuidV5ResultCardProps) {
  return (
    <ToolPanelCard>
      <CardHeader className="border-b">
        <CardTitle>{messages.resultTitle}</CardTitle>
        <CardDescription>{messages.resultDescription}</CardDescription>
      </CardHeader>
      <ToolPanelCardContent className="gap-5">
        <Field>
          <FieldLabel htmlFor={resultId}>{messages.resultLabel}</FieldLabel>
          <Input
            id={resultId}
            name="uuid-v5-result"
            autoComplete="off"
            value={uuid}
            readOnly
            spellCheck={false}
            dir="ltr"
            placeholder={
              hasNamespaceError
                ? messages.resultInvalidPlaceholder
                : messages.resultPlaceholder
            }
            className="font-mono text-sm"
          />
          <FieldDescription>{messages.resultDescription}</FieldDescription>
        </Field>

        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">{messages.versionBadgeLabel}</Badge>
          <Badge variant="outline">{messages.variantBadgeLabel}</Badge>
          <Badge variant="outline">{messages.deterministicBadgeLabel}</Badge>
        </div>
      </ToolPanelCardContent>
      <ToolPanelCardFooter className="border-t">
        <ToolCopyButton
          value={uuid}
          copyLabel={messages.copyUuidLabel}
          copiedLabel={messages.copiedLabel}
          disabled={uuid.length === 0}
        />
      </ToolPanelCardFooter>
    </ToolPanelCard>
  )
}

export { UuidV5ResultCard }
