import { beforeAll, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'

vi.mock('@shared/ui/tool', () => ({
  ToolDefaultPageLayout: {
    props: ['info'],
    template: '<div class="layout"><slot /></div>',
  },
}))

vi.mock('./components/ReverseIPLookup.vue', () => ({
  default: {
    template: '<div class="reverse-ip-lookup" />',
  },
}))

let ReverseIPLookupView: typeof import('./ReverseIPLookupView.vue').default

beforeAll(async () => {
  ReverseIPLookupView = (await import('./ReverseIPLookupView.vue')).default
})

describe('ReverseIPLookupView', () => {
  it('renders the layout and lookup component', () => {
    const wrapper = mount(ReverseIPLookupView)

    expect(wrapper.find('.layout').exists()).toBe(true)
    expect(wrapper.find('.reverse-ip-lookup').exists()).toBe(true)
  })
})
