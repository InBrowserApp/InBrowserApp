import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'

const expectedHex = 'c14a12199c66e4ba84636b0f69144c77'

function hexToBytes(hex: string): number[] {
  const bytes: number[] = []
  for (let i = 0; i < hex.length; i += 2) {
    bytes.push(Number.parseInt(hex.slice(i, i + 2), 16))
  }
  return bytes
}

describe('RIPEMD128HashTextOrFileView', () => {
  it('renders the hash template and info section', async () => {
    const { default: RIPEMD128HashTextOrFileView } =
      await import('./RIPEMD128HashTextOrFileView.vue')

    const wrapper = mount(RIPEMD128HashTextOrFileView, {
      global: {
        stubs: {
          ToolDefaultPageLayout: {
            props: ['info'],
            template: '<div class="layout"><slot /></div>',
          },
          HashTextOrFileTemplate: {
            template: '<div class="hash-template" />',
          },
          WhatIsRIPEMD128: {
            template: '<div class="what-is-ripemd128-hash-text-or-file" />',
          },
        },
      },
    })

    expect(wrapper.find('.hash-template').exists()).toBe(true)
    expect(wrapper.find('.what-is-ripemd128-hash-text-or-file').exists()).toBe(true)
  })

  it('hashes blobs using RIPEMD-128', async () => {
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

    const { default: RIPEMD128HashTextOrFileView } =
      await import('./RIPEMD128HashTextOrFileView.vue')

    mount(RIPEMD128HashTextOrFileView, {
      global: {
        stubs: {
          ToolDefaultPageLayout: {
            props: ['info'],
            template: '<div class="layout"><slot /></div>',
          },
          HashTextOrFileTemplate: HashTextOrFileTemplateStub,
          WhatIsRIPEMD128: {
            template: '<div class="what-is-ripemd128-hash-text-or-file" />',
          },
        },
      },
    })

    expect(hashFn).not.toBeNull()

    const result = await hashFn!(new Blob(['abc']))
    expect(Array.from(new Uint8Array(result))).toEqual(hexToBytes(expectedHex))
  })
})
