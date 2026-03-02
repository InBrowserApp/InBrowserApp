import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'

const useHead = vi.fn()

vi.mock('@unhead/vue', () => ({
  useHead,
}))

vi.mock('@registry/tools/main', () => ({
  tools: [
    { toolID: 'alpha', path: '/tools/alpha', meta: { en: { name: 'Alpha', description: 'A' } } },
    { toolID: 'beta', path: '/tools/beta', meta: { en: { name: 'Beta', description: 'B' } } },
  ],
}))

describe('HomeView', () => {
  it('registers page metadata and renders home sections', async () => {
    const HomeView = (await import('./HomeView.vue')).default
    const wrapper = mount(HomeView, {
      global: {
        stubs: {
          AirplaneModeEnabledAlert: { template: '<div data-test="airplane" />' },
          TheDeveloperSay: { template: '<div data-test="dev-say" />' },
          ToolSectionHeader: { template: '<h2><slot /></h2>' },
          SearchAutoComplete: { template: '<div data-test="search" />' },
          ToolSection: { template: '<section><slot /></section>' },
          ToolsGrid: {
            props: ['tools'],
            template: '<div data-test="grid" :data-count="tools.length" />',
          },
        },
      },
    })

    expect(useHead).toHaveBeenCalledWith({ title: 'InBrowser.App' })
    expect(wrapper.find('[data-test="airplane"]').exists()).toBe(true)
    expect(wrapper.get('#home-purpose-title').text()).toBe('What Is InBrowser.App?')
    expect(wrapper.text()).toContain('No account needed, open and use instantly.')
    expect(wrapper.text()).toContain('2 tools are ready to use right now.')
    expect(wrapper.find('[data-test="dev-say"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="search"]').exists()).toBe(true)
    expect(wrapper.get('[data-test="grid"]').attributes('data-count')).toBe('2')
  })
})
