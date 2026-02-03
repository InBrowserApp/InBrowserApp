import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import ChmodCalculatorView from './ChmodCalculatorView.vue'
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

const CalculatorStub = defineComponent({
  name: 'ChmodCalculator',
  template: '<div data-testid="calculator" />',
})

const WhatIsStub = defineComponent({
  name: 'WhatIsChmod',
  template: '<div data-testid="what-is" />',
})

describe('ChmodCalculatorView', () => {
  it('renders the layout and tool sections', () => {
    const wrapper = mount(ChmodCalculatorView, {
      global: {
        stubs: {
          ToolDefaultPageLayout: LayoutStub,
          ChmodCalculator: CalculatorStub,
          WhatIsChmod: WhatIsStub,
        },
      },
    })

    const layout = wrapper.get('[data-layout]')
    expect(layout.attributes('data-tool-id')).toBe(toolInfo.toolID)
    expect(wrapper.find('[data-testid="calculator"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="what-is"]').exists()).toBe(true)
  })
})
