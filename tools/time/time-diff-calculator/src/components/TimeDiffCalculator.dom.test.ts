import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import TimeDiffCalculator from './TimeDiffCalculator.vue'

const SectionStub = defineComponent({
  name: 'TimeDifferenceSection',
  template: '<section class="section" />',
})

const WhatIsStub = defineComponent({
  name: 'WhatIsTimeDifference',
  template: '<div class="what-is" />',
})

describe('TimeDiffCalculator', () => {
  it('renders the main sections', () => {
    const wrapper = mount(TimeDiffCalculator, {
      global: {
        stubs: {
          TimeDifferenceSection: SectionStub,
          WhatIsTimeDifference: WhatIsStub,
        },
      },
    })

    expect(wrapper.find('.section').exists()).toBe(true)
    expect(wrapper.find('.what-is').exists()).toBe(true)
  })
})
