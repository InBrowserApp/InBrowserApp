import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import { routes } from './routes'
import JsonSchemaValidatorView from './JsonSchemaValidatorView.vue'

const ToolDefaultPageLayoutStub = defineComponent({
  name: 'ToolDefaultPageLayout',
  props: ['info'],
  template: '<div class="layout"><slot /></div>',
})

const JsonSchemaValidatorStub = defineComponent({
  name: 'JsonSchemaValidator',
  template: '<div class="json-schema-validator" />',
})

describe('JsonSchemaValidatorView', () => {
  it('renders the layout with tool info', () => {
    const wrapper = mount(JsonSchemaValidatorView, {
      global: {
        stubs: {
          ToolDefaultPageLayout: ToolDefaultPageLayoutStub,
          JsonSchemaValidator: JsonSchemaValidatorStub,
        },
      },
    })

    const layout = wrapper.findComponent(ToolDefaultPageLayoutStub)
    const info = layout.props('info') as { toolID?: string }
    expect(layout.exists()).toBe(true)
    expect(info.toolID).toBe('json-schema-validator')
    expect(wrapper.find('.json-schema-validator').exists()).toBe(true)
  })

  it('defines a route for the tool', () => {
    const route = routes[0]
    if (!route) {
      throw new Error('Expected tool route')
    }
    expect(route.path).toBe('/tools/json-schema-validator')
    expect(route.name).toBe('json-schema-validator')
  })
})
