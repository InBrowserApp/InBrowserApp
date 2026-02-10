import { defineComponent, nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { ImageFormat, PdfPageImage } from '../types'

const successMock = vi.fn()
const errorMock = vi.fn()

vi.mock('naive-ui', () => ({
  useMessage: () => ({
    success: successMock,
    error: errorMock,
  }),
}))

const createImageZipMock = vi.fn(async (_entries: Array<{ name: string; blob: Blob }>) => {
  return new Blob(['zip'])
})

vi.mock('../utils/create-image-zip', () => ({
  createImageZip: (entries: Array<{ name: string; blob: Blob }>) => createImageZipMock(entries),
}))

const getNumPagesMock = vi.fn(async () => 3)
const renderPageMock = vi.fn(async (page: number) => ({
  page,
  width: 200,
  height: 300,
  blob: new Blob([`page-${page}`]),
  dpi: 144,
  format: 'png',
  quality: 0.92,
}))
const destroyMock = vi.fn(async () => undefined)

vi.mock('../utils/pdf-to-image-renderer', () => ({
  PdfToImageRenderer: class {
    getNumPages = getNumPagesMock
    renderPage = renderPageMock
    destroy = destroyMock
  },
}))

import { usePdfToImageConverter } from './usePdfToImageConverter'

type HarnessVm = {
  page: number
  numPages: number
  format: ImageFormat
  dpi: number
  quality: number
  currentPageImage: PdfPageImage | null
  errorMessage: string
  handleUpload: (file: File) => void
  setFormat: (format: ImageFormat) => void
  setQuality: (quality: number) => void
  exportAllPages: () => Promise<void>
}

const Harness = defineComponent({
  setup() {
    return usePdfToImageConverter()
  },
  template: '<div />',
})

async function flushAll() {
  await Promise.resolve()
  await Promise.resolve()
  await nextTick()
}

describe('usePdfToImageConverter', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    getNumPagesMock.mockResolvedValue(3)
    renderPageMock.mockImplementation(async (page: number) => ({
      page,
      width: 200,
      height: 300,
      blob: new Blob([`page-${page}`]),
      dpi: 144,
      format: 'png',
      quality: 0.92,
    }))
  })

  it('loads pdf and renders first page after upload', async () => {
    const wrapper = mount(Harness)

    const file = new File([new Uint8Array([1, 2, 3])], 'sample.pdf', { type: 'application/pdf' })
    const vm = wrapper.vm as unknown as HarnessVm
    vm.handleUpload(file)

    await flushAll()
    await flushAll()

    expect(vm.numPages).toBe(3)
    expect(vm.page).toBe(1)
    expect(vm.currentPageImage?.page).toBe(1)
    expect(renderPageMock).toHaveBeenCalledWith(
      1,
      expect.objectContaining({ dpi: 144, format: 'png' }),
    )
  })

  it('resets quality when switching to non-quality format', async () => {
    const wrapper = mount(Harness)
    const vm = wrapper.vm as unknown as HarnessVm

    vm.setFormat('jpeg')
    await nextTick()
    vm.setQuality(0.3)
    vm.setFormat('png')

    await nextTick()

    expect(vm.quality).toBe(0.92)
  })

  it('exports all pages and generates zip', async () => {
    const wrapper = mount(Harness)
    const vm = wrapper.vm as unknown as HarnessVm

    const file = new File([new Uint8Array([1, 2, 3])], 'report.pdf', { type: 'application/pdf' })
    vm.handleUpload(file)

    await flushAll()
    await flushAll()

    await vm.exportAllPages()

    expect(createImageZipMock).toHaveBeenCalledOnce()
    const firstCallArgs = createImageZipMock.mock.calls[0]
    expect(firstCallArgs).toBeDefined()

    const entries = firstCallArgs?.[0] ?? []
    expect(entries).toHaveLength(3)
    expect(entries[0]?.name).toBe('report-p1.png')
    expect(successMock).toHaveBeenCalledOnce()
  })

  it('handles export errors', async () => {
    const wrapper = mount(Harness)
    const vm = wrapper.vm as unknown as HarnessVm

    const file = new File([new Uint8Array([1, 2, 3])], 'report.pdf', { type: 'application/pdf' })
    vm.handleUpload(file)

    await flushAll()
    await flushAll()

    renderPageMock.mockRejectedValueOnce(new Error('CANVAS_TO_BLOB_FAILED'))

    await vm.exportAllPages()

    expect(errorMock).toHaveBeenCalledOnce()
    expect(vm.errorMessage).toBe('exportFailedCanvas')
  })

  it('handles invalid pdf load errors', async () => {
    getNumPagesMock.mockRejectedValueOnce(new Error('Invalid PDF structure'))

    const wrapper = mount(Harness)
    const vm = wrapper.vm as unknown as HarnessVm

    const file = new File([new Uint8Array([1, 2, 3])], 'broken.pdf', { type: 'application/pdf' })
    vm.handleUpload(file)

    await flushAll()

    expect(vm.errorMessage).toBe('loadFailedInvalid')
    expect(vm.numPages).toBe(0)
  })
})
