import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'

import FingerprintSection from './FingerprintSection.vue'

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({ t: (key: string) => key }),
  }
})

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')
  const Base = defineComponent({
    template: '<div><slot /></div>',
  })

  return {
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
    NFlex: Base,
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

    expect(wrapper.text()).toContain('fingerprint')
    expect(wrapper.get('.fingerprint').attributes('value')).toBe('FINGERPRINT')
    expect(wrapper.find('.copy').exists()).toBe(true)
  })
})
