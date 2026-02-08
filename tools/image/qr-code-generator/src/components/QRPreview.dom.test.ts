import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import QRPreview from './QRPreview.vue'

const qrCodeMock = vi.hoisted(() => ({
  toString: vi.fn(),
}))

vi.mock('qrcode', () => ({
  default: qrCodeMock,
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
  return {
    NFlex: defineComponent({
      name: 'NFlex',
      template: '<div class="n-flex"><slot /></div>',
    }),
    NSkeleton: defineComponent({
      name: 'NSkeleton',
      template: '<div class="n-skeleton" />',
    }),
  }
})

const baseProps = {
  text: 'HELLO',
  errorCorrectionLevel: 'M' as const,
  width: 128,
  margin: 2,
  dark: '#000000FF',
  light: '#FFFFFFFF',
}

describe('QRPreview', () => {
  beforeEach(() => {
    qrCodeMock.toString.mockReset()
  })

  it('renders the SVG preview when generation succeeds', async () => {
    qrCodeMock.toString.mockResolvedValue('<svg>ok</svg>')

    const wrapper = mount(QRPreview, { props: baseProps })
    await flushPromises()

    const img = wrapper.find('img')
    expect(img.exists()).toBe(true)
    const src = img.attributes('src')
    const encoded = src?.split(',')[1] ?? ''
    expect(decodeURIComponent(encoded)).toContain('<svg>ok</svg>')
  })

  it('renders no image when generation fails', async () => {
    qrCodeMock.toString.mockRejectedValue(new Error('fail'))

    const wrapper = mount(QRPreview, { props: baseProps })
    await flushPromises()

    expect(wrapper.find('img').exists()).toBe(false)
  })

  it('uses fallback text and ignores non-string renderer results', async () => {
    qrCodeMock.toString.mockResolvedValue(123)

    const wrapper = mount(QRPreview, {
      props: {
        ...baseProps,
        text: '',
      },
    })
    await flushPromises()

    expect(qrCodeMock.toString).toHaveBeenCalledWith(' ', expect.objectContaining({ type: 'svg' }))
    expect(wrapper.find('img').exists()).toBe(false)
  })
})
