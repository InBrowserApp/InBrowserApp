<template>
  <InfoStatistic :label="t('max-touch-points')" :value="maxTouchPoints" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import InfoStatistic from '../common/InfoStatistic.vue'

const { t } = useI18n()

// Device Information
const maxTouchPoints = computed(() => navigator.maxTouchPoints)
</script>

<i18n lang="json">
{
  "en": {
    "max-touch-points": "Max Touch Points"
  },
  "zh": {
    "max-touch-points": "最大触摸点"
  },
  "zh-CN": {
    "max-touch-points": "最大触摸点"
  },
  "zh-TW": {
    "max-touch-points": "最大觸控點數"
  },
  "zh-HK": {
    "max-touch-points": "最大觸控點數"
  },
  "es": {
    "max-touch-points": "Puntos tactiles maximos"
  },
  "fr": {
    "max-touch-points": "Points tactiles max"
  },
  "de": {
    "max-touch-points": "Max. Beruhrungspunkte"
  },
  "it": {
    "max-touch-points": "Punti touch massimi"
  },
  "ja": {
    "max-touch-points": "最大タッチポイント"
  },
  "ko": {
    "max-touch-points": "최대 터치 포인트"
  },
  "ru": {
    "max-touch-points": "Макс. точек касания"
  },
  "pt": {
    "max-touch-points": "Pontos de toque maximos"
  },
  "ar": {
    "max-touch-points": "اقصى نقاط اللمس"
  },
  "hi": {
    "max-touch-points": "अधिकतम टच पॉइंट"
  },
  "tr": {
    "max-touch-points": "Maks Dokunma Noktasi"
  },
  "nl": {
    "max-touch-points": "Max. aanraakpunten"
  },
  "sv": {
    "max-touch-points": "Max berorningspunkter"
  },
  "pl": {
    "max-touch-points": "Maks. punktow dotyku"
  },
  "vi": {
    "max-touch-points": "Diem cham toi da"
  },
  "th": {
    "max-touch-points": "จุดสัมผัสสูงสุด"
  },
  "id": {
    "max-touch-points": "Poin Sentuh Maks"
  },
  "he": {
    "max-touch-points": "נקודות מגע מקסימליות"
  },
  "ms": {
    "max-touch-points": "Titik Sentuh Maks"
  },
  "no": {
    "max-touch-points": "Maks berorningspunkter"
  }
}
</i18n>
