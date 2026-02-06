import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import CertificatePublicKeyAlerts from './CertificatePublicKeyAlerts.vue'

const createTestI18n = () =>
  createI18n({
    legacy: false,
    locale: 'en',
    messages: { en: {} },
    missingWarn: false,
    fallbackWarn: false,
  })

const mountAlerts = (props: { errorMessage?: string; warnings: string[] }) =>
  mount(CertificatePublicKeyAlerts, {
    props,
    global: {
      plugins: [createTestI18n()],
    },
  })

describe('CertificatePublicKeyAlerts', () => {
  it('renders nothing when there are no errors or warnings', () => {
    const wrapper = mountAlerts({ warnings: [] })
    expect(wrapper.text()).toBe('')
    expect(wrapper.findAll('.n-alert')).toHaveLength(0)
  })

  it('renders parsing error alert when error message is present', () => {
    const wrapper = mountAlerts({ errorMessage: 'Failed to parse', warnings: [] })
    expect(wrapper.text()).toContain('Parsing Error')
    expect(wrapper.text()).toContain('Failed to parse')
  })

  it('renders warnings alert and each warning row', () => {
    const wrapper = mountAlerts({
      errorMessage: 'Parse failed',
      warnings: ['Unsupported block', 'Using fallback parser'],
    })

    expect(wrapper.text()).toContain('Warnings')
    expect(wrapper.text()).toContain('Unsupported block')
    expect(wrapper.text()).toContain('Using fallback parser')
    expect(wrapper.text()).toContain('Parse failed')
  })
})
