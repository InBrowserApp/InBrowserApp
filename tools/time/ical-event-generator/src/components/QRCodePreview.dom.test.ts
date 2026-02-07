import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import QRCodePreview from './QRCodePreview.vue'

const qrcodeMock = vi.hoisted(() => ({
  toString: vi.fn(),
}))

vi.mock('qrcode', () => ({
  default: qrcodeMock,
}))

describe('QRCodePreview', () => {
  beforeEach(() => {
    qrcodeMock.toString.mockReset()
    qrcodeMock.toString.mockResolvedValue('<svg></svg>')
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders an SVG data URL preview', async () => {
    vi.useFakeTimers()

    const wrapper = mount(QRCodePreview, {
      props: {
        text: 'hello',
        errorCorrectionLevel: 'M',
        width: 128,
        margin: 2,
        dark: '#000000',
        light: '#FFFFFF',
      },
    })

    await vi.advanceTimersByTimeAsync(200)
    await flushPromises()

    const img = wrapper.find('img')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toContain('data:image/svg+xml')
    expect(qrcodeMock.toString).toHaveBeenCalledWith(
      'hello',
      expect.objectContaining({ type: 'svg' }),
    )
  })

  it('uses fallback text and handles non-string SVG output', async () => {
    vi.useFakeTimers()
    qrcodeMock.toString.mockResolvedValueOnce({ not: 'svg' })

    const wrapper = mount(QRCodePreview, {
      props: {
        text: '',
        errorCorrectionLevel: 'M',
        width: 128,
        margin: 2,
        dark: '#000000',
        light: '#FFFFFF',
      },
    })

    await vi.advanceTimersByTimeAsync(200)
    await flushPromises()

    expect(qrcodeMock.toString).toHaveBeenCalledWith(' ', expect.objectContaining({ type: 'svg' }))
    expect(wrapper.find('img').exists()).toBe(false)
  })

  it('falls back to empty preview when QR generation throws', async () => {
    vi.useFakeTimers()
    qrcodeMock.toString.mockRejectedValueOnce(new Error('boom'))

    const wrapper = mount(QRCodePreview, {
      props: {
        text: 'hello',
        errorCorrectionLevel: 'M',
        width: 128,
        margin: 2,
        dark: '#000000',
        light: '#FFFFFF',
      },
    })

    await vi.advanceTimersByTimeAsync(200)
    await flushPromises()

    expect(wrapper.find('img').exists()).toBe(false)
  })
})
