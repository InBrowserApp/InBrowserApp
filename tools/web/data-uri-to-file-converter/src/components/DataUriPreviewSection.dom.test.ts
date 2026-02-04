import { describe, it, expect } from 'vitest'
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

describe('DataUriPreviewSection', () => {
  it('renders image preview content', () => {
    const wrapper = mount(DataUriPreviewSection, {
      props: {
        previewKind: 'image',
        previewUrl: 'blob:image',
        textPreview: '',
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

    const image = wrapper.get('img')
    expect(image.attributes('src')).toBe('blob:image')
    expect(wrapper.text()).toContain('Preview')
  })

  it('renders text preview content', () => {
    const wrapper = mount(DataUriPreviewSection, {
      props: {
        previewKind: 'text',
        previewUrl: '',
        textPreview: 'Hello World',
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

    expect(wrapper.find('img').exists()).toBe(false)
    expect(wrapper.get('code').text()).toBe('Hello World')
  })
})
