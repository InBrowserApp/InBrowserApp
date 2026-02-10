import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

describe('JsonToCsvConverterView', () => {
  it('renders the converter inside the layout', async () => {
    const { default: JsonToCsvConverterView } = await import('./JsonToCsvConverterView.vue')

    const wrapper = mount(JsonToCsvConverterView, {
      global: {
        stubs: {
          ToolDefaultPageLayout: {
            props: ['info'],
            template: '<div class="layout"><slot /></div>',
          },
          JsonToCsvConverter: {
            template: '<div class="json-to-csv-converter" />',
          },
        },
      },
    })

    expect(wrapper.find('.json-to-csv-converter').exists()).toBe(true)
  })
})
