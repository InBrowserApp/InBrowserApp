import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import BarcodePreview from './BarcodePreview.vue'

const jsBarcodeMock = vi.hoisted(() => ({
  fn: vi.fn(),
}))

vi.mock('jsbarcode', () => ({
  default: jsBarcodeMock.fn,
}))

vi.mock('@vueuse/core', async () => {
  const { ref } = await import('vue')
  return {
    useDebounce: (value: unknown) => value,
    computedAsync: (
      getter: () => Promise<string>,
      initial: string,
      options?: { evaluating?: { value: boolean } },
    ) => {
      const state = ref(initial)
      const run = async () => {
        if (options?.evaluating) options.evaluating.value = true
        state.value = await getter()
        if (options?.evaluating) options.evaluating.value = false
      }
      void run()
      return state
    },
  }
})

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')
  const NFlex = defineComponent({
    name: 'NFlex',
    template: '<div><slot /></div>',
  })
  const NSkeleton = defineComponent({
    name: 'NSkeleton',
    template: '<div class="skeleton" />',
  })
  return { NFlex, NSkeleton }
})

const baseProps = {
  text: 'HELLO',
  format: 'CODE128',
  width: 2,
  height: 100,
  margin: 10,
  displayValue: true,
  textAlign: 'center' as const,
  textPosition: 'bottom' as const,
  fontSize: 20,
  lineColor: '#000000',
  background: '#ffffff',
}

describe('BarcodePreview', () => {
  beforeEach(() => {
    jsBarcodeMock.fn.mockReset()
  })

  it('renders svg preview when generation succeeds', async () => {
    jsBarcodeMock.fn.mockImplementation((svg: SVGElement) => {
      svg.setAttribute('data-text', 'HELLO')
    })

    const wrapper = mount(BarcodePreview, {
      props: baseProps,
    })

    await flushPromises()

    const img = wrapper.find('img')
    expect(img.exists()).toBe(true)
    const src = img.attributes('src')
    const encoded = src?.split(',')[1] ?? ''
    expect(decodeURIComponent(encoded)).toContain('data-text="HELLO"')
  })

  it('uses a single space as text fallback for empty values', async () => {
    jsBarcodeMock.fn.mockImplementation((svg: SVGElement, value: string) => {
      svg.setAttribute('data-text', value)
    })

    const wrapper = mount(BarcodePreview, {
      props: {
        ...baseProps,
        text: '',
      },
    })

    await flushPromises()

    const src = wrapper.find('img').attributes('src')
    const encoded = src?.split(',')[1] ?? ''
    expect(decodeURIComponent(encoded)).toContain('data-text=" "')
  })

  it('renders no image when generation fails', async () => {
    jsBarcodeMock.fn.mockImplementation(() => {
      throw new Error('fail')
    })

    const wrapper = mount(BarcodePreview, {
      props: baseProps,
    })

    await flushPromises()

    expect(wrapper.find('img').exists()).toBe(false)
  })
})
