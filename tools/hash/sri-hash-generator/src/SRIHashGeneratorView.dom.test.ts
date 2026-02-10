import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import { defineComponent, h } from 'vue'
import SRIHashGeneratorView from './SRIHashGeneratorView.vue'

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: { en: {} },
  missingWarn: false,
  fallbackWarn: false,
})

const TextOrFileInputStub = defineComponent({
  name: 'TextOrFileInput',
  props: {
    value: {
      type: [String, Object],
      default: '',
    },
  },
  emits: ['update:value'],
  setup(_props, { emit }) {
    return () =>
      h('button', {
        class: 'text-or-file-input',
        onClick: () => emit('update:value', 'hello'),
      })
  },
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
    return () => h('div', { class: 'copy-tooltip' }, slots.default?.({ copy: () => undefined }))
  },
})

const stubs = {
  ToolDefaultPageLayout: {
    props: ['info'],
    template: '<div class="layout"><slot /></div>',
  },
  ToolSectionHeader: {
    template: '<h2 class="tool-section-header"><slot /></h2>',
  },
  ToolSection: {
    template: '<section class="tool-section"><slot /></section>',
  },
  TextOrFileInput: TextOrFileInputStub,
  WhatIsSRI: {
    template: '<div class="what-is-sri" />',
  },
  CopyToClipboardTooltip: CopyToClipboardTooltipStub,
  NDescriptions: {
    template: '<div class="n-descriptions"><slot /></div>',
  },
  NDescriptionsItem: {
    template: '<div class="n-descriptions-item"><slot /></div>',
  },
  NText: {
    template: '<span class="n-text"><slot /></span>',
  },
}

const digestResponses: Record<string, ArrayBuffer> = {
  'SHA-256': new Uint8Array([1, 2, 3]).buffer,
  'SHA-384': new Uint8Array([4, 5]).buffer,
  'SHA-512': new Uint8Array([6]).buffer,
}

const resolveDigest = (algorithm: AlgorithmIdentifier) => {
  const name = typeof algorithm === 'string' ? algorithm : algorithm.name
  const result = digestResponses[name]
  if (!result) {
    throw new Error(`Unexpected algorithm: ${String(name)}`)
  }
  return Promise.resolve(result)
}

let digestSpy: ReturnType<typeof vi.spyOn> | null = null

beforeEach(() => {
  if (!globalThis.btoa) {
    vi.stubGlobal('btoa', (input: string) => Buffer.from(input, 'binary').toString('base64'))
  }

  try {
    digestSpy = vi.spyOn(globalThis.crypto.subtle, 'digest').mockImplementation(resolveDigest)
  } catch {
    vi.stubGlobal('crypto', {
      subtle: {
        digest: vi.fn().mockImplementation(resolveDigest),
      },
    })
  }
})

afterEach(() => {
  digestSpy?.mockRestore()
  digestSpy = null
  vi.unstubAllGlobals()
})

describe('SRIHashGeneratorView', () => {
  it('renders the tool layout and info section', () => {
    const wrapper = mount(SRIHashGeneratorView, {
      global: {
        plugins: [i18n],
        stubs,
      },
    })

    expect(wrapper.find('.text-or-file-input').exists()).toBe(true)
    expect(wrapper.find('.what-is-sri').exists()).toBe(true)
  })

  it('computes SRI hashes for text input', async () => {
    const wrapper = mount(SRIHashGeneratorView, {
      global: {
        plugins: [i18n],
        stubs,
      },
    })

    const input = wrapper.findComponent(TextOrFileInputStub)
    await input.vm.$emit('update:value', 'hello')
    await flushPromises()
    await flushPromises()

    const text = wrapper.text()
    expect(text).toContain('sha256-AQID')
    expect(text).toContain('sha384-BAU=')
    expect(text).toContain('sha512-Bg==')
  })

  it('computes SRI hashes for file input', async () => {
    const wrapper = mount(SRIHashGeneratorView, {
      global: {
        plugins: [i18n],
        stubs,
      },
    })

    const input = wrapper.findComponent(TextOrFileInputStub)
    const file = new File(['hello'], 'hello.txt', { type: 'text/plain' })
    await input.vm.$emit('update:value', file)
    await flushPromises()
    await flushPromises()

    const text = wrapper.text()
    expect(text).toContain('sha256-AQID')
    expect(text).toContain('sha384-BAU=')
    expect(text).toContain('sha512-Bg==')
  })
})
