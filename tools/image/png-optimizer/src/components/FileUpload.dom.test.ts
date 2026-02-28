import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import FileUpload from './FileUpload.vue'

const messageMocks = vi.hoisted(() => ({
  error: vi.fn(),
}))

const objectUrlState = vi.hoisted(() => ({
  previewUrl: 'blob:preview' as string | null,
}))

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')
  const makeStub = (name: string) =>
    defineComponent({
      name,
      template: '<div><slot /></div>',
    })

  const NButton = defineComponent({
    name: 'NButton',
    template: '<button><slot name="icon" /><slot /></button>',
  })

  const NImage = defineComponent({
    name: 'NImage',
    inheritAttrs: false,
    template: '<img class="preview" v-bind="$attrs" />',
  })

  return {
    useMessage: () => messageMocks,
    NUpload: makeStub('NUpload'),
    NUploadDragger: makeStub('NUploadDragger'),
    NIcon: makeStub('NIcon'),
    NText: makeStub('NText'),
    NP: makeStub('NP'),
    NFlex: makeStub('NFlex'),
    NButton,
    NImage,
  }
})

vi.mock('@vueuse/core', async () => {
  const actual = await vi.importActual<typeof import('@vueuse/core')>('@vueuse/core')
  return {
    ...actual,
    useObjectUrl: () => ref(objectUrlState.previewUrl),
  }
})

vi.mock('filesize', () => ({
  filesize: (value: number) => `${value} bytes`,
}))

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
    objectUrlState.previewUrl = 'blob:preview'
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
    expect(messageMocks.error).toHaveBeenCalledWith('Only one file can be uploaded')

    const jpegFile = new File(['data'], 'sample.jpg', { type: 'image/jpeg' })
    await vm.handleBeforeUpload(createPayload(jpegFile, [{ file: jpegFile }]))
    expect(messageMocks.error).toHaveBeenCalledWith('Please select a valid PNG image file')
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

  it('falls back to an empty preview src when object URL is missing', () => {
    objectUrlState.previewUrl = null

    const file = new File(['data'], 'sample.png', { type: 'image/png' })
    const wrapper = mountFileUpload(file)

    const preview = wrapper.find('img.preview')
    expect(preview.attributes('src')).toBe('')
  })
})
