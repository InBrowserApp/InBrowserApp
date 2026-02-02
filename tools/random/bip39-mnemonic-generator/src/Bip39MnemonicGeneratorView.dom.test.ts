import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import Bip39MnemonicGeneratorView from './Bip39MnemonicGeneratorView.vue'
import * as toolInfo from './info'

const ToolDefaultPageLayoutStub = defineComponent({
  name: 'ToolDefaultPageLayout',
  props: {
    info: { type: Object, required: true },
  },
  template: '<div class="layout"><slot /></div>',
})

const Bip39MnemonicGeneratorStub = defineComponent({
  name: 'Bip39MnemonicGenerator',
  template: '<div class="generator" />',
})

const WhatIsBip39Stub = defineComponent({
  name: 'WhatIsBip39',
  template: '<div class="what-is" />',
})

describe('Bip39MnemonicGeneratorView', () => {
  it('renders layout with generator and description', () => {
    const wrapper = mount(Bip39MnemonicGeneratorView, {
      global: {
        stubs: {
          ToolDefaultPageLayout: ToolDefaultPageLayoutStub,
          Bip39MnemonicGenerator: Bip39MnemonicGeneratorStub,
          WhatIsBip39: WhatIsBip39Stub,
        },
      },
    })

    const layout = wrapper.findComponent(ToolDefaultPageLayoutStub)
    expect(layout.exists()).toBe(true)
    expect(layout.props('info')).toEqual(toolInfo)
    expect(wrapper.find('.generator').exists()).toBe(true)
    expect(wrapper.find('.what-is').exists()).toBe(true)
  })
})
