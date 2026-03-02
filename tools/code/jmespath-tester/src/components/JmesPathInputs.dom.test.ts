import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import JmesPathInputs from './JmesPathInputs.vue'

vi.mock('@shared/ui/tool', () => ({
  ToolSection: {
    template: '<section class="tool-section"><slot /></section>',
  },
  ToolSectionHeader: {
    template: '<h3 class="tool-section-header"><slot /></h3>',
  },
}))

vi.mock('@shared/ui/base', () => ({
  CopyToClipboardButton: {
    name: 'CopyToClipboardButton',
    props: ['content'],
    template: '<button class="copy-button" />',
  },
}))

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')
  const Base = defineComponent({
    template: '<div class="base"><slot /></div>',
  })
  const NFormItemGi = defineComponent({
    name: 'NFormItemGi',
    template: '<div class="form-item"><slot name="label" /><slot /><slot name="feedback" /></div>',
  })
  const NInput = defineComponent({
    name: 'NInput',
    template: '<textarea class="n-input" />',
  })
  const NText = defineComponent({
    name: 'NText',
    template: '<span class="n-text"><slot /></span>',
  })
  const NSelect = defineComponent({
    name: 'NSelect',
    template: '<div class="n-select" />',
  })
  return {
    NButton: Base,
    NFlex: Base,
    NFormItemGi,
    NGrid: Base,
    NIcon: Base,
    NInput,
    NSelect,
    NText,
  }
})

describe('JmesPathInputs', () => {
  it('renders error feedback for JSON and query inputs', () => {
    const wrapper = mount(JmesPathInputs, {
      props: {
        exampleOptions: [],
        jsonText: '',
        queryText: '',
        jsonErrorMessage: 'Invalid JSON',
        queryErrorMessage: 'Invalid JMESPath',
        importFromFile: vi.fn(),
        formatJson: vi.fn(),
        'onUpdate:jsonText': () => {},
        'onUpdate:queryText': () => {},
      },
    })

    expect(wrapper.text()).toContain('Invalid JSON')
    expect(wrapper.text()).toContain('Invalid JMESPath')
  })
})
