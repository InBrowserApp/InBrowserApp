import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import UnicodeEscapeUnescapeView from './UnicodeEscapeUnescapeView.vue'
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
  name: 'UnicodeConverter',
  template: '<div data-testid="converter" />',
})

describe('UnicodeEscapeUnescapeView', () => {
  it('renders the layout and converter', () => {
    const wrapper = mount(UnicodeEscapeUnescapeView, {
      global: {
        stubs: {
          ToolDefaultPageLayout: LayoutStub,
          UnicodeConverter: ConverterStub,
        },
      },
    })

    const layout = wrapper.get('[data-layout]')
    expect(layout.attributes('data-tool-id')).toBe(toolInfo.toolID)
    expect(wrapper.find('[data-testid="converter"]').exists()).toBe(true)
  })
})
