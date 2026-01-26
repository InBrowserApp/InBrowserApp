import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'

const expectedHex = '23097d223405d8228642a477bda255b32aadbce4bda0b3f7e36c9da7'

function hexToBytes(hex: string): number[] {
  const bytes: number[] = []
  for (let i = 0; i < hex.length; i += 2) {
    bytes.push(Number.parseInt(hex.slice(i, i + 2), 16))
  }
  return bytes
}

describe('SHA224HashTextOrFileView', () => {
  it('renders the hash template and info section', async () => {
    const { default: SHA224HashTextOrFileView } = await import('./SHA224HashTextOrFileView.vue')

    const wrapper = mount(SHA224HashTextOrFileView, {
      global: {
        stubs: {
          ToolDefaultPageLayout: {
            props: ['info'],
            template: '<div class="layout"><slot /></div>',
          },
          HashTextOrFileTemplate: {
            template: '<div class="hash-template" />',
          },
          WhatIsSHA224: {
            template: '<div class="what-is-sha224" />',
          },
        },
      },
    })

    expect(wrapper.find('.hash-template').exists()).toBe(true)
    expect(wrapper.find('.what-is-sha224').exists()).toBe(true)
  })

  it('hashes blobs using SHA-224', async () => {
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

    const { default: SHA224HashTextOrFileView } = await import('./SHA224HashTextOrFileView.vue')

    mount(SHA224HashTextOrFileView, {
      global: {
        stubs: {
          ToolDefaultPageLayout: {
            props: ['info'],
            template: '<div class="layout"><slot /></div>',
          },
          HashTextOrFileTemplate: HashTextOrFileTemplateStub,
          WhatIsSHA224: {
            template: '<div class="what-is-sha224" />',
          },
        },
      },
    })

    expect(hashFn).not.toBeNull()

    const result = await hashFn!(new Blob(['abc']))
    expect(Array.from(new Uint8Array(result))).toEqual(hexToBytes(expectedHex))
  })
})
