import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import * as toolInfo from './info'
import RegexTesterReplacerView from './RegexTesterReplacerView.vue'

vi.mock('@shared/ui/tool', async () => {
  const { defineComponent } = await import('vue')

  return {
    ToolDefaultPageLayout: defineComponent({
      name: 'ToolDefaultPageLayout',
      props: {
        info: {
          type: Object,
          required: true,
        },
      },
      template: '<div data-testid="layout"><slot /></div>',
    }),
  }
})

vi.mock('./components/RegexTesterReplacer.vue', async () => {
  const { defineComponent } = await import('vue')

  return {
    default: defineComponent({
      name: 'RegexTesterReplacer',
      template: '<div data-testid="regex-tester"></div>',
    }),
  }
})

vi.mock('./components/WhatIsRegex.vue', async () => {
  const { defineComponent } = await import('vue')

  return {
    default: defineComponent({
      name: 'WhatIsRegex',
      template: '<div data-testid="what-is-regex"></div>',
    }),
  }
})

describe('RegexTesterReplacerView', () => {
  it('renders the layout with tool info and sections', () => {
    const wrapper = mount(RegexTesterReplacerView)

    const layout = wrapper.getComponent({ name: 'ToolDefaultPageLayout' })

    expect(layout.props('info')).toMatchObject({ toolID: toolInfo.toolID })
    expect(wrapper.find('[data-testid="regex-tester"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="what-is-regex"]').exists()).toBe(true)
  })
})
