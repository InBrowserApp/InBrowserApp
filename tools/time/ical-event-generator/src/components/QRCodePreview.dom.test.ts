import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import QRCodePreview from './QRCodePreview.vue'
import QRCode from 'qrcode'

vi.mock('qrcode', () => ({
  default: {
    toString: vi.fn().mockResolvedValue('<svg></svg>'),
  },
}))

describe('QRCodePreview', () => {
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

    vi.advanceTimersByTime(200)
    await flushPromises()

    const img = wrapper.find('img')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toContain('data:image/svg+xml')

    const mocked = QRCode as unknown as { toString: ReturnType<typeof vi.fn> }
    expect(mocked.toString).toHaveBeenCalled()
  })
})
