import { useId } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/ui/field"
import { Input } from "@workspace/ui/components/ui/input"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@workspace/ui/components/ui/toggle-group"
import { ContentFields } from "./content-fields"
import { NumberField } from "./number-field"
import type { Messages, Options } from "../types"

function Settings({
  options: o,
  onChange,
  messages: m,
  image,
  onImage,
  markError,
  range,
  onRange,
  rangeError,
  disabled,
}: Readonly<{
  options: Options
  onChange: (options: Options) => void
  messages: Messages
  image: File | null
  onImage: (file: File | null) => void
  markError: string
  range: string
  onRange: (range: string) => void
  rangeError: string
  disabled: boolean
}>) {
  const id = useId()
  function update(key: keyof Options, value: number) {
    onChange({ ...o, [key]: value })
  }
  const positions = [
    m.topLeft,
    m.topCenter,
    m.topRight,
    m.centerLeft,
    m.center,
    m.centerRight,
    m.bottomLeft,
    m.bottomCenter,
    m.bottomRight,
  ]
  return (
    <Card className="min-w-0">
      <CardHeader>
        <CardTitle>{m.settingsTitle}</CardTitle>
      </CardHeader>
      <CardContent>
        <fieldset disabled={disabled} className="min-w-0 disabled:opacity-60">
          <FieldGroup className="gap-5">
            <ContentFields
              options={o}
              onChange={onChange}
              messages={m}
              image={image}
              onImage={onImage}
              error={markError}
            />
            <Field>
              <FieldLabel>{m.layoutLabel}</FieldLabel>
              <ToggleGroup
                className="grid w-full grid-cols-2"
                type="single"
                variant="outline"
                value={o.layout}
                aria-label={m.layoutLabel}
                onValueChange={(layout) => {
                  if (layout)
                    onChange({ ...o, layout: layout as Options["layout"] })
                }}
              >
                <ToggleGroupItem value="single">
                  {m.singleLayout}
                </ToggleGroupItem>
                <ToggleGroupItem value="tile">{m.tileLayout}</ToggleGroupItem>
              </ToggleGroup>
            </Field>
            {o.layout === "single" ? (
              <Field>
                <FieldLabel>{m.positionLabel}</FieldLabel>
                <ToggleGroup
                  className="grid w-full grid-cols-3 gap-1"
                  spacing={4}
                  dir="ltr"
                  type="single"
                  variant="outline"
                  value={String(o.position)}
                  aria-label={m.positionLabel}
                  onValueChange={(value) => {
                    if (value) update("position", Number(value))
                  }}
                >
                  {positions.map((label, i) => (
                    <ToggleGroupItem
                      className="h-auto min-h-9 rounded-md px-1 py-1.5 text-xs whitespace-normal"
                      key={i}
                      value={String(i)}
                    >
                      {label}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </Field>
            ) : (
              <NumberField
                label={m.spacingLabel}
                value={o.spacing}
                min={0}
                max={200}
                unit="pt"
                onChange={(value) => update("spacing", value)}
              />
            )}
            <NumberField
              label={m.sizeLabel}
              description={m.sizeDescription}
              value={o.size}
              min={10}
              max={100}
              unit="%"
              onChange={(value) => update("size", value)}
            />
            <NumberField
              label={m.rotationLabel}
              value={o.rotation}
              min={-180}
              max={180}
              unit="°"
              onChange={(value) => update("rotation", value)}
            />
            <NumberField
              label={m.opacityLabel}
              value={o.opacity}
              min={0}
              max={100}
              unit="%"
              onChange={(value) => update("opacity", value)}
            />
            <Field data-invalid={Boolean(rangeError) || undefined}>
              <FieldLabel htmlFor={`${id}-range`}>
                {m.pageRangeLabel}
              </FieldLabel>
              <Input
                id={`${id}-range`}
                name="watermark-pages"
                dir="ltr"
                autoComplete="off"
                placeholder={m.pageRangePlaceholder}
                value={range}
                onChange={(event) => onRange(event.target.value)}
                aria-invalid={Boolean(rangeError)}
                aria-describedby={`${id}-range-help${rangeError ? ` ${id}-range-error` : ""}`}
              />
              <FieldDescription id={`${id}-range-help`}>
                {m.pageRangeDescription}
              </FieldDescription>
              {rangeError ? (
                <FieldError id={`${id}-range-error`}>{rangeError}</FieldError>
              ) : null}
            </Field>
          </FieldGroup>
        </fieldset>
      </CardContent>
    </Card>
  )
}

export { Settings }
