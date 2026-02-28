import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import RandomNumberGeneratorHistory from './RandomNumberGeneratorHistory.vue'

vi.mock('@shared/ui/tool', () => ({
  ToolSectionHeader: {
    name: 'ToolSectionHeader',
    template: '<h2><slot /></h2>',
  },
  ToolSection: {
    name: 'ToolSection',
    template: '<section><slot /></section>',
  },
}))

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')

  return {
    NButton: defineComponent({
      name: 'NButton',
      props: {
        disabled: {
          type: Boolean,
          default: false,
        },
      },
      emits: ['click'],
      template:
        '<button type="button" :disabled="disabled" @click="$emit(\'click\')"><slot /></button>',
    }),
    NCard: defineComponent({
      name: 'NCard',
      template: '<div class="n-card"><slot /></div>',
    }),
    NFlex: defineComponent({
      name: 'NFlex',
      template: '<div class="n-flex"><slot /></div>',
    }),
    NTag: defineComponent({
      name: 'NTag',
      template: '<span class="n-tag"><slot /></span>',
    }),
    NText: defineComponent({
      name: 'NText',
      template: '<span><slot /></span>',
    }),
  }
})

describe('RandomNumberGeneratorHistory', () => {
  it('shows empty state with disabled clear button', () => {
    const wrapper = mount(RandomNumberGeneratorHistory, {
      props: {
        historyEntries: [],
      },
    })

    expect(wrapper.text()).toContain('No history yet.')
    expect(wrapper.get('[data-testid="clear-history"]').attributes('disabled')).toBeDefined()
  })

  it('renders history entries and emits clear', async () => {
    const wrapper = mount(RandomNumberGeneratorHistory, {
      props: {
        historyEntries: [
          { id: 'one', values: ['1', '2'] },
          { id: 'two', values: ['3'] },
        ],
      },
    })

    expect(wrapper.findAll('.n-tag')).toHaveLength(3)
    expect(wrapper.get('[data-testid="clear-history"]').attributes('disabled')).toBeUndefined()

    await wrapper.get('[data-testid="clear-history"]').trigger('click')
    expect(wrapper.emitted('clear-history')).toHaveLength(1)
  })
})
