import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import CsrGeneratorView from './CsrGeneratorView.vue'

const ToolDefaultPageLayoutStub = defineComponent({
  props: {
    info: { type: Object, required: true },
  },
  setup(props, { slots }) {
    return () =>
      h('section', [
        h('div', String((props.info as { toolID?: string }).toolID)),
        slots.default?.(),
      ])
  },
})

const CsrGeneratorStub = defineComponent({
  setup() {
    return () => h('div', 'CsrGeneratorStub')
  },
})

const WhatIsCsrStub = defineComponent({
  setup() {
    return () => h('div', 'WhatIsCsrStub')
  },
})

describe('CsrGeneratorView', () => {
  it('passes tool info and renders sections', () => {
    const wrapper = mount(CsrGeneratorView, {
      global: {
        stubs: {
          ToolDefaultPageLayout: ToolDefaultPageLayoutStub,
          CsrGenerator: CsrGeneratorStub,
          WhatIsCsr: WhatIsCsrStub,
        },
      },
    })

    expect(wrapper.text()).toContain('csr-generator')
    expect(wrapper.text()).toContain('CsrGeneratorStub')
    expect(wrapper.text()).toContain('WhatIsCsrStub')
  })
})
