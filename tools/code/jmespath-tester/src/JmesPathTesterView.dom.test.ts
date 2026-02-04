import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import JmesPathTesterView from './JmesPathTesterView.vue'

describe('JmesPathTesterView', () => {
  it('renders the tester inside the layout', () => {
    const wrapper = mount(JmesPathTesterView, {
      global: {
        stubs: {
          ToolDefaultPageLayout: {
            props: ['info'],
            template: '<div class="layout"><slot /></div>',
          },
          JmesPathTester: {
            template: '<div class="jmespath-tester" />',
          },
        },
      },
    })

    expect(wrapper.find('.jmespath-tester').exists()).toBe(true)
  })
})
