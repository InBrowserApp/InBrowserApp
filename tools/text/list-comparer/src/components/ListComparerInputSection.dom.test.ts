import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ListComparerInputSection from './ListComparerInputSection.vue'
import type { ParsedListSummary } from '../utils/listComparer'

vi.mock('@shared/ui/tool', () => ({
  ToolSection: {
    name: 'ToolSection',
    template: '<section><slot /></section>',
  },
  ToolSectionHeader: {
    name: 'ToolSectionHeader',
    template: '<h2><slot /></h2>',
  },
}))

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')

  return {
    NButton: defineComponent({
      name: 'NButton',
      emits: ['click'],
      template:
        '<button @click="$emit(\'click\')"><span class="button-icon"><slot name="icon" /></span><slot /></button>',
    }),
    NCard: defineComponent({
      name: 'NCard',
      template:
        '<div class="card"><div class="header"><slot name="header" /></div><div class="extra"><slot name="header-extra" /></div><slot /></div>',
    }),
    NFlex: defineComponent({
      name: 'NFlex',
      template: '<div><slot /></div>',
    }),
    NGi: defineComponent({
      name: 'NGi',
      template: '<div><slot /></div>',
    }),
    NGrid: defineComponent({
      name: 'NGrid',
      template: '<div><slot /></div>',
    }),
    NInput: defineComponent({
      name: 'NInput',
      props: {
        value: {
          type: String,
          default: '',
        },
        placeholder: {
          type: String,
          default: '',
        },
      },
      emits: ['update:value'],
      template:
        '<textarea :value="value" :placeholder="placeholder" @input="$emit(\'update:value\', $event.target.value)" />',
    }),
    NIcon: defineComponent({
      name: 'NIcon',
      template: '<span class="n-icon"><slot /></span>',
    }),
    NText: defineComponent({
      name: 'NText',
      template: '<span><slot /></span>',
    }),
  }
})

const makeSummary = (totalCount: number, uniqueCount: number): ParsedListSummary => ({
  totalCount,
  uniqueCount,
  duplicateCount: Math.max(0, totalCount - uniqueCount),
  uniqueItems: [],
  duplicateItems: [],
})

describe('ListComparerInputSection', () => {
  it('renders list titles, stats, and placeholders', () => {
    const wrapper = mount(ListComparerInputSection, {
      props: {
        leftSummary: makeSummary(6, 5),
        rightSummary: makeSummary(4, 4),
        leftText: 'alpha',
        rightText: 'beta',
        'onUpdate:leftText': vi.fn(),
        'onUpdate:rightText': vi.fn(),
      },
    })

    expect(wrapper.text()).toContain('Compare Lists')
    expect(wrapper.text()).toContain('List A')
    expect(wrapper.text()).toContain('6 items, 5 unique')
    expect(wrapper.findAll('.button-icon')).toHaveLength(3)

    const inputs = wrapper.findAll('textarea')
    expect(inputs[0]?.attributes('placeholder')).toBe('Paste List A here...')
    expect(inputs[1]?.attributes('placeholder')).toBe('Paste List B here...')
  })

  it('emits text updates and toolbar actions', async () => {
    const updateLeft = vi.fn()
    const updateRight = vi.fn()
    const wrapper = mount(ListComparerInputSection, {
      props: {
        leftSummary: makeSummary(1, 1),
        rightSummary: makeSummary(1, 1),
        leftText: 'left',
        rightText: 'right',
        'onUpdate:leftText': updateLeft,
        'onUpdate:rightText': updateRight,
      },
    })

    const inputs = wrapper.findAll('textarea')
    await inputs[0]!.setValue('new-left')
    await inputs[1]!.setValue('new-right')

    const buttons = wrapper.findAll('button')
    await buttons[0]!.trigger('click')
    await buttons[1]!.trigger('click')
    await buttons[2]!.trigger('click')

    expect(updateLeft).toHaveBeenCalledWith('new-left')
    expect(updateRight).toHaveBeenCalledWith('new-right')
    expect(wrapper.emitted('swap')).toHaveLength(1)
    expect(wrapper.emitted('use-sample')).toHaveLength(1)
    expect(wrapper.emitted('clear')).toHaveLength(1)
  })
})
