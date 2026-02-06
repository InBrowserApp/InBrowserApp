import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import { createI18n } from 'vue-i18n'
import CertificatePublicKeyResults from './CertificatePublicKeyResults.vue'

const ToolSectionHeaderStub = defineComponent({
  name: 'ToolSectionHeader',
  template: '<h2 data-testid="results-title"><slot /></h2>',
})

const ToolSectionStub = defineComponent({
  name: 'ToolSection',
  template: '<section data-testid="results-section"><slot /></section>',
})

const ParsedEntryDetailsStub = defineComponent({
  name: 'ParsedEntryDetails',
  props: {
    entry: {
      type: Object,
      required: true,
    },
  },
  template: '<div data-testid="details" :data-label="entry.label" />',
})

const certificateEntry = {
  type: 'certificate' as const,
  label: 'Certificate 1',
  subject: 'CN=example.com',
  issuer: 'CN=Issuer',
  serialNumber: '01',
  notBefore: '2024-01-01',
  notAfter: '2025-01-01',
  signatureAlgorithm: 'RSA',
  publicKeyAlgorithm: 'RSA',
  publicKeySize: 2048,
  fingerprints: {
    sha1: 'AA',
    sha256: 'BB',
  },
  extensions: {},
}

const publicKeyEntry = {
  type: 'publicKey' as const,
  label: 'Public Key 1',
  algorithm: 'EC',
  keySize: 256,
  curve: 'P-256',
  fingerprints: {
    sha1: 'CC',
    sha256: 'DD',
  },
}

const mountResults = (entries: Array<typeof certificateEntry | typeof publicKeyEntry>) => {
  const i18n = createI18n({
    legacy: false,
    locale: 'en',
    messages: { en: {} },
    missingWarn: false,
    fallbackWarn: false,
  })

  return mount(CertificatePublicKeyResults, {
    props: { entries },
    global: {
      plugins: [i18n],
      stubs: {
        ToolSectionHeader: ToolSectionHeaderStub,
        ToolSection: ToolSectionStub,
        ParsedEntryDetails: ParsedEntryDetailsStub,
      },
    },
  })
}

describe('CertificatePublicKeyResults', () => {
  it('hides the results container when entries are empty', () => {
    const wrapper = mountResults([])
    expect(wrapper.find('[data-testid="results-title"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="results-section"]').exists()).toBe(false)
  })

  it('renders a single details panel without tabs for one entry', () => {
    const wrapper = mountResults([certificateEntry])
    expect(wrapper.get('[data-testid="results-title"]').text()).toContain('Parsed Result')
    expect(wrapper.find('.n-tabs').exists()).toBe(false)

    const details = wrapper.findAll('[data-testid="details"]')
    expect(details).toHaveLength(1)
    expect(details[0]?.attributes('data-label')).toBe('Certificate 1')
  })

  it('renders a tabbed layout when there are multiple entries', () => {
    const wrapper = mountResults([certificateEntry, publicKeyEntry])

    expect(wrapper.find('.n-tabs').exists()).toBe(true)
    expect(wrapper.text()).toContain('Certificate 1')
    expect(wrapper.text()).toContain('Public Key 1')

    const details = wrapper.findAll('[data-testid="details"]')
    expect(details).toHaveLength(1)
    expect(details[0]?.attributes('data-label')).toBe('Certificate 1')
  })
})
