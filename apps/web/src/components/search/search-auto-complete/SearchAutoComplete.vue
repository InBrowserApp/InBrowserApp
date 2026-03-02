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
    @focus="warmup"
    @mouseenter="warmup"
    @touchstart="warmup"
    @select="handleSearch"
  >
    <template #empty>
      <n-empty size="small" :description="t('emptyDescription')" />
    </template>
  </n-auto-complete>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import type { VNodeChild } from 'vue'
import { NAutoComplete, NEmpty, type AutoCompleteOption } from 'naive-ui'
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

const { query, loading, searchResults, warmup } = useSearchResults()

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
        name: 'tools',
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
    "searchPlaceholder": "Search for tools...",
    "emptyDescription": "No tools found"
  },
  "zh": {
    "searchPlaceholder": "搜索工具...",
    "emptyDescription": "未找到工具"
  },
  "zh-CN": {
    "searchPlaceholder": "搜索工具...",
    "emptyDescription": "未找到工具"
  },
  "zh-TW": {
    "searchPlaceholder": "搜尋工具...",
    "emptyDescription": "找不到工具"
  },
  "zh-HK": {
    "searchPlaceholder": "搜尋工具...",
    "emptyDescription": "找不到工具"
  },
  "es": {
    "searchPlaceholder": "Buscar herramientas...",
    "emptyDescription": "No se encontraron herramientas"
  },
  "fr": {
    "searchPlaceholder": "Rechercher des outils...",
    "emptyDescription": "Aucun outil trouvé"
  },
  "de": {
    "searchPlaceholder": "Tools suchen...",
    "emptyDescription": "Keine Werkzeuge gefunden"
  },
  "it": {
    "searchPlaceholder": "Cerca strumenti...",
    "emptyDescription": "Nessuno strumento trovato"
  },
  "ja": {
    "searchPlaceholder": "ツールを検索...",
    "emptyDescription": "ツールが見つかりません"
  },
  "ko": {
    "searchPlaceholder": "도구 검색...",
    "emptyDescription": "도구를 찾을 수 없습니다"
  },
  "ru": {
    "searchPlaceholder": "Поиск инструментов...",
    "emptyDescription": "Инструменты не найдены"
  },
  "pt": {
    "searchPlaceholder": "Pesquisar ferramentas...",
    "emptyDescription": "Nenhuma ferramenta encontrada"
  },
  "ar": {
    "searchPlaceholder": "البحث عن الأدوات...",
    "emptyDescription": "لم يتم العثور على أدوات"
  },
  "hi": {
    "searchPlaceholder": "उपकरण खोजें...",
    "emptyDescription": "कोई उपकरण नहीं मिला"
  },
  "tr": {
    "searchPlaceholder": "Araçları ara...",
    "emptyDescription": "Araç bulunamadı"
  },
  "nl": {
    "searchPlaceholder": "Zoek naar tools...",
    "emptyDescription": "Geen tools gevonden"
  },
  "sv": {
    "searchPlaceholder": "Sök verktyg...",
    "emptyDescription": "Inga verktyg hittades"
  },
  "pl": {
    "searchPlaceholder": "Szukaj narzędzi...",
    "emptyDescription": "Nie znaleziono narzędzi"
  },
  "vi": {
    "searchPlaceholder": "Tìm kiếm công cụ...",
    "emptyDescription": "Không tìm thấy công cụ"
  },
  "th": {
    "searchPlaceholder": "ค้นหาเครื่องมือ...",
    "emptyDescription": "ไม่พบเครื่องมือ"
  },
  "id": {
    "searchPlaceholder": "Cari alat...",
    "emptyDescription": "Tidak ada alat yang ditemukan"
  },
  "he": {
    "searchPlaceholder": "חפש כלים...",
    "emptyDescription": "לא נמצאו כלים"
  },
  "ms": {
    "searchPlaceholder": "Cari alat...",
    "emptyDescription": "Tiada alat ditemui"
  },
  "no": {
    "searchPlaceholder": "Søk etter verktøy...",
    "emptyDescription": "Ingen verktøy funnet"
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
