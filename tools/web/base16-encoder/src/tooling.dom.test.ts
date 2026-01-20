import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Base16EncoderView from './Base16EncoderView.vue'
import * as info from './info'
import { routes } from './routes'
import * as toolEntry from './index'

describe('base16 encoder tool metadata', () => {
  it('exposes tool info and routes', () => {
    expect(info.toolID).toBe('base16-encoder')
    expect(info.path).toBe('/tools/base16-encoder')
    expect(toolEntry.toolInfo.toolID).toBe('base16-encoder')
    expect(routes[0]?.path).toBe('/tools/base16-encoder')
  })

  it('renders the tool view', () => {
    const wrapper = mount(Base16EncoderView, {
      global: {
        stubs: {
          ToolDefaultPageLayout: {
            template: '<div><slot /></div>',
            props: ['info'],
          },
          Base16Encoder: {
            template: '<div data-test="encoder" />',
          },
        },
      },
    })

    expect(wrapper.find('[data-test="encoder"]').exists()).toBe(true)
  })
})
