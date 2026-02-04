import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import TomlToYamlConverterView from './TomlToYamlConverterView.vue'
import * as toolInfo from './info'

const LayoutStub = defineComponent({
  name: 'ToolDefaultPageLayout',
  props: {
    info: {
      type: Object,
      default: () => ({}),
    },
  },
  template: '<div data-layout :data-tool-id="info.toolID"><slot /></div>',
})

const ConverterStub = defineComponent({
  name: 'TomlToYamlConverter',
  template: '<div data-testid="converter" />',
})

describe('TomlToYamlConverterView', () => {
  it('renders the layout and converter', () => {
    const wrapper = mount(TomlToYamlConverterView, {
      global: {
        stubs: {
          ToolDefaultPageLayout: LayoutStub,
          TomlToYamlConverter: ConverterStub,
        },
      },
    })

    const layout = wrapper.get('[data-layout]')
    expect(layout.attributes('data-tool-id')).toBe(toolInfo.toolID)
    expect(wrapper.find('[data-testid="converter"]').exists()).toBe(true)
  })
})
