import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import ColorConverterView from './ColorConverterView.vue'

const ToolDefaultPageLayoutStub = defineComponent({
  name: 'ToolDefaultPageLayout',
  props: ['info'],
  template: '<div class="layout"><slot /></div>',
})

const ColorConverterStub = defineComponent({
  name: 'ColorConverter',
  template: '<div class="color-converter" />',
})

describe('ColorConverterView', () => {
  it('renders the tool layout and converter', () => {
    const wrapper = mount(ColorConverterView, {
      global: {
        stubs: {
          ToolDefaultPageLayout: ToolDefaultPageLayoutStub,
          ColorConverter: ColorConverterStub,
        },
      },
    })

    const layout = wrapper.findComponent({ name: 'ToolDefaultPageLayout' })
    expect(layout.exists()).toBe(true)
    expect((layout.props('info') as { toolID?: string }).toolID).toBe('color-converter')
    expect(wrapper.find('.color-converter').exists()).toBe(true)
  })
})
