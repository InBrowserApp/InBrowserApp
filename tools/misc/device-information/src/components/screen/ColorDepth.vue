<template>
  <InfoStatistic :label="t('color-depth')" :value="colorDepth" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import InfoStatistic from '../common/InfoStatistic.vue'

const { t } = useI18n()

const colorDepth = computed(
  () => `${screen.colorDepth} ${t('bits')}` + (screen.colorDepth <= 24 ? '' : ` (${t('hdr')})`),
)
</script>

<i18n lang="json">
{
  "en": {
    "color-depth": "Color Depth",
    "bits": "bits",
    "hdr": "HDR"
  },
  "zh": {
    "color-depth": "颜色深度",
    "bits": "位",
    "hdr": "HDR"
  },
  "zh-CN": {
    "color-depth": "颜色深度",
    "bits": "位",
    "hdr": "HDR"
  },
  "zh-TW": {
    "color-depth": "色彩深度",
    "bits": "位元",
    "hdr": "HDR"
  },
  "zh-HK": {
    "color-depth": "色彩深度",
    "bits": "位元",
    "hdr": "HDR"
  },
  "es": {
    "color-depth": "Profundidad de color",
    "bits": "bits",
    "hdr": "HDR"
  },
  "fr": {
    "color-depth": "Profondeur de couleur",
    "bits": "bits",
    "hdr": "HDR"
  },
  "de": {
    "color-depth": "Farbtiefe",
    "bits": "Bit",
    "hdr": "HDR"
  },
  "it": {
    "color-depth": "Profondità di colore",
    "bits": "bit",
    "hdr": "HDR"
  },
  "ja": {
    "color-depth": "色深度",
    "bits": "ビット",
    "hdr": "HDR"
  },
  "ko": {
    "color-depth": "색 심도",
    "bits": "비트",
    "hdr": "HDR"
  },
  "ru": {
    "color-depth": "Глубина цвета",
    "bits": "бит",
    "hdr": "HDR"
  },
  "pt": {
    "color-depth": "Profundidade de cor",
    "bits": "bits",
    "hdr": "HDR"
  },
  "ar": {
    "color-depth": "عمق اللون",
    "bits": "بت",
    "hdr": "HDR"
  },
  "hi": {
    "color-depth": "रंग गहराई",
    "bits": "बिट्स",
    "hdr": "HDR"
  },
  "tr": {
    "color-depth": "Renk Derinliği",
    "bits": "bit",
    "hdr": "HDR"
  },
  "nl": {
    "color-depth": "Kleurdiepte",
    "bits": "bits",
    "hdr": "HDR"
  },
  "sv": {
    "color-depth": "Färgdjup",
    "bits": "bitar",
    "hdr": "HDR"
  },
  "pl": {
    "color-depth": "Głębia kolorów",
    "bits": "bitów",
    "hdr": "HDR"
  },
  "vi": {
    "color-depth": "Độ sâu màu",
    "bits": "bit",
    "hdr": "HDR"
  },
  "th": {
    "color-depth": "ความลึกสี",
    "bits": "บิต",
    "hdr": "HDR"
  },
  "id": {
    "color-depth": "Kedalaman Warna",
    "bits": "bit",
    "hdr": "HDR"
  },
  "he": {
    "color-depth": "עומק צבע",
    "bits": "ביט",
    "hdr": "HDR"
  },
  "ms": {
    "color-depth": "Kedalaman Warna",
    "bits": "bit",
    "hdr": "HDR"
  },
  "no": {
    "color-depth": "Fargedybde",
    "bits": "biter",
    "hdr": "HDR"
  }
}
</i18n>
