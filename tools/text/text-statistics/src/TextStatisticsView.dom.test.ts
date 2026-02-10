import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import TextStatisticsView from './TextStatisticsView.vue'
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

const ContentStub = defineComponent({
  name: 'TextStatisticsContent',
  template: '<div data-testid="content" />',
})

const WhatIsStub = defineComponent({
  name: 'WhatIsTextStatistics',
  template: '<div data-testid="what-is" />',
})

describe('TextStatisticsView', () => {
  it('renders the layout and sections', () => {
    const wrapper = mount(TextStatisticsView, {
      global: {
        stubs: {
          ToolDefaultPageLayout: LayoutStub,
          TextStatisticsContent: ContentStub,
          WhatIsTextStatistics: WhatIsStub,
        },
      },
    })

    const layout = wrapper.get('[data-layout]')
    expect(layout.attributes('data-tool-id')).toBe(toolInfo.toolID)
    expect(wrapper.find('[data-testid="content"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="what-is"]').exists()).toBe(true)
  })
})
