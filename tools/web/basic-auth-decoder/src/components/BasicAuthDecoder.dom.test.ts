import { describe, it, expect, afterEach, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import { defineComponent, h } from 'vue'
import { NInput } from 'naive-ui'
import BasicAuthDecoder from './BasicAuthDecoder.vue'

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: {
    en: {
      input: 'Authorization Header',
      placeholder: 'Paste header like: Basic dXNlcjpwYXNz',
      result: 'Decoded Result',
      username: 'Username',
      password: 'Password',
      'invalid-header': 'Invalid Basic Authorization header',
      'invalid-base64': 'Invalid Base64 content',
    },
  },
  missingWarn: false,
  fallbackWarn: false,
})

const CopyToClipboardTooltipStub = defineComponent({
  name: 'CopyToClipboardTooltip',
  props: {
    content: {
      type: String,
      default: '',
    },
  },
  setup(_props, { slots }) {
    return () => h('span', { class: 'copy-tooltip' }, slots.default?.({ copy: () => undefined }))
  },
})

const mountOptions = {
  global: {
    plugins: [i18n],
    stubs: {
      ToolSection: {
        template: '<section><slot /></section>',
      },
      ToolSectionHeader: {
        template: '<h2><slot /></h2>',
      },
      CopyToClipboardTooltip: CopyToClipboardTooltipStub,
    },
  },
}

describe('BasicAuthDecoder', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('decodes a valid Basic header', async () => {
    const wrapper = mount(BasicAuthDecoder, mountOptions)

    const input = wrapper.findComponent(NInput)
    await input.vm.$emit('update:value', 'Basic dXNlcjpwYXNz')
    await flushPromises()

    expect(wrapper.text()).toContain('user')
    expect(wrapper.text()).toContain('pass')
    expect(wrapper.text()).not.toContain('Invalid Basic Authorization header')
  })

  it('shows an error for an invalid header', async () => {
    const wrapper = mount(BasicAuthDecoder, mountOptions)

    const input = wrapper.findComponent(NInput)
    await input.vm.$emit('update:value', 'Bearer token')
    await flushPromises()

    expect(wrapper.text()).toContain('Invalid Basic Authorization header')
  })

  it('shows an error for invalid base64', async () => {
    const wrapper = mount(BasicAuthDecoder, mountOptions)

    const input = wrapper.findComponent(NInput)
    await input.vm.$emit('update:value', 'Basic !!!')
    await flushPromises()

    expect(wrapper.text()).toContain('Invalid Base64 content')
  })

  it('clears decoded state when input becomes blank', async () => {
    const wrapper = mount(BasicAuthDecoder, mountOptions)

    const input = wrapper.findComponent(NInput)
    await input.vm.$emit('update:value', 'Basic dXNlcjpwYXNz')
    await flushPromises()

    expect(wrapper.text()).toContain('Decoded Result')

    await input.vm.$emit('update:value', '   ')
    await flushPromises()

    expect(wrapper.text()).not.toContain('Decoded Result')
    expect(wrapper.text()).not.toContain('Invalid Base64 content')
  })

  it('handles decoded credentials with no username token', async () => {
    vi.spyOn(TextDecoder.prototype, 'decode').mockImplementation(
      () => ({ split: () => [] }) as unknown as string,
    )

    const wrapper = mount(BasicAuthDecoder, mountOptions)
    const input = wrapper.findComponent(NInput)

    await input.vm.$emit('update:value', 'Basic dXNlcjpwYXNz')
    await flushPromises()

    expect(wrapper.text()).not.toContain('Invalid Base64 content')
    expect(wrapper.text()).not.toContain('Decoded Result')
  })
})
