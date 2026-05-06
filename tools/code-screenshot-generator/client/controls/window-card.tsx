import { useId } from "react"

import { Checkbox } from "@workspace/ui/components/ui/checkbox"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import {
  Field,
  FieldContent,
  FieldGroup,
  FieldLabel,
  FieldSet,
  FieldTitle,
} from "@workspace/ui/components/ui/field"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@workspace/ui/components/ui/toggle-group"

import { windowStyleOptions } from "../constants"
import { resolveLabel, type ControlCardProps } from "./types"

function WindowCard({ messages, onChange, settings }: ControlCardProps) {
  const lineNumbersId = useId()

  return (
    <Card className="min-w-0">
      <CardHeader className="border-b">
        <CardTitle>{messages.windowTitle}</CardTitle>
        <CardDescription>{messages.windowDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <FieldSet>
            <FieldTitle>{messages.windowStyleLabel}</FieldTitle>
            <ToggleGroup
              type="single"
              variant="outline"
              className="w-full"
              value={settings.windowStyle}
              aria-label={messages.windowStyleLabel}
              onValueChange={(value) => {
                if (value) {
                  onChange({
                    windowStyle: value as typeof settings.windowStyle,
                  })
                }
              }}
            >
              {windowStyleOptions.map((option) => (
                <ToggleGroupItem
                  key={option.value}
                  value={option.value}
                  className="flex-1"
                >
                  {resolveLabel(messages, option)}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </FieldSet>

          <Field orientation="horizontal">
            <Checkbox
              id={lineNumbersId}
              checked={settings.showLineNumbers}
              onCheckedChange={(checked) => {
                onChange({ showLineNumbers: checked === true })
              }}
            />
            <FieldContent>
              <FieldLabel htmlFor={lineNumbersId}>
                {messages.lineNumbersLabel}
              </FieldLabel>
            </FieldContent>
          </Field>
        </FieldGroup>
      </CardContent>
    </Card>
  )
}

export { WindowCard }
