import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref, nextTick } from 'vue'
import { useWebpConversion } from './useWebpConversion'
import { convertImageToWebp } from '../utils/convert-image-to-webp'
import { createWebpZip } from '../utils/create-webp-zip'
import type { WebpConversionResult } from '../types'

vi.mock('../utils/convert-image-to-webp', () => ({
  convertImageToWebp: vi.fn(),
}))

vi.mock('../utils/create-webp-zip', () => ({
  createWebpZip: vi.fn(),
}))

const mockedConvert = vi.mocked(convertImageToWebp)
const mockedZip = vi.mocked(createWebpZip)

const messageMock = {
  success: vi.fn(),
  error: vi.fn(),
}

const messages = {
  convertSuccess: () => 'convert-success',
  convertFailed: () => 'convert-failed',
  partialFailed: (count: number) => `partial-failed-${count}`,
  zipFailed: () => 'zip-failed',
  invalidImage: () => 'invalid-image',
  canvasUnavailable: () => 'canvas-unavailable',
}

type TriState = 'default' | 'on' | 'off'

type Overrides = Partial<{
  files: File[]
  scale: number
  quality: number
  method: number
  lossless: boolean
  advancedEnabled: boolean
  targetSize: number | null
  targetPsnr: number | null
  nearLossless: number | null
  alphaQuality: number | null
  snsStrength: number | null
  filterStrength: number | null
  filterSharpness: number | null
  filterType: number | null
  partitions: number | null
  segments: number | null
  passCount: number | null
  exactMode: TriState
  sharpYuvMode: TriState
}>

function buildOptions(overrides: Overrides = {}) {
  const files = ref(overrides.files ?? [])
  const scale = ref(overrides.scale ?? 100)
  const quality = ref(overrides.quality ?? 80)
  const method = ref(overrides.method ?? 4)
  const lossless = ref(overrides.lossless ?? false)
  const advancedEnabled = ref(overrides.advancedEnabled ?? false)
  const targetSize = ref<number | null>(overrides.targetSize ?? null)
  const targetPsnr = ref<number | null>(overrides.targetPsnr ?? null)
  const nearLossless = ref<number | null>(overrides.nearLossless ?? null)
  const alphaQuality = ref<number | null>(overrides.alphaQuality ?? null)
  const snsStrength = ref<number | null>(overrides.snsStrength ?? null)
  const filterStrength = ref<number | null>(overrides.filterStrength ?? null)
  const filterSharpness = ref<number | null>(overrides.filterSharpness ?? null)
  const filterType = ref<number | null>(overrides.filterType ?? null)
  const partitions = ref<number | null>(overrides.partitions ?? null)
  const segments = ref<number | null>(overrides.segments ?? null)
  const passCount = ref<number | null>(overrides.passCount ?? null)
  const exactMode = ref<TriState>(overrides.exactMode ?? 'default')
  const sharpYuvMode = ref<TriState>(overrides.sharpYuvMode ?? 'default')

  return {
    files,
    scale,
    quality,
    method,
    lossless,
    advancedEnabled,
    targetSize,
    targetPsnr,
    nearLossless,
    alphaQuality,
    snsStrength,
    filterStrength,
    filterSharpness,
    filterType,
    partitions,
    segments,
    passCount,
    exactMode,
    sharpYuvMode,
  }
}

function makeResult(
  file: File,
  outputName: string,
  blob = new Blob(['webp'], { type: 'image/webp' }),
): WebpConversionResult {
  return {
    file,
    blob,
    outputName,
    originalWidth: 10,
    originalHeight: 8,
    outputWidth: 10,
    outputHeight: 8,
  }
}

beforeEach(() => {
  mockedConvert.mockReset()
  mockedZip.mockReset()
  messageMock.success.mockClear()
  messageMock.error.mockClear()
})

