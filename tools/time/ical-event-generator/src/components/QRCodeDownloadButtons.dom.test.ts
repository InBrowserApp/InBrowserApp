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
  })

  it('downloads PNG and SVG', async () => {
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

    const buttons = wrapper.findAll('button')
    expect(buttons).toHaveLength(2)
    const pngButton = buttons[0]
    const svgButton = buttons[1]
    if (!pngButton || !svgButton) {
      throw new Error('Expected PNG and SVG download buttons')
    }

    await pngButton.trigger('click')
    await flushPromises()

    const mocked = QRCode as unknown as {
      toDataURL: ReturnType<typeof vi.fn>
      toString: ReturnType<typeof vi.fn>
    }

    expect(mocked.toDataURL).toHaveBeenCalled()
    expect(createObjectURL).toHaveBeenCalled()

    await svgButton.trigger('click')
    await flushPromises()

    expect(mocked.toString).toHaveBeenCalled()
  })
})
