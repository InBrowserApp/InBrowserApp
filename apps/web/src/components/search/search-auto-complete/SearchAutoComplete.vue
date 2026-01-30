<template>
  <n-auto-complete
    v-model:value="query"
    :input-props="{
      autocomplete: 'disabled',
    }"
    :loading="loading"
    :options="options"
    :placeholder="t('searchPlaceholder')"
    clear-after-select
    :render-label="renderLabel"
    :menu-props="{ class: 'page-search-auto-complete-menu' }"
    role="search"
    @select="handleSearch"
  />
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import type { VNodeChild } from 'vue'
import { NAutoComplete, type AutoCompleteOption } from 'naive-ui'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useSearchResults, renderSearchResultLabel, type SearchResult } from './useSearchResults'
import { getLocaleFromPath } from '@shared/locale'
import {
  useSearchAction,
  renderSearchActionLabel,
  type SearchActionOption,
} from './useSearchAction'

const router = useRouter()
const { t } = useI18n()

const { query, loading, searchResults } = useSearchResults()

type CustomAutoCompleteOption = SearchActionOption | SearchResult

const { searchActionOption } = useSearchAction(query)

const options = computed<AutoCompleteOption[]>(() => {
  return [searchActionOption.value, ...searchResults.value]
})

const renderLabel = (option: CustomAutoCompleteOption): VNodeChild => {
  if (option.action === 'search') {
    return renderSearchActionLabel(option)
  }

  if (option.action === 'tool') {
    return renderSearchResultLabel(option)
  }
}

const handleSearch = (value?: string | number): void => {
  // if value not string, return
  if (typeof value == 'string') {
    const locale = getLocaleFromPath()

    if (value.startsWith('search:')) {
      const basePath = router.resolve({
        name: 'search-tools',
        query: {
          query: value.substring('search:'.length),
        },
      }).fullPath

      if (locale) {
        const localizedPath = `/${locale}${basePath}`
        router.push(localizedPath)
      } else {
        router.push(basePath)
      }

      return
    }

    if (value.startsWith('tool:')) {
      const info = searchResults.value.find((result) => result.value === value)?.info
      if (!info) {
        throw new Error('Tool not found')
      }

      const basePath = info.path
      if (basePath.startsWith('http://') || basePath.startsWith('https://')) {
        window.open(basePath, '_blank', 'noopener,noreferrer')
        return
      }

      if (locale) {
        const localizedPath = `/${locale}${basePath}`
        router.push(localizedPath)
      } else {
        router.push(basePath)
      }

      return
    }
  }
}
</script>

<i18n lang="json">
{
  "en": {
    "searchPlaceholder": "Search for tools..."
  },
  "zh": {
    "searchPlaceholder": "搜索工具..."
  },
  "zh-CN": {
    "searchPlaceholder": "搜索工具..."
  },
  "zh-TW": {
    "searchPlaceholder": "搜尋工具..."
  },
  "zh-HK": {
    "searchPlaceholder": "搜尋工具..."
  },
  "es": {
    "searchPlaceholder": "Buscar herramientas..."
  },
  "fr": {
    "searchPlaceholder": "Rechercher des outils..."
  },
  "de": {
    "searchPlaceholder": "Tools suchen..."
  },
  "it": {
    "searchPlaceholder": "Cerca strumenti..."
  },
  "ja": {
    "searchPlaceholder": "ツールを検索..."
  },
  "ko": {
    "searchPlaceholder": "도구 검색..."
  },
  "ru": {
    "searchPlaceholder": "Поиск инструментов..."
  },
  "pt": {
    "searchPlaceholder": "Pesquisar ferramentas..."
  },
  "ar": {
    "searchPlaceholder": "البحث عن الأدوات..."
  },
  "hi": {
    "searchPlaceholder": "उपकरण खोजें..."
  },
  "tr": {
    "searchPlaceholder": "Araçları ara..."
  },
  "nl": {
    "searchPlaceholder": "Zoek naar tools..."
  },
  "sv": {
    "searchPlaceholder": "Sök verktyg..."
  },
  "pl": {
    "searchPlaceholder": "Szukaj narzędzi..."
  },
  "vi": {
    "searchPlaceholder": "Tìm kiếm công cụ..."
  },
  "th": {
    "searchPlaceholder": "ค้นหาเครื่องมือ..."
  },
  "id": {
    "searchPlaceholder": "Cari alat..."
  },
  "he": {
    "searchPlaceholder": "חפש כלים..."
  },
  "ms": {
    "searchPlaceholder": "Cari alat..."
  },
  "no": {
    "searchPlaceholder": "Søk etter verktøy..."
  }
}
</i18n>

<style>
.page-search-auto-complete-menu .n-base-select-option__content {
  width: 100%;
}

.page-search-auto-complete-menu.n-base-select-menu
  .n-base-select-option.n-base-select-option--show-checkmark {
  padding-right: calc(var(--n-option-padding-right) + 3px);
}
</style>
