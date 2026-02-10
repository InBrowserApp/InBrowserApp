import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import PdfToImageConverterView from './PdfToImageConverterView.vue'

describe('PdfToImageConverterView', () => {
  it('renders converter inside default layout', () => {
    const wrapper = mount(PdfToImageConverterView, {
      global: {
        stubs: {
          ToolDefaultPageLayout: {
            template: '<section><slot /></section>',
            props: ['info'],
          },
          PdfToImageConverter: {
            template: '<div data-testid="converter" />',
          },
        },
      },
    })

    expect(wrapper.find('[data-testid="converter"]').exists()).toBe(true)
  })
})
