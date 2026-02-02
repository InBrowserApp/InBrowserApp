import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'

const { sampleBrands } = vi.hoisted(() => ({
  sampleBrands: [
    {
      id: 'visa',
      name: 'Visa',
      patterns: ['4', [51, 55]],
      lengths: [16, 19],
      icon: {},
      cvcLength: 3,
      formatPattern: [4, 4, 4, 4],
    },
  ],
}))

vi.mock('../data/cardBrands', () => ({
  cardBrands: sampleBrands,
}))

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({ t: (key: string) => key }),
  }
})

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')
  return {
    NDataTable: defineComponent({
      name: 'NDataTable',
      props: ['columns', 'data', 'bordered', 'size'],
      template: '<div class="n-data-table" />',
    }),
    NText: defineComponent({
      name: 'NText',
      template: '<span class="n-text"><slot /></span>',
    }),
    NH3: defineComponent({
      name: 'NH3',
      template: '<h3 class="n-h3"><slot /></h3>',
    }),
    NOl: defineComponent({
      name: 'NOl',
      template: '<ol class="n-ol"><slot /></ol>',
    }),
    NLi: defineComponent({
      name: 'NLi',
      template: '<li class="n-li"><slot /></li>',
    }),
    NFlex: defineComponent({
      name: 'NFlex',
      template: '<div class="n-flex"><slot /></div>',
    }),
    NIcon: defineComponent({
      name: 'NIcon',
      props: {
        component: {
          type: Object,
          default: () => ({}),
        },
      },
      template: '<span class="n-icon" />',
    }),
  }
})

import WhatIsCreditCardValidator from './WhatIsCreditCardValidator.vue'

describe('WhatIsCreditCardValidator', () => {
  it('renders the explanation and brand table', () => {
    const wrapper = mount(WhatIsCreditCardValidator, {
      global: {
        stubs: {
          ToolSection: {
            template: '<section class="tool-section"><slot /></section>',
          },
          ToolSectionHeader: {
            template: '<h2 class="tool-header"><slot /></h2>',
          },
        },
      },
    })

    expect(wrapper.text()).toContain('title')
    expect(wrapper.text()).toContain('description')
    expect(wrapper.text()).toContain('luhnTitle')
    expect(wrapper.text()).toContain('luhnDescription')
    expect(wrapper.text()).toContain('luhnStep1')
    expect(wrapper.text()).toContain('luhnStep2')
    expect(wrapper.text()).toContain('luhnStep3')
    expect(wrapper.text()).toContain('brandsTitle')
    expect(wrapper.text()).toContain('brandsDescription')

    const table = wrapper.findComponent({ name: 'NDataTable' })
    const columns = table.props('columns') as Array<{
      key: string
      title: () => string
      render?: (row: (typeof sampleBrands)[number]) => unknown
    }>

    expect(table.props('data')).toEqual(sampleBrands)
    expect(columns).toHaveLength(4)
    expect(columns[0]?.title()).toBe('brandColumn')

    const patternsColumn = columns.find((column) => column.key === 'patterns')
    expect(patternsColumn?.render?.(sampleBrands[0]!)).toBe('4, 51-55')

    const lengthsColumn = columns.find((column) => column.key === 'lengths')
    expect(lengthsColumn?.render?.(sampleBrands[0]!)).toBe('16, 19')
  })
})
