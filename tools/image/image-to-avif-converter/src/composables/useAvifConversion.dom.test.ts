import { describe, expect, it, vi, beforeEach } from 'vitest'
import { nextTick, ref } from 'vue'
import { useAvifConversion } from './useAvifConversion'

const convertImageToAvifMock = vi.hoisted(() => vi.fn())
const createAvifZipMock = vi.hoisted(() => vi.fn())

vi.mock('../utils/convert-image-to-avif', () => ({
  convertImageToAvif: convertImageToAvifMock,
}))

vi.mock('../utils/create-avif-zip', () => ({
  createAvifZip: createAvifZipMock,
}))

function createHarness() {
  const files = ref<File[]>([])
  const scale = ref(100)
  const quality = ref(75)
  const speed = ref(6)
  const lossless = ref(false)
  const advancedEnabled = ref(false)
  const alphaQuality = ref<number | null>(null)
  const denoiseLevel = ref<number | null>(null)
  const sharpness = ref<number | null>(null)
  const subsample = ref<'420' | '422' | '444' | null>(null)
  const tune = ref<'auto' | 'psnr' | 'ssim' | null>(null)
  const enableSharpYuv = ref(false)
  const message = {
    success: vi.fn(),
    error: vi.fn(),
  }
  const messages = {
    convertSuccess: () => 'success',
    convertFailed: () => 'failed',
    partialFailed: (count: number) => `partial:${count}`,
    zipFailed: () => 'zip-failed',
    invalidImage: () => 'invalid-image',
    canvasUnavailable: () => 'canvas-unavailable',
  }

  const state = useAvifConversion({
    files,
    scale,
    quality,
    speed,
    lossless,
    advancedEnabled,
    alphaQuality,
    denoiseLevel,
    sharpness,
    subsample,
    tune,
    enableSharpYuv,
    message,
    messages,
  })

  return {
    files,
    scale,
    quality,
    speed,
    lossless,
    advancedEnabled,
    alphaQuality,
    denoiseLevel,
    sharpness,
    subsample,
    tune,
    enableSharpYuv,
    message,
    messages,
    state,
  }
}

function createResult(name: string) {
  return {
    file: new File(['source'], `${name}.png`, { type: 'image/png' }),
    blob: new Blob(['encoded'], { type: 'image/avif' }),
    outputName: `${name}.avif`,
    originalWidth: 100,
    originalHeight: 50,
    outputWidth: 100,
    outputHeight: 50,
  }
}

function createDeferred<T>() {
  let resolve!: (value: T) => void
  let reject!: (reason?: unknown) => void

  const promise = new Promise<T>((nextResolve, nextReject) => {
    resolve = nextResolve
    reject = nextReject
  })

  return {
    promise,
    resolve,
    reject,
  }
}

