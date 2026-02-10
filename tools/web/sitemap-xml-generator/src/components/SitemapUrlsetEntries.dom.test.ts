import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
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

    const SitemapUrlEntryImagesStub = defineComponent({
      emits: ['update:images'],
      template: `<button data-testid="emit-images" @click="$emit('update:images', [{ loc: '/images/hero.jpg', title: 'Hero', caption: 'Homepage', license: 'https://example.com/license' }])" />`,
    })

    const SitemapUrlEntryVideosStub = defineComponent({
      emits: ['update:videos'],
      template: `<button data-testid="emit-videos" @click="$emit('update:videos', [{ thumbnailLoc: '/images/thumb.jpg', title: 'Intro', description: 'desc', contentLoc: 'https://example.com/video.mp4', playerLoc: 'https://example.com/player', duration: 30, publicationDate: '2024-01-20' }])" />`,
    })

    const SitemapUrlEntryNewsStub = defineComponent({
      emits: ['update:news'],
      template: `<button data-testid="emit-news" @click="$emit('update:news', [{ publicationName: 'Example News', publicationLanguage: 'en', title: 'Launch', publicationDate: '2024-01-25', keywords: 'launch' }])" />`,
    })

    const wrapper = mount(SitemapUrlsetEntries, {
      props: {
        urls,
      },
      global: {
        stubs: {
          SitemapUrlEntryImages: SitemapUrlEntryImagesStub,
          SitemapUrlEntryVideos: SitemapUrlEntryVideosStub,
          SitemapUrlEntryNews: SitemapUrlEntryNewsStub,
        },
      },
    })

    const inputs = wrapper.findAll('input')

    await wrapper.get('[data-testid="url-loc-0"]').setValue('/about')
    await inputs[1]?.setValue('2024-01-15')
    wrapper.findComponent({ name: 'NSelect' }).vm.$emit('update:value', 'weekly')
    wrapper.findComponent({ name: 'NInputNumber' }).vm.$emit('update:value', 0.8)
    await wrapper.get('[data-testid="emit-images"]').trigger('click')
    await wrapper.get('[data-testid="emit-videos"]').trigger('click')
    await wrapper.get('[data-testid="emit-news"]').trigger('click')

    expect(urls[0]?.loc).toBe('/about')
    expect(urls[0]?.lastmod).toBe('2024-01-15')
    expect(urls[0]?.changefreq).toBe('weekly')
    expect(urls[0]?.priority).toBe(0.8)
    expect(urls[0]?.images).toHaveLength(1)
    expect(urls[0]?.videos).toHaveLength(1)
    expect(urls[0]?.news).toHaveLength(1)
  })
})
