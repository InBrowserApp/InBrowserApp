import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
const messageError = vi.fn()
vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')
  const stub = (name: string, tag = 'div') =>
    defineComponent({
      name,
      inheritAttrs: false,
      template: `<${tag} v-bind="$attrs"><slot /></${tag}>`,
    })
  const actual = (await vi.importActual('naive-ui')) as Record<string, unknown>
  return {
    ...actual,
    useMessage: () => ({ error: messageError }),
    NUpload: stub('NUpload'),
    NUploadDragger: stub('NUploadDragger'),
    NIcon: stub('NIcon'),
    NText: stub('NText', 'span'),
    NP: stub('NP', 'p'),
  }
})
import PDFMergeUploader from './PDFMergeUploader.vue'
describe('PDFMergeUploader', () => {
  beforeEach(() => {
    messageError.mockReset()
  })
  it('emits add-file when a PDF is selected', async () => {
    const wrapper = mount(PDFMergeUploader, {
      global: {
        stubs: {
          ToolSection: { template: '<section><slot /></section>' },
          ToolSectionHeader: { template: '<h2><slot /></h2>' },
        },
      },
    })
    const file = new File(['pdf'], 'demo.pdf', { type: 'application/pdf' })
    const setupState = (
      wrapper.vm.$ as unknown as {
        setupState: {
          handleBeforeUpload: (payload: unknown) => Promise<boolean>
        }
      }
    ).setupState
    const result = await setupState.handleBeforeUpload({
      file: { file },
      fileList: [{ file }],
    })
    expect(result).toBe(false)
    expect(wrapper.emitted('add-file')?.[0]?.[0]).toBe(file)
    expect(messageError).not.toHaveBeenCalled()
  })
  it('shows error when selected file is not a PDF', async () => {
    const wrapper = mount(PDFMergeUploader, {
      global: {
        stubs: {
          ToolSection: { template: '<section><slot /></section>' },
          ToolSectionHeader: { template: '<h2><slot /></h2>' },
        },
      },
    })
    const file = new File(['txt'], 'notes.txt', { type: 'text/plain' })
    const setupState = (
      wrapper.vm.$ as unknown as {
        setupState: {
          handleBeforeUpload: (payload: unknown) => Promise<boolean>
        }
      }
    ).setupState
    const result = await setupState.handleBeforeUpload({
      file: { file },
      fileList: [{ file }],
    })
    expect(result).toBe(false)
    expect(wrapper.emitted('add-file')).toBeFalsy()
    expect(messageError).toHaveBeenCalledWith('Only PDF files are allowed')
  })
})
it('ignores empty upload payloads', async () => {
  const wrapper = mount(PDFMergeUploader, {
    global: {
      stubs: {
        ToolSection: { template: '<section><slot /></section>' },
        ToolSectionHeader: { template: '<h2><slot /></h2>' },
      },
    },
  })
  const setupState = (
    wrapper.vm.$ as unknown as {
      setupState: {
        handleBeforeUpload: (payload: unknown) => Promise<boolean>
      }
    }
  ).setupState
  const result = await setupState.handleBeforeUpload({
    file: { file: null },
    fileList: [],
  })
  expect(result).toBe(false)
  expect(wrapper.emitted('add-file')).toBeFalsy()
})
