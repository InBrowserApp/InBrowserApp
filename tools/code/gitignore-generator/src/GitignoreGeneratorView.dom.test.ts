import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import GitignoreGeneratorView from './GitignoreGeneratorView.vue'
import * as toolInfo from './info'

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

const GitignoreGeneratorStub = defineComponent({
  name: 'GitignoreGenerator',
  template: '<div class="gitignore-generator" />',
})

const WhatIsGitignoreStub = defineComponent({
  name: 'WhatIsGitignore',
  template: '<div class="what-is-gitignore" />',
})

describe('GitignoreGeneratorView', () => {
  it('renders layout with tool info and sections', () => {
    const wrapper = mount(GitignoreGeneratorView, {
      global: {
        stubs: {
          ToolDefaultPageLayout: ToolDefaultPageLayoutStub,
          GitignoreGenerator: GitignoreGeneratorStub,
          WhatIsGitignore: WhatIsGitignoreStub,
        },
      },
    })

    const layout = wrapper.findComponent(ToolDefaultPageLayoutStub)
    expect(layout.exists()).toBe(true)
    expect(layout.props('info')).toEqual(toolInfo)
    expect(wrapper.find('.gitignore-generator').exists()).toBe(true)
    expect(wrapper.find('.what-is-gitignore').exists()).toBe(true)
  })
})
