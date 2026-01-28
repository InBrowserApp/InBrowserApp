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

vi.mock('./WhatIsMD4.vue', () => ({
  default: {
    template: '<div class="what-is" />',
  },
}))

let MD4HashTextOrFileView: typeof import('./MD4HashTextOrFileView.vue').default

beforeAll(async () => {
  MD4HashTextOrFileView = (await import('./MD4HashTextOrFileView.vue')).default
})

describe('MD4HashTextOrFileView', () => {
  it('renders the hash template and description', () => {
    const wrapper = mount(MD4HashTextOrFileView)

    expect(wrapper.find('.hash-template').exists()).toBe(true)
    expect(wrapper.find('.what-is').exists()).toBe(true)
  })

  it('hashes blob content with MD4', async () => {
    const wrapper = mount(MD4HashTextOrFileView)
    const template = wrapper.findComponent({ name: 'HashTextOrFileTemplate' })
    const hash = template.props('hash') as (blob: Blob) => Promise<ArrayBuffer>
    const buffer = await hash(new Blob(['abc']))
    const hex = Buffer.from(buffer).toString('hex')
    expect(hex).toBe('a448017aaf21d8525fc10ae87aa6729d')
  })
})
