<template>
  <InfoStatistic :label="t('available-resolution')" :value="availableResolution" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import InfoStatistic from '../common/InfoStatistic.vue'

const { t } = useI18n()

const availableResolution = computed(() => `${screen.availWidth} × ${screen.availHeight}`)
</script>

<i18n lang="json">
{
  "en": {
    "available-resolution": "Available Resolution"
  },
  "zh": {
    "available-resolution": "可用分辨率"
  },
  "zh-CN": {
    "available-resolution": "可用分辨率"
  },
  "zh-TW": {
    "available-resolution": "可用解析度"
  },
  "zh-HK": {
    "available-resolution": "可用解像度"
  },
  "es": {
    "available-resolution": "Resolución disponible"
  },
  "fr": {
    "available-resolution": "Résolution disponible"
  },
  "de": {
    "available-resolution": "Verfügbare Auflösung"
  },
  "it": {
    "available-resolution": "Risoluzione disponibile"
  },
  "ja": {
    "available-resolution": "利用可能な解像度"
  },
  "ko": {
    "available-resolution": "사용 가능한 해상도"
  },
  "ru": {
    "available-resolution": "Доступное разрешение"
  },
  "pt": {
    "available-resolution": "Resolução disponível"
  },
  "ar": {
    "available-resolution": "الدقة المتاحة"
  },
  "hi": {
    "available-resolution": "उपलब्ध रिज़ॉल्यूशन"
  },
  "tr": {
    "available-resolution": "Kullanılabilir Çözünürlük"
  },
  "nl": {
    "available-resolution": "Beschikbare resolutie"
  },
  "sv": {
    "available-resolution": "Tillgänglig upplösning"
  },
  "pl": {
    "available-resolution": "Dostępna rozdzielczość"
  },
  "vi": {
    "available-resolution": "Độ phân giải khả dụng"
  },
  "th": {
    "available-resolution": "ความละเอียดที่ใช้ได้"
  },
  "id": {
    "available-resolution": "Resolusi yang Tersedia"
  },
  "he": {
    "available-resolution": "רזולוציה זמינה"
  },
  "ms": {
    "available-resolution": "Resolusi Tersedia"
  },
  "no": {
    "available-resolution": "Tilgjengelig oppløsning"
  }
}
</i18n>
