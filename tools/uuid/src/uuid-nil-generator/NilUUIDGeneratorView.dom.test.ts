import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import { NMessageProvider } from 'naive-ui'
import NilUUIDGeneratorView from './NilUUIDGeneratorView.vue'

const TestWrapper = {
  setup() {
    return () => h(NMessageProvider, () => h(NilUUIDGeneratorView))
  },
}

describe('NilUUIDGeneratorView', () => {
  it('renders the nil UUID value', () => {
    const wrapper = mount(TestWrapper, {
      global: {
        stubs: {
          ToolDefaultPageLayout: {
            inheritAttrs: false,
            props: ['info'],
            template: '<div><slot /></div>',
          },
          WhatIsNilUUID: { template: '<div />' },
        },
      },
    })

    expect(wrapper.find('.uuid-display').text()).toBe('00000000-0000-0000-0000-000000000000')
  })
})
