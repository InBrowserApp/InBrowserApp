import {
  ToolPanelCard,
  ToolPanelCardContent,
  ToolPanelCardFooter,
} from "@workspace/ui/components/tool/tool-panel-card"
import { Badge } from "@workspace/ui/components/ui/badge"
import { Button } from "@workspace/ui/components/ui/button"
import {
  CardDescription,
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
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@workspace/ui/components/ui/toggle-group"
import { LoaderCircle, Sparkles } from "@workspace/ui/icons"

import {
  MAX_APNG_LOOP_COUNT,
  MAX_APNG_SCALE,
  MAX_APNG_SPEED,
  MIN_APNG_LOOP_COUNT,
  MIN_APNG_SCALE,
  MIN_APNG_SPEED,
  normalizeGifToApngOptions,
} from "../core/apng-conversion"
import { formatInteger } from "./utils"

import type { GifLoopMode } from "../core/apng-conversion"
import type { GifToApngMessages, GifToApngOptions } from "./types"

type OptionsCardProps = Readonly<{
  fileCount: number
  isConverting: boolean
  locale: string
  messages: GifToApngMessages
  onConvert: () => void
  onOptionsChange: (options: GifToApngOptions) => void
  options: GifToApngOptions
}>

function OptionsCard({
  fileCount,
  isConverting,
  locale,
  messages,
  onConvert,
  onOptionsChange,
  options,
}: OptionsCardProps) {
  const canConvert = fileCount > 0 && !isConverting

  function updateOptions(nextOptions: Partial<GifToApngOptions>) {
    onOptionsChange(normalizeGifToApngOptions({ ...options, ...nextOptions }))
  }

  return (
    <ToolPanelCard>
      <CardHeader className="border-b p-4">
        <CardTitle>{messages.optionsTitle}</CardTitle>
        <CardDescription>{messages.optionsDescription}</CardDescription>
      </CardHeader>
      <ToolPanelCardContent className="gap-6 p-4">
        <Field className="gap-3">
          <div className="flex items-center justify-between gap-3">
            <FieldLabel htmlFor="gif-to-apng-scale">
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
              max={MAX_APNG_SCALE}
              min={MIN_APNG_SCALE}
              onValueChange={([value]) => {
                updateOptions({ scale: value ?? options.scale })
              }}
              step={1}
              value={[options.scale]}
            />
            <Input
              autoComplete="off"
              id="gif-to-apng-scale"
              inputMode="numeric"
              max={MAX_APNG_SCALE}
              min={MIN_APNG_SCALE}
              onChange={(event) => {
                updateOptions({ scale: Number(event.target.value) })
              }}
              name="gif-to-apng-scale"
              type="number"
              value={options.scale}
            />
          </div>
        </Field>

        <Field className="gap-3">
          <div className="flex items-center justify-between gap-3">
            <FieldLabel htmlFor="gif-to-apng-speed">
              {messages.speedLabel}
            </FieldLabel>
            <span className="font-mono text-sm text-muted-foreground">
              {options.speed}x
            </span>
          </div>
          <FieldDescription>{messages.speedDescription}</FieldDescription>
          <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_5rem]">
            <Slider
              aria-label={messages.speedLabel}
              max={MAX_APNG_SPEED}
              min={MIN_APNG_SPEED}
              onValueChange={([value]) => {
                updateOptions({ speed: value ?? options.speed })
              }}
              step={0.25}
              value={[options.speed]}
            />
            <Input
              autoComplete="off"
              id="gif-to-apng-speed"
              inputMode="decimal"
              max={MAX_APNG_SPEED}
              min={MIN_APNG_SPEED}
              onChange={(event) => {
                updateOptions({ speed: Number(event.target.value) })
              }}
              name="gif-to-apng-speed"
              step={0.25}
              type="number"
              value={options.speed}
            />
          </div>
        </Field>

        <Field className="gap-3">
          <FieldLabel>{messages.loopModeLabel}</FieldLabel>
          <FieldDescription>{messages.loopDescription}</FieldDescription>
          <ToggleGroup
            aria-label={messages.loopModeLabel}
            className="grid w-full grid-cols-3"
            onValueChange={(value) => {
              if (value) {
                updateOptions({ loopMode: value as GifLoopMode })
              }
            }}
            type="single"
            value={options.loopMode}
            variant="outline"
          >
            <ToggleGroupItem
              className="h-auto min-w-0 py-2 text-center leading-tight whitespace-normal"
              value="inherit"
            >
              {messages.loopInheritLabel}
            </ToggleGroupItem>
            <ToggleGroupItem
              className="h-auto min-w-0 py-2 text-center leading-tight whitespace-normal"
              value="infinite"
            >
              {messages.loopInfiniteLabel}
            </ToggleGroupItem>
            <ToggleGroupItem
              className="h-auto min-w-0 py-2 text-center leading-tight whitespace-normal"
              value="custom"
            >
              {messages.loopCustomLabel}
            </ToggleGroupItem>
          </ToggleGroup>
        </Field>

        {options.loopMode === "custom" ? (
          <Field className="gap-3">
            <FieldLabel htmlFor="gif-to-apng-loop-count">
              {messages.loopCountLabel}
            </FieldLabel>
            <Input
              autoComplete="off"
              id="gif-to-apng-loop-count"
              inputMode="numeric"
              max={MAX_APNG_LOOP_COUNT}
              min={MIN_APNG_LOOP_COUNT}
              onChange={(event) => {
                updateOptions({ loopCount: Number(event.target.value) })
              }}
              name="gif-to-apng-loop-count"
              type="number"
              value={options.loopCount}
            />
          </Field>
        ) : null}
      </ToolPanelCardContent>
      <ToolPanelCardFooter className="flex-col items-stretch gap-3 border-t p-4">
        <Badge
          className="h-auto min-h-5 w-full justify-center text-center whitespace-normal"
          variant={fileCount ? "secondary" : "outline"}
        >
          {messages.selectedFilesLabel}: {formatInteger(fileCount, locale)}
        </Badge>
        <Button disabled={!canConvert} onClick={onConvert} type="button">
          {isConverting ? (
            <LoaderCircle
              aria-hidden="true"
              className="motion-safe:animate-spin"
              data-icon="inline-start"
            />
          ) : (
            <Sparkles aria-hidden="true" data-icon="inline-start" />
          )}
          {isConverting ? messages.convertingLabel : messages.convertLabel}
        </Button>
      </ToolPanelCardFooter>
    </ToolPanelCard>
  )
}

export { OptionsCard }
