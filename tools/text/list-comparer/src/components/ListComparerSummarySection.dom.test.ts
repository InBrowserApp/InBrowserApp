import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import ListComparerSummarySection from './ListComparerSummarySection.vue'

const comparison = {
  left: {
    totalCount: 6,
    uniqueCount: 5,
    duplicateCount: 1,
    uniqueItems: [],
    duplicateItems: [{ value: 'banana', count: 2 }],
  },
  right: { totalCount: 4, uniqueCount: 4, duplicateCount: 0, uniqueItems: [], duplicateItems: [] },
  commonItems: ['banana'],
  leftOnlyItems: ['apple'],
  rightOnlyItems: ['pear'],
  unionItems: ['banana', 'apple', 'pear'],
}

describe('ListComparerSummarySection', () => {
  it('renders the summary header, hint, and passes metrics to cards', () => {
    const wrapper = mount(ListComparerSummarySection, {
      props: { comparison },
      global: {
        stubs: {
          ToolSection: defineComponent({
            template: '<section><slot /></section>',
          }),
          ToolSectionHeader: defineComponent({
            template: '<h2><slot /></h2>',
          }),
          NAlert: defineComponent({
            props: ['type'],
            template: '<div class="alert"><slot /></div>',
          }),
          NFlex: defineComponent({
            template: '<div><slot /></div>',
          }),
          ListComparerSummaryCards: defineComponent({
            props: [
              'leftItemsLabel',
              'leftUniqueLabel',
              'rightItemsLabel',
              'rightUniqueLabel',
              'commonLabel',
              'leftOnlyLabel',
              'rightOnlyLabel',
              'leftDuplicatesLabel',
              'rightDuplicatesLabel',
              'leftTotal',
              'leftUnique',
              'rightTotal',
              'rightUnique',
              'commonCount',
              'leftOnlyCount',
              'rightOnlyCount',
              'leftDuplicateCount',
              'rightDuplicateCount',
            ],
            template:
              '<div class="cards" :data-left-total="leftTotal" :data-common="commonCount" :data-left-dup="leftDuplicateCount" />',
          }),
        },
      },
    })

    expect(wrapper.text()).toContain('Comparison Summary')
    expect(wrapper.text()).toContain('Results are set-based')
    expect(wrapper.get('.cards').attributes('data-left-total')).toBe('6')
    expect(wrapper.get('.cards').attributes('data-common')).toBe('1')
    expect(wrapper.get('.cards').attributes('data-left-dup')).toBe('1')
  })
})
