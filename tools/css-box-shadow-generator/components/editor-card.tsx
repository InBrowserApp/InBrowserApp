import {
  ToolPanelCard,
  ToolPanelCardContent,
} from "@workspace/ui/components/tool/tool-panel-card"
import { Badge } from "@workspace/ui/components/ui/badge"
import { Button } from "@workspace/ui/components/ui/button"
import {
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { Plus } from "@workspace/ui/icons"

import { LayerList } from "./layer-list"
import { LayerSettings } from "./layer-settings"

import type { CssBoxShadowMessages, ShadowLayer } from "../client/types"

type Range = Readonly<{
  min: number
  max: number
}>

type EditorCardProps = Readonly<{
  activeLayer: ShadowLayer
  activeLayerIndex: number
  blurRange: Range
  messages: CssBoxShadowMessages
  offsetRange: Range
  onAddLayer: () => void
  onMoveLayer: (id: string, direction: -1 | 1) => void
  onRemoveLayer: (id: string) => void
  onSelectLayer: (id: string) => void
  onUpdateLayer: (id: string, patch: Partial<ShadowLayer>) => void
  spreadRange: Range
  swatches: readonly string[]
  layers: readonly ShadowLayer[]
}>

function EditorCard({
  activeLayer,
  activeLayerIndex,
  blurRange,
  messages,
  offsetRange,
  onAddLayer,
  onMoveLayer,
  onRemoveLayer,
  onSelectLayer,
  onUpdateLayer,
  spreadRange,
  swatches,
  layers,
}: EditorCardProps) {
  return (
    <ToolPanelCard className="min-w-0" size="sm">
      <CardHeader className="border-b">
        <CardTitle className="flex min-w-0 items-center gap-2">
          <span className="truncate">{messages.layersTitle}</span>
          <Badge className="h-5 px-1.5 text-[11px]" variant="secondary">
            {layers.length}
          </Badge>
        </CardTitle>
        <CardDescription className="line-clamp-2 max-w-xl text-pretty sm:line-clamp-none">
          {messages.meta.description}
        </CardDescription>
        <CardAction>
          <Button
            className="shrink-0"
            data-testid="add-layer"
            onClick={onAddLayer}
            size="sm"
            type="button"
            variant="outline"
          >
            <Plus data-icon="inline-start" />
            {messages.addLayerLabel}
          </Button>
        </CardAction>
      </CardHeader>
      <ToolPanelCardContent className="min-w-0 gap-4">
        <LayerList
          activeLayerId={activeLayer.id}
          layers={layers}
          messages={messages}
          onMoveLayer={onMoveLayer}
          onRemoveLayer={onRemoveLayer}
          onSelectLayer={onSelectLayer}
        />
        <div className="border-t pt-4">
          <LayerSettings
            activeLayer={activeLayer}
            activeLayerIndex={activeLayerIndex}
            blurRange={blurRange}
            messages={messages}
            offsetRange={offsetRange}
            onUpdateLayer={onUpdateLayer}
            spreadRange={spreadRange}
            swatches={swatches}
          />
        </div>
      </ToolPanelCardContent>
    </ToolPanelCard>
  )
}

export { EditorCard }
