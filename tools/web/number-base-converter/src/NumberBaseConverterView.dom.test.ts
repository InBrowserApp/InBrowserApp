import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import NumberBaseConverterView from './NumberBaseConverterView.vue'
import * as toolInfo from './info'

vi.mock('@shared/ui/tool', async () => {
  const { defineComponent } = await import('vue')
  return {
    ToolDefaultPageLayout: defineComponent({
      name: 'ToolDefaultPageLayout',
      props: ['info'],
      template: '<div class="layout"><slot /></div>',
    }),
  }
})

vi.mock('./components/NumberBaseConverter.vue', async () => {
  const { defineComponent } = await import('vue')
  return {
    default: defineComponent({
      name: 'NumberBaseConverter',
      template: '<div class="converter" />',
    }),
  }
})

describe('NumberBaseConverterView', () => {
  it('renders layout with tool info and converter', () => {
    const wrapper = mount(NumberBaseConverterView)
    const layout = wrapper.findComponent({ name: 'ToolDefaultPageLayout' })
    expect(layout.props('info')).toEqual(toolInfo)
    expect(wrapper.find('.converter').exists()).toBe(true)
  })
})
