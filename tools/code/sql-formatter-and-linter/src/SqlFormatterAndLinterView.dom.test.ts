import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import SqlFormatterAndLinterView from './SqlFormatterAndLinterView.vue'
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

const SqlFormatterAndLinterStub = defineComponent({
  name: 'SqlFormatterAndLinter',
  template: '<div class="tool" />',
})

describe('SqlFormatterAndLinterView', () => {
  it('renders the layout with tool info', () => {
    const wrapper = mount(SqlFormatterAndLinterView, {
      global: {
        stubs: {
          ToolDefaultPageLayout: ToolDefaultPageLayoutStub,
          SqlFormatterAndLinter: SqlFormatterAndLinterStub,
        },
      },
    })

    const layout = wrapper.findComponent(ToolDefaultPageLayoutStub)
    expect(layout.exists()).toBe(true)
    expect(layout.props('info')).toEqual(toolInfo)
    expect(wrapper.find('.tool').exists()).toBe(true)
  })
})
