import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import JsonDiffPathView from './JsonDiffPathView.vue'

vi.mock('@shared/ui/tool', () => ({
  ToolDefaultPageLayout: {
    name: 'ToolDefaultPageLayout',
    props: ['info'],
    template: '<div class="layout" :data-tool-id="info.toolID"><slot /></div>',
  },
}))

const ToolStub = defineComponent({
  name: 'JsonDiffPathTool',
  template: '<div class="tool" />',
})

const WhatIsStub = defineComponent({
  name: 'WhatIsJsonDiffPath',
  template: '<div class="what-is" />',
})

describe('JsonDiffPathView', () => {
  it('renders the tool and what-is section inside the default layout', () => {
    const wrapper = mount(JsonDiffPathView, {
      global: {
        stubs: {
          JsonDiffPathTool: ToolStub,
          WhatIsJsonDiffPath: WhatIsStub,
        },
      },
    })

    const layout = wrapper.find('.layout')
    expect(layout.exists()).toBe(true)
    expect(layout.attributes('data-tool-id')).toBe('json-diff-path')
    expect(wrapper.find('.tool').exists()).toBe(true)
    expect(wrapper.find('.what-is').exists()).toBe(true)
  })
})
