import { useId } from "react"
import { Button } from "@workspace/ui/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/ui/field"
import { Input } from "@workspace/ui/components/ui/input"
import { Textarea } from "@workspace/ui/components/ui/textarea"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@workspace/ui/components/ui/toggle-group"
import { ACCEPT } from "../core/files"
import { POSITIONS, type Messages, type Options } from "../types"
import { RangeField, SelectField } from "./controls"

export function Settings({
  messages: m,
  logoName,
  options: o,
  onChange,
  onLogo,
  onReset,
}: {
  messages: Messages
  logoName?: string
  options: Options
  onChange: (options: Options) => void
  onLogo: (file: File | null) => void
  onReset: () => void
}) {
  const id = useId()
  function update<K extends keyof Options>(key: K, value: Options[K]) {
    onChange({ ...o, [key]: value })
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle className="min-w-0 break-words">{m.optionsTitle}</CardTitle>
        <CardAction>
          <Button variant="ghost" size="sm" onClick={onReset}>
            {m.reset}
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <ToggleGroup
            type="single"
            variant="outline"
            className="w-full"
            aria-label={m.optionsTitle}
            value={o.kind}
            onValueChange={(value) => {
              if (value) update("kind", value as Options["kind"])
            }}
          >
            <ToggleGroupItem className="flex-1" value="text">
              {m.textType}
            </ToggleGroupItem>
            <ToggleGroupItem className="flex-1" value="image">
              {m.imageType}
            </ToggleGroupItem>
          </ToggleGroup>
          {o.kind === "text" ? (
            <>
              <Field>
                <FieldLabel htmlFor={`${id}-text`}>{m.textLabel}</FieldLabel>
                <Textarea
                  id={`${id}-text`}
                  name="watermark-text"
                  autoComplete="off"
                  maxLength={120}
                  rows={2}
                  value={o.text}
                  onChange={(e) => update("text", e.target.value)}
                />
              </Field>
              <div className="grid grid-cols-[minmax(0,1fr)_5rem] gap-3">
                <SelectField
                  label={m.fontLabel}
                  value={o.font}
                  onChange={(value) => update("font", value)}
                  choices={[
                    { value: "sans-serif", label: m.fontSans },
                    { value: "serif", label: m.fontSerif },
                    { value: "monospace", label: m.fontMono },
                  ]}
                />
                <Field>
                  <FieldLabel htmlFor={`${id}-color`}>
                    {m.colorLabel}
                  </FieldLabel>
                  <Input
                    className="w-full"
                    type="color"
                    id={`${id}-color`}
                    name="watermark-color"
                    value={o.color}
                    onChange={(e) => update("color", e.target.value)}
                  />
                </Field>
              </div>
            </>
          ) : (
            <Field>
              <FieldLabel htmlFor={`${id}-logo`}>{m.logoLabel}</FieldLabel>
              <Input
                id={`${id}-logo`}
                type="file"
                name="watermark-logo"
                accept={ACCEPT}
                onChange={(e) => {
                  onLogo(e.target.files?.[0] ?? null)
                  e.target.value = ""
                }}
              />
              <FieldDescription>{m.logoHint}</FieldDescription>
              {logoName ? (
                <p className="truncate text-sm" title={logoName}>
                  {logoName}
                </p>
              ) : null}
            </Field>
          )}
          <Field>
            <FieldLabel>{m.layoutLabel}</FieldLabel>
            <ToggleGroup
              type="single"
              variant="outline"
              className="w-full"
              aria-label={m.layoutLabel}
              value={o.tiled ? "tiled" : "single"}
              onValueChange={(value) => {
                if (value) update("tiled", value === "tiled")
              }}
            >
              <ToggleGroupItem className="flex-1" value="single">
                {m.single}
              </ToggleGroupItem>
              <ToggleGroupItem className="flex-1" value="tiled">
                {m.tiled}
              </ToggleGroupItem>
            </ToggleGroup>
          </Field>
          {!o.tiled ? (
            <SelectField
              label={m.positionLabel}
              value={o.position}
              choices={POSITIONS.map((position) => ({
                value: position,
                label: m[position],
              }))}
              onChange={(value) => update("position", value)}
            />
          ) : null}
          <RangeField
            label={m.sizeLabel}
            value={o.size}
            min={5}
            max={80}
            hint={m.sizeHint}
            onChange={(value) => update("size", value)}
          />
          <RangeField
            label={m.opacityLabel}
            value={o.opacity}
            min={1}
            max={100}
            onChange={(value) => update("opacity", value)}
          />
          <RangeField
            label={m.rotationLabel}
            value={o.rotation}
            min={-180}
            max={180}
            suffix="°"
            onChange={(value) => update("rotation", value)}
          />
          {o.tiled ? (
            <RangeField
              label={m.spacingLabel}
              value={o.spacing}
              min={5}
              max={40}
              onChange={(value) => update("spacing", value)}
            />
          ) : (
            <RangeField
              label={m.marginLabel}
              value={o.margin}
              min={0}
              max={20}
              onChange={(value) => update("margin", value)}
            />
          )}
        </FieldGroup>
      </CardContent>
    </Card>
  )
}
