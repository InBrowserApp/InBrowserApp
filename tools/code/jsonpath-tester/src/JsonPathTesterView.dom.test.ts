import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import JsonPathTesterView from './JsonPathTesterView.vue'
import * as toolInfo from './info'

describe('JsonPathTesterView', () => {
  it('renders the tool layout and tester content', () => {
    const wrapper = mount(JsonPathTesterView, {
      global: {
        stubs: {
          ToolDefaultPageLayout: defineComponent({
            name: 'ToolDefaultPageLayout',
            props: {
              info: {
                type: Object,
                required: true,
              },
            },
            template: '<section data-testid="layout"><slot /></section>',
          }),
          JsonPathTester: defineComponent({
            name: 'JsonPathTester',
            template: '<div data-testid="jsonpath-tester" />',
          }),
        },
      },
    })

    expect(wrapper.find('[data-testid="layout"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="jsonpath-tester"]').exists()).toBe(true)
    expect(toolInfo.toolID).toBe('jsonpath-tester')
  })
})
