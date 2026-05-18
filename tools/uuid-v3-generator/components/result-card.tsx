import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import {
  ToolPanelCard,
  ToolPanelCardContent,
  ToolPanelCardFooter,
} from "@workspace/ui/components/tool/tool-panel-card"
import { Badge } from "@workspace/ui/components/ui/badge"
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@workspace/ui/components/ui/field"
import { Input } from "@workspace/ui/components/ui/input"

import type { UuidV3Messages } from "../types"

type UuidV3ResultCardProps = Readonly<{
  messages: UuidV3Messages
  resultId: string
  uuid: string
  hasNamespaceError: boolean
}>

function UuidV3ResultCard({
  messages,
  resultId,
  uuid,
  hasNamespaceError,
}: UuidV3ResultCardProps) {
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
            name="uuid-v3-result"
            autoComplete="off"
            value={uuid}
            readOnly
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

export { UuidV3ResultCard }
