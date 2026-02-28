import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import SitemapPresetsSection from './SitemapPresetsSection.vue'

vi.mock('naive-ui', async () => {
  const { defineComponent, h } = await import('vue')

  const NButton = defineComponent({
    name: 'NButton',
    emits: ['click'],
    setup(_, { slots, emit, attrs }) {
      return () =>
        h(
          'button',
          {
            ...attrs,
            onClick: () => emit('click'),
          },
          slots.default?.(),
        )
    },
  })

  const NFlex = defineComponent({
    name: 'NFlex',
    setup(_, { slots }) {
      return () => h('div', { class: 'n-flex' }, slots.default?.())
    },
  })

  return {
    NButton,
    NFlex,
  }
})

vi.mock('@shared/ui/tool', async () => {
  const { defineComponent, h } = await import('vue')

  const ToolSection = defineComponent({
    name: 'ToolSection',
    setup(_, { slots }) {
      return () => h('section', { class: 'tool-section' }, slots.default?.())
    },
  })

  const ToolSectionHeader = defineComponent({
    name: 'ToolSectionHeader',
    setup(_, { slots }) {
      return () => h('header', { class: 'tool-section-header' }, slots.default?.())
    },
  })

  return { ToolSection, ToolSectionHeader }
})

describe('SitemapPresetsSection', () => {
  it('emits apply for each preset button', async () => {
    const wrapper = mount(SitemapPresetsSection)

    await wrapper.get('[data-testid="preset-basic"]').trigger('click')
    await wrapper.get('[data-testid="preset-image"]').trigger('click')
    await wrapper.get('[data-testid="preset-video"]').trigger('click')
    await wrapper.get('[data-testid="preset-news"]').trigger('click')
    await wrapper.get('[data-testid="preset-index"]').trigger('click')

    expect(wrapper.emitted('apply')).toEqual([['basic'], ['image'], ['video'], ['news'], ['index']])
  })
})
