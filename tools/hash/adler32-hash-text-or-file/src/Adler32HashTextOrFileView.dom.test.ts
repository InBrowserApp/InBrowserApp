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

vi.mock('./WhatIsAdler32.vue', () => ({
  default: {
    template: '<div class="what-is" />',
  },
}))

let Adler32HashTextOrFileView: typeof import('./Adler32HashTextOrFileView.vue').default

beforeAll(async () => {
  Adler32HashTextOrFileView = (await import('./Adler32HashTextOrFileView.vue')).default
})

describe('Adler32HashTextOrFileView', () => {
  it('renders the hash template and description', () => {
    const wrapper = mount(Adler32HashTextOrFileView)

    expect(wrapper.find('.hash-template').exists()).toBe(true)
    expect(wrapper.find('.what-is').exists()).toBe(true)
  })

  it('hashes blob content with Adler-32', async () => {
    const wrapper = mount(Adler32HashTextOrFileView)
    const template = wrapper.findComponent({ name: 'HashTextOrFileTemplate' })
    const hash = template.props('hash') as (blob: Blob) => Promise<ArrayBuffer>
    const buffer = await hash(new Blob(['abc']))
    const hex = Buffer.from(buffer).toString('hex')

    expect(hex).toBe('024d0127')
  })

  it('hashes empty input correctly', async () => {
    const wrapper = mount(Adler32HashTextOrFileView)
    const template = wrapper.findComponent({ name: 'HashTextOrFileTemplate' })
    const hash = template.props('hash') as (blob: Blob) => Promise<ArrayBuffer>
    const buffer = await hash(new Blob(['']))
    const hex = Buffer.from(buffer).toString('hex')

    expect(hex).toBe('00000001')
  })
})
