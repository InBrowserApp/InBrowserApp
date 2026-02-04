import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BusinessDaysCalculatorView from './BusinessDaysCalculatorView.vue'

describe('BusinessDaysCalculatorView', () => {
  it('renders the calculator inside the layout', () => {
    const wrapper = mount(BusinessDaysCalculatorView, {
      global: {
        stubs: {
          ToolDefaultPageLayout: {
            props: ['info'],
            template: '<div class="layout"><slot /></div>',
          },
          BusinessDaysCalculator: {
            template: '<div class="business-days-calculator" />',
          },
        },
      },
    })

    expect(wrapper.find('.business-days-calculator').exists()).toBe(true)
  })
})
