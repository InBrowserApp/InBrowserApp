import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import { NMessageProvider, NTabs } from 'naive-ui'
import RegexResults from './RegexResults.vue'
import type { RegexMatch } from '../utils'

const baseProps = {
  activeTab: 'preview' as const,
  'onUpdate:activeTab': () => {},
  patternError: '',
  showSummaryCounts: false,
  matchesCount: 0,
  groupsCount: 0,
  zeroLengthCount: 0,
  previewText: '',
  previewHtml: '',
  previewTruncated: false,
  previewLimit: 5000,
  matchesTruncated: false,
  matchLimit: 200,
  matches: [] as RegexMatch[],
  replaceOutput: '',
}

const withMessageProvider = (props = {}) => ({
  render() {
    return h(NMessageProvider, () => h(RegexResults, { ...baseProps, ...props }))
  },
})

describe('RegexResults', () => {
  it('shows empty summary and preview placeholders', () => {
    const wrapper = mount(withMessageProvider())

    expect(wrapper.text()).toContain('Enter a pattern and text to see results.')
    expect(wrapper.text()).toContain('No text to preview.')
  })

  it('renders an error alert when the pattern is invalid', () => {
    const wrapper = mount(withMessageProvider({ patternError: 'Invalid regex' }))

    expect(wrapper.text()).toContain('Invalid regex')
  })

  it('renders summary counts and highlight preview', () => {
    const wrapper = mount(
      withMessageProvider({
        showSummaryCounts: true,
        matchesCount: 1,
        groupsCount: 2,
        zeroLengthCount: 1,
        previewText: 'Order #123-ABC',
        previewHtml: 'Order <mark class="preview-match">#123-ABC</mark>',
      }),
    )

    const text = wrapper.text()
    expect(text).toContain('Matches: 1')
    expect(text).toContain('Capturing groups: 2')
    expect(text).toContain('zero-length match')
    expect(wrapper.find('.preview-match').exists()).toBe(true)
  })

  it('shows the preview truncation hint', () => {
    const wrapper = mount(
      withMessageProvider({
        showSummaryCounts: true,
        matchesCount: 1,
        groupsCount: 2,
        previewText: 'abc',
        previewHtml: 'abc',
        previewTruncated: true,
        previewLimit: 3,
      }),
    )

    expect(wrapper.text()).toContain('Preview limited to first 3 characters.')
  })

  it('renders summary-empty text in matches tab when no valid run exists', () => {
    const wrapper = mount(
      withMessageProvider({
        activeTab: 'matches',
        showSummaryCounts: false,
      }),
    )

    expect(wrapper.text()).toContain('Enter a pattern and text to see results.')
  })

  it('renders the no-matches state in matches tab', () => {
    const wrapper = mount(
      withMessageProvider({
        activeTab: 'matches',
        showSummaryCounts: true,
        matchesCount: 0,
        groupsCount: 0,
        matches: [],
      }),
    )

    expect(wrapper.text()).toContain('No matches found.')
  })

  it('renders match details, truncation note, and empty-group fallbacks in matches tab', () => {
    const matches: RegexMatch[] = [
      {
        index: 6,
        end: 14,
        match: '',
        groups: ['', 'ABC'],
        namedGroups: { id: '' },
      },
    ]

    const wrapper = mount(
      withMessageProvider({
        activeTab: 'matches',
        showSummaryCounts: true,
        matchesCount: 1,
        groupsCount: 2,
        matchesTruncated: true,
        matchLimit: 1,
        matches,
      }),
    )

    const text = wrapper.text()
    expect(text).toContain('Showing first 1 matches.')
    expect(text).toContain('Range: 6-14')
    expect(text).toContain('#1')
    expect(text).toContain('Groups:')
    expect(text).toContain('Named groups:')
    expect(text).toContain('(empty)')
    expect(text).toContain('id=(empty)')
  })

  it('forwards active tab updates from tabs', () => {
    const onUpdate = vi.fn()
    const wrapper = mount(
      withMessageProvider({
        activeTab: 'preview',
        'onUpdate:activeTab': onUpdate,
      }),
    )

    wrapper.getComponent(NTabs).vm.$emit('update:value', 'replace')

    expect(onUpdate).toHaveBeenCalledWith('replace')
  })

  it('renders replacement output in the replace tab', () => {
    const wrapper = mount(
      withMessageProvider({
        activeTab: 'replace',
        showSummaryCounts: true,
        matchesCount: 1,
        groupsCount: 2,
        replaceOutput: 'ID:123 Code:ABC',
      }),
    )

    const textarea = wrapper.find('textarea')
    expect(textarea.exists()).toBe(true)
    expect(textarea.element.value).toBe('ID:123 Code:ABC')
  })
})
