<template>
  <InfoStatistic :label="t('device-pixel-ratio')" :value="devicePixelRatio" />
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useDevicePixelRatio } from '@vueuse/core'
import InfoStatistic from '../common/InfoStatistic.vue'

const { t } = useI18n()

const { pixelRatio: devicePixelRatio } = useDevicePixelRatio()
</script>

<i18n lang="json">
{
  "en": {
    "device-pixel-ratio": "Device Pixel Ratio"
  },
  "zh": {
    "device-pixel-ratio": "设备像素比"
  },
  "zh-CN": {
    "device-pixel-ratio": "设备像素比"
  },
  "zh-TW": {
    "device-pixel-ratio": "裝置像素比"
  },
  "zh-HK": {
    "device-pixel-ratio": "裝置像素比"
  },
  "es": {
    "device-pixel-ratio": "Proporción de píxeles del dispositivo"
  },
  "fr": {
    "device-pixel-ratio": "Ratio de pixels de l'appareil"
  },
  "de": {
    "device-pixel-ratio": "Gerätepixelverhältnis"
  },
  "it": {
    "device-pixel-ratio": "Rapporto pixel del dispositivo"
  },
  "ja": {
    "device-pixel-ratio": "デバイスピクセル比"
  },
  "ko": {
    "device-pixel-ratio": "장치 픽셀 비율"
  },
  "ru": {
    "device-pixel-ratio": "Соотношение пикселей устройства"
  },
  "pt": {
    "device-pixel-ratio": "Proporção de pixels do dispositivo"
  },
  "ar": {
    "device-pixel-ratio": "نسبة بكسل الجهاز"
  },
  "hi": {
    "device-pixel-ratio": "डिवाइस पिक्सेल अनुपात"
  },
  "tr": {
    "device-pixel-ratio": "Cihaz Piksel Oranı"
  },
  "nl": {
    "device-pixel-ratio": "Apparaatpixelverhouding"
  },
  "sv": {
    "device-pixel-ratio": "Enhetens pixelförhållande"
  },
  "pl": {
    "device-pixel-ratio": "Współczynnik pikseli urządzenia"
  },
  "vi": {
    "device-pixel-ratio": "Tỷ lệ điểm ảnh thiết bị"
  },
  "th": {
    "device-pixel-ratio": "อัตราส่วนพิกเซลอุปกรณ์"
  },
  "id": {
    "device-pixel-ratio": "Rasio Piksel Perangkat"
  },
  "he": {
    "device-pixel-ratio": "יחס פיקסלים של המכשיר"
  },
  "ms": {
    "device-pixel-ratio": "Nisbah Piksel Peranti"
  },
  "no": {
    "device-pixel-ratio": "Enhetens pikselforhold"
  }
}
</i18n>
