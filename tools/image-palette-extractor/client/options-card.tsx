import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { Checkbox } from "@workspace/ui/components/ui/checkbox"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/ui/field"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/ui/select"
import { Slider } from "@workspace/ui/components/ui/slider"
import {
  ToolPanelCard,
  ToolPanelCardContent,
} from "@workspace/ui/components/tool/tool-panel-card"

import type { PaletteOptions, PaletteQuality, PaletteSort } from "../core/types"
import type { ImagePaletteExtractorMessages } from "./types"

type OptionsCardProps = Readonly<{
  disabled: boolean
  messages: ImagePaletteExtractorMessages
  onChange: (options: PaletteOptions) => void
  options: PaletteOptions
}>

function OptionsCard({
  disabled,
  messages,
  onChange,
  options,
}: OptionsCardProps) {
  function updateOptions(next: Partial<PaletteOptions>) {
    onChange({ ...options, ...next })
  }

  return (
    <ToolPanelCard>
      <CardHeader className="border-b">
        <CardTitle>{messages.optionsTitle}</CardTitle>
        <CardDescription>{messages.optionsDescription}</CardDescription>
      </CardHeader>
      <ToolPanelCardContent className="gap-5">
        <FieldGroup>
          <Field data-disabled={disabled}>
            <div className="flex items-center justify-between gap-3">
              <FieldLabel>{messages.colorCountLabel}</FieldLabel>
              <span className="rounded-md border bg-muted/30 px-2 py-1 font-mono text-sm">
                {options.colorCount}
              </span>
            </div>
            <Slider
              aria-label={messages.colorCountLabel}
              disabled={disabled}
              max={12}
              min={3}
              onValueChange={(value) => {
                updateOptions({ colorCount: value[0] ?? options.colorCount })
              }}
              step={1}
              value={[options.colorCount]}
            />
            <FieldDescription>
              {messages.colorCountDescription}
            </FieldDescription>
          </Field>

          <Field data-disabled={disabled}>
            <FieldLabel>{messages.qualityLabel}</FieldLabel>
            <Select
              disabled={disabled}
              onValueChange={(value) => {
                updateOptions({ quality: value as PaletteQuality })
              }}
              value={options.quality}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="fast">{messages.qualityFast}</SelectItem>
                  <SelectItem value="balanced">
                    {messages.qualityBalanced}
                  </SelectItem>
                  <SelectItem value="precise">
                    {messages.qualityPrecise}
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <FieldDescription>{messages.qualityDescription}</FieldDescription>
          </Field>

          <Field data-disabled={disabled}>
            <FieldLabel>{messages.sortLabel}</FieldLabel>
            <Select
              disabled={disabled}
              onValueChange={(value) => {
                updateOptions({ sortBy: value as PaletteSort })
              }}
              value={options.sortBy}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="dominance">
                    {messages.sortDominance}
                  </SelectItem>
                  <SelectItem value="hue">{messages.sortHue}</SelectItem>
                  <SelectItem value="lightness">
                    {messages.sortLightness}
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <FieldDescription>{messages.sortDescription}</FieldDescription>
          </Field>

          <Field data-disabled={disabled} orientation="horizontal">
            <Checkbox
              id="image-palette-ignore-transparent"
              checked={options.ignoreTransparent}
              disabled={disabled}
              onCheckedChange={(checked) => {
                updateOptions({ ignoreTransparent: checked === true })
              }}
            />
            <FieldContent>
              <FieldLabel htmlFor="image-palette-ignore-transparent">
                {messages.ignoreTransparentLabel}
              </FieldLabel>
              <FieldDescription>
                {messages.ignoreTransparentDescription}
              </FieldDescription>
            </FieldContent>
          </Field>
        </FieldGroup>
      </ToolPanelCardContent>
    </ToolPanelCard>
  )
}

export { OptionsCard }
