import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'

const expectedHex =
  '4e2448a4c6f486bb16b6562c73b4020bf3043e3a731bce721ae1b303d97e6d4c7181eebdb6c57e277d0e34957114cbd6c797fc9d95d8b582d225292076d4eef5'

function hexToBytes(hex: string): number[] {
  const bytes: number[] = []
  for (let i = 0; i < hex.length; i += 2) {
    bytes.push(Number.parseInt(hex.slice(i, i + 2), 16))
  }
  return bytes
}

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

  it('hashes blobs using Whirlpool', async () => {
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

    const result = await hashFn!(new Blob(['abc']))
    expect(Array.from(new Uint8Array(result))).toEqual(hexToBytes(expectedHex))
  })
})
