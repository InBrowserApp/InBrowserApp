import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, nextTick } from 'vue'
import { createI18n } from 'vue-i18n'
import URLParserBuilder from './URLParserBuilder.vue'

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: { en: {} },
  missingWarn: false,
  fallbackWarn: false,
})

const URLInputStub = defineComponent({
  name: 'URLInput',
  props: {
    url: { type: String, required: true },
  },
  emits: ['update:url'],
  template: '<button class="url-input" />',
})

const URLComponentsStub = defineComponent({
  name: 'URLComponents',
  props: {
    url: { type: String, required: true },
  },
  emits: ['update:url'],
  template: '<button class="url-components" />',
})

const CopyToClipboardButtonStub = defineComponent({
  name: 'CopyToClipboardButton',
  props: {
    content: { type: String, default: '' },
  },
  template: '<div class="copy" />',
})

const ToolSectionStub = {
  template: '<section><slot /></section>',
}

const ToolSectionHeaderStub = {
  template: '<h2><slot /></h2>',
}

const NFlexStub = {
  template: '<div class="flex"><slot /></div>',
}

describe('URLParserBuilder', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('syncs url updates between input, components, and copy button', async () => {
    localStorage.setItem('tools:url-parser-builder:url', 'https://stored.example/path')

    const wrapper = mount(URLParserBuilder, {
      global: {
        plugins: [i18n],
        stubs: {
          ToolSection: ToolSectionStub,
          ToolSectionHeader: ToolSectionHeaderStub,
          CopyToClipboardButton: CopyToClipboardButtonStub,
          NFlex: NFlexStub,
          URLInput: URLInputStub,
          URLComponents: URLComponentsStub,
        },
      },
    })

    const input = wrapper.findComponent(URLInputStub)
    const components = wrapper.findComponent(URLComponentsStub)
    const copy = wrapper.findComponent(CopyToClipboardButtonStub)

    expect(input.props('url')).toBe('https://stored.example/path')
    expect(components.props('url')).toBe('https://stored.example/path')
    expect(copy.props('content')).toBe('https://stored.example/path')

    await input.vm.$emit('update:url', 'https://next.example/')
    await nextTick()

    expect(components.props('url')).toBe('https://next.example/')
    expect(copy.props('content')).toBe('https://next.example/')

    await components.vm.$emit('update:url', 'https://third.example/')
    await nextTick()

    expect(input.props('url')).toBe('https://third.example/')
    expect(copy.props('content')).toBe('https://third.example/')
  })
})
