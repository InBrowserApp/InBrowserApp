import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { computed, defineComponent, nextTick } from 'vue'
import { useImageToPdfConverter } from './useImageToPdfConverter'

const objectUrlState = {
  value: 'blob:download',
}

const imageFileMocks = vi.hoisted(() => ({
  getFileSignatureMock: vi.fn<(file: File) => string>(),
  readImageDimensionsMock: vi.fn<(file: File) => Promise<{ width: number; height: number }>>(),
}))

const imageToPdfMocks = vi.hoisted(() => ({
  createImageToPdfMock:
    vi.fn<
      (payload: {
        items: unknown[]
        options: unknown
        onProgress?: (progress: { completed: number; total: number }) => void
      }) => Promise<Blob>
    >(),
}))

vi.mock('@vueuse/core', async () => {
  const actual = await vi.importActual<typeof import('@vueuse/core')>('@vueuse/core')

  return {
    ...actual,
    useObjectUrl: (source: { value: Blob | null }) =>
      computed(() => (source.value ? objectUrlState.value : null)),
  }
})

vi.mock('../utils/image-file', () => ({
  getFileSignature: (file: File) => imageFileMocks.getFileSignatureMock(file),
  readImageDimensions: (file: File) => imageFileMocks.readImageDimensionsMock(file),
}))

vi.mock('../utils/image-to-pdf', () => ({
  createImageToPdf: (payload: {
    items: unknown[]
    options: unknown
    onProgress?: (progress: { completed: number; total: number }) => void
  }) => imageToPdfMocks.createImageToPdfMock(payload),
  getOutputFileName: (items: Array<{ name: string }>) => {
    if (items.length === 1) {
      return `${items[0]?.name.replace(/\.[^.]+$/, '') || 'images'}.pdf`
    }

    if (items.length > 1) {
      return `images-${items.length}-pages.pdf`
    }

    return 'images.pdf'
  },
}))

const Harness = defineComponent({
  name: 'UseImageToPdfConverterHarness',
  setup() {
    latestHarnessState = useImageToPdfConverter()
    return () => null
  },
})

type HarnessVm = ReturnType<typeof useImageToPdfConverter>
let latestHarnessState: HarnessVm | null = null

