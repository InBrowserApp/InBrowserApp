import {
  ToolPanelCard,
  ToolPanelCardContent,
  ToolPanelCardFooter,
} from "@workspace/ui/components/tool/tool-panel-card"
import { Button } from "@workspace/ui/components/ui/button"
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { RefreshCcw } from "@workspace/ui/icons"

import { BaseField } from "./base-field"

import type { NumberBaseConverterMessages } from "../types"

type StandardBasesCardProps = Readonly<{
  binaryId: string
  copiedLabel: string
  decimalId: string
  fields: {
    binary: string
    decimal: string
    hex: string
    octal: string
  }
  hexId: string
  invalidStates: {
    binary: boolean
    decimal: boolean
    hex: boolean
    octal: boolean
  }
  messages: NumberBaseConverterMessages
  octalId: string
  onBinaryChange: (value: string) => void
  onDecimalChange: (value: string) => void
  onHexChange: (value: string) => void
  onOctalChange: (value: string) => void
  onReset: () => void
}>

function StandardBasesCard({
  binaryId,
  copiedLabel,
  decimalId,
  fields,
  hexId,
  invalidStates,
  messages,
  octalId,
  onBinaryChange,
  onDecimalChange,
  onHexChange,
  onOctalChange,
  onReset,
}: StandardBasesCardProps) {
  return (
    <ToolPanelCard>
      <CardHeader className="border-b">
        <CardTitle>{messages.standardBasesTitle}</CardTitle>
        <CardDescription>{messages.standardBasesDescription}</CardDescription>
      </CardHeader>
      <ToolPanelCardContent className="grid gap-4 md:grid-cols-2">
        <BaseField
          copiedLabel={copiedLabel}
          copyLabel={messages.copyValueLabel}
          id={binaryId}
          invalidDescription={messages.invalidInputDescription}
          isInvalid={invalidStates.binary}
          label={messages.binaryLabel}
          onChange={onBinaryChange}
          placeholder={messages.binaryPlaceholder}
          value={fields.binary}
        />
        <BaseField
          copiedLabel={copiedLabel}
          copyLabel={messages.copyValueLabel}
          id={octalId}
          invalidDescription={messages.invalidInputDescription}
          isInvalid={invalidStates.octal}
          label={messages.octalLabel}
          onChange={onOctalChange}
          placeholder={messages.octalPlaceholder}
          value={fields.octal}
        />
        <BaseField
          copiedLabel={copiedLabel}
          copyLabel={messages.copyValueLabel}
          id={decimalId}
          invalidDescription={messages.invalidInputDescription}
          isInvalid={invalidStates.decimal}
          label={messages.decimalLabel}
          onChange={onDecimalChange}
          placeholder={messages.decimalPlaceholder}
          value={fields.decimal}
        />
        <BaseField
          copiedLabel={copiedLabel}
          copyLabel={messages.copyValueLabel}
          id={hexId}
          invalidDescription={messages.invalidInputDescription}
          isInvalid={invalidStates.hex}
          label={messages.hexLabel}
          onChange={onHexChange}
          placeholder={messages.hexPlaceholder}
          value={fields.hex}
        />
      </ToolPanelCardContent>
      <ToolPanelCardFooter className="justify-end border-t">
        <Button onClick={onReset} size="sm" type="button" variant="ghost">
          <RefreshCcw data-icon="inline-start" />
          {messages.resetLabel}
        </Button>
      </ToolPanelCardFooter>
    </ToolPanelCard>
  )
}

export { StandardBasesCard }
