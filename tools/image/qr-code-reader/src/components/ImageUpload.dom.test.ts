import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import ImageUpload from './ImageUpload.vue'
import { readQRFromFile } from '../qr-reader'
vi.mock('@vueuse/core', async () => {
  const { computed } = await import('vue')
  return {
    useObjectUrl: (source: { value: File | null }) =>
      computed(() => (source.value ? 'blob:preview' : '')),
  }
})
vi.mock('../qr-reader', async () => {
  const actual = await vi.importActual<typeof import('../qr-reader')>('../qr-reader')
  return {
    ...actual,
    readQRFromFile: vi.fn(),
  }
})
vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')
  const actual = (await vi.importActual('naive-ui')) as Record<string, unknown>
  return {
    ...actual,
    NUpload: defineComponent({
      name: 'NUpload',
      emits: ['before-upload'],
      template: '<div class="n-upload"><slot /></div>',
    }),
    NUploadDragger: defineComponent({
      name: 'NUploadDragger',
      template: '<div class="n-upload-dragger"><slot /></div>',
    }),
    NButton: defineComponent({
      name: 'NButton',
      emits: ['click'],
      template:
        '<button class="n-button" @click="$emit(\'click\')"><slot name="icon" /><slot /></button>',
    }),
  }
})
const readQRFromFileMock = vi.mocked(readQRFromFile)
describe('ImageUpload', () => {
  beforeEach(() => {
    readQRFromFileMock.mockReset()
  })
  it('decodes QR data from an uploaded file', async () => {
    readQRFromFileMock.mockResolvedValue('decoded')
    const wrapper = mount(ImageUpload, {
      props: {
        file: null,
      },
    })
    const file = new File(['data'], 'qr.png', { type: 'image/png' })
    wrapper.findComponent({ name: 'NUpload' }).vm.$emit('before-upload', {
      file: { file },
      fileList: [],
    })
    await flushPromises()
    expect(readQRFromFileMock).toHaveBeenCalledWith(file)
    expect(wrapper.emitted('decoded')).toEqual([['decoded']])
    expect(wrapper.emitted('update:file')?.[0]).toEqual([file])
  })
  it('ignores upload events without a file payload', async () => {
    const wrapper = mount(ImageUpload, {
      props: {
        file: null,
      },
    })
    wrapper.findComponent({ name: 'NUpload' }).vm.$emit('before-upload', {
      file: { file: undefined },
      fileList: [],
    })
    await flushPromises()
    expect(readQRFromFileMock).not.toHaveBeenCalled()
    expect(wrapper.emitted('decoded')).toBeUndefined()
    expect(wrapper.emitted('error')).toBeUndefined()
    expect(wrapper.emitted('update:file')).toBeUndefined()
  })
  it('emits errors when no QR code is found', async () => {
    readQRFromFileMock.mockResolvedValue(null)
    const wrapper = mount(ImageUpload, {
      props: {
        file: null,
      },
    })
    const file = new File(['data'], 'qr.png', { type: 'image/png' })
    wrapper.findComponent({ name: 'NUpload' }).vm.$emit('before-upload', {
      file: { file },
      fileList: [],
    })
    await flushPromises()
    expect(wrapper.emitted('error')).toEqual([['No QR code found in the image']])
  })
  it('emits errors when image decoding fails', async () => {
    readQRFromFileMock.mockRejectedValue(new Error('boom'))
    const wrapper = mount(ImageUpload, {
      props: {
        file: null,
      },
    })
    const file = new File(['data'], 'qr.png', { type: 'image/png' })
    wrapper.findComponent({ name: 'NUpload' }).vm.$emit('before-upload', {
      file: { file },
      fileList: [],
    })
    await flushPromises()
    expect(wrapper.emitted('error')).toEqual([['Failed to read the image']])
  })
  it('clears file and errors when uploading another image', async () => {
    readQRFromFileMock.mockResolvedValue('decoded')
    const wrapper = mount(ImageUpload, {
      props: {
        file: null,
      },
    })
    const file = new File(['data'], 'qr.png', { type: 'image/png' })
    wrapper.findComponent({ name: 'NUpload' }).vm.$emit('before-upload', {
      file: { file },
      fileList: [],
    })
    await flushPromises()
    await wrapper.find('button.n-button').trigger('click')
    await flushPromises()
    const errors = wrapper.emitted('error') ?? []
    expect(errors[errors.length - 1]).toEqual([''])
  })
})
