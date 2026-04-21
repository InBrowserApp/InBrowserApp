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

import type { Shake256HashTextOrFilePageMessages } from "../client/types"

type ConfigurationCardProps = Readonly<{
  isOutputLengthValid: boolean
  messages: Shake256HashTextOrFilePageMessages
  outputLengthId: string
  outputLengthInput: string
  onOutputLengthChange: (value: string) => void
}>

function ConfigurationCard({
  isOutputLengthValid,
  messages,
  outputLengthId,
  outputLengthInput,
  onOutputLengthChange,
}: ConfigurationCardProps) {
  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>{messages.configurationLabel}</CardTitle>
        <CardDescription>{messages.configurationDescription}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <Field>
          <FieldLabel htmlFor={outputLengthId}>
            {messages.outputLengthLabel}
          </FieldLabel>
          <Input
            id={outputLengthId}
            type="number"
            min={8}
            max={65536}
            step={8}
            inputMode="numeric"
            aria-invalid={!isOutputLengthValid || undefined}
            aria-label={messages.outputLengthLabel}
            className="font-mono"
            placeholder={messages.outputLengthPlaceholder}
            value={outputLengthInput}
            onChange={(event) => {
              onOutputLengthChange(event.target.value)
            }}
          />
          <FieldDescription>
            {messages.outputLengthDescription}
          </FieldDescription>
          {!isOutputLengthValid ? (
            <FieldError>{messages.outputLengthInvalid}</FieldError>
          ) : null}
        </Field>
      </CardContent>
    </Card>
  )
}

export { ConfigurationCard }
