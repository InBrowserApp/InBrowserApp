import { beforeAll, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'

vi.mock('@shared/ui/tool', () => ({
  ToolDefaultPageLayout: {
    props: ['info'],
    template: '<div class="layout"><slot /></div>',
  },
}))

vi.mock('./components/PunycodeTool.vue', () => ({
  default: {
    template: '<div class="punycode-tool" />',
  },
}))

let UnicodePunycodeConverterView: typeof import('./UnicodePunycodeConverterView.vue').default

beforeAll(async () => {
  UnicodePunycodeConverterView = (await import('./UnicodePunycodeConverterView.vue')).default
})

describe('UnicodePunycodeConverterView', () => {
  it('renders the layout and tool', () => {
    const wrapper = mount(UnicodePunycodeConverterView)

    expect(wrapper.find('.layout').exists()).toBe(true)
    expect(wrapper.find('.punycode-tool').exists()).toBe(true)
  })
})
