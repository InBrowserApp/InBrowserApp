import {
  startTransition,
  useDeferredValue,
  useEffect,
  useMemo,
  useState,
} from "react"

import { getBackgroundPreset, getThemeById } from "./core/themes"
import { applyTokenStyles, tokensToLines } from "./core/tokens"
import { estimateTextWidth } from "./core/layout"
import { buildCodeShotSvg } from "./core/svg"
import { buildHtmlDocument, buildHtmlSnippet } from "./core/html"
import type { BackgroundConfig } from "./core/backgrounds"
import { CodeCard } from "./client/code-card"
import { ControlsCard } from "./client/controls-card"
import {
  DEFAULT_SETTINGS,
  STORAGE_KEY,
  toLayout,
  type CodeShotSettings,
} from "./client/constants"
import { highlightCodeToTokens } from "./client/highlight"
import { PreviewExportCard } from "./client/preview-export-card"
import type { CodeScreenshotGeneratorMessages } from "./types"

type CodeScreenshotGeneratorClientProps = Readonly<{
  messages: CodeScreenshotGeneratorMessages
}>

function readStoredSettings(): CodeShotSettings {
  if (typeof window === "undefined") {
    return DEFAULT_SETTINGS
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)

    if (!stored) {
      return DEFAULT_SETTINGS
    }

    const parsed = JSON.parse(stored) as Partial<CodeShotSettings>

    return { ...DEFAULT_SETTINGS, ...parsed }
  } catch {
    return DEFAULT_SETTINGS
  }
}

function createCanvasMeasurer() {
  let canvas: HTMLCanvasElement | null = null

  return (text: string, font: string) => {
    if (typeof document === "undefined") {
      return estimateTextWidth(text, font)
    }

    canvas ??= document.createElement("canvas")
    const context = canvas.getContext("2d")

    if (!context) {
      return text.length * 8
    }

    context.font = font
    return context.measureText(text).width
  }
}

function CodeScreenshotGeneratorClient({
  messages,
}: CodeScreenshotGeneratorClientProps) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)
  const [isHydrated, setIsHydrated] = useState(false)
  const deferredCode = useDeferredValue(settings.code)
  const hasCode = deferredCode.trim().length > 0

  useEffect(() => {
    setSettings(readStoredSettings())
    setIsHydrated(true)
  }, [])

  useEffect(() => {
    if (!isHydrated) {
      return
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  }, [isHydrated, settings])

  const updateSettings = (patch: Partial<CodeShotSettings>) => {
    startTransition(() => {
      setSettings((current) => ({ ...current, ...patch }))
    })
  }

  const theme = useMemo(
    () => getThemeById(settings.themeId),
    [settings.themeId]
  )
  const background = useMemo<BackgroundConfig>(() => {
    if (settings.backgroundMode === "transparent") {
      return { type: "transparent" }
    }

    if (settings.backgroundMode === "none") {
      return { type: "none" }
    }

    if (settings.backgroundMode === "solid") {
      return { type: "solid", color: settings.backgroundColor }
    }

    return {
      type: "preset",
      preset: getBackgroundPreset(settings.backgroundPresetId),
    }
  }, [
    settings.backgroundColor,
    settings.backgroundMode,
    settings.backgroundPresetId,
  ])
  const layout = useMemo(() => toLayout(settings), [settings])
  const measureTextWidth = useMemo(() => createCanvasMeasurer(), [])
  const tokens = useMemo(
    () =>
      highlightCodeToTokens(
        isHydrated ? deferredCode : "",
        settings.language,
        settings.renderMode
      ),
    [deferredCode, isHydrated, settings.language, settings.renderMode]
  )
  const styledLines = useMemo(
    () => tokensToLines(applyTokenStyles(tokens, theme, settings.tabSize)),
    [settings.tabSize, theme, tokens]
  )
  const svgOutput = useMemo(
    () =>
      buildCodeShotSvg(
        styledLines,
        layout,
        theme,
        background,
        measureTextWidth
      ),
    [background, layout, measureTextWidth, styledLines, theme]
  )
  const htmlSnippet = useMemo(
    () => buildHtmlSnippet(styledLines, layout, theme, background),
    [background, layout, styledLines, theme]
  )
  const htmlDocument = useMemo(
    () => buildHtmlDocument(htmlSnippet),
    [htmlSnippet]
  )

  return (
    <div className="grid min-w-0 items-start gap-6 xl:grid-cols-[minmax(0,0.95fr)_minmax(22rem,0.7fr)]">
      <div className="grid min-w-0 gap-6">
        <CodeCard
          code={settings.code}
          messages={messages}
          onCodeChange={(code) => {
            updateSettings({ code })
          }}
        />
        <ControlsCard
          messages={messages}
          settings={settings}
          onChange={updateSettings}
        />
      </div>

      <aside className="min-w-0 xl:sticky xl:top-6">
        <PreviewExportCard
          background={background}
          fileName={settings.fileName}
          hasCode={hasCode}
          htmlDocument={htmlDocument}
          htmlSnippet={htmlSnippet}
          messages={messages}
          onSettingsChange={updateSettings}
          rasterScale={settings.rasterScale}
          svgOutput={svgOutput}
          theme={theme}
        />
      </aside>
    </div>
  )
}

export default CodeScreenshotGeneratorClient
