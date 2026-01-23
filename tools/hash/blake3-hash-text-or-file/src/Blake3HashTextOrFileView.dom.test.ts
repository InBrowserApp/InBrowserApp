import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'

vi.mock(
  'blake3-wasm/browser-async',
  () => {
    return {
      default: () =>
        Promise.resolve({
          createHash: () => ({
            update: () => undefined,
            digest: () => new Uint8Array(),
          }),
          createKeyed: () => ({
            update: () => undefined,
            digest: () => new Uint8Array(),
          }),
        }),
    }
  },
  { virtual: true },
)

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: {},
  missingWarn: false,
  fallbackWarn: false,
})

const stubs = {
  ToolDefaultPageLayout: {
    props: ['info'],
    template: '<div class="layout"><slot /></div>',
  },
  ToolSection: {
    template: '<section class="tool-section"><slot /></section>',
  },
  ToolSectionHeader: {
    template: '<h2 class="tool-section-header"><slot /></h2>',
  },
  HashTextOrFileTemplate: {
    template: '<div class="hash-template" />',
  },
  WhatIsBlake3: {
    template: '<div class="what-is-blake3" />',
  },
  NFormItem: {
    template: '<div class="n-form-item"><slot /></div>',
  },
  NSlider: {
    template: '<div class="n-slider" />',
  },
  NInput: {
    template: '<input class="n-input" />',
  },
}

describe('Blake3HashTextOrFileView', () => {
  it('renders the layout and hash template', async () => {
    const { default: Blake3HashTextOrFileView } = await import('./Blake3HashTextOrFileView.vue')

    const wrapper = mount(Blake3HashTextOrFileView, {
      global: {
        plugins: [i18n],
        stubs,
      },
    })

    expect(wrapper.find('.hash-template').exists()).toBe(true)
    expect(wrapper.find('.what-is-blake3').exists()).toBe(true)
    expect(wrapper.text()).toContain('BLAKE3 Configuration')
  })
})
