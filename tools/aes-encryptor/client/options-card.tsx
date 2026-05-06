import {
  ToolPanelCard,
  ToolPanelCardContent,
  ToolPanelCardFooter,
} from "@workspace/ui/components/tool/tool-panel-card"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/ui/alert"
import { Button } from "@workspace/ui/components/ui/button"
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/ui/field"
import { Input } from "@workspace/ui/components/ui/input"
import { Lock, RefreshCcw, TriangleAlert } from "@workspace/ui/icons"

import {
  MAX_PBKDF2_ITERATIONS,
  MIN_PBKDF2_ITERATIONS,
  type AesMode,
  type KeyLengthBits,
  type KeySource,
  type Pbkdf2Hash,
} from "../core/aes-encryptor"
import { SelectField } from "./select-field"

import type { AesEncryptorMessages } from "./types"

const KEY_LENGTH_OPTIONS: readonly KeyLengthBits[] = [128, 192, 256]

function OptionsCard({
  canEncrypt,
  iterationsInputId,
  iterationsInvalid,
  keyLengthBits,
  keySource,
  messages,
  mode,
  pbkdf2Hash,
  pbkdf2Iterations,
  securityNote,
  onEncrypt,
  onKeyLengthChange,
  onModeChange,
  onPbkdf2HashChange,
  onPbkdf2IterationsChange,
  onReset,
}: Readonly<{
  canEncrypt: boolean
  iterationsInputId: string
  iterationsInvalid: boolean
  keyLengthBits: KeyLengthBits
  keySource: KeySource
  messages: AesEncryptorMessages
  mode: AesMode
  pbkdf2Hash: Pbkdf2Hash
  pbkdf2Iterations: string
  securityNote: string
  onEncrypt: () => void
  onKeyLengthChange: (value: KeyLengthBits) => void
  onModeChange: (value: AesMode) => void
  onPbkdf2HashChange: (value: Pbkdf2Hash) => void
  onPbkdf2IterationsChange: (value: string) => void
  onReset: () => void
}>) {
  return (
    <ToolPanelCard>
      <CardHeader className="border-b">
        <CardTitle>{messages.optionsCardTitle}</CardTitle>
        <CardDescription>{messages.optionsCardDescription}</CardDescription>
      </CardHeader>
      <ToolPanelCardContent className="gap-5">
        <FieldGroup>
          <div className="grid gap-5 sm:grid-cols-2">
            <SelectField
              label={messages.modeLabel}
              value={mode}
              options={[
                { value: "GCM", label: messages.gcmModeLabel },
                { value: "CBC", label: messages.cbcModeLabel },
                { value: "CTR", label: messages.ctrModeLabel },
              ]}
              onValueChange={onModeChange}
            />
            <SelectField
              label={messages.keyLengthLabel}
              value={String(keyLengthBits)}
              options={KEY_LENGTH_OPTIONS.map((value) => ({
                value: String(value),
                label: `${value}-bit`,
              }))}
              onValueChange={(value) =>
                onKeyLengthChange(Number(value) as KeyLengthBits)
              }
            />
          </div>

          {keySource === "password" ? (
            <div className="grid gap-5 sm:grid-cols-2">
              <Field data-invalid={iterationsInvalid}>
                <FieldLabel htmlFor={iterationsInputId}>
                  {messages.pbkdf2IterationsLabel}
                </FieldLabel>
                <Input
                  id={iterationsInputId}
                  type="number"
                  min={MIN_PBKDF2_ITERATIONS}
                  max={MAX_PBKDF2_ITERATIONS}
                  step={1000}
                  value={pbkdf2Iterations}
                  aria-invalid={iterationsInvalid}
                  onChange={(event) =>
                    onPbkdf2IterationsChange(event.target.value)
                  }
                />
                <FieldError>
                  {iterationsInvalid
                    ? messages.validationIterationsInvalid
                    : null}
                </FieldError>
              </Field>
              <SelectField
                label={messages.pbkdf2HashLabel}
                value={pbkdf2Hash}
                options={[
                  { value: "SHA-256", label: messages.sha256Label },
                  { value: "SHA-384", label: messages.sha384Label },
                  { value: "SHA-512", label: messages.sha512Label },
                ]}
                onValueChange={onPbkdf2HashChange}
              />
            </div>
          ) : null}

          <Alert>
            <TriangleAlert />
            <AlertTitle>{messages.securityNoteTitle}</AlertTitle>
            <AlertDescription>{securityNote}</AlertDescription>
          </Alert>
        </FieldGroup>
      </ToolPanelCardContent>
      <ToolPanelCardFooter className="justify-between gap-3 border-t">
        <Button type="button" variant="ghost" size="sm" onClick={onReset}>
          <RefreshCcw data-icon="inline-start" />
          {messages.resetLabel}
        </Button>
        <Button
          type="button"
          size="sm"
          disabled={!canEncrypt}
          onClick={onEncrypt}
        >
          <Lock data-icon="inline-start" />
          {messages.encryptLabel}
        </Button>
      </ToolPanelCardFooter>
    </ToolPanelCard>
  )
}

export { OptionsCard }
