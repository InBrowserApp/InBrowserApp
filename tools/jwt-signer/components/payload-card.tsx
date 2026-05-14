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
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/ui/field"
import { Textarea } from "@workspace/ui/components/ui/textarea"

import { ClaimHelpers } from "./claim-helpers"

import type { JwtSignerMessages } from "../client/types"
import type { NumericDateValue } from "../payload-claims"

type PayloadCardProps = Readonly<{
  messages: JwtSignerMessages
  payloadId: string
  headerId: string
  iatId: string
  expId: string
  payloadText: string
  headerText: string
  useCurrentIat: boolean
  iatValue: NumericDateValue
  iatSigningValue: NumericDateValue
  expValue: NumericDateValue
  expSigningValue: NumericDateValue
  expInputValue: string
  relativeExpOffset: number | null
  payloadInvalid: boolean
  headerInvalid: boolean
  payloadError: string
  headerError: string
  onPayloadChange: (value: string) => void
  onHeaderChange: (value: string) => void
  onUseCurrentIatChange: (value: boolean) => void
  onExpInputChange: (value: string) => void
  onExpOffsetClick: (seconds: number) => void
  onClearExp: () => void
}>

function PayloadCard({
  messages,
  payloadId,
  headerId,
  iatId,
  expId,
  payloadText,
  headerText,
  useCurrentIat,
  iatValue,
  iatSigningValue,
  expValue,
  expSigningValue,
  expInputValue,
  relativeExpOffset,
  payloadInvalid,
  headerInvalid,
  payloadError,
  headerError,
  onPayloadChange,
  onHeaderChange,
  onUseCurrentIatChange,
  onExpInputChange,
  onExpOffsetClick,
  onClearExp,
}: PayloadCardProps) {
  return (
    <ToolPanelCard>
      <CardHeader className="border-b">
        <CardTitle>{messages.payloadCardTitle}</CardTitle>
        <CardDescription>{messages.payloadCardDescription}</CardDescription>
      </CardHeader>
      <ToolPanelCardContent className="gap-5">
        <FieldGroup>
          <Field data-invalid={payloadInvalid}>
            <FieldLabel htmlFor={payloadId}>{messages.payloadLabel}</FieldLabel>
            <Textarea
              id={payloadId}
              value={payloadText}
              spellCheck={false}
              autoCapitalize="none"
              aria-invalid={payloadInvalid}
              className="min-h-52 font-mono text-sm"
              placeholder={messages.payloadPlaceholder}
              onChange={(event) => {
                onPayloadChange(event.target.value)
              }}
            />
            <FieldError>{payloadError}</FieldError>
          </Field>

          <ClaimHelpers
            messages={messages}
            iatId={iatId}
            expId={expId}
            useCurrentIat={useCurrentIat}
            iatValue={iatValue}
            iatSigningValue={iatSigningValue}
            expValue={expValue}
            expSigningValue={expSigningValue}
            expInputValue={expInputValue}
            relativeExpOffset={relativeExpOffset}
            payloadInvalid={payloadInvalid}
            onUseCurrentIatChange={onUseCurrentIatChange}
            onExpInputChange={onExpInputChange}
            onExpOffsetClick={onExpOffsetClick}
            onClearExp={onClearExp}
          />

          <Field data-invalid={headerInvalid}>
            <FieldLabel htmlFor={headerId}>{messages.headerLabel}</FieldLabel>
            <Textarea
              id={headerId}
              value={headerText}
              spellCheck={false}
              autoCapitalize="none"
              aria-invalid={headerInvalid}
              className="min-h-28 font-mono text-sm"
              placeholder={messages.headerPlaceholder}
              onChange={(event) => {
                onHeaderChange(event.target.value)
              }}
            />
            <FieldDescription>{messages.headerDescription}</FieldDescription>
            <FieldError>{headerError}</FieldError>
          </Field>
        </FieldGroup>
      </ToolPanelCardContent>
    </ToolPanelCard>
  )
}

export { PayloadCard }
