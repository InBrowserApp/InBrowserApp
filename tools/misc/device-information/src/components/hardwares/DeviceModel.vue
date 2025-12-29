<template>
  <InfoStatistic :label="t('device-model')" :value="deviceModel" />
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

const deviceModel = computed(() => uaHighEntropyData.value?.model)
</script>

<i18n lang="json">
{
  "en": {
    "device-model": "Device Model"
  },
  "zh": {
    "device-model": "设备型号"
  },
  "zh-CN": {
    "device-model": "设备型号"
  },
  "zh-TW": {
    "device-model": "裝置型號"
  },
  "zh-HK": {
    "device-model": "裝置型號"
  },
  "es": {
    "device-model": "Modelo del dispositivo"
  },
  "fr": {
    "device-model": "Modele de l'appareil"
  },
  "de": {
    "device-model": "Geratemodell"
  },
  "it": {
    "device-model": "Modello del dispositivo"
  },
  "ja": {
    "device-model": "デバイスモデル"
  },
  "ko": {
    "device-model": "장치 모델"
  },
  "ru": {
    "device-model": "Модель устройства"
  },
  "pt": {
    "device-model": "Modelo do dispositivo"
  },
  "ar": {
    "device-model": "طراز الجهاز"
  },
  "hi": {
    "device-model": "डिवाइस मॉडल"
  },
  "tr": {
    "device-model": "Cihaz Modeli"
  },
  "nl": {
    "device-model": "Apparaatmodel"
  },
  "sv": {
    "device-model": "Enhetsmodell"
  },
  "pl": {
    "device-model": "Model urzadzenia"
  },
  "vi": {
    "device-model": "Mau thiet bi"
  },
  "th": {
    "device-model": "รุ่นอุปกรณ์"
  },
  "id": {
    "device-model": "Model Perangkat"
  },
  "he": {
    "device-model": "דגם המכשיר"
  },
  "ms": {
    "device-model": "Model Peranti"
  },
  "no": {
    "device-model": "Enhetsmodell"
  }
}
</i18n>
