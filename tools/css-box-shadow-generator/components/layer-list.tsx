import { Badge } from "@workspace/ui/components/ui/badge"
import { Button } from "@workspace/ui/components/ui/button"
import { Card } from "@workspace/ui/components/ui/card"
import { Trash2 } from "@workspace/ui/icons"
import { cn } from "@workspace/ui/lib/utils"

import type { CssBoxShadowMessages, ShadowLayer } from "../client/types"

type LayerListProps = Readonly<{
  activeLayerId: string
  layers: readonly ShadowLayer[]
  messages: CssBoxShadowMessages
  onAddLayer: () => void
  onMoveLayer: (id: string, direction: -1 | 1) => void
  onRemoveLayer: (id: string) => void
  onSelectLayer: (id: string) => void
}>

function formatLayerSummary(layer: ShadowLayer) {
  return `${layer.offsetX}px ${layer.offsetY}px ${layer.blur}px ${layer.spread}px`
}

function LayerList({
  activeLayerId,
  layers,
  messages,
  onAddLayer,
  onMoveLayer,
  onRemoveLayer,
  onSelectLayer,
}: LayerListProps) {
  return (
    <div className="grid gap-3">
      {layers.map((layer, index) => {
        const active = layer.id === activeLayerId

        return (
          <Card
            className={cn(
              "gap-3 border border-border/70 px-3 py-3 shadow-none transition hover:border-primary/40 hover:bg-muted/30",
              active && "border-primary/60 bg-primary/5"
            )}
            data-testid={`layer-card-${index}`}
            key={layer.id}
          >
            <button
              className="grid gap-2 text-left"
              onClick={() => {
                onSelectLayer(layer.id)
              }}
              type="button"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="font-medium">
                  {messages.layerTitle.replace("{index}", String(index + 1))}
                </span>
                {layer.inset ? (
                  <Badge variant="secondary">{messages.insetLabel}</Badge>
                ) : null}
              </div>
              <code className="font-mono text-xs text-muted-foreground">
                {formatLayerSummary(layer)}
              </code>
            </button>

            <div className="flex items-center justify-end gap-1">
              <Button
                aria-label={messages.moveUpLabel}
                data-testid={`layer-up-${index}`}
                disabled={index === 0}
                onClick={() => {
                  onMoveLayer(layer.id, -1)
                }}
                size="icon-xs"
                type="button"
                variant="ghost"
              >
                ↑
              </Button>
              <Button
                aria-label={messages.moveDownLabel}
                data-testid={`layer-down-${index}`}
                disabled={index === layers.length - 1}
                onClick={() => {
                  onMoveLayer(layer.id, 1)
                }}
                size="icon-xs"
                type="button"
                variant="ghost"
              >
                ↓
              </Button>
              <Button
                aria-label={messages.removeLayerLabel}
                data-testid={`layer-remove-${index}`}
                disabled={layers.length === 1}
                onClick={() => {
                  onRemoveLayer(layer.id)
                }}
                size="icon-xs"
                type="button"
                variant="ghost"
              >
                <Trash2 />
              </Button>
            </div>
          </Card>
        )
      })}

      <Button
        data-testid="add-layer"
        onClick={onAddLayer}
        type="button"
        variant="outline"
      >
        {messages.addLayerLabel}
      </Button>
    </div>
  )
}

export { LayerList }
