import {
  ToolPanelCard,
  ToolPanelCardContent,
} from "@workspace/ui/components/tool/tool-panel-card"
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/ui/field"
import { Input } from "@workspace/ui/components/ui/input"

import { BaseField } from "./base-field"

import type { NumberBaseConverterMessages } from "../types"

type CustomBaseCardProps = Readonly<{
  customBase: number
  customBaseId: string
  customId: string
  customValue: string
  isInvalid: boolean
  messages: NumberBaseConverterMessages
  onCustomBaseChange: (value: number) => void
  onCustomChange: (value: string) => void
}>

function CustomBaseCard({
  customBase,
  customBaseId,
  customId,
  customValue,
  isInvalid,
  messages,
  onCustomBaseChange,
  onCustomChange,
}: CustomBaseCardProps) {
  return (
    <ToolPanelCard>
      <CardHeader className="border-b">
        <CardTitle>{messages.customBaseCardTitle}</CardTitle>
        <CardDescription>{messages.customBaseDescription}</CardDescription>
      </CardHeader>
      <ToolPanelCardContent className="gap-4">
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor={customBaseId}>
              {messages.customBaseLabel}
            </FieldLabel>
            <Input
              className="h-10 max-w-32 font-mono text-sm"
              id={customBaseId}
              inputMode="numeric"
              max={64}
              min={2}
              onChange={(event) => {
                onCustomBaseChange(Number(event.target.value))
              }}
              type="number"
              value={customBase}
            />
            <FieldDescription>{messages.customBaseHelp}</FieldDescription>
          </Field>
        </FieldGroup>

        <BaseField
          copiedLabel={messages.copiedLabel}
          copyLabel={messages.copyValueLabel}
          id={customId}
          invalidDescription={messages.invalidInputDescription}
          isInvalid={isInvalid}
          label={`${messages.customBaseLabel} (${customBase})`}
          onChange={onCustomChange}
          placeholder={messages.customPlaceholder}
          value={customValue}
        />
      </ToolPanelCardContent>
    </ToolPanelCard>
  )
}

export { CustomBaseCard }
