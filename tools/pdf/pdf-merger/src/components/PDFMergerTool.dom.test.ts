import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { defineComponent } from 'vue'
import { PDF_ERROR } from '../pdf-errors'

const successMock = vi.fn()
const errorMock = vi.fn()
const inspectPdfMock = vi.fn()
const mergePdfsWithWorkerMock = vi.fn()

let objectURLCounter = 0

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({
      t: (key: string) => key,
    }),
  }
})

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')

  const stub = (name: string, tag = 'div') =>
    defineComponent({
      name,
      inheritAttrs: false,
      template: `<${tag} v-bind="$attrs"><slot /></${tag}>`,
    })

  return {
    useMessage: () => ({
      success: successMock,
      error: errorMock,
    }),
    NModal: stub('NModal'),
    NCard: stub('NCard'),
  }
})

vi.mock('@vueuse/core', async () => {
  const { computed } = await import('vue')
  return {
    useObjectUrl: (valueRef: { value: Blob | null }) =>
      computed(() => (valueRef.value ? 'blob:merged' : null)),
  }
})

vi.mock('../inspect-pdf', () => ({
  inspectPdf: (...args: unknown[]) => inspectPdfMock(...args),
}))

vi.mock('../merge-pdfs', () => ({
  mergePdfsWithWorker: (...args: unknown[]) => mergePdfsWithWorkerMock(...args),
}))

import PDFMergerTool from './PDFMergerTool.vue'

const PDFMergeUploader = defineComponent({
  name: 'PDFMergeUploader',
  template: '<div class="uploader-stub" />',
})

const PDFMergeQueue = defineComponent({
  name: 'PDFMergeQueue',
  template: '<div class="queue-stub" />',
})

const PDFMergeActions = defineComponent({
  name: 'PDFMergeActions',
  template: '<div class="actions-stub" />',
})

