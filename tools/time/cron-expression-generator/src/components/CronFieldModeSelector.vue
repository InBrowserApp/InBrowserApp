<template>
  <n-radio-group v-model:value="mode" size="small">
    <n-flex :size="16" wrap>
      <n-radio value="every">{{ t('every') }}</n-radio>
      <n-radio value="interval">{{ t('interval') }}</n-radio>
      <n-radio value="specific">{{ t('specific') }}</n-radio>
      <n-radio value="range">{{ t('range') }}</n-radio>
    </n-flex>
  </n-radio-group>
</template>

<script setup lang="ts">
import { NFlex, NRadio, NRadioGroup } from 'naive-ui'
import { useI18n } from 'vue-i18n'

type Mode = 'every' | 'interval' | 'specific' | 'range'

const mode = defineModel<Mode>('mode', { required: true })

const { t } = useI18n()
</script>

<i18n lang="json">
{
  "en": {
    "every": "Every",
    "interval": "Interval",
    "specific": "Specific",
    "range": "Range"
  },
  "zh": {
    "every": "每个",
    "interval": "间隔",
    "specific": "指定",
    "range": "范围"
  },
  "zh-CN": {
    "every": "每个",
    "interval": "间隔",
    "specific": "指定",
    "range": "范围"
  },
  "zh-TW": {
    "every": "每個",
    "interval": "間隔",
    "specific": "指定",
    "range": "範圍"
  },
  "zh-HK": {
    "every": "每個",
    "interval": "間隔",
    "specific": "指定",
    "range": "範圍"
  },
  "es": {
    "every": "Cada",
    "interval": "Intervalo",
    "specific": "Especifico",
    "range": "Rango"
  },
  "fr": {
    "every": "Chaque",
    "interval": "Intervalle",
    "specific": "Specifique",
    "range": "Plage"
  },
  "de": {
    "every": "Jede",
    "interval": "Intervall",
    "specific": "Spezifisch",
    "range": "Bereich"
  },
  "it": {
    "every": "Ogni",
    "interval": "Intervallo",
    "specific": "Specifico",
    "range": "Intervallo"
  },
  "ja": {
    "every": "毎",
    "interval": "間隔",
    "specific": "指定",
    "range": "範囲"
  },
  "ko": {
    "every": "매",
    "interval": "간격",
    "specific": "지정",
    "range": "범위"
  },
  "ru": {
    "every": "Каждый",
    "interval": "Интервал",
    "specific": "Конкретный",
    "range": "Диапазон"
  },
  "pt": {
    "every": "Cada",
    "interval": "Intervalo",
    "specific": "Especifico",
    "range": "Faixa"
  },
  "ar": {
    "every": "كل",
    "interval": "فاصل",
    "specific": "محدد",
    "range": "نطاق"
  },
  "hi": {
    "every": "हर",
    "interval": "अंतराल",
    "specific": "विशिष्ट",
    "range": "सीमा"
  },
  "tr": {
    "every": "Her",
    "interval": "Aralik",
    "specific": "Belirli",
    "range": "Aralik"
  },
  "nl": {
    "every": "Elke",
    "interval": "Interval",
    "specific": "Specifiek",
    "range": "Bereik"
  },
  "sv": {
    "every": "Varje",
    "interval": "Intervall",
    "specific": "Specifik",
    "range": "Omrade"
  },
  "pl": {
    "every": "Kazdy",
    "interval": "Interwal",
    "specific": "Okreslony",
    "range": "Zakres"
  },
  "vi": {
    "every": "Moi",
    "interval": "Khoang",
    "specific": "Cu the",
    "range": "Pham vi"
  },
  "th": {
    "every": "ทุก",
    "interval": "ช่วง",
    "specific": "เฉพาะ",
    "range": "ช่วง"
  },
  "id": {
    "every": "Setiap",
    "interval": "Interval",
    "specific": "Spesifik",
    "range": "Rentang"
  },
  "he": {
    "every": "כל",
    "interval": "מרווח",
    "specific": "ספציפי",
    "range": "טווח"
  },
  "ms": {
    "every": "Setiap",
    "interval": "Selang",
    "specific": "Khusus",
    "range": "Julat"
  },
  "no": {
    "every": "Hver",
    "interval": "Intervall",
    "specific": "Spesifikk",
    "range": "Omrade"
  }
}
</i18n>
