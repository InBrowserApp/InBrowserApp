import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { computed, isRef } from 'vue'
import { filesize } from 'filesize'
import ResultCard from './ResultCard.vue'
import type { GifToApngResult } from '../types'
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
function formatPercent(value: number) {
  if (!Number.isFinite(value) || value <= 0) return '0'
  if (value >= 10) return `${Math.round(value)}`
  return value.toFixed(1)
}
function formatSavedText(originalBytes: number, outputBytes: number) {
  const delta = originalBytes - outputBytes
  const sign = delta < 0 ? '-' : ''
  const absDelta = Math.abs(delta)
  const percent = originalBytes > 0 ? (absDelta / originalBytes) * 100 : 0
  const sizeText = `${sign}${filesize(absDelta) as string}`
  const percentText = `${sign}${formatPercent(percent)}%`
  return `${sizeText} (${percentText})`
}
function createResult(name: string, fileSize: number, blobSize: number): GifToApngResult {
  const file = new File([new Uint8Array(fileSize)], `${name}.gif`, { type: 'image/gif' })
  const blob = new Blob([new Uint8Array(blobSize)], { type: 'image/png' })
  return {
    file,
    blob,
    outputName: `${name}.png`,
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
    expect(image.attributes('alt')).toBe('demo.png')
    expect(wrapper.text()).toContain('Original:')
    expect(wrapper.text()).toContain(filesize(1000) as string)
    expect(wrapper.text()).toContain('Output:')
    expect(wrapper.text()).toContain(filesize(950) as string)
    expect(wrapper.text()).toContain(`Saved: ${formatSavedText(1000, 950)}`)
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
    expect(wrapper.text()).toContain(`Saved: ${formatSavedText(1000, 1300)}`)
  })
  it('formats zero savings as 0 percent', () => {
    const result = createResult('same', 800, 800)
    const wrapper = mount(ResultCard, {
      props: {
        ...baseProps,
        result,
      },
    })
    expect(wrapper.text()).toContain(`Saved: ${formatSavedText(800, 800)}`)
  })
  it('handles empty originals with negative zero percent savings', () => {
    const result = createResult('empty', 0, 100)
    const wrapper = mount(ResultCard, {
      props: {
        ...baseProps,
        result,
      },
    })
    expect(wrapper.text()).toContain(`Saved: ${formatSavedText(0, 100)}`)
  })
})
