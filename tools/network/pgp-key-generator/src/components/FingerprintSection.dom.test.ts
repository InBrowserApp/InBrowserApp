import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'

import FingerprintSection from './FingerprintSection.vue'

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')
  const Base = defineComponent({
    template: '<div><slot /></div>',
  })

  return {
    NDescriptions: Base,
    NDescriptionsItem: defineComponent({
      props: {
        label: {
          type: String,
          default: '',
        },
      },
      template: '<div class="item">{{ label }}<slot /></div>',
    }),
    NText: Base,
  }
})

describe('FingerprintSection', () => {
  it('renders user ID when provided', () => {
    const wrapper = mount(FingerprintSection, {
      props: {
        fingerprint: 'FINGERPRINT',
        keyId: 'KEYID',
        userId: 'Alice',
      },
      global: {
        stubs: {
          ToolSection: { template: '<section><slot /></section>' },
          ToolSectionHeader: { template: '<header><slot /></header>' },
        },
      },
    })

    expect(wrapper.text()).toContain('User ID')
    expect(wrapper.text()).toContain('Alice')
    expect(wrapper.text()).toContain('FINGERPRINT')
    expect(wrapper.text()).toContain('KEYID')
  })

  it('omits user ID row when empty', () => {
    const wrapper = mount(FingerprintSection, {
      props: {
        fingerprint: 'FINGERPRINT',
        keyId: 'KEYID',
        userId: '',
      },
      global: {
        stubs: {
          ToolSection: { template: '<section><slot /></section>' },
          ToolSectionHeader: { template: '<header><slot /></header>' },
        },
      },
    })

    expect(wrapper.text()).not.toContain('User ID')
    expect(wrapper.text()).toContain('FINGERPRINT')
  })
})
