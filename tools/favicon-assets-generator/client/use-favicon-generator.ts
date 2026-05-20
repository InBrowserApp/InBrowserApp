"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"

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
import {
  loadDedicatedSource,
  loadGlobalSource,
  type DedicatedSources,
} from "./file-handlers"
import { disposeImageSource } from "./load-image-source"
import type {
  FaviconMessages,
  GeneratedBundle,
  GenerationError,
  ImageSource,
} from "./types"

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
  // Monotonic generation token so a slow in-flight Generate can't overwrite
  // the bundle produced by a later click (or a user file swap mid-flight).
  const generationIdRef = useRef(0)

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
    (file: File | null) =>
      loadGlobalSource(file, setGlobalSource, {
        messages,
        generationIdRef,
        setError,
        setBundle,
        setIsGenerating,
      }),
    [messages]
  )

  const handleDedicatedFile = useCallback(
    (key: DedicatedSourceKey, file: File | null) =>
      loadDedicatedSource(key, file, setDedicatedSources, {
        messages,
        generationIdRef,
        setError,
        setBundle,
        setIsGenerating,
      }),
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
    generationIdRef.current += 1
    setIsGenerating(false)
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

    const myGenerationId = ++generationIdRef.current
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
        optimizePng: siteCfg.optimizePng,
      })

      if (myGenerationId !== generationIdRef.current) {
        // A newer generate (or a source/reset) has superseded this run.
        // Drop the result here instead of overwriting the current bundle.
        URL.revokeObjectURL(generated.zip.url)
        generated.assets.forEach((asset) =>
          URL.revokeObjectURL(asset.previewUrl)
        )
        return
      }

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
      if (myGenerationId !== generationIdRef.current) {
        return
      }
      setError({
        code: "generation-failed",
        message: resolveErrorMessage("generation-failed", messages),
      })
    } finally {
      if (myGenerationId === generationIdRef.current) {
        setIsGenerating(false)
      }
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
