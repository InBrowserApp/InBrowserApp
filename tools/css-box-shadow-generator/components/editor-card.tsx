import {
  ToolPanelCard,
  ToolPanelCardContent,
} from "@workspace/ui/components/tool/tool-panel-card"
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"

import { LayerList } from "./layer-list"
import { LayerSettings } from "./layer-settings"

import type { CssBoxShadowMessages, ShadowLayer } from "../client/types"

type Range = Readonly<{
  min: number
  max: number
}>

type EditorCardProps = Readonly<{
  activeLayer: ShadowLayer
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
      <CardHeader className="border-b">
        <CardTitle>{messages.layersTitle}</CardTitle>
        <CardDescription>{messages.meta.description}</CardDescription>
      </CardHeader>
      <ToolPanelCardContent className="gap-6 lg:grid lg:grid-cols-[minmax(0,16rem)_minmax(0,1fr)]">
        <LayerList
          activeLayerId={activeLayer.id}
          layers={layers}
          messages={messages}
          onAddLayer={onAddLayer}
          onMoveLayer={onMoveLayer}
          onRemoveLayer={onRemoveLayer}
          onSelectLayer={onSelectLayer}
        />
        <LayerSettings
          activeLayer={activeLayer}
          blurRange={blurRange}
          messages={messages}
          offsetRange={offsetRange}
          onUpdateLayer={onUpdateLayer}
          spreadRange={spreadRange}
          swatches={swatches}
        />
      </ToolPanelCardContent>
    </ToolPanelCard>
  )
}

export { EditorCard }
