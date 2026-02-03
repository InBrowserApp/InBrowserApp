import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import DockerRunToComposeView from './DockerRunToComposeView.vue'
import * as toolInfo from './info'

const LayoutStub = defineComponent({
  name: 'ToolDefaultPageLayout',
  props: {
    info: {
      type: Object,
      default: () => ({}),
    },
  },
  template: '<div data-layout :data-tool-id="info.toolID"><slot /></div>',
})

const ToolStub = defineComponent({
  name: 'DockerRunToCompose',
  template: '<div data-testid="docker-run" />',
})

const WhatIsStub = defineComponent({
  name: 'WhatIsDockerRunToCompose',
  template: '<div data-testid="what-is" />',
})

describe('DockerRunToComposeView', () => {
  it('renders the layout and tool sections', () => {
    const wrapper = mount(DockerRunToComposeView, {
      global: {
        stubs: {
          ToolDefaultPageLayout: LayoutStub,
          DockerRunToCompose: ToolStub,
          WhatIsDockerRunToCompose: WhatIsStub,
        },
      },
    })

    const layout = wrapper.get('[data-layout]')
    expect(layout.attributes('data-tool-id')).toBe(toolInfo.toolID)
    expect(wrapper.find('[data-testid="docker-run"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="what-is"]').exists()).toBe(true)
  })
})
