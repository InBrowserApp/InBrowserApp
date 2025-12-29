<template>
  <InfoStatistic :label="t('cpu-bitness')" :value="cpuBitness ? cpuBitness + '-bit' : undefined" />
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

const cpuBitness = computed(() => uaHighEntropyData.value?.bitness || undefined)
</script>

<i18n lang="json">
{
  "en": {
    "cpu-bitness": "CPU Bitness"
  },
  "zh": {
    "cpu-bitness": "CPU位数"
  },
  "zh-CN": {
    "cpu-bitness": "CPU位数"
  },
  "zh-TW": {
    "cpu-bitness": "CPU 位元數"
  },
  "zh-HK": {
    "cpu-bitness": "CPU 位元數"
  },
  "es": {
    "cpu-bitness": "Bits de CPU"
  },
  "fr": {
    "cpu-bitness": "Bits CPU"
  },
  "de": {
    "cpu-bitness": "CPU-Bitbreite"
  },
  "it": {
    "cpu-bitness": "Bit CPU"
  },
  "ja": {
    "cpu-bitness": "CPUビット数"
  },
  "ko": {
    "cpu-bitness": "CPU 비트"
  },
  "ru": {
    "cpu-bitness": "Разрядность CPU"
  },
  "pt": {
    "cpu-bitness": "Bits da CPU"
  },
  "ar": {
    "cpu-bitness": "دقة المعالج"
  },
  "hi": {
    "cpu-bitness": "CPU बिटनेस"
  },
  "tr": {
    "cpu-bitness": "CPU Bit Sayisi"
  },
  "nl": {
    "cpu-bitness": "CPU-bitbreedte"
  },
  "sv": {
    "cpu-bitness": "CPU-bitantal"
  },
  "pl": {
    "cpu-bitness": "Bitowość CPU"
  },
  "vi": {
    "cpu-bitness": "So bit CPU"
  },
  "th": {
    "cpu-bitness": "บิต CPU"
  },
  "id": {
    "cpu-bitness": "Bitness CPU"
  },
  "he": {
    "cpu-bitness": "ביטים של המעבד"
  },
  "ms": {
    "cpu-bitness": "Bitness CPU"
  },
  "no": {
    "cpu-bitness": "CPU-bitbredde"
  }
}
</i18n>
