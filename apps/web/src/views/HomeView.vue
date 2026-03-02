<template>
  <AirplaneModeEnabledAlert />

  <section class="home-purpose" aria-labelledby="home-purpose-title">
    <h1 id="home-purpose-title" class="home-purpose-title">
      {{ t('purpose-title') }}
    </h1>
    <p class="home-purpose-description">
      {{ t('purpose-description') }}
    </p>
    <ul class="home-purpose-list">
      <li>{{ t('purpose-no-login') }}</li>
      <li>{{ t('purpose-private') }}</li>
      <li>{{ t('purpose-offline') }}</li>
      <li>{{ t('purpose-tools-count', { count: tools.length }) }}</li>
    </ul>
  </section>

  <ToolSectionHeader>
    {{ t('search-tools') }}
  </ToolSectionHeader>
  <SearchAutoComplete />

  <ToolSectionHeader>
    {{ t('all-tools') }}
  </ToolSectionHeader>

  <ToolSection>
    <ToolsGrid :tools="tools" />
  </ToolSection>

  <TheDeveloperSay />
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import TheDeveloperSay from '../components/miscellaneous/the-developer-says/TheDeveloperSay.vue'
import { useHead } from '@unhead/vue'
import { ToolsGrid, ToolSectionHeader, ToolSection } from '@shared/ui/tool'
import { tools } from '@registry/tools/main'
import SearchAutoComplete from '../components/search/search-auto-complete/SearchAutoComplete.vue'
import { AirplaneModeEnabledAlert } from '@shared/ui/tool'

const { t } = useI18n()

useHead({
  title: 'InBrowser.App',
})
</script>

<style scoped>
.home-purpose {
  margin-bottom: 28px;
  padding: 20px 24px;
  border: 1px solid rgba(24, 160, 88, 0.26);
  border-radius: 16px;
  background: linear-gradient(135deg, rgba(24, 160, 88, 0.13), rgba(24, 160, 88, 0.04));
}

.home-purpose-title {
  margin: 0;
  font-size: clamp(1.6rem, 3vw, 2rem);
  line-height: 1.2;
}

.home-purpose-description {
  margin: 12px 0 0;
  line-height: 1.6;
  font-size: 1rem;
}

.home-purpose-list {
  margin: 14px 0 0;
  padding-left: 20px;
  line-height: 1.7;
}

@media (max-width: 640px) {
  .home-purpose {
    padding: 16px;
  }
}
</style>

