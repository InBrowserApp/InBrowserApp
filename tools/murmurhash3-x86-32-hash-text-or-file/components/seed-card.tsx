import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import {
  Field,
  FieldError,
  FieldLabel,
} from "@workspace/ui/components/ui/field"
import { Input } from "@workspace/ui/components/ui/input"

import type { MurmurHash3HashTextOrFilePageMessages } from "../client/types"

type SeedCardProps = Readonly<{
  inputId: string
  messages: MurmurHash3HashTextOrFilePageMessages
  seedInput: string
  onSeedInputChange: (value: string) => void
  invalid: boolean
}>

function SeedCard({
  inputId,
  messages,
  seedInput,
  onSeedInputChange,
  invalid,
}: SeedCardProps) {
  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>{messages.seedSectionLabel}</CardTitle>
      </CardHeader>
      <CardContent>
        <Field data-invalid={invalid || undefined}>
          <FieldLabel htmlFor={inputId}>{messages.seedLabel}</FieldLabel>
          <Input
            id={inputId}
            value={seedInput}
            placeholder={messages.seedPlaceholder}
            aria-invalid={invalid}
            spellCheck={false}
            onChange={(event) => {
              onSeedInputChange(event.target.value)
            }}
          />
          <FieldError>{invalid ? messages.seedInvalid : null}</FieldError>
        </Field>
      </CardContent>
    </Card>
  )
}

export { SeedCard }
