import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { Field, FieldLabel } from "@workspace/ui/components/ui/field"
import { Input } from "@workspace/ui/components/ui/input"

import { CUID2_MAX_COUNT, CUID2_MAX_LENGTH } from "../core/cuid2"
import type { Cuid2Messages } from "../types"

type Cuid2OptionsCardProps = Readonly<{
  messages: Cuid2Messages
  countId: string
  lengthId: string
  count: number
  length: number
  onCountChange: (value: string) => void
  onLengthChange: (value: string) => void
}>

function Cuid2OptionsCard({
  messages,
  countId,
  lengthId,
  count,
  length,
  onCountChange,
  onLengthChange,
}: Cuid2OptionsCardProps) {
  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>{messages.optionsTitle}</CardTitle>
        <CardDescription>{messages.optionsDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor={countId}>{messages.countLabel}</FieldLabel>
            <Input
              id={countId}
              type="number"
              inputMode="numeric"
              min={1}
              max={CUID2_MAX_COUNT}
              value={count}
              onChange={(event) => {
                onCountChange(event.target.value)
              }}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor={lengthId}>{messages.lengthLabel}</FieldLabel>
            <Input
              id={lengthId}
              type="number"
              inputMode="numeric"
              min={2}
              max={CUID2_MAX_LENGTH}
              value={length}
              onChange={(event) => {
                onLengthChange(event.target.value)
              }}
            />
          </Field>
        </div>
      </CardContent>
    </Card>
  )
}

export { Cuid2OptionsCard }
