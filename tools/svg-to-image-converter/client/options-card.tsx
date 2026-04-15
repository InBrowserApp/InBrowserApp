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
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldTitle,
} from "@workspace/ui/components/ui/field"
import { Input } from "@workspace/ui/components/ui/input"
import { Slider } from "@workspace/ui/components/ui/slider"
import { Switch } from "@workspace/ui/components/ui/switch"
import { LoaderCircle, RefreshCcw, Sparkles } from "@workspace/ui/icons"
import { cn } from "@workspace/ui/lib/utils"

import {
  normalizeBackgroundColor,
  shouldShowQuality,
} from "../core/svg-conversion"

import type { OutputFormat } from "../core/svg-conversion"
import type { SvgToImageMessages } from "./types"

type SvgToImageOptionsCardProps = Readonly<{
  backgroundColor: string
  format: OutputFormat
  height: number
  isConverting: boolean
  keepAspect: boolean
  messages: SvgToImageMessages
  onBackgroundColorChange: (value: string) => void
  onConvert: () => void
  onFormatChange: (value: OutputFormat) => void
  onHeightChange: (value: number) => void
  onKeepAspectChange: (value: boolean) => void
  onQualityChange: (value: number) => void
  onReset: () => void
  onUseBackgroundChange: (value: boolean) => void
  onWidthChange: (value: number) => void
  quality: number
  selectedFile: File | null
  useBackground: boolean
  width: number
}>

function FormatPill({
  active,
  label,
  onClick,
}: Readonly<{
  active: boolean
  label: string
  onClick: () => void
}>) {
  return (
    <Button
      onClick={onClick}
      size="sm"
      type="button"
      variant={active ? "secondary" : "outline"}
    >
      {label}
    </Button>
  )
}

export function OptionsCard({
  backgroundColor,
  format,
  height,
  isConverting,
  keepAspect,
  messages,
  onBackgroundColorChange,
  onConvert,
  onFormatChange,
  onHeightChange,
  onKeepAspectChange,
  onQualityChange,
  onReset,
  onUseBackgroundChange,
  onWidthChange,
  quality,
  selectedFile,
  useBackground,
  width,
}: SvgToImageOptionsCardProps) {
  const showQuality = shouldShowQuality(format)
  const canConvert = Boolean(selectedFile) && !isConverting
  const backgroundSwitchChecked = format === "jpeg" ? true : useBackground

  return (
    <Card className="w-full">
      <CardHeader className="border-b">
        <CardTitle>{messages.optionsTitle}</CardTitle>
        <CardDescription>{messages.optionsDescription}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <Field className="gap-4">
          <FieldTitle>{messages.formatLabel}</FieldTitle>
          <div className="grid gap-2 sm:grid-cols-3">
            <FormatPill
              active={format === "png"}
              label={messages.formatPngLabel}
              onClick={() => {
                onFormatChange("png")
              }}
            />
            <FormatPill
              active={format === "jpeg"}
              label={messages.formatJpegLabel}
              onClick={() => {
                onFormatChange("jpeg")
              }}
            />
            <FormatPill
              active={format === "webp"}
              label={messages.formatWebpLabel}
              onClick={() => {
                onFormatChange("webp")
              }}
            />
          </div>
        </Field>

        <div className="grid gap-6 xl:grid-cols-2">
          <div className="grid gap-4">
            <Field>
              <FieldLabel htmlFor="svg-output-width">
                {messages.widthLabel}
              </FieldLabel>
              <Input
                id="svg-output-width"
                min={1}
                onChange={(event) => {
                  onWidthChange(Number(event.target.value) || 1)
                }}
                type="number"
                value={width}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="svg-output-height">
                {messages.heightLabel}
              </FieldLabel>
              <Input
                id="svg-output-height"
                min={1}
                onChange={(event) => {
                  onHeightChange(Number(event.target.value) || 1)
                }}
                type="number"
                value={height}
              />
            </Field>
          </div>

          <div className="grid gap-4">
            <Field className="gap-3">
              <FieldLabel htmlFor="svg-keep-aspect">
                {messages.keepAspectLabel}
              </FieldLabel>
              <FieldDescription>
                {messages.keepAspectDescription}
              </FieldDescription>
              <FieldContent className="items-start">
                <Switch
                  checked={keepAspect}
                  id="svg-keep-aspect"
                  onCheckedChange={onKeepAspectChange}
                />
              </FieldContent>
            </Field>

            <Field className="gap-3">
              <FieldLabel htmlFor="svg-use-background">
                {messages.backgroundFillLabel}
              </FieldLabel>
              <FieldDescription>
                {messages.backgroundFillDescription}
              </FieldDescription>
              <FieldContent className="items-start">
                <Switch
                  checked={backgroundSwitchChecked}
                  disabled={format === "jpeg"}
                  id="svg-use-background"
                  onCheckedChange={onUseBackgroundChange}
                />
              </FieldContent>
            </Field>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <Field className="gap-3">
            <FieldLabel htmlFor="svg-background-color">
              {messages.backgroundColorLabel}
            </FieldLabel>
            <div className="flex items-center gap-3">
              <input
                aria-label={messages.backgroundColorLabel}
                className="h-10 w-14 cursor-pointer rounded-lg border border-input bg-transparent p-1"
                id="svg-background-color"
                onChange={(event) => {
                  onBackgroundColorChange(
                    normalizeBackgroundColor(event.target.value, format)
                  )
                }}
                type="color"
                value={normalizeBackgroundColor(backgroundColor, format)}
              />
              <code className="font-mono text-xs text-muted-foreground uppercase">
                {normalizeBackgroundColor(backgroundColor, format)}
              </code>
            </div>
          </Field>

          {showQuality ? (
            <Field className="gap-4">
              <div className="flex items-center justify-between gap-3">
                <FieldTitle>{messages.qualityLabel}</FieldTitle>
                <span className="font-mono text-sm text-muted-foreground">
                  {quality}%
                </span>
              </div>
              <Slider
                aria-label={messages.qualityLabel}
                max={100}
                min={1}
                onValueChange={([value]) => {
                  if (value === undefined) {
                    return
                  }

                  onQualityChange(value)
                }}
                step={1}
                value={[quality]}
              />
              <FieldDescription>{messages.qualityDescription}</FieldDescription>
            </Field>
          ) : (
            <div
              className={cn(
                "rounded-xl border border-dashed border-border/80 bg-muted/20 p-4 text-sm text-muted-foreground"
              )}
            >
              {messages.qualityDescription}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button onClick={onReset} type="button" variant="outline">
          <RefreshCcw data-icon="inline-start" />
          {messages.resetLabel}
        </Button>
        <Button disabled={!canConvert} onClick={onConvert} type="button">
          {isConverting ? (
            <LoaderCircle className="animate-spin" data-icon="inline-start" />
          ) : (
            <Sparkles data-icon="inline-start" />
          )}
          {isConverting ? messages.convertingLabel : messages.convertLabel}
        </Button>
      </CardFooter>
    </Card>
  )
}
