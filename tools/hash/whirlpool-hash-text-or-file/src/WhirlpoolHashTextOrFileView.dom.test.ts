import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'

const whirlpoolMock = vi.fn(() => '00')

vi.mock('hash-wasm', () => ({
  whirlpool: whirlpoolMock,
}))

describe('WhirlpoolHashTextOrFileView', () => {
  it('renders the hash template and info section', async () => {
    const { default: WhirlpoolHashTextOrFileView } =
      await import('./WhirlpoolHashTextOrFileView.vue')

    const wrapper = mount(WhirlpoolHashTextOrFileView, {
      global: {
        stubs: {
          ToolDefaultPageLayout: {
            props: ['info'],
            template: '<div class="layout"><slot /></div>',
          },
          HashTextOrFileTemplate: {
            template: '<div class="hash-template" />',
          },
          WhatIsWhirlpool: {
            template: '<div class="what-is-whirlpool" />',
          },
        },
      },
    })

    expect(wrapper.find('.hash-template').exists()).toBe(true)
    expect(wrapper.find('.what-is-whirlpool').exists()).toBe(true)
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

    whirlpoolMock.mockReturnValueOnce('abc')

    const { default: WhirlpoolHashTextOrFileView } =
      await import('./WhirlpoolHashTextOrFileView.vue')

    mount(WhirlpoolHashTextOrFileView, {
      global: {
        stubs: {
          ToolDefaultPageLayout: {
            props: ['info'],
            template: '<div class="layout"><slot /></div>',
          },
          HashTextOrFileTemplate: HashTextOrFileTemplateStub,
          WhatIsWhirlpool: {
            template: '<div class="what-is-whirlpool" />',
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
