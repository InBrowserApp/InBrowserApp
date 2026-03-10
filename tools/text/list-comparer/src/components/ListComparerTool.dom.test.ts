import { computed, defineComponent, nextTick } from 'vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ListComparerTool from './ListComparerTool.vue'

const { storageRefs, storageSeeds } = vi.hoisted(() => ({
  storageRefs: new Map<string, { value: unknown }>(),
  storageSeeds: new Map<string, unknown>(),
}))

vi.mock('@vueuse/core', async () => {
  const { ref, computed } = await import('vue')

  return {
    useStorage: (key: string, initialValue: unknown) => {
      const value = ref(storageSeeds.get(key) ?? initialValue)
      storageRefs.set(key, value)
      return value
    },
    useObjectUrl: (value: { value: File | null }) =>
      computed(() => (value.value ? `blob:${value.value.name}` : null)),
  }
})

const InputStub = defineComponent({
  name: 'ListComparerInputSection',
  props: ['leftText', 'rightText', 'leftSummary', 'rightSummary'],
  emits: ['swap', 'use-sample', 'clear', 'update:leftText', 'update:rightText'],
  template: `
    <div class="inputs" :data-left-total="leftSummary.totalCount" :data-right-total="rightSummary.totalCount">
      <button class="swap" @click="$emit('swap')">swap</button>
      <button class="sample" @click="$emit('use-sample')">sample</button>
      <button class="clear" @click="$emit('clear')">clear</button>
      <button class="set-left-text" @click="$emit('update:leftText', 'Banana|kiwi|pear||')">set-left</button>
      <button class="set-right-text" @click="$emit('update:rightText', 'banana|melon|pear|pear|')">set-right</button>
    </div>
  `,
})

const OptionsStub = defineComponent({
  name: 'ListComparerOptionsSection',
  props: [
    'delimiterMode',
    'customDelimiter',
    'trimItems',
    'ignoreCase',
    'omitEmptyItems',
    'sortResults',
  ],
  emits: [
    'update:delimiterMode',
    'update:customDelimiter',
    'update:trimItems',
    'update:ignoreCase',
    'update:omitEmptyItems',
    'update:sortResults',
  ],
  template: `
    <div class="options">
      <button class="set-delimiter-custom" @click="$emit('update:delimiterMode', 'custom')">delimiter</button>
      <button class="set-custom-delimiter" @click="$emit('update:customDelimiter', '|')">custom-delimiter</button>
      <button class="set-trim-items" @click="$emit('update:trimItems', true)">trim</button>
      <button class="set-ignore-case" @click="$emit('update:ignoreCase', true)">ignore-case</button>
      <button class="set-omit-empty-items" @click="$emit('update:omitEmptyItems', false)">omit-empty</button>
      <button class="set-sort-results" @click="$emit('update:sortResults', true)">sort-results</button>
    </div>
  `,
})

const SummaryStub = defineComponent({
  name: 'ListComparerSummarySection',
  props: ['comparison'],
  template: '<div class="summary" :data-common="comparison.commonItems.length" />',
})

const ResultsStub = defineComponent({
  name: 'ListComparerResultsSection',
  props: [
    'comparison',
    'hasAnyInput',
    'activeOutput',
    'activeCount',
    'downloadUrl',
    'downloadName',
    'activeTab',
  ],
  emits: ['update:activeTab'],
  template: `
    <div
      class="results"
      :data-active-count="String(activeCount)"
      :data-download-name="downloadName"
      :data-download-url="downloadUrl ?? ''"
      :data-has-input="String(hasAnyInput)"
    >
      {{ activeOutput }}
      <button class="tab-left-only" @click="$emit('update:activeTab', 'left-only')">left-only</button>
      <button class="tab-right-only" @click="$emit('update:activeTab', 'right-only')">right-only</button>
      <button class="tab-all-unique" @click="$emit('update:activeTab', 'all-unique')">all-unique</button>
      <button class="tab-left-duplicates" @click="$emit('update:activeTab', 'left-duplicates')">left-duplicates</button>
      <button class="tab-right-duplicates" @click="$emit('update:activeTab', 'right-duplicates')">right-duplicates</button>
      <button class="tab-invalid" @click="$emit('update:activeTab', 'unknown')">invalid</button>
    </div>
  `,
})

