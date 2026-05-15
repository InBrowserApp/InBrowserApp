import { Button } from "@workspace/ui/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { Checkbox } from "@workspace/ui/components/ui/checkbox"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from "@workspace/ui/components/ui/field"
import { Input } from "@workspace/ui/components/ui/input"
import { Slider } from "@workspace/ui/components/ui/slider"
import { LoaderCircle, Sparkles } from "@workspace/ui/icons"

import {
  MAX_AVIF_QUALITY,
  MAX_AVIF_SCALE,
  MAX_AVIF_SPEED,
  MIN_AVIF_QUALITY,
  MIN_AVIF_SCALE,
  MIN_AVIF_SPEED,
} from "../core/avif-conversion"

import type { ImageToAvifOptions } from "../core/avif-conversion"
import type { ImageToAvifMessages } from "./types"

type OptionsCardProps = Readonly<{
  fileCount: number
  isConverting: boolean
  messages: ImageToAvifMessages
  onConvert: () => void
  onOptionsChange: (options: ImageToAvifOptions) => void
  options: ImageToAvifOptions
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

  function updateNumberOption(
    key: "quality" | "scale" | "speed",
    value: number
  ) {
    onOptionsChange({ ...options, [key]: value })
  }

  function updateLossless(value: boolean) {
    onOptionsChange({ ...options, lossless: value })
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
            <FieldLabel htmlFor="image-to-avif-quality">
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
              max={MAX_AVIF_QUALITY}
              min={MIN_AVIF_QUALITY}
              onValueChange={([value]) => {
                updateNumberOption("quality", value ?? options.quality)
              }}
              step={1}
              value={[options.quality]}
            />
            <Input
              autoComplete="off"
              id="image-to-avif-quality"
              inputMode="numeric"
              max={MAX_AVIF_QUALITY}
              min={MIN_AVIF_QUALITY}
              name="avif-quality"
              onChange={(event) => {
                updateNumberOption("quality", Number(event.target.value))
              }}
              type="number"
              value={options.quality}
            />
          </div>
        </Field>

        <Field className="gap-3">
          <div className="flex items-center justify-between gap-3">
            <FieldLabel htmlFor="image-to-avif-scale">
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
              max={MAX_AVIF_SCALE}
              min={MIN_AVIF_SCALE}
              onValueChange={([value]) => {
                updateNumberOption("scale", value ?? options.scale)
              }}
              step={1}
              value={[options.scale]}
            />
            <Input
              autoComplete="off"
              id="image-to-avif-scale"
              inputMode="numeric"
              max={MAX_AVIF_SCALE}
              min={MIN_AVIF_SCALE}
              name="avif-scale"
              onChange={(event) => {
                updateNumberOption("scale", Number(event.target.value))
              }}
              type="number"
              value={options.scale}
            />
          </div>
        </Field>

        <Field className="gap-3">
          <div className="flex items-center justify-between gap-3">
            <FieldLabel htmlFor="image-to-avif-speed">
              {messages.speedLabel}
            </FieldLabel>
            <span className="font-mono text-sm text-muted-foreground">
              {options.speed}
            </span>
          </div>
          <FieldDescription>{messages.speedDescription}</FieldDescription>
          <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_5rem]">
            <Slider
              aria-label={messages.speedLabel}
              max={MAX_AVIF_SPEED}
              min={MIN_AVIF_SPEED}
              onValueChange={([value]) => {
                updateNumberOption("speed", value ?? options.speed)
              }}
              step={1}
              value={[options.speed]}
            />
            <Input
              autoComplete="off"
              id="image-to-avif-speed"
              inputMode="numeric"
              max={MAX_AVIF_SPEED}
              min={MIN_AVIF_SPEED}
              name="avif-speed"
              onChange={(event) => {
                updateNumberOption("speed", Number(event.target.value))
              }}
              type="number"
              value={options.speed}
            />
          </div>
        </Field>

        <Field orientation="horizontal">
          <Checkbox
            checked={options.lossless}
            id="image-to-avif-lossless"
            onCheckedChange={(checked) => {
              updateLossless(checked === true)
            }}
          />
          <FieldContent>
            <FieldLabel htmlFor="image-to-avif-lossless">
              {messages.losslessLabel}
            </FieldLabel>
            <FieldDescription>{messages.losslessDescription}</FieldDescription>
          </FieldContent>
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
