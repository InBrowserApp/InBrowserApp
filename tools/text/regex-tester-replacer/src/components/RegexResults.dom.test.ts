import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import { NMessageProvider } from 'naive-ui'
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

  it('renders match details in the matches tab', () => {
    const matches: RegexMatch[] = [
      {
        index: 6,
        end: 14,
        match: '#123-ABC',
        groups: ['123', 'ABC'],
        namedGroups: { id: '123' },
      },
    ]

    const wrapper = mount(
      withMessageProvider({
        activeTab: 'matches',
        showSummaryCounts: true,
        matchesCount: 1,
        groupsCount: 2,
        previewText: 'Order #123-ABC',
        previewHtml: 'Order <mark class="preview-match">#123-ABC</mark>',
        matches,
      }),
    )

    const text = wrapper.text()
    expect(text).toContain('Range: 6-14')
    expect(text).toContain('#1')
    expect(text).toContain('Groups:')
    expect(text).toContain('Named groups:')
    expect(text).toContain('id=123')
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
