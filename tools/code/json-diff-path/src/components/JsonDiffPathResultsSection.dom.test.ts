import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { NCode } from 'naive-ui'
import JsonDiffPathResultsSection from './JsonDiffPathResultsSection.vue'

vi.mock('@shared/ui/base', () => ({
  CopyToClipboardButton: {
    name: 'CopyToClipboardButton',
    props: ['content', 'disabled'],
    template: '<button class="copy" :data-disabled="String(!!disabled)">copy</button>',
  },
}))

type ResultsProps = {
  isReady: boolean
  originalError?: { message: string; line?: number; column?: number }
  modifiedError?: { message: string; line?: number; column?: number }
  filteredCount: number
  totalCount: number
  formattedPaths: string
  formattedPatch: string
  pathsDownloadUrl: string
  patchDownloadUrl: string
  pendingLargeCompare?: boolean
  activeTab: 'paths' | 'patch'
  'onUpdate:activeTab': (value: 'paths' | 'patch') => void
}

const mountSection = (overrides: Partial<Omit<ResultsProps, 'onUpdate:activeTab'>> = {}) => {
  const updateActiveTab = vi.fn()
  const props: ResultsProps = {
    isReady: true,
    originalError: undefined,
    modifiedError: undefined,
    filteredCount: 2,
    totalCount: 4,
    formattedPaths: '[{"op":"add","path":"$.a"}]',
    formattedPatch: '[{"op":"replace","path":"/a"}]',
    pathsDownloadUrl: 'blob:paths',
    patchDownloadUrl: 'blob:patch',
    pendingLargeCompare: false,
    activeTab: 'paths',
    'onUpdate:activeTab': updateActiveTab,
    ...overrides,
  }

  const wrapper = mount(JsonDiffPathResultsSection, { props })

  return { wrapper, updateActiveTab }
}

describe('JsonDiffPathResultsSection', () => {
  it('renders empty state when inputs are not ready', () => {
    const { wrapper } = mountSection({
      isReady: false,
      filteredCount: 0,
      totalCount: 0,
    })

    expect(wrapper.text()).toContain('Enter valid JSON in both editors to see differences')
  })

  it('renders modified parse errors without line/column details', () => {
    const { wrapper } = mountSection({
      isReady: false,
      modifiedError: { message: 'boom' },
    })

    expect(wrapper.text()).toContain('Modified: JSON parse error: boom')
  })

  it('shows no-change state in patch tab when filtered count is zero', () => {
    const { wrapper } = mountSection({
      filteredCount: 0,
      totalCount: 4,
      activeTab: 'patch',
    })

    expect(wrapper.text()).toContain('No changes for current filters')
  })

  it('renders patch output when patch tab is active', () => {
    const { wrapper } = mountSection({ activeTab: 'patch' })

    const code = wrapper.findComponent(NCode).props('code') as string
    expect(code).toContain('"path":"/a"')
  })

  it('shows a large-json pending message when manual compare is required', () => {
    const { wrapper } = mountSection({
      isReady: false,
      pendingLargeCompare: true,
      filteredCount: 0,
      totalCount: 0,
    })

    expect(wrapper.text()).toContain('Large JSON changes are pending')
  })

  it('disables copy and download exports while large-json changes are pending', () => {
    const { wrapper } = mountSection({
      isReady: true,
      pendingLargeCompare: true,
    })

    const copyButton = wrapper.get('.copy')
    const pathsLink = wrapper.get('a[download="json-diff-paths.json"]')
    const patchLink = wrapper.get('a[download="json-diff-patch.json"]')

    expect(copyButton.attributes('data-disabled')).toBe('true')
    expect(pathsLink.attributes('href')).toBeUndefined()
    expect(patchLink.attributes('href')).toBeUndefined()
  })
})
