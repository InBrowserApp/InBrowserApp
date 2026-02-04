import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import SitemapIndexEntries from './SitemapIndexEntries.vue'

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({
      t: (key: string, params?: { index?: number }) =>
        params?.index ? `${key}-${params.index}` : key,
    }),
  }
})

vi.mock('naive-ui', async () => {
  const { defineComponent, h } = await import('vue')

  const NButton = defineComponent({
    name: 'NButton',
    props: {
      disabled: {
        type: Boolean,
        default: false,
      },
    },
    emits: ['click'],
    setup(props, { slots, emit, attrs }) {
      return () =>
        h(
          'button',
          {
            ...attrs,
            disabled: props.disabled,
            onClick: () => emit('click'),
          },
          slots.default?.(),
        )
    },
  })

  const NCard = defineComponent({
    name: 'NCard',
    setup(_, { slots, attrs }) {
      return () => h('div', { ...attrs, class: 'n-card' }, slots.default?.())
    },
  })

  const NFlex = defineComponent({
    name: 'NFlex',
    setup(_, { slots }) {
      return () => h('div', { class: 'n-flex' }, slots.default?.())
    },
  })

  const NIcon = defineComponent({
    name: 'NIcon',
    setup() {
      return () => h('span', { class: 'n-icon' })
    },
  })

  const NInput = defineComponent({
    name: 'NInput',
    props: {
      value: {
        type: String,
        default: '',
      },
    },
    emits: ['update:value'],
    setup(props, { emit, attrs }) {
      return () =>
        h('input', {
          ...attrs,
          value: props.value,
          onInput: (event: Event) => emit('update:value', (event.target as HTMLInputElement).value),
        })
    },
  })

  const NSpace = defineComponent({
    name: 'NSpace',
    setup(_, { slots }) {
      return () => h('div', { class: 'n-space' }, slots.default?.())
    },
  })

  const NText = defineComponent({
    name: 'NText',
    setup(_, { slots }) {
      return () => h('span', { class: 'n-text' }, slots.default?.())
    },
  })

  return {
    NButton,
    NCard,
    NFlex,
    NIcon,
    NInput,
    NSpace,
    NText,
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

describe('SitemapIndexEntries', () => {
  it('adds and removes sitemap entries', async () => {
    const sitemaps = [
      {
        id: 'sitemap-0',
        loc: '',
        lastmod: '',
      },
    ]

    const wrapper = mount(SitemapIndexEntries, {
      props: {
        sitemaps,
      },
    })

    expect(wrapper.findAll('[data-testid="sitemap-card"]')).toHaveLength(1)

    await wrapper.get('[data-testid="remove-sitemap-0"]').trigger('click')
    expect(wrapper.findAll('[data-testid="sitemap-card"]')).toHaveLength(1)

    await wrapper.get('[data-testid="add-sitemap"]').trigger('click')
    expect(wrapper.findAll('[data-testid="sitemap-card"]')).toHaveLength(2)

    await wrapper.get('[data-testid="remove-sitemap-0"]').trigger('click')
    expect(wrapper.findAll('[data-testid="sitemap-card"]')).toHaveLength(1)
  })

  it('updates input values via v-model', async () => {
    const sitemaps = [
      {
        id: 'sitemap-0',
        loc: '',
        lastmod: '',
      },
    ]

    const wrapper = mount(SitemapIndexEntries, {
      props: {
        sitemaps,
      },
    })

    await wrapper.get('[data-testid="sitemap-loc-0"]').setValue('https://example.com/sitemap.xml')

    expect(sitemaps[0]?.loc).toBe('https://example.com/sitemap.xml')
  })
})
