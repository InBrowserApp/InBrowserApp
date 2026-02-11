import { beforeAll, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'

vi.mock('@shared/ui/tool', () => ({
  ToolDefaultPageLayout: {
    props: ['info'],
    template: '<div class="layout"><slot /></div>',
  },
  ToolSection: {
    template: '<section class="section"><slot /></section>',
  },
  ToolSectionHeader: {
    template: '<h2 class="section-header"><slot /></h2>',
  },
}))

vi.mock('@tools/hash-text-or-file-template', () => ({
  HashTextOrFileTemplate: {
    name: 'HashTextOrFileTemplate',
    props: ['hash'],
    template: '<div class="hash-template" />',
  },
}))

vi.mock('./WhatIsHighwayHash.vue', () => ({
  default: {
    template: '<div class="what-is" />',
  },
}))

vi.mock('naive-ui', () => ({
  NFormItem: {
    props: ['label', 'validationStatus', 'feedback', 'showFeedback'],
    template:
      '<div class="form-item" :data-status="validationStatus" :data-feedback="feedback"><slot /></div>',
  },
  NInput: {
    props: ['value', 'placeholder'],
    emits: ['update:value'],
    template:
      '<input class="key-input" :value="value" :placeholder="placeholder" @input="$emit(\'update:value\', $event.target.value)" />',
  },
  NSelect: {
    props: ['value', 'options'],
    emits: ['update:value'],
    template:
      '<select class="n-select" :value="value" @change="$emit(\'update:value\', Number($event.target.value))">' +
      '<option v-for="option in options" :key="option.value" :value="option.value">{{ option.label }}</option>' +
      '</select>',
  },
}))

vi.mock('highwayhasher', () => ({
  HighwayHash: {
    load: vi.fn(async (key?: Uint8Array) => {
      const chunks: number[] = []

      return {
        append: (input: Uint8Array) => {
          chunks.push(...input)
        },
        finalize64: () => {
          const isKnownVector =
            key?.length === 32 &&
            key.every((byte) => byte === 1) &&
            chunks.length === 1 &&
            chunks[0] === 0

          if (isKnownVector) {
            return Uint8Array.from(Buffer.from('c5452b122c7225df', 'hex'))
          }

          return new Uint8Array(8)
        },
        finalize128: () => new Uint8Array(16),
        finalize256: () => new Uint8Array(32),
      }
    }),
  },
}))

let HighwayHashTextOrFileView: typeof import('./HighwayHashTextOrFileView.vue').default
let mockedHighwayHash: typeof import('highwayhasher').HighwayHash

beforeAll(async () => {
  HighwayHashTextOrFileView = (await import('./HighwayHashTextOrFileView.vue')).default
  mockedHighwayHash = (await import('highwayhasher')).HighwayHash
})

describe('HighwayHashTextOrFileView', () => {
  it('renders configuration and hash template', () => {
    const wrapper = mount(HighwayHashTextOrFileView)

    expect(wrapper.find('.section-header').exists()).toBe(true)
    expect(wrapper.find('.n-select').exists()).toBe(true)
    expect(wrapper.find('.key-input').exists()).toBe(true)
    expect(wrapper.find('.hash-template').exists()).toBe(true)
    expect(wrapper.find('.what-is').exists()).toBe(true)
  })

  it('validates invalid key input', async () => {
    const wrapper = mount(HighwayHashTextOrFileView)

    await wrapper.find('.key-input').setValue('zz')
    const formItem = wrapper.findAll('.form-item')[1]
    expect(formItem?.attributes('data-status')).toBe('error')
    expect(formItem?.attributes('data-feedback')).not.toBe('')
  })

  it('accepts empty key input', async () => {
    const wrapper = mount(HighwayHashTextOrFileView)

    await wrapper.find('.key-input').setValue('')
    const formItem = wrapper.findAll('.form-item')[1]
    expect(formItem?.attributes('data-status')).not.toBe('error')
  })

  it('hashes known vector for 64-bit output', async () => {
    const wrapper = mount(HighwayHashTextOrFileView)

    await wrapper
      .find('.key-input')
      .setValue('0101010101010101010101010101010101010101010101010101010101010101')
    await wrapper.vm.$nextTick()

    const template = wrapper.findComponent({ name: 'HashTextOrFileTemplate' })
    const hash = template.props('hash') as (blob: Blob) => Promise<ArrayBuffer>
    const buffer = await hash(new Blob([new Uint8Array([0])]))
    const hex = Buffer.from(buffer).toString('hex')

    expect(hex).toBe('c5452b122c7225df')
    expect(mockedHighwayHash.load).toHaveBeenCalledTimes(1)
  })

  it('switches output size to 128-bit and 256-bit', async () => {
    const wrapper = mount(HighwayHashTextOrFileView)

    await wrapper
      .find('.key-input')
      .setValue('0101010101010101010101010101010101010101010101010101010101010101')

    await wrapper.find('.n-select').setValue('128')
    await wrapper.vm.$nextTick()

    const template = wrapper.findComponent({ name: 'HashTextOrFileTemplate' })
    let hash = template.props('hash') as (blob: Blob) => Promise<ArrayBuffer>
    let buffer = await hash(new Blob([new Uint8Array([0])]))
    expect(buffer.byteLength).toBe(16)

    await wrapper.find('.n-select').setValue('256')
    await wrapper.vm.$nextTick()

    hash = template.props('hash') as (blob: Blob) => Promise<ArrayBuffer>
    buffer = await hash(new Blob([new Uint8Array([0])]))
    expect(buffer.byteLength).toBe(32)
  })
})
