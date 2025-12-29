<template>
  <InfoStatistic :label="t('fps')" :value="fps" />
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useFps } from '@vueuse/core'
import InfoStatistic from '../common/InfoStatistic.vue'

const { t } = useI18n()

const fps = useFps()
</script>

<i18n lang="json">
{
  "en": {
    "fps": "FPS"
  },
  "zh": {
    "fps": "帧率"
  },
  "zh-CN": {
    "fps": "帧率"
  },
  "zh-TW": {
    "fps": "幀率"
  },
  "zh-HK": {
    "fps": "幀率"
  },
  "es": {
    "fps": "FPS"
  },
  "fr": {
    "fps": "IPS"
  },
  "de": {
    "fps": "FPS"
  },
  "it": {
    "fps": "FPS"
  },
  "ja": {
    "fps": "フレームレート"
  },
  "ko": {
    "fps": "프레임 속도"
  },
  "ru": {
    "fps": "Частота кадров"
  },
  "pt": {
    "fps": "FPS"
  },
  "ar": {
    "fps": "معدل الإطارات"
  },
  "hi": {
    "fps": "फ्रेम दर"
  },
  "tr": {
    "fps": "FPS"
  },
  "nl": {
    "fps": "FPS"
  },
  "sv": {
    "fps": "FPS"
  },
  "pl": {
    "fps": "Klatki na sekundę"
  },
  "vi": {
    "fps": "FPS"
  },
  "th": {
    "fps": "อัตราเฟรม"
  },
  "id": {
    "fps": "FPS"
  },
  "he": {
    "fps": "קצב פריימים"
  },
  "ms": {
    "fps": "FPS"
  },
  "no": {
    "fps": "FPS"
  }
}
</i18n>
