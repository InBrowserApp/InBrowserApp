import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import ImageUpload from './ImageUpload.vue'

vi.mock('vue-i18n', async (importOriginal) => {
  const actual = await importOriginal<typeof import('vue-i18n')>()
  return {
    ...actual,
    useI18n: () => ({
      t: (key: string) => key,
    }),
  }
})

vi.mock('@shared/ui/tool', () => ({
  ToolSection: {
    name: 'ToolSection',
    template: '<section class="tool-section"><slot /></section>',
  },
}))

vi.mock('@vicons/fluent/Image24Regular', () => ({
  default: defineComponent({ name: 'ImageIcon', template: '<span class="image-icon" />' }),
}))

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')

  return {
    NUpload: defineComponent({
      name: 'NUpload',
      emits: ['before-upload'],
      template: '<div class="n-upload"><slot /></div>',
    }),
    NUploadDragger: defineComponent({
      name: 'NUploadDragger',
      template: '<div class="n-upload-dragger"><slot /></div>',
    }),
    NIcon: defineComponent({
      name: 'NIcon',
      template: '<span class="n-icon"><slot /></span>',
    }),
    NText: defineComponent({
      name: 'NText',
      template: '<span class="n-text"><slot /></span>',
    }),
    NP: defineComponent({
      name: 'NP',
      template: '<p class="n-p"><slot /></p>',
    }),
  }
})

describe('ImageUpload', () => {
  it('emits file updates when a file is selected', async () => {
    const file = new File(['data'], 'photo.jpg', { type: 'image/jpeg' })

    const wrapper = mount(ImageUpload, {
      props: {
        file: null,
      },
    })

    const upload = wrapper.findComponent({ name: 'NUpload' })
    upload.vm.$emit('before-upload', { file: { file }, fileList: [] })

    expect(wrapper.emitted('update:file')?.[0]).toEqual([file])
  })

  it('skips updates when no file is provided', () => {
    const wrapper = mount(ImageUpload, {
      props: {
        file: null,
      },
    })

    const upload = wrapper.findComponent({ name: 'NUpload' })
    upload.vm.$emit('before-upload', { file: {}, fileList: [] })

    expect(wrapper.emitted('update:file')).toBeUndefined()
  })
})
