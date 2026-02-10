import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import CsvToJsonConverterView from './CsvToJsonConverterView.vue'

vi.mock('@shared/ui/tool', () => ({
  ToolDefaultPageLayout: {
    name: 'ToolDefaultPageLayout',
    props: ['info'],
    template: '<div class="layout" :data-tool-id="info.toolID"><slot /></div>',
  },
}))

const ConverterStub = defineComponent({
  name: 'CsvToJsonConverter',
  template: '<div class="converter" />',
})

describe('CsvToJsonConverterView', () => {
  it('renders the converter inside the tool layout', () => {
    const wrapper = mount(CsvToJsonConverterView, {
      global: {
        stubs: {
          CsvToJsonConverter: ConverterStub,
        },
      },
    })

    const layout = wrapper.find('.layout')
    expect(layout.exists()).toBe(true)
    expect(layout.attributes('data-tool-id')).toBe('csv-to-json-converter')
    expect(wrapper.find('.converter').exists()).toBe(true)
  })
})
