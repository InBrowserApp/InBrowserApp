import { Field, FieldLabel } from "@workspace/ui/components/ui/field"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@workspace/ui/components/ui/toggle-group"

import type { PageNumberPosition } from "../core/types"
import type { PdfPageNumberAdderMessages } from "./types"

const toggleItemClassName = "h-auto min-h-8 whitespace-normal text-center"

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
        className="grid w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        disabled={disabled}
        onValueChange={(nextValue) => {
          if (nextValue) {
            onChange(nextValue as PageNumberPosition)
          }
        }}
        type="single"
        value={value}
        variant="outline"
      >
        <ToggleGroupItem className={toggleItemClassName} value="top-left">
          {messages.topLeftPosition}
        </ToggleGroupItem>
        <ToggleGroupItem className={toggleItemClassName} value="top-center">
          {messages.topCenterPosition}
        </ToggleGroupItem>
        <ToggleGroupItem className={toggleItemClassName} value="top-right">
          {messages.topRightPosition}
        </ToggleGroupItem>
        <ToggleGroupItem className={toggleItemClassName} value="bottom-left">
          {messages.bottomLeftPosition}
        </ToggleGroupItem>
        <ToggleGroupItem className={toggleItemClassName} value="bottom-center">
          {messages.bottomCenterPosition}
        </ToggleGroupItem>
        <ToggleGroupItem className={toggleItemClassName} value="bottom-right">
          {messages.bottomRightPosition}
        </ToggleGroupItem>
      </ToggleGroup>
    </Field>
  )
}

export { PositionField }
