import { Button } from "@workspace/ui/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
  ToggleGroup,
  ToggleGroupItem,
} from "@workspace/ui/components/ui/toggle-group"
import { FileText, LoaderCircle } from "@workspace/ui/icons"

import {
  MAX_MARGIN_MM,
  MIN_MARGIN_MM,
  PAGE_SIZE_PRESETS,
  clampMarginMm,
} from "../core/options"

import type {
  ConverterOptions,
  FitMode,
  PageOrientation,
  PageSizePreset,
  QualityPreset,
} from "../core/options"
import type { ImageToPdfMessages } from "./types"

const toggleItemClassName = "h-auto min-h-8 whitespace-normal text-center"

type SettingsCardProps = Readonly<{
  canGenerate: boolean
  disabled: boolean
  isGenerating: boolean
  messages: ImageToPdfMessages
  onGenerate: () => void
  onOptionsChange: (options: ConverterOptions) => void
  options: ConverterOptions
}>

function SettingsCard({
  canGenerate,
  disabled,
  isGenerating,
  messages,
  onGenerate,
  onOptionsChange,
  options,
}: SettingsCardProps) {
  function updateOption<Key extends keyof ConverterOptions>(
    key: Key,
    value: ConverterOptions[Key]
  ) {
    onOptionsChange({ ...options, [key]: value })
  }

  return (
    <Card className="xl:sticky xl:top-24">
      <CardHeader>
        <CardTitle>{messages.settingsTitle}</CardTitle>
        <CardDescription>{messages.settingsDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="image-to-pdf-page-size">
              {messages.pageSizeLabel}
            </FieldLabel>
            <FieldDescription>{messages.pageSizeDescription}</FieldDescription>
            <Select
              disabled={disabled}
              onValueChange={(value) => {
                updateOption("pageSize", value as PageSizePreset)
              }}
              value={options.pageSize}
            >
              <SelectTrigger className="w-full" id="image-to-pdf-page-size">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {PAGE_SIZE_PRESETS.map((pageSize) => (
                    <SelectItem key={pageSize} value={pageSize}>
                      {pageSize.toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>

          <Field>
            <FieldLabel>{messages.orientationLabel}</FieldLabel>
            <ToggleGroup
              className="grid w-full grid-cols-1 sm:grid-cols-3"
              disabled={disabled}
              onValueChange={(value) => {
                if (value) {
                  updateOption("pageOrientation", value as PageOrientation)
                }
              }}
              type="single"
              value={options.pageOrientation}
              variant="outline"
            >
              <ToggleGroupItem className={toggleItemClassName} value="auto">
                {messages.autoOrientation}
              </ToggleGroupItem>
              <ToggleGroupItem className={toggleItemClassName} value="portrait">
                {messages.portraitOrientation}
              </ToggleGroupItem>
              <ToggleGroupItem
                className={toggleItemClassName}
                value="landscape"
              >
                {messages.landscapeOrientation}
              </ToggleGroupItem>
            </ToggleGroup>
          </Field>

          <Field>
            <FieldLabel>{messages.fitModeLabel}</FieldLabel>
            <FieldDescription>{messages.fitModeDescription}</FieldDescription>
            <ToggleGroup
              className="grid w-full grid-cols-1 sm:grid-cols-2"
              disabled={disabled}
              onValueChange={(value) => {
                if (value) {
                  updateOption("fitMode", value as FitMode)
                }
              }}
              type="single"
              value={options.fitMode}
              variant="outline"
            >
              <ToggleGroupItem className={toggleItemClassName} value="contain">
                {messages.containFit}
              </ToggleGroupItem>
              <ToggleGroupItem className={toggleItemClassName} value="cover">
                {messages.coverFit}
              </ToggleGroupItem>
            </ToggleGroup>
          </Field>

          <Field>
            <FieldLabel>{messages.qualityLabel}</FieldLabel>
            <FieldDescription>{messages.qualityDescription}</FieldDescription>
            <ToggleGroup
              className="grid w-full grid-cols-1 sm:grid-cols-3"
              disabled={disabled}
              onValueChange={(value) => {
                if (value) {
                  updateOption("qualityPreset", value as QualityPreset)
                }
              }}
              type="single"
              value={options.qualityPreset}
              variant="outline"
            >
              <ToggleGroupItem className={toggleItemClassName} value="best">
                {messages.bestQuality}
              </ToggleGroupItem>
              <ToggleGroupItem className={toggleItemClassName} value="balanced">
                {messages.balancedQuality}
              </ToggleGroupItem>
              <ToggleGroupItem className={toggleItemClassName} value="small">
                {messages.smallQuality}
              </ToggleGroupItem>
            </ToggleGroup>
          </Field>

          <Field className="gap-3">
            <div className="flex items-center justify-between gap-3">
              <FieldLabel htmlFor="image-to-pdf-margin">
                {messages.marginLabel}
              </FieldLabel>
              <span className="font-mono text-sm text-muted-foreground">
                {options.marginMm} mm
              </span>
            </div>
            <FieldDescription>{messages.marginDescription}</FieldDescription>
            <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_5rem]">
              <Slider
                aria-label={messages.marginLabel}
                disabled={disabled}
                max={MAX_MARGIN_MM}
                min={MIN_MARGIN_MM}
                onValueChange={([value]) => {
                  updateOption("marginMm", clampMarginMm(value ?? 0))
                }}
                step={1}
                value={[options.marginMm]}
              />
              <Input
                disabled={disabled}
                id="image-to-pdf-margin"
                inputMode="numeric"
                max={MAX_MARGIN_MM}
                min={MIN_MARGIN_MM}
                onChange={(event) => {
                  updateOption(
                    "marginMm",
                    clampMarginMm(Number(event.target.value))
                  )
                }}
                type="number"
                value={options.marginMm}
              />
            </div>
          </Field>
        </FieldGroup>
      </CardContent>
      <CardFooter className="justify-end">
        <Button disabled={!canGenerate} onClick={onGenerate} type="button">
          {isGenerating ? (
            <LoaderCircle className="animate-spin" data-icon="inline-start" />
          ) : (
            <FileText data-icon="inline-start" />
          )}
          {isGenerating ? messages.generatingLabel : messages.generateLabel}
        </Button>
      </CardFooter>
    </Card>
  )
}

export { SettingsCard }
