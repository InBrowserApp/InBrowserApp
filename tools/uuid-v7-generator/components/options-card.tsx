import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from "@workspace/ui/components/ui/field"
import { Input } from "@workspace/ui/components/ui/input"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@workspace/ui/components/ui/toggle-group"

import { UUID_V7_MAX_COUNT, UUID_V7_MIN_COUNT } from "../core/uuid-v7"
import type { UuidV7GenerationMode, UuidV7Messages } from "../types"

type UuidV7OptionsCardProps = Readonly<{
  messages: UuidV7Messages
  countId: string
  className?: string
  mode: UuidV7GenerationMode
  count: number
  onModeChange: (mode: UuidV7GenerationMode) => void
  onCountChange: (value: string) => void
}>

function UuidV7OptionsCard({
  messages,
  countId,
  className,
  mode,
  count,
  onModeChange,
  onCountChange,
}: UuidV7OptionsCardProps) {
  const modeLabelId = `${countId}-mode-label`
  const countDescriptionId = `${countId}-description`

  return (
    <Card className={className}>
      <CardHeader className="border-b">
        <CardTitle>{messages.optionsTitle}</CardTitle>
        <CardDescription>{messages.optionsDescription}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <Field>
          <FieldLabel id={modeLabelId}>{messages.modeLabel}</FieldLabel>
          <FieldContent>
            <ToggleGroup
              type="single"
              value={mode}
              spacing={0}
              variant="outline"
              size="sm"
              aria-labelledby={modeLabelId}
              className="w-full [&>[data-slot=toggle-group-item]]:flex-1"
              onValueChange={(value) => {
                if (value === "single" || value === "batch") {
                  onModeChange(value)
                }
              }}
            >
              <ToggleGroupItem value="single">
                {messages.singleModeLabel}
              </ToggleGroupItem>
              <ToggleGroupItem value="batch">
                {messages.batchModeLabel}
              </ToggleGroupItem>
            </ToggleGroup>
          </FieldContent>
        </Field>

        {mode === "batch" ? (
          <Field>
            <FieldLabel htmlFor={countId}>{messages.countLabel}</FieldLabel>
            <Input
              id={countId}
              type="number"
              inputMode="numeric"
              name="uuid-v7-count"
              autoComplete="off"
              min={UUID_V7_MIN_COUNT}
              max={UUID_V7_MAX_COUNT}
              value={count}
              aria-describedby={countDescriptionId}
              onChange={(event) => {
                onCountChange(event.target.value)
              }}
            />
            <FieldDescription id={countDescriptionId}>
              {messages.countDescription}
            </FieldDescription>
          </Field>
        ) : null}
      </CardContent>
    </Card>
  )
}

export { UuidV7OptionsCard }
