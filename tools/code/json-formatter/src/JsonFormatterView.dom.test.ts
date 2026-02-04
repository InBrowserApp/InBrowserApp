import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import JsonFormatterView from './JsonFormatterView.vue'
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

const JsonFormatterStub = defineComponent({
  name: 'JsonFormatter',
  template: '<div class="json-formatter" />',
})

describe('JsonFormatterView', () => {
  it('renders the layout with tool info', () => {
    const wrapper = mount(JsonFormatterView, {
      global: {
        stubs: {
          ToolDefaultPageLayout: ToolDefaultPageLayoutStub,
          JsonFormatter: JsonFormatterStub,
        },
      },
    })

    const layout = wrapper.findComponent(ToolDefaultPageLayoutStub)
    expect(layout.exists()).toBe(true)
    expect(layout.props('info')).toEqual(toolInfo)
    expect(wrapper.find('.json-formatter').exists()).toBe(true)
  })
})
