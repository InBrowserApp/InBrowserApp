import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import * as toolInfo from './info'
import AsciiArtGeneratorView from './AsciiArtGeneratorView.vue'

const LayoutStub = defineComponent({
  name: 'ToolDefaultPageLayout',
  props: ['info'],
  template: '<div><slot /></div>',
})

const GeneratorStub = defineComponent({
  name: 'AsciiArtGenerator',
  template: '<div data-test="generator" />',
})

const WhatIsStub = defineComponent({
  name: 'WhatIsAsciiArt',
  template: '<div data-test="what-is" />',
})

describe('AsciiArtGeneratorView', () => {
  it('renders layout with generator and info sections', () => {
    const wrapper = mount(AsciiArtGeneratorView, {
      global: {
        stubs: {
          ToolDefaultPageLayout: LayoutStub,
          AsciiArtGenerator: GeneratorStub,
          WhatIsAsciiArt: WhatIsStub,
        },
      },
    })

    const layout = wrapper.findComponent({ name: 'ToolDefaultPageLayout' })
    expect(layout.props('info')).toMatchObject({ toolID: toolInfo.toolID })
    expect(wrapper.find('[data-test="generator"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="what-is"]').exists()).toBe(true)
  })
})
