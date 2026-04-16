import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { Field, FieldLabel } from "@workspace/ui/components/ui/field"
import { Input } from "@workspace/ui/components/ui/input"
import { Slider } from "@workspace/ui/components/ui/slider"

import type { Blake2bHashTextOrFilePageMessages } from "../client/types"
import {
  BLAKE2B_MAX_OUTPUT_LENGTH,
  BLAKE2B_MIN_OUTPUT_LENGTH,
  BLAKE2B_OUTPUT_LENGTH_STEP,
} from "../core/blake2b"

type ConfigurationCardProps = Readonly<{
  keyInputId: string
  keyBase64: string
  messages: Blake2bHashTextOrFilePageMessages
  outputLength: number
  onKeyBase64Change: (value: string) => void
  onOutputLengthChange: (value: number) => void
}>

function ConfigurationCard({
  keyInputId,
  keyBase64,
  messages,
  outputLength,
  onKeyBase64Change,
  onOutputLengthChange,
}: ConfigurationCardProps) {
  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>{messages.configurationLabel}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        <Field>
          <div className="flex items-center justify-between gap-3">
            <FieldLabel>{messages.outputLengthLabel}</FieldLabel>
            <span className="font-mono text-sm text-muted-foreground">
              {outputLength}
            </span>
          </div>

          <Slider
            aria-label={messages.outputLengthLabel}
            max={BLAKE2B_MAX_OUTPUT_LENGTH}
            min={BLAKE2B_MIN_OUTPUT_LENGTH}
            step={BLAKE2B_OUTPUT_LENGTH_STEP}
            value={[outputLength]}
            onValueChange={([nextValue]) => {
              if (nextValue === undefined) {
                return
              }

              onOutputLengthChange(nextValue)
            }}
          />

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{BLAKE2B_MIN_OUTPUT_LENGTH}</span>
            <span>{BLAKE2B_MAX_OUTPUT_LENGTH}</span>
          </div>
        </Field>

        <Field>
          <FieldLabel htmlFor={keyInputId}>{messages.keyLabel}</FieldLabel>
          <Input
            id={keyInputId}
            aria-label={messages.keyLabel}
            placeholder={messages.keyPlaceholder}
            spellCheck={false}
            value={keyBase64}
            onChange={(event) => {
              onKeyBase64Change(event.target.value)
            }}
          />
        </Field>
      </CardContent>
    </Card>
  )
}

export { ConfigurationCard }