<i18n lang="json">
{
  "en": {
    "purpose-title": "What Is InBrowser.App?",
    "purpose-description": "A collection of practical tools that run directly in your browser for file conversion, text processing, image editing, and more.",
    "purpose-no-login": "No account needed, open and use instantly.",
    "purpose-private": "Your data is processed locally in your browser.",
    "purpose-offline": "Most tools still work offline after the first load.",
    "purpose-tools-count": "{count} tools are ready to use right now.",
    "search-tools": "Search Tools",
    "all-tools": "All Tools"
  },
  "zh": {
    "purpose-title": "InBrowser.App 是什么？",
    "purpose-description": "这是一个浏览器内工具集合，用来做文件转换、文本处理、图片编辑等常见任务。",
    "purpose-no-login": "免登录，打开即可使用。",
    "purpose-private": "数据优先在你的浏览器本地处理。",
    "purpose-offline": "大多数工具首次加载后可离线使用。",
    "purpose-tools-count": "现在已有 {count} 个工具可直接使用。",
    "search-tools": "搜索工具",
    "all-tools": "所有工具"
  },
  "zh-CN": {
    "purpose-title": "InBrowser.App 是什么？",
    "purpose-description": "这是一个浏览器内工具集合，用来做文件转换、文本处理、图片编辑等常见任务。",
    "purpose-no-login": "免登录，打开即可使用。",
    "purpose-private": "数据优先在你的浏览器本地处理。",
    "purpose-offline": "大多数工具首次加载后可离线使用。",
    "purpose-tools-count": "现在已有 {count} 个工具可直接使用。",
    "search-tools": "搜索工具",
    "all-tools": "所有工具"
  },
  "zh-TW": {
    "purpose-title": "InBrowser.App 是什麼？",
    "purpose-description": "這是一個瀏覽器內工具集合，用來做檔案轉換、文字處理、圖片編輯等常見任務。",
    "purpose-no-login": "免登入，開啟即可使用。",
    "purpose-private": "資料優先在你的瀏覽器本地處理。",
    "purpose-offline": "多數工具首次載入後可離線使用。",
    "purpose-tools-count": "現在已有 {count} 個工具可直接使用。",
    "search-tools": "搜尋工具",
    "all-tools": "所有工具"
  },
  "zh-HK": {
    "purpose-title": "InBrowser.App 是什麼？",
    "purpose-description": "這是一個瀏覽器內工具集合，用來做檔案轉換、文字處理、圖片編輯等常見任務。",
    "purpose-no-login": "免登入，開啟即可使用。",
    "purpose-private": "資料優先在你的瀏覽器本地處理。",
    "purpose-offline": "多數工具首次載入後可離線使用。",
    "purpose-tools-count": "現在已有 {count} 個工具可直接使用。",
    "search-tools": "搜尋工具",
    "all-tools": "所有工具"
  },
  "es": {
    "purpose-title": "What Is InBrowser.App?",
    "purpose-description": "A collection of practical tools that run directly in your browser for file conversion, text processing, image editing, and more.",
    "purpose-no-login": "No account needed, open and use instantly.",
    "purpose-private": "Your data is processed locally in your browser.",
    "purpose-offline": "Most tools still work offline after the first load.",
    "purpose-tools-count": "{count} tools are ready to use right now.",
    "search-tools": "Buscar herramientas",
    "all-tools": "Todas las herramientas"
  },
  "fr": {
    "purpose-title": "What Is InBrowser.App?",
    "purpose-description": "A collection of practical tools that run directly in your browser for file conversion, text processing, image editing, and more.",
    "purpose-no-login": "No account needed, open and use instantly.",
    "purpose-private": "Your data is processed locally in your browser.",
    "purpose-offline": "Most tools still work offline after the first load.",
    "purpose-tools-count": "{count} tools are ready to use right now.",
    "search-tools": "Rechercher des outils",
    "all-tools": "Tous les outils"
  },
  "de": {
    "purpose-title": "What Is InBrowser.App?",
    "purpose-description": "A collection of practical tools that run directly in your browser for file conversion, text processing, image editing, and more.",
    "purpose-no-login": "No account needed, open and use instantly.",
    "purpose-private": "Your data is processed locally in your browser.",
    "purpose-offline": "Most tools still work offline after the first load.",
    "purpose-tools-count": "{count} tools are ready to use right now.",
    "search-tools": "Werkzeuge suchen",
    "all-tools": "Alle Werkzeuge"
  },
  "it": {
    "purpose-title": "What Is InBrowser.App?",
    "purpose-description": "A collection of practical tools that run directly in your browser for file conversion, text processing, image editing, and more.",
    "purpose-no-login": "No account needed, open and use instantly.",
    "purpose-private": "Your data is processed locally in your browser.",
    "purpose-offline": "Most tools still work offline after the first load.",
    "purpose-tools-count": "{count} tools are ready to use right now.",
    "search-tools": "Cerca strumenti",
    "all-tools": "Tutti gli strumenti"
  },
  "ja": {
    "purpose-title": "What Is InBrowser.App?",
    "purpose-description": "A collection of practical tools that run directly in your browser for file conversion, text processing, image editing, and more.",
    "purpose-no-login": "No account needed, open and use instantly.",
    "purpose-private": "Your data is processed locally in your browser.",
    "purpose-offline": "Most tools still work offline after the first load.",
    "purpose-tools-count": "{count} tools are ready to use right now.",
    "search-tools": "ツール検索",
    "all-tools": "すべてのツール"
  },
  "ko": {
    "purpose-title": "What Is InBrowser.App?",
    "purpose-description": "A collection of practical tools that run directly in your browser for file conversion, text processing, image editing, and more.",
    "purpose-no-login": "No account needed, open and use instantly.",
    "purpose-private": "Your data is processed locally in your browser.",
    "purpose-offline": "Most tools still work offline after the first load.",
    "purpose-tools-count": "{count} tools are ready to use right now.",
    "search-tools": "도구 검색",
    "all-tools": "모든 도구"
  },
  "ru": {
    "purpose-title": "What Is InBrowser.App?",
    "purpose-description": "A collection of practical tools that run directly in your browser for file conversion, text processing, image editing, and more.",
    "purpose-no-login": "No account needed, open and use instantly.",
    "purpose-private": "Your data is processed locally in your browser.",
    "purpose-offline": "Most tools still work offline after the first load.",
    "purpose-tools-count": "{count} tools are ready to use right now.",
    "search-tools": "Поиск инструментов",
    "all-tools": "Все инструменты"
  },
  "pt": {
    "purpose-title": "What Is InBrowser.App?",
    "purpose-description": "A collection of practical tools that run directly in your browser for file conversion, text processing, image editing, and more.",
    "purpose-no-login": "No account needed, open and use instantly.",
    "purpose-private": "Your data is processed locally in your browser.",
    "purpose-offline": "Most tools still work offline after the first load.",
    "purpose-tools-count": "{count} tools are ready to use right now.",
    "search-tools": "Pesquisar ferramentas",
    "all-tools": "Todas as ferramentas"
  },
  "ar": {
    "purpose-title": "What Is InBrowser.App?",
    "purpose-description": "A collection of practical tools that run directly in your browser for file conversion, text processing, image editing, and more.",
    "purpose-no-login": "No account needed, open and use instantly.",
    "purpose-private": "Your data is processed locally in your browser.",
    "purpose-offline": "Most tools still work offline after the first load.",
    "purpose-tools-count": "{count} tools are ready to use right now.",
    "search-tools": "البحث عن الأدوات",
    "all-tools": "جميع الأدوات"
  },
  "hi": {
    "purpose-title": "What Is InBrowser.App?",
    "purpose-description": "A collection of practical tools that run directly in your browser for file conversion, text processing, image editing, and more.",
    "purpose-no-login": "No account needed, open and use instantly.",
    "purpose-private": "Your data is processed locally in your browser.",
    "purpose-offline": "Most tools still work offline after the first load.",
    "purpose-tools-count": "{count} tools are ready to use right now.",
    "search-tools": "उपकरण खोजें",
    "all-tools": "सभी उपकरण"
  },
  "tr": {
    "purpose-title": "What Is InBrowser.App?",
    "purpose-description": "A collection of practical tools that run directly in your browser for file conversion, text processing, image editing, and more.",
    "purpose-no-login": "No account needed, open and use instantly.",
    "purpose-private": "Your data is processed locally in your browser.",
    "purpose-offline": "Most tools still work offline after the first load.",
    "purpose-tools-count": "{count} tools are ready to use right now.",
    "search-tools": "Araçları Ara",
    "all-tools": "Tüm Araçlar"
  },
  "nl": {
    "purpose-title": "What Is InBrowser.App?",
    "purpose-description": "A collection of practical tools that run directly in your browser for file conversion, text processing, image editing, and more.",
    "purpose-no-login": "No account needed, open and use instantly.",
    "purpose-private": "Your data is processed locally in your browser.",
    "purpose-offline": "Most tools still work offline after the first load.",
    "purpose-tools-count": "{count} tools are ready to use right now.",
    "search-tools": "Zoek tools",
    "all-tools": "Alle tools"
  },
  "sv": {
    "purpose-title": "What Is InBrowser.App?",
    "purpose-description": "A collection of practical tools that run directly in your browser for file conversion, text processing, image editing, and more.",
    "purpose-no-login": "No account needed, open and use instantly.",
    "purpose-private": "Your data is processed locally in your browser.",
    "purpose-offline": "Most tools still work offline after the first load.",
    "purpose-tools-count": "{count} tools are ready to use right now.",
    "search-tools": "Sök verktyg",
    "all-tools": "Alla verktyg"
  },
  "pl": {
    "purpose-title": "What Is InBrowser.App?",
    "purpose-description": "A collection of practical tools that run directly in your browser for file conversion, text processing, image editing, and more.",
    "purpose-no-login": "No account needed, open and use instantly.",
    "purpose-private": "Your data is processed locally in your browser.",
    "purpose-offline": "Most tools still work offline after the first load.",
    "purpose-tools-count": "{count} tools are ready to use right now.",
    "search-tools": "Szukaj narzędzi",
    "all-tools": "Wszystkie narzędzia"
  },
  "vi": {
    "purpose-title": "What Is InBrowser.App?",
    "purpose-description": "A collection of practical tools that run directly in your browser for file conversion, text processing, image editing, and more.",
    "purpose-no-login": "No account needed, open and use instantly.",
    "purpose-private": "Your data is processed locally in your browser.",
    "purpose-offline": "Most tools still work offline after the first load.",
    "purpose-tools-count": "{count} tools are ready to use right now.",
    "search-tools": "Tìm kiếm công cụ",
    "all-tools": "Tất cả công cụ"
  },
  "th": {
    "purpose-title": "What Is InBrowser.App?",
    "purpose-description": "A collection of practical tools that run directly in your browser for file conversion, text processing, image editing, and more.",
    "purpose-no-login": "No account needed, open and use instantly.",
    "purpose-private": "Your data is processed locally in your browser.",
    "purpose-offline": "Most tools still work offline after the first load.",
    "purpose-tools-count": "{count} tools are ready to use right now.",
    "search-tools": "ค้นหาเครื่องมือ",
    "all-tools": "เครื่องมือทั้งหมด"
  },
  "id": {
    "purpose-title": "What Is InBrowser.App?",
    "purpose-description": "A collection of practical tools that run directly in your browser for file conversion, text processing, image editing, and more.",
    "purpose-no-login": "No account needed, open and use instantly.",
    "purpose-private": "Your data is processed locally in your browser.",
    "purpose-offline": "Most tools still work offline after the first load.",
    "purpose-tools-count": "{count} tools are ready to use right now.",
    "search-tools": "Cari Alat",
    "all-tools": "Semua Alat"
  },
  "he": {
    "purpose-title": "What Is InBrowser.App?",
    "purpose-description": "A collection of practical tools that run directly in your browser for file conversion, text processing, image editing, and more.",
    "purpose-no-login": "No account needed, open and use instantly.",
    "purpose-private": "Your data is processed locally in your browser.",
    "purpose-offline": "Most tools still work offline after the first load.",
    "purpose-tools-count": "{count} tools are ready to use right now.",
    "search-tools": "חפש כלים",
    "all-tools": "כל הכלים"
  },
  "ms": {
    "purpose-title": "What Is InBrowser.App?",
    "purpose-description": "A collection of practical tools that run directly in your browser for file conversion, text processing, image editing, and more.",
    "purpose-no-login": "No account needed, open and use instantly.",
    "purpose-private": "Your data is processed locally in your browser.",
    "purpose-offline": "Most tools still work offline after the first load.",
    "purpose-tools-count": "{count} tools are ready to use right now.",
    "search-tools": "Cari Alat",
    "all-tools": "Semua Alat"
  },
  "no": {
    "purpose-title": "What Is InBrowser.App?",
    "purpose-description": "A collection of practical tools that run directly in your browser for file conversion, text processing, image editing, and more.",
    "purpose-no-login": "No account needed, open and use instantly.",
    "purpose-private": "Your data is processed locally in your browser.",
    "purpose-offline": "Most tools still work offline after the first load.",
    "purpose-tools-count": "{count} tools are ready to use right now.",
    "search-tools": "Søk verktøy",
    "all-tools": "Alle verktøy"
  }
}
</i18n>
