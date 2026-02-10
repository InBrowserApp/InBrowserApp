import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import QRCodeGeneratorView from './QRCodeGeneratorView.vue'

describe('QRCodeGeneratorView', () => {
  it('renders the QR code generator inside the layout', () => {
    const wrapper = mount(QRCodeGeneratorView, {
      global: {
        stubs: {
          ToolDefaultPageLayout: {
            props: ['info'],
            template: '<div class="layout"><slot /></div>',
          },
          QRCodeGenerator: {
            template: '<div class="qr-code-generator" />',
          },
        },
      },
    })

    expect(wrapper.find('.qr-code-generator').exists()).toBe(true)
  })
})
