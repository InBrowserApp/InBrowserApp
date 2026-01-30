<template>
  <n-p>
    <n-checkbox v-model:checked="options.background"> {{ t('setBackgroundColor') }} </n-checkbox>
  </n-p>

  <n-collapse-transition :show="options.background">
    <n-form-item :label="t('backgroundColor')">
      <n-color-picker
        v-model:value="options.backgroundColor"
        :show-alpha="false"
        :show-preview="true"
      />
    </n-form-item>

    <n-form-item :label="t('backgroundRadius')">
      <n-slider v-model:value="options.backgroundRadius" :step="1" />
    </n-form-item>
  </n-collapse-transition>

  <n-form-item :label="t('margin')">
    <n-slider v-model:value="options.margin" :step="1" />
  </n-form-item>
</template>

<script setup lang="ts">
import { NColorPicker, NSlider, NCheckbox, NCollapseTransition, NFormItem, NP } from 'naive-ui'
import type { PWAOptions } from '../../../utils/favicon-generator/pwa'
import { useVModel } from '@vueuse/core'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  options: PWAOptions
}>()

const emit = defineEmits<{
  'update:options': [PWAOptions]
}>()

const { t } = useI18n()

const options = useVModel(props, 'options', emit)
</script>

<i18n lang="json">
{
  "en": {
    "setBackgroundColor": "Set a background color",
    "backgroundColor": "Background Color",
    "backgroundRadius": "Background Radius",
    "margin": "Margin"
  },
  "zh": {
    "setBackgroundColor": "设置背景颜色",
    "backgroundColor": "背景颜色",
    "backgroundRadius": "背景圆角",
    "margin": "边距"
  },
  "zh-CN": {
    "setBackgroundColor": "设置背景颜色",
    "backgroundColor": "背景颜色",
    "backgroundRadius": "背景圆角",
    "margin": "边距"
  },
  "zh-TW": {
    "setBackgroundColor": "設置背景顏色",
    "backgroundColor": "背景顏色",
    "backgroundRadius": "背景圓角",
    "margin": "邊距"
  },
  "zh-HK": {
    "setBackgroundColor": "設置背景顏色",
    "backgroundColor": "背景顏色",
    "backgroundRadius": "背景圓角",
    "margin": "邊距"
  },
  "es": {
    "setBackgroundColor": "Establecer un color de fondo",
    "backgroundColor": "Color de Fondo",
    "backgroundRadius": "Radio del Fondo",
    "margin": "Margen"
  },
  "fr": {
    "setBackgroundColor": "Définir une couleur de fond",
    "backgroundColor": "Couleur de Fond",
    "backgroundRadius": "Rayon du Fond",
    "margin": "Marge"
  },
  "de": {
    "setBackgroundColor": "Hintergrundfarbe festlegen",
    "backgroundColor": "Hintergrundfarbe",
    "backgroundRadius": "Hintergrundradius",
    "margin": "Rand"
  },
  "it": {
    "setBackgroundColor": "Imposta un colore di sfondo",
    "backgroundColor": "Colore di Sfondo",
    "backgroundRadius": "Raggio dello Sfondo",
    "margin": "Margine"
  },
  "ja": {
    "setBackgroundColor": "背景色を設定する",
    "backgroundColor": "背景色",
    "backgroundRadius": "背景の角丸",
    "margin": "余白"
  },
  "ko": {
    "setBackgroundColor": "배경색 설정",
    "backgroundColor": "배경색",
    "backgroundRadius": "배경 반경",
    "margin": "여백"
  },
  "ru": {
    "setBackgroundColor": "Установить цвет фона",
    "backgroundColor": "Цвет Фона",
    "backgroundRadius": "Радиус Фона",
    "margin": "Отступ"
  },
  "pt": {
    "setBackgroundColor": "Definir uma cor de fundo",
    "backgroundColor": "Cor de Fundo",
    "backgroundRadius": "Raio do Fundo",
    "margin": "Margem"
  },
  "ar": {
    "setBackgroundColor": "تعيين لون الخلفية",
    "backgroundColor": "لون الخلفية",
    "backgroundRadius": "نصف قطر الخلفية",
    "margin": "الهامش"
  },
  "hi": {
    "setBackgroundColor": "पृष्ठभूमि का रंग सेट करें",
    "backgroundColor": "पृष्ठभूमि का रंग",
    "backgroundRadius": "पृष्ठभूमि की त्रिज्या",
    "margin": "मार्जिन"
  },
  "tr": {
    "setBackgroundColor": "Arka plan rengi ayarla",
    "backgroundColor": "Arka Plan Rengi",
    "backgroundRadius": "Arka Plan Yarıçapı",
    "margin": "Kenar Boşluğu"
  },
  "nl": {
    "setBackgroundColor": "Stel een achtergrondkleur in",
    "backgroundColor": "Achtergrondkleur",
    "backgroundRadius": "Achtergrondradius",
    "margin": "Marge"
  },
  "sv": {
    "setBackgroundColor": "Ställ in en bakgrundsfärg",
    "backgroundColor": "Bakgrundsfärg",
    "backgroundRadius": "Bakgrundsradie",
    "margin": "Marginal"
  },
  "pl": {
    "setBackgroundColor": "Ustaw kolor tła",
    "backgroundColor": "Kolor Tła",
    "backgroundRadius": "Promień Tła",
    "margin": "Margines"
  },
  "vi": {
    "setBackgroundColor": "Đặt màu nền",
    "backgroundColor": "Màu Nền",
    "backgroundRadius": "Bán Kính Nền",
    "margin": "Lề"
  },
  "th": {
    "setBackgroundColor": "ตั้งค่าสีพื้นหลัง",
    "backgroundColor": "สีพื้นหลัง",
    "backgroundRadius": "รัศมีพื้นหลัง",
    "margin": "ขอบ"
  },
  "id": {
    "setBackgroundColor": "Atur warna latar belakang",
    "backgroundColor": "Warna Latar Belakang",
    "backgroundRadius": "Radius Latar Belakang",
    "margin": "Margin"
  },
  "he": {
    "setBackgroundColor": "הגדר צבע רקע",
    "backgroundColor": "צבע רקע",
    "backgroundRadius": "רדיוס רקע",
    "margin": "שוליים"
  },
  "ms": {
    "setBackgroundColor": "Tetapkan warna latar belakang",
    "backgroundColor": "Warna Latar Belakang",
    "backgroundRadius": "Radius Latar Belakang",
    "margin": "Margin"
  },
  "no": {
    "setBackgroundColor": "Angi en bakgrunnsfarge",
    "backgroundColor": "Bakgrunnsfarge",
    "backgroundRadius": "Bakgrunnsradius",
    "margin": "Margin"
  }
}
</i18n>
