import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ColorSection from './ColorSection.vue'
vi.mock('naive-ui', async () => {
  const actual = (await vi.importActual('naive-ui')) as Record<string, unknown>
  return {
    ...actual,
  }
})
vi.mock('@shared/ui/tool', async () => {
  const { defineComponent } = await import('vue')
  return {
    ToolSection: defineComponent({
      name: 'ToolSection',
      template: '<section class="tool-section"><slot /></section>',
    }),
  }
})
describe('ColorSection', () => {
  it('renders label and slots', () => {
    const wrapper = mount(ColorSection, {
      props: { label: 'HEX' },
      slots: {
        default: '<div class="content" />',
        action: '<button class="action" />',
        'label-suffix': '<span class="suffix" />',
      },
    })
    expect(wrapper.text()).toContain('HEX')
    expect(wrapper.find('.content').exists()).toBe(true)
    expect(wrapper.find('.action').exists()).toBe(true)
    expect(wrapper.find('.suffix').exists()).toBe(true)
  })
})
