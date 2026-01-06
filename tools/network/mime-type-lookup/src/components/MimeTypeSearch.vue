<template>
  <NFlex vertical :size="16">
    <NInput v-model:value="search" :placeholder="t('searchPlaceholder')" clearable>
      <template #prefix>
        <NIcon :component="SearchIcon" />
      </template>
    </NInput>
    <NRadioGroup v-model:value="category">
      <NRadioButton value="all">{{ t('all') }}</NRadioButton>
      <NRadioButton v-for="category in categories" :key="category" :value="category">
        <CategoryIcon :category="category" style="margin-right: 4px; vertical-align: -0.15em" />
        <CategoryI18n :category="category" />
      </NRadioButton>
    </NRadioGroup>
  </NFlex>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { NFlex, NInput, NIcon, NRadioGroup, NRadioButton } from 'naive-ui'
import { Search20Regular as SearchIcon } from '@shared/icons/fluent'
import CategoryIcon from './CategoryIcon.vue'
import CategoryI18n from './CategoryI18n.vue'

const search = defineModel<string>('search', { required: true })
const category = defineModel<string>('category', { required: true })

const { t } = useI18n()

const categories = [
  'application',
  'audio',
  'font',
  'image',
  'message',
  'model',
  'multipart',
  'text',
  'video',
] as const
</script>

<i18n lang="json">
{
  "en": {
    "searchPlaceholder": "Search MIME types, extensions...",
    "all": "All"
  },
  "zh": {
    "searchPlaceholder": "搜索 MIME 类型、扩展名...",
    "all": "全部"
  },
  "zh-CN": {
    "searchPlaceholder": "搜索 MIME 类型、扩展名...",
    "all": "全部"
  },
  "zh-TW": {
    "searchPlaceholder": "搜尋 MIME 類型、副檔名...",
    "all": "全部"
  },
  "zh-HK": {
    "searchPlaceholder": "搜尋 MIME 類型、副檔名...",
    "all": "全部"
  },
  "es": {
    "searchPlaceholder": "Buscar tipos MIME, extensiones...",
    "all": "Todos"
  },
  "fr": {
    "searchPlaceholder": "Rechercher types MIME, extensions...",
    "all": "Tous"
  },
  "de": {
    "searchPlaceholder": "MIME-Typen, Erweiterungen suchen...",
    "all": "Alle"
  },
  "it": {
    "searchPlaceholder": "Cerca tipi MIME, estensioni...",
    "all": "Tutti"
  },
  "ja": {
    "searchPlaceholder": "MIME タイプ、拡張子を検索...",
    "all": "すべて"
  },
  "ko": {
    "searchPlaceholder": "MIME 유형, 확장자 검색...",
    "all": "전체"
  },
  "ru": {
    "searchPlaceholder": "Поиск типов MIME, расширений...",
    "all": "Все"
  },
  "pt": {
    "searchPlaceholder": "Pesquisar tipos MIME, extensoes...",
    "all": "Todos"
  },
  "ar": {
    "searchPlaceholder": "البحث عن انواع MIME والامتدادات...",
    "all": "الكل"
  },
  "hi": {
    "searchPlaceholder": "MIME प्रकार, एक्सटेंशन खोजें...",
    "all": "सभी"
  },
  "tr": {
    "searchPlaceholder": "MIME turleri, uzantilar ara...",
    "all": "Tumü"
  },
  "nl": {
    "searchPlaceholder": "Zoek MIME types, extensies...",
    "all": "Alle"
  },
  "sv": {
    "searchPlaceholder": "Sok MIME-typer, forlangningar...",
    "all": "Alla"
  },
  "pl": {
    "searchPlaceholder": "Szukaj typow MIME, rozszerzen...",
    "all": "Wszystkie"
  },
  "vi": {
    "searchPlaceholder": "Tim kiem loai MIME, phan mo rong...",
    "all": "Tat ca"
  },
  "th": {
    "searchPlaceholder": "ค้นหาประเภท MIME นามสกุล...",
    "all": "ทั้งหมด"
  },
  "id": {
    "searchPlaceholder": "Cari tipe MIME, ekstensi...",
    "all": "Semua"
  },
  "he": {
    "searchPlaceholder": "חפש סוגי MIME, הרחבות...",
    "all": "הכל"
  },
  "ms": {
    "searchPlaceholder": "Cari jenis MIME, sambungan...",
    "all": "Semua"
  },
  "no": {
    "searchPlaceholder": "Sok MIME-typer, filendelser...",
    "all": "Alle"
  }
}
</i18n>
