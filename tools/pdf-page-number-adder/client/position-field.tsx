import { Field, FieldLabel } from "@workspace/ui/components/ui/field"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@workspace/ui/components/ui/toggle-group"
import { cn } from "@workspace/ui/lib/utils"

import type { PageNumberPosition } from "../core/types"
import type { PdfPageNumberAdderMessages } from "./types"

const toggleItemClassName =
  "h-auto min-h-16 flex-col gap-1.5 rounded-lg px-2 py-2 text-center " +
  "whitespace-normal data-[state=on]:border-primary data-[state=on]:bg-muted"

const indicatorClassNames: Record<PageNumberPosition, string> = {
  "bottom-center": "bottom-1.5 left-1/2 -translate-x-1/2",
  "bottom-left": "bottom-1.5 left-1.5",
  "bottom-right": "right-1.5 bottom-1.5",
  "top-center": "top-1.5 left-1/2 -translate-x-1/2",
  "top-left": "top-1.5 left-1.5",
  "top-right": "top-1.5 right-1.5",
}

type PositionFieldProps = Readonly<{
  disabled: boolean
  messages: PdfPageNumberAdderMessages
  onChange: (position: PageNumberPosition) => void
  value: PageNumberPosition
}>

function PositionField({
  disabled,
  messages,
  onChange,
  value,
}: PositionFieldProps) {
  return (
    <Field>
      <FieldLabel>{messages.positionLabel}</FieldLabel>
      <ToggleGroup
        aria-label={messages.positionLabel}
        className="grid w-full grid-cols-3"
        disabled={disabled}
        onValueChange={(nextValue) => {
          if (nextValue) {
            onChange(nextValue as PageNumberPosition)
          }
        }}
        spacing={8}
        type="single"
        value={value}
        variant="outline"
      >
        <PositionOption label={messages.topLeftPosition} value="top-left" />
        <PositionOption label={messages.topCenterPosition} value="top-center" />
        <PositionOption label={messages.topRightPosition} value="top-right" />
        <PositionOption
          label={messages.bottomLeftPosition}
          value="bottom-left"
        />
        <PositionOption
          label={messages.bottomCenterPosition}
          value="bottom-center"
        />
        <PositionOption
          label={messages.bottomRightPosition}
          value="bottom-right"
        />
      </ToggleGroup>
    </Field>
  )
}

function PositionOption({
  label,
  value,
}: Readonly<{
  label: string
  value: PageNumberPosition
}>) {
  return (
    <ToggleGroupItem className={toggleItemClassName} value={value}>
      <span
        aria-hidden="true"
        className="relative size-7 shrink-0 rounded-sm border bg-background"
      >
        <span
          className={cn(
            "absolute size-1.5 rounded-full bg-foreground",
            indicatorClassNames[value]
          )}
        />
      </span>
      <span className="min-w-0 text-xs leading-tight">{label}</span>
    </ToggleGroupItem>
  )
}

export { PositionField }