describe('useImageToPdfConverter', () => {
  const createObjectUrlMock = vi.spyOn(URL, 'createObjectURL')
  const revokeObjectUrlMock = vi.spyOn(URL, 'revokeObjectURL')
  let objectUrlCounter = 0

  beforeEach(() => {
    objectUrlCounter = 0
    objectUrlState.value = 'blob:download'
    imageFileMocks.getFileSignatureMock.mockReset()
    imageFileMocks.getFileSignatureMock.mockImplementation(
      (file) => `${file.name}-${file.size}-${file.lastModified}`,
    )
    imageFileMocks.readImageDimensionsMock.mockReset()
    imageFileMocks.readImageDimensionsMock.mockResolvedValue({ width: 1200, height: 800 })
    imageToPdfMocks.createImageToPdfMock.mockReset()
    imageToPdfMocks.createImageToPdfMock.mockImplementation(async (payload) => {
      payload.onProgress?.({
        completed: payload.items.length,
        total: payload.items.length,
      })

      return new Blob(['pdf'], { type: 'application/pdf' })
    })

    createObjectUrlMock.mockImplementation(() => {
      objectUrlCounter += 1
      return `blob:preview-${objectUrlCounter}`
    })
    revokeObjectUrlMock.mockImplementation(() => {})
  })

  it('adds files, prevents duplicates, blocks concurrent duplicates, and derives the download filename', async () => {
    mount(Harness)
    const vm = latestHarnessState
    const image = createFile('receipt.jpg')

    if (!vm) {
      throw new Error('Expected harness state to be initialized')
    }

    const dimensionsDeferred = createDeferred<{ width: number; height: number }>()
    imageFileMocks.readImageDimensionsMock.mockReturnValueOnce(dimensionsDeferred.promise)

    const firstAddPromise = vm.addFile(image)
    const secondAddPromise = vm.addFile(image)

    expect(vm.isAddingFile.value).toBe(true)

    dimensionsDeferred.resolve({ width: 1200, height: 800 })

    await expect(firstAddPromise).resolves.toBe('added')
    await expect(secondAddPromise).resolves.toBe('duplicate')
    await expect(vm.addFile(image)).resolves.toBe('duplicate')

    expect(vm.items.value).toHaveLength(1)
    expect(vm.resultFilename.value).toBe('receipt.pdf')
    expect(vm.isAddingFile.value).toBe(false)
  })

  it('cancels pending additions after clearing the queue and blocks generation while files are still loading', async () => {
    mount(Harness)
    const vm = latestHarnessState

    if (!vm) {
      throw new Error('Expected harness state to be initialized')
    }

    await vm.addFile(createFile('one.jpg'))

    const dimensionsDeferred = createDeferred<{ width: number; height: number }>()
    imageFileMocks.readImageDimensionsMock.mockReturnValueOnce(dimensionsDeferred.promise)

    const pendingAddPromise = vm.addFile(createFile('two.jpg'))

    expect(vm.isAddingFile.value).toBe(true)
    expect(vm.canGenerate.value).toBe(false)
    await expect(vm.generate()).resolves.toEqual({ success: false, code: 'cancelled' })
    expect(imageToPdfMocks.createImageToPdfMock).not.toHaveBeenCalled()

    vm.clearAll()
    expect(vm.items.value).toHaveLength(0)

    dimensionsDeferred.resolve({ width: 1200, height: 800 })

    await expect(pendingAddPromise).resolves.toBe('cancelled')
    expect(vm.items.value).toHaveLength(0)
    expect(vm.isAddingFile.value).toBe(false)
  })

  it('rotates, reorders, and removes queue items', async () => {
    mount(Harness)
    const vm = latestHarnessState

    if (!vm) {
      throw new Error('Expected harness state to be initialized')
    }

    await vm.addFile(createFile('one.jpg'))
    await vm.addFile(createFile('two.jpg'))

    expect(vm.resultFilename.value).toBe('images-2-pages.pdf')

    const firstId = vm.items.value[0]?.id
    const secondId = vm.items.value[1]?.id

    if (!firstId || !secondId) {
      throw new Error('Expected queue items to exist')
    }

    vm.rotateItem(firstId)
    expect(vm.items.value[0]?.rotation).toBe(90)

    vm.moveItem(0, 1)
    expect(vm.items.value[0]?.name).toBe('two.jpg')

    vm.removeItem(secondId)
    expect(vm.items.value).toHaveLength(1)
    expect(revokeObjectUrlMock).toHaveBeenCalledWith('blob:preview-2')
  })

  it('generates a PDF result, clears stale state, and revokes preview urls on unmount', async () => {
    const wrapper = mount(Harness)
    const vm = latestHarnessState

    if (!vm) {
      throw new Error('Expected harness state to be initialized')
    }

    await vm.addFile(createFile('scan.jpg'))

    const generateResult = await vm.generate()

    expect(generateResult).toEqual({ success: true })
    expect(imageToPdfMocks.createImageToPdfMock).toHaveBeenCalledTimes(1)
    expect(vm.generationProgress.value).toBeNull()
    expect(vm.resultBlob.value?.type).toBe('application/pdf')
    expect(vm.resultFilename.value).toBe('scan.pdf')
    expect(vm.resultUrl.value).toBe('blob:download')

    vm.options.value = {
      ...vm.options.value,
      marginMm: 24,
    }
    await nextTick()
    expect(vm.resultBlob.value).toBeNull()
    expect(vm.generationProgress.value).toBeNull()

    imageToPdfMocks.createImageToPdfMock.mockRejectedValueOnce(new Error('CANVAS_UNAVAILABLE'))

    const failedGenerateResult = await vm.generate()

    expect(failedGenerateResult).toEqual({ success: false, code: 'canvas-unavailable' })
    expect(vm.resultBlob.value).toBeNull()
    expect(vm.generationProgress.value).toBeNull()

    wrapper.unmount()

    expect(revokeObjectUrlMock).toHaveBeenCalledWith('blob:preview-1')
  })

  it('drops a stale generation result after the queue changes mid-export', async () => {
    mount(Harness)
    const vm = latestHarnessState

    if (!vm) {
      throw new Error('Expected harness state to be initialized')
    }

    await vm.addFile(createFile('scan.jpg'))

    const pdfDeferred = createDeferred<Blob>()
    imageToPdfMocks.createImageToPdfMock.mockImplementationOnce(async (payload) => {
      payload.onProgress?.({
        completed: payload.items.length,
        total: payload.items.length,
      })

      return await pdfDeferred.promise
    })

    const generatePromise = vm.generate()

    expect(vm.isGenerating.value).toBe(true)
    vm.clearAll()
    expect(vm.resultBlob.value).toBeNull()

    pdfDeferred.resolve(new Blob(['pdf'], { type: 'application/pdf' }))

    await expect(generatePromise).resolves.toEqual({ success: false, code: 'cancelled' })
    expect(vm.isGenerating.value).toBe(false)
    expect(vm.resultBlob.value).toBeNull()
    expect(vm.resultFilename.value).toBe('images.pdf')
    expect(vm.resultPageCount.value).toBe(0)
  })
})

function createFile(name: string) {
  return new File(['image'], name, {
    type: 'image/jpeg',
    lastModified: 100,
  })
}

function createDeferred<Value>() {
  let resolve!: (value: Value) => void
  let reject!: (reason?: unknown) => void
  const promise = new Promise<Value>((resolvePromise, rejectPromise) => {
    resolve = resolvePromise
    reject = rejectPromise
  })

  return {
    promise,
    resolve,
    reject,
  }
}
