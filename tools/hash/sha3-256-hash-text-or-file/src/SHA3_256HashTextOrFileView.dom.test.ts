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

vi.mock('./WhatIsSHA3_256.vue', () => ({
  default: {
    template: '<div class="what-is" />',
  },
}))

let SHA3_256HashTextOrFileView: typeof import('./SHA3_256HashTextOrFileView.vue').default

beforeAll(async () => {
  SHA3_256HashTextOrFileView = (await import('./SHA3_256HashTextOrFileView.vue')).default
})

describe('SHA3_256HashTextOrFileView', () => {
  it('renders the hash template and description', () => {
    const wrapper = mount(SHA3_256HashTextOrFileView)

    expect(wrapper.find('.hash-template').exists()).toBe(true)
    expect(wrapper.find('.what-is').exists()).toBe(true)
  })

  it('hashes blob content with SHA3-256', async () => {
    const wrapper = mount(SHA3_256HashTextOrFileView)
    const template = wrapper.findComponent({ name: 'HashTextOrFileTemplate' })
    const hash = template.props('hash') as (blob: Blob) => Promise<ArrayBuffer>
    const buffer = await hash(new Blob(['hello world']))
    const hex = Buffer.from(buffer).toString('hex')
    expect(hex).toBe('644bcc7e564373040999aac89e7622f3ca71fba1d972fd94a31c3bfbf24e3938')
  })
})
