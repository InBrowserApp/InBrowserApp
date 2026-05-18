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
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/ui/field"
import { Input } from "@workspace/ui/components/ui/input"

import {
  UUID_V4_BULK_MAX_COUNT,
  UUID_V4_BULK_MIN_COUNT,
} from "../core/uuid-v4-bulk"
import type { UuidV4BulkMessages } from "../types"

type UuidV4BulkOptionsCardProps = Readonly<{
  messages: UuidV4BulkMessages
  countId: string
  count: number
  onCountChange: (value: string) => void
}>

function UuidV4BulkOptionsCard({
  messages,
  countId,
  count,
  onCountChange,
}: UuidV4BulkOptionsCardProps) {
  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>{messages.optionsTitle}</CardTitle>
        <CardDescription>{messages.optionsDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor={countId}>{messages.countLabel}</FieldLabel>
            <Input
              id={countId}
              name="uuid-count"
              type="number"
              inputMode="numeric"
              autoComplete="off"
              min={UUID_V4_BULK_MIN_COUNT}
              max={UUID_V4_BULK_MAX_COUNT}
              value={count}
              onChange={(event) => {
                onCountChange(event.target.value)
              }}
            />
            <FieldDescription>{messages.countHelp}</FieldDescription>
          </Field>
        </FieldGroup>
      </CardContent>
    </Card>
  )
}

export { UuidV4BulkOptionsCard }
