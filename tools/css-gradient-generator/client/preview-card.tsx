import { Button } from "@workspace/ui/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { RefreshCcw, Sparkles } from "@workspace/ui/icons"
import { cn } from "@workspace/ui/lib/utils"

import { createBackgroundImage, createBlendModeCss } from "../core/gradient"

import type { GradientLayer } from "../core/gradient"
import type { GradientPreset } from "../core/presets"
import type { CssGradientGeneratorMessages } from "../types"

type PreviewCardProps = Readonly<{
  backgroundImage: string
  blendMode: string
  messages: CssGradientGeneratorMessages
  onRandomizeAll: () => void
  onRandomizeLayer: () => void
}>

type PresetsCardProps = Readonly<{
  messages: CssGradientGeneratorMessages
  onApplyPreset: (presetId: GradientPreset["id"]) => void
  presetId: GradientPreset["id"] | null
  presets: readonly GradientPreset[]
}>

function toPreviewLayers(preset: GradientPreset) {
  return preset.layers.map((layer, layerIndex) => ({
    ...layer,
    id: preset.id + "-" + layerIndex,
    stops: layer.stops.map((stop, stopIndex) => ({
      ...stop,
      id: preset.id + "-" + layerIndex + "-" + stopIndex,
    })),
  })) as readonly GradientLayer[]
}

function PreviewCard({
  backgroundImage,
  blendMode,
  messages,
  onRandomizeAll,
  onRandomizeLayer,
}: PreviewCardProps) {
  return (
    <Card className="gap-0 overflow-hidden">
      <CardHeader className="border-b">
        <CardTitle>{messages.previewTitle}</CardTitle>
        <CardDescription>{messages.previewHint}</CardDescription>
      </CardHeader>

      <CardContent className="grid gap-3 px-0">
        <div
          aria-label={messages.previewTitle}
          className="min-h-72 border-b border-black/5 bg-slate-100 shadow-inner sm:min-h-80"
          style={{
            backgroundBlendMode: blendMode || undefined,
            backgroundImage,
          }}
        />

        <div className="flex flex-wrap gap-2 px-4">
          <Button
            onClick={onRandomizeLayer}
            size="sm"
            type="button"
            variant="outline"
          >
            <Sparkles data-icon="inline-start" />
            {messages.randomizeLayer}
          </Button>
          <Button onClick={onRandomizeAll} size="sm" type="button">
            <RefreshCcw data-icon="inline-start" />
            {messages.randomizeAll}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function PresetsCard({
  messages,
  onApplyPreset,
  presetId,
  presets,
}: PresetsCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b">
        <CardTitle>{messages.presetsTitle}</CardTitle>
        <CardDescription>{messages.presetsSubtitle}</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {presets.map((preset) => {
            const previewLayers = toPreviewLayers(preset)

            return (
              <button
                className={cn(
                  "group overflow-hidden rounded-xl border p-0 text-left transition-colors",
                  presetId === preset.id
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border bg-card hover:border-primary/40 hover:bg-muted/40"
                )}
                key={preset.id}
                onClick={() => {
                  onApplyPreset(preset.id)
                }}
                type="button"
              >
                <div
                  className="h-20 border-b border-black/5 bg-slate-100 shadow-sm sm:h-16 xl:h-20"
                  style={{
                    backgroundBlendMode:
                      createBlendModeCss(previewLayers) || undefined,
                    backgroundImage: createBackgroundImage(
                      previewLayers,
                      "hex"
                    ),
                  }}
                />
                <div className="px-3 py-2.5 text-sm font-medium">
                  {messages.preset[preset.id]}
                </div>
              </button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

export { PresetsCard, PreviewCard }
