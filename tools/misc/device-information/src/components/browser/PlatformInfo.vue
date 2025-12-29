<template>
  <InfoStatistic :label="t('platform')" :value="platform" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import InfoStatistic from '../common/InfoStatistic.vue'

const { t } = useI18n()

declare global {
  interface Navigator {
    readonly userAgentData?: NavigatorUAData
  }

  interface NavigatorUAData {
    readonly brands: Array<{ brand: string; version: string }>
    readonly mobile: boolean
    readonly platform: string
    getHighEntropyValues(hints: string[]): Promise<UADataValues>
  }

  interface UADataValues {
    readonly architecture?: string
    readonly bitness?: string
    readonly model?: string
    readonly platformVersion?: string
    readonly fullVersionList?: Array<{ brand: string; version: string }>
    readonly wow64?: boolean
    readonly formFactor?: string
  }
}

const platform = computed(() => {
  if (navigator?.userAgentData?.platform) {
    return navigator?.userAgentData?.platform
  }

  return navigator.platform
})
</script>

<i18n lang="json">
{
  "en": {
    "platform": "Platform"
  },
  "zh": {
    "platform": "平台"
  },
  "zh-CN": {
    "platform": "平台"
  },
  "zh-TW": {
    "platform": "平台"
  },
  "zh-HK": {
    "platform": "平台"
  },
  "es": {
    "platform": "Plataforma"
  },
  "fr": {
    "platform": "Plateforme"
  },
  "de": {
    "platform": "Plattform"
  },
  "it": {
    "platform": "Piattaforma"
  },
  "ja": {
    "platform": "プラットフォーム"
  },
  "ko": {
    "platform": "플랫폼"
  },
  "ru": {
    "platform": "Платформа"
  },
  "pt": {
    "platform": "Plataforma"
  },
  "ar": {
    "platform": "المنصة"
  },
  "hi": {
    "platform": "प्लेटफॉर्म"
  },
  "tr": {
    "platform": "Platform"
  },
  "nl": {
    "platform": "Platform"
  },
  "sv": {
    "platform": "Plattform"
  },
  "pl": {
    "platform": "Platforma"
  },
  "vi": {
    "platform": "Nen Tang"
  },
  "th": {
    "platform": "แพลตฟอร์ม"
  },
  "id": {
    "platform": "Platform"
  },
  "he": {
    "platform": "פלטפורמה"
  },
  "ms": {
    "platform": "Platform"
  },
  "no": {
    "platform": "Plattform"
  }
}
</i18n>
