"use client"

import { useCallback, useEffect, useMemo, useState } from "react"

import {
  DEFAULT_DESKTOP_ICON_CONFIG,
  DEFAULT_IOS_ICON_CONFIG,
  DEFAULT_PWA_ICON_CONFIG,
  DEFAULT_SITE_CONFIG,
  type DesktopIconConfig,
  type IOSIconConfig,
  type PWAIconConfig,
  type SiteConfig,
} from "../core/config"
import { buildHeadHtml } from "../core/html-snippet"
import { buildManifest, manifestToJsonString } from "../core/manifest-builder"
import {
  buildAssetPlan,
  type AssetSpec,
  type DedicatedSourceKey,
  type SourceKey,
  shouldEmitVectorDesktopIcon,
} from "../core/plan"
import { assembleBundle } from "./build-bundle"
import { DEMO_IMAGE_FILENAME, DOWNLOAD_ZIP_NAME } from "./constants"
import { createDemoIconFile } from "./demo-icon"
import { resolveErrorMessage } from "./errors"
import { disposeImageSource, loadImageSource } from "./load-image-source"
import type {
  FaviconMessages,
  GeneratedBundle,
  GenerationError,
  ImageSource,
} from "./types"

type DedicatedSources = Readonly<{
  desktop: ImageSource | null
  ios: ImageSource | null
  pwa: ImageSource | null
}>

const DEDICATED_KEYS: readonly DedicatedSourceKey[] = ["desktop", "ios", "pwa"]

