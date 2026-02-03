import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import CurlConverterView from './CurlConverterView.vue'

describe('CurlConverterView', () => {
  it('renders the layout with converter and info sections', () => {
    const wrapper = mount(CurlConverterView, {
      global: {
        stubs: {
          ToolDefaultPageLayout: {
            name: 'ToolDefaultPageLayout',
            props: ['info'],
            template: '<section><slot /></section>',
          },
          CurlConverter: {
            name: 'CurlConverter',
            template: '<div data-testid="curl-converter" />',
          },
          WhatIsCurlConverter: {
            name: 'WhatIsCurlConverter',
            template: '<div data-testid="what-is" />',
          },
        },
      },
    })

    expect(wrapper.find('[data-testid="curl-converter"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="what-is"]').exists()).toBe(true)

    const layout = wrapper.findComponent({ name: 'ToolDefaultPageLayout' })
    const info = layout.props('info') as { toolID?: string; path?: string }
    expect(info.toolID).toBe('curl-converter')
    expect(info.path).toBe('/tools/curl-converter')
  })
})
