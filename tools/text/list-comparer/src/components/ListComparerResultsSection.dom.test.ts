import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ListComparerResultsSection from './ListComparerResultsSection.vue'

vi.mock('@shared/ui/base', () => ({
  CopyToClipboardButton: {
    name: 'CopyToClipboardButton',
    props: ['content', 'disabled'],
    template: '<button class="copy" :data-disabled="String(!!disabled)">copy</button>',
  },
}))

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
      props: ['href', 'download', 'disabled'],
      template:
        '<a :href="href" :download="download" :data-disabled="String(!!disabled)"><span class="button-icon"><slot name="icon" /></span><slot /></a>',
    }),
    NEmpty: defineComponent({
      name: 'NEmpty',
      props: ['description'],
      template: '<div class="empty">{{ description }}</div>',
    }),
    NFlex: defineComponent({
      name: 'NFlex',
      template: '<div><slot /></div>',
    }),
    NInput: defineComponent({
      name: 'NInput',
      props: ['value'],
      template: '<textarea class="result-output" :value="value" />',
    }),
    NIcon: defineComponent({
      name: 'NIcon',
      template: '<span class="n-icon"><slot /></span>',
    }),
    NTabPane: defineComponent({
      name: 'NTabPane',
      props: ['name', 'tab'],
      template: '<div class="tab" :data-name="name">{{ tab }}</div>',
    }),
    NTabs: defineComponent({
      name: 'NTabs',
      props: ['value'],
      emits: ['update:value'],
      template: '<div class="tabs"><slot /></div>',
    }),
    NText: defineComponent({
      name: 'NText',
      template: '<span><slot /></span>',
    }),
  }
})

const comparison = {
  left: {
    totalCount: 6,
    uniqueCount: 5,
    duplicateCount: 1,
    uniqueItems: [],
    duplicateItems: [{ value: 'banana', count: 2 }],
  },
  right: {
    totalCount: 4,
    uniqueCount: 4,
    duplicateCount: 0,
    uniqueItems: [],
    duplicateItems: [],
  },
  commonItems: ['banana', 'apple'],
  leftOnlyItems: ['pear'],
  rightOnlyItems: ['melon'],
  unionItems: ['banana', 'apple', 'pear', 'melon'],
}

describe('ListComparerResultsSection', () => {
  it('renders an empty state when there is no input yet', () => {
    const wrapper = mount(ListComparerResultsSection, {
      props: {
        comparison,
        hasAnyInput: false,
        activeOutput: '',
        activeCount: 0,
        downloadUrl: null,
        downloadName: 'common.txt',
        activeTab: 'common',
        'onUpdate:activeTab': vi.fn(),
      },
    })

    expect(wrapper.text()).toContain('Paste items into either list')
  })

  it('renders active output, tab counts, and enabled download link', () => {
    const updateActiveTab = vi.fn()
    const wrapper = mount(ListComparerResultsSection, {
      props: {
        comparison,
        hasAnyInput: true,
        activeOutput: 'banana\napple',
        activeCount: 2,
        downloadUrl: 'blob:common',
        downloadName: 'common.txt',
        activeTab: 'common',
        'onUpdate:activeTab': updateActiveTab,
      },
    })

    expect(wrapper.text()).toContain('Common (2)')
    expect((wrapper.get('textarea.result-output').element as HTMLTextAreaElement).value).toBe(
      'banana\napple',
    )
    expect(wrapper.get('a[download="common.txt"]').attributes('href')).toBe('blob:common')
    expect(wrapper.get('.copy').attributes('data-disabled')).toBe('false')

    wrapper.getComponent({ name: 'NTabs' }).vm.$emit('update:value', 'right-only')
    expect(updateActiveTab).toHaveBeenCalledWith('right-only')
  })

  it('disables exports and shows a no-items message when the active result set is empty', () => {
    const wrapper = mount(ListComparerResultsSection, {
      props: {
        comparison,
        hasAnyInput: true,
        activeOutput: '',
        activeCount: 0,
        downloadUrl: null,
        downloadName: 'left-duplicates.tsv',
        activeTab: 'left-duplicates',
        'onUpdate:activeTab': vi.fn(),
      },
    })

    expect(wrapper.text()).toContain('No items in this result set.')
    expect(wrapper.get('.copy').attributes('data-disabled')).toBe('true')
    expect(wrapper.get('a[download="left-duplicates.tsv"]').attributes('href')).toBeUndefined()
  })
})
