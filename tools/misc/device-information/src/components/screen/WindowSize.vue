<template>
  <InfoStatistic :label="t('window-size')" :value="windowSize" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useWindowSize } from '@vueuse/core'
import InfoStatistic from '../common/InfoStatistic.vue'

const { t } = useI18n()

const outer = useWindowSize({ type: 'outer' })
const windowSize = computed(() => `${outer.width.value} × ${outer.height.value}`)
</script>

<i18n lang="json">
{
  "en": {
    "window-size": "Window Size"
  },
  "zh": {
    "window-size": "窗口大小"
  },
  "zh-CN": {
    "window-size": "窗口大小"
  },
  "zh-TW": {
    "window-size": "視窗大小"
  },
  "zh-HK": {
    "window-size": "視窗大小"
  },
  "es": {
    "window-size": "Tamaño de ventana"
  },
  "fr": {
    "window-size": "Taille de la fenêtre"
  },
  "de": {
    "window-size": "Fenstergröße"
  },
  "it": {
    "window-size": "Dimensione della finestra"
  },
  "ja": {
    "window-size": "ウィンドウサイズ"
  },
  "ko": {
    "window-size": "창 크기"
  },
  "ru": {
    "window-size": "Размер окна"
  },
  "pt": {
    "window-size": "Tamanho da janela"
  },
  "ar": {
    "window-size": "حجم النافذة"
  },
  "hi": {
    "window-size": "विंडो का आकार"
  },
  "tr": {
    "window-size": "Pencere Boyutu"
  },
  "nl": {
    "window-size": "Venstergrootte"
  },
  "sv": {
    "window-size": "Fönsterstorlek"
  },
  "pl": {
    "window-size": "Rozmiar okna"
  },
  "vi": {
    "window-size": "Kích thước cửa sổ"
  },
  "th": {
    "window-size": "ขนาดหน้าต่าง"
  },
  "id": {
    "window-size": "Ukuran Jendela"
  },
  "he": {
    "window-size": "גודל חלון"
  },
  "ms": {
    "window-size": "Saiz Tetingkap"
  },
  "no": {
    "window-size": "Vinduestørrelse"
  }
}
</i18n>
