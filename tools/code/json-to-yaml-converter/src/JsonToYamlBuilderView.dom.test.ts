import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import * as toolInfo from './info'
import JsonToYamlBuilderView from './JsonToYamlBuilderView.vue'

const ToolDefaultPageLayoutStub = defineComponent({
  name: 'ToolDefaultPageLayout',
  props: ['info'],
  template: '<div><slot /></div>',
})

const JsonToYamlBuilderStub = defineComponent({
  name: 'JsonToYamlBuilder',
  template: '<div data-test="builder" />',
})

describe('JsonToYamlBuilderView', () => {
  it('renders tool layout and builder', () => {
    const wrapper = mount(JsonToYamlBuilderView, {
      global: {
        stubs: {
          ToolDefaultPageLayout: ToolDefaultPageLayoutStub,
          JsonToYamlBuilder: JsonToYamlBuilderStub,
        },
      },
    })

    const layout = wrapper.findComponent(ToolDefaultPageLayoutStub)
    expect(layout.exists()).toBe(true)
    expect(layout.props('info')).toEqual(toolInfo)
    expect(wrapper.find('[data-test="builder"]').exists()).toBe(true)
  })
})