describe('useWebpConversion', () => {
  it('builds advanced options and unique output names', async () => {
    const files = [
      new File(['a'], 'photo.png', { type: 'image/png' }),
      new File(['b'], 'photo.png', { type: 'image/png' }),
    ]

    const refs = buildOptions({
      files,
      advancedEnabled: true,
      targetSize: 1.2,
      targetPsnr: 42,
      nearLossless: 60,
      alphaQuality: 80,
      snsStrength: 50,
      filterStrength: 20,
      filterSharpness: 2,
      filterType: 1,
      partitions: 2,
      segments: 3,
      passCount: 4,
      exactMode: 'on',
      sharpYuvMode: 'off',
    })

    mockedConvert.mockImplementation(async (file, _options, outputName) => {
      return makeResult(file, outputName)
    })
    mockedZip.mockResolvedValueOnce(new Blob(['zip']))

    const conversion = useWebpConversion({
      ...refs,
      messages,
      message: messageMock,
    })

    await conversion.convertImages()

    expect(mockedConvert).toHaveBeenCalledWith(
      files[0],
      expect.objectContaining({
        scale: 100,
        quality: 80,
        method: 4,
        lossless: false,
        targetSize: 1229,
        targetPsnr: 42,
        nearLossless: 60,
        alphaQuality: 80,
        snsStrength: 50,
        filterStrength: 20,
        filterSharpness: 2,
        filterType: 1,
        partitions: 2,
        segments: 3,
        pass: 4,
        exact: true,
        useSharpYuv: false,
      }),
      'photo.webp',
    )
    expect(mockedConvert).toHaveBeenCalledWith(files[1], expect.any(Object), 'photo-2.webp')
  })

  it('reports invalid image errors', async () => {
    const refs = buildOptions({
      files: [new File(['bad'], 'bad.png', { type: 'image/png' })],
    })

    mockedConvert.mockRejectedValueOnce(new Error('INVALID_IMAGE'))

    const conversion = useWebpConversion({
      ...refs,
      messages,
      message: messageMock,
    })

    await conversion.convertImages()

    expect(conversion.results.value).toHaveLength(0)
    expect(conversion.error.value).toBe('invalid-image')
    expect(messageMock.error).toHaveBeenCalledWith('invalid-image')
    expect(messageMock.success).not.toHaveBeenCalled()
  })

  it('handles partial failures', async () => {
    const files = [
      new File(['ok'], 'ok.png', { type: 'image/png' }),
      new File(['bad'], 'bad.png', { type: 'image/png' }),
    ]
    const refs = buildOptions({ files })

    mockedConvert
      .mockResolvedValueOnce(makeResult(files[0]!, 'ok.webp'))
      .mockRejectedValueOnce(new Error('CANVAS_CONTEXT_UNAVAILABLE'))

    const conversion = useWebpConversion({
      ...refs,
      messages,
      message: messageMock,
    })

    await conversion.convertImages()

    expect(conversion.results.value).toHaveLength(1)
    expect(conversion.error.value).toBe('partial-failed-1')
    expect(messageMock.error).toHaveBeenCalledWith('partial-failed-1')
    expect(messageMock.success).not.toHaveBeenCalled()
  })

  it('surfaces zip failures and continues', async () => {
    const files = [
      new File(['a'], 'a.png', { type: 'image/png' }),
      new File(['b'], 'b.png', { type: 'image/png' }),
    ]
    const refs = buildOptions({ files })

    mockedConvert
      .mockResolvedValueOnce(makeResult(files[0]!, 'a.webp'))
      .mockResolvedValueOnce(makeResult(files[1]!, 'b.webp'))
    mockedZip.mockRejectedValueOnce(new Error('ZIP_FAIL'))

    const conversion = useWebpConversion({
      ...refs,
      messages,
      message: messageMock,
    })

    await conversion.convertImages()

    expect(conversion.error.value).toBe('zip-failed')
    expect(messageMock.error).toHaveBeenCalledWith('zip-failed')
    expect(messageMock.success).toHaveBeenCalledWith('convert-success')
    expect(conversion.isZipping.value).toBe(false)
  })

  it('resets results when options change', async () => {
    const refs = buildOptions({ files: [new File(['a'], 'a.png', { type: 'image/png' })] })

    mockedConvert.mockResolvedValueOnce(makeResult(refs.files.value[0]!, 'a.webp'))

    const conversion = useWebpConversion({
      ...refs,
      messages,
      message: messageMock,
    })

    await conversion.convertImages()
    expect(conversion.results.value).toHaveLength(1)

    refs.scale.value = 90
    await nextTick()

    expect(conversion.results.value).toHaveLength(0)
    expect(conversion.zipBlob.value).toBeNull()
    expect(conversion.error.value).toBe('')
    expect(conversion.isConverting.value).toBe(false)
    expect(conversion.isZipping.value).toBe(false)
  })

  it('toggles canConvert during conversion', async () => {
    const refs = buildOptions({ files: [new File(['a'], 'a.png', { type: 'image/png' })] })

    let resolveConvert!: (value: WebpConversionResult) => void
    mockedConvert.mockImplementation(
      () =>
        new Promise<WebpConversionResult>((resolve) => {
          resolveConvert = resolve
        }),
    )

    const conversion = useWebpConversion({
      ...refs,
      messages,
      message: messageMock,
    })

    const promise = conversion.convertImages()

    expect(conversion.isConverting.value).toBe(true)
    expect(conversion.canConvert.value).toBe(false)

    resolveConvert(makeResult(refs.files.value[0]!, 'a.webp'))
    await promise

    expect(conversion.isConverting.value).toBe(false)
    expect(conversion.canConvert.value).toBe(true)
  })
})
