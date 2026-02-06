import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import { createI18n } from 'vue-i18n'
import ParsedEntryExtensionsSection from './ParsedEntryExtensionsSection.vue'

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
  },
  template:
    '<span data-testid="field-value">{{ Array.isArray(value) ? value.join(", ") : value ?? emptyValue }}</span>',
})

const mountSection = (extensions: Record<string, unknown>) => {
  const i18n = createI18n({
    legacy: false,
    locale: 'en',
    messages: { en: {} },
    missingWarn: false,
    fallbackWarn: false,
  })

  return mount(ParsedEntryExtensionsSection, {
    props: {
      extensions,
    },
    global: {
      plugins: [i18n],
      stubs: {
        FieldValue: FieldValueStub,
      },
    },
  })
}

describe('ParsedEntryExtensionsSection', () => {
  it('renders every extension row when values are present', () => {
    const wrapper = mountSection({
      subjectAlternativeNames: ['DNS: example.com'],
      keyUsage: ['Digital Signature'],
      extendedKeyUsage: ['Server Auth'],
      basicConstraints: 'CA: false',
      subjectKeyIdentifier: 'AA:BB',
      authorityKeyIdentifier: 'CC:DD',
    })

    expect(wrapper.text()).toContain('Extensions')
    expect(wrapper.text()).toContain('Subject Alternative Name')
    expect(wrapper.text()).toContain('Key Usage')
    expect(wrapper.text()).toContain('Extended Key Usage')
    expect(wrapper.text()).toContain('Basic Constraints')
    expect(wrapper.text()).toContain('Subject Key Identifier')
    expect(wrapper.text()).toContain('Authority Key Identifier')
  })

  it('keeps only the section title when extension values are missing', () => {
    const wrapper = mountSection({})

    expect(wrapper.text()).toContain('Extensions')
    expect(wrapper.text()).not.toContain('Subject Alternative Name')
    expect(wrapper.text()).not.toContain('Key Usage')
    expect(wrapper.text()).not.toContain('Extended Key Usage')
    expect(wrapper.text()).not.toContain('Basic Constraints')
    expect(wrapper.text()).not.toContain('Subject Key Identifier')
    expect(wrapper.text()).not.toContain('Authority Key Identifier')
  })
})
