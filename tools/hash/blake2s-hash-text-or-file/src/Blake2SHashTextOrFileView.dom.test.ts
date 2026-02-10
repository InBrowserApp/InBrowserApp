import { describe, it, expect, vi, beforeEach, beforeAll, afterAll } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, nextTick } from 'vue'
import Blake2SHashTextOrFileView from './Blake2SHashTextOrFileView.vue'

const blakeMocks = vi.hoisted(() => ({
  blake2sInit: vi.fn(() => ({ context: true })),
  blake2sUpdate: vi.fn(),
  blake2sFinal: vi.fn(() => new Uint8Array([4, 5, 6])),
}))

vi.mock('blakejs', () => blakeMocks)

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({ t: (key: string) => key }),
  }
})

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')

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
    template:
      '<input class="n-input" :value="value" :placeholder="placeholder" @input="$emit(\'update:value\', $event.target.value)" />',
  })

  const NSlider = defineComponent({
    name: 'NSlider',
    props: {
      value: {
        type: Number,
        default: 0,
      },
    },
    emits: ['update:value'],
    template:
      '<input class="n-slider" type="range" :value="value" @input="$emit(\'update:value\', Number($event.target.value))" />',
  })

  return {
    NFormItem: {
      template: '<label class="form-item"><slot /></label>',
    },
    NInput,
    NSlider,
  }
})

const HashTextOrFileTemplateStub = defineComponent({
  name: 'HashTextOrFileTemplate',
  props: {
    hash: {
      type: Function,
      required: true,
    },
  },
  template: '<div class="hash-template" />',
})

const stubs = {
  ToolDefaultPageLayout: {
    props: ['info'],
    template: '<div class="layout"><slot /></div>',
  },
  ToolSectionHeader: {
    template: '<h2 class="section-header"><slot /></h2>',
  },
  ToolSection: {
    template: '<section class="section"><slot /></section>',
  },
  HashTextOrFileTemplate: HashTextOrFileTemplateStub,
  WhatIsBlake2: {
    template: '<div class="what-is" />',
  },
}

const createBlob = (chunks: Uint8Array[]) => {
  const reader = {
    read: vi.fn(),
    releaseLock: vi.fn(),
  }
  let index = 0
  reader.read.mockImplementation(async () => {
    if (index < chunks.length) {
      const value = chunks[index]
      index += 1
      return { done: false, value }
    }
    return { done: true, value: undefined }
  })

  return {
    blob: {
      stream: () => ({
        getReader: () => reader,
      }),
    } as unknown as Blob,
    reader,
  }
}

const originalAtob = globalThis.atob

beforeAll(() => {
  if (!globalThis.atob) {
    globalThis.atob = (value: string) => Buffer.from(value, 'base64').toString('binary')
  }
})

afterAll(() => {
  const globalWithAtob = globalThis as { atob?: typeof globalThis.atob }
  globalWithAtob.atob = originalAtob
})

beforeEach(() => {
  blakeMocks.blake2sInit.mockClear()
  blakeMocks.blake2sUpdate.mockClear()
  blakeMocks.blake2sFinal.mockClear()
})

describe('Blake2SHashTextOrFileView', () => {
  it('hashes with default length and no key', async () => {
    const wrapper = mount(Blake2SHashTextOrFileView, {
      global: {
        stubs,
      },
    })

    const hash = wrapper.findComponent(HashTextOrFileTemplateStub).props('hash') as (
      blob: Blob,
    ) => Promise<ArrayBuffer>

    const chunk = new Uint8Array([7, 8, 9])
    const { blob, reader } = createBlob([chunk])
    const result = await hash(blob)

    const context = blakeMocks.blake2sInit.mock.results[0]!.value
    expect(blakeMocks.blake2sInit).toHaveBeenCalledWith(32, undefined)
    expect(blakeMocks.blake2sUpdate).toHaveBeenCalledWith(context, chunk)
    expect(blakeMocks.blake2sFinal).toHaveBeenCalledWith(context)
    expect(reader.releaseLock).toHaveBeenCalled()
    expect(result).toBeInstanceOf(ArrayBuffer)
  })

  it('uses selected output length and key', async () => {
    const wrapper = mount(Blake2SHashTextOrFileView, {
      global: {
        stubs,
      },
    })

    wrapper.findComponent({ name: 'NSlider' }).vm.$emit('update:value', 128)
    wrapper.findComponent({ name: 'NInput' }).vm.$emit('update:value', 'c2VjcmV0')
    await nextTick()

    const hash = wrapper.findComponent(HashTextOrFileTemplateStub).props('hash') as (
      blob: Blob,
    ) => Promise<ArrayBuffer>

    const { blob } = createBlob([])
    await hash(blob)

    const expectedKey = Uint8Array.from('secret', (char) => char.charCodeAt(0))
    expect(blakeMocks.blake2sInit).toHaveBeenCalledWith(16, expectedKey)
    expect(blakeMocks.blake2sFinal).toHaveBeenCalled()
  })
})
