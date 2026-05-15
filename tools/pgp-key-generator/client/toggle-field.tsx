import {
  ToggleGroup,
  ToggleGroupItem,
} from "@workspace/ui/components/ui/toggle-group"

function ToggleField<TValue extends string>({
  ariaLabel,
  options,
  value,
  onValueChange,
}: Readonly<{
  ariaLabel: string
  options: readonly Readonly<{ label: string; value: TValue }>[]
  value: TValue
  onValueChange: (value: TValue) => void
}>) {
  return (
    <ToggleGroup
      type="single"
      variant="outline"
      value={value}
      aria-label={ariaLabel}
      className="flex-wrap"
      onValueChange={(nextValue) => {
        if (nextValue) onValueChange(nextValue as TValue)
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
