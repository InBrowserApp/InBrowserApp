import { computed, defineComponent, nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { PDF_ERROR } from '../pdf-errors'
import { PAGE_RANGE_ERROR } from '../utils/page-range'

const inspectPdfMock = vi.fn(async (_file: File) => ({ pageCount: 6 }))
vi.mock('../inspect-pdf', () => ({
  inspectPdf: (file: File) => inspectPdfMock(file),
  isPdfFile: (file: File) =>
    file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf'),
}))

const addPageNumbersWithWorkerMock = vi.fn(
  async (_payload: unknown): Promise<unknown> => ({
    ok: true,
    result: {
      file: {
        name: 'output.pdf',
        blob: new Blob(['ok'], { type: 'application/pdf' }),
      },
    },
  }),
)

vi.mock('../add-page-numbers', () => ({
  addPageNumbersWithWorker: (payload: unknown) => addPageNumbersWithWorkerMock(payload),
}))

vi.mock('@vueuse/core', () => ({
  useObjectUrl: (target: { value: Blob | null }) =>
    computed(() => (target.value ? 'blob:mock-result' : null)),
}))

import { usePdfPageNumberAdder } from './usePdfPageNumberAdder'

type HarnessVm = {
  file: File | null
  pageCount: number
  rangeInput: string
  startNumber: number
  fontFamily: 'sans-serif' | 'serif'
  fontSize: number
  marginX: number
  marginY: number
  isLoadingDocument: boolean
  fileErrorCode: string
  rangeErrorCode: string
  generateErrorCode: string
  resultFilename: string
  resultUrl: string | null
  isGenerating: boolean
  canGenerate: boolean
  hasResult: boolean
  setRangeInput: (value: string) => { success: boolean; errorCode?: string }
  setStartNumber: (value: number | null) => void
  setFormat: (value: 'n' | 'n-total') => void
  setFontFamily: (value: 'sans-serif' | 'serif') => void
  setPosition: (
    value:
      | 'top-left'
      | 'top-center'
      | 'top-right'
      | 'bottom-left'
      | 'bottom-center'
      | 'bottom-right',
  ) => void
  setFontSize: (value: number | null) => void
  setMarginX: (value: number | null) => void
  setMarginY: (value: number | null) => void
  clearFile: () => void
  handleUpload: (file: File) => Promise<{ success: boolean; errorCode?: string }>
  generate: () => Promise<{ success: boolean; errorCode?: string }>
}

const Harness = defineComponent({
  setup() {
    return usePdfPageNumberAdder()
  },
  template: '<div />',
})

const flushAll = async () => {
  await Promise.resolve()
  await Promise.resolve()
  await nextTick()
}

const createDeferred = <T>() => {
  let resolve!: (value: T) => void
  let reject!: (reason?: unknown) => void

  const promise = new Promise<T>((nextResolve, nextReject) => {
    resolve = nextResolve
    reject = nextReject
  })

  return { promise, resolve, reject }
}

describe('usePdfPageNumberAdder', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    inspectPdfMock.mockResolvedValue({ pageCount: 6 })
    addPageNumbersWithWorkerMock.mockResolvedValue({
      ok: true,
      result: {
        file: {
          name: 'output.pdf',
          blob: new Blob(['ok'], { type: 'application/pdf' }),
        },
      },
    })
  })

  it('loads pdf and initializes state', async () => {
    const wrapper = mount(Harness)
    const vm = wrapper.vm as unknown as HarnessVm

    expect(vm.fontFamily).toBe('serif')

    const result = await vm.handleUpload(new File(['x'], 'sample.pdf', { type: 'application/pdf' }))
    await flushAll()

    expect(result.success).toBe(true)
    expect(vm.file?.name).toBe('sample.pdf')
    expect(vm.pageCount).toBe(6)
    expect(vm.rangeInput).toBe('')
    expect(vm.canGenerate).toBe(true)
  })

  it('rejects non-pdf upload', async () => {
    const wrapper = mount(Harness)
    const vm = wrapper.vm as unknown as HarnessVm

    const result = await vm.handleUpload(new File(['x'], 'a.txt', { type: 'text/plain' }))

    expect(result.success).toBe(false)
    expect(result.errorCode).toBe(PDF_ERROR.Invalid)
    expect(vm.fileErrorCode).toBe(PDF_ERROR.Invalid)
    expect(vm.file).toBe(null)
  })

  it('validates range input and returns parse error', async () => {
    const wrapper = mount(Harness)
    const vm = wrapper.vm as unknown as HarnessVm

    await vm.handleUpload(new File(['x'], 'sample.pdf', { type: 'application/pdf' }))
    const result = vm.setRangeInput('1-')

    expect(result.success).toBe(false)
    expect(result.errorCode).toBe(PAGE_RANGE_ERROR.InvalidToken)
    expect(vm.rangeErrorCode).toBe(PAGE_RANGE_ERROR.InvalidToken)
    expect(vm.canGenerate).toBe(false)
  })

  it('generates numbered pdf with all pages when range is empty', async () => {
    const wrapper = mount(Harness)
    const vm = wrapper.vm as unknown as HarnessVm

    await vm.handleUpload(new File(['x'], 'sample.pdf', { type: 'application/pdf' }))

    vm.setStartNumber(7)
    vm.setFormat('n-total')
    vm.setFontFamily('serif')
    vm.setPosition('top-right')
    vm.setFontSize(16)
    vm.setMarginX(30)
    vm.setMarginY(40)

    const result = await vm.generate()

    expect(result.success).toBe(true)
    expect(vm.hasResult).toBe(true)
    expect(vm.resultFilename).toBe('output.pdf')
    expect(vm.resultUrl).toBe('blob:mock-result')

    expect(addPageNumbersWithWorkerMock).toHaveBeenCalledWith(
      expect.objectContaining({
        pages: [1, 2, 3, 4, 5, 6],
        startNumber: 7,
        format: 'n-total',
        fontFamily: 'serif',
        position: 'top-right',
        fontSize: 16,
        marginX: 30,
        marginY: 40,
        outputFileName: 'sample-numbered.pdf',
      }),
    )
  })

  it('handles worker error payload', async () => {
    addPageNumbersWithWorkerMock.mockResolvedValueOnce({
      ok: false,
      code: PDF_ERROR.AddFailed,
    })

    const wrapper = mount(Harness)
    const vm = wrapper.vm as unknown as HarnessVm

    await vm.handleUpload(new File(['x'], 'sample.pdf', { type: 'application/pdf' }))
    const result = await vm.generate()

    expect(result.success).toBe(false)
    expect(result.errorCode).toBe(PDF_ERROR.AddFailed)
    expect(vm.generateErrorCode).toBe(PDF_ERROR.AddFailed)
  })

  it('sanitizes number fields and can clear file state', async () => {
    const wrapper = mount(Harness)
    const vm = wrapper.vm as unknown as HarnessVm

    await vm.handleUpload(new File(['x'], 'sample.pdf', { type: 'application/pdf' }))

    vm.setStartNumber(-5)
    vm.setFontSize(null)
    vm.setMarginX(-2)
    vm.setMarginY(null)

    expect(vm.startNumber).toBe(1)
    expect(vm.fontSize).toBe(12)
    expect(vm.marginX).toBe(0)
    expect(vm.marginY).toBe(24)

    vm.clearFile()

    expect(vm.file).toBe(null)
    expect(vm.pageCount).toBe(0)
    expect(vm.hasResult).toBe(false)
    expect(vm.fontFamily).toBe('serif')
  })

  it('maps inspect failures into file error code', async () => {
    inspectPdfMock.mockRejectedValueOnce(new Error(PDF_ERROR.Encrypted))

    const wrapper = mount(Harness)
    const vm = wrapper.vm as unknown as HarnessVm

    const result = await vm.handleUpload(new File(['x'], 'enc.pdf', { type: 'application/pdf' }))

    expect(result.success).toBe(false)
    expect(result.errorCode).toBe(PDF_ERROR.Encrypted)
    expect(vm.fileErrorCode).toBe(PDF_ERROR.Encrypted)
  })

  it('preserves current file and result when replacement upload fails', async () => {
    inspectPdfMock
      .mockResolvedValueOnce({ pageCount: 6 })
      .mockRejectedValueOnce(new Error(PDF_ERROR.Invalid))

    const wrapper = mount(Harness)
    const vm = wrapper.vm as unknown as HarnessVm

    await vm.handleUpload(new File(['x'], 'sample.pdf', { type: 'application/pdf' }))
    await vm.generate()

    const result = await vm.handleUpload(
      new File(['bad'], 'broken.pdf', { type: 'application/pdf' }),
    )

    expect(result.success).toBe(false)
    expect(result.errorCode).toBe(PDF_ERROR.Invalid)
    expect(vm.file?.name).toBe('sample.pdf')
    expect(vm.pageCount).toBe(6)
    expect(vm.hasResult).toBe(true)
    expect(vm.resultFilename).toBe('output.pdf')
    expect(vm.fileErrorCode).toBe(PDF_ERROR.Invalid)
  })

  it('ignores stale upload result after file state is cleared', async () => {
    const deferred = createDeferred<{ pageCount: number }>()
    inspectPdfMock.mockReturnValueOnce(deferred.promise)

    const wrapper = mount(Harness)
    const vm = wrapper.vm as unknown as HarnessVm

    const pendingUpload = vm.handleUpload(
      new File(['slow'], 'slow.pdf', { type: 'application/pdf' }),
    )
    await flushAll()

    expect(vm.isLoadingDocument).toBe(true)

    vm.clearFile()

    expect(vm.file).toBe(null)
    expect(vm.pageCount).toBe(0)
    expect(vm.isLoadingDocument).toBe(false)

    deferred.resolve({ pageCount: 4 })

    const result = await pendingUpload
    await flushAll()

    expect(result.success).toBe(false)
    expect(vm.file).toBe(null)
    expect(vm.pageCount).toBe(0)
    expect(vm.rangeInput).toBe('')
    expect(vm.isLoadingDocument).toBe(false)
  })

  it('ignores stale upload result when a newer upload finishes first', async () => {
    const firstUpload = createDeferred<{ pageCount: number }>()
    const secondUpload = createDeferred<{ pageCount: number }>()
    inspectPdfMock
      .mockReturnValueOnce(firstUpload.promise)
      .mockReturnValueOnce(secondUpload.promise)

    const wrapper = mount(Harness)
    const vm = wrapper.vm as unknown as HarnessVm

    const pendingFirstUpload = vm.handleUpload(
      new File(['first'], 'first.pdf', { type: 'application/pdf' }),
    )
    await flushAll()

    const pendingSecondUpload = vm.handleUpload(
      new File(['second'], 'second.pdf', { type: 'application/pdf' }),
    )
    await flushAll()

    secondUpload.resolve({ pageCount: 3 })

    const secondResult = await pendingSecondUpload
    await flushAll()

    expect(secondResult.success).toBe(true)
    expect(vm.file?.name).toBe('second.pdf')
    expect(vm.pageCount).toBe(3)

    firstUpload.resolve({ pageCount: 9 })

    const firstResult = await pendingFirstUpload
    await flushAll()

    expect(firstResult.success).toBe(false)
    expect(vm.file?.name).toBe('second.pdf')
    expect(vm.pageCount).toBe(3)
    expect(vm.isLoadingDocument).toBe(false)
  })

  it('clears stale result before a new generate attempt completes', async () => {
    const deferred = createDeferred<unknown>()

    const wrapper = mount(Harness)
    const vm = wrapper.vm as unknown as HarnessVm

    await vm.handleUpload(new File(['x'], 'sample.pdf', { type: 'application/pdf' }))
    await vm.generate()

    expect(vm.hasResult).toBe(true)
    expect(vm.resultFilename).toBe('output.pdf')

    addPageNumbersWithWorkerMock.mockReturnValueOnce(deferred.promise)

    const pendingGenerate = vm.generate()
    await flushAll()

    expect(vm.hasResult).toBe(false)
    expect(vm.resultFilename).toBe('')
    expect(vm.resultUrl).toBe(null)
    expect(vm.isGenerating).toBe(true)

    deferred.resolve({
      ok: false,
      code: PDF_ERROR.AddFailed,
    })

    const result = await pendingGenerate
    await flushAll()

    expect(result.success).toBe(false)
    expect(vm.generateErrorCode).toBe(PDF_ERROR.AddFailed)
    expect(vm.hasResult).toBe(false)
    expect(vm.resultFilename).toBe('')
  })

  it('ignores stale generate result after uploading a different file', async () => {
    const deferred = createDeferred<unknown>()
    addPageNumbersWithWorkerMock.mockReturnValueOnce(deferred.promise)
    inspectPdfMock.mockResolvedValueOnce({ pageCount: 6 }).mockResolvedValueOnce({ pageCount: 3 })

    const wrapper = mount(Harness)
    const vm = wrapper.vm as unknown as HarnessVm

    await vm.handleUpload(new File(['a'], 'first.pdf', { type: 'application/pdf' }))
    const pendingGenerate = vm.generate()
    await flushAll()

    await vm.handleUpload(new File(['b'], 'second.pdf', { type: 'application/pdf' }))
    expect(vm.file?.name).toBe('second.pdf')

    deferred.resolve({
      ok: true,
      result: {
        file: {
          name: 'first-numbered.pdf',
          blob: new Blob(['old'], { type: 'application/pdf' }),
        },
      },
    })

    await pendingGenerate
    await flushAll()

    expect(vm.hasResult).toBe(false)
    expect(vm.resultFilename).toBe('')
    expect(vm.isGenerating).toBe(false)
  })
})
