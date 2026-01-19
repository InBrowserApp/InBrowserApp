<template>
  <n-h1 prefix="bar" align-text>{{ t('title', { query: searchQuery }) }}</n-h1>
  <n-p>
    <ToolsGrid :tools="toolsResults" />
  </n-p>
</template>

<script setup lang="ts">
import { NH1, NP } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import { useSearchTools } from '@registry/tools/search'
import { useHead } from '@unhead/vue'
import { ToolsGrid } from '@shared/ui/tool'

const route = useRoute()
const searchQuery = computed<string>(() => {
  const querys = route.query.query
  // if querys is an array, return the first item
  if (Array.isArray(querys)) {
    return querys[0] ?? ''
  }
  return querys ?? ''
})

const { t } = useI18n()

const { toolsResults } = useSearchTools(searchQuery)

useHead({
  title: searchQuery.value + ' - InBrowser.App',
  meta: [{ name: 'description', content: t('description', { query: searchQuery.value }) }],
})
</script>

<i18n lang="json">
{
  "en": {
    "title": "Search Tools - {query}",
    "description": "Search results for {query}"
  },
  "zh": {
    "title": "搜索工具 - {query}",
    "description": "“{query}”的搜索结果"
  },
  "zh-CN": {
    "title": "搜索工具 - {query}",
    "description": "“{query}”的搜索结果"
  },
  "zh-TW": {
    "title": "搜索工具 - {query}",
    "description": "「{query}」的搜尋結果"
  },
  "zh-HK": {
    "title": "搜索工具 - {query}",
    "description": "「{query}」的搜尋結果"
  },
  "es": {
    "title": "Buscar herramientas - {query}",
    "description": "Resultados de búsqueda para {query}"
  },
  "fr": {
    "title": "Rechercher des outils - {query}",
    "description": "Résultats de recherche pour {query}"
  },
  "de": {
    "title": "Werkzeuge suchen - {query}",
    "description": "Suchergebnisse für {query}"
  },
  "it": {
    "title": "Cerca strumenti - {query}",
    "description": "Risultati di ricerca per {query}"
  },
  "ja": {
    "title": "ツールを検索 - {query}",
    "description": "「{query}」の検索結果"
  },
  "ko": {
    "title": "도구 검색 - {query}",
    "description": "{query} 검색 결과"
  },
  "ru": {
    "title": "Поиск инструментов - {query}",
    "description": "Результаты поиска по запросу {query}"
  },
  "pt": {
    "title": "Pesquisar ferramentas - {query}",
    "description": "Resultados da pesquisa por {query}"
  },
  "ar": {
    "title": "البحث عن الأدوات - {query}",
    "description": "نتائج البحث عن {query}"
  },
  "hi": {
    "title": "उपकरण खोजें - {query}",
    "description": "{query} के लिए खोज परिणाम"
  },
  "tr": {
    "title": "Araçları ara - {query}",
    "description": "{query} için arama sonuçları"
  },
  "nl": {
    "title": "Zoek tools - {query}",
    "description": "Zoekresultaten voor {query}"
  },
  "sv": {
    "title": "Sök verktyg - {query}",
    "description": "Sökresultat för {query}"
  },
  "pl": {
    "title": "Szukaj narzędzi - {query}",
    "description": "Wyniki wyszukiwania dla {query}"
  },
  "vi": {
    "title": "Tìm kiếm công cụ - {query}",
    "description": "Kết quả tìm kiếm cho {query}"
  },
  "th": {
    "title": "ค้นหาอุปกรณ์ - {query}",
    "description": "ผลการค้นหาสำหรับ {query}"
  },
  "id": {
    "title": "Cari alat - {query}",
    "description": "Hasil pencarian untuk {query}"
  },
  "he": {
    "title": "חיפוש כלים - {query}",
    "description": "תוצאות חיפוש עבור {query}"
  },
  "ms": {
    "title": "Cari alat - {query}",
    "description": "Hasil carian untuk {query}"
  },
  "no": {
    "title": "Søk verktøy - {query}",
    "description": "Søkeresultater for {query}"
  }
}
</i18n>
