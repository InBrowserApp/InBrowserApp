import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'

const sm3Mock = vi.fn(() => '00')

vi.mock('sm-crypto', () => ({
  sm3: sm3Mock,
}))

describe('SM3HashTextOrFileView', () => {
  it('renders the hash template and info section', async () => {
    const { default: SM3HashTextOrFileView } = await import('./SM3HashTextOrFileView.vue')

    const wrapper = mount(SM3HashTextOrFileView, {
      global: {
        stubs: {
          ToolDefaultPageLayout: {
            props: ['info'],
            template: '<div class="layout"><slot /></div>',
          },
          HashTextOrFileTemplate: {
            template: '<div class="hash-template" />',
          },
          WhatIsSM3: {
            template: '<div class="what-is-sm3" />',
          },
        },
      },
    })

    expect(wrapper.find('.hash-template').exists()).toBe(true)
    expect(wrapper.find('.what-is-sm3').exists()).toBe(true)
  })

  it('hashes blobs and normalizes odd-length hex output', async () => {
    let hashFn: ((blob: Blob) => Promise<ArrayBuffer>) | null = null

    const HashTextOrFileTemplateStub = defineComponent({
      props: {
        hash: {
          type: Function,
          required: true,
        },
      },
      setup(props) {
        hashFn = props.hash as (blob: Blob) => Promise<ArrayBuffer>
        return () => h('div', { class: 'hash-template' })
      },
    })

    sm3Mock.mockReturnValueOnce('abc')

    const { default: SM3HashTextOrFileView } = await import('./SM3HashTextOrFileView.vue')

    mount(SM3HashTextOrFileView, {
      global: {
        stubs: {
          ToolDefaultPageLayout: {
            props: ['info'],
            template: '<div class="layout"><slot /></div>',
          },
          HashTextOrFileTemplate: HashTextOrFileTemplateStub,
          WhatIsSM3: {
            template: '<div class="what-is-sm3" />',
          },
        },
      },
    })

    expect(hashFn).not.toBeNull()

    const oddResult = await hashFn!(new Blob([new Uint8Array([1, 2, 3])]))
    expect(Array.from(new Uint8Array(oddResult))).toEqual([0x0a, 0xbc])

    const evenResult = await hashFn!(new Blob([new Uint8Array([1])]))
    expect(Array.from(new Uint8Array(evenResult))).toEqual([0])
  })
})