function useFaviconGenerator(messages: FaviconMessages) {
  const [globalSource, setGlobalSource] = useState<ImageSource | null>(null)
  const [dedicatedSources, setDedicatedSources] = useState<DedicatedSources>({
    desktop: null,
    ios: null,
    pwa: null,
  })
  const [siteCfg, setSiteCfg] = useState<SiteConfig>(DEFAULT_SITE_CONFIG)
  const [desktopCfg, setDesktopCfg] = useState<DesktopIconConfig>(
    DEFAULT_DESKTOP_ICON_CONFIG
  )
  const [iosCfg, setIosCfg] = useState<IOSIconConfig>(DEFAULT_IOS_ICON_CONFIG)
  const [pwaCfg, setPwaCfg] = useState<PWAIconConfig>(DEFAULT_PWA_ICON_CONFIG)
  const [isGenerating, setIsGenerating] = useState(false)
  const [bundle, setBundle] = useState<GeneratedBundle | null>(null)
  const [error, setError] = useState<GenerationError | null>(null)

  useEffect(() => {
    return () => {
      disposeImageSource(globalSource)
    }
  }, [globalSource])

  useEffect(() => {
    return () => {
      DEDICATED_KEYS.forEach((key) => disposeImageSource(dedicatedSources[key]))
    }
  }, [dedicatedSources])

  useEffect(() => {
    return () => {
      if (bundle) {
        URL.revokeObjectURL(bundle.zip.url)
        bundle.assets.forEach((asset) => URL.revokeObjectURL(asset.previewUrl))
      }
    }
  }, [bundle])

  const patchSite = useCallback(
    (patch: Partial<SiteConfig>) =>
      setSiteCfg((previous) => ({ ...previous, ...patch })),
    []
  )
  const patchDesktop = useCallback(
    (patch: Partial<DesktopIconConfig>) =>
      setDesktopCfg((previous) => ({ ...previous, ...patch })),
    []
  )
  const patchIos = useCallback(
    (patch: Partial<IOSIconConfig>) =>
      setIosCfg((previous) => ({ ...previous, ...patch })),
    []
  )
  const patchPwa = useCallback(
    (patch: Partial<PWAIconConfig>) =>
      setPwaCfg((previous) => ({ ...previous, ...patch })),
    []
  )

  const handleGlobalFile = useCallback(
    async (file: File | null) => {
      setError(null)
      setBundle(null)
      if (!file) {
        setGlobalSource((previous) => {
          disposeImageSource(previous)
          return null
        })
        return
      }

      try {
        const next = await loadImageSource(file)
        setGlobalSource((previous) => {
          disposeImageSource(previous)
          return next
        })
      } catch {
        setError({
          code: "invalid-image",
          message: resolveErrorMessage("invalid-image", messages),
        })
      }
    },
    [messages]
  )

  const handleDedicatedFile = useCallback(
    async (key: DedicatedSourceKey, file: File | null) => {
      setError(null)
      setBundle(null)

      if (!file) {
        setDedicatedSources((previous) => {
          disposeImageSource(previous[key])
          return { ...previous, [key]: null }
        })
        return
      }

      try {
        const next = await loadImageSource(file)
        setDedicatedSources((previous) => {
          disposeImageSource(previous[key])
          return { ...previous, [key]: next }
        })
      } catch {
        setError({
          code: "invalid-image",
          message: resolveErrorMessage("invalid-image", messages),
        })
      }
    },
    [messages]
  )

  const useDemo = useCallback(async () => {
    await handleGlobalFile(createDemoIconFile(DEMO_IMAGE_FILENAME))
  }, [handleGlobalFile])

  const resetOptions = useCallback(() => {
    setSiteCfg(DEFAULT_SITE_CONFIG)
    setDesktopCfg(DEFAULT_DESKTOP_ICON_CONFIG)
    setIosCfg(DEFAULT_IOS_ICON_CONFIG)
    setPwaCfg(DEFAULT_PWA_ICON_CONFIG)
    setBundle(null)
    setError(null)
  }, [])

  const sourceMap = useMemo<Record<SourceKey, ImageSource | null>>(
    () => ({
      global: globalSource,
      desktop: dedicatedSources.desktop,
      ios: dedicatedSources.ios,
      pwa: dedicatedSources.pwa,
    }),
    [globalSource, dedicatedSources]
  )

  const desktopEffectiveSource = useMemo<ImageSource | null>(() => {
    if (desktopCfg.useDifferentImage && dedicatedSources.desktop) {
      return dedicatedSources.desktop
    }
    return globalSource
  }, [desktopCfg.useDifferentImage, dedicatedSources.desktop, globalSource])

  const desktopSourceIsSvg = useMemo(
    () => desktopEffectiveSource?.isSvg ?? false,
    [desktopEffectiveSource]
  )

  const plan = useMemo<readonly AssetSpec[]>(() => {
    return buildAssetPlan({
      desktopSourceIsSvg,
      site: siteCfg,
      desktop: desktopCfg,
      ios: iosCfg,
      pwa: pwaCfg,
    })
  }, [desktopSourceIsSvg, siteCfg, desktopCfg, iosCfg, pwaCfg])

  const generate = useCallback(async () => {
    setError(null)

    if (!globalSource) {
      setError({
        code: "needs-image",
        message: resolveErrorMessage("needs-image", messages),
      })
      return
    }

    if (siteCfg.name.trim() === "") {
      setError({
        code: "needs-app-name",
        message: resolveErrorMessage("needs-app-name", messages),
      })
      return
    }

    const missingDedicated =
      (desktopCfg.useDifferentImage && !dedicatedSources.desktop) ||
      (iosCfg.useDifferentImage && !dedicatedSources.ios) ||
      (pwaCfg.useDifferentImage && !dedicatedSources.pwa)

    if (missingDedicated) {
      setError({
        code: "missing-dedicated-image",
        message: resolveErrorMessage("missing-dedicated-image", messages),
      })
      return
    }

    setIsGenerating(true)

    try {
      const generated = await assembleBundle({
        plan,
        sourceMap,
        manifestJson: manifestToJsonString(
          buildManifest({
            site: siteCfg,
            pwa: { includeMaskable: pwaCfg.includeMaskable },
          })
        ),
        htmlSnippet: buildHeadHtml({
          site: siteCfg,
          includeVectorDesktopIcon: shouldEmitVectorDesktopIcon({
            desktopSourceIsSvg,
            desktop: desktopCfg,
          }),
        }),
        zipName: DOWNLOAD_ZIP_NAME,
      })

      setBundle((previous) => {
        if (previous) {
          URL.revokeObjectURL(previous.zip.url)
          previous.assets.forEach((asset) =>
            URL.revokeObjectURL(asset.previewUrl)
          )
        }
        return generated
      })
    } catch {
      setError({
        code: "generation-failed",
        message: resolveErrorMessage("generation-failed", messages),
      })
    } finally {
      setIsGenerating(false)
    }
  }, [
    globalSource,
    siteCfg,
    desktopCfg,
    iosCfg,
    pwaCfg,
    dedicatedSources,
    plan,
    sourceMap,
    desktopSourceIsSvg,
    messages,
  ])

  const hasImage = globalSource !== null
  const canGenerate = hasImage && siteCfg.name.trim().length > 0

  return {
    globalSource,
    dedicatedSources,
    siteCfg,
    desktopCfg,
    iosCfg,
    pwaCfg,
    isGenerating,
    bundle,
    error,
    plan,
    desktopEffectiveSource,
    desktopSourceIsSvg,
    canGenerate,
    hasImage,
    handleGlobalFile,
    handleDedicatedFile,
    useDemo,
    patchSite,
    patchDesktop,
    patchIos,
    patchPwa,
    resetOptions,
    generate,
  }
}

export { useFaviconGenerator }
