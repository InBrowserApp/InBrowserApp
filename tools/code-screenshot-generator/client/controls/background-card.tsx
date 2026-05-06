import { useId } from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSet,
  FieldTitle,
} from "@workspace/ui/components/ui/field"
import {
  InputGroup,
  InputGroupInput,
} from "@workspace/ui/components/ui/input-group"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@workspace/ui/components/ui/toggle-group"

import { backgroundModeOptions, backgroundPresetOptions } from "../constants"
import { resolveLabel, type ControlCardProps } from "./types"

function BackgroundCard({ messages, onChange, settings }: ControlCardProps) {
  const presetId = useId()
  const colorId = useId()

  return (
    <Card className="min-w-0">
      <CardHeader className="border-b">
        <CardTitle>{messages.backgroundTitle}</CardTitle>
        <CardDescription>{messages.backgroundDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <FieldSet>
            <FieldTitle>{messages.backgroundModeLabel}</FieldTitle>
            <ToggleGroup
              type="single"
              variant="outline"
              className="grid w-full grid-cols-2"
              value={settings.backgroundMode}
              aria-label={messages.backgroundModeLabel}
              onValueChange={(value) => {
                if (value) {
                  onChange({
                    backgroundMode: value as typeof settings.backgroundMode,
                  })
                }
              }}
            >
              {backgroundModeOptions.map((option) => (
                <ToggleGroupItem key={option.value} value={option.value}>
                  {resolveLabel(messages, option)}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </FieldSet>

          {settings.backgroundMode === "preset" ? (
            <Field>
              <FieldLabel htmlFor={presetId}>
                {messages.backgroundPresetLabel}
              </FieldLabel>
              <Select
                value={settings.backgroundPresetId}
                onValueChange={(value) => {
                  onChange({ backgroundPresetId: value })
                }}
              >
                <SelectTrigger id={presetId} className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {backgroundPresetOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {resolveLabel(messages, option)}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
          ) : null}

          {settings.backgroundMode === "solid" ? (
            <Field>
              <FieldLabel htmlFor={colorId}>
                {messages.backgroundColorLabel}
              </FieldLabel>
              <InputGroup>
                <InputGroupInput
                  id={colorId}
                  type="color"
                  value={settings.backgroundColor}
                  onChange={(event) => {
                    onChange({ backgroundColor: event.target.value })
                  }}
                />
              </InputGroup>
            </Field>
          ) : null}
        </FieldGroup>
      </CardContent>
    </Card>
  )
}

export { BackgroundCard }
