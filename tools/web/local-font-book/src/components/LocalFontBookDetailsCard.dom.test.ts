import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import LocalFontBookDetailsCard from './LocalFontBookDetailsCard.vue'

const { copySpy } = vi.hoisted(() => ({
  copySpy: vi.fn(),
}))

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')

  const BlockStub = defineComponent({
    inheritAttrs: false,
    template: '<div v-bind="$attrs"><slot /><slot name="label" /></div>',
  })

  const InlineStub = defineComponent({
    inheritAttrs: false,
    template: '<span v-bind="$attrs"><slot /></span>',
  })

  const NCode = defineComponent({
    inheritAttrs: false,
    props: {
      code: { type: String, default: '' },
    },
    template: '<pre v-bind="$attrs">{{ code }}</pre>',
  })

  return {
    NCode,
    NDescriptions: BlockStub,
    NDescriptionsItem: BlockStub,
    NText: InlineStub,
  }
})

vi.mock('@shared/ui/tool', async () => {
  const { defineComponent } = await import('vue')

  const SectionStub = defineComponent({
    inheritAttrs: false,
    template: '<section v-bind="$attrs"><slot /></section>',
  })

  return {
    ToolSection: SectionStub,
    ToolSectionHeader: SectionStub,
  }
})

vi.mock('@shared/ui/base', () => ({
  CopyToClipboardTooltip: defineComponent({
    props: {
      content: { type: String, default: '' },
    },
    setup(_, { slots }) {
      return () => h('div', slots.default?.({ copy: copySpy }))
    },
  }),
}))

describe('LocalFontBookDetailsCard', () => {
  beforeEach(() => {
    copySpy.mockClear()
  })

  it('renders placeholders and skips copy when values are missing', async () => {
    const wrapper = mount(LocalFontBookDetailsCard, {
      props: {
        cssSnippet: '',
      },
    })

    expect(wrapper.text()).toContain('--')

    const valueNodes = wrapper.findAll('.details-value')
    expect(valueNodes.length).toBe(4)

    for (const node of valueNodes) {
      await node.trigger('click')
    }
    await wrapper.get('.css-snippet-trigger').trigger('click')

    expect(copySpy).not.toHaveBeenCalled()
  })

  it('copies filled values and css snippets', async () => {
    const wrapper = mount(LocalFontBookDetailsCard, {
      props: {
        activeFont: {
          family: 'Inter',
          fullName: 'Inter Bold',
          postscriptName: 'Inter-Bold',
          style: 'Bold',
          id: 'Inter-Bold',
          displayName: 'Inter Bold',
          displayFamily: 'Inter',
          displayStyle: 'Bold',
          searchKey: 'inter inter bold inter-bold',
        },
        cssSnippet: 'font-family: "Inter";\nfont-weight: 700;',
      },
    })

    const valueNodes = wrapper.findAll('.details-value')
    expect(valueNodes.length).toBe(4)

    for (const node of valueNodes) {
      await node.trigger('click')
    }
    await wrapper.get('.css-snippet-trigger').trigger('click')

    expect(copySpy).toHaveBeenCalledTimes(5)
    expect(wrapper.get('[data-testid="css-snippet"]').text()).toContain('font-weight: 700;')
  })
})
