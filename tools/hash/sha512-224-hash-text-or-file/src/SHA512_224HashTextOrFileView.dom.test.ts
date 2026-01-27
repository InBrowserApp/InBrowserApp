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

vi.mock('./WhatIsSHA512_224.vue', () => ({
  default: {
    template: '<div class="what-is" />',
  },
}))

let SHA512_224HashTextOrFileView: typeof import('./SHA512_224HashTextOrFileView.vue').default

beforeAll(async () => {
  SHA512_224HashTextOrFileView = (await import('./SHA512_224HashTextOrFileView.vue')).default
})

describe('SHA512_224HashTextOrFileView', () => {
  it('renders the hash template and description', () => {
    const wrapper = mount(SHA512_224HashTextOrFileView)

    expect(wrapper.find('.hash-template').exists()).toBe(true)
    expect(wrapper.find('.what-is').exists()).toBe(true)
  })

  it('hashes blob content with SHA-512/224', async () => {
    const wrapper = mount(SHA512_224HashTextOrFileView)
    const template = wrapper.findComponent({ name: 'HashTextOrFileTemplate' })
    const hash = template.props('hash') as (blob: Blob) => Promise<ArrayBuffer>
    const buffer = await hash(new Blob(['hello world']))
    const hex = Buffer.from(buffer).toString('hex')
    expect(hex).toBe('22e0d52336f64a998085078b05a6e37b26f8120f43bf4db4c43a64ee')
  })
})
