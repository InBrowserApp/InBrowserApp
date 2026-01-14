import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import { NMessageProvider } from 'naive-ui'
import BusinessDaysCalculator from './BusinessDaysCalculator.vue'
import BusinessDaysCalculatorSection from './BusinessDaysCalculatorSection.vue'
import WhatIsBusinessDay from './WhatIsBusinessDay.vue'

describe('BusinessDaysCalculator', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renders the calculator section and the description', () => {
    const wrapper = mount({
      render() {
        return h(NMessageProvider, () => h(BusinessDaysCalculator))
      },
    })
    expect(wrapper.findComponent(BusinessDaysCalculatorSection).exists()).toBe(true)
    expect(wrapper.findComponent(WhatIsBusinessDay).exists()).toBe(true)
  })
})
