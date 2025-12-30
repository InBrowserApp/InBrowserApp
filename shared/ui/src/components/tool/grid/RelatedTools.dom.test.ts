import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import type { Ref } from 'vue'
import RelatedTools from './RelatedTools.vue'
import type { ToolInfo } from '@shared/tools'

const { relatedToolsRef } = vi.hoisted(() => ({
  relatedToolsRef: { value: undefined, __v_isRef: true } as unknown as Ref<ToolInfo[] | undefined>,
}))

vi.mock('@vueuse/core', async () => {
  const actual = await vi.importActual<typeof import('@vueuse/core')>('@vueuse/core')
  return {
    ...actual,
    computedAsync: () => relatedToolsRef,
  }
})

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

describe('RelatedTools', () => {
  it('should render related tools based on shared tags', async () => {
    relatedToolsRef.value = [createTool('match', ['tag-a', 'tag-b'])]

    const wrapper = mount(RelatedTools, {
      props: {
        tool: {
          toolID: 'current',
          tags: ['tag-a'],
        },
      },
      global: {
        stubs: {
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
        },
      },
    })

    expect(wrapper.find('.header').text()).toContain('Related Tools')
    expect(wrapper.find('.tools-grid').text()).toBe('1')
  })

  it('should hide related tools when no matches exist', async () => {
    relatedToolsRef.value = []

    const wrapper = mount(RelatedTools, {
      props: {
        tool: {
          toolID: 'current',
          tags: ['tag-a'],
        },
      },
      global: {
        stubs: {
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
        },
      },
    })

    expect(wrapper.find('.header').exists()).toBe(false)
    expect(wrapper.find('.tools-grid').exists()).toBe(false)
  })
})
