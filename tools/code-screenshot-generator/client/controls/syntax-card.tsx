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

import { renderModeOptions, themeOptions } from "../constants"
import { languageOptions } from "../languages"
import { resolveLabel, type ControlCardProps } from "./types"

function SyntaxCard({ messages, onChange, settings }: ControlCardProps) {
  const languageId = useId()
  const themeId = useId()

  return (
    <Card className="min-w-0">
      <CardHeader className="border-b">
        <CardTitle>{messages.syntaxTitle}</CardTitle>
        <CardDescription>{messages.syntaxDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor={languageId}>
              {messages.languageLabel}
            </FieldLabel>
            <Select
              value={settings.language}
              onValueChange={(value) => {
                onChange({ language: value })
              }}
            >
              <SelectTrigger id={languageId} className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {languageOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>

          <FieldSet>
            <FieldTitle>{messages.renderModeLabel}</FieldTitle>
            <ToggleGroup
              type="single"
              variant="outline"
              className="w-full"
              value={settings.renderMode}
              aria-label={messages.renderModeLabel}
              onValueChange={(value) => {
                if (value) {
                  onChange({ renderMode: value as typeof settings.renderMode })
                }
              }}
            >
              {renderModeOptions.map((option) => (
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

          <Field>
            <FieldLabel htmlFor={themeId}>{messages.themeLabel}</FieldLabel>
            <Select
              value={settings.themeId}
              onValueChange={(value) => {
                onChange({ themeId: value })
              }}
            >
              <SelectTrigger id={themeId} className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {themeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {resolveLabel(messages, option)}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
        </FieldGroup>
      </CardContent>
    </Card>
  )
}

export { SyntaxCard }
