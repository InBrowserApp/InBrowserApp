import { computed, defineComponent, h, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { PDF_ERROR } from '../pdf-errors'
import type { ActionResult, OrganizerPage } from './pageOrganizerState'

const messageErrorMock = vi.fn()
const messageSuccessMock = vi.fn()

vi.mock('naive-ui', async () => {
  const actual = await vi.importActual<typeof import('naive-ui')>('naive-ui')
  return {
    ...actual,
    useMessage: () => ({
      error: messageErrorMock,
      success: messageSuccessMock,
    }),
  }
})

const uploadScrollMock = vi.fn()
const toolbarScrollMock = vi.fn()
const gridScrollMock = vi.fn()
const createSuccessResult = (): ActionResult => ({ success: true })

const file = ref<File | null>(null)
const pages = ref<OrganizerPage[]>([
  {
    id: '1',
    sourcePageNumber: 1,
    originalRotation: 0,
    rotationOffset: 0,
    thumbnailUrl: null,
    isLoading: false,
    hasError: false,
  },
  {
    id: '2',
    sourcePageNumber: 2,
    originalRotation: 90,
    rotationOffset: 0,
    thumbnailUrl: null,
    isLoading: false,
    hasError: false,
  },
])
const originalPageCount = ref(2)
const selectedCount = ref(1)
const selectedPageSet = computed(() => new Set(['1']))
const previewPageId = ref<string | null>(null)
const previewImageUrl = ref<string | null>(null)
const previewPlaceholderUrl = ref<string | null>(null)
const previewRotation = ref(0)
const previewDisplayPage = ref<number | null>(1)
const canPreviewPrevious = ref(false)
const canPreviewNext = ref(true)
const isLoadingDocument = ref(false)
const isRenderingThumbnails = ref(false)
const isPreviewLoading = ref(false)
const isGenerating = ref(false)
const fileErrorCode = ref('')
const generateErrorCode = ref('')
const hasChanges = ref(true)
const hasResult = ref(false)
const canUndo = ref(true)
const canRedo = ref(true)
const canExport = ref(true)
const resultFilename = ref('organized.pdf')
const downloadUrl = ref<string | null>(null)

const handleUploadMock = vi.fn<(nextFile: File) => Promise<ActionResult>>(
  async (nextFile: File) => {
    file.value = nextFile
    return createSuccessResult()
  },
)
const reorderPagesMock = vi.fn()
const movePageMock = vi.fn()
const rotatePageMock = vi.fn()
const rotateSelectedPagesMock = vi.fn()
const deletePageMock = vi.fn()
const deleteSelectedPagesMock = vi.fn()
const togglePageSelectionMock = vi.fn()
const selectAllPagesMock = vi.fn()
const clearSelectionMock = vi.fn()
const resetChangesMock = vi.fn()
const undoChangesMock = vi.fn()
const redoChangesMock = vi.fn()
const openPreviewMock = vi.fn<(pageId: string) => Promise<ActionResult>>(async () =>
  createSuccessResult(),
)
const previewByOffsetMock = vi.fn<(offset: number) => Promise<ActionResult>>(async () =>
  createSuccessResult(),
)
const closePreviewMock = vi.fn()
const exportPdfMock = vi.fn<() => Promise<ActionResult>>(async () => createSuccessResult())
const clearFileMock = vi.fn()

vi.mock('./usePdfPageOrganizer', () => ({
  usePdfPageOrganizer: () => ({
    file,
    pages,
    originalPageCount,
    selectedCount,
    selectedPageSet,
    previewPageId,
    previewImageUrl,
    previewPlaceholderUrl,
    previewRotation,
    previewDisplayPage,
    canPreviewPrevious,
    canPreviewNext,
    isLoadingDocument,
    isRenderingThumbnails,
    isPreviewLoading,
    isGenerating,
    fileErrorCode,
    generateErrorCode,
    hasChanges,
    hasResult,
    canUndo,
    canRedo,
    canExport,
    resultFilename,
    downloadUrl,
    handleUpload: handleUploadMock,
    reorderPages: reorderPagesMock,
    movePage: movePageMock,
    rotatePage: rotatePageMock,
    rotateSelectedPages: rotateSelectedPagesMock,
    deletePage: deletePageMock,
    deleteSelectedPages: deleteSelectedPagesMock,
    togglePageSelection: togglePageSelectionMock,
    selectAllPages: selectAllPagesMock,
    clearSelection: clearSelectionMock,
    resetChanges: resetChangesMock,
    undoChanges: undoChangesMock,
    redoChanges: redoChangesMock,
    openPreview: openPreviewMock,
    previewByOffset: previewByOffsetMock,
    closePreview: closePreviewMock,
    exportPdf: exportPdfMock,
    clearFile: clearFileMock,
  }),
}))

const UploadStub = defineComponent({
  emits: ['upload', 'clear'],
  setup(_, { emit, expose }) {
    expose({ scrollIntoView: uploadScrollMock })
    return () =>
      h('div', [
        h('button', {
          class: 'upload-trigger',
          onClick: () => emit('upload', new File(['pdf'], 'demo.pdf', { type: 'application/pdf' })),
        }),
        h('button', { class: 'clear-trigger', onClick: () => emit('clear') }),
      ])
  },
})

const ToolbarStub = defineComponent({
  props: ['thumbnailSize', 'pageCount', 'selectedCount'],
  emits: [
    'undo',
    'redo',
    'select-all',
    'clear-selection',
    'rotate-left',
    'rotate-right',
    'delete-selection',
    'reset',
    'jump-to-page',
    'set-thumbnail-size',
    'export',
  ],
  setup(props, { emit, expose }) {
    expose({ scrollIntoView: toolbarScrollMock })
    return () =>
      h('div', { class: 'toolbar-stub' }, [
        h('span', `${props.thumbnailSize}:${props.pageCount}:${props.selectedCount}`),
        h('button', { class: 'undo-trigger', onClick: () => emit('undo') }),
        h('button', { class: 'redo-trigger', onClick: () => emit('redo') }),
        h('button', { class: 'select-all-trigger', onClick: () => emit('select-all') }),
        h('button', { class: 'clear-selection-trigger', onClick: () => emit('clear-selection') }),
        h('button', { class: 'rotate-left-trigger', onClick: () => emit('rotate-left') }),
        h('button', { class: 'rotate-right-trigger', onClick: () => emit('rotate-right') }),
        h('button', { class: 'delete-selection-trigger', onClick: () => emit('delete-selection') }),
        h('button', { class: 'reset-trigger', onClick: () => emit('reset') }),
        h('button', { class: 'jump-trigger', onClick: () => emit('jump-to-page', 2) }),
        h('button', { class: 'jump-missing-trigger', onClick: () => emit('jump-to-page', 9) }),
        h('button', { class: 'size-trigger', onClick: () => emit('set-thumbnail-size', 'large') }),
        h('button', { class: 'export-trigger', onClick: () => emit('export') }),
      ])
  },
})

const GridStub = defineComponent({
  props: ['thumbnailSize'],
  emits: [
    'reorder',
    'toggle-page',
    'move-up',
    'move-down',
    'rotate-left',
    'rotate-right',
    'delete-page',
    'open-preview',
  ],
  setup(props, { emit, expose }) {
    expose({ scrollToPage: gridScrollMock })
    return () =>
      h('div', { class: 'grid-stub' }, [
        h('span', { class: 'grid-size' }, String(props.thumbnailSize)),
        h('button', { class: 'reorder-trigger', onClick: () => emit('reorder', 0, 1) }),
        h('button', { class: 'toggle-trigger', onClick: () => emit('toggle-page', '1', true) }),
        h('button', { class: 'move-up-trigger', onClick: () => emit('move-up', '1') }),
        h('button', { class: 'move-down-trigger', onClick: () => emit('move-down', '1') }),
        h('button', { class: 'rotate-page-left-trigger', onClick: () => emit('rotate-left', '1') }),
        h('button', {
          class: 'rotate-page-right-trigger',
          onClick: () => emit('rotate-right', '1'),
        }),
        h('button', { class: 'delete-page-trigger', onClick: () => emit('delete-page', '1') }),
        h('button', { class: 'open-preview-trigger', onClick: () => emit('open-preview', '1') }),
      ])
  },
})

const PreviewStub = defineComponent({
  emits: ['close', 'prev', 'next'],
  setup(_, { emit }) {
    return () =>
      h('div', [
        h('button', { class: 'preview-prev-trigger', onClick: () => emit('prev') }),
        h('button', { class: 'preview-next-trigger', onClick: () => emit('next') }),
        h('button', { class: 'preview-close-trigger', onClick: () => emit('close') }),
      ])
  },
})

import PDFPageOrganizerTool from './PDFPageOrganizerTool.vue'

describe('PDFPageOrganizerTool', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    file.value = null
    originalPageCount.value = 2
    selectedCount.value = 1
    previewPageId.value = null
    previewImageUrl.value = null
    previewPlaceholderUrl.value = null
    previewRotation.value = 0
    previewDisplayPage.value = 1
    canPreviewPrevious.value = false
    canPreviewNext.value = true
    isLoadingDocument.value = false
    isRenderingThumbnails.value = false
    isPreviewLoading.value = false
    isGenerating.value = false
    fileErrorCode.value = ''
    generateErrorCode.value = ''
    hasChanges.value = true
    hasResult.value = false
    canUndo.value = true
    canRedo.value = true
    canExport.value = true
    resultFilename.value = 'organized.pdf'
    downloadUrl.value = null
    handleUploadMock.mockImplementation(async (nextFile: File) => {
      file.value = nextFile
      return createSuccessResult()
    })
    openPreviewMock.mockResolvedValue(createSuccessResult())
    previewByOffsetMock.mockResolvedValue(createSuccessResult())
    exportPdfMock.mockResolvedValue(createSuccessResult())
    gridScrollMock.mockReturnValue(true)
  })

  it('wires upload, toolbar, grid, preview, and expose behaviors', async () => {
    const wrapper = mount(PDFPageOrganizerTool, {
      global: {
        stubs: {
          PDFOrganizerUploadSection: UploadStub,
          PDFOrganizerToolbar: ToolbarStub,
          PDFOrganizerGrid: GridStub,
          PDFOrganizerPreviewModal: PreviewStub,
        },
      },
    })

    ;(wrapper.vm as unknown as { scrollIntoView: () => void }).scrollIntoView()
    expect(uploadScrollMock).toHaveBeenCalled()

    await wrapper.get('.upload-trigger').trigger('click')
    expect(handleUploadMock).toHaveBeenCalled()
    expect(toolbarScrollMock).toHaveBeenCalled()
    expect(wrapper.text()).toContain('comfortable:2:1')

    await wrapper.get('.undo-trigger').trigger('click')
    await wrapper.get('.redo-trigger').trigger('click')
    await wrapper.get('.select-all-trigger').trigger('click')
    await wrapper.get('.clear-selection-trigger').trigger('click')
    await wrapper.get('.rotate-left-trigger').trigger('click')
    await wrapper.get('.rotate-right-trigger').trigger('click')
    await wrapper.get('.delete-selection-trigger').trigger('click')
    await wrapper.get('.reset-trigger').trigger('click')
    await wrapper.get('.jump-trigger').trigger('click')
    await wrapper.get('.jump-missing-trigger').trigger('click')
    await wrapper.get('.size-trigger').trigger('click')
    await wrapper.get('.export-trigger').trigger('click')

    expect(undoChangesMock).toHaveBeenCalled()
    expect(redoChangesMock).toHaveBeenCalled()
    expect(selectAllPagesMock).toHaveBeenCalled()
    expect(clearSelectionMock).toHaveBeenCalled()
    expect(rotateSelectedPagesMock).toHaveBeenCalledWith(-90)
    expect(rotateSelectedPagesMock).toHaveBeenCalledWith(90)
    expect(deleteSelectedPagesMock).toHaveBeenCalled()
    expect(resetChangesMock).toHaveBeenCalled()
    expect(gridScrollMock).toHaveBeenCalledWith('2')
    expect(gridScrollMock).toHaveBeenCalledTimes(1)
    expect(wrapper.find('.grid-size').text()).toBe('large')
    expect(exportPdfMock).toHaveBeenCalled()
    expect(messageSuccessMock).toHaveBeenCalled()

    await wrapper.get('.reorder-trigger').trigger('click')
    await wrapper.get('.toggle-trigger').trigger('click')
    await wrapper.get('.move-up-trigger').trigger('click')
    await wrapper.get('.move-down-trigger').trigger('click')
    await wrapper.get('.rotate-page-left-trigger').trigger('click')
    await wrapper.get('.rotate-page-right-trigger').trigger('click')
    await wrapper.get('.delete-page-trigger').trigger('click')
    await wrapper.get('.open-preview-trigger').trigger('click')

    expect(reorderPagesMock).toHaveBeenCalledWith(0, 1)
    expect(togglePageSelectionMock).toHaveBeenCalledWith('1', true)
    expect(movePageMock).toHaveBeenCalledWith('1', -1)
    expect(movePageMock).toHaveBeenCalledWith('1', 1)
    expect(rotatePageMock).toHaveBeenCalledWith('1', -90)
    expect(rotatePageMock).toHaveBeenCalledWith('1', 90)
    expect(deletePageMock).toHaveBeenCalledWith('1')
    expect(openPreviewMock).toHaveBeenCalledWith('1')

    await wrapper.get('.preview-prev-trigger').trigger('click')
    await wrapper.get('.preview-next-trigger').trigger('click')
    await wrapper.get('.preview-close-trigger').trigger('click')
    expect(previewByOffsetMock).toHaveBeenCalledWith(-1)
    expect(previewByOffsetMock).toHaveBeenCalledWith(1)
    expect(closePreviewMock).toHaveBeenCalled()

    await wrapper.get('.clear-trigger').trigger('click')
    expect(clearFileMock).toHaveBeenCalled()
  })

  it('maps upload, preview, offset preview, and export errors to messages', async () => {
    handleUploadMock.mockResolvedValueOnce({ success: false, errorCode: PDF_ERROR.Invalid })
    openPreviewMock.mockResolvedValueOnce({ success: false, errorCode: PDF_ERROR.PreviewFailed })
    previewByOffsetMock.mockResolvedValueOnce({
      success: false,
      errorCode: PDF_ERROR.PreviewFailed,
    })
    exportPdfMock.mockResolvedValueOnce({ success: false, errorCode: PDF_ERROR.ExportFailed })

    const wrapper = mount(PDFPageOrganizerTool, {
      global: {
        stubs: {
          PDFOrganizerUploadSection: UploadStub,
          PDFOrganizerToolbar: ToolbarStub,
          PDFOrganizerGrid: GridStub,
          PDFOrganizerPreviewModal: PreviewStub,
        },
      },
    })

    await wrapper.get('.upload-trigger').trigger('click')
    expect(messageErrorMock).toHaveBeenCalled()
    expect(toolbarScrollMock).not.toHaveBeenCalled()

    file.value = new File(['pdf'], 'demo.pdf', { type: 'application/pdf' })
    await wrapper.vm.$nextTick()

    await wrapper.get('.open-preview-trigger').trigger('click')
    await wrapper.get('.preview-prev-trigger').trigger('click')
    await wrapper.get('.export-trigger').trigger('click')

    expect(messageErrorMock).toHaveBeenCalledTimes(4)
    expect(messageSuccessMock).not.toHaveBeenCalled()
  })

  it('ignores stale upload and export results without showing generic errors', async () => {
    handleUploadMock.mockResolvedValueOnce({ success: false })
    exportPdfMock.mockResolvedValueOnce({ success: false })

    const wrapper = mount(PDFPageOrganizerTool, {
      global: {
        stubs: {
          PDFOrganizerUploadSection: UploadStub,
          PDFOrganizerToolbar: ToolbarStub,
          PDFOrganizerGrid: GridStub,
          PDFOrganizerPreviewModal: PreviewStub,
        },
      },
    })

    await wrapper.get('.upload-trigger').trigger('click')
    expect(messageErrorMock).not.toHaveBeenCalled()
    expect(toolbarScrollMock).not.toHaveBeenCalled()

    file.value = new File(['pdf'], 'demo.pdf', { type: 'application/pdf' })
    await wrapper.vm.$nextTick()

    await wrapper.get('.export-trigger').trigger('click')
    expect(messageErrorMock).not.toHaveBeenCalled()
    expect(messageSuccessMock).not.toHaveBeenCalled()
  })
})
