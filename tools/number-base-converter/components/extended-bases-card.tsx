import {
  ToolPanelCard,
  ToolPanelCardContent,
} from "@workspace/ui/components/tool/tool-panel-card"
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"

import { BaseField } from "./base-field"

import type { NumberBaseConverterMessages } from "../types"

type ExtendedBasesCardProps = Readonly<{
  base32Id: string
  base36Id: string
  base62Id: string
  base64Id: string
  fields: {
    base32: string
    base36: string
    base62: string
    base64: string
  }
  invalidStates: {
    base32: boolean
    base36: boolean
    base62: boolean
    base64: boolean
  }
  messages: NumberBaseConverterMessages
  onBase32Change: (value: string) => void
  onBase36Change: (value: string) => void
  onBase62Change: (value: string) => void
  onBase64Change: (value: string) => void
}>

function ExtendedBasesCard({
  base32Id,
  base36Id,
  base62Id,
  base64Id,
  fields,
  invalidStates,
  messages,
  onBase32Change,
  onBase36Change,
  onBase62Change,
  onBase64Change,
}: ExtendedBasesCardProps) {
  return (
    <ToolPanelCard>
      <CardHeader className="border-b">
        <CardTitle>{messages.extendedBasesTitle}</CardTitle>
        <CardDescription>{messages.extendedBasesDescription}</CardDescription>
      </CardHeader>
      <ToolPanelCardContent className="grid gap-4 md:grid-cols-2">
        <BaseField
          copiedLabel={messages.copiedLabel}
          copyLabel={messages.copyValueLabel}
          id={base32Id}
          invalidDescription={messages.invalidInputDescription}
          isInvalid={invalidStates.base32}
          label={messages.base32Label}
          onChange={onBase32Change}
          placeholder={messages.base32Placeholder}
          value={fields.base32}
        />
        <BaseField
          copiedLabel={messages.copiedLabel}
          copyLabel={messages.copyValueLabel}
          id={base36Id}
          invalidDescription={messages.invalidInputDescription}
          isInvalid={invalidStates.base36}
          label={messages.base36Label}
          onChange={onBase36Change}
          placeholder={messages.base36Placeholder}
          value={fields.base36}
        />
        <BaseField
          copiedLabel={messages.copiedLabel}
          copyLabel={messages.copyValueLabel}
          id={base62Id}
          invalidDescription={messages.invalidInputDescription}
          isInvalid={invalidStates.base62}
          label={messages.base62Label}
          onChange={onBase62Change}
          placeholder={messages.base62Placeholder}
          value={fields.base62}
        />
        <BaseField
          copiedLabel={messages.copiedLabel}
          copyLabel={messages.copyValueLabel}
          id={base64Id}
          invalidDescription={messages.invalidInputDescription}
          isInvalid={invalidStates.base64}
          label={messages.base64Label}
          onChange={onBase64Change}
          placeholder={messages.base64Placeholder}
          value={fields.base64}
        />
      </ToolPanelCardContent>
    </ToolPanelCard>
  )
}

export { ExtendedBasesCard }
