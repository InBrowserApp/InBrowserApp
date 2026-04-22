import { useEffect, useState } from "react"

import {
  DEFAULT_SHADOW_CONFIG,
  buildBoxShadow,
  normalizeShadowConfig,
} from "./core/shadow"
import {
  BLUR_RANGE,
  OFFSET_RANGE,
  SPREAD_RANGE,
  STORAGE_KEYS,
  SWATCHES,
} from "./client/constants"
import { EditorCard } from "./components/editor-card"
import { OutputCard } from "./components/output-card"
import { PreviewCard } from "./components/preview-card"

import type { CssBoxShadowMessages, ShadowLayer } from "./client/types"
import type { ShadowConfig } from "./core/shadow"

type CssBoxShadowGeneratorClientProps = Readonly<{
  messages: CssBoxShadowMessages
}>

function createLayerId() {
  return `shadow-${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`
}

function createLayer(overrides: Partial<ShadowConfig> = {}): ShadowLayer {
  return {
    id: createLayerId(),
    ...normalizeShadowConfig({ ...DEFAULT_SHADOW_CONFIG, ...overrides }),
  }
}

function readStoredLayers() {
  /* v8 ignore next */
  if (typeof window === "undefined") {
    return [createLayer()]
  }

  const stored = window.localStorage.getItem(STORAGE_KEYS.layers)

  if (!stored) {
    return [createLayer()]
  }

  try {
    const parsed = JSON.parse(stored) as Array<Partial<ShadowLayer>>
    const normalized = parsed
      .map((layer) => ({
        id:
          typeof layer.id === "string" && layer.id.length > 0
            ? layer.id
            : createLayerId(),
        ...normalizeShadowConfig(layer),
      }))
      .filter((layer) => layer.id.length > 0)

    return normalized.length > 0 ? normalized : [createLayer()]
  } catch {
    return [createLayer()]
  }
}

function readStoredActiveLayerId(layers: readonly ShadowLayer[]) {
  /* v8 ignore next */
  if (typeof window === "undefined") {
    return layers[0]!.id
  }

  const stored = window.localStorage.getItem(STORAGE_KEYS.activeLayerId)

  if (!stored || !layers.some((layer) => layer.id === stored)) {
    return layers[0]!.id
  }

  return stored
}

function readStoredDarkBackground() {
  /* v8 ignore next */
  if (typeof window === "undefined") {
    return false
  }

  return window.localStorage.getItem(STORAGE_KEYS.darkBackground) === "true"
}

function CssBoxShadowGeneratorClient({
  messages,
}: CssBoxShadowGeneratorClientProps) {
  const [layers, setLayers] = useState<ShadowLayer[]>(() => readStoredLayers())
  const [activeLayerId, setActiveLayerId] = useState(() =>
    readStoredActiveLayerId(readStoredLayers())
  )
  const [darkBackground, setDarkBackground] = useState(() =>
    readStoredDarkBackground()
  )

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") {
      return
    }

    window.localStorage.setItem(STORAGE_KEYS.layers, JSON.stringify(layers))
  }, [layers])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") {
      return
    }

    window.localStorage.setItem(STORAGE_KEYS.activeLayerId, activeLayerId)
  }, [activeLayerId])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") {
      return
    }

    window.localStorage.setItem(
      STORAGE_KEYS.darkBackground,
      String(darkBackground)
    )
  }, [darkBackground])

  useEffect(() => {
    if (layers.length === 0) {
      const nextLayer = createLayer()
      setLayers([nextLayer])
      setActiveLayerId(nextLayer.id)
      return
    }

    if (!layers.some((layer) => layer.id === activeLayerId)) {
      setActiveLayerId(layers[0]!.id)
    }
  }, [activeLayerId, layers])

  const activeLayer =
    layers.find((layer) => layer.id === activeLayerId) ?? layers[0]!

  const shadowValue = buildBoxShadow(
    layers.map((layer) =>
      normalizeShadowConfig({
        offsetX: layer.offsetX,
        offsetY: layer.offsetY,
        blur: layer.blur,
        spread: layer.spread,
        color: layer.color,
        inset: layer.inset,
      })
    )
  )
  const cssOutput = `box-shadow: ${shadowValue};`

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,28rem)_minmax(0,1fr)]">
      <EditorCard
        activeLayer={activeLayer}
        blurRange={BLUR_RANGE}
        messages={messages}
        offsetRange={OFFSET_RANGE}
        onAddLayer={() => {
          const nextLayer = createLayer()
          setLayers((currentLayers) => [...currentLayers, nextLayer])
          setActiveLayerId(nextLayer.id)
        }}
        onMoveLayer={(id, direction) => {
          setLayers((currentLayers) => {
            const index = currentLayers.findIndex((layer) => layer.id === id)

            if (index === -1) {
              return currentLayers
            }

            const nextIndex = index + direction

            if (nextIndex < 0 || nextIndex >= currentLayers.length) {
              return currentLayers
            }

            const nextLayers = [...currentLayers]
            const currentLayer = nextLayers[index]!
            nextLayers[index] = nextLayers[nextIndex]!
            nextLayers[nextIndex] = currentLayer

            return nextLayers
          })
        }}
        onRemoveLayer={(id) => {
          if (layers.length === 1) {
            return
          }

          setLayers((currentLayers) =>
            currentLayers.filter((layer) => layer.id !== id)
          )
        }}
        onSelectLayer={setActiveLayerId}
        onUpdateLayer={(id, patch) => {
          setLayers((currentLayers) =>
            currentLayers.map((layer) =>
              layer.id === id ? { ...layer, ...patch } : layer
            )
          )
        }}
        spreadRange={SPREAD_RANGE}
        swatches={SWATCHES}
        layers={layers}
      />

      <div className="grid gap-6">
        <PreviewCard
          darkBackground={darkBackground}
          messages={messages}
          onDarkBackgroundChange={setDarkBackground}
          previewStyle={{ boxShadow: shadowValue }}
        />
        <OutputCard cssOutput={cssOutput} messages={messages} />
      </div>
    </div>
  )
}

export default CssBoxShadowGeneratorClient
