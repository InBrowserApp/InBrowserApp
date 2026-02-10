import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import * as toolInfo from './info'
import FileToDataUriConverterView from './FileToDataUriConverterView.vue'

const LayoutStub = defineComponent({
  name: 'ToolDefaultPageLayout',
  props: ['info'],
  template: '<div><slot /></div>',
})

const ConverterStub = defineComponent({
  name: 'FileToDataUriConverter',
  template: '<div data-test="converter" />',
})

const WhatIsStub = defineComponent({
  name: 'WhatIsDataUri',
  template: '<div data-test="what-is" />',
})

describe('FileToDataUriConverterView', () => {
  it('renders the layout with converter and info sections', () => {
    const wrapper = mount(FileToDataUriConverterView, {
      global: {
        stubs: {
          ToolDefaultPageLayout: LayoutStub,
          FileToDataUriConverter: ConverterStub,
          WhatIsDataUri: WhatIsStub,
        },
      },
    })

    const layout = wrapper.findComponent({ name: 'ToolDefaultPageLayout' })
    expect(layout.props('info')).toMatchObject({ toolID: toolInfo.toolID })
    expect(wrapper.find('[data-test="converter"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="what-is"]').exists()).toBe(true)
  })
})
