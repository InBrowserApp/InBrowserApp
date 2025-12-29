<template>
  <InfoStatistic :label="t('device-memory')" :value="deviceMemory" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import InfoStatistic from '../common/InfoStatistic.vue'

const { t } = useI18n()

declare global {
  interface Navigator {
    readonly deviceMemory?: number
  }
}

// Memory Information
const deviceMemory = computed(() => {
  const memory = navigator.deviceMemory
  return memory ? `${memory} GB` : undefined
})
</script>

<i18n lang="json">
{
  "en": {
    "device-memory": "Device Memory"
  },
  "zh": {
    "device-memory": "设备内存"
  },
  "zh-CN": {
    "device-memory": "设备内存"
  },
  "zh-TW": {
    "device-memory": "裝置記憶體"
  },
  "zh-HK": {
    "device-memory": "裝置記憶體"
  },
  "es": {
    "device-memory": "Memoria del dispositivo"
  },
  "fr": {
    "device-memory": "Memoire de l'appareil"
  },
  "de": {
    "device-memory": "Geratespeicher"
  },
  "it": {
    "device-memory": "Memoria del dispositivo"
  },
  "ja": {
    "device-memory": "デバイスメモリ"
  },
  "ko": {
    "device-memory": "장치 메모리"
  },
  "ru": {
    "device-memory": "Память устройства"
  },
  "pt": {
    "device-memory": "Memoria do dispositivo"
  },
  "ar": {
    "device-memory": "ذاكرة الجهاز"
  },
  "hi": {
    "device-memory": "डिवाइस मेमोरी"
  },
  "tr": {
    "device-memory": "Cihaz Bellegi"
  },
  "nl": {
    "device-memory": "Apparaatgeheugen"
  },
  "sv": {
    "device-memory": "Enhetsminne"
  },
  "pl": {
    "device-memory": "Pamiec urzadzenia"
  },
  "vi": {
    "device-memory": "Bo nho thiet bi"
  },
  "th": {
    "device-memory": "หน่วยความจำอุปกรณ์"
  },
  "id": {
    "device-memory": "Memori Perangkat"
  },
  "he": {
    "device-memory": "זיכרון המכשיר"
  },
  "ms": {
    "device-memory": "Memori Peranti"
  },
  "no": {
    "device-memory": "Enhetsminne"
  }
}
</i18n>