describe('useAvifConversion', () => {
  beforeEach(() => {
    convertImageToAvifMock.mockReset()
    createAvifZipMock.mockReset()
  })

  it('converts files, maps advanced options, and builds a zip for batches', async () => {
    const harness = createHarness()
    harness.files.value = [
      new File(['a'], 'image.png', { type: 'image/png' }),
      new File(['b'], 'image.jpg', { type: 'image/jpeg' }),
    ]
    harness.advancedEnabled.value = true
    harness.alphaQuality.value = 88
    harness.denoiseLevel.value = 2
    harness.sharpness.value = 1
    harness.subsample.value = '444'
    harness.tune.value = 'psnr'
    harness.enableSharpYuv.value = true

    await nextTick()

    convertImageToAvifMock
      .mockResolvedValueOnce(createResult('one'))
      .mockResolvedValueOnce(createResult('two'))
    createAvifZipMock.mockResolvedValueOnce(new Blob(['zip']))

    await harness.state.convertImages()

    expect(convertImageToAvifMock).toHaveBeenNthCalledWith(
      1,
      harness.files.value[0],
      {
        scale: 100,
        quality: 75,
        speed: 6,
        lossless: false,
        alphaQuality: 88,
        denoiseLevel: 2,
        sharpness: 1,
        subsample: '444',
        tune: 'psnr',
        enableSharpYuv: true,
      },
      'image.avif',
    )
    expect(convertImageToAvifMock).toHaveBeenNthCalledWith(
      2,
      harness.files.value[1],
      expect.objectContaining({
        scale: 100,
        quality: 75,
        speed: 6,
        lossless: false,
      }),
      'image-2.avif',
    )
    expect(harness.state.results.value).toHaveLength(2)
    expect(harness.state.zipBlob.value).toBeInstanceOf(Blob)
    expect(harness.message.success).toHaveBeenCalledWith('success')
  })

  it('updates canConvert as files are added and a conversion is in flight', async () => {
    const harness = createHarness()

    expect(harness.state.canConvert.value).toBe(false)

    harness.files.value = [new File(['a'], 'one.png', { type: 'image/png' })]
    await nextTick()

    expect(harness.state.canConvert.value).toBe(true)

    const deferredConversion = createDeferred<ReturnType<typeof createResult>>()
    convertImageToAvifMock.mockImplementationOnce(() => deferredConversion.promise)

    const pendingConversion = harness.state.convertImages()
    expect(harness.state.canConvert.value).toBe(false)

    deferredConversion.resolve(createResult('one'))
    await pendingConversion

    expect(harness.state.canConvert.value).toBe(true)
  })

  it('reports success for a completed single-file conversion', async () => {
    const harness = createHarness()
    harness.files.value = [new File(['a'], 'one.png', { type: 'image/png' })]

    await nextTick()

    convertImageToAvifMock.mockResolvedValueOnce(createResult('one'))

    await harness.state.convertImages()

    expect(harness.state.results.value).toHaveLength(1)
    expect(harness.state.zipBlob.value).toBeNull()
    expect(harness.message.success).toHaveBeenCalledWith('success')
  })

  it('surfaces partial failures and preserves successful results', async () => {
    const harness = createHarness()
    harness.files.value = [
      new File(['a'], 'one.png', { type: 'image/png' }),
      new File(['b'], 'two.png', { type: 'image/png' }),
    ]

    await nextTick()

    convertImageToAvifMock
      .mockResolvedValueOnce(createResult('one'))
      .mockRejectedValueOnce(new Error('INVALID_IMAGE'))
    createAvifZipMock.mockResolvedValueOnce(new Blob(['zip']))

    await harness.state.convertImages()

    expect(harness.state.results.value).toHaveLength(1)
    expect(harness.state.error.value).toBe('partial:1')
    expect(harness.message.error).toHaveBeenCalledWith('partial:1')
  })

  it('reports total failures and zip failures', async () => {
    const harness = createHarness()
    harness.files.value = [
      new File(['a'], 'one.png', { type: 'image/png' }),
      new File(['b'], 'two.png', { type: 'image/png' }),
    ]

    await nextTick()

    convertImageToAvifMock
      .mockResolvedValueOnce(createResult('one'))
      .mockResolvedValueOnce(createResult('two'))
    createAvifZipMock.mockRejectedValueOnce(new Error('boom'))

    await harness.state.convertImages()

    expect(harness.state.error.value).toBe('zip-failed')
    expect(harness.message.error).toHaveBeenCalledWith('zip-failed')
  })

  it('uses the first resolved error message for total failures', async () => {
    const harness = createHarness()
    harness.files.value = [new File(['a'], 'one.png', { type: 'image/png' })]

    await nextTick()

    convertImageToAvifMock.mockRejectedValueOnce(new Error('CANVAS_CONTEXT_UNAVAILABLE'))

    await harness.state.convertImages()

    expect(harness.state.error.value).toBe('canvas-unavailable')
    expect(harness.message.error).toHaveBeenCalledWith('canvas-unavailable')
    expect(harness.state.isConverting.value).toBe(false)
  })

  it('falls back to the generic error when the rejection is not an Error', async () => {
    const harness = createHarness()
    harness.files.value = [new File(['a'], 'one.png', { type: 'image/png' })]

    await nextTick()

    convertImageToAvifMock.mockRejectedValueOnce('boom')

    await harness.state.convertImages()

    expect(harness.state.error.value).toBe('failed')
    expect(harness.message.error).toHaveBeenCalledWith('failed')
  })

  it('uses the generic failure message for unknown Error codes', async () => {
    const harness = createHarness()
    harness.files.value = [new File(['a'], 'one.png', { type: 'image/png' })]

    await nextTick()

    convertImageToAvifMock.mockRejectedValueOnce(new Error('SOMETHING_ELSE'))

    await harness.state.convertImages()

    expect(harness.state.error.value).toBe('failed')
    expect(harness.message.error).toHaveBeenCalledWith('failed')
  })

  it('falls back to the default image basename when a file has no stem', async () => {
    const harness = createHarness()
    harness.files.value = [new File(['a'], '.png', { type: 'image/png' })]

    await nextTick()

    convertImageToAvifMock.mockResolvedValueOnce(createResult('image'))

    await harness.state.convertImages()

    expect(convertImageToAvifMock).toHaveBeenCalledWith(
      harness.files.value[0],
      {
        scale: 100,
        quality: 75,
        speed: 6,
        lossless: false,
      },
      'image.avif',
    )
  })

  it('resets derived state when inputs change', async () => {
    const harness = createHarness()
    harness.state.results.value = [createResult('one')]
    harness.state.zipBlob.value = new Blob(['zip'])
    harness.state.error.value = 'boom'

    harness.quality.value = 90
    await nextTick()

    expect(harness.state.results.value).toEqual([])
    expect(harness.state.zipBlob.value).toBeNull()
    expect(harness.state.error.value).toBe('')
  })

  it('prevents duplicate runs while converting', async () => {
    const harness = createHarness()
    harness.files.value = [new File(['a'], 'one.png', { type: 'image/png' })]

    await nextTick()

    const deferredConversion = createDeferred<ReturnType<typeof createResult>>()
    convertImageToAvifMock.mockImplementationOnce(() => deferredConversion.promise)

    const firstRun = harness.state.convertImages()
    const secondRun = harness.state.convertImages()

    expect(convertImageToAvifMock).toHaveBeenCalledTimes(1)

    deferredConversion.resolve(createResult('one'))
    await Promise.all([firstRun, secondRun])
  })

  it('skips invalid advanced values and ignores stale conversion results', async () => {
    const harness = createHarness()
    harness.files.value = [new File(['a'], 'one.png', { type: 'image/png' })]
    harness.advancedEnabled.value = true
    harness.alphaQuality.value = Number.NaN
    harness.denoiseLevel.value = Number.POSITIVE_INFINITY
    harness.sharpness.value = null

    await nextTick()

    const deferredConversion = createDeferred<ReturnType<typeof createResult>>()
    convertImageToAvifMock.mockImplementationOnce(() => deferredConversion.promise)

    const conversionPromise = harness.state.convertImages()
    harness.quality.value = 80
    await nextTick()

    deferredConversion.resolve(createResult('one'))
    await conversionPromise

    expect(convertImageToAvifMock).toHaveBeenCalledWith(
      harness.files.value[0],
      {
        scale: 100,
        quality: 75,
        speed: 6,
        lossless: false,
      },
      'one.avif',
    )
    expect(harness.state.results.value).toEqual([])
    expect(harness.state.zipBlob.value).toBeNull()
    expect(harness.state.error.value).toBe('')
    expect(harness.state.isConverting.value).toBe(false)
  })

  it('drops results when the run becomes stale after the final conversion resolves', async () => {
    const harness = createHarness()
    harness.files.value = [
      new File(['a'], 'one.png', { type: 'image/png' }),
      new File(['b'], 'two.png', { type: 'image/png' }),
    ]

    await nextTick()

    convertImageToAvifMock
      .mockResolvedValueOnce(createResult('one'))
      .mockImplementationOnce(async () => {
        harness.quality.value = 80
        await nextTick()
        return createResult('two')
      })

    await harness.state.convertImages()

    expect(harness.state.results.value).toEqual([])
    expect(harness.state.zipBlob.value).toBeNull()
    expect(harness.state.error.value).toBe('')
  })

  it('ignores stale ZIP results after the inputs change', async () => {
    const harness = createHarness()
    harness.files.value = [
      new File(['a'], 'one.png', { type: 'image/png' }),
      new File(['b'], 'two.png', { type: 'image/png' }),
    ]

    await nextTick()

    convertImageToAvifMock
      .mockResolvedValueOnce(createResult('one'))
      .mockResolvedValueOnce(createResult('two'))

    const deferredZip = createDeferred<Blob>()
    createAvifZipMock.mockImplementationOnce(() => deferredZip.promise)

    const conversionPromise = harness.state.convertImages()
    await nextTick()

    harness.quality.value = 80
    await nextTick()

    deferredZip.resolve(new Blob(['zip']))
    await conversionPromise

    expect(harness.state.results.value).toEqual([])
    expect(harness.state.zipBlob.value).toBeNull()
    expect(harness.state.error.value).toBe('')
    expect(harness.state.isConverting.value).toBe(false)
    expect(harness.state.isZipping.value).toBe(false)
  })

  it('ignores stale ZIP failures after the inputs change', async () => {
    const harness = createHarness()
    harness.files.value = [
      new File(['a'], 'one.png', { type: 'image/png' }),
      new File(['b'], 'two.png', { type: 'image/png' }),
    ]

    await nextTick()

    convertImageToAvifMock
      .mockResolvedValueOnce(createResult('one'))
      .mockResolvedValueOnce(createResult('two'))

    const deferredZip = createDeferred<Blob>()
    createAvifZipMock.mockImplementationOnce(() => deferredZip.promise)

    const conversionPromise = harness.state.convertImages()
    await nextTick()

    harness.quality.value = 80
    await nextTick()

    deferredZip.reject(new Error('zip failed'))
    await conversionPromise

    expect(harness.state.results.value).toEqual([])
    expect(harness.state.zipBlob.value).toBeNull()
    expect(harness.state.error.value).toBe('')
    expect(harness.message.error).not.toHaveBeenCalledWith('zip-failed')
  })
})
