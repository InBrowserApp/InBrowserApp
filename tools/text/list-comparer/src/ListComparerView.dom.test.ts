import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import * as toolInfo from './info'
import ListComparerView from './ListComparerView.vue'

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

const ToolStub = defineComponent({
  name: 'ListComparerTool',
  template: '<div data-testid="tool" />',
})

const WhatIsStub = defineComponent({
  name: 'WhatIsListComparer',
  template: '<div data-testid="what-is" />',
})

describe('ListComparerView', () => {
  it('renders the layout and sections', () => {
    const wrapper = mount(ListComparerView, {
      global: {
        stubs: {
          ToolDefaultPageLayout: LayoutStub,
          ListComparerTool: ToolStub,
          WhatIsListComparer: WhatIsStub,
        },
      },
    })

    expect(wrapper.get('[data-layout]').attributes('data-tool-id')).toBe(toolInfo.toolID)
    expect(wrapper.find('[data-testid="tool"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="what-is"]').exists()).toBe(true)
  })
})
