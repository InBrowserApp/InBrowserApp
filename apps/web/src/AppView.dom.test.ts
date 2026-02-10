import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'

const route = {
  fullPath: '/initial',
}

vi.mock('@shared/ui/layouts', () => ({
  NavLayout: {
    name: 'NavLayout',
    template: '<section data-test="nav-layout"><slot /></section>',
  },
}))

vi.mock('vue-router', async (importOriginal) => {
  const original = await importOriginal<typeof import('vue-router')>()

  return {
    ...original,
    useRoute: () => route,
    RouterView: {
      name: 'RouterView',
      template: '<main data-test="router-view" />',
    },
  }
})

describe('AppView', () => {
  it('renders the nav layout and router view', async () => {
    route.fullPath = '/tools/search?query=test'

    const AppView = (await import('./AppView.vue')).default
    const wrapper = mount(AppView)

    expect(wrapper.find('[data-test="nav-layout"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="router-view"]').exists()).toBe(true)
  })
})
