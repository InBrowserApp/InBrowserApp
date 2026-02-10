import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import { createI18n } from 'vue-i18n'
import ParsedEntryOverviewSection from './ParsedEntryOverviewSection.vue'

const FieldValueStub = defineComponent({
  name: 'FieldValue',
  props: {
    value: {
      type: [String, Number, Array],
      default: undefined,
    },
    emptyValue: {
      type: String,
      required: true,
    },
    suffix: {
      type: String,
      default: undefined,
    },
  },
  template:
    '<span data-testid="field-value">{{ value === undefined ? emptyValue : suffix ? `${value} ${suffix}` : value }}</span>',
})

type OverviewProps = {
  isCertificate: boolean
  serialNumber?: string
  signatureAlgorithm?: string
  keyAlgorithm?: string
  keySize?: number
  curve?: string
}

const mountSection = (props: OverviewProps) => {
  const i18n = createI18n({
    legacy: false,
    locale: 'en',
    messages: { en: {} },
    missingWarn: false,
    fallbackWarn: false,
  })

  return mount(ParsedEntryOverviewSection, {
    props,
    global: {
      plugins: [i18n],
      stubs: {
        FieldValue: FieldValueStub,
      },
    },
  })
}

describe('ParsedEntryOverviewSection', () => {
  it('renders certificate overview fields', () => {
    const wrapper = mountSection({
      isCertificate: true,
      serialNumber: '01:02',
      signatureAlgorithm: 'RSA-PSS',
      keyAlgorithm: 'RSA',
      keySize: 2048,
      curve: 'P-256',
    })

    expect(wrapper.text()).toContain('Certificate')
    expect(wrapper.text()).toContain('Serial Number')
    expect(wrapper.text()).toContain('Signature Algorithm')
    expect(wrapper.text()).toContain('RSA-PSS')
    expect(wrapper.text()).toContain('2048 bits')
  })

  it('renders public key overview without certificate-only fields', () => {
    const wrapper = mountSection({
      isCertificate: false,
      keyAlgorithm: 'EC',
      keySize: 256,
      curve: 'P-256',
    })

    expect(wrapper.text()).toContain('Public Key')
    expect(wrapper.text()).toContain('Key Algorithm')
    expect(wrapper.text()).toContain('EC')
    expect(wrapper.text()).not.toContain('Serial Number')
    expect(wrapper.text()).not.toContain('Signature Algorithm')
  })
})
