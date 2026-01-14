import { describe, expect, it } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { h } from 'vue'
import { NConfigProvider, NMessageProvider } from 'naive-ui'
import OpenApiToTypescript from './OpenApiToTypescript.vue'

const withProviders = {
  render() {
    return h(NConfigProvider, null, {
      default: () =>
        h(NMessageProvider, null, {
          default: () => h(OpenApiToTypescript),
        }),
    })
  },
}

describe('OpenApiToTypescript', () => {
  it('renders generated output for the sample schema', async () => {
    const wrapper = mount(withProviders)
    await flushPromises()

    expect(wrapper.text()).toContain('TypeScript Output')
    expect(wrapper.text()).toContain('export interface paths')
  })
})
