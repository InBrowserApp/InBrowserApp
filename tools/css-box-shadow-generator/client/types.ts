import type { ToolMeta } from "@workspace/tool-sdk"
import type { ShadowConfig } from "../core/shadow"

type CssBoxShadowMessagesCatalog = Readonly<{
  layersTitle: string
  layerTitle: string
  addLayerLabel: string
  removeLayerLabel: string
  moveUpLabel: string
  moveDownLabel: string
  layerSettingsTitle: string
  offsetXLabel: string
  offsetYLabel: string
  blurLabel: string
  spreadLabel: string
  colorLabel: string
  alphaLabel: string
  insetLabel: string
  unitPixels: string
  previewTitle: string
  outputTitle: string
  outputHint: string
  darkBackgroundLabel: string
  invalidColorMessage: string
  copyLabel: string
  copiedLabel: string
}>

type CssBoxShadowMessages = Readonly<
  CssBoxShadowMessagesCatalog & {
    meta: ToolMeta
  }
>

type ShadowLayer = ShadowConfig & {
  id: string
}

export type { CssBoxShadowMessages, CssBoxShadowMessagesCatalog, ShadowLayer }
