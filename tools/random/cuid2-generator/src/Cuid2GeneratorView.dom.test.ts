import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Cuid2GeneratorView from './Cuid2GeneratorView.vue'
import * as toolInfo from './info'

const ToolDefaultPageLayoutStub = {
  name: 'ToolDefaultPageLayout',
  props: ['info'],
  template: '<div class="layout"><slot /></div>',
}

const Cuid2GeneratorStub = {
  name: 'Cuid2Generator',
  template: '<div class="cuid2-generator" />',
}

const WhatIsCuid2Stub = {
  name: 'WhatIsCuid2',
  template: '<div class="what-is-cuid2" />',
}

describe('Cuid2GeneratorView', () => {
  it('renders tool layout and sections', () => {
    const wrapper = mount(Cuid2GeneratorView, {
      global: {
        stubs: {
          ToolDefaultPageLayout: ToolDefaultPageLayoutStub,
          Cuid2Generator: Cuid2GeneratorStub,
          WhatIsCuid2: WhatIsCuid2Stub,
        },
      },
    })

    expect(wrapper.find('.layout').exists()).toBe(true)
    expect(wrapper.find('.cuid2-generator').exists()).toBe(true)
    expect(wrapper.find('.what-is-cuid2').exists()).toBe(true)

    const layout = wrapper.findComponent({ name: 'ToolDefaultPageLayout' })
    expect(layout.props('info')).toBe(toolInfo)
  })
})
