import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

describe('XmlToJsonConverterView', () => {
  it('renders the converter inside the layout', async () => {
    const { default: XmlToJsonConverterView } = await import('./XmlToJsonConverterView.vue')

    const wrapper = mount(XmlToJsonConverterView, {
      global: {
        stubs: {
          ToolDefaultPageLayout: {
            props: ['info'],
            template: '<div class="layout"><slot /></div>',
          },
          XmlToJsonConverter: {
            template: '<div class="xml-to-json-converter" />',
          },
        },
      },
    })

    expect(wrapper.find('.xml-to-json-converter').exists()).toBe(true)
  })
})
