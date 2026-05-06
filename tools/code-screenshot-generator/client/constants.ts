import {
  DEFAULT_MONO_FONT,
  backgroundPresets,
  themes,
  type BackgroundPreset,
  type Theme,
} from "../core/themes"
import type { BackgroundMode, RenderMode, WindowStyle } from "../core/tokens"
import type { CodeShotLayout } from "../core/layout"

type CodeShotSettings = Readonly<{
  code: string
  language: string
  renderMode: RenderMode
  themeId: string
  backgroundMode: BackgroundMode
  backgroundPresetId: string
  backgroundColor: string
  windowStyle: WindowStyle
  showLineNumbers: boolean
  fontSize: number
  lineHeight: number
  cardPadding: number
  framePadding: number
  cornerRadius: number
  shadow: boolean
  tabSize: number
  fileName: string
  rasterScale: number
}>

type Option<TValue extends string> = Readonly<{
  labelKey: string
  value: TValue
}>

const STORAGE_KEY = "tools:code-screenshot-generator:v1"

const DEFAULT_CODE = `const createShot = (code) => ({
  code,
  theme: "nebula",
  background: "aurora",
  formats: ["png", "svg", "webp", "html"],
})`

const DEFAULT_SETTINGS: CodeShotSettings = {
  code: DEFAULT_CODE,
  language: "auto",
  renderMode: "highlight",
  themeId: "nebula",
  backgroundMode: "preset",
  backgroundPresetId: "aurora",
  backgroundColor: "#0f172a",
  windowStyle: "mac",
  showLineNumbers: true,
  fontSize: 16,
  lineHeight: 1.6,
  cardPadding: 24,
  framePadding: 48,
  cornerRadius: 18,
  shadow: true,
  tabSize: 2,
  fileName: "code-shot",
  rasterScale: 2,
}

const themeOptions = themes.map((theme) => ({
  labelKey: theme.labelKey,
  value: theme.id,
})) satisfies readonly Option<Theme["id"]>[]

const backgroundPresetOptions = backgroundPresets.map((preset) => ({
  labelKey: preset.labelKey,
  value: preset.id,
})) satisfies readonly Option<BackgroundPreset["id"]>[]

const renderModeOptions = [
  { labelKey: "renderHighlight", value: "highlight" },
  { labelKey: "renderPlain", value: "plain" },
] as const satisfies readonly Option<RenderMode>[]

const backgroundModeOptions = [
  { labelKey: "backgroundModePreset", value: "preset" },
  { labelKey: "backgroundModeSolid", value: "solid" },
  { labelKey: "backgroundModeTransparent", value: "transparent" },
  { labelKey: "backgroundModeNone", value: "none" },
] as const satisfies readonly Option<BackgroundMode>[]

const windowStyleOptions = [
  { labelKey: "windowMac", value: "mac" },
  { labelKey: "windowWindows", value: "windows" },
  { labelKey: "windowNone", value: "none" },
] as const satisfies readonly Option<WindowStyle>[]

const rasterScaleOptions = [1, 2, 3] as const

const toLayout = (settings: CodeShotSettings): CodeShotLayout => ({
  fontSize: settings.fontSize,
  lineHeight: settings.lineHeight,
  padding: settings.cardPadding,
  framePadding: settings.backgroundMode === "none" ? 0 : settings.framePadding,
  radius: settings.cornerRadius,
  shadow: settings.backgroundMode === "none" ? false : settings.shadow,
  windowStyle: settings.windowStyle,
  showLineNumbers: settings.showLineNumbers,
  tabSize: settings.tabSize,
  fontFamily: DEFAULT_MONO_FONT,
})

export {
  DEFAULT_SETTINGS,
  STORAGE_KEY,
  backgroundModeOptions,
  backgroundPresetOptions,
  rasterScaleOptions,
  renderModeOptions,
  themeOptions,
  toLayout,
  windowStyleOptions,
}
export type { CodeShotSettings, Option }
