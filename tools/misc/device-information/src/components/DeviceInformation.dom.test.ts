import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import DeviceInformation from './DeviceInformation.vue'

const HardwareInfoStub = defineComponent({
  name: 'HardwareInfo',
  template: '<div class="hardware-info" />',
})

const ScreenInfoStub = defineComponent({
  name: 'ScreenInfo',
  template: '<div class="screen-info" />',
})

const BrowserInfoStub = defineComponent({
  name: 'BrowserInfo',
  template: '<div class="browser-info" />',
})

describe('DeviceInformation', () => {
  it('renders the hardware, screen, and browser sections', () => {
    const wrapper = mount(DeviceInformation, {
      global: {
        stubs: {
          HardwareInfo: HardwareInfoStub,
          ScreenInfo: ScreenInfoStub,
          BrowserInfo: BrowserInfoStub,
        },
      },
    })

    expect(wrapper.find('.hardware-info').exists()).toBe(true)
    expect(wrapper.find('.screen-info').exists()).toBe(true)
    expect(wrapper.find('.browser-info').exists()).toBe(true)
  })
})
