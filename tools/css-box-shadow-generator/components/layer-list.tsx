import { Badge } from "@workspace/ui/components/ui/badge"
import { Button } from "@workspace/ui/components/ui/button"
import { Card } from "@workspace/ui/components/ui/card"
import { ScrollArea, ScrollBar } from "@workspace/ui/components/ui/scroll-area"
import { Trash2 } from "@workspace/ui/icons"
import { cn } from "@workspace/ui/lib/utils"

import { formatShadowLayer } from "../core/shadow"

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
    <section className="grid gap-4">
      <div className="flex flex-col gap-3 rounded-[1.25rem] border border-border/70 bg-muted/20 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <h2 className="font-medium">{messages.layersTitle}</h2>
          <Badge variant="secondary">{layers.length}</Badge>
        </div>

        <Button
          className="sm:w-auto"
          data-testid="add-layer"
          onClick={onAddLayer}
          type="button"
          variant="outline"
        >
          {messages.addLayerLabel}
        </Button>
      </div>

      <ScrollArea className="w-full rounded-[1.25rem] whitespace-nowrap">
        <div className="flex gap-3 pb-4">
          {layers.map((layer, index) => {
            const active = layer.id === activeLayerId

            return (
              <Card
                className={cn(
                  "w-[17rem] shrink-0 gap-4 border border-border/70 bg-card/90 px-4 py-4 shadow-none transition hover:border-primary/40 hover:bg-muted/25",
                  active && "border-primary/60 bg-primary/5"
                )}
                data-testid={`layer-card-${index}`}
                key={layer.id}
              >
                <button
                  className="grid gap-3 text-left"
                  onClick={() => {
                    onSelectLayer(layer.id)
                  }}
                  type="button"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="grid gap-2">
                      <div className="flex items-center gap-2">
                        <span
                          aria-hidden="true"
                          className="size-2.5 rounded-full border border-black/10"
                          style={{ backgroundColor: layer.color }}
                        />
                        <span className="font-medium">
                          {messages.layerTitle.replace(
                            "{index}",
                            String(index + 1)
                          )}
                        </span>
                      </div>
                      <code className="font-mono text-xs text-muted-foreground">
                        {formatLayerSummary(layer)}
                      </code>
                    </div>

                    {layer.inset ? (
                      <Badge variant="secondary">{messages.insetLabel}</Badge>
                    ) : null}
                  </div>

                  <div className="h-16 rounded-xl border border-dashed border-border/70 bg-gradient-to-br from-background via-muted/20 to-background p-3">
                    <div className="flex h-full items-center justify-center">
                      <div
                        aria-hidden="true"
                        className="size-9 rounded-xl bg-background"
                        style={{ boxShadow: formatShadowLayer(layer) }}
                      />
                    </div>
                  </div>
                </button>

                <div className="flex items-center justify-end gap-1 border-t border-border/60 pt-2">
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
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </section>
  )
}

export { LayerList }
