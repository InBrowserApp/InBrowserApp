import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import BarcodeGeneratorView from './BarcodeGeneratorView.vue'
import * as toolInfo from './info'

const ToolDefaultPageLayoutStub = defineComponent({
  name: 'ToolDefaultPageLayout',
  props: {
    info: { type: Object, required: true },
  },
  template: '<div class="layout"><slot /></div>',
})

const BarcodeGeneratorStub = defineComponent({
  name: 'BarcodeGenerator',
  template: '<div class="barcode-generator" />',
})

describe('BarcodeGeneratorView', () => {
  it('renders layout with tool info and generator', () => {
    const wrapper = mount(BarcodeGeneratorView, {
      global: {
        stubs: {
          ToolDefaultPageLayout: ToolDefaultPageLayoutStub,
          BarcodeGenerator: BarcodeGeneratorStub,
        },
      },
    })

    const layout = wrapper.findComponent(ToolDefaultPageLayoutStub)
    expect(layout.exists()).toBe(true)
    expect(layout.props('info')).toEqual(toolInfo)
    expect(wrapper.find('.barcode-generator').exists()).toBe(true)
  })
})
