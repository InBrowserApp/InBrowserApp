<template>
  <n-form-item :label="t('backgroundColor')">
    <n-color-picker
      v-model:value="options.backgroundColor"
      :show-alpha="false"
      :show-preview="true"
    />
  </n-form-item>
  <n-form-item :label="t('margin')">
    <n-slider v-model:value="options.margin" :step="1" />
  </n-form-item>
</template>

<script setup lang="ts">
import { NColorPicker, NSlider, NFormItem } from 'naive-ui'
import type { iOSWebClipOptions } from '../../utils/favicon-generator/ios-web-clip'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const options = defineModel<iOSWebClipOptions>('options', { required: true })
</script>

<i18n lang="json">
{
  "en": {
    "backgroundColor": "Background Color",
    "margin": "Margin"
  },
  "zh": {
    "backgroundColor": "背景颜色",
    "margin": "边距"
  },
  "zh-CN": {
    "backgroundColor": "背景颜色",
    "margin": "边距"
  },
  "zh-TW": {
    "backgroundColor": "背景顏色",
    "margin": "邊距"
  },
  "zh-HK": {
    "backgroundColor": "背景顏色",
    "margin": "邊距"
  },
  "es": {
    "backgroundColor": "Color de Fondo",
    "margin": "Margen"
  },
  "fr": {
    "backgroundColor": "Couleur de Fond",
    "margin": "Marge"
  },
  "de": {
    "backgroundColor": "Hintergrundfarbe",
    "margin": "Rand"
  },
  "it": {
    "backgroundColor": "Colore di Sfondo",
    "margin": "Margine"
  },
  "ja": {
    "backgroundColor": "背景色",
    "margin": "余白"
  },
  "ko": {
    "backgroundColor": "배경색",
    "margin": "여백"
  },
  "ru": {
    "backgroundColor": "Цвет Фона",
    "margin": "Отступ"
  },
  "pt": {
    "backgroundColor": "Cor de Fundo",
    "margin": "Margem"
  },
  "ar": {
    "backgroundColor": "لون الخلفية",
    "margin": "الهامش"
  },
  "hi": {
    "backgroundColor": "पृष्ठभूमि का रंग",
    "margin": "मार्जिन"
  },
  "tr": {
    "backgroundColor": "Arka Plan Rengi",
    "margin": "Kenar Boşluğu"
  },
  "nl": {
    "backgroundColor": "Achtergrondkleur",
    "margin": "Marge"
  },
  "sv": {
    "backgroundColor": "Bakgrundsfärg",
    "margin": "Marginal"
  },
  "pl": {
    "backgroundColor": "Kolor Tła",
    "margin": "Margines"
  },
  "vi": {
    "backgroundColor": "Màu Nền",
    "margin": "Lề"
  },
  "th": {
    "backgroundColor": "สีพื้นหลัง",
    "margin": "ขอบ"
  },
  "id": {
    "backgroundColor": "Warna Latar Belakang",
    "margin": "Margin"
  },
  "he": {
    "backgroundColor": "צבע רקע",
    "margin": "שוליים"
  },
  "ms": {
    "backgroundColor": "Warna Latar Belakang",
    "margin": "Margin"
  },
  "no": {
    "backgroundColor": "Bakgrunnsfarge",
    "margin": "Margin"
  }
}
</i18n>
