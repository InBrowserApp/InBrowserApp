import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'

vi.mock('@vueuse/core', async () => {
  const actual = await vi.importActual<typeof import('@vueuse/core')>('@vueuse/core')
  const { ref, watchEffect, isRef } = await import('vue')

  return {
    ...actual,
    useObjectUrl: (source: unknown) => {
      const url = ref('blob:mock')
      watchEffect(() => {
        if (isRef(source)) {
          return void source.value
        }
        if (typeof source === 'function') {
          source()
        }
      })
      return url
    },
  }
})

import { flushPromises, mount } from '@vue/test-utils'
import SitemapXmlGeneratorView from './SitemapXmlGeneratorView.vue'
import * as toolInfo from './info'
import { routes } from './routes'
import * as indexModule from './index'

const mountOptions = {
  global: {
    stubs: {
      ToolDefaultPageLayout: {
        props: ['info'],
        template: '<div><slot /></div>',
      },
      CopyToClipboardButton: {
        template: '<button />',
      },
    },
  },
}

const stateKey = 'tools:sitemap-xml-generator:state'

const createDefaultState = () => ({
  mode: 'urlset',
  baseUrl: 'https://example.com',
  autoJoin: true,
  urls: [
    {
      id: 'url-0',
      loc: '/',
      lastmod: '2024-01-15',
      changefreq: 'weekly',
      priority: 1,
      images: [],
      videos: [],
      news: [],
    },
  ],
  sitemaps: [
    {
      id: 'sitemap-0',
      loc: '/sitemap.xml',
      lastmod: '',
    },
  ],
})

const getOutput = (wrapper: ReturnType<typeof mount>) =>
  (wrapper.get('[data-testid="sitemap-output"]').find('textarea').element as HTMLTextAreaElement)
    .value

describe('SitemapXmlGeneratorView', () => {
  let wrapper: ReturnType<typeof mount> | null = null

  beforeEach(() => {
    localStorage.clear()
    localStorage.setItem(stateKey, JSON.stringify(createDefaultState()))
  })

  afterEach(() => {
    wrapper?.unmount()
    wrapper = null
  })

  const mountView = () => {
    wrapper = mount(SitemapXmlGeneratorView, mountOptions)
    return wrapper
  }

  it('exposes tool metadata and routes', async () => {
    expect(toolInfo.toolID).toBe('sitemap-xml-generator')
    const route = routes[0]
    if (!route || !route.component) {
      throw new Error('Missing route definition')
    }
    expect(route.path).toBe(toolInfo.path)
    expect(indexModule.toolInfo.toolID).toBe(toolInfo.toolID)
    const routeModule = await (route.component as () => Promise<unknown>)()
    expect(routeModule).toBeTruthy()
  })

  it('generates urlset output and applies base url', async () => {
    const wrapper = mountView()
    await flushPromises()

    const initialOutput = getOutput(wrapper)
    expect(initialOutput).toContain('<urlset')
    expect(initialOutput).toContain('<loc>https://example.com/</loc>')
    expect(initialOutput).toContain('<changefreq>weekly</changefreq>')

    await wrapper.get('[data-testid="base-url"]').find('input').setValue('https://example.org')
    await wrapper.get('[data-testid="url-loc-0"]').find('input').setValue('/about')
    await flushPromises()

    const updatedOutput = getOutput(wrapper)
    expect(updatedOutput).toContain('<loc>https://example.org/about</loc>')
    expect(wrapper.get('[data-testid="download-sitemap"]').attributes('href')).toBe('blob:mock')
  })

  it('applies extension presets', async () => {
    const wrapper = mountView()
    await flushPromises()

    await wrapper.get('[data-testid="preset-image"]').trigger('click')
    await flushPromises()
    expect(getOutput(wrapper)).toContain('xmlns:image=')
    expect(getOutput(wrapper)).toContain('<image:loc>')

    await wrapper.get('[data-testid="preset-video"]').trigger('click')
    await flushPromises()
    expect(getOutput(wrapper)).toContain('xmlns:video=')
    expect(getOutput(wrapper)).toContain('<video:video>')

    await wrapper.get('[data-testid="preset-news"]').trigger('click')
    await flushPromises()
    expect(getOutput(wrapper)).toContain('xmlns:news=')
    expect(getOutput(wrapper)).toContain('<news:news>')
  })

  it('switches to sitemap index preset', async () => {
    const wrapper = mountView()
    await flushPromises()

    await wrapper.get('[data-testid="preset-index"]').trigger('click')
    await flushPromises()

    const output = getOutput(wrapper)
    expect(output).toContain('<sitemapindex')
    expect(output).toContain('<sitemap>')
  })

  it('adds and removes entries', async () => {
    const wrapper = mountView()
    await flushPromises()

    await wrapper.get('[data-testid="add-url"]').trigger('click')
    await flushPromises()
    expect(wrapper.findAll('[data-testid="url-card"]').length).toBe(2)

    await wrapper.get('[data-testid="remove-url-0"]').trigger('click')
    await flushPromises()
    expect(wrapper.findAll('[data-testid="url-card"]').length).toBe(1)

    await wrapper.get('[data-testid="preset-index"]').trigger('click')
    await flushPromises()

    await wrapper.get('[data-testid="add-sitemap"]').trigger('click')
    await flushPromises()
    expect(wrapper.findAll('[data-testid="sitemap-card"]').length).toBe(3)

    await wrapper.get('[data-testid="remove-sitemap-0"]').trigger('click')
    await flushPromises()
    expect(wrapper.findAll('[data-testid="sitemap-card"]').length).toBe(2)
  })
})
