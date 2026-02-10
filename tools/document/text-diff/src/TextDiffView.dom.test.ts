import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import TextDiffView from './TextDiffView.vue'
import { routes } from './routes'
import * as info from './info'
import { toolInfo } from './index'

const ToolDefaultPageLayoutStub = {
  template: '<div><slot /></div>',
  props: ['info'],
}

const TextDiffStub = {
  template: '<div>Text Diff Tool</div>',
}

describe('TextDiffView', () => {
  it('exposes tool metadata and routes', () => {
    expect(info.toolID).toBe('text-diff')
    expect(info.path).toBe('/tools/text-diff')
    expect(toolInfo.toolID).toBe(info.toolID)
    expect(routes[0]?.path).toBe(info.path)
  })

  it('renders the text diff tool layout', () => {
    const wrapper = mount(TextDiffView, {
      global: {
        stubs: {
          ToolDefaultPageLayout: ToolDefaultPageLayoutStub,
          TextDiff: TextDiffStub,
        },
      },
    })

    expect(wrapper.text()).toContain('Text Diff Tool')
  })
})
