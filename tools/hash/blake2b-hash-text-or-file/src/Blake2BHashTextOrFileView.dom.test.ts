import { describe, it, expect, vi, beforeEach, beforeAll, afterAll } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, nextTick } from 'vue'
import Blake2BHashTextOrFileView from './Blake2BHashTextOrFileView.vue'

const blakeMocks = vi.hoisted(() => ({
  blake2bInit: vi.fn(() => ({ context: true })),
  blake2bUpdate: vi.fn(),
  blake2bFinal: vi.fn(() => new Uint8Array([1, 2, 3])),
}))

vi.mock('blakejs', () => blakeMocks)

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
  blakeMocks.blake2bInit.mockClear()
  blakeMocks.blake2bUpdate.mockClear()
  blakeMocks.blake2bFinal.mockClear()
})

describe('Blake2BHashTextOrFileView', () => {
  it('hashes with default length and no key', async () => {
    const wrapper = mount(Blake2BHashTextOrFileView, {
      global: {
        stubs,
      },
    })

    const hash = wrapper.findComponent(HashTextOrFileTemplateStub).props('hash') as (
      blob: Blob,
    ) => Promise<ArrayBuffer>

    const chunk = new Uint8Array([1, 2, 3])
    const { blob, reader } = createBlob([chunk])
    const result = await hash(blob)

    const context = blakeMocks.blake2bInit.mock.results[0]!.value
    expect(blakeMocks.blake2bInit).toHaveBeenCalledWith(64, undefined)
    expect(blakeMocks.blake2bUpdate).toHaveBeenCalledWith(context, chunk)
    expect(blakeMocks.blake2bFinal).toHaveBeenCalledWith(context)
    expect(reader.releaseLock).toHaveBeenCalled()
    expect(result).toBeInstanceOf(ArrayBuffer)
  })

  it('uses selected output length and key', async () => {
    const wrapper = mount(Blake2BHashTextOrFileView, {
      global: {
        stubs,
      },
    })

    wrapper.findComponent({ name: 'NSlider' }).vm.$emit('update:value', 256)
    wrapper.findComponent({ name: 'NInput' }).vm.$emit('update:value', 'c2VjcmV0')
    await nextTick()

    const hash = wrapper.findComponent(HashTextOrFileTemplateStub).props('hash') as (
      blob: Blob,
    ) => Promise<ArrayBuffer>

    const { blob } = createBlob([])
    await hash(blob)

    const expectedKey = Uint8Array.from('secret', (char) => char.charCodeAt(0))
    expect(blakeMocks.blake2bInit).toHaveBeenCalledWith(32, expectedKey)
    expect(blakeMocks.blake2bFinal).toHaveBeenCalled()
  })
})
