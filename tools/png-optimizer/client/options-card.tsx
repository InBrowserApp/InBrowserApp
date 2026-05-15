import { Button } from "@workspace/ui/components/ui/button"
import { Checkbox } from "@workspace/ui/components/ui/checkbox"
import {
  ToolPanelCard,
  ToolPanelCardContent,
  ToolPanelCardFooter,
} from "@workspace/ui/components/tool/tool-panel-card"
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
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
  MAX_PNG_OPTIMIZATION_LEVEL,
  MIN_PNG_OPTIMIZATION_LEVEL,
} from "../core/png-optimizer"

import type { PngOptimizerOptions } from "../core/png-optimizer"
import type { PngOptimizerMessages } from "./types"

type OptionsCardProps = Readonly<{
  isOptimizing: boolean
  messages: PngOptimizerMessages
  onOptimize: () => void
  onOptionsChange: (options: PngOptimizerOptions) => void
  options: PngOptimizerOptions
  selectedFile: File | null
}>

function OptionsCard({
  isOptimizing,
  messages,
  onOptimize,
  onOptionsChange,
  options,
  selectedFile,
}: OptionsCardProps) {
  const canOptimize = Boolean(selectedFile) && !isOptimizing

  function updateOption<T extends keyof PngOptimizerOptions>(
    key: T,
    value: PngOptimizerOptions[T]
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
            <FieldLabel htmlFor="png-optimizer-level">
              {messages.levelLabel}
            </FieldLabel>
            <span className="font-mono text-sm text-muted-foreground">
              {options.level}
            </span>
          </div>
          <FieldDescription>{messages.levelDescription}</FieldDescription>
          <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_5rem]">
            <Slider
              aria-label={messages.levelLabel}
              max={MAX_PNG_OPTIMIZATION_LEVEL}
              min={MIN_PNG_OPTIMIZATION_LEVEL}
              onValueChange={([value]) => {
                updateOption("level", value ?? options.level)
              }}
              step={1}
              value={[options.level]}
            />
            <Input
              autoComplete="off"
              id="png-optimizer-level"
              inputMode="numeric"
              max={MAX_PNG_OPTIMIZATION_LEVEL}
              min={MIN_PNG_OPTIMIZATION_LEVEL}
              name="png-optimizer-level"
              onChange={(event) => {
                updateOption("level", Number(event.target.value))
              }}
              type="number"
              value={options.level}
            />
          </div>
          <div className="flex justify-between gap-3 text-xs text-muted-foreground">
            <span>{messages.fasterLabel}</span>
            <span>{messages.smallerLabel}</span>
          </div>
        </Field>

        <Field orientation="horizontal">
          <Checkbox
            checked={options.interlace}
            id="png-optimizer-interlace"
            onCheckedChange={(value) => {
              updateOption("interlace", value === true)
            }}
          />
          <FieldContent>
            <FieldLabel htmlFor="png-optimizer-interlace">
              {messages.interlaceLabel}
            </FieldLabel>
            <FieldDescription>{messages.interlaceDescription}</FieldDescription>
          </FieldContent>
        </Field>

        <Field orientation="horizontal">
          <Checkbox
            checked={options.optimiseAlpha}
            id="png-optimizer-alpha"
            onCheckedChange={(value) => {
              updateOption("optimiseAlpha", value === true)
            }}
          />
          <FieldContent>
            <FieldLabel htmlFor="png-optimizer-alpha">
              {messages.optimizeAlphaLabel}
            </FieldLabel>
            <FieldDescription>
              {messages.optimizeAlphaDescription}
            </FieldDescription>
          </FieldContent>
        </Field>
      </ToolPanelCardContent>
      <ToolPanelCardFooter className="justify-end">
        <Button disabled={!canOptimize} onClick={onOptimize} type="button">
          {isOptimizing ? (
            <LoaderCircle
              aria-hidden="true"
              className="animate-spin motion-reduce:animate-none"
              data-icon="inline-start"
            />
          ) : (
            <Sparkles aria-hidden="true" data-icon="inline-start" />
          )}
          {isOptimizing
            ? messages.optimizingButtonLabel
            : messages.optimizeButtonLabel}
        </Button>
      </ToolPanelCardFooter>
    </ToolPanelCard>
  )
}

export { OptionsCard }
