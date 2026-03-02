import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ResultCard from './ResultCard.vue'
import type { WebpConversionResult } from '../types'
vi.mock('@vueuse/core', async () => {
  const { computed } = await import('vue')
  return {
    useObjectUrl: (blobRef: { value: Blob | null }) =>
      computed(() => (blobRef.value ? 'blob:preview' : '')),
  }
})
vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')
  const actual = (await vi.importActual('naive-ui')) as Record<string, unknown>
  return {
    ...actual,
    NCard: defineComponent({
      name: 'NCard',
      template: '<div class="n-card"><slot /></div>',
    }),
  }
})
const makeResult = (
  name: string,
  originalSize: number,
  outputSize: number,
): WebpConversionResult => {
  const file = new File([new Uint8Array(originalSize)], name, { type: 'image/png' })
  const blob = new Blob([new Uint8Array(outputSize)], { type: 'image/webp' })
  return {
    file,
    blob,
    outputName: name.replace(/\.\w+$/, '.webp'),
    originalWidth: 100,
    originalHeight: 80,
    outputWidth: 90,
    outputHeight: 72,
  }
}
const baseProps = {
  originalLabel: 'Original',
  outputLabel: 'Output',
  savedLabel: 'Saved',
  dimensionsLabel: 'Dimensions',
  fileSizeLabel: 'Size',
}
describe('ResultCard', () => {
  it('renders a preview and rounds larger savings', () => {
    const wrapper = mount(ResultCard, {
      props: {
        ...baseProps,
        result: makeResult('big.png', 1000, 700),
      },
    })
    expect(wrapper.find('img').attributes('src')).toBe('blob:preview')
    expect(wrapper.text()).toContain('30%')
  })
  it('formats small savings with one decimal', () => {
    const wrapper = mount(ResultCard, {
      props: {
        ...baseProps,
        result: makeResult('small.png', 1000, 990),
      },
    })
    expect(wrapper.text()).toContain('1.0%')
  })
})
