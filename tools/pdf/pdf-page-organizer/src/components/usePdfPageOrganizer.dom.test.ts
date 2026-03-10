import { computed, defineComponent, nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { OrganizePdfWorkerResponse } from '../organize-pdf'
import { PDF_ERROR } from '../pdf-errors'

const inspectPdfMock = vi.fn(async (_file: File) => ({
  pageCount: 3,
  pageRotations: [0, 90, 180],
}))
vi.mock('../inspect-pdf', () => ({
  inspectPdf: (file: File) => inspectPdfMock(file),
  isPdfFile: (file: File) =>
    file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf'),
}))

const createWorkerSuccess = (): OrganizePdfWorkerResponse => ({
  ok: true,
  result: {
    file: {
      name: 'organized.pdf',
      blob: new Blob(['done'], { type: 'application/pdf' }),
    },
  },
})

const organizePdfWithWorkerMock = vi.fn<(_payload: unknown) => Promise<OrganizePdfWorkerResponse>>(
  async () => createWorkerSuccess(),
)

vi.mock('../organize-pdf', () => ({
  organizePdfWithWorker: (payload: unknown) => organizePdfWithWorkerMock(payload),
}))

const renderPageMock = vi.fn(async (_pageNumber: number, _width: number) => new Blob(['img']))
const destroyMock = vi.fn(async () => undefined)

vi.mock('../utils/pdf-renderer', () => ({
  PdfPageRenderer: class {
    renderPage(pageNumber: number, width: number) {
      return renderPageMock(pageNumber, width)
    }

    destroy() {
      return destroyMock()
    }
  },
}))

vi.mock('@vueuse/core', () => ({
  useObjectUrl: (target: { value: Blob | null }) =>
    computed(() => (target.value ? 'blob:mock-result' : null)),
}))

import { usePdfPageOrganizer } from './usePdfPageOrganizer'

type HarnessVm = {
  file: File | null
  pages: Array<{
    id: string
    sourcePageNumber: number
    originalRotation: number
    rotationOffset: number
    thumbnailUrl: string | null
    isLoading: boolean
    hasError: boolean
  }>
  originalPageCount: number
  selectedCount: number
  previewPageId: string | null
  previewImageUrl: string | null
  previewRotation: number
  previewDisplayPage: number | null
  canPreviewPrevious: boolean
  canPreviewNext: boolean
  fileErrorCode: string
  generateErrorCode: string
  resultFilename: string
  downloadUrl: string | null
  hasChanges: boolean
  hasResult: boolean
  canUndo: boolean
  canRedo: boolean
  canExport: boolean
  handleUpload: (file: File) => Promise<{ success: boolean; errorCode?: string }>
  reorderPages: (oldIndex: number | null, newIndex: number | null) => void
  movePage: (pageId: string, offset: number) => void
  rotatePage: (pageId: string, delta: number) => void
  rotateSelectedPages: (delta: number) => void
  deletePage: (pageId: string) => void
  deleteSelectedPages: () => void
  togglePageSelection: (pageId: string, useShift?: boolean) => void
  selectAllPages: () => void
  clearSelection: () => void
  resetChanges: () => void
  undoChanges: () => void
  redoChanges: () => void
  openPreview: (pageId: string) => Promise<{ success: boolean; errorCode?: string }>
  previewByOffset: (offset: number) => Promise<{ success: boolean; errorCode?: string }>
  closePreview: () => void
  exportPdf: () => Promise<{ success: boolean; errorCode?: string }>
  clearFile: () => Promise<void>
}

const Harness = defineComponent({
  setup() {
    return usePdfPageOrganizer()
  },
  template: '<div />',
})

const flushAll = async () => {
  await Promise.resolve()
  await Promise.resolve()
  await nextTick()
}

describe('usePdfPageOrganizer', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    inspectPdfMock.mockResolvedValue({
      pageCount: 3,
      pageRotations: [0, 90, 180],
    })
    organizePdfWithWorkerMock.mockResolvedValue(createWorkerSuccess())
  })

  it('uploads a pdf, renders thumbnails, previews pages, and exports current state', async () => {
    const wrapper = mount(Harness)
    const vm = wrapper.vm as unknown as HarnessVm

    const result = await vm.handleUpload(
      new File(['pdf'], 'sample.pdf', { type: 'application/pdf' }),
    )
    await flushAll()

    expect(result.success).toBe(true)
    expect(vm.file?.name).toBe('sample.pdf')
    expect(vm.originalPageCount).toBe(3)
    expect(vm.pages).toHaveLength(3)
    expect(renderPageMock).toHaveBeenCalledWith(1, 220)
    expect(vm.canExport).toBe(true)

    vm.reorderPages(0, 2)
    vm.rotatePage('2', 90)

    const previewResult = await vm.openPreview('2')
    expect(previewResult.success).toBe(true)
    expect(vm.previewPageId).toBe('2')
    expect(vm.previewImageUrl).toBe('blob:mock-result')
    expect(vm.previewRotation).toBe(90)

    const nextPreviewResult = await vm.previewByOffset(1)
    expect(nextPreviewResult.success).toBe(true)
    expect(vm.previewPageId).toBe('3')
    expect(vm.previewDisplayPage).toBe(2)
    expect(vm.canPreviewPrevious).toBe(true)
    expect(vm.canPreviewNext).toBe(true)

    const exportResult = await vm.exportPdf()
    expect(exportResult.success).toBe(true)
    expect(vm.hasResult).toBe(true)
    expect(vm.resultFilename).toBe('organized.pdf')
    expect(vm.downloadUrl).toBe('blob:mock-result')
    expect(organizePdfWithWorkerMock).toHaveBeenCalledWith({
      file: expect.objectContaining({ name: 'sample.pdf' }),
      outputFileName: 'sample-organized.pdf',
      pages: [
        { sourcePageNumber: 2, rotation: 180 },
        { sourcePageNumber: 3, rotation: 180 },
        { sourcePageNumber: 1, rotation: 0 },
      ],
    })
  })

  it('supports selection, batch actions, reset, clear, and maps failures', async () => {
    const wrapper = mount(Harness)
    const vm = wrapper.vm as unknown as HarnessVm

    await vm.handleUpload(new File(['pdf'], 'sample.pdf', { type: 'application/pdf' }))
    await flushAll()

    vm.togglePageSelection('1')
    vm.togglePageSelection('3', true)
    expect(vm.selectedCount).toBe(3)

    vm.rotateSelectedPages(-90)
    expect(vm.pages.map((page) => page.rotationOffset)).toEqual([270, 270, 270])

    vm.deleteSelectedPages()
    expect(vm.pages).toHaveLength(0)
    expect(vm.canExport).toBe(false)

    vm.resetChanges()
    await flushAll()
    expect(vm.pages).toHaveLength(3)
    expect(vm.pages.map((page) => page.sourcePageNumber)).toEqual([1, 2, 3])
    expect(vm.pages.every((page) => page.rotationOffset === 0)).toBe(true)
    expect(vm.hasChanges).toBe(false)

    vm.selectAllPages()
    expect(vm.selectedCount).toBe(3)
    vm.clearSelection()
    expect(vm.selectedCount).toBe(0)

    organizePdfWithWorkerMock.mockResolvedValueOnce({
      ok: false,
      code: PDF_ERROR.ExportFailed,
    })
    const exportFailure = await vm.exportPdf()
    expect(exportFailure.success).toBe(false)
    expect(vm.generateErrorCode).toBe(PDF_ERROR.ExportFailed)

    inspectPdfMock.mockRejectedValueOnce(new Error(PDF_ERROR.Encrypted))
    const uploadFailure = await vm.handleUpload(
      new File(['pdf'], 'encrypted.pdf', { type: 'application/pdf' }),
    )
    expect(uploadFailure.success).toBe(false)
    expect(vm.fileErrorCode).toBe(PDF_ERROR.Encrypted)

    await vm.clearFile()
    expect(vm.file).toBe(null)
    expect(vm.pages).toHaveLength(0)
    expect(destroyMock).toHaveBeenCalled()
  })

  it('tracks undo and redo history for page edits', async () => {
    const wrapper = mount(Harness)
    const vm = wrapper.vm as unknown as HarnessVm

    await vm.handleUpload(new File(['pdf'], 'sample.pdf', { type: 'application/pdf' }))
    await flushAll()

    expect(vm.canUndo).toBe(false)
    expect(vm.canRedo).toBe(false)

    vm.reorderPages(0, 2)
    expect(vm.pages.map((page) => page.sourcePageNumber)).toEqual([2, 3, 1])
    expect(vm.canUndo).toBe(true)
    expect(vm.canRedo).toBe(false)

    vm.rotatePage('2', 90)
    expect(vm.pages.find((page) => page.id === '2')?.rotationOffset).toBe(90)

    vm.undoChanges()
    expect(vm.pages.find((page) => page.id === '2')?.rotationOffset).toBe(0)
    expect(vm.pages.map((page) => page.sourcePageNumber)).toEqual([2, 3, 1])
    expect(vm.canRedo).toBe(true)

    vm.undoChanges()
    expect(vm.pages.map((page) => page.sourcePageNumber)).toEqual([1, 2, 3])
    expect(vm.canUndo).toBe(false)

    vm.redoChanges()
    expect(vm.pages.map((page) => page.sourcePageNumber)).toEqual([2, 3, 1])
    expect(vm.canUndo).toBe(true)
    expect(vm.canRedo).toBe(true)

    vm.deletePage('3')
    expect(vm.pages.map((page) => page.sourcePageNumber)).toEqual([2, 1])
    expect(vm.canRedo).toBe(false)
  })

  it('handles invalid files, stale preview/upload races, and edge export paths', async () => {
    const wrapper = mount(Harness)
    const vm = wrapper.vm as unknown as HarnessVm

    const invalidUpload = await vm.handleUpload(
      new File(['txt'], 'notes.txt', { type: 'text/plain' }),
    )
    expect(invalidUpload).toEqual({ success: false, errorCode: PDF_ERROR.Invalid })

    let resolveFirstInspection:
      | ((value: { pageCount: number; pageRotations: number[] }) => void)
      | undefined
    inspectPdfMock.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveFirstInspection = resolve
        }),
    )
    const firstUploadPromise = vm.handleUpload(
      new File(['pdf'], 'first.pdf', { type: 'application/pdf' }),
    )
    const secondUploadPromise = vm.handleUpload(
      new File(['pdf'], 'second.pdf', { type: 'application/pdf' }),
    )

    resolveFirstInspection?.({ pageCount: 2, pageRotations: [0, 0] })
    const [firstUpload, secondUpload] = await Promise.all([firstUploadPromise, secondUploadPromise])
    await flushAll()
    expect(firstUpload.success).toBe(false)
    expect(secondUpload.success).toBe(true)
    expect(vm.file?.name).toBe('second.pdf')

    await vm.handleUpload(new File(['pdf'], 'sample.pdf', { type: 'application/pdf' }))
    await flushAll()

    renderPageMock
      .mockImplementationOnce(
        async () =>
          await new Promise<Blob>((resolve) => {
            setTimeout(() => resolve(new Blob(['later'])), 0)
          }),
      )
      .mockResolvedValueOnce(new Blob(['now']))
    const stalePreviewPromise = vm.openPreview('1')
    const nextPreviewPromise = vm.openPreview('2')
    expect(await stalePreviewPromise).toEqual({ success: false })
    expect(await nextPreviewPromise).toEqual({ success: true })

    renderPageMock.mockRejectedValueOnce(new Error('broken-preview'))
    const previewFailure = await vm.openPreview('2')
    expect(previewFailure).toEqual({ success: false, errorCode: PDF_ERROR.PreviewFailed })

    expect(await vm.openPreview('missing')).toEqual({
      success: false,
      errorCode: PDF_ERROR.PreviewFailed,
    })
    vm.closePreview()
    expect(await vm.previewByOffset(9)).toEqual({ success: false })

    await vm.clearFile()
    expect(await vm.exportPdf()).toEqual({
      success: false,
      errorCode: PDF_ERROR.ExportFailed,
    })

    organizePdfWithWorkerMock.mockRejectedValueOnce('plain-string-error')
    await vm.handleUpload(new File(['pdf'], 'sample.pdf', { type: 'application/pdf' }))
    await flushAll()
    const exportFailure = await vm.exportPdf()
    expect(exportFailure).toEqual({ success: false, errorCode: PDF_ERROR.ExportFailed })

    inspectPdfMock.mockRejectedValueOnce('string-error')
    const stringUploadFailure = await vm.handleUpload(
      new File(['pdf'], 'broken.pdf', { type: 'application/pdf' }),
    )
    expect(stringUploadFailure).toEqual({ success: false, errorCode: PDF_ERROR.Invalid })
  })

  it('marks failed thumbnails, clears preview after deletion, and ignores stale upload failures', async () => {
    const wrapper = mount(Harness)
    const vm = wrapper.vm as unknown as HarnessVm

    renderPageMock.mockRejectedValueOnce(new Error('thumbnail-broken'))
    await vm.handleUpload(new File(['pdf'], 'sample.pdf', { type: 'application/pdf' }))
    await flushAll()
    expect(vm.pages[0]?.hasError).toBe(true)

    renderPageMock.mockResolvedValue(new Blob(['preview']))
    await vm.openPreview('1')
    vm.deletePage('1')
    expect(vm.previewPageId).toBe(null)
    expect(vm.hasChanges).toBe(true)

    let rejectFirstInspection: ((reason?: unknown) => void) | undefined
    inspectPdfMock.mockImplementationOnce(
      () =>
        new Promise((_, reject) => {
          rejectFirstInspection = reject
        }),
    )
    const staleFailurePromise = vm.handleUpload(
      new File(['pdf'], 'stale.pdf', { type: 'application/pdf' }),
    )
    const nextUploadPromise = vm.handleUpload(
      new File(['pdf'], 'fresh.pdf', { type: 'application/pdf' }),
    )
    rejectFirstInspection?.(new Error(PDF_ERROR.Invalid))
    const [staleFailure, nextUpload] = await Promise.all([staleFailurePromise, nextUploadPromise])
    await flushAll()

    expect(staleFailure).toEqual({ success: false })
    expect(nextUpload.success).toBe(true)
    expect(vm.file?.name).toBe('fresh.pdf')
    expect(vm.fileErrorCode).toBe('')

    renderPageMock
      .mockImplementationOnce(
        async () =>
          await new Promise<Blob>((_, reject) => {
            setTimeout(() => reject(new Error('late-preview-error')), 0)
          }),
      )
      .mockResolvedValueOnce(new Blob(['later-preview']))
    const staleErrorPreview = vm.openPreview('1')
    const nextPreview = vm.openPreview('2')
    expect(await staleErrorPreview).toEqual({ success: false })
    expect(await nextPreview).toEqual({ success: true })
  })
})
