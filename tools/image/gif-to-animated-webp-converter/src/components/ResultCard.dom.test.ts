import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { computed, isRef } from 'vue'
import ResultCard from './ResultCard.vue'
import type { GifToAnimatedWebpResult } from '../types'

const objectUrlState = { mode: 'available' as 'available' | 'missing' }

vi.mock('@vueuse/core', async () => {
  const actual = await vi.importActual<typeof import('@vueuse/core')>('@vueuse/core')
  return {
    ...actual,
    useObjectUrl: (source: unknown) =>
      computed(() => {
        if (objectUrlState.mode === 'missing') return null
        const value = isRef(source) ? source.value : source
        return value ? 'blob:preview' : null
      }),
  }
})

vi.mock('filesize', () => ({
  filesize: (value: number) => `size-${value}`,
}))

vi.mock('naive-ui', async () => {
  const actual = await vi.importActual<typeof import('naive-ui')>('naive-ui')
  const { defineComponent } = await import('vue')

  const BaseStub = defineComponent({
    name: 'BaseStub',
    inheritAttrs: false,
    template: '<div><slot /></div>',
  })

  return {
    ...actual,
    NCard: BaseStub,
    NFlex: BaseStub,
    NText: BaseStub,
  }
})

const baseProps = {
  originalLabel: 'Original',
  outputLabel: 'Output',
  savedLabel: 'Saved',
  dimensionsLabel: 'Dimensions',
  fileSizeLabel: 'Size',
}

function createResult(name: string, fileSize: number, blobSize: number): GifToAnimatedWebpResult {
  const file = new File([new Uint8Array(fileSize)], `${name}.gif`, { type: 'image/gif' })
  const blob = new Blob([new Uint8Array(blobSize)], { type: 'image/webp' })
  return {
    file,
    blob,
    outputName: `${name}.webp`,
    originalWidth: 100,
    originalHeight: 80,
    outputWidth: 100,
    outputHeight: 80,
  }
}

describe('ResultCard', () => {
  beforeEach(() => {
    objectUrlState.mode = 'available'
  })

  it('renders preview image and savings with decimals', () => {
    const result = createResult('demo', 1000, 950)
    const wrapper = mount(ResultCard, {
      props: {
        ...baseProps,
        result,
      },
    })

    const image = wrapper.find('img')
    expect(image.exists()).toBe(true)
    expect(image.attributes('src')).toBe('blob:preview')
    expect(image.attributes('alt')).toBe('demo.webp')
    expect(wrapper.text()).toContain('Original:')
    expect(wrapper.text()).toContain('size-1000')
    expect(wrapper.text()).toContain('Output:')
    expect(wrapper.text()).toContain('size-950')
    expect(wrapper.text()).toContain('Saved: size-50 (5.0%)')
  })

  it('handles larger output and hides preview when missing', () => {
    objectUrlState.mode = 'missing'
    const result = createResult('bigger', 1000, 1300)
    const wrapper = mount(ResultCard, {
      props: {
        ...baseProps,
        result,
      },
    })

    expect(wrapper.find('img').exists()).toBe(false)
    expect(wrapper.text()).toContain('Saved: -size-300 (-30%)')
  })

  it('formats zero savings as 0 percent', () => {
    const result = createResult('same', 800, 800)
    const wrapper = mount(ResultCard, {
      props: {
        ...baseProps,
        result,
      },
    })

    expect(wrapper.text()).toContain('Saved: size-0 (0%)')
  })
})
