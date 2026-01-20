<template>
  <custom-router-link
    :to="{
      name: 'search-tools',
      query: {
        query: query,
      },
    }"
    class="link"
  >
    <div class="search-entry">
      <n-icon class="search-icon">
        <Search16Filled />
      </n-icon>
      <span>{{ t('searchQuery', { query }) }}</span>
    </div>
  </custom-router-link>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { NIcon } from 'naive-ui'
import Search16Filled from '@vicons/fluent/Search16Filled'
import { CustomRouterLink } from '@shared/ui/base'

const { t } = useI18n()

defineProps<{
  query: string
}>()
</script>

<i18n lang="json">
{
  "en": {
    "searchQuery": "Search {query}"
  },
  "zh": {
    "searchQuery": "搜索 {query}"
  },
  "zh-CN": {
    "searchQuery": "搜索 {query}"
  },
  "zh-TW": {
    "searchQuery": "搜尋 {query}"
  },
  "zh-HK": {
    "searchQuery": "搜尋 {query}"
  },
  "es": {
    "searchQuery": "Buscar {query}"
  },
  "fr": {
    "searchQuery": "Rechercher {query}"
  },
  "de": {
    "searchQuery": "Suchen {query}"
  },
  "it": {
    "searchQuery": "Cerca {query}"
  },
  "ja": {
    "searchQuery": "検索 {query}"
  },
  "ko": {
    "searchQuery": "검색 {query}"
  },
  "ru": {
    "searchQuery": "Поиск {query}"
  },
  "pt": {
    "searchQuery": "Pesquisar {query}"
  },
  "ar": {
    "searchQuery": "بحث {query}"
  },
  "hi": {
    "searchQuery": "खोजें {query}"
  },
  "tr": {
    "searchQuery": "Ara {query}"
  },
  "nl": {
    "searchQuery": "Zoeken {query}"
  },
  "sv": {
    "searchQuery": "Sök {query}"
  },
  "pl": {
    "searchQuery": "Szukaj {query}"
  },
  "vi": {
    "searchQuery": "Tìm kiếm {query}"
  },
  "th": {
    "searchQuery": "ค้นหา {query}"
  },
  "id": {
    "searchQuery": "Cari {query}"
  },
  "he": {
    "searchQuery": "חיפוש {query}"
  },
  "ms": {
    "searchQuery": "Cari {query}"
  },
  "no": {
    "searchQuery": "Søk {query}"
  }
}
</i18n>

<style scoped>
.search-icon {
  margin-right: 0.3em;
  vertical-align: -0.15em;
}

.search-entry {
  width: 100%;
  padding-top: 0.5em;
  padding-bottom: 0.5em;
}

.link {
  all: unset;
  cursor: pointer;
}
</style>
