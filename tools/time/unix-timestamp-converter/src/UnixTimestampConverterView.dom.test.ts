import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import UnixTimestampConverterView from './UnixTimestampConverterView.vue'

describe('UnixTimestampConverterView', () => {
  it('renders the timestamp converter inside the layout', () => {
    const wrapper = mount(UnixTimestampConverterView, {
      global: {
        stubs: {
          ToolDefaultPageLayout: {
            props: ['info'],
            template: '<div class="layout"><slot /></div>',
          },
          TimestampConverter: {
            template: '<div class="timestamp-converter" />',
          },
        },
      },
    })

    expect(wrapper.find('.timestamp-converter').exists()).toBe(true)
  })
})
