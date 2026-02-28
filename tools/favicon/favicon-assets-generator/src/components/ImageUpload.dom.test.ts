import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'

const messageErrorMock = vi.fn()

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')

  const Base = defineComponent({
    inheritAttrs: false,
    template: '<div v-bind="$attrs"><slot /></div>',
  })

  const NUpload = defineComponent({
    name: 'NUpload',
    inheritAttrs: false,
    emits: ['before-upload'],
    template: '<div v-bind="$attrs"><slot /></div>',
  })

  return {
    NUpload,
    NUploadDragger: Base,
    NIcon: Base,
    NText: Base,
    useMessage: () => ({
      error: messageErrorMock,
    }),
  }
})

import ImageUpload from './ImageUpload.vue'

describe('ImageUpload', () => {
  beforeEach(() => {
    messageErrorMock.mockReset()
  })

  it('rejects multiple file uploads', async () => {
    const updateSpy = vi.fn()
    const wrapper = mount(ImageUpload, {
      props: {
        file: undefined,
        'onUpdate:file': updateSpy,
      },
    })

    const upload = wrapper.findComponent({ name: 'NUpload' })
    upload.vm.$emit('before-upload', {
      file: { file: { type: 'image/png' } },
      fileList: [{}, {}],
    })
    await flushPromises()

    expect(messageErrorMock).toHaveBeenCalledWith('Only one file can be uploaded')
    expect(updateSpy).not.toHaveBeenCalled()
  })

  it('rejects non-image files', async () => {
    const updateSpy = vi.fn()
    const wrapper = mount(ImageUpload, {
      props: {
        file: undefined,
        'onUpdate:file': updateSpy,
      },
    })

    const upload = wrapper.findComponent({ name: 'NUpload' })
    upload.vm.$emit('before-upload', {
      file: { file: { type: 'text/plain' } },
      fileList: [{}],
    })
    await flushPromises()

    expect(messageErrorMock).toHaveBeenCalledWith('Only image files are allowed')
    expect(updateSpy).not.toHaveBeenCalled()
  })

  it('accepts image files and updates the model', async () => {
    const updateSpy = vi.fn()
    const file = { type: 'image/png' }
    const wrapper = mount(ImageUpload, {
      props: {
        file: undefined,
        'onUpdate:file': updateSpy,
      },
    })

    const upload = wrapper.findComponent({ name: 'NUpload' })
    upload.vm.$emit('before-upload', {
      file: { file },
      fileList: [{}],
    })
    await flushPromises()

    expect(messageErrorMock).not.toHaveBeenCalled()
    expect(updateSpy).toHaveBeenCalledWith(file)
  })
})
