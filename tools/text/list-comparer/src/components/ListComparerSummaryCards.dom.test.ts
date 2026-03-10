import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ListComparerSummaryCards from './ListComparerSummaryCards.vue'

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')

  return {
    NCard: defineComponent({
      name: 'NCard',
      template: '<div class="card"><slot /></div>',
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
    NStatistic: defineComponent({
      name: 'NStatistic',
      props: ['label', 'value'],
      template: '<div class="stat">{{ label }}: {{ value }}</div>',
    }),
    NText: defineComponent({
      name: 'NText',
      template: '<span><slot /></span>',
    }),
  }
})

describe('ListComparerSummaryCards', () => {
  it('renders all summary values', () => {
    const wrapper = mount(ListComparerSummaryCards, {
      props: {
        leftItemsLabel: 'List A items',
        leftUniqueLabel: 'Unique in A',
        rightItemsLabel: 'List B items',
        rightUniqueLabel: 'Unique in B',
        commonLabel: 'Common items',
        leftOnlyLabel: 'Only in A',
        rightOnlyLabel: 'Only in B',
        leftDuplicatesLabel: 'Duplicates in A',
        rightDuplicatesLabel: 'Duplicates in B',
        leftTotal: 6,
        leftUnique: 5,
        rightTotal: 4,
        rightUnique: 4,
        commonCount: 3,
        leftOnlyCount: 2,
        rightOnlyCount: 1,
        leftDuplicateCount: 1,
        rightDuplicateCount: 0,
      },
    })

    expect(wrapper.text()).toContain('List A items: 6')
    expect(wrapper.text()).toContain('Unique in A: 5')
    expect(wrapper.text()).toContain('Common items: 3')
    expect(wrapper.text()).toContain('Duplicates in B: 0')
  })
})
