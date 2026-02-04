import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import IcalEventGeneratorView from './IcalEventGeneratorView.vue'

vi.mock('@shared/ui/tool', () => ({
  ToolDefaultPageLayout: {
    name: 'ToolDefaultPageLayout',
    props: ['info'],
    template: '<div class="layout" :data-tool-id="info.toolID"><slot /></div>',
  },
}))

const GeneratorStub = defineComponent({
  name: 'IcalEventGenerator',
  template: '<div class="generator" />',
})

describe('IcalEventGeneratorView', () => {
  it('renders tool layout with generator component', () => {
    const wrapper = mount(IcalEventGeneratorView, {
      global: {
        stubs: {
          IcalEventGenerator: GeneratorStub,
        },
      },
    })

    const layout = wrapper.find('.layout')
    expect(layout.exists()).toBe(true)
    expect(layout.attributes('data-tool-id')).toBe('ical-event-generator')
    expect(wrapper.find('.generator').exists()).toBe(true)
  })
})
