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

vi.mock('./WhatIsSHAKE256.vue', () => ({
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

let SHAKE256HashTextOrFileView: typeof import('./SHAKE256HashTextOrFileView.vue').default

beforeAll(async () => {
  SHAKE256HashTextOrFileView = (await import('./SHAKE256HashTextOrFileView.vue')).default
})

describe('SHAKE256HashTextOrFileView', () => {
  it('renders the length input and hash template', () => {
    const wrapper = mount(SHAKE256HashTextOrFileView)

    expect(wrapper.find('.section-header').exists()).toBe(true)
    expect(wrapper.find('.length-input').exists()).toBe(true)
    expect(wrapper.find('.hash-template').exists()).toBe(true)
    expect(wrapper.find('.what-is').exists()).toBe(true)
  })

  it('validates invalid output length input', async () => {
    const wrapper = mount(SHAKE256HashTextOrFileView)

    await wrapper.find('.length-input').setValue('7')
    const formItem = wrapper.find('.form-item')
    expect(formItem.attributes('data-status')).toBe('error')
    expect(formItem.attributes('data-feedback')).not.toBe('')
  })

  it('accepts empty output length input', async () => {
    const wrapper = mount(SHAKE256HashTextOrFileView)

    await wrapper.find('.length-input').setValue('')
    const formItem = wrapper.find('.form-item')
    expect(formItem.attributes('data-status')).not.toBe('error')
  })

  it('hashes blob content with the default output length', async () => {
    const wrapper = mount(SHAKE256HashTextOrFileView)
    const template = wrapper.findComponent({ name: 'HashTextOrFileTemplate' })
    const hash = template.props('hash') as (blob: Blob) => Promise<ArrayBuffer>
    const buffer = await hash(new Blob(['hello world']))
    const hex = Buffer.from(buffer).toString('hex')
    expect(hex).toBe(
      '369771bb2cb9d2b04c1d54cca487e372d9f187f73f7ba3f65b95c8ee7798c527f4f3c2d55c2d46a29f2e945d469c3df27853a8735271f5cc2d9e889544357116',
    )
  })
})
