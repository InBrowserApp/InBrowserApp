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

vi.mock('./WhatIsSHA3_384.vue', () => ({
  default: {
    template: '<div class="what-is" />',
  },
}))

let SHA3_384HashTextOrFileView: typeof import('./SHA3_384HashTextOrFileView.vue').default

beforeAll(async () => {
  SHA3_384HashTextOrFileView = (await import('./SHA3_384HashTextOrFileView.vue')).default
})

describe('SHA3_384HashTextOrFileView', () => {
  it('renders the hash template and description', () => {
    const wrapper = mount(SHA3_384HashTextOrFileView)

    expect(wrapper.find('.hash-template').exists()).toBe(true)
    expect(wrapper.find('.what-is').exists()).toBe(true)
  })

  it('hashes blob content with SHA3-384', async () => {
    const wrapper = mount(SHA3_384HashTextOrFileView)
    const template = wrapper.findComponent({ name: 'HashTextOrFileTemplate' })
    const hash = template.props('hash') as (blob: Blob) => Promise<ArrayBuffer>
    const buffer = await hash(new Blob(['hello world']))
    const hex = Buffer.from(buffer).toString('hex')
    expect(hex).toBe(
      '83bff28dde1b1bf5810071c6643c08e5b05bdb836effd70b403ea8ea0a634dc4997eb1053aa3593f590f9c63630dd90b',
    )
  })
})
