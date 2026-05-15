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
  FieldLabel,
} from "@workspace/ui/components/ui/field"
import { Input } from "@workspace/ui/components/ui/input"

import { UUID_V7_MAX_COUNT, UUID_V7_MIN_COUNT } from "../core/uuid-v7"
import type { UuidV7Messages } from "../types"

type UuidV7OptionsCardProps = Readonly<{
  messages: UuidV7Messages
  countId: string
  count: number
  onCountChange: (value: string) => void
}>

function UuidV7OptionsCard({
  messages,
  countId,
  count,
  onCountChange,
}: UuidV7OptionsCardProps) {
  const countDescriptionId = `${countId}-description`

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>{messages.optionsTitle}</CardTitle>
        <CardDescription>{messages.optionsDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        <Field>
          <FieldLabel htmlFor={countId}>{messages.countLabel}</FieldLabel>
          <Input
            id={countId}
            type="number"
            inputMode="numeric"
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
      </CardContent>
    </Card>
  )
}

export { UuidV7OptionsCard }
