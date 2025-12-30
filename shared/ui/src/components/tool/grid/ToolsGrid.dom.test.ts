import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ToolsGrid from './ToolsGrid.vue'
import type { ToolInfo } from '@shared/tools'

// Mock child components
const ToolThing = {
  name: 'ToolThing',
  template: '<div class="tool-thing">{{ tool.toolID }}</div>',
  props: ['tool', 'showIcon'],
}

const ToolLoadingThing = {
  name: 'ToolLoadingThing',
  template: '<div class="tool-loading"></div>',
}

// Create mock tools
const createMockTool = (id: string): ToolInfo =>
  ({
    toolID: id,
    path: `/tools/${id}`,
    icon: {},
    tags: ['test'],
    features: [],
    meta: {
      en: { name: id, description: `${id} description` },
    },
  }) as unknown as ToolInfo

const mockTools: ToolInfo[] = [
  createMockTool('tool-1'),
  createMockTool('tool-2'),
  createMockTool('tool-3'),
]

describe('ToolsGrid', () => {
  it('should render loading state when tools is undefined', () => {
    const wrapper = mount(ToolsGrid, {
      global: {
        stubs: { ToolThing, ToolLoadingThing },
      },
    })
    expect(wrapper.findAll('.tool-loading').length).toBe(12) // default loadingSize
  })

  it('should render custom loading size', () => {
    const wrapper = mount(ToolsGrid, {
      props: { loadingSize: 6 },
      global: {
        stubs: { ToolThing, ToolLoadingThing },
      },
    })
    expect(wrapper.findAll('.tool-loading').length).toBe(6)
  })

  it('should render all tools when provided', () => {
    const wrapper = mount(ToolsGrid, {
      props: { tools: mockTools },
      global: {
        stubs: { ToolThing, ToolLoadingThing },
      },
    })
    expect(wrapper.findAll('.tool-thing').length).toBe(3)
  })

  it('should filter out single tool by string hide prop', () => {
    const wrapper = mount(ToolsGrid, {
      props: {
        tools: mockTools,
        hide: 'tool-2',
      },
      global: {
        stubs: { ToolThing, ToolLoadingThing },
      },
    })
    const toolThings = wrapper.findAll('.tool-thing')
    expect(toolThings.length).toBe(2)
    expect(toolThings.map((w) => w.text())).not.toContain('tool-2')
  })

  it('should filter out multiple tools by array hide prop', () => {
    const wrapper = mount(ToolsGrid, {
      props: {
        tools: mockTools,
        hide: ['tool-1', 'tool-3'],
      },
      global: {
        stubs: { ToolThing, ToolLoadingThing },
      },
    })
    const toolThings = wrapper.findAll('.tool-thing')
    expect(toolThings.length).toBe(1)
    expect(toolThings[0]?.text()).toBe('tool-2')
  })

  it('should render all tools when hide is empty array', () => {
    const wrapper = mount(ToolsGrid, {
      props: {
        tools: mockTools,
        hide: [],
      },
      global: {
        stubs: { ToolThing, ToolLoadingThing },
      },
    })
    expect(wrapper.findAll('.tool-thing').length).toBe(3)
  })

  it('should handle empty tools array', () => {
    const wrapper = mount(ToolsGrid, {
      props: { tools: [] },
      global: {
        stubs: { ToolThing, ToolLoadingThing },
      },
    })
    expect(wrapper.findAll('.tool-thing').length).toBe(0)
    expect(wrapper.findAll('.tool-loading').length).toBe(0)
  })

  it('should not hide any tools when hide prop is not provided', () => {
    const wrapper = mount(ToolsGrid, {
      props: { tools: mockTools },
      global: {
        stubs: { ToolThing, ToolLoadingThing },
      },
    })
    expect(wrapper.findAll('.tool-thing').length).toBe(3)
  })
})
