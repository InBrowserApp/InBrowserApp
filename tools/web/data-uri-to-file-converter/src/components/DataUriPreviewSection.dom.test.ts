import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import DataUriPreviewSection from './DataUriPreviewSection.vue'

const ToolSectionStub = defineComponent({
  template: '<section><slot /></section>',
})

const ToolSectionHeaderStub = defineComponent({
  template: '<h2><slot /></h2>',
})

const NCardStub = defineComponent({
  template: '<div><slot /></div>',
})

const NCodeStub = defineComponent({
  props: {
    code: String,
  },
  template: '<code>{{ code }}</code>',
})

const mountPreviewSection = (previewKind: 'image' | 'audio' | 'video' | 'text' | null) => {
  return mount(DataUriPreviewSection, {
    props: {
      previewKind,
      previewUrl: `blob:${previewKind ?? 'none'}`,
      textPreview: previewKind === 'text' ? 'Hello World' : '',
    },
    global: {
      stubs: {
        ToolSection: ToolSectionStub,
        ToolSectionHeader: ToolSectionHeaderStub,
        NCard: NCardStub,
        NCode: NCodeStub,
      },
    },
  })
}

describe('DataUriPreviewSection', () => {
  it('renders image preview content', () => {
    const wrapper = mountPreviewSection('image')

    const image = wrapper.get('img')
    expect(image.attributes('src')).toBe('blob:image')
    expect(wrapper.text()).toContain('Preview')
  })

  it('renders video preview content', () => {
    const wrapper = mountPreviewSection('video')

    const video = wrapper.get('video')
    expect(video.attributes('src')).toBe('blob:video')
  })

  it('renders audio preview content', () => {
    const wrapper = mountPreviewSection('audio')

    const audio = wrapper.get('audio')
    expect(audio.attributes('src')).toBe('blob:audio')
  })

  it('renders no media element for unsupported preview kinds', () => {
    const wrapper = mountPreviewSection('binary' as unknown as 'image' | 'audio' | 'video' | 'text')

    expect(wrapper.find('img').exists()).toBe(false)
    expect(wrapper.find('audio').exists()).toBe(false)
    expect(wrapper.find('video').exists()).toBe(false)
  })

  it('renders text preview content', () => {
    const wrapper = mountPreviewSection('text')

    expect(wrapper.find('img').exists()).toBe(false)
    expect(wrapper.get('code').text()).toBe('Hello World')
  })
})
