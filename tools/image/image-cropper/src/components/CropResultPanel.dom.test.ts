import { beforeEach, describe, expect, it, vi } from 'vitest'

const previewUrlState = {
  value: 'blob:cropped-preview' as string | null,
}

vi.mock('@vueuse/core', async () => {
  const actual = await vi.importActual<typeof import('@vueuse/core')>('@vueuse/core')
  const { ref } = await import('vue')

  return {
    ...actual,
    useObjectUrl: () => ref(previewUrlState.value),
  }
})

vi.mock('@shared/ui/tool', () => ({
  ToolSection: { name: 'ToolSection', template: '<section><slot /></section>' },
  ToolSectionHeader: { name: 'ToolSectionHeader', template: '<h2><slot /></h2>' },
}))

vi.mock('naive-ui', async () => {
  const { defineComponent, h } = await import('vue')

  const NButton = defineComponent({
    name: 'NButton',
    props: {
      tag: {
        type: String,
        default: 'button',
      },
      href: {
        type: String,
        default: undefined,
      },
      download: {
        type: String,
        default: undefined,
      },
      disabled: {
        type: Boolean,
        default: false,
      },
    },
    setup(props, { slots }) {
      return () =>
        h(
          props.tag,
          {
            href: props.href,
            download: props.download,
            disabled: props.disabled,
          },
          [slots.icon?.(), slots.default?.()],
        )
    },
  })

  const passthrough = (name: string, tag = 'div') =>
    defineComponent({
      name,
      props: {
        label: {
          type: String,
          default: '',
        },
        value: {
          type: String,
          default: '',
        },
        src: {
          type: String,
          default: '',
        },
        alt: {
          type: String,
          default: '',
        },
      },
      setup(props, { slots }) {
        if (name === 'NImage') {
          return () => h('img', { src: props.src, alt: props.alt })
        }

        if (name === 'NStatistic') {
          return () => h('div', { 'data-stat': props.label }, props.value)
        }

        return () => h(tag, { 'data-name': name }, slots.default?.())
      },
    })

  return {
    NButton,
    NFlex: passthrough('NFlex'),
    NGrid: passthrough('NGrid'),
    NIcon: passthrough('NIcon', 'i'),
    NImage: passthrough('NImage'),
    NStatistic: passthrough('NStatistic'),
  }
})

import { mount } from '@vue/test-utils'
import CropResultPanel from './CropResultPanel.vue'
import type { CropResult } from '../types'

const originalFile = new File(['original-file'], 'original.png', { type: 'image/png' })
const result: CropResult = {
  blob: new Blob(['cropped-file'], { type: 'image/png' }),
  outputName: 'original.cropped.png',
  outputWidth: 320,
  outputHeight: 240,
  outputMimeType: 'image/png',
  cropWidth: 640,
  cropHeight: 480,
}

beforeEach(() => {
  previewUrlState.value = 'blob:cropped-preview'
})

describe('CropResultPanel', () => {
  it('renders preview information and exposes a download anchor', () => {
    const wrapper = mount(CropResultPanel, {
      props: {
        originalFile,
        result,
      },
    })

    expect(wrapper.get('img').attributes('src')).toBe('blob:cropped-preview')
    expect(wrapper.text()).toContain('640 × 480')
    expect(wrapper.text()).toContain('320 × 240')
    expect(wrapper.findComponent({ name: 'NIcon' }).exists()).toBe(true)

    const link = wrapper.get('a')
    expect(link.attributes('href')).toBe('blob:cropped-preview')
    expect(link.attributes('download')).toBe('original.cropped.png')
  })

  it('disables the download action when the preview url is unavailable', () => {
    previewUrlState.value = null

    const wrapper = mount(CropResultPanel, {
      props: {
        originalFile,
        result,
      },
    })

    const link = wrapper.get('a')
    expect(link.attributes('href')).toBeUndefined()
    expect(link.attributes('disabled')).toBeDefined()
  })
})
