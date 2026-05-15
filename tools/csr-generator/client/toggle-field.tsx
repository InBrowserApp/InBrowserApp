import {
  ToggleGroup,
  ToggleGroupItem,
} from "@workspace/ui/components/ui/toggle-group"

type ToggleFieldOption<TValue extends string> = Readonly<{
  value: TValue
  label: string
}>

type ToggleFieldProps<TValue extends string> = Readonly<{
  ariaLabel: string
  value: TValue
  options: readonly ToggleFieldOption<TValue>[]
  onValueChange: (value: TValue) => void
}>

function ToggleField<TValue extends string>({
  ariaLabel,
  value,
  options,
  onValueChange,
}: ToggleFieldProps<TValue>) {
  return (
    <ToggleGroup
      type="single"
      variant="outline"
      value={value}
      aria-label={ariaLabel}
      className="flex-wrap"
      onValueChange={(nextValue) => {
        if (nextValue) {
          onValueChange(nextValue as TValue)
        }
      }}
    >
      {options.map((option) => (
        <ToggleGroupItem key={option.value} value={option.value}>
          {option.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}

export { ToggleField }
