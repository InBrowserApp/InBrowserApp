import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'

vi.mock('@vueuse/core', async () => {
  const { computed } = await import('vue')

  return {
    useObjectUrl: (source: { value: Blob | null }) =>
      computed(() => {
        if (!source.value) {
          return null
        }
        return source.value.size === 10 ? null : 'blob:download'
      }),
  }
})

vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (key: string) => key,
  }),
}))

vi.mock('naive-ui', async () => {
  const { defineComponent, h } = await import('vue')

  const NButton = defineComponent({
    name: 'NButton',
    setup(_, { slots, attrs }) {
      return () => h(attrs.tag === 'a' ? 'a' : 'button', attrs, [slots.icon?.(), slots.default?.()])
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
    setup(props, { attrs }) {
      return () => h('textarea', { ...attrs, value: props.value })
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

  return { NButton, NFlex, NIcon, NInput, NSpace, NText }
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

vi.mock('@shared/ui/base', () => ({
  CopyToClipboardButton: {
    props: ['content'],
    template: '<button data-testid="copy-button" :data-content="content" />',
  },
}))

import SitemapOutputSection from './SitemapOutputSection.vue'

describe('SitemapOutputSection', () => {
  it('renders copy/download controls for urlset output', async () => {
    const wrapper = mount(SitemapOutputSection, {
      props: {
        mode: 'urlset',
        xmlContent: '<urlset></urlset>',
      },
    })

    await wrapper.vm.$nextTick()

    expect(wrapper.get('[data-testid="copy-button"]').attributes('data-content')).toBe(
      '<urlset></urlset>',
    )

    const download = wrapper.get('[data-testid="download-sitemap"]')
    expect(download.attributes('download')).toBe('sitemap.xml')
    expect(download.attributes('href')).toBe('blob:download')
    expect(download.attributes('disabled')).toBe('false')
  })

  it('falls back to undefined href when object url is unavailable', async () => {
    const wrapper = mount(SitemapOutputSection, {
      props: {
        mode: 'sitemapindex',
        xmlContent: '0123456789',
      },
    })

    await wrapper.vm.$nextTick()

    const download = wrapper.get('[data-testid="download-sitemap"]')
    expect(download.attributes('download')).toBe('sitemap-index.xml')
    expect(download.attributes('href')).toBeUndefined()
    expect(download.attributes('disabled')).toBe('true')
  })

  it('shows the empty state when output is blank', async () => {
    const wrapper = mount(SitemapOutputSection, {
      props: {
        mode: 'urlset',
        xmlContent: '   ',
      },
    })

    await wrapper.vm.$nextTick()

    expect(wrapper.find('[data-testid="copy-button"]').exists()).toBe(false)
    expect(wrapper.text()).toContain('emptyOutput')

    const download = wrapper.get('[data-testid="download-sitemap"]')
    expect(download.attributes('href')).toBeUndefined()
    expect(download.attributes('disabled')).toBe('true')
  })
})
