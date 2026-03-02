import type { ToolInfo } from '@shared/tools'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import ToolThing from './ToolThing.vue'

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')

  const base = (name: string, tag = 'div') =>
    defineComponent({
      name,
      inheritAttrs: false,
      template: `<${tag} v-bind="$attrs"><slot /></${tag}>`,
    })

  const NThing = defineComponent({
    name: 'NThing',
    template: `
      <article class="n-thing">
        <div class="avatar"><slot name="avatar" /></div>
        <h3 class="header"><slot name="header" /></h3>
        <div class="header-extra"><slot name="header-extra" /></div>
        <p class="description"><slot name="description" /></p>
      </article>
    `,
  })

  return {
    NThing,
    NAvatar: base('NAvatar', 'span'),
    NIcon: base('NIcon', 'span'),
    NTag: base('NTag', 'span'),
    useThemeVars: () => ({
      cubicBezierEaseInOut: 'ease',
      hoverColor: '#eee',
    }),
  }
})

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
  it('renders internal tool with router link', () => {
    const tool = createTool()
    const wrapper = mount(ToolThing, {
      props: { tool, showIcon: true },
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
    expect(wrapper.findComponent({ name: 'NAvatar' }).exists()).toBe(true)
  })

  it('can hide the icon avatar for internal tools', () => {
    const tool = createTool()
    const wrapper = mount(ToolThing, {
      props: { tool, showIcon: false },
      global: {
        stubs: {
          CustomRouterLink: RouterLinkStub,
        },
      },
    })

    expect(wrapper.findComponent({ name: 'NAvatar' }).exists()).toBe(false)
  })

  it('renders external tool as anchor and shows third party tag', () => {
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

  it('renders external tools without the third-party tag by default', () => {
    const tool = createTool({ external: true })
    const wrapper = mount(ToolThing, {
      props: { tool, showIcon: false },
    })

    expect(wrapper.find('a.tool-link').exists()).toBe(true)
    expect(wrapper.text()).not.toContain('Third Party')
    expect(wrapper.findComponent({ name: 'NAvatar' }).exists()).toBe(false)
  })

  it('shows the icon avatar for external tools when enabled', () => {
    const tool = createTool({ external: true })
    const wrapper = mount(ToolThing, {
      props: { tool, showIcon: true },
    })

    expect(wrapper.find('a.tool-link').exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'NAvatar' }).exists()).toBe(true)
  })
})
