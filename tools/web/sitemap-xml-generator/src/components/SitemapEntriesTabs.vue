<template>
  <n-tabs v-model:value="mode" type="line" animated>
    <n-tab-pane name="urlset" :tab="t('modeUrlset')">
      <SitemapUrlsetEntries v-model:urls="urls" />
    </n-tab-pane>
    <n-tab-pane name="sitemapindex" :tab="t('modeSitemapIndex')">
      <SitemapIndexEntries v-model:sitemaps="sitemaps" />
    </n-tab-pane>
  </n-tabs>
</template>

<script setup lang="ts">
import { NTabPane, NTabs } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import type { Mode, SitemapEntry, UrlEntry } from '../sitemapState'
import SitemapIndexEntries from './SitemapIndexEntries.vue'
import SitemapUrlsetEntries from './SitemapUrlsetEntries.vue'

const mode = defineModel<Mode>('mode', { required: true })
const urls = defineModel<UrlEntry[]>('urls', { required: true })
const sitemaps = defineModel<SitemapEntry[]>('sitemaps', { required: true })

const { t } = useI18n()
</script>

<i18n lang="json">
{
  "en": {
    "modeUrlset": "URL set",
    "modeSitemapIndex": "Sitemap index"
  },
  "zh": {
    "modeUrlset": "URL 集合",
    "modeSitemapIndex": "Sitemap 索引"
  },
  "zh-CN": {
    "modeUrlset": "URL 集合",
    "modeSitemapIndex": "Sitemap 索引"
  },
  "zh-TW": {
    "modeUrlset": "URL 集合",
    "modeSitemapIndex": "Sitemap 索引"
  },
  "zh-HK": {
    "modeUrlset": "URL 集合",
    "modeSitemapIndex": "Sitemap 索引"
  },
  "es": {
    "modeUrlset": "Conjunto de URL",
    "modeSitemapIndex": "Índice de sitemaps"
  },
  "fr": {
    "modeUrlset": "Ensemble d'URL",
    "modeSitemapIndex": "Index de sitemaps"
  },
  "de": {
    "modeUrlset": "URL-Satz",
    "modeSitemapIndex": "Sitemap-Index"
  },
  "it": {
    "modeUrlset": "Set di URL",
    "modeSitemapIndex": "Indice sitemap"
  },
  "ja": {
    "modeUrlset": "URL セット",
    "modeSitemapIndex": "サイトマップインデックス"
  },
  "ko": {
    "modeUrlset": "URL 세트",
    "modeSitemapIndex": "사이트맵 인덱스"
  },
  "ru": {
    "modeUrlset": "Набор URL",
    "modeSitemapIndex": "Индекс sitemap"
  },
  "pt": {
    "modeUrlset": "Conjunto de URL",
    "modeSitemapIndex": "Índice de sitemaps"
  },
  "ar": {
    "modeUrlset": "مجموعة عناوين URL",
    "modeSitemapIndex": "فهرس sitemap"
  },
  "hi": {
    "modeUrlset": "URL सेट",
    "modeSitemapIndex": "Sitemap इंडेक्स"
  },
  "tr": {
    "modeUrlset": "URL seti",
    "modeSitemapIndex": "Sitemap dizini"
  },
  "nl": {
    "modeUrlset": "URL-set",
    "modeSitemapIndex": "Sitemapindex"
  },
  "sv": {
    "modeUrlset": "URL-uppsättning",
    "modeSitemapIndex": "Sitemapindex"
  },
  "pl": {
    "modeUrlset": "Zestaw URL",
    "modeSitemapIndex": "Indeks sitemap"
  },
  "vi": {
    "modeUrlset": "Bộ URL",
    "modeSitemapIndex": "Chỉ mục sitemap"
  },
  "th": {
    "modeUrlset": "ชุด URL",
    "modeSitemapIndex": "ดัชนี sitemap"
  },
  "id": {
    "modeUrlset": "Set URL",
    "modeSitemapIndex": "Indeks sitemap"
  },
  "he": {
    "modeUrlset": "סט URL",
    "modeSitemapIndex": "אינדקס sitemap"
  },
  "ms": {
    "modeUrlset": "Set URL",
    "modeSitemapIndex": "Indeks sitemap"
  },
  "no": {
    "modeUrlset": "URL-sett",
    "modeSitemapIndex": "Sitemapindeks"
  }
}
</i18n>
