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
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@workspace/ui/components/ui/toggle-group"

import type { HighwayHashTextOrFilePageMessages } from "../client/types"
import {
  HIGHWAYHASH_OUTPUT_SIZES,
  parseHighwayHashOutputSize,
  type HighwayHashKeyState,
  type HighwayHashOutputSize,
} from "../core/highwayhash"

type ConfigurationCardProps = Readonly<{
  keyInputId: string
  keyDescriptionId: string
  keyInput: string
  keyState: HighwayHashKeyState
  messages: HighwayHashTextOrFilePageMessages
  outputSize: HighwayHashOutputSize
  onKeyInputChange: (value: string) => void
  onOutputSizeChange: (value: HighwayHashOutputSize) => void
}>

function ConfigurationCard({
  keyInputId,
  keyDescriptionId,
  keyInput,
  keyState,
  messages,
  outputSize,
  onKeyInputChange,
  onOutputSizeChange,
}: ConfigurationCardProps) {
  const invalid = keyState.status === "invalid"

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>{messages.configurationLabel}</CardTitle>
        <CardDescription>{messages.configurationDescription}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <Field className="grid gap-2">
          <FieldLabel>{messages.outputSizeLabel}</FieldLabel>
          <ToggleGroup
            type="single"
            variant="outline"
            value={String(outputSize)}
            className="grid w-full grid-cols-3"
            aria-label={messages.outputSizeLabel}
            onValueChange={(value) => {
              const nextOutputSize = parseHighwayHashOutputSize(value)

              if (nextOutputSize !== undefined) {
                onOutputSizeChange(nextOutputSize)
              }
            }}
          >
            {HIGHWAYHASH_OUTPUT_SIZES.map((size) => (
              <ToggleGroupItem key={size} value={String(size)}>
                {resolveOutputSizeLabel(messages, size)}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </Field>

        <Field className="grid gap-2" data-invalid={invalid || undefined}>
          <FieldLabel htmlFor={keyInputId}>{messages.keyLabel}</FieldLabel>
          <Input
            id={keyInputId}
            name="highwayhash-key"
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

function resolveOutputSizeLabel(
  messages: HighwayHashTextOrFilePageMessages,
  outputSize: HighwayHashOutputSize
) {
  switch (outputSize) {
    case 64:
      return messages.outputSize64Label
    case 128:
      return messages.outputSize128Label
    case 256:
      return messages.outputSize256Label
  }
}

export { ConfigurationCard }
