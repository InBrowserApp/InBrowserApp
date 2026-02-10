import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import FieldValue from './FieldValue.vue'

const CopyButtonStub = defineComponent({
  name: 'CopyToClipboardButton',
  props: {
    content: {
      type: String,
      required: true,
    },
  },
  template: '<button data-testid="copy" :data-content="content" />',
})

type FieldValueProps = {
  emptyValue: string
  value?: string | number | string[]
  suffix?: string
}

const mountFieldValue = (props: FieldValueProps) =>
  mount(FieldValue, {
    props,
    global: {
      stubs: {
        CopyToClipboardButton: CopyButtonStub,
      },
    },
  })

describe('FieldValue', () => {
  it('renders empty fallback and hides copy button for undefined or empty values', async () => {
    const wrapper = mountFieldValue({ value: undefined, emptyValue: 'Not available' })
    expect(wrapper.text()).toContain('Not available')
    expect(wrapper.find('[data-testid="copy"]').exists()).toBe(false)

    await wrapper.setProps({ value: '' })
    expect(wrapper.text()).toContain('Not available')
    expect(wrapper.find('[data-testid="copy"]').exists()).toBe(false)

    await wrapper.setProps({ value: null as unknown as string })
    expect(wrapper.text()).toContain('Not available')
    expect(wrapper.find('[data-testid="copy"]').exists()).toBe(false)
  })

  it('joins arrays and falls back for empty arrays', async () => {
    const wrapper = mountFieldValue({ value: [], emptyValue: 'N/A' })
    expect(wrapper.text()).toContain('N/A')
    expect(wrapper.find('[data-testid="copy"]').exists()).toBe(false)

    await wrapper.setProps({ value: ['DNS: example.com', 'DNS: api.example.com'] })
    const copyButton = wrapper.get('[data-testid="copy"]')
    expect(copyButton.attributes('data-content')).toBe('DNS: example.com, DNS: api.example.com')
  })

  it('formats numbers and strings with optional suffix', async () => {
    const wrapper = mountFieldValue({ value: 2048, emptyValue: 'N/A', suffix: 'bits' })
    expect(wrapper.get('[data-testid="copy"]').attributes('data-content')).toBe('2048 bits')

    await wrapper.setProps({ value: 42, suffix: undefined })
    expect(wrapper.get('[data-testid="copy"]').attributes('data-content')).toBe('42')

    await wrapper.setProps({ value: 'RSA', suffix: undefined })
    expect(wrapper.get('[data-testid="copy"]').attributes('data-content')).toBe('RSA')

    await wrapper.setProps({ value: 'RSA', suffix: 'algorithm' })
    expect(wrapper.get('[data-testid="copy"]').attributes('data-content')).toBe('RSA algorithm')
  })
})
