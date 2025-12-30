import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import ToolThing from './ToolThing.vue'
import type { ToolInfo } from '@shared/tools'

const RouterLinkStub = defineComponent({
  name: 'CustomRouterLink',
  props: ['to'],
  template: '<div class="router-link"><slot /></div>',
})

const createTool = (overrides: Partial<ToolInfo> = {}): ToolInfo =>
  ({
    toolID: 'tool-1',
    path: '/tools/tool-1',
    icon: defineComponent({ template: '<span />' }),
    tags: ['test'],
    features: [],
    meta: {
      en: { name: 'Tool Name', description: 'Tool description' },
    },
    ...overrides,
  }) as ToolInfo

describe('ToolThing', () => {
  it('should render internal tool with router link', () => {
    const tool = createTool()
    const wrapper = mount(ToolThing, {
      props: { tool },
      global: {
        stubs: {
          CustomRouterLink: RouterLinkStub,
        },
      },
    })

    const routerLink = wrapper.findComponent({ name: 'CustomRouterLink' })
    expect(routerLink.exists()).toBe(true)
    expect(routerLink.props('to')).toBe('/tools/tool-1')
    expect(wrapper.text()).toContain('Tool Name')
    expect(wrapper.text()).toContain('Tool description')
    expect(wrapper.text()).not.toContain('Third Party')
  })

  it('should render external tool as anchor and show third party tag', () => {
    const tool = createTool({ external: true, thirdParty: true })
    const wrapper = mount(ToolThing, {
      props: { tool },
    })

    const anchor = wrapper.find('a.tool-link')
    expect(anchor.exists()).toBe(true)
    expect(anchor.attributes('href')).toBe('/tools/tool-1')
    expect(wrapper.findComponent({ name: 'CustomRouterLink' }).exists()).toBe(false)
    expect(wrapper.text()).toContain('Third Party')
  })
})
