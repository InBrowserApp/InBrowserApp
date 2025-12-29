<template>
  <InfoStatistic :label="t('screen-resolution')" :value="screenResolution" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import InfoStatistic from '../common/InfoStatistic.vue'

const { t } = useI18n()

const screenResolution = computed(() => `${screen.width} × ${screen.height}`)
</script>

<i18n lang="json">
{
  "en": {
    "screen-resolution": "Screen Resolution"
  },
  "zh": {
    "screen-resolution": "屏幕分辨率"
  },
  "zh-CN": {
    "screen-resolution": "屏幕分辨率"
  },
  "zh-TW": {
    "screen-resolution": "螢幕解析度"
  },
  "zh-HK": {
    "screen-resolution": "螢幕解像度"
  },
  "es": {
    "screen-resolution": "Resolución de pantalla"
  },
  "fr": {
    "screen-resolution": "Résolution d'écran"
  },
  "de": {
    "screen-resolution": "Bildschirmauflösung"
  },
  "it": {
    "screen-resolution": "Risoluzione dello schermo"
  },
  "ja": {
    "screen-resolution": "画面解像度"
  },
  "ko": {
    "screen-resolution": "화면 해상도"
  },
  "ru": {
    "screen-resolution": "Разрешение экрана"
  },
  "pt": {
    "screen-resolution": "Resolução da tela"
  },
  "ar": {
    "screen-resolution": "دقة الشاشة"
  },
  "hi": {
    "screen-resolution": "स्क्रीन रिज़ॉल्यूशन"
  },
  "tr": {
    "screen-resolution": "Ekran Çözünürlüğü"
  },
  "nl": {
    "screen-resolution": "Schermresolutie"
  },
  "sv": {
    "screen-resolution": "Skärmupplösning"
  },
  "pl": {
    "screen-resolution": "Rozdzielczość ekranu"
  },
  "vi": {
    "screen-resolution": "Độ phân giải màn hình"
  },
  "th": {
    "screen-resolution": "ความละเอียดหน้าจอ"
  },
  "id": {
    "screen-resolution": "Resolusi Layar"
  },
  "he": {
    "screen-resolution": "רזולוציית מסך"
  },
  "ms": {
    "screen-resolution": "Resolusi Skrin"
  },
  "no": {
    "screen-resolution": "Skjermoppløsning"
  }
}
</i18n>
