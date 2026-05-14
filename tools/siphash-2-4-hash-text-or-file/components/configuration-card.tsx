import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@workspace/ui/components/ui/field"
import { Input } from "@workspace/ui/components/ui/input"

import type { SipHash24HashTextOrFilePageMessages } from "../client/types"
import type { SipHashKeyState } from "../core/siphash"

type ConfigurationCardProps = Readonly<{
  keyInputId: string
  keyDescriptionId: string
  keyInput: string
  keyState: SipHashKeyState
  messages: SipHash24HashTextOrFilePageMessages
  onKeyInputChange: (value: string) => void
}>

function ConfigurationCard({
  keyInputId,
  keyDescriptionId,
  keyInput,
  keyState,
  messages,
  onKeyInputChange,
}: ConfigurationCardProps) {
  const invalid = keyState.status === "invalid"

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>{messages.configurationLabel}</CardTitle>
        <CardDescription>{messages.configurationDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        <Field className="grid gap-2" data-invalid={invalid || undefined}>
          <FieldLabel htmlFor={keyInputId}>{messages.keyLabel}</FieldLabel>
          <Input
            id={keyInputId}
            value={keyInput}
            placeholder={messages.keyPlaceholder}
            autoComplete="off"
            spellCheck={false}
            inputMode="text"
            aria-invalid={invalid || undefined}
            aria-describedby={keyDescriptionId}
            className="font-mono text-sm"
            onChange={(event) => {
              onKeyInputChange(event.target.value)
            }}
          />
          {invalid ? (
            <FieldError id={keyDescriptionId}>
              {messages.keyInvalidLabel}
            </FieldError>
          ) : (
            <FieldDescription id={keyDescriptionId}>
              {messages.keyDescription}
            </FieldDescription>
          )}
        </Field>
      </CardContent>
    </Card>
  )
}

export { ConfigurationCard }
