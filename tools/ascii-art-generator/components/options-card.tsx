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
  FieldDescription,
  FieldGroup,
  FieldLabel,
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
  ASCII_ART_FONT_DEFINITIONS,
  clampWidth,
  normalizeAlign,
  type AsciiArtOptions,
} from "../core/ascii-art"

import type { AsciiArtGeneratorLocalizedCatalog } from "../types"

type OptionsCardProps = Readonly<{
  messages: AsciiArtGeneratorLocalizedCatalog
  options: AsciiArtOptions
  onOptionsChange: (options: AsciiArtOptions) => void
}>

function OptionsCard({ messages, options, onOptionsChange }: OptionsCardProps) {
  const idPrefix = useId()

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>{messages.optionsTitle}</CardTitle>
        <CardDescription>{messages.optionsDescription}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor={`${idPrefix}-font`}>
              {messages.fontLabel}
            </FieldLabel>
            <Select
              value={options.font}
              onValueChange={(value) => {
                onOptionsChange({
                  ...options,
                  font: value as AsciiArtOptions["font"],
                })
              }}
            >
              <SelectTrigger
                id={`${idPrefix}-font`}
                aria-label={messages.fontLabel}
                className="w-full"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {ASCII_ART_FONT_DEFINITIONS.map((font) => (
                    <SelectItem key={font.value} value={font.value}>
                      {font.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>

          <Field>
            <FieldLabel htmlFor={`${idPrefix}-align`}>
              {messages.alignLabel}
            </FieldLabel>
            <Select
              value={options.align}
              onValueChange={(value) => {
                onOptionsChange({
                  ...options,
                  align: normalizeAlign(value),
                })
              }}
            >
              <SelectTrigger
                id={`${idPrefix}-align`}
                aria-label={messages.alignLabel}
                className="w-full"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="left">{messages.leftAlign}</SelectItem>
                  <SelectItem value="center">{messages.centerAlign}</SelectItem>
                  <SelectItem value="right">{messages.rightAlign}</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>

          <Field>
            <FieldLabel htmlFor={`${idPrefix}-width`}>
              {messages.widthLabel}
            </FieldLabel>
            <InputGroup>
              <InputGroupInput
                id={`${idPrefix}-width`}
                type="number"
                inputMode="numeric"
                min={40}
                max={160}
                value={String(options.width)}
                onChange={(event) => {
                  onOptionsChange({
                    ...options,
                    width: clampWidth(event.target.value),
                  })
                }}
              />
            </InputGroup>
            <FieldDescription>{messages.widthHint}</FieldDescription>
          </Field>
        </FieldGroup>
      </CardContent>
    </Card>
  )
}

export { OptionsCard }
