import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import SitemapUrlsetEntries from './SitemapUrlsetEntries.vue'

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

  const NInputNumber = defineComponent({
    name: 'NInputNumber',
    props: {
      value: {
        type: Number,
        default: null,
      },
    },
    emits: ['update:value'],
    setup(props, { emit, attrs }) {
      return () =>
        h('input', {
          ...attrs,
          type: 'number',
          value: props.value ?? '',
          onInput: (event: Event) =>
            emit('update:value', Number((event.target as HTMLInputElement).value)),
        })
    },
  })

  const NSelect = defineComponent({
    name: 'NSelect',
    props: {
      value: {
        type: String,
        default: '',
      },
      options: {
        type: Array,
        default: () => [],
      },
    },
    emits: ['update:value'],
    setup(props, { emit, attrs }) {
      return () =>
        h(
          'select',
          {
            ...attrs,
            'data-options': String(props.options.length),
            value: props.value,
            onChange: (event: Event) =>
              emit('update:value', (event.target as HTMLSelectElement).value),
          },
          [],
        )
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
    NInputNumber,
    NSelect,
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

describe('SitemapUrlsetEntries', () => {
  it('adds and removes url entries', async () => {
    const urls = [
      {
        id: 'url-0',
        loc: '',
        lastmod: '',
        changefreq: null,
        priority: null,
        images: [],
        videos: [],
        news: [],
      },
    ]

    const wrapper = mount(SitemapUrlsetEntries, {
      props: {
        urls,
      },
      global: {
        stubs: {
          SitemapUrlEntryImages: { template: '<div data-testid="images" />' },
          SitemapUrlEntryVideos: { template: '<div data-testid="videos" />' },
          SitemapUrlEntryNews: { template: '<div data-testid="news" />' },
        },
      },
    })

    expect(wrapper.findAll('[data-testid="url-card"]')).toHaveLength(1)

    await wrapper.get('[data-testid="remove-url-0"]').trigger('click')
    expect(wrapper.findAll('[data-testid="url-card"]')).toHaveLength(1)

    await wrapper.get('[data-testid="add-url"]').trigger('click')
    expect(wrapper.findAll('[data-testid="url-card"]')).toHaveLength(2)

    await wrapper.get('[data-testid="remove-url-0"]').trigger('click')
    expect(wrapper.findAll('[data-testid="url-card"]')).toHaveLength(1)
  })

  it('updates url fields via v-model', async () => {
    const urls = [
      {
        id: 'url-0',
        loc: '',
        lastmod: '',
        changefreq: null,
        priority: null,
        images: [],
        videos: [],
        news: [],
      },
    ]

    const wrapper = mount(SitemapUrlsetEntries, {
      props: {
        urls,
      },
      global: {
        stubs: {
          SitemapUrlEntryImages: true,
          SitemapUrlEntryVideos: true,
          SitemapUrlEntryNews: true,
        },
      },
    })

    await wrapper.get('[data-testid="url-loc-0"]').setValue('/about')
    expect(urls[0]?.loc).toBe('/about')
  })
})
