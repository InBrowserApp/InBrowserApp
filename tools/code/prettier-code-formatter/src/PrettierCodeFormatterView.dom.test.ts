import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import PrettierCodeFormatterView from './PrettierCodeFormatterView.vue'
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

const FormatterStub = defineComponent({
  name: 'PrettierCodeFormatter',
  template: '<div data-testid="formatter" />',
})

describe('PrettierCodeFormatterView', () => {
  it('renders the layout with tool info', () => {
    const wrapper = mount(PrettierCodeFormatterView, {
      global: {
        stubs: {
          ToolDefaultPageLayout: LayoutStub,
          PrettierCodeFormatter: FormatterStub,
        },
      },
    })

    const layout = wrapper.get('[data-layout]')
    expect(layout.attributes('data-tool-id')).toBe(toolInfo.toolID)
    expect(wrapper.find('[data-testid="formatter"]').exists()).toBe(true)
  })
})
