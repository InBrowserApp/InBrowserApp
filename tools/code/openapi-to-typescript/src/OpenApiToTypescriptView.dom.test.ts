import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import OpenApiToTypescriptView from './OpenApiToTypescriptView.vue'
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

const ToolStub = defineComponent({
  name: 'OpenApiToTypescript',
  template: '<div data-testid="tool" />',
})

const WhatIsStub = defineComponent({
  name: 'WhatIsOpenApi',
  template: '<div data-testid="what-is" />',
})

describe('OpenApiToTypescriptView', () => {
  it('renders the layout and sections', () => {
    const wrapper = mount(OpenApiToTypescriptView, {
      global: {
        stubs: {
          ToolDefaultPageLayout: LayoutStub,
          OpenApiToTypescript: ToolStub,
          WhatIsOpenApi: WhatIsStub,
        },
      },
    })

    const layout = wrapper.get('[data-layout]')
    expect(layout.attributes('data-tool-id')).toBe(toolInfo.toolID)
    expect(wrapper.find('[data-testid="tool"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="what-is"]').exists()).toBe(true)
  })
})
