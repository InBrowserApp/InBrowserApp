import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import HashToolsView from './HashToolsView.vue'
import * as info from './info'

const ToolDefaultPageLayoutStub = {
  name: 'ToolDefaultPageLayout',
  props: {
    info: {
      type: Object,
      required: true,
    },
    hideRelatedTools: {
      type: Boolean,
      default: false,
    },
  },
  template: '<div><slot /></div>',
}

const TagsToolsStub = {
  name: 'TagsTools',
  props: ['tags', 'exclude'],
  template: '<div data-test="tags-tools" :data-tags="tags" :data-exclude="exclude" />',
}

describe('HashToolsView', () => {
  it('renders the hash tools layout', () => {
    const wrapper = mount(HashToolsView, {
      global: {
        stubs: {
          ToolDefaultPageLayout: ToolDefaultPageLayoutStub,
          TagsTools: TagsToolsStub,
        },
      },
    })

    const layout = wrapper.findComponent({ name: 'ToolDefaultPageLayout' })
    expect(layout.props('info')).toMatchObject({
      toolID: info.toolID,
      path: info.path,
    })
    expect(layout.props('hideRelatedTools')).toBe(true)

    const tags = wrapper.get('[data-test="tags-tools"]')
    expect(tags.attributes('data-tags')).toBe('hash')
    expect(tags.attributes('data-exclude')).toBe('hash-tools')
  })
})
