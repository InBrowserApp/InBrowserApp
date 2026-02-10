import { beforeAll, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'

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

vi.mock('./WhatIsKeccak.vue', () => ({
  default: {
    template: '<div class="what-is-keccak" />',
  },
}))

vi.mock('naive-ui', () => ({
  NSelect: {
    props: ['value', 'options'],
    emits: ['update:value'],
    template:
      '<select class="n-select" :value="value" @change="$emit(\'update:value\', Number($event.target.value))">' +
      '<option v-for="option in options" :key="option.value" :value="option.value">{{ option.label }}</option>' +
      '</select>',
  },
}))

let KeccakHashTextOrFileView: typeof import('./KeccakHashTextOrFileView.vue').default

beforeAll(async () => {
  KeccakHashTextOrFileView = (await import('./KeccakHashTextOrFileView.vue')).default
})

describe('KeccakHashTextOrFileView', () => {
  it('renders the length selector and hash template', () => {
    const wrapper = mount(KeccakHashTextOrFileView)

    expect(wrapper.find('.section-header').exists()).toBe(true)
    expect(wrapper.find('.n-select').exists()).toBe(true)
    expect(wrapper.find('.hash-template').exists()).toBe(true)
    expect(wrapper.find('.what-is-keccak').exists()).toBe(true)
  })

  it('hashes blobs with the default output length', async () => {
    const wrapper = mount(KeccakHashTextOrFileView)

    const template = wrapper.findComponent({ name: 'HashTextOrFileTemplate' })
    const hash = template.props('hash') as (blob: Blob) => Promise<ArrayBuffer>
    const buffer = await hash(new Blob(['abc']))

    expect(buffer.byteLength).toBe(32)
  })

  it('updates the hash output length when selection changes', async () => {
    const wrapper = mount(KeccakHashTextOrFileView)

    await wrapper.find('.n-select').setValue('224')
    await flushPromises()

    const template = wrapper.findComponent({ name: 'HashTextOrFileTemplate' })
    const hash = template.props('hash') as (blob: Blob) => Promise<ArrayBuffer>
    const buffer = await hash(new Blob(['abc']))

    expect(buffer.byteLength).toBe(28)
  })
})
