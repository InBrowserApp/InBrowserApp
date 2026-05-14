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
import { Input } from "@workspace/ui/components/ui/input"

import type { AesEncryptedEnvelope } from "../core/aes-decryptor"
import type { AesDecryptorMessages } from "./types"

function KeyCard({
  envelope,
  messages,
  password,
  passwordInputId,
  rawKeyHex,
  rawKeyInputId,
  rawKeyInvalid,
  onPasswordChange,
  onRawKeyHexChange,
}: Readonly<{
  envelope: AesEncryptedEnvelope | null
  messages: AesDecryptorMessages
  password: string
  passwordInputId: string
  rawKeyHex: string
  rawKeyInputId: string
  rawKeyInvalid: boolean
  onPasswordChange: (value: string) => void
  onRawKeyHexChange: (value: string) => void
}>) {
  const keySource = envelope?.key.source ?? "password"
  const rawKeyPlaceholder =
    keySource === "raw" && envelope
      ? `${envelope.key.lengthBits / 4} hex characters`
      : messages.rawKeyPlaceholder

  return (
    <ToolPanelCard>
      <CardHeader className="border-b">
        <CardTitle>{messages.keyCardTitle}</CardTitle>
        <CardDescription>{messages.keyCardDescription}</CardDescription>
      </CardHeader>
      <ToolPanelCardContent className="gap-5">
        <FieldGroup>
          <Field>
            <FieldLabel>{messages.envelopeKeySourceLabel}</FieldLabel>
            <FieldDescription>
              {keySource === "password"
                ? messages.passwordSourceLabel
                : messages.rawKeySourceLabel}
            </FieldDescription>
          </Field>

          {keySource === "password" ? (
            <Field>
              <FieldLabel htmlFor={passwordInputId}>
                {messages.passwordLabel}
              </FieldLabel>
              <Input
                id={passwordInputId}
                type="password"
                value={password}
                autoComplete="new-password"
                placeholder={messages.passwordPlaceholder}
                onChange={(event) => onPasswordChange(event.target.value)}
              />
            </Field>
          ) : (
            <Field data-invalid={rawKeyInvalid}>
              <FieldLabel htmlFor={rawKeyInputId}>
                {messages.rawKeyLabel}
              </FieldLabel>
              <Input
                id={rawKeyInputId}
                value={rawKeyHex}
                autoCapitalize="none"
                spellCheck={false}
                aria-invalid={rawKeyInvalid}
                className="font-mono"
                placeholder={rawKeyPlaceholder}
                onChange={(event) => onRawKeyHexChange(event.target.value)}
              />
              <FieldDescription>
                {messages.validationRawKeyInvalid}
              </FieldDescription>
              <FieldError>
                {rawKeyInvalid ? messages.validationRawKeyInvalid : null}
              </FieldError>
            </Field>
          )}
        </FieldGroup>
      </ToolPanelCardContent>
    </ToolPanelCard>
  )
}

export { KeyCard }
