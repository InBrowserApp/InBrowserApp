import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import { describe, expect, it } from 'vitest'
import DotenvParserView from './DotenvParserView.vue'

const ToolDefaultPageLayoutStub = defineComponent({
  name: 'ToolDefaultPageLayout',
  props: { info: { type: Object, required: true } },
  template: '<div data-testid="layout"><slot /></div>',
})

describe('DotenvParserView', () => {
  it('renders the parser tool inside the default layout', () => {
    const wrapper = mount(DotenvParserView, {
      global: {
        stubs: {
          ToolDefaultPageLayout: ToolDefaultPageLayoutStub,
        },
      },
    })

    expect(wrapper.find('[data-testid="layout"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('Runs locally in your browser.')
  })
})
