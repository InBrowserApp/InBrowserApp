import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { Field, FieldLabel } from "@workspace/ui/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/ui/select"

import type { Base58AlphabetKey } from "../core/base58"
import type { Base58AlphabetOption, Base58DecoderPageMessages } from "../types"

type OptionsCardProps = Readonly<{
  alphabetKey: Base58AlphabetKey
  alphabetOptions: readonly Base58AlphabetOption[]
  messages: Base58DecoderPageMessages
  selectId: string
  onAlphabetChange: (value: Base58AlphabetKey) => void
}>

function OptionsCard({
  alphabetKey,
  alphabetOptions,
  messages,
  selectId,
  onAlphabetChange,
}: OptionsCardProps) {
  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>{messages.optionsTitle}</CardTitle>
        <CardDescription>{messages.alphabetLabel}</CardDescription>
      </CardHeader>
      <CardContent>
        <Field>
          <FieldLabel htmlFor={selectId}>{messages.alphabetLabel}</FieldLabel>
          <Select
            value={alphabetKey}
            onValueChange={(value) => {
              onAlphabetChange(value as Base58AlphabetKey)
            }}
          >
            <SelectTrigger
              id={selectId}
              className="w-full"
              aria-label={messages.alphabetLabel}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {alphabetOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </CardContent>
    </Card>
  )
}

export { OptionsCard }
