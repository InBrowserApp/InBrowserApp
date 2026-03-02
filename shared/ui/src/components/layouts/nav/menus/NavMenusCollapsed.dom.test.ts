import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import NavMenusCollapsed from './NavMenusCollapsed.vue'
const collapsedOptions = [{ key: 'tools', label: 'Tools' }]
vi.mock('./sub-menus/use-menu-links', () => ({
  useCollapsedMenuOptions: () => collapsedOptions,
}))
vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')
  const actual = (await vi.importActual('naive-ui')) as Record<string, unknown>
  return {
    ...actual,
    NPopover: defineComponent({
      name: 'NPopover',
      emits: ['update:show'],
      template: '<div class="popover"><slot name="trigger" /><slot /></div>',
    }),
    NMenu: defineComponent({
      name: 'NMenu',
      props: {
        options: {
          type: Array,
          default: () => [],
        },
        indent: {
          type: Number,
          default: 0,
        },
      },
      emits: ['update:value'],
      template: '<button class="menu-trigger" @click="$emit(\'update:value\', \'tools\')" />',
    }),
  }
})
describe('NavMenusCollapsed', () => {
  it('renders collapsed menu controls and closes menu in handler', async () => {
    const wrapper = mount(NavMenusCollapsed, {
      global: {
        stubs: {
          AirplaneModeToggle: { template: '<div class="airplane-toggle" />' },
          LanguageMenuIcon: { template: '<div class="language-icon" />' },
        },
      },
    })
    expect(wrapper.find('.airplane-toggle').exists()).toBe(true)
    expect(wrapper.find('.language-icon').exists()).toBe(true)
    const setupState = (
      wrapper.vm.$ as unknown as {
        setupState: {
          show: boolean
          menuOptions: unknown[]
        }
      }
    ).setupState
    expect(setupState.menuOptions).toEqual(collapsedOptions)
    wrapper.getComponent({ name: 'NPopover' }).vm.$emit('update:show', true)
    await wrapper.vm.$nextTick()
    expect(setupState.show).toBe(true)
    await wrapper.get('.menu-trigger').trigger('click')
    expect(setupState.show).toBe(false)
  })
})
