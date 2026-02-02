import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import FileUpload from './FileUpload.vue'

const messageMocks = vi.hoisted(() => ({
  error: vi.fn(),
}))

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')
  const makeStub = (name: string) =>
    defineComponent({
      name,
      template: '<div><slot /></div>',
    })

  return {
    useMessage: () => messageMocks,
    NUpload: makeStub('NUpload'),
    NUploadDragger: makeStub('NUploadDragger'),
    NIcon: makeStub('NIcon'),
    NText: makeStub('NText'),
    NP: makeStub('NP'),
    NFlex: makeStub('NFlex'),
    NButton: makeStub('NButton'),
    NImage: makeStub('NImage'),
  }
})

vi.mock('@vueuse/core', async () => {
  const actual = await vi.importActual<typeof import('@vueuse/core')>('@vueuse/core')
  return {
    ...actual,
    useObjectUrl: () => ref('blob:preview'),
  }
})

vi.mock('filesize', () => ({
  filesize: (value: number) => `${value} bytes`,
}))

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({ t: (key: string) => key }),
  }
})

const createPayload = (file?: File, fileList?: Array<{ file?: File }>) => ({
  file: { file },
  fileList: fileList ?? (file ? [{ file }] : []),
})

const mountFileUpload = (file: File | null = null) =>
  mount(FileUpload, {
    props: {
      file,
    },
    global: {
      stubs: {
        ToolSection: {
          template: '<section><slot /></section>',
        },
        ToolSectionHeader: {
          template: '<h2><slot /></h2>',
        },
      },
    },
  })

describe('FileUpload', () => {
  beforeEach(() => {
    messageMocks.error.mockReset()
  })

  it('ignores empty uploads', async () => {
    const wrapper = mountFileUpload()

    const vm = wrapper.vm as unknown as {
      handleBeforeUpload: (payload: unknown) => Promise<boolean>
    }

    const result = await vm.handleBeforeUpload(createPayload())
    expect(result).toBe(false)
    expect(messageMocks.error).not.toHaveBeenCalled()
    expect(wrapper.emitted('update:file')).toBeUndefined()
  })

  it('rejects multiple files and non-png types', async () => {
    const wrapper = mountFileUpload()

    const vm = wrapper.vm as unknown as {
      handleBeforeUpload: (payload: unknown) => Promise<boolean>
    }

    const pngFile = new File(['data'], 'sample.png', { type: 'image/png' })
    await vm.handleBeforeUpload(createPayload(pngFile, [{ file: pngFile }, { file: pngFile }]))
    expect(messageMocks.error).toHaveBeenCalledWith('onlyOneFile')

    const jpegFile = new File(['data'], 'sample.jpg', { type: 'image/jpeg' })
    await vm.handleBeforeUpload(createPayload(jpegFile, [{ file: jpegFile }]))
    expect(messageMocks.error).toHaveBeenCalledWith('invalidFileType')
  })

  it('accepts a png file and clears it', async () => {
    const wrapper = mountFileUpload()

    const vm = wrapper.vm as unknown as {
      handleBeforeUpload: (payload: unknown) => Promise<boolean>
      handleClearFile: () => void
    }

    const pngFile = new File(['data'], 'sample.png', { type: 'image/png' })
    const result = await vm.handleBeforeUpload(createPayload(pngFile))

    expect(result).toBe(false)
    const events = wrapper.emitted('update:file') ?? []
    expect(events[events.length - 1]).toEqual([pngFile])

    vm.handleClearFile()
    const cleared = wrapper.emitted('update:file') ?? []
    expect(cleared[cleared.length - 1]).toEqual([null])
  })
})
