import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import YamlToTomlConverterView from './YamlToTomlConverterView.vue'
import * as toolInfo from './info'

const ToolDefaultPageLayoutStub = defineComponent({
  name: 'ToolDefaultPageLayout',
  props: {
    info: {
      type: Object,
      required: true,
    },
  },
  template: '<div class="layout"><slot /></div>',
})

const YamlToTomlConverterStub = defineComponent({
  name: 'YamlToTomlConverter',
  template: '<div class="yaml-to-toml-converter" />',
})

describe('YamlToTomlConverterView', () => {
  it('renders the layout with tool info', () => {
    const wrapper = mount(YamlToTomlConverterView, {
      global: {
        stubs: {
          ToolDefaultPageLayout: ToolDefaultPageLayoutStub,
          YamlToTomlConverter: YamlToTomlConverterStub,
        },
      },
    })

    const layout = wrapper.findComponent(ToolDefaultPageLayoutStub)
    expect(layout.exists()).toBe(true)
    expect(layout.props('info')).toEqual(toolInfo)
    expect(wrapper.find('.yaml-to-toml-converter').exists()).toBe(true)
  })
})
