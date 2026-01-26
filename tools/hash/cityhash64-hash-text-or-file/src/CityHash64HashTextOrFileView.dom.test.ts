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

vi.mock('./WhatIsCityHash.vue', () => ({
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
    template: `<input class="seed-input" :value="value" :placeholder="placeholder" @input="$emit('update:value', $event.target.value)" />`,
  },
}))

let CityHash64HashTextOrFileView: typeof import('./CityHash64HashTextOrFileView.vue').default

beforeAll(async () => {
  CityHash64HashTextOrFileView = (await import('./CityHash64HashTextOrFileView.vue')).default
})

describe('CityHash64HashTextOrFileView', () => {
  it('renders the seed input and hash template', () => {
    const wrapper = mount(CityHash64HashTextOrFileView)

    expect(wrapper.find('.section-header').exists()).toBe(true)
    expect(wrapper.find('.seed-input').exists()).toBe(true)
    expect(wrapper.find('.hash-template').exists()).toBe(true)
    expect(wrapper.find('.what-is').exists()).toBe(true)
  })

  it('validates invalid seed input', async () => {
    const wrapper = mount(CityHash64HashTextOrFileView)

    await wrapper.find('.seed-input').setValue('oops')
    const formItem = wrapper.find('.form-item')
    expect(formItem.attributes('data-status')).toBe('error')
    expect(formItem.attributes('data-feedback')).not.toBe('')
  })

  it('provides a hash function to the template', () => {
    const wrapper = mount(CityHash64HashTextOrFileView)
    const template = wrapper.findComponent({ name: 'HashTextOrFileTemplate' })
    expect(typeof template.props('hash')).toBe('function')
  })

  it('hashes blob content with the default seed', async () => {
    const wrapper = mount(CityHash64HashTextOrFileView)
    const template = wrapper.findComponent({ name: 'HashTextOrFileTemplate' })
    const hash = template.props('hash') as (blob: Blob) => Promise<ArrayBuffer>
    const buffer = await hash(new Blob(['hello world']))
    const value = new DataView(buffer).getBigUint64(0, false)
    expect(value).toBe(16951770513262022737n)
  })
})
