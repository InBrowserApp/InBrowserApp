import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'

vi.mock('@vueuse/core', async () => {
  const { computed } = await import('vue')

  return {
    useObjectUrl: (source: { value: Blob | null }) =>
      computed(() => {
        if (!source.value) return null
        return source.value.size === 10 ? null : 'blob:download'
      }),
  }
})

vi.mock('naive-ui', async () => {
  const { defineComponent, h } = await import('vue')

  const NButton = defineComponent({
    name: 'NButton',
    setup(_, { slots, attrs }) {
      return () => h(attrs.tag === 'a' ? 'a' : 'button', attrs, slots.default?.())
    },
  })

  const Base = defineComponent({
    inheritAttrs: false,
    setup(_, { slots, attrs }) {
      return () => h('div', attrs, slots.default?.())
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

  const NText = defineComponent({
    setup(_, { slots }) {
      return () => h('span', slots.default?.())
    },
  })

  return { NButton, NFlex: Base, NInput, NSpace: Base, NText }
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

vi.mock('@shared/ui/base', () => ({
  CopyToClipboardButton: {
    props: ['content'],
    template: '<button data-testid="copy-button" :data-content="content" />',
  },
}))

import OgMetaOutputSection from './OgMetaOutputSection.vue'

describe('OgMetaOutputSection', () => {
  it('renders copy and download controls when html is available', async () => {
    const wrapper = mount(OgMetaOutputSection, {
      props: {
        htmlContent: '<meta property="og:title" content="Test">',
      },
    })

    await wrapper.vm.$nextTick()

    expect(wrapper.get('[data-testid="copy-button"]').attributes('data-content')).toContain(
      'og:title',
    )

    const download = wrapper.get('[data-testid="download-html"]')
    expect(download.attributes('download')).toBe('open-graph-meta-tags.html')
    expect(download.attributes('href')).toBe('blob:download')
    expect(download.attributes('disabled')).toBe('false')
  })

  it('shows the empty state when there is no output or object url is unavailable', async () => {
    const wrapper = mount(OgMetaOutputSection, {
      props: {
        htmlContent: '0123456789',
      },
    })

    await wrapper.vm.$nextTick()

    const download = wrapper.get('[data-testid="download-html"]')
    expect(download.attributes('href')).toBeUndefined()
    expect(download.attributes('disabled')).toBe('true')

    await wrapper.setProps({ htmlContent: '   ' })
    await wrapper.vm.$nextTick()

    expect(wrapper.find('[data-testid="copy-button"]').exists()).toBe(false)
    expect(wrapper.text()).toContain('Add content to generate meta tags.')
  })
})
