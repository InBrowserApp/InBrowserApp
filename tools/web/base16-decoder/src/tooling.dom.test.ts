import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Base16DecoderView from './Base16DecoderView.vue'
import * as info from './info'
import { routes } from './routes'
import * as toolEntry from './index'

describe('base16 decoder tool metadata', () => {
  it('exposes tool info and routes', () => {
    expect(info.toolID).toBe('base16-decoder')
    expect(info.path).toBe('/tools/base16-decoder')
    expect(toolEntry.toolInfo.toolID).toBe('base16-decoder')
    expect(routes[0]?.path).toBe('/tools/base16-decoder')
  })

  it('renders the tool view', () => {
    const wrapper = mount(Base16DecoderView, {
      global: {
        stubs: {
          ToolDefaultPageLayout: {
            template: '<div><slot /></div>',
            props: ['info'],
          },
          Base16Decoder: {
            template: '<div data-test="decoder" />',
          },
          WhatIsBase16: {
            template: '<div data-test="what-is" />',
          },
        },
      },
    })

    expect(wrapper.find('[data-test="decoder"]').exists()).toBe(true)
  })
})
