import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'

const expectedHex =
  'cb00753f45a35e8bb5a03d699ac65007272c32ab0eded1631a8b605a43ff5bed8086072ba1e7cc2358baeca134c825a7'

function hexToBytes(hex: string): number[] {
  const bytes: number[] = []
  for (let i = 0; i < hex.length; i += 2) {
    bytes.push(Number.parseInt(hex.slice(i, i + 2), 16))
  }
  return bytes
}

describe('SHA384HashTextOrFileView', () => {
  it('renders the hash template and info section', async () => {
    const { default: SHA384HashTextOrFileView } = await import('./SHA384HashTextOrFileView.vue')

    const wrapper = mount(SHA384HashTextOrFileView, {
      global: {
        stubs: {
          ToolDefaultPageLayout: {
            props: ['info'],
            template: '<div class="layout"><slot /></div>',
          },
          HashTextOrFileTemplate: {
            template: '<div class="hash-template" />',
          },
          WhatIsSHA384: {
            template: '<div class="what-is-sha384" />',
          },
        },
      },
    })

    expect(wrapper.find('.hash-template').exists()).toBe(true)
    expect(wrapper.find('.what-is-sha384').exists()).toBe(true)
  })

  it('hashes blobs using SHA-384', async () => {
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

    const { default: SHA384HashTextOrFileView } = await import('./SHA384HashTextOrFileView.vue')

    mount(SHA384HashTextOrFileView, {
      global: {
        stubs: {
          ToolDefaultPageLayout: {
            props: ['info'],
            template: '<div class="layout"><slot /></div>',
          },
          HashTextOrFileTemplate: HashTextOrFileTemplateStub,
          WhatIsSHA384: {
            template: '<div class="what-is-sha384" />',
          },
        },
      },
    })

    expect(hashFn).not.toBeNull()

    const result = await hashFn!(new Blob(['abc']))
    expect(Array.from(new Uint8Array(result))).toEqual(hexToBytes(expectedHex))
  })
})
