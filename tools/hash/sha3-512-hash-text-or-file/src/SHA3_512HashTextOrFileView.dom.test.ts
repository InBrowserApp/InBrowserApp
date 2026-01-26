import { describe, it, expect, beforeAll, vi } from 'vitest'
import { mount } from '@vue/test-utils'

vi.mock('@shared/ui/tool', () => ({
  ToolDefaultPageLayout: {
    props: ['info'],
    template: '<div class="layout"><slot /></div>',
  },
}))

vi.mock('@tools/hash-text-or-file-template', () => ({
  HashTextOrFileTemplate: {
    name: 'HashTextOrFileTemplate',
    props: ['hash'],
    template: '<div class="hash-template" />',
  },
}))

vi.mock('./WhatIsSHA3_512.vue', () => ({
  default: {
    template: '<div class="what-is" />',
  },
}))

let SHA3_512HashTextOrFileView: typeof import('./SHA3_512HashTextOrFileView.vue').default

beforeAll(async () => {
  SHA3_512HashTextOrFileView = (await import('./SHA3_512HashTextOrFileView.vue')).default
})

describe('SHA3_512HashTextOrFileView', () => {
  it('renders the hash template and description', () => {
    const wrapper = mount(SHA3_512HashTextOrFileView)

    expect(wrapper.find('.hash-template').exists()).toBe(true)
    expect(wrapper.find('.what-is').exists()).toBe(true)
  })

  it('hashes blob content with SHA3-512', async () => {
    const wrapper = mount(SHA3_512HashTextOrFileView)
    const template = wrapper.findComponent({ name: 'HashTextOrFileTemplate' })
    const hash = template.props('hash') as (blob: Blob) => Promise<ArrayBuffer>
    const buffer = await hash(new Blob(['hello world']))
    const hex = Buffer.from(buffer).toString('hex')
    expect(hex).toBe(
      '840006653e9ac9e95117a15c915caab81662918e925de9e004f774ff82d7079a40d4d27b1b372657c61d46d470304c88c788b3a4527ad074d1dccbee5dbaa99a',
    )
  })
})
