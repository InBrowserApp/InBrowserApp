<template>
  <ToolSectionHeader>
    <n-icon :component="Desktop16Regular" style="vertical-align: -0.15em" />
    {{ t('title') }}
  </ToolSectionHeader>
  <n-grid x-gap="30" y-gap="20" :cols="5" item-responsive responsive="screen">
    <n-grid-item span="5 s:2">
      <DesktopBrowserPreview
        :image="image"
        :options="options"
        :general-info-options="generalInfoOptions"
      />
    </n-grid-item>
    <n-grid-item span="5 s:3">
      <DesktopBrowserSettings :image="image" :options="options" />
    </n-grid-item>
  </n-grid>
</template>

<script setup lang="ts">
import { NGrid, NGridItem, NIcon } from 'naive-ui'
import type { DesktopBrowserOptions } from '../../utils/favicon-generator/desktop-browser'
import DesktopBrowserPreview from './DesktopBrowserPreview.vue'
import type { GeneralInfoOptions } from '../../utils/favicon-generator/general-info'
import DesktopBrowserSettings from './DesktopBrowserSettings.vue'
import Desktop16Regular from '@vicons/fluent/Desktop16Regular'
import { useI18n } from 'vue-i18n'
import { ToolSectionHeader } from '@shared/ui/tool'

defineProps<{
  image: Blob | undefined
  generalInfoOptions: GeneralInfoOptions
}>()

const { t } = useI18n()

const options = defineModel<DesktopBrowserOptions>('options', { required: true })
</script>

<i18n lang="json">
{
  "en": {
    "title": "Desktop Browser & Google Result"
  },
  "zh": {
    "title": "桌面浏览器和谷歌搜索结果"
  },
  "zh-CN": {
    "title": "桌面浏览器和谷歌搜索结果"
  },
  "zh-TW": {
    "title": "桌面瀏覽器和谷歌搜索結果"
  },
  "zh-HK": {
    "title": "桌面瀏覽器和谷歌搜索結果"
  },
  "es": {
    "title": "Navegador de Escritorio y Resultados de Google"
  },
  "fr": {
    "title": "Navigateur de Bureau et Résultats Google"
  },
  "de": {
    "title": "Desktop-Browser und Google-Ergebnisse"
  },
  "it": {
    "title": "Browser Desktop e Risultati Google"
  },
  "ja": {
    "title": "デスクトップブラウザとGoogle検索結果"
  },
  "ko": {
    "title": "데스크톱 브라우저 및 Google 검색 결과"
  },
  "ru": {
    "title": "Браузер для ПК и результаты Google"
  },
  "pt": {
    "title": "Navegador Desktop e Resultados do Google"
  },
  "ar": {
    "title": "متصفح سطح المكتب ونتائج جوجل"
  },
  "hi": {
    "title": "डेस्कटॉप ब्राउ़र और Google परिणाम"
  },
  "tr": {
    "title": "Masaüstü Tarayıcı ve Google Sonuçları"
  },
  "nl": {
    "title": "Desktopbrowser en Google-resultaten"
  },
  "sv": {
    "title": "Skrivbordswebbläsare och Google-resultat"
  },
  "pl": {
    "title": "Przeglądarka komputerowa i wyniki Google"
  },
  "vi": {
    "title": "Trình duyệt máy tính và kết quả Google"
  },
  "th": {
    "title": "เบราว์เซอร์เดสก์ท็อปและผลการค้นหาของ Google"
  },
  "id": {
    "title": "Browser Desktop dan Hasil Google"
  },
  "he": {
    "title": "דפדפן שולחן עבודה ותוצאות Google"
  },
  "ms": {
    "title": "Pelayar Desktop dan Hasil Google"
  },
  "no": {
    "title": "Skrivebordsnettleser og Google-resultater"
  }
}
</i18n>
