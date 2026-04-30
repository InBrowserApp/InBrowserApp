import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/ui/field"
import { Input } from "@workspace/ui/components/ui/input"
import { Slider } from "@workspace/ui/components/ui/slider"
import { Switch } from "@workspace/ui/components/ui/switch"
import { cn } from "@workspace/ui/lib/utils"

import { ALPHA_RANGE } from "../client/constants"
import {
  getAlphaPercentage,
  getOpaqueHexColor,
  parseHexColor,
  updateHexAlpha,
  updateHexColorRgb,
} from "../core/shadow"

import type { CssBoxShadowMessages, ShadowLayer } from "../client/types"

type Range = Readonly<{
  min: number
  max: number
}>

type LayerSettingsProps = Readonly<{
  activeLayer: ShadowLayer
  activeLayerIndex: number
  blurRange: Range
  messages: CssBoxShadowMessages
  offsetRange: Range
  onUpdateLayer: (id: string, patch: Partial<ShadowLayer>) => void
  spreadRange: Range
  swatches: readonly string[]
}>

type NumericFieldProps = Readonly<{
  id: string
  label: string
  max: number
  messages: CssBoxShadowMessages
  min: number
  onChange: (value: number) => void
  testId: string
  value: number
}>

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, Math.round(value)))
}

function NumericField({
  id,
  label,
  max,
  messages,
  min,
  onChange,
  testId,
  value,
}: NumericFieldProps) {
  return (
    <Field className="gap-2">
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <div className="grid grid-cols-[minmax(0,1fr)_4.5rem_auto] items-center gap-2.5 sm:grid-cols-[minmax(0,1fr)_5rem_auto]">
        <Slider
          data-testid={`${testId}-slider`}
          max={max}
          min={min}
          onValueChange={(nextValue) => {
            onChange(clamp(nextValue[0] ?? value, min, max))
          }}
          step={1}
          value={[value]}
        />
        <Input
          data-testid={`${testId}-input`}
          autoComplete="off"
          id={id}
          inputMode="numeric"
          max={max}
          min={min}
          name={id}
          onChange={(event) => {
            const nextValue = Number(event.target.value)

            if (!Number.isFinite(nextValue)) {
              return
            }

            onChange(clamp(nextValue, min, max))
          }}
          type="number"
          value={String(value)}
        />
        <span className="text-sm text-muted-foreground">
          {messages.unitPixels}
        </span>
      </div>
    </Field>
  )
}

