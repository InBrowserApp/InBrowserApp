import { defineComponent, nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const inspectPdfMock = vi.fn(async (_file: File) => ({ pageCount: 5 }))
vi.mock('../inspect-pdf', () => ({
  inspectPdf: (file: File) => inspectPdfMock(file),
}))

const splitPdfWithWorkerMock = vi.fn(async (_payload: unknown) => {
  return {
    ok: true,
    result: {
      kind: 'single' as const,
      file: {
        name: 'result.pdf',
        blob: new Blob(['single'], { type: 'application/pdf' }),
      },
    },
  }
})

vi.mock('../split-pdf', () => ({
  splitPdfWithWorker: (payload: unknown) => splitPdfWithWorkerMock(payload),
}))

const createPdfZipMock = vi.fn(
  async (_entries: Array<{ name: string; blob: Blob }>) => new Blob(['zip']),
)
vi.mock('../utils/create-pdf-zip', () => ({
  createPdfZip: (entries: Array<{ name: string; blob: Blob }>) => createPdfZipMock(entries),
}))

const renderPageMock = vi.fn(async (page: number, _width: number) => {
  return new Blob([`page-${page}`], { type: 'image/webp' })
})

const destroyMock = vi.fn(async () => undefined)

vi.mock('../utils/pdf-thumbnail-renderer', () => ({
  PdfThumbnailRenderer: class {
    renderPage = renderPageMock
    destroy = destroyMock
  },
}))

import { usePdfSplitter } from './usePdfSplitter'

type HarnessVm = {
  pageCount: number
  rangeInput: string
  selectedPages: number[]
  outputMode: 'single' | 'multiple'
  multipleMode: 'ranges' | 'pages'
  items: Array<{ page: number; thumbnailUrl: string | null }>
  resultFilename: string
  resultFileCount: number
  hasResult: boolean
  handleUpload: (file: File) => Promise<void>
  handleRangeInputChange: (value: string) => { success: boolean; errorCode?: string }
  setOutputMode: (mode: 'single' | 'multiple') => void
  setMultipleMode: (mode: 'ranges' | 'pages') => void
  generate: () => Promise<{ success: boolean; errorCode?: string }>
}

const Harness = defineComponent({
  setup() {
    return usePdfSplitter()
  },
  template: '<div />',
})

const flushAll = async () => {
  await Promise.resolve()
  await Promise.resolve()
  await nextTick()
  await new Promise((resolve) => {
    setTimeout(resolve, 0)
  })
  await nextTick()
}

describe('usePdfSplitter', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    inspectPdfMock.mockResolvedValue({ pageCount: 5 })
    splitPdfWithWorkerMock.mockResolvedValue({
      ok: true,
      result: {
        kind: 'single',
        file: {
          name: 'result.pdf',
          blob: new Blob(['single'], { type: 'application/pdf' }),
        },
      },
    })
  })

  it('loads pdf, initializes selection, and renders thumbnails', async () => {
    const wrapper = mount(Harness)
    const vm = wrapper.vm as unknown as HarnessVm

    const file = new File([new Uint8Array([1, 2, 3])], 'sample.pdf', { type: 'application/pdf' })

    await vm.handleUpload(file)
    await flushAll()

    expect(vm.pageCount).toBe(5)
    expect(vm.selectedPages).toEqual([1, 2, 3, 4, 5])
    expect(vm.rangeInput).toBe('1-5')
    expect(vm.items).toHaveLength(5)
    expect(renderPageMock).toHaveBeenCalled()
  })

  it('applies typed ranges to selection automatically', async () => {
    const wrapper = mount(Harness)
    const vm = wrapper.vm as unknown as HarnessVm

    const file = new File([new Uint8Array([1, 2, 3])], 'sample.pdf', { type: 'application/pdf' })
    await vm.handleUpload(file)
    await flushAll()

    const result = vm.handleRangeInputChange('1-2,5')

    expect(result.success).toBe(true)
    expect(vm.selectedPages).toEqual([1, 2, 5])
  })

  it('generates single output file', async () => {
    const wrapper = mount(Harness)
    const vm = wrapper.vm as unknown as HarnessVm

    const file = new File([new Uint8Array([1, 2, 3])], 'sample.pdf', { type: 'application/pdf' })
    await vm.handleUpload(file)
    await flushAll()

    vm.setOutputMode('single')
    vm.rangeInput = '1-3'

    const result = await vm.generate()

    expect(result.success).toBe(true)
    expect(vm.hasResult).toBe(true)
    expect(vm.resultFilename).toBe('result.pdf')
    expect(vm.resultFileCount).toBe(1)
    expect(splitPdfWithWorkerMock).toHaveBeenCalledWith(
      expect.objectContaining({
        outputMode: 'single',
        pages: [1, 2, 3],
        outputBaseName: 'sample-selected',
      }),
    )
  })

  it('generates zip for multiple output mode', async () => {
    splitPdfWithWorkerMock.mockResolvedValueOnce({
      ok: true,
      result: {
        kind: 'multiple',
        files: [
          {
            name: 'result-part-01.pdf',
            blob: new Blob(['one'], { type: 'application/pdf' }),
          },
          {
            name: 'result-part-02.pdf',
            blob: new Blob(['two'], { type: 'application/pdf' }),
          },
        ],
      },
    } as unknown as Awaited<ReturnType<typeof splitPdfWithWorkerMock>>)

    const wrapper = mount(Harness)
    const vm = wrapper.vm as unknown as HarnessVm

    const file = new File([new Uint8Array([1, 2, 3])], 'sample.pdf', { type: 'application/pdf' })
    await vm.handleUpload(file)
    await flushAll()

    vm.setOutputMode('multiple')
    vm.setMultipleMode('ranges')
    vm.rangeInput = '1-2,3-4'

    const result = await vm.generate()

    expect(result.success).toBe(true)
    expect(vm.hasResult).toBe(true)
    expect(vm.resultFilename).toBe('sample-split.zip')
    expect(vm.resultFileCount).toBe(2)
    expect(createPdfZipMock).toHaveBeenCalledOnce()
    expect(splitPdfWithWorkerMock).toHaveBeenCalledWith(
      expect.objectContaining({
        outputMode: 'multiple',
        multipleMode: 'ranges',
        outputBaseName: 'sample-split',
      }),
    )
  })

  it('returns range parse error for invalid expression', async () => {
    const wrapper = mount(Harness)
    const vm = wrapper.vm as unknown as HarnessVm

    const file = new File([new Uint8Array([1, 2, 3])], 'sample.pdf', { type: 'application/pdf' })
    await vm.handleUpload(file)
    await flushAll()

    vm.rangeInput = '1-'

    const result = await vm.generate()

    expect(result.success).toBe(false)
    expect(result.errorCode).toBe('page-range-invalid-token')
  })
})