describe('PDFMergerTool', () => {
  beforeEach(() => {
    successMock.mockReset()
    errorMock.mockReset()
    inspectPdfMock.mockReset()
    mergePdfsWithWorkerMock.mockReset()
    objectURLCounter = 0

    vi.spyOn(URL, 'createObjectURL').mockImplementation(() => `blob:file-${objectURLCounter++}`)
    vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {})
  })

  it('adds files, inspects page count and supports reorder/preview/remove', async () => {
    inspectPdfMock.mockResolvedValueOnce({ pageCount: 1 }).mockResolvedValueOnce({ pageCount: 2 })

    const wrapper = mount(PDFMergerTool, {
      global: {
        stubs: {
          PDFMergeUploader,
          PDFMergeQueue,
          PDFMergeActions,
        },
      },
    })

    const setupState = (
      wrapper.vm.$ as unknown as {
        setupState: {
          handleAddFile: (file: File) => void
          handleMoveDown: (index: number) => void
          handleReorder: (payload: { oldIndex: number | null; newIndex: number | null }) => void
          handlePreview: (index: number) => void
          handlePreviewVisible: (visible: boolean) => void
          handleRemove: (index: number) => void
          items: Array<{ file: File; pageCount: number }>
          totalPages: number
          currentPreviewItem: { id: string } | null
        }
      }
    ).setupState

    const firstFile = new File(['a'], 'a.pdf', { type: 'application/pdf' })
    const secondFile = new File(['b'], 'b.pdf', { type: 'application/pdf' })

    setupState.handleAddFile(firstFile)
    setupState.handleAddFile(secondFile)
    await flushPromises()

    expect(setupState.items).toHaveLength(2)
    expect(setupState.totalPages).toBe(3)

    setupState.handleMoveDown(0)
    expect(setupState.items[0]?.file.name).toBe('b.pdf')

    setupState.handleReorder({ oldIndex: 0, newIndex: 1 })
    expect(setupState.items[0]?.file.name).toBe('a.pdf')

    setupState.handlePreview(0)
    expect(setupState.currentPreviewItem).toBeTruthy()
    setupState.handlePreviewVisible(false)
    expect(setupState.currentPreviewItem).toBeNull()

    setupState.handleRemove(0)
    expect(setupState.items).toHaveLength(1)
    expect(URL.revokeObjectURL).toHaveBeenCalled()
  })

  it('sets inspection errors when PDF parsing fails', async () => {
    inspectPdfMock.mockRejectedValueOnce(new Error(PDF_ERROR.Invalid))

    const wrapper = mount(PDFMergerTool, {
      global: {
        stubs: {
          PDFMergeUploader,
          PDFMergeQueue,
          PDFMergeActions,
        },
      },
    })

    const setupState = (
      wrapper.vm.$ as unknown as {
        setupState: {
          handleAddFile: (file: File) => void
          items: Array<{ errorCode: string | null; isLoading: boolean }>
        }
      }
    ).setupState

    setupState.handleAddFile(new File(['x'], 'bad.pdf', { type: 'application/pdf' }))
    await flushPromises()

    expect(setupState.items[0]?.isLoading).toBe(false)
    expect(setupState.items[0]?.errorCode).toBe(PDF_ERROR.Invalid)
  })

  it('merges files successfully and reports completion', async () => {
    inspectPdfMock.mockResolvedValue({ pageCount: 1 })
    const mergedBlob = new Blob(['merged'], { type: 'application/pdf' })
    mergePdfsWithWorkerMock.mockResolvedValue(mergedBlob)

    const wrapper = mount(PDFMergerTool, {
      global: {
        stubs: {
          PDFMergeUploader,
          PDFMergeQueue,
          PDFMergeActions,
        },
      },
    })

    const setupState = (
      wrapper.vm.$ as unknown as {
        setupState: {
          handleAddFile: (file: File) => void
          handleMerge: () => Promise<void>
          downloadUrl: string | null
          mergeErrorMessage: string
        }
      }
    ).setupState

    const file1 = new File(['1'], 'one.pdf', { type: 'application/pdf' })
    const file2 = new File(['2'], 'two.pdf', { type: 'application/pdf' })

    setupState.handleAddFile(file1)
    setupState.handleAddFile(file2)
    await flushPromises()

    await setupState.handleMerge()

    expect(mergePdfsWithWorkerMock).toHaveBeenCalledWith([file1, file2])
    expect(setupState.downloadUrl).toBe('blob:merged')
    expect(setupState.mergeErrorMessage).toBe('')
    expect(successMock).toHaveBeenCalledWith('mergeSuccess')
  })

  it('shows readable merge errors and clears all items', async () => {
    inspectPdfMock.mockResolvedValue({ pageCount: 1 })
    mergePdfsWithWorkerMock.mockRejectedValueOnce(new Error(PDF_ERROR.Encrypted))

    const wrapper = mount(PDFMergerTool, {
      global: {
        stubs: {
          PDFMergeUploader,
          PDFMergeQueue,
          PDFMergeActions,
        },
      },
    })

    const setupState = (
      wrapper.vm.$ as unknown as {
        setupState: {
          handleAddFile: (file: File) => void
          handleMerge: () => Promise<void>
          handleClearAll: () => void
          mergeErrorMessage: string
          items: unknown[]
        }
      }
    ).setupState

    setupState.handleAddFile(new File(['1'], 'one.pdf', { type: 'application/pdf' }))
    setupState.handleAddFile(new File(['2'], 'two.pdf', { type: 'application/pdf' }))
    await flushPromises()

    await setupState.handleMerge()

    expect(setupState.mergeErrorMessage).toBe('errorEncrypted')
    expect(errorMock).toHaveBeenCalledWith('errorEncrypted')

    setupState.handleClearAll()
    expect(setupState.items).toHaveLength(0)
  })

  it('releases preview URLs on unmount', async () => {
    inspectPdfMock.mockResolvedValue({ pageCount: 1 })

    const wrapper = mount(PDFMergerTool, {
      global: {
        stubs: {
          PDFMergeUploader,
          PDFMergeQueue,
          PDFMergeActions,
        },
      },
    })

    const setupState = (
      wrapper.vm.$ as unknown as {
        setupState: {
          handleAddFile: (file: File) => void
        }
      }
    ).setupState

    setupState.handleAddFile(new File(['1'], 'one.pdf', { type: 'application/pdf' }))
    await flushPromises()

    wrapper.unmount()

    expect(URL.revokeObjectURL).toHaveBeenCalled()
  })
})
