import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import * as toolInfo from './info'
import DataUriToFileConverterView from './DataUriToFileConverterView.vue'

const LayoutStub = defineComponent({
  name: 'ToolDefaultPageLayout',
  props: ['info'],
  template: '<div><slot /></div>',
})

const ConverterStub = defineComponent({
  name: 'DataUriToFileConverter',
  template: '<div data-test="converter" />',
})

const WhatIsStub = defineComponent({
  name: 'WhatIsDataUri',
  template: '<div data-test="what-is" />',
})

describe('DataUriToFileConverterView', () => {
  it('renders the layout with converter and info content', () => {
    const wrapper = mount(DataUriToFileConverterView, {
      global: {
        stubs: {
          ToolDefaultPageLayout: LayoutStub,
          DataUriToFileConverter: ConverterStub,
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
