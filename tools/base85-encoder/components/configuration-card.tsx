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
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/ui/select"

import type { Base85Variant, ConfigurationCardMessages } from "../types"

type ConfigurationCardProps = Readonly<{
  alphabet: Base85Variant
  messages: ConfigurationCardMessages
  onAlphabetChange: (value: Base85Variant) => void
}>

function ConfigurationCard({
  alphabet,
  messages,
  onAlphabetChange,
}: ConfigurationCardProps) {
  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>{messages.configurationLabel}</CardTitle>
        <CardDescription>{messages.configurationDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        <Field className="grid max-w-sm gap-2">
          <FieldLabel>{messages.alphabetLabel}</FieldLabel>
          <Select
            value={alphabet}
            onValueChange={(value) => {
              onAlphabetChange(value as Base85Variant)
            }}
          >
            <SelectTrigger
              className="w-full"
              aria-label={messages.alphabetLabel}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>{messages.alphabetLabel}</SelectLabel>
                <SelectItem value="ascii85">{messages.ascii85Label}</SelectItem>
                <SelectItem value="z85">{messages.z85Label}</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>
      </CardContent>
    </Card>
  )
}

export { ConfigurationCard }
