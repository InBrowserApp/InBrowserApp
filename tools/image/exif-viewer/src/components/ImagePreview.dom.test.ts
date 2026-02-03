import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import ImagePreview from './ImagePreview.vue'

const vueUseMocks = vi.hoisted(() => ({
  useObjectUrl: vi.fn(() => 'blob://preview'),
}))

vi.mock('@vueuse/core', () => ({
  useObjectUrl: vueUseMocks.useObjectUrl,
}))

vi.mock('filesize', () => ({
  filesize: () => '1 KB',
}))

vi.mock('vue-i18n', async (importOriginal) => {
  const actual = await importOriginal<typeof import('vue-i18n')>()
  return {
    ...actual,
    useI18n: () => ({
      t: (key: string) => key,
    }),
  }
})

const ToolSectionStub = defineComponent({
  name: 'ToolSection',
  template: '<section class="tool-section"><slot /></section>',
})

const NImageStub = defineComponent({
  name: 'NImage',
  props: { src: { type: String, default: '' } },
  template: '<img class="n-image" :src="src" />',
})

const NFlexStub = defineComponent({
  name: 'NFlex',
  template: '<div class="n-flex"><slot /></div>',
})

const NTextStub = defineComponent({
  name: 'NText',
  template: '<span class="n-text"><slot /></span>',
})

const NButtonStub = defineComponent({
  name: 'NButton',
  emits: ['click'],
  template: '<button class="n-button" @click="$emit(\'click\')"><slot /></button>',
})

const NIconStub = defineComponent({
  name: 'NIcon',
  template: '<span class="n-icon"><slot /></span>',
})

describe('ImagePreview', () => {
  it('renders file details and emits clear', async () => {
    const file = new File(['data'], 'photo.jpg', { type: 'image/jpeg' })

    const wrapper = mount(ImagePreview, {
      props: { file },
      global: {
        stubs: {
          ToolSection: ToolSectionStub,
          NImage: NImageStub,
          NFlex: NFlexStub,
          NText: NTextStub,
          NButton: NButtonStub,
          NIcon: NIconStub,
        },
      },
    })

    expect(vueUseMocks.useObjectUrl).toHaveBeenCalled()
    expect(wrapper.text()).toContain('photo.jpg')
    expect(wrapper.text()).toContain('1 KB')

    await wrapper.find('button.n-button').trigger('click')
    expect(wrapper.emitted('clear')).toHaveLength(1)
  })
})
