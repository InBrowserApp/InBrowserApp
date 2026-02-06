import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import { NMessageProvider } from 'naive-ui'
import DurationCalculatorView from './DurationCalculatorView.vue'
import * as toolInfo from './info'
import DurationCalculator from './components/DurationCalculator.vue'

describe('DurationCalculatorView', () => {
  it('renders the tool layout and calculator content', () => {
    const wrapper = mount(
      {
        render() {
          return h(NMessageProvider, () => h(DurationCalculatorView))
        },
      },
      {
        global: {
          stubs: {
            ToolDefaultPageLayout: {
              props: ['info'],
              template: '<section data-testid="layout"><slot /></section>',
            },
          },
        },
      },
    )

    expect(wrapper.find('[data-testid="layout"]').exists()).toBe(true)
    expect(wrapper.findComponent(DurationCalculator).exists()).toBe(true)
    expect(toolInfo.toolID).toBe('duration-calculator')
  })
})
