import { mount } from '@vue/test-utils'
import { defineComponent, nextTick, ref } from 'vue'
import type { ToolInfo } from '@shared/tools'
import { describe, expect, it, vi } from 'vitest'
import TagsTools from './TagsTools.vue'

vi.mock('@vueuse/core', () => ({
  computedAsync: (getter: () => Promise<unknown> | unknown, initialValue: unknown = undefined) => {
    const value = ref(initialValue)
    const resolved = getter()

    if (resolved && typeof (resolved as Promise<unknown>).then === 'function') {
      void (resolved as Promise<unknown>).then((result) => {
        value.value = result
      })
    } else {
      value.value = resolved
    }

    return value
  },
}))

const flushAsync = async () => {
  await Promise.resolve()
  await new Promise((resolve) => setTimeout(resolve, 0))
  await nextTick()
}

const mountWithToolsGrid = (props: { tags: string[] | string; exclude?: string[] | string }) => {
  return mount(TagsTools, {
    props,
    global: {
      stubs: {
        ToolsGrid: defineComponent({
          name: 'ToolsGrid',
          props: {
            tools: {
              type: Array,
              default: () => [],
            },
          },
          template:
            '<div class="tools-grid">{{ (tools || []).map((tool) => tool.toolID).join(",") }}</div>',
        }),
      },
    },
  })
}

const expectToolsText = async (wrapper: ReturnType<typeof mount>, expected: string) => {
  for (let i = 0; i < 20; i += 1) {
    await flushAsync()
    if (wrapper.get('.tools-grid').text() === expected) {
      return
    }
  }

  expect(wrapper.get('.tools-grid').text()).toBe(expected)
}

const filterNetworkTools = async (exclude?: string[] | string) => {
  const allTools = (await import('@registry/tools')).tools

  return allTools
    .filter((tool: ToolInfo) => tool.tags.includes('network'))
    .filter((tool: ToolInfo) => {
      if (typeof exclude === 'string') {
        return tool.toolID !== exclude
      }
      if (Array.isArray(exclude)) {
        return !exclude.includes(tool.toolID)
      }
      return true
    })
    .map((tool: ToolInfo) => tool.toolID)
    .join(',')
}

describe('TagsTools', () => {
  it('filters tools by tags and excludes by string or array', async () => {
    const baseNetwork = (await import('@registry/tools')).tools.filter((tool: ToolInfo) =>
      tool.tags.includes('network'),
    )
    expect(baseNetwork.length).toBeGreaterThan(1)

    const firstToolID = baseNetwork[0]!.toolID
    const secondToolID = baseNetwork[1]!.toolID

    const allNetwork = mountWithToolsGrid({ tags: 'network' })
    await expectToolsText(allNetwork, await filterNetworkTools())

    const excludeString = mountWithToolsGrid({ tags: 'network', exclude: firstToolID })
    await expectToolsText(excludeString, await filterNetworkTools(firstToolID))

    const excludeArray = mountWithToolsGrid({ tags: 'network', exclude: [secondToolID] })
    await expectToolsText(excludeArray, await filterNetworkTools([secondToolID]))
  })
})
