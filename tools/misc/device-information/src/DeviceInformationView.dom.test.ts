import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import DeviceInformationView from './DeviceInformationView.vue'
import * as toolInfo from './info'

const ToolDefaultPageLayoutStub = defineComponent({
  name: 'ToolDefaultPageLayout',
  props: {
    info: { type: Object, required: true },
  },
  template: '<div class="layout"><slot /></div>',
})

const DeviceInformationStub = defineComponent({
  name: 'DeviceInformation',
  template: '<div class="device-information" />',
})

describe('DeviceInformationView', () => {
  it('renders layout with tool info and device information', () => {
    const wrapper = mount(DeviceInformationView, {
      global: {
        stubs: {
          ToolDefaultPageLayout: ToolDefaultPageLayoutStub,
          DeviceInformation: DeviceInformationStub,
        },
      },
    })

    const layout = wrapper.findComponent(ToolDefaultPageLayoutStub)

    expect(layout.exists()).toBe(true)
    expect(layout.props('info')).toEqual(toolInfo)
    expect(wrapper.find('.device-information').exists()).toBe(true)
  })
})
