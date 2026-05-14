import { Button } from "@workspace/ui/components/ui/button"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@workspace/ui/components/ui/field"
import { Input } from "@workspace/ui/components/ui/input"
import { Switch } from "@workspace/ui/components/ui/switch"

import type { JwtSignerMessages } from "../client/types"
import type { NumericDateValue } from "../payload-claims"

type ClaimHelpersProps = Readonly<{
  messages: JwtSignerMessages
  iatId: string
  expId: string
  useCurrentIat: boolean
  iatValue: NumericDateValue
  iatSigningValue: NumericDateValue
  expValue: NumericDateValue
  expSigningValue: NumericDateValue
  expInputValue: string
  relativeExpOffset: number | null
  payloadInvalid: boolean
  onUseCurrentIatChange: (value: boolean) => void
  onExpInputChange: (value: string) => void
  onExpOffsetClick: (seconds: number) => void
  onClearExp: () => void
}>

const expirationOffsets = [
  { seconds: 15 * 60, messageKey: "expQuick15m" },
  { seconds: 60 * 60, messageKey: "expQuick1h" },
  { seconds: 24 * 60 * 60, messageKey: "expQuick24h" },
  { seconds: 7 * 24 * 60 * 60, messageKey: "expQuick7d" },
] as const

function ClaimHelpers({
  messages,
  iatId,
  expId,
  useCurrentIat,
  iatValue,
  iatSigningValue,
  expValue,
  expSigningValue,
  expInputValue,
  relativeExpOffset,
  payloadInvalid,
  onUseCurrentIatChange,
  onExpInputChange,
  onExpOffsetClick,
  onClearExp,
}: ClaimHelpersProps) {
  const expInvalid = expValue.status === "invalid"

  return (
    <>
      <FieldSeparator>{messages.claimsHelperTitle}</FieldSeparator>
      <FieldGroup className="gap-4">
        <FieldDescription>{messages.claimsHelperDescription}</FieldDescription>

        <Field
          orientation="horizontal"
          data-disabled={payloadInvalid}
          data-invalid={iatValue.status === "invalid"}
        >
          <Switch
            id={iatId}
            checked={useCurrentIat}
            disabled={payloadInvalid}
            aria-label={messages.iatNowLabel}
            onCheckedChange={onUseCurrentIatChange}
          />
          <FieldContent>
            <FieldLabel htmlFor={iatId}>{messages.iatNowLabel}</FieldLabel>
            <FieldDescription>{messages.iatNowDescription}</FieldDescription>
            <ClaimValues
              messages={messages}
              payloadValue={iatValue}
              signingValue={iatSigningValue}
            />
          </FieldContent>
        </Field>

        <Field data-disabled={payloadInvalid} data-invalid={expInvalid}>
          <FieldLabel htmlFor={expId}>{messages.expLabel}</FieldLabel>
          <Input
            id={expId}
            type="datetime-local"
            step={1}
            value={expInputValue}
            disabled={payloadInvalid}
            aria-invalid={expInvalid}
            onChange={(event) => {
              onExpInputChange(event.target.value)
            }}
          />
          <div className="flex flex-wrap gap-2">
            {expirationOffsets.map((offset) => (
              <Button
                key={offset.seconds}
                type="button"
                variant={
                  relativeExpOffset === offset.seconds ? "default" : "outline"
                }
                size="xs"
                aria-pressed={relativeExpOffset === offset.seconds}
                disabled={payloadInvalid}
                onClick={() => {
                  onExpOffsetClick(offset.seconds)
                }}
              >
                {messages[offset.messageKey]}
              </Button>
            ))}
            <Button
              type="button"
              variant="ghost"
              size="xs"
              disabled={payloadInvalid || expValue.status === "missing"}
              onClick={onClearExp}
            >
              {messages.clearExpButton}
            </Button>
          </div>
          <FieldDescription>{messages.expDescription}</FieldDescription>
          <ClaimValues
            messages={messages}
            payloadValue={expValue}
            signingValue={expSigningValue}
          />
          <FieldError>
            {expInvalid ? messages.claimInvalidValueLabel : ""}
          </FieldError>
        </Field>

        <FieldError>
          {payloadInvalid ? messages.claimsInvalidPayloadMessage : ""}
        </FieldError>
      </FieldGroup>
    </>
  )
}

function ClaimValues({
  messages,
  payloadValue,
  signingValue,
}: Readonly<{
  messages: JwtSignerMessages
  payloadValue: NumericDateValue
  signingValue: NumericDateValue
}>) {
  return (
    <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
      <ClaimValue
        label={messages.claimCurrentValueLabel}
        messages={messages}
        value={payloadValue}
      />
      <ClaimValue
        label={messages.claimSigningValueLabel}
        messages={messages}
        value={signingValue}
      />
    </div>
  )
}

function ClaimValue({
  label,
  messages,
  value,
}: Readonly<{
  label: string
  messages: JwtSignerMessages
  value: NumericDateValue
}>) {
  return (
    <span>
      {label}:{" "}
      <code className="rounded bg-muted px-1 py-0.5 font-mono">
        {formatClaimValue(messages, value)}
      </code>
    </span>
  )
}

function formatClaimValue(
  messages: JwtSignerMessages,
  value: NumericDateValue
) {
  switch (value.status) {
    case "valid":
      return String(value.value)
    case "missing":
      return messages.claimNotSetLabel
    case "invalid":
      return messages.claimInvalidValueLabel
  }
}

export { ClaimHelpers }
