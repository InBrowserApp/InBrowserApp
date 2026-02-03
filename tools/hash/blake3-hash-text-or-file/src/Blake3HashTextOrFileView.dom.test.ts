import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, nextTick } from 'vue'
import { createI18n } from 'vue-i18n'

const blake3Mocks = vi.hoisted(() => {
  const lastHasher = {
    current: null as null | {
      update: ReturnType<typeof vi.fn>
      digest: ReturnType<typeof vi.fn>
    },
  }
  const createHasher = () => {
    const update = vi.fn()
    const digest = vi.fn(() => new Uint8Array([1, 2, 3, 4]))
    const hasher = { update, digest }
    lastHasher.current = hasher
    return hasher
  }
  const createHash = vi.fn(() => createHasher())
  const createKeyed = vi.fn(() => createHasher())
  return { createHash, createKeyed, lastHasher }
})

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')

  const NFormItem = defineComponent({
    name: 'NFormItem',
    props: {
      label: {
        type: String,
        default: '',
      },
    },
    template: '<div class="n-form-item"><slot /></div>',
  })

  const NSlider = defineComponent({
    name: 'NSlider',
    props: {
      value: {
        type: Number,
        default: 0,
      },
      min: {
        type: Number,
        default: 0,
      },
      max: {
        type: Number,
        default: 0,
      },
      step: {
        type: Number,
        default: 1,
      },
      marks: {
        type: Object,
        default: () => ({}),
      },
    },
    emits: ['update:value'],
    template: '<div class="n-slider" />',
  })

  const NInput = defineComponent({
    name: 'NInput',
    props: {
      value: {
        type: String,
        default: '',
      },
      placeholder: {
        type: String,
        default: '',
      },
    },
    emits: ['update:value'],
    template: '<input class="n-input" />',
  })

  return { NFormItem, NSlider, NInput }
})

vi.mock('blake3-wasm/dist/wasm/web/blake3_js_bg.wasm?url', () => ({
  default: 'blake3-wasm-url',
}))

vi.mock('blake3-wasm/browser-async', () => {
  return {
    default: () =>
      Promise.resolve({
        createHash: blake3Mocks.createHash,
        createKeyed: blake3Mocks.createKeyed,
      }),
  }
})

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: {},
  missingWarn: false,
  fallbackWarn: false,
})

const stubs = {
  ToolDefaultPageLayout: defineComponent({
    name: 'ToolDefaultPageLayout',
    props: ['info'],
    template: '<div class="layout"><slot /></div>',
  }),
  ToolSection: defineComponent({
    name: 'ToolSection',
    template: '<section class="tool-section"><slot /></section>',
  }),
  ToolSectionHeader: defineComponent({
    name: 'ToolSectionHeader',
    template: '<h2 class="tool-section-header"><slot /></h2>',
  }),
  HashTextOrFileTemplate: defineComponent({
    name: 'HashTextOrFileTemplate',
    props: {
      hash: {
        type: Function,
        required: true,
      },
    },
    template: '<div class="hash-template" />',
  }),
  WhatIsBlake3: defineComponent({
    name: 'WhatIsBlake3',
    template: '<div class="what-is-blake3" />',
  }),
}

const createBlobLike = (chunks: Uint8Array[]) => {
  const releaseLock = vi.fn()
  const blob = {
    stream: () => ({
      getReader: () => {
        let index = 0
        return {
          read: () => {
            if (index < chunks.length) {
              const value = chunks[index]
              index += 1
              return Promise.resolve({ done: false, value })
            }
            return Promise.resolve({ done: true, value: undefined })
          },
          releaseLock,
        }
      },
    }),
  }
  return { blob, releaseLock }
}

beforeEach(() => {
  blake3Mocks.createHash.mockClear()
  blake3Mocks.createKeyed.mockClear()
  blake3Mocks.lastHasher.current = null
})

afterEach(() => {
  vi.unstubAllGlobals()
})

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

  it('hashes using the default output length without a key', async () => {
    const { default: Blake3HashTextOrFileView } = await import('./Blake3HashTextOrFileView.vue')

    const wrapper = mount(Blake3HashTextOrFileView, {
      global: {
        plugins: [i18n],
        stubs,
      },
    })

    const hashFn = wrapper.getComponent({ name: 'HashTextOrFileTemplate' }).props('hash') as (
      blob: Blob,
    ) => Promise<ArrayBuffer>
    const { blob, releaseLock } = createBlobLike([new Uint8Array([1, 2, 3]), new Uint8Array([4])])

    const output = await hashFn(blob as unknown as Blob)

    expect(blake3Mocks.createHash).toHaveBeenCalledTimes(1)
    expect(blake3Mocks.createKeyed).not.toHaveBeenCalled()

    const hasher = blake3Mocks.lastHasher.current
    expect(hasher?.update).toHaveBeenCalledTimes(2)
    expect(hasher?.digest).toHaveBeenCalledWith({ length: 32 })
    expect(releaseLock).toHaveBeenCalledTimes(1)
    expect(output.byteLength).toBe(4)
  })

  it('uses keyed hashing when a 32-byte base64 key is provided', async () => {
    if (!globalThis.atob) {
      vi.stubGlobal('atob', (value: string) => Buffer.from(value, 'base64').toString('binary'))
    }

    const { default: Blake3HashTextOrFileView } = await import('./Blake3HashTextOrFileView.vue')

    const wrapper = mount(Blake3HashTextOrFileView, {
      global: {
        plugins: [i18n],
        stubs,
      },
    })

    wrapper.getComponent({ name: 'NSlider' }).vm.$emit('update:value', 64)
    wrapper
      .getComponent({ name: 'NInput' })
      .vm.$emit('update:value', Buffer.alloc(32, 1).toString('base64'))

    await nextTick()

    const hashFn = wrapper.getComponent({ name: 'HashTextOrFileTemplate' }).props('hash') as (
      blob: Blob,
    ) => Promise<ArrayBuffer>
    const { blob } = createBlobLike([new Uint8Array([9])])

    await hashFn(blob as unknown as Blob)

    expect(blake3Mocks.createKeyed).toHaveBeenCalledTimes(1)
    expect(blake3Mocks.createHash).not.toHaveBeenCalled()

    const hasher = blake3Mocks.lastHasher.current
    expect(hasher?.digest).toHaveBeenCalledWith({ length: 8 })
  })
})
