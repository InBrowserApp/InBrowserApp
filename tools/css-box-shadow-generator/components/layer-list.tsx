import { Badge } from "@workspace/ui/components/ui/badge"
import { Button } from "@workspace/ui/components/ui/button"
import { ScrollArea, ScrollBar } from "@workspace/ui/components/ui/scroll-area"
import { ArrowDown, ArrowUp, Plus, Trash2 } from "@workspace/ui/icons"
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
    <section className="grid min-w-0 gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <h2 className="truncate text-sm font-medium">
            {messages.layersTitle}
          </h2>
          <Badge className="h-5 px-1.5 text-[11px]" variant="secondary">
            {layers.length}
          </Badge>
        </div>

        <Button
          data-testid="add-layer"
          onClick={onAddLayer}
          className="shrink-0"
          size="sm"
          type="button"
          variant="outline"
        >
          <Plus data-icon="inline-start" />
          {messages.addLayerLabel}
        </Button>
      </div>

      <ScrollArea className="min-w-0">
        <div className="flex w-max gap-2 pb-3">
          {layers.map((layer, index) => {
            const active = layer.id === activeLayerId

            return (
              <div
                className={cn(
                  "group/layer w-48 shrink-0 rounded-lg border bg-background px-3 py-2.5 transition-colors sm:w-52",
                  active
                    ? "border-primary/60 bg-primary/5"
                    : "border-border/70 hover:border-primary/35 hover:bg-muted/25"
                )}
                data-testid={`layer-card-${index}`}
                key={layer.id}
              >
                <button
                  className="grid w-full gap-2 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  onClick={() => {
                    onSelectLayer(layer.id)
                  }}
                  type="button"
                >
                  <div className="flex min-w-0 items-center justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-2">
                      <span
                        aria-hidden="true"
                        className="size-2 rounded-full border border-black/10"
                        style={{ backgroundColor: layer.color }}
                      />
                      <span className="truncate text-sm font-medium">
                        {messages.layerTitle.replace(
                          "{index}",
                          String(index + 1)
                        )}
                      </span>
                    </div>
                    {layer.inset ? (
                      <Badge
                        className="h-5 px-1.5 text-[10px]"
                        variant="secondary"
                      >
                        {messages.insetLabel}
                      </Badge>
                    ) : null}
                  </div>

                  <div className="flex min-w-0 items-center gap-3">
                    <div
                      aria-hidden="true"
                      className="size-8 shrink-0 rounded-lg border bg-card"
                      style={{ boxShadow: formatShadowLayer(layer) }}
                    />
                    <code className="min-w-0 truncate font-mono text-xs text-muted-foreground">
                      {formatLayerSummary(layer)}
                    </code>
                  </div>
                </button>

                <div className="mt-2 flex items-center justify-end gap-1 border-t border-border/60 pt-2">
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
                    <ArrowUp />
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
                    <ArrowDown />
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
              </div>
            )
          })}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </section>
  )
}

export { LayerList }
