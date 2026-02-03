import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import TimeZoneConverterView from './TimeZoneConverterView.vue'

const ToolDefaultPageLayoutStub = {
  name: 'ToolDefaultPageLayout',
  props: ['info'],
  template: '<div class="layout"><slot /></div>',
}

const TimeZoneConverterStub = {
  name: 'TimeZoneConverter',
  template: '<div class="converter" />',
}

const WhatIsTimeZoneStub = {
  name: 'WhatIsTimeZone',
  template: '<div class="what-is" />',
}

describe('TimeZoneConverterView', () => {
  it('renders the layout with converter sections', () => {
    const wrapper = mount(TimeZoneConverterView, {
      global: {
        stubs: {
          ToolDefaultPageLayout: ToolDefaultPageLayoutStub,
          TimeZoneConverter: TimeZoneConverterStub,
          WhatIsTimeZone: WhatIsTimeZoneStub,
        },
      },
    })

    const layout = wrapper.findComponent(ToolDefaultPageLayoutStub)
    expect(layout.exists()).toBe(true)
    expect(layout.props('info')).toMatchObject({ toolID: 'time-zone-converter' })
    expect(wrapper.find('.converter').exists()).toBe(true)
    expect(wrapper.find('.what-is').exists()).toBe(true)
  })
})
