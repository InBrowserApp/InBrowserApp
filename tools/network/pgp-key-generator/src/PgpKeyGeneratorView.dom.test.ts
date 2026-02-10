import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import PgpKeyGeneratorView from './PgpKeyGeneratorView.vue'

const ToolDefaultPageLayoutStub = defineComponent({
  name: 'ToolDefaultPageLayout',
  props: {
    info: {
      type: Object,
      required: true,
    },
  },
  template: '<div class="layout"><slot /></div>',
})

const KeyGeneratorStub = defineComponent({
  name: 'KeyGenerator',
  template: '<div class="generator" />',
})

const WhatIsStub = defineComponent({
  name: 'WhatIsPgpKey',
  template: '<div class="what-is" />',
})

describe('PgpKeyGeneratorView', () => {
  it('renders the layout with tool info and content', () => {
    const wrapper = mount(PgpKeyGeneratorView, {
      global: {
        stubs: {
          ToolDefaultPageLayout: ToolDefaultPageLayoutStub,
          KeyGenerator: KeyGeneratorStub,
          WhatIsPgpKey: WhatIsStub,
        },
      },
    })

    const layout = wrapper.findComponent(ToolDefaultPageLayoutStub)
    expect(layout.exists()).toBe(true)
    expect(layout.props('info')).toMatchObject({
      toolID: 'pgp-key-generator',
      path: '/tools/pgp-key-generator',
    })

    expect(wrapper.find('.generator').exists()).toBe(true)
    expect(wrapper.find('.what-is').exists()).toBe(true)
  })
})
