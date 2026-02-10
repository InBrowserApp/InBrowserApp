import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import CaseConverterView from './CaseConverterView.vue'

const ToolDefaultPageLayoutStub = defineComponent({
  name: 'ToolDefaultPageLayout',
  props: { info: { type: Object, required: true } },
  template: '<div class="layout"><slot /></div>',
})

const CaseConverterStub = defineComponent({
  name: 'CaseConverter',
  template: '<div class="case-converter" />',
})

describe('CaseConverterView', () => {
  it('renders the case converter inside the layout', () => {
    const wrapper = mount(CaseConverterView, {
      global: {
        stubs: {
          ToolDefaultPageLayout: ToolDefaultPageLayoutStub,
          CaseConverter: CaseConverterStub,
        },
      },
    })

    expect(wrapper.find('.case-converter').exists()).toBe(true)
  })
})
