import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import SitemapEntriesTabs from './SitemapEntriesTabs.vue'

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({ t: (key: string) => key }),
  }
})

vi.mock('naive-ui', async () => {
  const { defineComponent, h } = await import('vue')

  const NTabs = defineComponent({
    name: 'NTabs',
    emits: ['update:value'],
    setup(_, { slots }) {
      return () => h('div', { class: 'n-tabs' }, slots.default?.())
    },
  })

  const NTabPane = defineComponent({
    name: 'NTabPane',
    props: {
      tab: {
        type: String,
        default: '',
      },
      name: {
        type: String,
        default: '',
      },
    },
    setup(props, { slots }) {
      return () =>
        h('div', { class: 'n-tab-pane', 'data-name': props.name }, [
          h('span', { class: 'tab-label' }, props.tab),
          slots.default?.(),
        ])
    },
  })

  return {
    NTabs,
    NTabPane,
  }
})

describe('SitemapEntriesTabs', () => {
  it('renders tab labels and emits mode updates', async () => {
    const wrapper = mount(SitemapEntriesTabs, {
      props: {
        mode: 'urlset',
        urls: [],
        sitemaps: [],
      },
      global: {
        stubs: {
          SitemapUrlsetEntries: {
            template: '<div data-testid="urlset-entries" />',
          },
          SitemapIndexEntries: {
            template: '<div data-testid="sitemap-entries" />',
          },
        },
      },
    })

    expect(wrapper.text()).toContain('modeUrlset')
    expect(wrapper.text()).toContain('modeSitemapIndex')
    expect(wrapper.find('[data-testid="urlset-entries"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="sitemap-entries"]').exists()).toBe(true)

    wrapper.findComponent({ name: 'NTabs' }).vm.$emit('update:value', 'sitemapindex')
    expect(wrapper.emitted('update:mode')?.[0]).toEqual(['sitemapindex'])
  })
})
