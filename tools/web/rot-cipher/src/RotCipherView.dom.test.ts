import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import RotCipherView from './RotCipherView.vue'
import * as toolInfo from './info'

const LayoutStub = defineComponent({
  name: 'ToolDefaultPageLayout',
  props: {
    info: {
      type: Object,
      default: () => ({}),
    },
  },
  template: '<div data-layout :data-tool-id="info.toolID"><slot /></div>',
})

const ConverterStub = defineComponent({
  name: 'RotConverter',
  template: '<div data-testid="converter" />',
})

const WhatIsStub = defineComponent({
  name: 'WhatIsRot',
  template: '<div data-testid="what-is" />',
})

describe('RotCipherView', () => {
  it('renders the layout and sections', () => {
    const wrapper = mount(RotCipherView, {
      global: {
        stubs: {
          ToolDefaultPageLayout: LayoutStub,
          RotConverter: ConverterStub,
          WhatIsRot: WhatIsStub,
        },
      },
    })

    const layout = wrapper.get('[data-layout]')
    expect(layout.attributes('data-tool-id')).toBe(toolInfo.toolID)
    expect(wrapper.find('[data-testid="converter"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="what-is"]').exists()).toBe(true)
  })
})
