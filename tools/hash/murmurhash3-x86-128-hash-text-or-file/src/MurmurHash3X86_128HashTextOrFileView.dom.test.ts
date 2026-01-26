import { describe, it, expect, beforeAll, vi } from 'vitest'
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

vi.mock('./WhatIsMurmurHash3.vue', () => ({
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
      '<input class="seed-input" :value="value" :placeholder="placeholder" @input="$emit(\'update:value\', $event.target.value)" />',
  },
}))

let MurmurHash3X86_128HashTextOrFileView: typeof import('./MurmurHash3X86_128HashTextOrFileView.vue').default

beforeAll(async () => {
  MurmurHash3X86_128HashTextOrFileView = (
    await import('./MurmurHash3X86_128HashTextOrFileView.vue')
  ).default
})

describe('MurmurHash3X86_128HashTextOrFileView', () => {
  it('renders the seed input and hash template', () => {
    const wrapper = mount(MurmurHash3X86_128HashTextOrFileView)

    expect(wrapper.find('.section-header').exists()).toBe(true)
    expect(wrapper.find('.seed-input').exists()).toBe(true)
    expect(wrapper.find('.hash-template').exists()).toBe(true)
    expect(wrapper.find('.what-is').exists()).toBe(true)
  })

  it('validates invalid seed input', async () => {
    const wrapper = mount(MurmurHash3X86_128HashTextOrFileView)

    await wrapper.find('.seed-input').setValue('oops')
    const formItem = wrapper.find('.form-item')
    expect(formItem.attributes('data-status')).toBe('error')
    expect(formItem.attributes('data-feedback')).not.toBe('')
  })

  it('rejects non-decimal seed input', async () => {
    const wrapper = mount(MurmurHash3X86_128HashTextOrFileView)

    await wrapper.find('.seed-input').setValue('0b1010')
    const formItem = wrapper.find('.form-item')
    expect(formItem.attributes('data-status')).toBe('error')
  })

  it('accepts empty seed input', async () => {
    const wrapper = mount(MurmurHash3X86_128HashTextOrFileView)

    await wrapper.find('.seed-input').setValue('')
    const formItem = wrapper.find('.form-item')
    expect(formItem.attributes('data-status')).not.toBe('error')
  })

  it('accepts hex seed input', async () => {
    const wrapper = mount(MurmurHash3X86_128HashTextOrFileView)

    await wrapper.find('.seed-input').setValue('0x2a')
    const formItem = wrapper.find('.form-item')
    expect(formItem.attributes('data-status')).not.toBe('error')
  })

  it('hashes blob content with the default seed', async () => {
    const wrapper = mount(MurmurHash3X86_128HashTextOrFileView)
    const template = wrapper.findComponent({ name: 'HashTextOrFileTemplate' })
    const hash = template.props('hash') as (blob: Blob) => Promise<ArrayBuffer>
    const buffer = await hash(new Blob(['hello world']))
    const hex = Buffer.from(buffer).toString('hex')
    expect(hex).toBe('c0b21a8814f3c1e11c0d151a9b0c9e2c')
  })
})
