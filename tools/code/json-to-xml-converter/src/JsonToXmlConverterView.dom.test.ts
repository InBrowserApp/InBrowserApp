import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import JsonToXmlConverterView from './JsonToXmlConverterView.vue'

vi.mock('@shared/ui/tool', () => ({
  ToolDefaultPageLayout: {
    name: 'ToolDefaultPageLayout',
    props: ['info'],
    template: '<div class="layout" :data-tool-id="info.toolID"><slot /></div>',
  },
}))

const ConverterStub = defineComponent({
  name: 'JsonToXmlConverter',
  template: '<div class="converter" />',
})

describe('JsonToXmlConverterView', () => {
  it('renders the converter inside the tool layout', () => {
    const wrapper = mount(JsonToXmlConverterView, {
      global: {
        stubs: {
          JsonToXmlConverter: ConverterStub,
        },
      },
    })

    const layout = wrapper.find('.layout')
    expect(layout.exists()).toBe(true)
    expect(layout.attributes('data-tool-id')).toBe('json-to-xml-converter')
    expect(wrapper.find('.converter').exists()).toBe(true)
  })
})
