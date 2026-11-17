import { useId, type ReactNode } from "react"
import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@workspace/ui/components/ui/field"
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/ui/select"

export function SubtitleSelect({
  label,
  value,
  onChange,
  hint,
  hiddenLabel = false,
  children,
  direction,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  hint?: string
  hiddenLabel?: boolean
  children: ReactNode
  direction: "ltr" | "rtl"
}) {
  const id = useId()
  return (
    <Field className="min-w-0 gap-2">
      <FieldLabel htmlFor={id} className={hiddenLabel ? "sr-only" : undefined}>
        {label}
      </FieldLabel>
      <Select value={value} onValueChange={onChange} dir={direction}>
        <SelectTrigger
          id={id}
          className="w-full min-w-0 text-base data-[size=default]:h-10 md:text-sm"
          aria-describedby={hint ? `${id}-hint` : undefined}
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent
          position="popper"
          className="w-(--radix-select-trigger-width) max-w-[calc(100vw-2rem)]"
        >
          {children}
        </SelectContent>
      </Select>
      {hint ? (
        <FieldDescription id={`${id}-hint`} className="text-start text-xs">
          {hint}
        </FieldDescription>
      ) : null}
    </Field>
  )
}
