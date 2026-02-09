import type { ToolInfo } from '@shared/tools'
import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import RelatedTools from './RelatedTools.vue'

const { registryState } = vi.hoisted(() => ({
  registryState: {
    tools: [] as ToolInfo[],
  },
}))

vi.mock('@registry/tools', () => registryState)

const createTool = (toolID: string, tags: string[]): ToolInfo =>
  ({
    toolID,
    path: `/tools/${toolID}`,
    icon: {},
    tags,
    features: [],
    meta: {
      en: { name: toolID, description: `${toolID} description` },
    },
  }) as unknown as ToolInfo

const stubs = {
  ToolSectionHeader: { template: '<div class="header"><slot /></div>' },
  ToolSection: { template: '<div class="section"><slot /></div>' },
  ToolsGrid: {
    props: {
      tools: {
        type: Array,
        default: () => [],
      },
    },
    template: '<div class="tools-grid">{{ tools.length }}</div>',
  },
}

describe('RelatedTools', () => {
  it('renders related tools based on shared tags', async () => {
    registryState.tools = [
      createTool('current', ['tag-a']),
      createTool('match', ['tag-a', 'tag-b']),
      createTool('other', ['tag-c']),
    ]

    const wrapper = mount(RelatedTools, {
      props: {
        tool: {
          toolID: 'current',
          tags: ['tag-a'],
        },
      },
      global: {
        stubs,
      },
    })

    await flushPromises()

    expect(wrapper.find('.header').text()).toContain('Related Tools')
    await vi.waitFor(() => {
      expect(wrapper.find('.tools-grid').text()).toBe('1')
    })
  })

  it('shows placeholders before async tools resolve, then hides empty related tools', async () => {
    registryState.tools = [createTool('current', ['tag-a'])]

    const wrapper = mount(RelatedTools, {
      props: {
        tool: {
          toolID: 'current',
          tags: ['tag-a'],
        },
      },
      global: {
        stubs,
      },
    })

    expect(wrapper.find('.header').exists()).toBe(true)
    expect(wrapper.find('.tools-grid').exists()).toBe(true)

    await flushPromises()

    expect(wrapper.find('.header').exists()).toBe(false)
    expect(wrapper.find('.tools-grid').exists()).toBe(false)
  })
})
