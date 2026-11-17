import { useId } from "react"
import { REGISTRIES, type MacQuery } from "@workspace/mac-address"
import { Field, FieldTitle } from "@workspace/ui/components/ui/field"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@workspace/ui/components/ui/toggle-group"
import type English from "./messages/en.json"

function RegistryFilter({
  value,
  onChange,
  messages,
}: Readonly<{
  value: MacQuery["registry"]
  onChange: (registry: MacQuery["registry"]) => void
  messages: typeof English
}>) {
  const labelId = useId()
  return (
    <Field>
      <FieldTitle id={labelId}>{messages.registry}</FieldTitle>
      <ToggleGroup
        type="single"
        variant="outline"
        spacing={8}
        value={value}
        aria-labelledby={labelId}
        className="flex-wrap"
        onValueChange={(next) => {
          if (next) onChange(next as MacQuery["registry"])
        }}
      >
        <ToggleGroupItem value="all">{messages.allRegistries}</ToggleGroupItem>
        {REGISTRIES.map((registry) => (
          <ToggleGroupItem
            key={registry}
            value={registry}
            translate="no"
            dir="ltr"
          >
            {registry}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </Field>
  )
}

export default RegistryFilter
