import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import QRCodeDownloadButtons from './QRCodeDownloadButtons.vue'
import QRCode from 'qrcode'

vi.mock('qrcode', () => ({
  default: {
    toDataURL: vi.fn().mockResolvedValue('data:image/png;base64,AAA'),
    toString: vi.fn().mockResolvedValue('<svg></svg>'),
  },
}))

describe('QRCodeDownloadButtons', () => {
  const createObjectURL = vi.fn(() => 'blob:mock')
  const revokeObjectURL = vi.fn()
  const originalCreateObjectURL = URL.createObjectURL
  const originalRevokeObjectURL = URL.revokeObjectURL

  beforeEach(() => {
    vi.useFakeTimers()
    Object.defineProperty(URL, 'createObjectURL', { value: createObjectURL, writable: true })
    Object.defineProperty(URL, 'revokeObjectURL', { value: revokeObjectURL, writable: true })

    vi.stubGlobal(
      'fetch',
      vi.fn(() => Promise.resolve({ blob: () => Promise.resolve(new Blob(['png'])) })) as unknown,
    )
  })

  afterEach(() => {
    Object.defineProperty(URL, 'createObjectURL', {
      value: originalCreateObjectURL,
      writable: true,
    })
    Object.defineProperty(URL, 'revokeObjectURL', {
      value: originalRevokeObjectURL,
      writable: true,
    })
    vi.unstubAllGlobals()
    vi.useRealTimers()
  })

  it('builds PNG, JPG, and SVG download links', async () => {
    const wrapper = mount(QRCodeDownloadButtons, {
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
    await flushPromises()

    const mocked = QRCode as unknown as {
      toDataURL: ReturnType<typeof vi.fn>
      toString: ReturnType<typeof vi.fn>
    }

    expect(mocked.toDataURL).toHaveBeenCalledWith(
      'hello',
      expect.objectContaining({ type: 'image/png' }),
    )
    expect(mocked.toDataURL).toHaveBeenCalledWith(
      'hello',
      expect.objectContaining({ type: 'image/jpeg' }),
    )
    expect(mocked.toString).toHaveBeenCalledWith('hello', expect.objectContaining({ type: 'svg' }))

    const links = wrapper.findAll('a')
    expect(links).toHaveLength(3)
    const [pngLink, jpgLink, svgLink] = links
    if (!pngLink || !jpgLink || !svgLink) {
      throw new Error('Expected PNG, JPG, and SVG download links')
    }
    expect(pngLink.attributes('download')).toBe('event-qr.png')
    expect(jpgLink.attributes('download')).toBe('event-qr.jpg')
    expect(svgLink.attributes('download')).toBe('event-qr.svg')
    links.forEach((link) => {
      expect(link.attributes('href')).toBe('blob:mock')
    })
  })
})
