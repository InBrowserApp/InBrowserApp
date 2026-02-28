import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'

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

    expect(wrapper.text()).toContain('What is Credit Card Validation?')
    expect(wrapper.text()).toContain('card number is potentially valid')
    expect(wrapper.text()).toContain('Luhn Algorithm')
    expect(wrapper.text()).toContain('checksum formula')
    expect(wrapper.text()).toContain('Starting from the rightmost digit, double every second digit')
    expect(wrapper.text()).toContain('Supported Card Brands')
    expect(wrapper.text()).toContain('Bank Identification Number')

    const table = wrapper.findComponent({ name: 'NDataTable' })
    const columns = table.props('columns') as Array<{
      key: string
      title: () => string
      render?: (row: (typeof sampleBrands)[number]) => unknown
    }>

    expect(table.props('data')).toEqual(sampleBrands)
    expect(columns).toHaveLength(4)
    expect(columns[0]?.title()).toBe('Brand')
    expect(columns[1]?.title()).toBe('Prefix')
    expect(columns[2]?.title()).toBe('Length')
    expect(columns[3]?.title()).toBe('CVC')

    const brandColumn = columns.find((column) => column.key === 'name')
    const renderedBrandCell = brandColumn?.render?.(sampleBrands[0]!)
    expect(renderedBrandCell).toBeTruthy()

    const brandCellWrapper = mount(
      defineComponent({
        name: 'BrandCellHost',
        setup: () => () => renderedBrandCell,
      }),
    )
    expect(brandCellWrapper.text()).toContain('Visa')

    const patternsColumn = columns.find((column) => column.key === 'patterns')
    expect(patternsColumn?.render?.(sampleBrands[0]!)).toBe('4, 51-55')

    const lengthsColumn = columns.find((column) => column.key === 'lengths')
    expect(lengthsColumn?.render?.(sampleBrands[0]!)).toBe('16, 19')
  })
})
