import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import { createI18n } from 'vue-i18n'
import WhatIsCertificatePublicKey from './WhatIsCertificatePublicKey.vue'

const DescriptionMarkdownStub = defineComponent({
  name: 'DescriptionMarkdown',
  props: {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  template:
    '<article data-testid="description" :data-title="title" :data-description="description" />',
})

describe('WhatIsCertificatePublicKey', () => {
  it('passes localized title and description to description markdown', () => {
    const i18n = createI18n({
      legacy: false,
      locale: 'en',
      messages: { en: {} },
      missingWarn: false,
      fallbackWarn: false,
    })

    const wrapper = mount(WhatIsCertificatePublicKey, {
      global: {
        plugins: [i18n],
        stubs: {
          DescriptionMarkdown: DescriptionMarkdownStub,
        },
      },
    })

    const description = wrapper.get('[data-testid="description"]')
    expect(description.attributes('data-title')).toBe('What is a certificate and public key?')
    expect(description.attributes('data-description')).toContain('X.509 certificate')
  })
})
