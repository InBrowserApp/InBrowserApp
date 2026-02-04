import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import JsonToTomlConverterView from './JsonToTomlConverterView.vue'
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

const JsonToTomlConverterStub = defineComponent({
  name: 'JsonToTomlConverter',
  template: '<div class="json-to-toml-converter" />',
})

describe('JsonToTomlConverterView', () => {
  it('renders the layout with tool info', () => {
    const wrapper = mount(JsonToTomlConverterView, {
      global: {
        stubs: {
          ToolDefaultPageLayout: ToolDefaultPageLayoutStub,
          JsonToTomlConverter: JsonToTomlConverterStub,
        },
      },
    })

    const layout = wrapper.findComponent(ToolDefaultPageLayoutStub)
    expect(layout.exists()).toBe(true)
    expect(layout.props('info')).toEqual(toolInfo)
    expect(wrapper.find('.json-to-toml-converter').exists()).toBe(true)
  })
})
