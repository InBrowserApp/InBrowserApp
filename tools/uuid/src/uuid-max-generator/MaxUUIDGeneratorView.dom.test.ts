import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import { NMessageProvider } from 'naive-ui'
import MaxUUIDGeneratorView from './MaxUUIDGeneratorView.vue'

const TestWrapper = {
  setup() {
    return () => h(NMessageProvider, () => h(MaxUUIDGeneratorView))
  },
}

describe('MaxUUIDGeneratorView', () => {
  it('renders the max UUID value', () => {
    const wrapper = mount(TestWrapper, {
      global: {
        stubs: {
          ToolDefaultPageLayout: {
            inheritAttrs: false,
            props: ['info'],
            template: '<div><slot /></div>',
          },
          WhatIsMaxUUID: { template: '<div />' },
        },
      },
    })

    expect(wrapper.find('.uuid-display').text()).toBe('ffffffff-ffff-ffff-ffff-ffffffffffff')
  })
})
