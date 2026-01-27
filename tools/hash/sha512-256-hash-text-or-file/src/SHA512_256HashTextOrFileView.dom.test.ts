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

vi.mock('./WhatIsSHA512_256.vue', () => ({
  default: {
    template: '<div class="what-is" />',
  },
}))

let SHA512_256HashTextOrFileView: typeof import('./SHA512_256HashTextOrFileView.vue').default

beforeAll(async () => {
  SHA512_256HashTextOrFileView = (await import('./SHA512_256HashTextOrFileView.vue')).default
})

describe('SHA512_256HashTextOrFileView', () => {
  it('renders the hash template and description', () => {
    const wrapper = mount(SHA512_256HashTextOrFileView)

    expect(wrapper.find('.hash-template').exists()).toBe(true)
    expect(wrapper.find('.what-is').exists()).toBe(true)
  })

  it('hashes blob content with SHA-512/256', async () => {
    const wrapper = mount(SHA512_256HashTextOrFileView)
    const template = wrapper.findComponent({ name: 'HashTextOrFileTemplate' })
    const hash = template.props('hash') as (blob: Blob) => Promise<ArrayBuffer>
    const buffer = await hash(new Blob(['hello world']))
    const hex = Buffer.from(buffer).toString('hex')
    expect(hex).toBe('0ac561fac838104e3f2e4ad107b4bee3e938bf15f2b15f009ccccd61a913f017')
  })
})
