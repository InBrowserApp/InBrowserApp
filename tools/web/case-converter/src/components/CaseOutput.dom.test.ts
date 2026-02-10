import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import CaseOutput from './CaseOutput.vue'

const ToolSectionStub = defineComponent({
  name: 'ToolSection',
  template: '<section class="tool-section"><slot /></section>',
})

const NFlexStub = defineComponent({
  name: 'NFlex',
  template: '<div class="n-flex"><slot /></div>',
})

const NTextStub = defineComponent({
  name: 'NText',
  template: '<span class="n-text"><slot /></span>',
})

const CopyToClipboardButtonStub = defineComponent({
  name: 'CopyToClipboardButton',
  props: { content: { type: String, default: '' } },
  template: '<button class="copy" :data-content="content" />',
})

const stubs = {
  ToolSection: ToolSectionStub,
  NFlex: NFlexStub,
  NText: NTextStub,
  CopyToClipboardButton: CopyToClipboardButtonStub,
}

describe('CaseOutput', () => {
  it('renders the label, value, and copy content', () => {
    const wrapper = mount(CaseOutput, {
      props: {
        label: 'camelCase',
        value: 'helloWorld',
      },
      global: { stubs },
    })

    expect(wrapper.text()).toContain('camelCase')
    expect(wrapper.text()).toContain('helloWorld')
    expect(wrapper.find('.copy').attributes('data-content')).toBe('helloWorld')
  })

  it('shows a placeholder when value is empty', () => {
    const wrapper = mount(CaseOutput, {
      props: {
        label: 'snake_case',
        value: '',
      },
      global: { stubs },
    })

    expect(wrapper.find('.n-text').text()).toBe('-')
  })
})
