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

import { type KeyLengthBits, type KeySource } from "../core/aes-encryptor"
import { SelectField } from "./select-field"

import type { AesEncryptorMessages } from "./types"

function KeyCard({
  keyLengthBits,
  keySource,
  messages,
  password,
  passwordInputId,
  rawKeyHex,
  rawKeyInputId,
  rawKeyInvalid,
  onKeySourceChange,
  onPasswordChange,
  onRawKeyHexChange,
}: Readonly<{
  keyLengthBits: KeyLengthBits
  keySource: KeySource
  messages: AesEncryptorMessages
  password: string
  passwordInputId: string
  rawKeyHex: string
  rawKeyInputId: string
  rawKeyInvalid: boolean
  onKeySourceChange: (value: KeySource) => void
  onPasswordChange: (value: string) => void
  onRawKeyHexChange: (value: string) => void
}>) {
  return (
    <ToolPanelCard>
      <CardHeader className="border-b">
        <CardTitle>{messages.keyCardTitle}</CardTitle>
        <CardDescription>{messages.keyCardDescription}</CardDescription>
      </CardHeader>
      <ToolPanelCardContent className="gap-5">
        <FieldGroup>
          <SelectField
            label={messages.keySourceLabel}
            value={keySource}
            options={[
              { value: "password", label: messages.passwordSourceLabel },
              { value: "raw", label: messages.rawKeySourceLabel },
            ]}
            onValueChange={onKeySourceChange}
          />

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
                placeholder={
                  keyLengthBits === 256 ? messages.rawKeyPlaceholder : ""
                }
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
