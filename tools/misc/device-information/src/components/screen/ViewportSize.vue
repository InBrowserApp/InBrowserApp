<template>
  <InfoStatistic :label="t('viewport-size')" :value="viewportSize" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useWindowSize } from '@vueuse/core'
import InfoStatistic from '../common/InfoStatistic.vue'

const { t } = useI18n()

const inner = useWindowSize({ type: 'inner' })
const viewportSize = computed(() => `${inner.width.value} × ${inner.height.value}`)
</script>

<i18n lang="json">
{
  "en": {
    "viewport-size": "Viewport Size"
  },
  "zh": {
    "viewport-size": "视口大小"
  },
  "zh-CN": {
    "viewport-size": "视口大小"
  },
  "zh-TW": {
    "viewport-size": "視口大小"
  },
  "zh-HK": {
    "viewport-size": "視口大小"
  },
  "es": {
    "viewport-size": "Tamaño del viewport"
  },
  "fr": {
    "viewport-size": "Taille de la fenêtre"
  },
  "de": {
    "viewport-size": "Viewport-Größe"
  },
  "it": {
    "viewport-size": "Dimensione del viewport"
  },
  "ja": {
    "viewport-size": "ビューポートサイズ"
  },
  "ko": {
    "viewport-size": "뷰포트 크기"
  },
  "ru": {
    "viewport-size": "Размер области просмотра"
  },
  "pt": {
    "viewport-size": "Tamanho da viewport"
  },
  "ar": {
    "viewport-size": "حجم منفذ العرض"
  },
  "hi": {
    "viewport-size": "व्यूपोर्ट का आकार"
  },
  "tr": {
    "viewport-size": "Görünüm Alanı Boyutu"
  },
  "nl": {
    "viewport-size": "Viewport-grootte"
  },
  "sv": {
    "viewport-size": "Visningsområdets storlek"
  },
  "pl": {
    "viewport-size": "Rozmiar widoku"
  },
  "vi": {
    "viewport-size": "Kích thước khung nhìn"
  },
  "th": {
    "viewport-size": "ขนาดวิวพอร์ต"
  },
  "id": {
    "viewport-size": "Ukuran Viewport"
  },
  "he": {
    "viewport-size": "גודל אזור התצוגה"
  },
  "ms": {
    "viewport-size": "Saiz Viewport"
  },
  "no": {
    "viewport-size": "Visningsområdestørrelse"
  }
}
</i18n>
