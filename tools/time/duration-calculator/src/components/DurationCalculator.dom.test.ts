import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import { NMessageProvider } from 'naive-ui'
import DurationCalculator from './DurationCalculator.vue'
import DurationCalculatorSection from './DurationCalculatorSection.vue'
import WhatIsDuration from './WhatIsDuration.vue'

describe('DurationCalculator', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renders the calculator section and the description', () => {
    const wrapper = mount({
      render() {
        return h(NMessageProvider, () => h(DurationCalculator))
      },
    })
    expect(wrapper.findComponent(DurationCalculatorSection).exists()).toBe(true)
    expect(wrapper.findComponent(WhatIsDuration).exists()).toBe(true)
  })
})
