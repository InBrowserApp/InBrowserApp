import { useId } from "react"
import { Slider } from "@workspace/ui/components/ui/slider"

export function Adjustment({
  label,
  hint,
  dir,
  value,
  onChange,
  onCommit,
  percent,
}: {
  label: string
  hint?: string
  dir: "ltr" | "rtl"
  value: number
  onChange: (value: number) => void
  onCommit?: (value: number) => void
  percent: Intl.NumberFormat
}) {
  const id = useId()
  const hintId = useId()
  const valueText = percent.format(value / 100)

  return (
    <div className="grid w-full max-w-md min-w-0 gap-1">
      <div className="flex min-w-0 flex-wrap items-center gap-x-4">
        <span id={id} className="text-sm font-medium">
          {label}
        </span>
        <Slider
          dir={dir}
          aria-labelledby={id}
          aria-describedby={hint ? hintId : undefined}
          aria-valuetext={valueText}
          value={[value]}
          onValueChange={([next]) => onChange(next!)}
          onValueCommit={onCommit && (([next]) => onCommit(next!))}
          className="min-h-9 min-w-24 flex-1 [&_[data-slot=slider-track]]:bg-muted-foreground/80"
        />
        <span
          aria-hidden="true"
          className="text-sm text-muted-foreground tabular-nums"
        >
          {valueText}
        </span>
      </div>
      {hint && (
        <p id={hintId} className="text-xs text-muted-foreground">
          {hint}
        </p>
      )}
    </div>
  )
}
