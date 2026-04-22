import {
  ToolPanelCard,
  ToolPanelCardContent,
} from "@workspace/ui/components/tool/tool-panel-card"
import { CardHeader, CardTitle } from "@workspace/ui/components/ui/card"

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
    <ToolPanelCard>
      <CardHeader className="border-b pb-4">
        <CardTitle>{messages.meta.name}</CardTitle>
      </CardHeader>
      <ToolPanelCardContent className="gap-5">
        <LayerList
          activeLayerId={activeLayer.id}
          layers={layers}
          messages={messages}
          onAddLayer={onAddLayer}
          onMoveLayer={onMoveLayer}
          onRemoveLayer={onRemoveLayer}
          onSelectLayer={onSelectLayer}
        />
        <div className="rounded-[1.25rem] border border-border/70 bg-gradient-to-b from-muted/18 to-background p-4 sm:p-5">
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
