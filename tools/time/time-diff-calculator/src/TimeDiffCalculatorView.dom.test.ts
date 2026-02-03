import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import TimeDiffCalculatorView from './TimeDiffCalculatorView.vue'

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

const TimeDiffCalculatorStub = defineComponent({
  name: 'TimeDiffCalculator',
  template: '<div class="calculator" />',
})

describe('TimeDiffCalculatorView', () => {
  it('renders layout with tool info and calculator', () => {
    const wrapper = mount(TimeDiffCalculatorView, {
      global: {
        stubs: {
          ToolDefaultPageLayout: ToolDefaultPageLayoutStub,
          TimeDiffCalculator: TimeDiffCalculatorStub,
        },
      },
    })

    const layout = wrapper.findComponent(ToolDefaultPageLayoutStub)
    expect(layout.exists()).toBe(true)
    expect(layout.props('info')).toMatchObject({
      toolID: 'time-diff-calculator',
      path: '/tools/time-diff-calculator',
    })

    expect(wrapper.find('.calculator').exists()).toBe(true)
  })
})
