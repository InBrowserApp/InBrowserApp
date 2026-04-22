import { useMemo } from "react"

import {
  createBackgroundBlendModeDeclaration,
  createBackgroundDeclaration,
  createBlendModeCss,
  createBackgroundImage,
  createBackgroundImageDeclaration,
  createCssOutput,
  serializeGradientConfig,
} from "../core/gradient"
import { createGradientSvgMarkup } from "../core/svg"
import { useObjectUrl } from "./use-object-url"

import type { ColorFormat, GradientLayer } from "../core/gradient"

type UseGradientDerivedOptions = Readonly<{
  layers: readonly GradientLayer[]
  deferredLayers: readonly GradientLayer[]
  outputFormat: ColorFormat
  exportWidth: number
  exportHeight: number
}>

function useGradientDerived({
  layers,
  deferredLayers,
  outputFormat,
  exportWidth,
  exportHeight,
}: UseGradientDerivedOptions) {
  const previewBackgroundImage = useMemo(
    () => createBackgroundImage(deferredLayers, outputFormat),
    [deferredLayers, outputFormat]
  )
  const previewBlendMode = useMemo(
    () => createBlendModeCss(deferredLayers),
    [deferredLayers]
  )
  const cssOutput = useMemo(
    () => createCssOutput(deferredLayers, outputFormat),
    [deferredLayers, outputFormat]
  )
  const backgroundImageDeclaration = useMemo(
    () => createBackgroundImageDeclaration(deferredLayers, outputFormat),
    [deferredLayers, outputFormat]
  )
  const backgroundBlendDeclaration = useMemo(
    () => createBackgroundBlendModeDeclaration(deferredLayers),
    [deferredLayers]
  )
  const backgroundDeclaration = useMemo(
    () => createBackgroundDeclaration(deferredLayers, outputFormat),
    [deferredLayers, outputFormat]
  )
  const serializedConfig = useMemo(
    () => serializeGradientConfig(layers),
    [layers]
  )
  const svgMarkup = useMemo(
    () =>
      createGradientSvgMarkup(layers, outputFormat, exportWidth, exportHeight),
    [exportHeight, exportWidth, layers, outputFormat]
  )
  const cssDownloadUrl = useObjectUrl(
    useMemo(
      () => new Blob([cssOutput + "\n"], { type: "text/css" }),
      [cssOutput]
    )
  )
  const jsonDownloadUrl = useObjectUrl(
    useMemo(
      () => new Blob([serializedConfig + "\n"], { type: "application/json" }),
      [serializedConfig]
    )
  )
  const svgDownloadUrl = useObjectUrl(
    useMemo(() => new Blob([svgMarkup], { type: "image/svg+xml" }), [svgMarkup])
  )

  return {
    backgroundBlendDeclaration,
    backgroundDeclaration,
    backgroundImageDeclaration,
    cssDownloadUrl,
    cssOutput,
    jsonDownloadUrl,
    previewBackgroundImage,
    previewBlendMode,
    serializedConfig,
    svgDownloadUrl,
  }
}

export { useGradientDerived }
