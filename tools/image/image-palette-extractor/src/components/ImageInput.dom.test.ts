import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import type { UploadFileInfo } from 'naive-ui'
import ImageInput from './ImageInput.vue'

const messageMock = {
  error: vi.fn(),
}

const objectUrlState = vi.hoisted(() => ({
  value: 'available' as 'available' | 'missing',
}))

vi.mock('@vueuse/core', async () => {
  const actual = await vi.importActual<typeof import('@vueuse/core')>('@vueuse/core')
  const { computed, isRef } = await import('vue')

  return {
    ...actual,
    useObjectUrl: (source: unknown) =>
      computed(() => {
        if (objectUrlState.value === 'missing') {
          return null
        }
        const value = isRef(source) ? source.value : source
        return value ? 'blob:preview' : null
      }),
  }
})

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')

  const NUpload = defineComponent({
    name: 'NUpload',
    emits: ['before-upload'],
    template: '<div><slot /></div>',
  })

  const NUploadDragger = defineComponent({
    name: 'NUploadDragger',
    template: '<div><slot /></div>',
  })

  const NIcon = defineComponent({
    name: 'NIcon',
    template: '<i><slot /></i>',
  })

  const NText = defineComponent({
    name: 'NText',
    template: '<span><slot /></span>',
  })

  const NP = defineComponent({
    name: 'NP',
    template: '<p><slot /></p>',
  })

  const NFlex = defineComponent({
    name: 'NFlex',
    template: '<div><slot /></div>',
  })

  const NButton = defineComponent({
    name: 'NButton',
    emits: ['click'],
    template: '<button @click="$emit(\'click\')"><slot name="icon" /><slot /></button>',
  })

  const NImage = defineComponent({
    name: 'NImage',
    template: '<img />',
  })

  return {
    useMessage: () => messageMock,
    NUpload,
    NUploadDragger,
    NIcon,
    NText,
    NP,
    NFlex,
    NButton,
    NImage,
  }
})

type ImageInputProps = InstanceType<typeof ImageInput>['$props']

const ToolSectionStub = {
  template: '<div><slot /></div>',
}

const ToolSectionHeaderStub = {
  template: '<div><slot /></div>',
}

const mountInput = (props: ImageInputProps) =>
  mount(ImageInput, {
    props,
    global: {
      stubs: {
        ToolSection: ToolSectionStub,
        ToolSectionHeader: ToolSectionHeaderStub,
      },
    },
  })

describe('ImageInput', () => {
  beforeEach(() => {
    messageMock.error.mockClear()
    objectUrlState.value = 'available'
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:test')
    vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('emits update when a file is uploaded', () => {
    const wrapper = mountInput({ file: null })
    const file = new File(['data'], 'sample.png', { type: 'image/png' })
    const uploadFile: UploadFileInfo = {
      id: 'upload',
      name: file.name,
      status: 'finished',
      file,
    }

    wrapper.findComponent({ name: 'NUpload' }).vm.$emit('before-upload', {
      file: uploadFile,
      fileList: [uploadFile],
    })
    const emitted = wrapper.emitted('update:file')
    expect(emitted?.[0]).toEqual([file])
  })

  it('ignores empty upload payloads', () => {
    const wrapper = mountInput({ file: null })
    const uploadFile = {
      id: 'upload',
      name: 'empty',
      status: 'finished',
      file: null,
    } as unknown as UploadFileInfo

    wrapper.findComponent({ name: 'NUpload' }).vm.$emit('before-upload', {
      file: uploadFile,
      fileList: [],
    })
    expect(messageMock.error).not.toHaveBeenCalled()
    expect(wrapper.emitted('update:file')).toBeUndefined()
  })

  it('rejects multiple file selections', () => {
    const wrapper = mountInput({ file: null })
    const file = new File(['data'], 'sample.png', { type: 'image/png' })
    const uploadFile: UploadFileInfo = {
      id: 'upload',
      name: file.name,
      status: 'finished',
      file,
    }

    wrapper.findComponent({ name: 'NUpload' }).vm.$emit('before-upload', {
      file: uploadFile,
      fileList: [uploadFile, uploadFile],
    })
    expect(messageMock.error).toHaveBeenCalledWith('Only one file can be uploaded')
    expect(wrapper.emitted('update:file')).toBeUndefined()
  })

  it('rejects invalid file types', () => {
    const wrapper = mountInput({ file: null })
    const file = new File(['data'], 'sample.txt', { type: 'text/plain' })
    const uploadFile: UploadFileInfo = {
      id: 'upload',
      name: file.name,
      status: 'finished',
      file,
    }

    wrapper.findComponent({ name: 'NUpload' }).vm.$emit('before-upload', {
      file: uploadFile,
      fileList: [uploadFile],
    })
    expect(messageMock.error).toHaveBeenCalledWith('Please select a valid image file')
    expect(wrapper.emitted('update:file')).toBeUndefined()
  })

  it('renders dimensions when provided', () => {
    const file = new File(['data'], 'sample.png', { type: 'image/png' })
    const wrapper = mountInput({ file, dimensions: { width: 120, height: 80 } })

    expect(wrapper.text()).toContain('120 x 80 px')
  })

  it('renders file details without a preview when object URLs are unavailable', () => {
    objectUrlState.value = 'missing'
    const file = new File(['data'], 'sample.png', { type: 'image/png' })
    const wrapper = mountInput({ file })

    expect(wrapper.find('img').exists()).toBe(false)
    expect(wrapper.text()).toContain('sample.png')
  })

  it('emits update when remove is clicked', async () => {
    const file = new File(['data'], 'sample.png', { type: 'image/png' })
    const wrapper = mountInput({ file })

    const button = wrapper.find('button')
    await button.trigger('click')

    await wrapper.vm.$nextTick()
    const emitted = wrapper.emitted('update:file')
    expect(emitted?.[0]).toEqual([null])
  })
})
