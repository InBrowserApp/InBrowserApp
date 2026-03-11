import { mount } from '@vue/test-utils'
import { NTabs } from 'naive-ui'
import { describe, expect, it, vi } from 'vitest'
import type { DotenvEntry } from '@utils/dotenv'
import DotenvResultsSection from './DotenvResultsSection.vue'

const sampleEntries: DotenvEntry[] = [
  {
    line: 1,
    key: 'TOKEN',
    value: 'secret',
    quote: 'single',
    export: true,
    inlineComment: 'first',
    duplicated: false,
    active: true,
  },
  {
    line: 2,
    key: 'URL',
    value: 'https://example.com',
    quote: 'double',
    export: false,
    inlineComment: null,
    duplicated: true,
    active: false,
  },
]

function mountSection(activeTab: 'variables' | 'json' | 'normalized', overrides = {}) {
  const onUpdateActiveTab = vi.fn()

  return mount(DotenvResultsSection, {
    props: {
      activeTab,
      entries: sampleEntries,
      duplicateCount: 1,
      duplicateStrategy: 'last-wins',
      maskValues: false,
      jsonOutput: '{\n  "TOKEN": "secret"\n}',
      normalizedOutput: "TOKEN='secret'",
      downloadJsonUrl: 'blob:json',
      downloadJsonName: 'dotenv.json',
      downloadEnvUrl: 'blob:env',
      downloadEnvName: '.env',
      'onUpdate:activeTab': onUpdateActiveTab,
      ...overrides,
    },
    global: {
      stubs: {
        CopyToClipboardButton: {
          template: '<button data-testid="copy-button" />',
        },
      },
    },
  })
}

describe('DotenvResultsSection', () => {
  it('renders variable rows, quote labels, and statuses', () => {
    const wrapper = mountSection('variables', {
      maskValues: true,
    })

    expect(wrapper.text()).toContain('TOKEN')
    expect(wrapper.text()).toContain('Single')
    expect(wrapper.text()).toContain('Double')
    expect(wrapper.text()).toContain('Active')
    expect(wrapper.text()).toContain('Ignored')
    expect(wrapper.text()).toContain('Values are masked in the current output view.')
    expect(wrapper.text()).toContain('Yes')
    expect(wrapper.text()).toContain('No')
    expect(wrapper.text()).toContain('first')
  })

  it('renders JSON output warnings and masked values', () => {
    const wrapper = mountSection('json', {
      maskValues: true,
      jsonOutput: '{\n  "TOKEN": "••••••"\n}',
    })

    expect(wrapper.text()).toContain('Values are masked in the current output view.')
    expect(wrapper.text()).toContain('Duplicate keys are resolved using last wins.')
    expect(wrapper.text()).toContain('"TOKEN": "••••••"')
  })

  it('renders normalized output help and empty states', () => {
    const normalized = mountSection('normalized')
    expect(normalized.text()).toContain('Normalized output keeps resolved entries only.')
    expect(normalized.text()).toContain("TOKEN='secret'")

    const empty = mountSection('variables', {
      entries: [],
      duplicateCount: 0,
      jsonOutput: '',
      normalizedOutput: '',
    })
    expect(empty.text()).toContain('Add a .env file or paste text to inspect it.')
  })

  it('emits active tab updates when the tab changes', async () => {
    const onUpdateActiveTab = vi.fn()
    const wrapper = mountSection('variables', {
      'onUpdate:activeTab': onUpdateActiveTab,
    })

    await wrapper.findComponent(NTabs).vm.$emit('update:value', 'json')

    expect(onUpdateActiveTab).toHaveBeenCalledWith('json')
  })
})
