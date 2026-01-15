import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import { NMessageProvider } from 'naive-ui'
import KsuidGeneratorView from './KsuidGeneratorView.vue'
import KsuidGenerator from './components/KsuidGenerator.vue'
import WhatIsKsuid from './components/WhatIsKsuid.vue'

const TestWrapper = {
  setup() {
    return () => h(NMessageProvider, () => h(KsuidGeneratorView))
  },
}

describe('KsuidGeneratorView', () => {
  beforeEach(() => {
    vi.stubGlobal('crypto', {
      getRandomValues: (buffer: Uint8Array) => {
        buffer.fill(3)
        return buffer
      },
    })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('renders the KSUID generator', () => {
    const wrapper = mount(TestWrapper, {
      global: {
        stubs: {
          ToolDefaultPageLayout: {
            props: ['info'],
            template: '<div><slot /></div>',
          },
        },
      },
    })

    expect(wrapper.findComponent(KsuidGenerator).exists()).toBe(true)
    expect(wrapper.findComponent(WhatIsKsuid).exists()).toBe(true)
  })
})
