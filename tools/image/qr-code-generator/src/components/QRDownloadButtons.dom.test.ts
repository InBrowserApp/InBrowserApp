import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import QRDownloadButtons from './QRDownloadButtons.vue'

const qrCodeMock = vi.hoisted(() => ({
  toDataURL: vi.fn(),
  toString: vi.fn(),
}))

vi.mock('qrcode', () => ({
  default: qrCodeMock,
}))

vi.mock('@vueuse/core', async () => {
  const { computed } = await import('vue')
  return {
    useObjectUrl: (blobRef: { value: Blob | null }) =>
      computed(() => (blobRef.value ? 'blob:mock' : '')),
  }
})

vi.mock('@vicons/fluent/Code16Regular', () => ({ default: {} }))
vi.mock('@vicons/fluent/Image16Regular', () => ({ default: {} }))

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')

  const NFlex = defineComponent({
    name: 'NFlex',
    template: '<div><slot /></div>',
  })

  const NIcon = defineComponent({
    name: 'NIcon',
    template: '<span />',
  })

  const NButton = defineComponent({
    name: 'NButton',
    props: {
      tag: { type: String, default: 'button' },
      href: { type: String, default: undefined },
      download: { type: String, default: '' },
      disabled: { type: Boolean, default: false },
      tertiary: { type: Boolean, default: false },
    },
    template: '<a><slot /></a>',
  })

  return { NFlex, NButton, NIcon }
})

const baseProps = {
  text: 'HELLO',
  errorCorrectionLevel: 'M' as const,
  width: 128,
  margin: 2,
  dark: '#000000FF',
  light: '#FFFFFFFF',
}

describe('QRDownloadButtons', () => {
  beforeEach(() => {
    qrCodeMock.toDataURL.mockReset()
    qrCodeMock.toString.mockReset()
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('builds png and svg downloads', async () => {
    qrCodeMock.toDataURL.mockResolvedValue('data:image/png;base64,AAA')
    qrCodeMock.toString.mockResolvedValue('<svg>ok</svg>')

    const fetchMock = vi.mocked(fetch)
    fetchMock.mockResolvedValue({
      blob: () => Promise.resolve(new Blob(['png'], { type: 'image/png' })),
    } as Response)

    const wrapper = mount(QRDownloadButtons, {
      props: baseProps,
    })

    await flushPromises()

    const buttons = wrapper.findAllComponents({ name: 'NButton' })
    expect(buttons).toHaveLength(2)

    const pngProps = buttons[0]?.props() as Record<string, unknown>
    expect(pngProps.href).toBe('blob:mock')
    expect(pngProps.disabled).toBe(false)
    expect(pngProps.download).toBe('qrcode.png')

    const svgProps = buttons[1]?.props() as Record<string, unknown>
    expect(svgProps.href).toBe('blob:mock')
    expect(svgProps.disabled).toBe(false)
    expect(svgProps.download).toBe('qrcode.svg')
  })
})
