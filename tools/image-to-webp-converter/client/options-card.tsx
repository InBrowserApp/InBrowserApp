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
  FieldLabel,
} from "@workspace/ui/components/ui/field"
import { Input } from "@workspace/ui/components/ui/input"
import { Slider } from "@workspace/ui/components/ui/slider"
import { LoaderCircle, Sparkles } from "@workspace/ui/icons"

import {
  MAX_WEBP_QUALITY,
  MAX_WEBP_SCALE,
  MIN_WEBP_QUALITY,
  MIN_WEBP_SCALE,
} from "../core/webp-conversion"

import type { ImageToWebpOptions } from "../core/webp-conversion"
import type { ImageToWebpMessages } from "./types"

type OptionsCardProps = Readonly<{
  fileCount: number
  isConverting: boolean
  messages: ImageToWebpMessages
  onConvert: () => void
  onOptionsChange: (options: ImageToWebpOptions) => void
  options: ImageToWebpOptions
}>

function OptionsCard({
  fileCount,
  isConverting,
  messages,
  onConvert,
  onOptionsChange,
  options,
}: OptionsCardProps) {
  const canConvert = fileCount > 0 && !isConverting

  function updateOption(key: keyof ImageToWebpOptions, value: number) {
    onOptionsChange({ ...options, [key]: value })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{messages.optionsTitle}</CardTitle>
        <CardDescription>{messages.optionsDescription}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <Field className="gap-3">
          <div className="flex items-center justify-between gap-3">
            <FieldLabel htmlFor="image-to-webp-quality">
              {messages.qualityLabel}
            </FieldLabel>
            <span className="font-mono text-sm text-muted-foreground">
              {options.quality}%
            </span>
          </div>
          <FieldDescription>{messages.qualityDescription}</FieldDescription>
          <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_5rem]">
            <Slider
              aria-label={messages.qualityLabel}
              max={MAX_WEBP_QUALITY}
              min={MIN_WEBP_QUALITY}
              onValueChange={([value]) => {
                updateOption("quality", value ?? options.quality)
              }}
              step={1}
              value={[options.quality]}
            />
            <Input
              id="image-to-webp-quality"
              inputMode="numeric"
              max={MAX_WEBP_QUALITY}
              min={MIN_WEBP_QUALITY}
              onChange={(event) => {
                updateOption("quality", Number(event.target.value))
              }}
              type="number"
              value={options.quality}
            />
          </div>
        </Field>

        <Field className="gap-3">
          <div className="flex items-center justify-between gap-3">
            <FieldLabel htmlFor="image-to-webp-scale">
              {messages.scaleLabel}
            </FieldLabel>
            <span className="font-mono text-sm text-muted-foreground">
              {options.scale}%
            </span>
          </div>
          <FieldDescription>{messages.scaleDescription}</FieldDescription>
          <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_5rem]">
            <Slider
              aria-label={messages.scaleLabel}
              max={MAX_WEBP_SCALE}
              min={MIN_WEBP_SCALE}
              onValueChange={([value]) => {
                updateOption("scale", value ?? options.scale)
              }}
              step={1}
              value={[options.scale]}
            />
            <Input
              id="image-to-webp-scale"
              inputMode="numeric"
              max={MAX_WEBP_SCALE}
              min={MIN_WEBP_SCALE}
              onChange={(event) => {
                updateOption("scale", Number(event.target.value))
              }}
              type="number"
              value={options.scale}
            />
          </div>
        </Field>
      </CardContent>
      <CardFooter className="justify-end">
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

export { OptionsCard }
