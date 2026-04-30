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
  onApplyPreset: (presetId: GradientPreset["id"]) => void
  onRandomizeAll: () => void
  onRandomizeLayer: () => void
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
  onApplyPreset,
  onRandomizeAll,
  onRandomizeLayer,
  presetId,
  presets,
}: PreviewCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="gap-4 border-b">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-1">
            <CardTitle>{messages.previewTitle}</CardTitle>
            <CardDescription>{messages.previewHint}</CardDescription>
          </div>

          <div className="flex flex-wrap gap-2">
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
        </div>
      </CardHeader>

      <CardContent className="grid gap-6">
        <div className="rounded-xl border bg-muted/35 p-3 shadow-sm sm:p-4">
          <div
            aria-label={messages.previewTitle}
            className="min-h-72 rounded-lg border border-black/5 bg-slate-100 shadow-inner sm:min-h-80"
            style={{
              backgroundBlendMode: blendMode || undefined,
              backgroundImage,
            }}
          />
        </div>

        <div className="grid gap-3">
          <div className="space-y-1">
            <h3 className="text-sm font-semibold">{messages.presetsTitle}</h3>
            <p className="text-sm text-muted-foreground">
              {messages.presetsSubtitle}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {presets.map((preset) => {
              const previewLayers = toPreviewLayers(preset)

              return (
                <button
                  className={cn(
                    "group rounded-xl border p-3 text-left transition-colors",
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
                    className="mb-3 h-16 rounded-lg border border-black/5 bg-slate-100 shadow-sm"
                    style={{
                      backgroundBlendMode:
                        createBlendModeCss(previewLayers) || undefined,
                      backgroundImage: createBackgroundImage(
                        previewLayers,
                        "hex"
                      ),
                    }}
                  />
                  <div className="text-sm font-medium">
                    {messages.preset[preset.id]}
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export { PreviewCard }
