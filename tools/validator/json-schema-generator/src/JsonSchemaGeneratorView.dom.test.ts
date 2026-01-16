import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import { NMessageProvider } from 'naive-ui'
import JsonSchemaGeneratorView from './JsonSchemaGeneratorView.vue'
import JsonSchemaGenerator from './components/JsonSchemaGenerator.vue'
import WhatIsJsonSchema from './components/WhatIsJsonSchema.vue'

describe('JsonSchemaGeneratorView', () => {
  it('renders the generator component', () => {
    const TestWrapper = {
      render() {
        return h(NMessageProvider, () => h(JsonSchemaGeneratorView))
      },
    }

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

    expect(wrapper.findComponent(JsonSchemaGenerator).exists()).toBe(true)
    expect(wrapper.findComponent(WhatIsJsonSchema).exists()).toBe(true)
  })
})
