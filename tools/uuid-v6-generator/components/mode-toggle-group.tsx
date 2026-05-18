import {
  ToggleGroup,
  ToggleGroupItem,
} from "@workspace/ui/components/ui/toggle-group"

type ModeToggleOption<Value extends string> = Readonly<{
  value: Value
  label: string
}>

type ModeToggleGroupProps<Value extends string> = Readonly<{
  "aria-label": string
  value: Value
  options: readonly ModeToggleOption<Value>[]
  onValueChange: (value: Value) => void
}>

function ModeToggleGroup<Value extends string>({
  "aria-label": ariaLabel,
  value,
  options,
  onValueChange,
}: ModeToggleGroupProps<Value>) {
  return (
    <ToggleGroup
      type="single"
      value={value}
      spacing={0}
      orientation="vertical"
      variant="outline"
      className="w-full"
      aria-label={ariaLabel}
      onValueChange={(nextValue) => {
        const selectedOption = options.find(
          (option) => option.value === nextValue
        )

        if (selectedOption) {
          onValueChange(selectedOption.value)
        }
      }}
    >
      {options.map((option) => (
        <ToggleGroupItem
          key={option.value}
          value={option.value}
          className="h-auto min-h-9 w-full"
        >
          {option.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}

export { ModeToggleGroup }
export type { ModeToggleOption }
