import { computed, nextTick, ref, type Ref } from 'vue'
import { useObjectUrl } from '@vueuse/core'
import type { ColorFormat, GradientLayer } from '../types'
import { createBackgroundImage, createBlendModeCss, drawLayersToCanvas } from '../utils/gradient'

export const useGradientExport = (layers: Ref<GradientLayer[]>, outputFormat: Ref<ColorFormat>) => {
  const exportWidth = ref(1200)
  const exportHeight = ref(800)
  const pngBlob = ref<Blob | null>(null)
  const showExportError = ref(false)
  const isExportingPng = ref(false)

  const getExportSize = () => {
    const width = Number.isFinite(exportWidth.value) ? exportWidth.value : 1200
    const height = Number.isFinite(exportHeight.value) ? exportHeight.value : 800
    return {
      width: Math.max(1, Math.round(width)),
      height: Math.max(1, Math.round(height)),
    }
  }

  const escapeSvgAttribute = (value: string) => value.replace(/&/g, '&amp;').replace(/"/g, '&quot;')

  const createSvgMarkup = (width: number, height: number) => {
    const backgroundImage = createBackgroundImage(layers.value, outputFormat.value)
    const blendMode = createBlendModeCss(layers.value)
    const style = [
      `width:${width}px`,
      `height:${height}px`,
      'background-repeat:no-repeat',
      'background-size:cover',
      `background-image:${backgroundImage}`,
      blendMode ? `background-blend-mode:${blendMode}` : '',
    ]
      .filter(Boolean)
      .join(';')
    const escapedStyle = escapeSvgAttribute(style)
    return (
      `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">` +
      `<foreignObject width="100%" height="100%">` +
      `<div xmlns="http://www.w3.org/1999/xhtml" style="${escapedStyle}"></div>` +
      `</foreignObject></svg>`
    )
  }

  const svgMarkup = computed(() => {
    const { width, height } = getExportSize()
    return createSvgMarkup(width, height)
  })

  const svgBlob = computed(
    () => new Blob([svgMarkup.value], { type: 'image/svg+xml;charset=utf-8' }),
  )

  const pngUrl = useObjectUrl(pngBlob)
  const svgUrl = useObjectUrl(svgBlob)

  const createPngBlob = async () => {
    showExportError.value = false
    const { width, height } = getExportSize()
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      showExportError.value = true
      return null
    }
    const rendered = drawLayersToCanvas(ctx, layers.value, width, height)
    if (!rendered) {
      showExportError.value = true
      return null
    }
    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, 'image/png')
    })
    if (!blob) {
      showExportError.value = true
      return null
    }
    return blob
  }

  const handlePngDownload = async (event: MouseEvent) => {
    if (isExportingPng.value) return
    event.preventDefault()
    const anchor = event.currentTarget instanceof HTMLAnchorElement ? event.currentTarget : null
    isExportingPng.value = true
    try {
      const blob = await createPngBlob()
      if (!blob) return
      pngBlob.value = blob
      await nextTick()
      if (anchor && pngUrl.value) {
        anchor.href = pngUrl.value
        anchor.click()
      }
    } finally {
      isExportingPng.value = false
    }
  }

  return {
    exportWidth,
    exportHeight,
    pngUrl,
    svgUrl,
    isExportingPng,
    showExportError,
    handlePngDownload,
  }
}
