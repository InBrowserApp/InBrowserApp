import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'

vi.mock('naive-ui', async () => {
  const { defineComponent, h } = await import('vue')

  const Base = defineComponent({
    inheritAttrs: false,
    setup(_, { slots, attrs }) {
      return () => h('div', attrs, slots.default?.())
    },
  })

  const NText = defineComponent({
    setup(_, { slots }) {
      return () => h('span', slots.default?.())
    },
  })

  return { NCard: Base, NFlex: Base, NText }
})

vi.mock('@shared/ui/tool', async () => {
  const { defineComponent, h } = await import('vue')

  return {
    ToolSection: defineComponent({
      setup(_, { slots }) {
        return () => h('section', slots.default?.())
      },
    }),
    ToolSectionHeader: defineComponent({
      setup(_, { slots }) {
        return () => h('header', slots.default?.())
      },
    }),
  }
})

import OgMetaPreviewSection from './OgMetaPreviewSection.vue'

describe('OgMetaPreviewSection', () => {
  it('renders image previews for large twitter cards', () => {
    const wrapper = mount(OgMetaPreviewSection, {
      props: {
        preview: {
          title: 'Preview title',
          description: 'Preview description',
          siteName: 'InBrowser.App',
          domain: 'inbrowser.app',
          imageUrl: 'https://example.com/social.png',
          imageAlt: 'Social image',
          twitterCard: 'summary_large_image',
        },
      },
    })

    expect(wrapper.findAll('img')).toHaveLength(2)
    expect(wrapper.find('img').attributes('src')).toBe('https://example.com/social.png')
    expect(wrapper.get('[data-testid="facebook-preview"]').text()).toContain('Preview title')
    expect(wrapper.get('[data-testid="twitter-preview"]').text()).toContain('InBrowser.App')
    expect(wrapper.html()).toContain('preview-image-large')
  })

  it('shows the placeholder and summary thumbnail class when no image is provided', () => {
    const wrapper = mount(OgMetaPreviewSection, {
      props: {
        preview: {
          title: 'Preview title',
          description: 'Preview description',
          siteName: 'InBrowser.App',
          domain: 'inbrowser.app',
          imageUrl: '',
          imageAlt: '',
          twitterCard: 'summary',
        },
      },
    })

    expect(wrapper.find('img').exists()).toBe(false)
    expect(wrapper.text()).toContain('No image selected')
    expect(wrapper.html()).toContain('preview-image-thumb')
  })
})
