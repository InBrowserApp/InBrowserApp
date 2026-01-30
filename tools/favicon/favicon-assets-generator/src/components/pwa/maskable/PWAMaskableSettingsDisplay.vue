<template>
  <n-form-item :label="t('backgroundColor')">
    <n-color-picker
      v-model:value="options.maskableBackgroundColor"
      :show-alpha="false"
      :show-preview="true"
    />
  </n-form-item>
  <n-form-item :label="t('margin')">
    <n-slider v-model:value="options.maskableMargin" :step="1" />
  </n-form-item>
</template>

<script setup lang="ts">
import { NColorPicker, NSlider, NFormItem } from 'naive-ui'
import type { PWAOptions } from '../../../utils/favicon-generator/pwa'
import { useVModel } from '@vueuse/core'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps<{
  options: PWAOptions
}>()

const emit = defineEmits(['update:options'])

const options = useVModel(props, 'options', emit)
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
    "backgroundColor": "Color de fondo",
    "margin": "Margen"
  },
  "fr": {
    "backgroundColor": "Couleur de fond",
    "margin": "Marge"
  },
  "de": {
    "backgroundColor": "Hintergrundfarbe",
    "margin": "Rand"
  },
  "it": {
    "backgroundColor": "Colore di sfondo",
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
    "backgroundColor": "Цвет фона",
    "margin": "Отступ"
  },
  "pt": {
    "backgroundColor": "Cor de fundo",
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
    "backgroundColor": "Arka plan rengi",
    "margin": "Kenar boşluğu"
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
    "backgroundColor": "Kolor tła",
    "margin": "Margines"
  },
  "vi": {
    "backgroundColor": "Màu nền",
    "margin": "Lề"
  },
  "th": {
    "backgroundColor": "สีพื้นหลัง",
    "margin": "ขอบ"
  },
  "id": {
    "backgroundColor": "Warna Latar",
    "margin": "Margin"
  },
  "he": {
    "backgroundColor": "צבע רקע",
    "margin": "שוליים"
  },
  "ms": {
    "backgroundColor": "Warna Latar",
    "margin": "Margin"
  },
  "no": {
    "backgroundColor": "Bakgrunnsfarge",
    "margin": "Margin"
  }
}
</i18n>