describe('ListComparerTool', () => {
  beforeEach(() => {
    storageRefs.clear()
    storageSeeds.clear()
  })

  it('derives active output and download metadata from the selected tab', async () => {
    const wrapper = mount(ListComparerTool, {
      global: {
        stubs: {
          ListComparerInputSection: InputStub,
          ListComparerOptionsSection: OptionsStub,
          ListComparerSummarySection: SummaryStub,
          ListComparerResultsSection: ResultsStub,
        },
      },
    })

    const results = () => wrapper.get('.results')

    expect(results().attributes('data-active-count')).toBe('3')
    expect(results().attributes('data-download-name')).toBe('common.txt')
    expect(results().text()).toContain('banana\nkiwi\napple')

    await results().get('.tab-left-duplicates').trigger('click')

    expect(results().attributes('data-active-count')).toBe('1')
    expect(results().attributes('data-download-name')).toBe('left-duplicates.tsv')
    expect(results().text()).toContain('banana\t2')

    await results().get('.tab-right-only').trigger('click')

    expect(results().attributes('data-active-count')).toBe('2')
    expect(results().attributes('data-download-name')).toBe('right-only.txt')
    expect(results().text()).toContain('grape\nmelon')

    await results().get('.tab-all-unique').trigger('click')

    expect(results().attributes('data-active-count')).toBe('7')
    expect(results().attributes('data-download-name')).toBe('all-unique.txt')
    expect(results().text()).toContain('banana\nkiwi\nmango\npear\napple\ngrape\nmelon')

    await results().get('.tab-right-duplicates').trigger('click')

    expect(results().attributes('data-active-count')).toBe('1')
    expect(results().attributes('data-download-name')).toBe('right-duplicates.tsv')
    expect(results().text()).toContain('apple\t2')

    await results().get('.tab-invalid').trigger('click')

    expect(results().attributes('data-active-count')).toBe('3')
    expect(results().attributes('data-download-name')).toBe('common.txt')
    expect(results().text()).toContain('banana\nkiwi\napple')
  })

  it('handles swap, clear, and sample actions from the input section', async () => {
    const wrapper = mount(ListComparerTool, {
      global: {
        stubs: {
          ListComparerInputSection: InputStub,
          ListComparerOptionsSection: OptionsStub,
          ListComparerSummarySection: SummaryStub,
          ListComparerResultsSection: ResultsStub,
        },
      },
    })

    const results = () => wrapper.get('.results')

    await results().get('.tab-left-only').trigger('click')
    expect(results().text()).toContain('mango\npear')

    await wrapper.get('.swap').trigger('click')
    expect(results().text()).toContain('grape\nmelon')

    await wrapper.get('.clear').trigger('click')
    expect(results().attributes('data-has-input')).toBe('false')
    expect(results().attributes('data-active-count')).toBe('0')

    await wrapper.get('.sample').trigger('click')
    expect(results().attributes('data-has-input')).toBe('true')
    expect(results().attributes('data-active-count')).toBe('2')
    expect(results().text()).toContain('mango\npear')
  })

  it('normalizes invalid persisted delimiter and tab state', async () => {
    storageSeeds.set('tools:list-comparer:delimiter-mode', 'invalid')
    storageSeeds.set('tools:list-comparer:active-tab', 'invalid')

    const wrapper = mount(ListComparerTool, {
      global: {
        stubs: {
          ListComparerInputSection: InputStub,
          ListComparerOptionsSection: OptionsStub,
          ListComparerSummarySection: SummaryStub,
          ListComparerResultsSection: ResultsStub,
        },
      },
    })

    await nextTick()

    const results = () => wrapper.get('.results')

    expect(results().attributes('data-active-count')).toBe('3')
    expect(results().attributes('data-download-name')).toBe('common.txt')
    expect(results().text()).toContain('banana\nkiwi\napple')
    expect(storageRefs.get('tools:list-comparer:delimiter-mode')?.value).toBe('newline')
    expect(storageRefs.get('tools:list-comparer:active-tab')?.value).toBe('common')
  })

  it('reacts to list and option model updates from child sections', async () => {
    const wrapper = mount(ListComparerTool, {
      global: {
        stubs: {
          ListComparerInputSection: InputStub,
          ListComparerOptionsSection: OptionsStub,
          ListComparerSummarySection: SummaryStub,
          ListComparerResultsSection: ResultsStub,
        },
      },
    })

    const results = () => wrapper.get('.results')

    await wrapper.get('.set-left-text').trigger('click')
    await wrapper.get('.set-right-text').trigger('click')
    await wrapper.get('.set-delimiter-custom').trigger('click')
    await wrapper.get('.set-custom-delimiter').trigger('click')
    await wrapper.get('.set-trim-items').trigger('click')
    await wrapper.get('.set-ignore-case').trigger('click')
    await wrapper.get('.set-omit-empty-items').trigger('click')
    await wrapper.get('.set-sort-results').trigger('click')

    expect(results().text()).toContain('Banana\npear')

    await results().get('.tab-right-only').trigger('click')
    expect(results().attributes('data-active-count')).toBe('1')
    expect(results().text()).toContain('melon')

    await results().get('.tab-right-duplicates').trigger('click')
    expect(results().text()).toContain('pear\t2')
    expect(results().attributes('data-download-url')).toBe(
      'blob:list-comparer-right-duplicates.tsv',
    )
  })
})
