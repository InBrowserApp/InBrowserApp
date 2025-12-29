<template>
  <InfoStatistic :label="t('architecture')" :value="architecture" />
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { computedAsync } from '@vueuse/core'
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

const architecture = computedAsync(async () => {
  try {
    if (navigator.userAgentData?.getHighEntropyValues) {
      const data = await navigator.userAgentData.getHighEntropyValues(['architecture'])
      return data.architecture
    }
    return undefined
  } catch {
    return undefined
  }
})
</script>

<i18n lang="json">
{
  "en": {
    "architecture": "Architecture"
  },
  "zh": {
    "architecture": "架构"
  },
  "zh-CN": {
    "architecture": "架构"
  },
  "zh-TW": {
    "architecture": "架構"
  },
  "zh-HK": {
    "architecture": "架構"
  },
  "es": {
    "architecture": "Arquitectura"
  },
  "fr": {
    "architecture": "Architecture"
  },
  "de": {
    "architecture": "Architektur"
  },
  "it": {
    "architecture": "Architettura"
  },
  "ja": {
    "architecture": "アーキテクチャ"
  },
  "ko": {
    "architecture": "아키텍처"
  },
  "ru": {
    "architecture": "Архитектура"
  },
  "pt": {
    "architecture": "Arquitetura"
  },
  "ar": {
    "architecture": "البنية"
  },
  "hi": {
    "architecture": "आर्किटेक्चर"
  },
  "tr": {
    "architecture": "Mimari"
  },
  "nl": {
    "architecture": "Architectuur"
  },
  "sv": {
    "architecture": "Arkitektur"
  },
  "pl": {
    "architecture": "Architektura"
  },
  "vi": {
    "architecture": "Kien Truc"
  },
  "th": {
    "architecture": "สถาปัตยกรรม"
  },
  "id": {
    "architecture": "Arsitektur"
  },
  "he": {
    "architecture": "ארכיטקטורה"
  },
  "ms": {
    "architecture": "Seni Bina"
  },
  "no": {
    "architecture": "Arkitektur"
  }
}
</i18n>
