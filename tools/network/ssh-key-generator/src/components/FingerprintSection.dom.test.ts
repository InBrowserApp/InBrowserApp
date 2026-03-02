import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import FingerprintSection from './FingerprintSection.vue'
vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')
  const actual = (await vi.importActual('naive-ui')) as Record<string, unknown>
  return {
    ...actual,
    NInput: defineComponent({
      name: 'NInput',
      props: {
        value: {
          type: String,
          default: '',
        },
      },
      template: '<input class="fingerprint" :value="value" />',
    }),
  }
})
describe('FingerprintSection', () => {
  it('renders fingerprint value and copy button', () => {
    const wrapper = mount(FingerprintSection, {
      props: {
        value: 'FINGERPRINT',
      },
      global: {
        stubs: {
          ToolSection: { template: '<section><slot /></section>' },
          ToolSectionHeader: { template: '<header><slot /></header>' },
          CopyToClipboardButton: { template: '<button class="copy" />' },
        },
      },
    })
    expect(wrapper.text()).toContain('Fingerprint')
    expect(wrapper.get('.fingerprint').attributes('value')).toBe('FINGERPRINT')
    expect(wrapper.find('.copy').exists()).toBe(true)
  })
})
