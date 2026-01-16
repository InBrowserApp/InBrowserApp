import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import { NMessageProvider } from 'naive-ui'
import NanoidGeneratorView from './NanoidGeneratorView.vue'
import NanoidGenerator from './components/NanoidGenerator.vue'
import WhatIsNanoid from './components/WhatIsNanoid.vue'

const TestWrapper = {
  setup() {
    return () => h(NMessageProvider, () => h(NanoidGeneratorView))
  },
}

describe('NanoidGeneratorView', () => {
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

  it('renders the NanoID generator', () => {
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

    expect(wrapper.findComponent(NanoidGenerator).exists()).toBe(true)
    expect(wrapper.findComponent(WhatIsNanoid).exists()).toBe(true)
  })
})
