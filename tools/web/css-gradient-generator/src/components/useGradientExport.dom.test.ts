import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { isRef, ref } from 'vue'
import { useGradientExport } from './useGradientExport'
import type { GradientLayer } from '../types'

const gradientMocks = vi.hoisted(() => ({
  createBackgroundImage: vi.fn(() => 'linear-gradient(#000,#fff)'),
  createBlendModeCss: vi.fn(() => ''),
  drawLayersToCanvas: vi.fn(() => true),
}))

vi.mock('@vueuse/core', async () => {
  const actual = await vi.importActual<typeof import('@vueuse/core')>('@vueuse/core')
  const { ref, watchEffect, isRef } = await import('vue')

  return {
    ...actual,
    useObjectUrl: (source: unknown) => {
      const url = ref<string | undefined>(undefined)
      watchEffect(() => {
        let value: unknown
        if (isRef(source)) {
          value = source.value
        } else {
          value = source
        }
        url.value = value ? 'blob:mock' : undefined
      })
      return url
    },
  }
})

vi.mock('../utils/gradient', () => ({
  createBackgroundImage: gradientMocks.createBackgroundImage,
  createBlendModeCss: gradientMocks.createBlendModeCss,
  drawLayersToCanvas: gradientMocks.drawLayersToCanvas,
}))

const createLayer = (): GradientLayer =>
  ({
    id: 'layer-1',
    type: 'linear',
    angle: 90,
    centerX: 50,
    centerY: 50,
    shape: 'ellipse',
    sizeKeyword: 'farthest-corner',
    sizeX: 100,
    sizeY: 100,
    blendMode: 'normal',
    colorSpace: 'srgb',
    interpolationMethod: 'shorter',
    stops: [
      { id: 'stop-1', color: '#000000FF', position: 0 },
      { id: 'stop-2', color: '#FFFFFFFF', position: 100 },
    ],
  }) as unknown as GradientLayer

describe('useGradientExport', () => {
  beforeEach(() => {
    gradientMocks.createBackgroundImage.mockReset()
    gradientMocks.createBlendModeCss.mockReset()
    gradientMocks.drawLayersToCanvas.mockReset()

    gradientMocks.createBackgroundImage.mockReturnValue('linear-gradient(#000,#fff)')
    gradientMocks.createBlendModeCss.mockReturnValue('')
    gradientMocks.drawLayersToCanvas.mockReturnValue(true)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('uses fallback dimensions and skips anchor clicks for non-anchor targets', async () => {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(
      {} as CanvasRenderingContext2D,
    )
    vi.spyOn(HTMLCanvasElement.prototype, 'toBlob').mockImplementation((callback: BlobCallback) =>
      callback(new Blob(['png'])),
    )

    const layers = ref([createLayer()])
    const outputFormat = ref<'hex'>('hex')
    const exporter = useGradientExport(layers, outputFormat)
    exporter.exportWidth.value = Number.NaN
    exporter.exportHeight.value = Number.POSITIVE_INFINITY

    const preventDefault = vi.fn()
    await exporter.handlePngDownload({
      preventDefault,
      currentTarget: document.createElement('button'),
    } as unknown as MouseEvent)

    expect(preventDefault).toHaveBeenCalledOnce()
    expect(gradientMocks.drawLayersToCanvas).toHaveBeenCalledWith(
      expect.anything(),
      layers.value,
      1200,
      800,
    )
    expect(exporter.showExportError.value).toBe(false)
    expect(exporter.isExportingPng.value).toBe(false)
  })

  it('shows an export error when the canvas context is unavailable', async () => {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null)

    const layers = ref([createLayer()])
    const exporter = useGradientExport(layers, ref<'hex'>('hex'))

    await exporter.handlePngDownload({
      preventDefault: vi.fn(),
      currentTarget: document.createElement('a'),
    } as unknown as MouseEvent)

    expect(exporter.showExportError.value).toBe(true)
    expect(gradientMocks.drawLayersToCanvas).not.toHaveBeenCalled()
  })

  it('shows an export error when layer rendering fails', async () => {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(
      {} as CanvasRenderingContext2D,
    )
    gradientMocks.drawLayersToCanvas.mockReturnValue(false)

    const layers = ref([createLayer()])
    const exporter = useGradientExport(layers, ref<'hex'>('hex'))

    await exporter.handlePngDownload({
      preventDefault: vi.fn(),
      currentTarget: document.createElement('a'),
    } as unknown as MouseEvent)

    expect(exporter.showExportError.value).toBe(true)
  })

  it('shows an export error when PNG encoding returns no blob', async () => {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(
      {} as CanvasRenderingContext2D,
    )
    vi.spyOn(HTMLCanvasElement.prototype, 'toBlob').mockImplementation((callback: BlobCallback) =>
      callback(null),
    )

    const layers = ref([createLayer()])
    const exporter = useGradientExport(layers, ref<'hex'>('hex'))

    await exporter.handlePngDownload({
      preventDefault: vi.fn(),
      currentTarget: document.createElement('a'),
    } as unknown as MouseEvent)

    expect(exporter.showExportError.value).toBe(true)
  })

  it('downloads PNG output on success and guards concurrent export requests', async () => {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(
      {} as CanvasRenderingContext2D,
    )
    vi.spyOn(HTMLCanvasElement.prototype, 'toBlob').mockImplementation((callback: BlobCallback) =>
      callback(new Blob(['png'])),
    )

    const layers = ref([createLayer()])
    const exporter = useGradientExport(layers, ref<'hex'>('hex'))
    const anchor = document.createElement('a')
    const clickSpy = vi.spyOn(anchor, 'click').mockImplementation(() => {})

    await exporter.handlePngDownload({
      preventDefault: vi.fn(),
      currentTarget: anchor,
    } as unknown as MouseEvent)

    expect(anchor.href).toBe('blob:mock')
    expect(clickSpy).toHaveBeenCalledOnce()

    exporter.isExportingPng.value = true
    const preventDefault = vi.fn()
    await exporter.handlePngDownload({
      preventDefault,
      currentTarget: anchor,
    } as unknown as MouseEvent)

    expect(preventDefault).not.toHaveBeenCalled()
  })

  it('generates the svg url from current layers', () => {
    const layers = ref([createLayer()])
    const exporter = useGradientExport(layers, ref<'hex'>('hex'))

    expect(exporter.svgUrl.value).toBe('blob:mock')
    expect(isRef(exporter.pngUrl)).toBe(true)
    expect(gradientMocks.createBackgroundImage).toHaveBeenCalled()
  })
})
