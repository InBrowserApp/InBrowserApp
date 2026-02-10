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

vi.mock('./WhatIsSHAKE128.vue', () => ({
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
  NInputNumber: {
    props: ['value', 'placeholder'],
    emits: ['update:value'],
    template:
      '<input class="length-input" :value="value ?? \'\'" :placeholder="placeholder" @input="$emit(\'update:value\', $event.target.value === \'\' ? null : Number($event.target.value))" />',
  },
}))

let SHAKE128HashTextOrFileView: typeof import('./SHAKE128HashTextOrFileView.vue').default

beforeAll(async () => {
  SHAKE128HashTextOrFileView = (await import('./SHAKE128HashTextOrFileView.vue')).default
})

describe('SHAKE128HashTextOrFileView', () => {
  it('renders the length input and hash template', () => {
    const wrapper = mount(SHAKE128HashTextOrFileView)

    expect(wrapper.find('.section-header').exists()).toBe(true)
    expect(wrapper.find('.length-input').exists()).toBe(true)
    expect(wrapper.find('.hash-template').exists()).toBe(true)
    expect(wrapper.find('.what-is').exists()).toBe(true)
  })

  it('validates invalid output length input', async () => {
    const wrapper = mount(SHAKE128HashTextOrFileView)

    await wrapper.find('.length-input').setValue('7')
    const formItem = wrapper.find('.form-item')
    expect(formItem.attributes('data-status')).toBe('error')
    expect(formItem.attributes('data-feedback')).not.toBe('')
  })

  it('rejects non-numeric output length input', async () => {
    const wrapper = mount(SHAKE128HashTextOrFileView)

    await wrapper.find('.length-input').setValue('abc')
    const formItem = wrapper.find('.form-item')
    expect(formItem.attributes('data-status')).toBe('error')
    expect(formItem.attributes('data-feedback')).not.toBe('')
  })

  it('accepts empty output length input', async () => {
    const wrapper = mount(SHAKE128HashTextOrFileView)

    await wrapper.find('.length-input').setValue('')
    const formItem = wrapper.find('.form-item')
    expect(formItem.attributes('data-status')).not.toBe('error')
  })

  it('hashes blob content with the default output length', async () => {
    const wrapper = mount(SHAKE128HashTextOrFileView)
    const template = wrapper.findComponent({ name: 'HashTextOrFileTemplate' })
    const hash = template.props('hash') as (blob: Blob) => Promise<ArrayBuffer>
    const buffer = await hash(new Blob(['hello world']))
    const hex = Buffer.from(buffer).toString('hex')
    expect(hex).toBe('3a9159f071e4dd1c8c4f968607c30942e120d8156b8b1e72e0d376e8871cb8b8')
  })
})
