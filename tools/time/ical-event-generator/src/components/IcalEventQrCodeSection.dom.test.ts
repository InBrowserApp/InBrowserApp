import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import IcalEventQrCodeSection from './IcalEventQrCodeSection.vue'

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({ t: (key: string) => key }),
  }
})

vi.mock('@shared/ui/tool', () => ({
  ToolSectionHeader: {
    template: '<header><slot /></header>',
  },
  ToolSection: {
    template: '<section><slot /></section>',
  },
}))

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')
  return {
    NFlex: defineComponent({
      name: 'NFlex',
      template: '<div><slot /></div>',
    }),
  }
})

const QrPreviewStub = defineComponent({
  name: 'QRCodePreview',
  props: ['text', 'errorCorrectionLevel', 'width', 'margin', 'dark', 'light'],
  template: '<div class="qr-preview" />',
})

const QrDownloadStub = defineComponent({
  name: 'QRCodeDownloadButtons',
  props: ['text', 'errorCorrectionLevel', 'width', 'margin', 'dark', 'light'],
  template: '<div class="qr-download" />',
})

describe('IcalEventQrCodeSection', () => {
  it('passes QR options to preview and download components', () => {
    const wrapper = mount(IcalEventQrCodeSection, {
      props: {
        text: 'payload',
        qrOptions: {
          errorCorrectionLevel: 'M',
          width: 240,
          margin: 2,
          dark: '#000000',
          light: '#ffffff',
        },
      },
      global: {
        stubs: {
          QRCodePreview: QrPreviewStub,
          QRCodeDownloadButtons: QrDownloadStub,
        },
      },
    })

    const preview = wrapper.findComponent(QrPreviewStub)
    const download = wrapper.findComponent(QrDownloadStub)

    expect(preview.props('text')).toBe('payload')
    expect(download.props('text')).toBe('payload')
    expect(preview.props('errorCorrectionLevel')).toBe('M')
    expect(download.props('width')).toBe(240)
    expect(download.props('dark')).toBe('#000000')
  })
})
