import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import URLParserBuilderView from './URLParserBuilderView.vue'
import * as toolInfo from './info'

const ToolDefaultPageLayoutStub = defineComponent({
  name: 'ToolDefaultPageLayout',
  props: {
    info: { type: Object, required: true },
  },
  template: '<div class="layout"><slot /></div>',
})

const URLParserBuilderStub = defineComponent({
  name: 'URLParserBuilder',
  template: '<div class="builder" />',
})

describe('URLParserBuilderView', () => {
  it('renders layout with tool info and builder', () => {
    const wrapper = mount(URLParserBuilderView, {
      global: {
        stubs: {
          ToolDefaultPageLayout: ToolDefaultPageLayoutStub,
          URLParserBuilder: URLParserBuilderStub,
        },
      },
    })

    const layout = wrapper.findComponent(ToolDefaultPageLayoutStub)

    expect(layout.exists()).toBe(true)
    expect(layout.props('info')).toEqual(toolInfo)
    expect(wrapper.find('.builder').exists()).toBe(true)
  })
})