function LayerSettings({
  activeLayer,
  activeLayerIndex,
  blurRange,
  messages,
  offsetRange,
  onUpdateLayer,
  spreadRange,
  swatches,
}: LayerSettingsProps) {
  const invalidColor =
    activeLayer.color.trim() !== "" && parseHexColor(activeLayer.color) === null

  return (
    <div className="grid min-w-0 gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="font-medium">{messages.layerSettingsTitle}</div>
        <div className="rounded-full border border-border/70 bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
          {messages.layerTitle.replace("{index}", String(activeLayerIndex + 1))}
        </div>
      </div>

      <FieldGroup className="min-w-0 gap-4">
        <div className="grid gap-4 lg:grid-cols-2">
          <NumericField
            id="offset-x-input"
            label={messages.offsetXLabel}
            max={offsetRange.max}
            messages={messages}
            min={offsetRange.min}
            onChange={(offsetX) => {
              onUpdateLayer(activeLayer.id, { offsetX })
            }}
            testId="offset-x"
            value={activeLayer.offsetX}
          />

          <NumericField
            id="offset-y-input"
            label={messages.offsetYLabel}
            max={offsetRange.max}
            messages={messages}
            min={offsetRange.min}
            onChange={(offsetY) => {
              onUpdateLayer(activeLayer.id, { offsetY })
            }}
            testId="offset-y"
            value={activeLayer.offsetY}
          />

          <NumericField
            id="blur-input"
            label={messages.blurLabel}
            max={blurRange.max}
            messages={messages}
            min={blurRange.min}
            onChange={(blur) => {
              onUpdateLayer(activeLayer.id, { blur })
            }}
            testId="blur"
            value={activeLayer.blur}
          />

          <NumericField
            id="spread-input"
            label={messages.spreadLabel}
            max={spreadRange.max}
            messages={messages}
            min={spreadRange.min}
            onChange={(spread) => {
              onUpdateLayer(activeLayer.id, { spread })
            }}
            testId="spread"
            value={activeLayer.spread}
          />
        </div>

        <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_16rem]">
          <Field
            className="min-w-0 gap-3"
            data-invalid={invalidColor || undefined}
          >
            <FieldLabel htmlFor="color-input">{messages.colorLabel}</FieldLabel>
            <div className="grid grid-cols-[minmax(0,1fr)_3rem] items-center gap-2.5 sm:grid-cols-[minmax(0,1fr)_4.5rem]">
              <Input
                autoCapitalize="none"
                autoComplete="off"
                autoCorrect="off"
                data-testid="color-input"
                id="color-input"
                name="shadow-color"
                onChange={(event) => {
                  onUpdateLayer(activeLayer.id, { color: event.target.value })
                }}
                spellCheck={false}
                value={activeLayer.color}
              />
              <input
                aria-label={messages.colorLabel}
                className="h-8 w-full cursor-pointer rounded-lg border border-input bg-transparent p-1 sm:h-10"
                data-testid="color-picker"
                onChange={(event) => {
                  onUpdateLayer(activeLayer.id, {
                    color: updateHexColorRgb(
                      activeLayer.color,
                      event.target.value
                    ),
                  })
                }}
                type="color"
                value={getOpaqueHexColor(activeLayer.color)}
              />
            </div>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {swatches.map((swatch) => {
                const active =
                  activeLayer.color.trim().toUpperCase() ===
                  swatch.toUpperCase()

                return (
                  <button
                    aria-label={`${messages.colorLabel} ${swatch}`}
                    className={cn(
                      "size-6 rounded-md border transition-transform hover:scale-[1.03] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:size-7 sm:rounded-lg",
                      active
                        ? "border-primary ring-2 ring-primary/20"
                        : "border-border"
                    )}
                    key={swatch}
                    onClick={() => {
                      onUpdateLayer(activeLayer.id, { color: swatch })
                    }}
                    style={{ backgroundColor: swatch }}
                    type="button"
                  />
                )
              })}
            </div>
            {invalidColor ? (
              <FieldError>{messages.invalidColorMessage}</FieldError>
            ) : null}
          </Field>

          <div className="grid content-start gap-3">
            <Field className="gap-3">
              <FieldLabel htmlFor="alpha-input">
                {messages.alphaLabel}
              </FieldLabel>
              <div className="grid grid-cols-[minmax(0,1fr)_4.5rem] items-center gap-2.5 sm:grid-cols-[minmax(0,1fr)_5.5rem]">
                <Slider
                  data-testid="alpha-slider"
                  max={ALPHA_RANGE.max}
                  min={ALPHA_RANGE.min}
                  onValueChange={(nextValue) => {
                    onUpdateLayer(activeLayer.id, {
                      color: updateHexAlpha(
                        activeLayer.color,
                        nextValue[0] ?? getAlphaPercentage(activeLayer.color)
                      ),
                    })
                  }}
                  step={1}
                  value={[getAlphaPercentage(activeLayer.color)]}
                />
                <Input
                  data-testid="alpha-input"
                  autoComplete="off"
                  id="alpha-input"
                  inputMode="numeric"
                  max={ALPHA_RANGE.max}
                  min={ALPHA_RANGE.min}
                  name="shadow-alpha"
                  onChange={(event) => {
                    const nextValue = Number(event.target.value)

                    if (!Number.isFinite(nextValue)) {
                      return
                    }

                    onUpdateLayer(activeLayer.id, {
                      color: updateHexAlpha(activeLayer.color, nextValue),
                    })
                  }}
                  type="number"
                  value={String(getAlphaPercentage(activeLayer.color))}
                />
              </div>
            </Field>

            <Field
              className="items-center rounded-lg border border-border/70 bg-muted/20 px-3 py-2.5"
              orientation="horizontal"
            >
              <FieldLabel htmlFor="inset-switch">
                {messages.insetLabel}
              </FieldLabel>
              <Switch
                checked={activeLayer.inset}
                data-testid="inset-switch"
                id="inset-switch"
                onCheckedChange={(inset) => {
                  onUpdateLayer(activeLayer.id, { inset })
                }}
                size="sm"
              />
            </Field>
          </div>
        </div>
      </FieldGroup>
    </div>
  )
}

export { LayerSettings }
