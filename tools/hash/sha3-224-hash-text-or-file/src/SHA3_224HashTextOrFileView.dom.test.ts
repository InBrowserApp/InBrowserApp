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

vi.mock('./WhatIsSHA3_224.vue', () => ({
  default: {
    template: '<div class="what-is" />',
  },
}))

let SHA3_224HashTextOrFileView: typeof import('./SHA3_224HashTextOrFileView.vue').default

beforeAll(async () => {
  SHA3_224HashTextOrFileView = (await import('./SHA3_224HashTextOrFileView.vue')).default
})

describe('SHA3_224HashTextOrFileView', () => {
  it('renders the hash template and description', () => {
    const wrapper = mount(SHA3_224HashTextOrFileView)

    expect(wrapper.find('.hash-template').exists()).toBe(true)
    expect(wrapper.find('.what-is').exists()).toBe(true)
  })

  it('hashes blob content with SHA3-224', async () => {
    const wrapper = mount(SHA3_224HashTextOrFileView)
    const template = wrapper.findComponent({ name: 'HashTextOrFileTemplate' })
    const hash = template.props('hash') as (blob: Blob) => Promise<ArrayBuffer>
    const buffer = await hash(new Blob(['hello world']))
    const hex = Buffer.from(buffer).toString('hex')
    expect(hex).toBe('dfb7f18c77e928bb56faeb2da27291bd790bc1045cde45f3210bb6c5')
  })
})
