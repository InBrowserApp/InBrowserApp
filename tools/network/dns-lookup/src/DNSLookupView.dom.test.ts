import { beforeAll, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'

vi.mock('@shared/ui/tool', () => ({
  ToolDefaultPageLayout: {
    props: ['info'],
    template: '<div class="layout"><slot /></div>',
  },
}))

vi.mock('./components/DNSLookup.vue', () => ({
  default: {
    template: '<div class="dns-lookup" />',
  },
}))

let DNSLookupView: typeof import('./DNSLookupView.vue').default

beforeAll(async () => {
  DNSLookupView = (await import('./DNSLookupView.vue')).default
})

describe('DNSLookupView', () => {
  it('renders the layout and lookup component', () => {
    const wrapper = mount(DNSLookupView)

    expect(wrapper.find('.layout').exists()).toBe(true)
    expect(wrapper.find('.dns-lookup').exists()).toBe(true)
  })
})
