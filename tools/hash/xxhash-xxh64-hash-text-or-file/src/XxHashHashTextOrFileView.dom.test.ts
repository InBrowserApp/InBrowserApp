import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'

const updateMock = vi.fn()
const digestMock = vi.fn(() => 0x0102030405060708n)
const create64Mock = vi.fn(() => ({
  update: updateMock,
  digest: digestMock,
}))

vi.mock('xxhash-wasm', () => ({
  default: () => Promise.resolve({ create64: create64Mock }),
}))

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

vi.mock('./WhatIsXxHash.vue', () => ({
  default: {
    template: '<div class="what-is" />',
  },
}))

let XxHashHashTextOrFileView: typeof import('./XxHashHashTextOrFileView.vue').default

beforeAll(async () => {
  XxHashHashTextOrFileView = (await import('./XxHashHashTextOrFileView.vue')).default
})

beforeEach(() => {
  updateMock.mockClear()
  digestMock.mockClear()
  create64Mock.mockClear()
})

describe('XxHashHashTextOrFileView', () => {
  it('renders the hash template and info section', () => {
    const wrapper = mount(XxHashHashTextOrFileView)

    expect(wrapper.find('.hash-template').exists()).toBe(true)
    expect(wrapper.find('.what-is').exists()).toBe(true)
  })

  it('hashes blob content using XXH64 and returns big-endian output', async () => {
    const wrapper = mount(XxHashHashTextOrFileView)
    const template = wrapper.findComponent({ name: 'HashTextOrFileTemplate' })
    const hash = template.props('hash') as (blob: Blob) => Promise<ArrayBuffer>

    const buffer = await hash(new Blob([Uint8Array.from([1, 2, 3])]))

    expect(create64Mock).toHaveBeenCalled()
    expect(updateMock).toHaveBeenCalled()
    expect(digestMock).toHaveBeenCalled()
    expect(new Uint8Array(buffer)).toEqual(new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]))
  })
})
