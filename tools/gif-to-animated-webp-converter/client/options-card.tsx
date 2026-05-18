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
  ToolPanelCardFooter,
} from "@workspace/ui/components/tool/tool-panel-card"
import { LoaderCircle, Sparkles } from "@workspace/ui/icons"

import {
  MAX_LOOP_COUNT,
  MAX_SCALE,
  MAX_SPEED,
  MIN_LOOP_COUNT,
  MIN_SCALE,
  MIN_SPEED,
} from "../core/gif-frame-rendering"

import type {
  GifLoopMode,
  GifToAnimatedWebpOptions,
} from "../core/gif-frame-rendering"
import type { GifToAnimatedWebpMessages } from "./types"

type OptionsCardProps = Readonly<{
  fileCount: number
  isConverting: boolean
  messages: GifToAnimatedWebpMessages
  onConvert: () => void
  onOptionsChange: (options: GifToAnimatedWebpOptions) => void
  options: GifToAnimatedWebpOptions
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

  function updateOption<TKey extends keyof GifToAnimatedWebpOptions>(
    key: TKey,
    value: GifToAnimatedWebpOptions[TKey]
  ) {
    onOptionsChange({ ...options, [key]: value })
  }

  return (
    <ToolPanelCard>
      <CardHeader className="border-b">
        <CardTitle>{messages.optionsTitle}</CardTitle>
        <CardDescription>{messages.optionsDescription}</CardDescription>
      </CardHeader>
      <ToolPanelCardContent className="gap-6">
        <Field className="gap-3">
          <div className="flex items-center justify-between gap-3">
            <FieldLabel htmlFor="gif-to-animated-webp-scale">
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
              max={MAX_SCALE}
              min={MIN_SCALE}
              onValueChange={([value]) => {
                updateOption("scale", value ?? options.scale)
              }}
              step={1}
              value={[options.scale]}
            />
            <Input
              autoComplete="off"
              id="gif-to-animated-webp-scale"
              inputMode="numeric"
              max={MAX_SCALE}
              min={MIN_SCALE}
              name="gif-to-animated-webp-scale"
              onChange={(event) => {
                updateOption("scale", Number(event.target.value))
              }}
              type="number"
              value={options.scale}
            />
          </div>
        </Field>

        <Field className="gap-3">
          <div className="flex items-center justify-between gap-3">
            <FieldLabel htmlFor="gif-to-animated-webp-speed">
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
              max={MAX_SPEED}
              min={MIN_SPEED}
              onValueChange={([value]) => {
                updateOption("speed", value ?? options.speed)
              }}
              step={0.25}
              value={[options.speed]}
            />
            <Input
              autoComplete="off"
              id="gif-to-animated-webp-speed"
              inputMode="decimal"
              max={MAX_SPEED}
              min={MIN_SPEED}
              name="gif-to-animated-webp-speed"
              onChange={(event) => {
                updateOption("speed", Number(event.target.value))
              }}
              step={0.05}
              type="number"
              value={options.speed}
            />
          </div>
        </Field>

        <Field className="gap-3">
          <FieldLabel>{messages.loopLabel}</FieldLabel>
          <FieldDescription>{messages.loopDescription}</FieldDescription>
          <Select
            onValueChange={(value) => {
              updateOption("loopMode", value as GifLoopMode)
            }}
            value={options.loopMode}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="inherit">
                  {messages.loopInheritLabel}
                </SelectItem>
                <SelectItem value="infinite">
                  {messages.loopInfiniteLabel}
                </SelectItem>
                <SelectItem value="custom">
                  {messages.loopCustomLabel}
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>

        {options.loopMode === "custom" ? (
          <Field className="gap-3">
            <FieldLabel htmlFor="gif-to-animated-webp-loop-count">
              {messages.loopCountLabel}
            </FieldLabel>
            <FieldDescription>{messages.loopCountDescription}</FieldDescription>
            <Input
              autoComplete="off"
              id="gif-to-animated-webp-loop-count"
              inputMode="numeric"
              max={MAX_LOOP_COUNT}
              min={MIN_LOOP_COUNT}
              name="gif-to-animated-webp-loop-count"
              onChange={(event) => {
                updateOption("loopCount", Number(event.target.value))
              }}
              type="number"
              value={options.loopCount}
            />
          </Field>
        ) : null}
      </ToolPanelCardContent>
      <ToolPanelCardFooter className="justify-end border-t">
        <Button disabled={!canConvert} onClick={onConvert} type="button">
          {isConverting ? (
            <LoaderCircle className="animate-spin" data-icon="inline-start" />
          ) : (
            <Sparkles data-icon="inline-start" />
          )}
          {isConverting ? messages.convertingLabel : messages.convertLabel}
        </Button>
      </ToolPanelCardFooter>
    </ToolPanelCard>
  )
}

export { OptionsCard }
