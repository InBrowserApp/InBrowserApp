import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import SitemapXmlGenerator from './SitemapXmlGenerator.vue'
import type { SitemapState } from '../sitemapState'
import { defaultState } from '../sitemapState'

const stateRef = ref<SitemapState>(defaultState())

vi.mock('@vueuse/core', async () => {
  const actual = await vi.importActual<typeof import('@vueuse/core')>('@vueuse/core')
  return {
    ...actual,
    useStorage: () => stateRef,
  }
})

vi.mock('../sitemapXml', () => ({
  buildUrlset: () => '<urlset />',
  buildSitemapIndex: () => '<sitemapindex />',
}))

describe('SitemapXmlGenerator', () => {
  beforeEach(() => {
    stateRef.value = defaultState()
  })

  it('applies presets and updates output', async () => {
    const wrapper = mount(SitemapXmlGenerator, {
      global: {
        stubs: {
          SitemapPresetsSection: {
            template: `
              <div>
                <button data-testid="preset-basic" @click="$emit('apply', 'basic')" />
                <button data-testid="preset-image" @click="$emit('apply', 'image')" />
                <button data-testid="preset-video" @click="$emit('apply', 'video')" />
                <button data-testid="preset-news" @click="$emit('apply', 'news')" />
                <button data-testid="preset-index" @click="$emit('apply', 'index')" />
                <button data-testid="preset-unknown" @click="$emit('apply', 'unexpected')" />
              </div>
            `,
          },
          SitemapSettingsSection: {
            props: ['baseUrl', 'autoJoin'],
            emits: ['update:baseUrl', 'update:autoJoin'],
            template: `
              <div>
                <button data-testid="set-base-url" @click="$emit('update:baseUrl', 'https://docs.example.com')" />
                <button data-testid="set-auto-join" @click="$emit('update:autoJoin', false)" />
              </div>
            `,
          },
          SitemapEntriesTabs: {
            props: ['mode', 'urls', 'sitemaps'],
            emits: ['update:mode', 'update:urls', 'update:sitemaps'],
            template: `
              <div>
                <button data-testid="set-mode-urlset" @click="$emit('update:mode', 'urlset')" />
                <button data-testid="set-urls" @click="$emit('update:urls', [{ id: 'url-custom', loc: '/custom', lastmod: '', changefreq: null, priority: null, images: [], videos: [], news: [] }])" />
                <button data-testid="set-sitemaps" @click="$emit('update:sitemaps', [{ id: 'map-custom', loc: '/sitemap-custom.xml', lastmod: '' }])" />
              </div>
            `,
          },
          SitemapOutputSection: {
            props: ['mode', 'xmlContent'],
            template: '<div data-testid="output" :data-mode="mode">{{ xmlContent }}</div>',
          },
        },
      },
    })

    await wrapper.get('[data-testid="preset-basic"]').trigger('click')
    expect(stateRef.value.mode).toBe('urlset')
    expect(stateRef.value.urls).toHaveLength(2)
    expect(wrapper.get('[data-testid="output"]').text()).toBe('<urlset />')

    await wrapper.get('[data-testid="preset-image"]').trigger('click')
    expect(stateRef.value.urls[0]?.images.length).toBe(1)

    await wrapper.get('[data-testid="preset-video"]').trigger('click')
    expect(stateRef.value.urls[0]?.videos.length).toBe(1)

    await wrapper.get('[data-testid="preset-news"]').trigger('click')
    expect(stateRef.value.urls[0]?.news.length).toBe(1)

    await wrapper.get('[data-testid="preset-index"]').trigger('click')
    expect(stateRef.value.mode).toBe('sitemapindex')
    expect(stateRef.value.sitemaps).toHaveLength(2)
    expect(wrapper.get('[data-testid="output"]').text()).toBe('<sitemapindex />')

    await wrapper.get('[data-testid="set-base-url"]').trigger('click')
    await wrapper.get('[data-testid="set-auto-join"]').trigger('click')
    await wrapper.get('[data-testid="set-mode-urlset"]').trigger('click')
    await wrapper.get('[data-testid="set-urls"]').trigger('click')
    await wrapper.get('[data-testid="set-sitemaps"]').trigger('click')

    expect(stateRef.value.baseUrl).toBe('https://docs.example.com')
    expect(stateRef.value.autoJoin).toBe(false)
    expect(stateRef.value.mode).toBe('urlset')
    expect(stateRef.value.urls[0]?.loc).toBe('/custom')
    expect(stateRef.value.sitemaps[0]?.loc).toBe('/sitemap-custom.xml')
    expect(wrapper.get('[data-testid="output"]').text()).toBe('<urlset />')

    const snapshot = JSON.stringify(stateRef.value)
    await wrapper.get('[data-testid="preset-unknown"]').trigger('click')
    expect(JSON.stringify(stateRef.value)).toBe(snapshot)
  })
})
