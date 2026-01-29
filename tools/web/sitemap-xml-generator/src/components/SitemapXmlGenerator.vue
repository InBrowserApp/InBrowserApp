<template>
  <div>
    <SitemapPresetsSection @apply="applyPreset" />
    <SitemapSettingsSection v-model:base-url="state.baseUrl" v-model:auto-join="state.autoJoin" />
    <SitemapEntriesTabs
      v-model:mode="state.mode"
      v-model:urls="state.urls"
      v-model:sitemaps="state.sitemaps"
    />
    <SitemapOutputSection :mode="state.mode" :xml-content="xmlContent" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useStorage } from '@vueuse/core'
import { buildSitemapIndex, buildUrlset } from '../sitemapXml'
import { createSitemapEntry, createUrlEntry, defaultState } from '../sitemapState'
import type { SitemapState } from '../sitemapState'
import SitemapEntriesTabs from './SitemapEntriesTabs.vue'
import SitemapOutputSection from './SitemapOutputSection.vue'
import SitemapPresetsSection from './SitemapPresetsSection.vue'
import SitemapSettingsSection from './SitemapSettingsSection.vue'

type PresetKey = 'basic' | 'image' | 'video' | 'news' | 'index'

const state = useStorage<SitemapState>('tools:sitemap-xml-generator:state', defaultState())

const applyPreset = (preset: PresetKey) => {
  const baseUrl = 'https://example.com'
  switch (preset) {
    case 'basic':
      state.value.mode = 'urlset'
      state.value.baseUrl = baseUrl
      state.value.autoJoin = true
      state.value.urls = [
        createUrlEntry({
          loc: '/',
          lastmod: '2024-01-15',
          changefreq: 'weekly',
          priority: 1,
        }),
        createUrlEntry({
          loc: '/about',
          lastmod: '2024-01-10',
          changefreq: 'monthly',
          priority: 0.6,
        }),
      ]
      break
    case 'image':
      state.value.mode = 'urlset'
      state.value.baseUrl = baseUrl
      state.value.autoJoin = true
      state.value.urls = [
        createUrlEntry({
          loc: '/gallery',
          images: [
            {
              loc: '/images/hero.jpg',
              title: 'Hero image',
              caption: 'Homepage hero',
              license: 'https://example.com/license',
            },
          ],
        }),
      ]
      break
    case 'video':
      state.value.mode = 'urlset'
      state.value.baseUrl = baseUrl
      state.value.autoJoin = true
      state.value.urls = [
        createUrlEntry({
          loc: '/videos/intro',
          videos: [
            {
              thumbnailLoc: '/images/video-thumb.jpg',
              title: 'Intro video',
              description: 'Intro to our product',
              contentLoc: 'https://example.com/videos/intro.mp4',
              playerLoc: '',
              duration: 120,
              publicationDate: '2024-01-20',
            },
          ],
        }),
      ]
      break
    case 'news':
      state.value.mode = 'urlset'
      state.value.baseUrl = baseUrl
      state.value.autoJoin = true
      state.value.urls = [
        createUrlEntry({
          loc: '/news/launch',
          news: [
            {
              publicationName: 'Example News',
              publicationLanguage: 'en',
              title: 'Product launch',
              publicationDate: '2024-01-25',
              keywords: 'launch, product',
            },
          ],
        }),
      ]
      break
    case 'index':
      state.value.mode = 'sitemapindex'
      state.value.baseUrl = baseUrl
      state.value.autoJoin = true
      state.value.sitemaps = [
        createSitemapEntry({
          loc: '/sitemap-1.xml',
          lastmod: '2024-01-15',
        }),
        createSitemapEntry({
          loc: '/sitemap-2.xml',
          lastmod: '2024-01-18',
        }),
      ]
      break
    default:
      break
  }
}

const xmlContent = computed(() =>
  state.value.mode === 'urlset' ? buildUrlset(state.value) : buildSitemapIndex(state.value),
)
</script>

<i18n lang="json">
{
  "en": {},
  "zh": {},
  "zh-CN": {},
  "zh-TW": {},
  "zh-HK": {},
  "es": {},
  "fr": {},
  "de": {},
  "it": {},
  "ja": {},
  "ko": {},
  "ru": {},
  "pt": {},
  "ar": {},
  "hi": {},
  "tr": {},
  "nl": {},
  "sv": {},
  "pl": {},
  "vi": {},
  "th": {},
  "id": {},
  "he": {},
  "ms": {},
  "no": {}
}
</i18n>
