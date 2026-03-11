import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import XmlFormatterView from './XmlFormatterView.vue'
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

const XmlFormatterStub = defineComponent({
  name: 'XmlFormatter',
  template: '<div class="xml-formatter" />',
})

describe('XmlFormatterView', () => {
  it('renders the layout with tool info', () => {
    const wrapper = mount(XmlFormatterView, {
      global: {
        stubs: {
          ToolDefaultPageLayout: ToolDefaultPageLayoutStub,
          XmlFormatter: XmlFormatterStub,
        },
      },
    })

    const layout = wrapper.findComponent(ToolDefaultPageLayoutStub)
    expect(layout.exists()).toBe(true)
    expect(layout.props('info')).toEqual(toolInfo)
    expect(wrapper.find('.xml-formatter').exists()).toBe(true)
  })
})
