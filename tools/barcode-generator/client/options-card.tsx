import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import {
  Field,
  FieldContent,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@workspace/ui/components/ui/field"
import { Input } from "@workspace/ui/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/ui/select"
import { Slider } from "@workspace/ui/components/ui/slider"
import { Switch } from "@workspace/ui/components/ui/switch"

import { BARCODE_FORMATS } from "../core/barcode-options"

import type { BarcodeGeneratorOptions } from "../core/barcode-options"
import type {
  BarcodeGeneratorMessages,
  BarcodeOptionChoice,
  BarcodeOptionHandlers,
} from "./types"

type OptionsCardProps = Readonly<{
  handlers: BarcodeOptionHandlers
  messages: BarcodeGeneratorMessages
  options: BarcodeGeneratorOptions
}>

function SliderField({
  label,
  max,
  min,
  onValueChange,
  step,
  value,
}: Readonly<{
  label: string
  max: number
  min: number
  onValueChange: (value: number) => void
  step: number
  value: number
}>) {
  return (
    <Field>
      <div className="flex items-center justify-between gap-3">
        <FieldTitle>{label}</FieldTitle>
        <span className="font-mono text-sm text-muted-foreground">{value}</span>
      </div>
      <Slider
        aria-label={label}
        max={max}
        min={min}
        step={step}
        value={[value]}
        onValueChange={([nextValue]) => {
          if (nextValue === undefined) {
            return
          }

          onValueChange(nextValue)
        }}
      />
    </Field>
  )
}

function ColorField({
  label,
  onChange,
  value,
}: Readonly<{
  label: string
  onChange: (value: string) => void
  value: string
}>) {
  return (
    <Field>
      <FieldLabel>{label}</FieldLabel>
      <div className="flex items-center gap-3">
        <input
          aria-label={label}
          className="h-10 w-14 cursor-pointer rounded-lg border border-input bg-transparent p-1"
          type="color"
          value={value}
          onChange={(event) => {
            onChange(event.target.value)
          }}
        />
        <code className="font-mono text-xs text-muted-foreground uppercase">
          {value}
        </code>
      </div>
    </Field>
  )
}

function SelectField<TValue extends string>({
  label,
  onValueChange,
  options,
  value,
}: Readonly<{
  label: string
  onValueChange: (value: TValue) => void
  options: readonly BarcodeOptionChoice<TValue>[]
  value: TValue
}>) {
  return (
    <Field>
      <FieldLabel>{label}</FieldLabel>
      <Select
        value={value}
        onValueChange={(nextValue) => {
          onValueChange(nextValue as TValue)
        }}
      >
        <SelectTrigger className="w-full">
          <SelectValue>
            {options.find((option) => option.value === value)?.label}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>{label}</SelectLabel>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  )
}

function OptionsCard({ handlers, messages, options }: OptionsCardProps) {
  const alignmentOptions = [
    { label: messages.left, value: "left" },
    { label: messages.center, value: "center" },
    { label: messages.right, value: "right" },
  ] as const

  const positionOptions = [
    { label: messages.top, value: "top" },
    { label: messages.bottom, value: "bottom" },
  ] as const

  const formatOptions = BARCODE_FORMATS.map((format) => ({
    label: format,
    value: format,
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>{messages.options}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col">
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="barcode-text">{messages.text}</FieldLabel>
            <Input
              id="barcode-text"
              placeholder={messages.textPlaceholder}
              value={options.text}
              onChange={(event) => {
                handlers.onTextChange(event.target.value)
              }}
            />
          </Field>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-1">
            <SelectField
              label={messages.format}
              onValueChange={handlers.onFormatChange}
              options={formatOptions}
              value={options.format}
            />

            <Field orientation="horizontal">
              <FieldLabel htmlFor="barcode-display-value">
                {messages.displayValue}
              </FieldLabel>
              <FieldContent className="items-end">
                <Switch
                  checked={options.displayValue}
                  id="barcode-display-value"
                  onCheckedChange={(checked) => {
                    handlers.onBooleanChange("displayValue", checked)
                  }}
                />
              </FieldContent>
            </Field>
          </div>

          <SliderField
            label={messages.barWidth}
            max={8}
            min={1}
            step={1}
            value={options.width}
            onValueChange={(value) => {
              handlers.onNumberChange("width", value)
            }}
          />
          <SliderField
            label={messages.barHeight}
            max={300}
            min={20}
            step={2}
            value={options.height}
            onValueChange={(value) => {
              handlers.onNumberChange("height", value)
            }}
          />
          <SliderField
            label={messages.margin}
            max={30}
            min={0}
            step={1}
            value={options.margin}
            onValueChange={(value) => {
              handlers.onNumberChange("margin", value)
            }}
          />
          <SliderField
            label={messages.fontSize}
            max={48}
            min={8}
            step={1}
            value={options.fontSize}
            onValueChange={(value) => {
              handlers.onNumberChange("fontSize", value)
            }}
          />

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-1">
            <SelectField
              label={messages.textAlign}
              onValueChange={handlers.onTextAlignChange}
              options={alignmentOptions}
              value={options.textAlign}
            />
            <SelectField
              label={messages.textPosition}
              onValueChange={handlers.onTextPositionChange}
              options={positionOptions}
              value={options.textPosition}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-1">
            <ColorField
              label={messages.lineColor}
              value={options.lineColor}
              onChange={(value) => {
                handlers.onColorChange("lineColor", value)
              }}
            />
            <ColorField
              label={messages.background}
              value={options.background}
              onChange={(value) => {
                handlers.onColorChange("background", value)
              }}
            />
          </div>
        </FieldGroup>
      </CardContent>
    </Card>
  )
}

export { OptionsCard }
