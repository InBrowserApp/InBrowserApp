import { Alert, AlertDescription } from "@workspace/ui/components/ui/alert"
import { Badge } from "@workspace/ui/components/ui/badge"
import { Button } from "@workspace/ui/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import {
  ArrowDown,
  ArrowUp,
  Copy,
  Plus,
  Trash2,
  TriangleAlert,
} from "@workspace/ui/icons"
import { cn } from "@workspace/ui/lib/utils"

import type { GradientLayer } from "../core/gradient"
import type { CssGradientGeneratorMessages } from "../types"

type LayersCardProps = Readonly<{
  activeLayerId: string
  layers: readonly GradientLayer[]
  messages: CssGradientGeneratorMessages
  onAddLayer: () => void
  onDuplicateLayer: (layerId: string) => void
  onMoveLayer: (layerId: string, direction: -1 | 1) => void
  onRemoveLayer: (layerId: string) => void
  onSetActive: (layerId: string) => void
  showError: boolean
}>

function LayersCard({
  activeLayerId,
  layers,
  messages,
  onAddLayer,
  onDuplicateLayer,
  onMoveLayer,
  onRemoveLayer,
  onSetActive,
  showError,
}: LayersCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="gap-4 border-b">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-1">
            <CardTitle>{messages.layersTitle}</CardTitle>
            <CardDescription>{messages.layersSubtitle}</CardDescription>
          </div>

          <Button onClick={onAddLayer} size="sm" type="button">
            <Plus data-icon="inline-start" />
            {messages.addLayer}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="grid gap-4">
        {showError ? (
          <Alert variant="destructive">
            <TriangleAlert />
            <AlertDescription>{messages.minLayerHint}</AlertDescription>
          </Alert>
        ) : null}

        <div className="grid gap-3">
          {layers.map((layer, index) => {
            const isActive = layer.id === activeLayerId
            const label = messages.layerLabel.replace(
              "{index}",
              String(index + 1)
            )

            return (
              <div
                className={cn(
                  "rounded-xl border p-4 transition-colors",
                  isActive
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border bg-card hover:border-primary/30"
                )}
                key={layer.id}
              >
                <div className="grid gap-3">
                  <button
                    className="flex min-w-0 flex-wrap items-center gap-2 text-left"
                    onClick={() => {
                      onSetActive(layer.id)
                    }}
                    type="button"
                  >
                    <span className="min-w-0 truncate text-sm font-semibold">
                      {label}
                    </span>
                    <Badge variant="secondary">
                      {messages.type[layer.type]}
                    </Badge>
                    <Badge variant="outline">{layer.stops.length}</Badge>
                  </button>

                  <div className="flex flex-wrap gap-2">
                    <Button
                      onClick={() => {
                        onDuplicateLayer(layer.id)
                      }}
                      size="sm"
                      type="button"
                      variant="ghost"
                    >
                      <Copy data-icon="inline-start" />
                      {messages.duplicateLayer}
                    </Button>
                    <Button
                      onClick={() => {
                        onMoveLayer(layer.id, -1)
                      }}
                      disabled={index === 0}
                      size="sm"
                      type="button"
                      variant="ghost"
                    >
                      <ArrowUp data-icon="inline-start" />
                      {messages.moveUp}
                    </Button>
                    <Button
                      onClick={() => {
                        onMoveLayer(layer.id, 1)
                      }}
                      disabled={index === layers.length - 1}
                      size="sm"
                      type="button"
                      variant="ghost"
                    >
                      <ArrowDown data-icon="inline-start" />
                      {messages.moveDown}
                    </Button>
                    <Button
                      onClick={() => {
                        onRemoveLayer(layer.id)
                      }}
                      size="sm"
                      type="button"
                      variant="ghost"
                    >
                      <Trash2 data-icon="inline-start" />
                      {messages.deleteLayer}
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

export { LayersCard }
