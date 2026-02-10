import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import DataUriDetailsSection from './DataUriDetailsSection.vue'

const ToolSectionStub = defineComponent({
  template: '<section><slot /></section>',
})

const ToolSectionHeaderStub = defineComponent({
  template: '<h2><slot /></h2>',
})

const NDescriptionsStub = defineComponent({
  template: '<div><slot /></div>',
})

const NDescriptionsItemStub = defineComponent({
  template: '<div><slot /></div>',
})

const NTextStub = defineComponent({
  template: '<span><slot /></span>',
})

describe('DataUriDetailsSection', () => {
  it('renders base64 details and formatted size', () => {
    const wrapper = mount(DataUriDetailsSection, {
      props: {
        mimeType: 'text/plain',
        isBase64: true,
        size: 0,
      },
      global: {
        stubs: {
          ToolSection: ToolSectionStub,
          ToolSectionHeader: ToolSectionHeaderStub,
          NDescriptions: NDescriptionsStub,
          NDescriptionsItem: NDescriptionsItemStub,
          NText: NTextStub,
        },
      },
    })

    expect(wrapper.text()).toContain('text/plain')
    expect(wrapper.text()).toContain('Base64')
    expect(wrapper.text()).toContain('0 Bytes')
  })

  it('renders url-encoded details', () => {
    const wrapper = mount(DataUriDetailsSection, {
      props: {
        mimeType: 'text/plain',
        isBase64: false,
        size: 1024,
      },
      global: {
        stubs: {
          ToolSection: ToolSectionStub,
          ToolSectionHeader: ToolSectionHeaderStub,
          NDescriptions: NDescriptionsStub,
          NDescriptionsItem: NDescriptionsItemStub,
          NText: NTextStub,
        },
      },
    })

    expect(wrapper.text()).toContain('URL-encoded')
    expect(wrapper.text()).toContain('1 KB')
  })
})
