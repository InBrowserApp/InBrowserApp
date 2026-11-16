import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@workspace/ui/components/ui/field"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/ui/select"

export function SelectField({
  id,
  label,
  value,
  options,
  onChange,
  description,
  disabled = false,
  invalid = false,
  dir,
}: {
  id: string
  label: string
  value: string
  options: readonly (readonly [string, string])[]
  onChange: (value: string) => void
  description?: string
  disabled?: boolean
  invalid?: boolean
  dir: "ltr" | "rtl"
}) {
  return (
    <Field data-disabled={disabled} data-invalid={invalid}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Select
        value={value}
        onValueChange={onChange}
        disabled={disabled}
        dir={dir}
      >
        <SelectTrigger
          id={id}
          aria-invalid={invalid}
          className="w-full min-w-0"
          aria-describedby={description ? `${id}-help` : undefined}
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent position="popper">
          <SelectGroup>
            {options.map(([key, text]) => (
              <SelectItem value={key} key={key}>
                {text}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      {description ? (
        <FieldDescription id={`${id}-help`}>{description}</FieldDescription>
      ) : null}
    </Field>
  )
}
