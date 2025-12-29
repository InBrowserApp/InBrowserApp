<template>
  <InfoStatistic :label="t('cpu-architecture')" :value="cpuArchitecture" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
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

// User Agent Data Information
const uaHighEntropyData = computedAsync(async () => {
  try {
    if (navigator.userAgentData?.getHighEntropyValues) {
      return await navigator.userAgentData.getHighEntropyValues([
        'architecture',
        'bitness',
        'model',
        'platformVersion',
        'fullVersionList',
        'wow64',
        'formFactor',
      ])
    }
    return null
  } catch {
    return null
  }
}, null)

const cpuArchitecture = computed(() => {
  // Try User-Agent Client Hints first
  if (uaHighEntropyData.value?.architecture) {
    return uaHighEntropyData.value.architecture
  }

  // Fallback to parsing user agent
  const ua = navigator.userAgent
  if (ua.includes('ARM') || ua.includes('arm')) return 'ARM'
  if (ua.includes('x86_64') || ua.includes('x64')) return 'x86_64'
  if (ua.includes('x86')) return 'x86'
  if (ua.includes('aarch64')) return 'AArch64'
  return undefined
})
</script>

<i18n lang="json">
{
  "en": {
    "cpu-architecture": "CPU Architecture"
  },
  "zh": {
    "cpu-architecture": "CPU架构"
  },
  "zh-CN": {
    "cpu-architecture": "CPU架构"
  },
  "zh-TW": {
    "cpu-architecture": "CPU 架構"
  },
  "zh-HK": {
    "cpu-architecture": "CPU 架構"
  },
  "es": {
    "cpu-architecture": "Arquitectura de CPU"
  },
  "fr": {
    "cpu-architecture": "Architecture CPU"
  },
  "de": {
    "cpu-architecture": "CPU-Architektur"
  },
  "it": {
    "cpu-architecture": "Architettura CPU"
  },
  "ja": {
    "cpu-architecture": "CPUアーキテクチャ"
  },
  "ko": {
    "cpu-architecture": "CPU 아키텍처"
  },
  "ru": {
    "cpu-architecture": "Архитектура процессора"
  },
  "pt": {
    "cpu-architecture": "Arquitetura da CPU"
  },
  "ar": {
    "cpu-architecture": "بنية المعالج"
  },
  "hi": {
    "cpu-architecture": "CPU आर्किटेक्चर"
  },
  "tr": {
    "cpu-architecture": "CPU Mimarisi"
  },
  "nl": {
    "cpu-architecture": "CPU-architectuur"
  },
  "sv": {
    "cpu-architecture": "CPU-arkitektur"
  },
  "pl": {
    "cpu-architecture": "Architektura CPU"
  },
  "vi": {
    "cpu-architecture": "Kien truc CPU"
  },
  "th": {
    "cpu-architecture": "สถาปัตยกรรม CPU"
  },
  "id": {
    "cpu-architecture": "Arsitektur CPU"
  },
  "he": {
    "cpu-architecture": "ארכיטקטורת מעבד"
  },
  "ms": {
    "cpu-architecture": "Seni Bina CPU"
  },
  "no": {
    "cpu-architecture": "CPU-arkitektur"
  }
}
</i18n>
