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

vi.mock('./WhatIsSipHash.vue', () => ({
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
}))

let SipHash2_4HashTextOrFileView: typeof import('./SipHash2_4HashTextOrFileView.vue').default

beforeAll(async () => {
  SipHash2_4HashTextOrFileView = (await import('./SipHash2_4HashTextOrFileView.vue')).default
})

describe('SipHash2_4HashTextOrFileView', () => {
  it('renders the key input and hash template', () => {
    const wrapper = mount(SipHash2_4HashTextOrFileView)

    expect(wrapper.find('.section-header').exists()).toBe(true)
    expect(wrapper.find('.key-input').exists()).toBe(true)
    expect(wrapper.find('.hash-template').exists()).toBe(true)
    expect(wrapper.find('.what-is').exists()).toBe(true)
  })

  it('validates invalid key input', async () => {
    const wrapper = mount(SipHash2_4HashTextOrFileView)

    await wrapper.find('.key-input').setValue('zz')
    const formItem = wrapper.find('.form-item')
    expect(formItem.attributes('data-status')).toBe('error')
    expect(formItem.attributes('data-feedback')).not.toBe('')
  })

  it('accepts empty key input', async () => {
    const wrapper = mount(SipHash2_4HashTextOrFileView)

    await wrapper.find('.key-input').setValue('')
    const formItem = wrapper.find('.form-item')
    expect(formItem.attributes('data-status')).not.toBe('error')
  })

  it('hashes data with a known SipHash-2-4 test vector', async () => {
    const wrapper = mount(SipHash2_4HashTextOrFileView)

    await wrapper.find('.key-input').setValue('000102030405060708090a0b0c0d0e0f')
    await wrapper.vm.$nextTick()

    const template = wrapper.findComponent({ name: 'HashTextOrFileTemplate' })
    const hash = template.props('hash') as (blob: Blob) => Promise<ArrayBuffer>
    const buffer = await hash(new Blob([new Uint8Array()]))
    const hex = Buffer.from(buffer).toString('hex')
    expect(hex).toBe('726fdb47dd0e0e31')
  })
})
