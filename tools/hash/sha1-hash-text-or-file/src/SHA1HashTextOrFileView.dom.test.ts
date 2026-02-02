import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'

const expectedHex = 'a9993e364706816aba3e25717850c26c9cd0d89d'

function hexToBytes(hex: string): number[] {
  const bytes: number[] = []
  for (let i = 0; i < hex.length; i += 2) {
    bytes.push(Number.parseInt(hex.slice(i, i + 2), 16))
  }
  return bytes
}

describe('SHA1HashTextOrFileView', () => {
  it('renders the hash template and info section', async () => {
    const { default: SHA1HashTextOrFileView } = await import('./SHA1HashTextOrFileView.vue')

    const wrapper = mount(SHA1HashTextOrFileView, {
      global: {
        stubs: {
          ToolDefaultPageLayout: {
            props: ['info'],
            template: '<div class="layout"><slot /></div>',
          },
          HashTextOrFileTemplate: {
            template: '<div class="hash-template" />',
          },
          WhatIsSHA1: {
            template: '<div class="what-is-sha1" />',
          },
        },
      },
    })

    expect(wrapper.find('.hash-template').exists()).toBe(true)
    expect(wrapper.find('.what-is-sha1').exists()).toBe(true)
  })

  it('hashes blobs using SHA-1', async () => {
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

    const { default: SHA1HashTextOrFileView } = await import('./SHA1HashTextOrFileView.vue')

    mount(SHA1HashTextOrFileView, {
      global: {
        stubs: {
          ToolDefaultPageLayout: {
            props: ['info'],
            template: '<div class="layout"><slot /></div>',
          },
          HashTextOrFileTemplate: HashTextOrFileTemplateStub,
          WhatIsSHA1: {
            template: '<div class="what-is-sha1" />',
          },
        },
      },
    })

    expect(hashFn).not.toBeNull()

    const result = await hashFn!(new Blob(['abc']))
    expect(Array.from(new Uint8Array(result))).toEqual(hexToBytes(expectedHex))
  })
})
