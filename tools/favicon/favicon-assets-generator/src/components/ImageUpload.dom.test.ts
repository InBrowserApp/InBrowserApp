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

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({
      t: (key: string) => key,
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

    expect(messageErrorMock).toHaveBeenCalledWith('onlyOneFileCanBeUploaded')
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

    expect(messageErrorMock).toHaveBeenCalledWith('onlyImageFilesAreAllowed')
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
