<template>
  <n-p>
    <n-checkbox v-model:checked="options.original"> {{ t('useOriginalImage') }} </n-checkbox>
  </n-p>

  <n-collapse-transition :show="!options.original">
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
  </n-collapse-transition>
</template>

<script setup lang="ts">
import { NColorPicker, NSlider, NCheckbox, NCollapseTransition, NP, NFormItem } from 'naive-ui'
import type { DesktopBrowserOptions } from '../../utils/favicon-generator/desktop-browser'
import { useVModel } from '@vueuse/core'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  options: DesktopBrowserOptions
}>()

const emit = defineEmits<{
  'update:options': [DesktopBrowserOptions]
}>()

const { t } = useI18n()

const options = useVModel(props, 'options', emit)
</script>

<i18n lang="json">
{
  "en": {
    "useOriginalImage": "Use the original image as is",
    "setBackgroundColor": "Set a background color",
    "backgroundColor": "Background Color",
    "backgroundRadius": "Background Radius",
    "margin": "Margin"
  },
  "zh": {
    "useOriginalImage": "按原样使用图片",
    "setBackgroundColor": "设置背景颜色",
    "backgroundColor": "背景颜色",
    "backgroundRadius": "背景圆角",
    "margin": "边距"
  },
  "zh-CN": {
    "useOriginalImage": "按原样使用图片",
    "setBackgroundColor": "设置背景颜色",
    "backgroundColor": "背景颜色",
    "backgroundRadius": "背景圆角",
    "margin": "边距"
  },
  "zh-TW": {
    "useOriginalImage": "按原樣使用圖片",
    "setBackgroundColor": "設置背景顏色",
    "backgroundColor": "背景顏色",
    "backgroundRadius": "背景圓角",
    "margin": "邊距"
  },
  "zh-HK": {
    "useOriginalImage": "按原樣使用圖片",
    "setBackgroundColor": "設置背景顏色",
    "backgroundColor": "背景顏色",
    "backgroundRadius": "背景圓角",
    "margin": "邊距"
  },
  "es": {
    "useOriginalImage": "Usar la imagen original tal cual",
    "setBackgroundColor": "Establecer un color de fondo",
    "backgroundColor": "Color de Fondo",
    "backgroundRadius": "Radio del Fondo",
    "margin": "Margen"
  },
  "fr": {
    "useOriginalImage": "Utiliser l'image originale telle quelle",
    "setBackgroundColor": "Définir une couleur de fond",
    "backgroundColor": "Couleur de Fond",
    "backgroundRadius": "Rayon du Fond",
    "margin": "Marge"
  },
  "de": {
    "useOriginalImage": "Originalbild unverändert verwenden",
    "setBackgroundColor": "Hintergrundfarbe festlegen",
    "backgroundColor": "Hintergrundfarbe",
    "backgroundRadius": "Hintergrundradius",
    "margin": "Rand"
  },
  "it": {
    "useOriginalImage": "Usa l'immagine originale così com'è",
    "setBackgroundColor": "Imposta un colore di sfondo",
    "backgroundColor": "Colore di Sfondo",
    "backgroundRadius": "Raggio dello Sfondo",
    "margin": "Margine"
  },
  "ja": {
    "useOriginalImage": "画像をそのまま使用する",
    "setBackgroundColor": "背景色を設定する",
    "backgroundColor": "背景色",
    "backgroundRadius": "背景の角丸",
    "margin": "余白"
  },
  "ko": {
    "useOriginalImage": "원본 이미지를 그대로 사용",
    "setBackgroundColor": "배경색 설정",
    "backgroundColor": "배경색",
    "backgroundRadius": "배경 반경",
    "margin": "여백"
  },
  "ru": {
    "useOriginalImage": "Использовать оригинальное изображение как есть",
    "setBackgroundColor": "Установить цвет фона",
    "backgroundColor": "Цвет Фона",
    "backgroundRadius": "Радиус Фона",
    "margin": "Отступ"
  },
  "pt": {
    "useOriginalImage": "Usar a imagem original como está",
    "setBackgroundColor": "Definir uma cor de fundo",
    "backgroundColor": "Cor de Fundo",
    "backgroundRadius": "Raio do Fundo",
    "margin": "Margem"
  },
  "ar": {
    "useOriginalImage": "استخدم الصورة الأصلية كما هي",
    "setBackgroundColor": "تعيين لون الخلفية",
    "backgroundColor": "لون الخلفية",
    "backgroundRadius": "نصف قطر الخلفية",
    "margin": "الهامش"
  },
  "hi": {
    "useOriginalImage": "मूल छवि को वैसे ही उपयोग करें",
    "setBackgroundColor": "पृष्ठभूमि का रंग सेट करें",
    "backgroundColor": "पृष्ठभूमि का रंग",
    "backgroundRadius": "पृष्ठभूमि की त्रिज्या",
    "margin": "मार्जिन"
  },
  "tr": {
    "useOriginalImage": "Orijinal görseli olduğu gibi kullan",
    "setBackgroundColor": "Arka plan rengi ayarla",
    "backgroundColor": "Arka Plan Rengi",
    "backgroundRadius": "Arka Plan Yarıçapı",
    "margin": "Kenar Boşluğu"
  },
  "nl": {
    "useOriginalImage": "Gebruik de originele afbeelding zoals deze is",
    "setBackgroundColor": "Stel een achtergrondkleur in",
    "backgroundColor": "Achtergrondkleur",
    "backgroundRadius": "Achtergrondradius",
    "margin": "Marge"
  },
  "sv": {
    "useOriginalImage": "Använd originalbilden som den är",
    "setBackgroundColor": "Ställ in en bakgrundsfärg",
    "backgroundColor": "Bakgrundsfärg",
    "backgroundRadius": "Bakgrundsradie",
    "margin": "Marginal"
  },
  "pl": {
    "useOriginalImage": "Użyj oryginalnego obrazu bez zmian",
    "setBackgroundColor": "Ustaw kolor tła",
    "backgroundColor": "Kolor Tła",
    "backgroundRadius": "Promień Tła",
    "margin": "Margines"
  },
  "vi": {
    "useOriginalImage": "Sử dụng hình ảnh gốc như hiện tại",
    "setBackgroundColor": "Đặt màu nền",
    "backgroundColor": "Màu Nền",
    "backgroundRadius": "Bán Kính Nền",
    "margin": "Lề"
  },
  "th": {
    "useOriginalImage": "ใช้รูปภาพต้นฉบับตามที่เป็น",
    "setBackgroundColor": "ตั้งค่าสีพื้นหลัง",
    "backgroundColor": "สีพื้นหลัง",
    "backgroundRadius": "รัศมีพื้นหลัง",
    "margin": "ขอบ"
  },
  "id": {
    "useOriginalImage": "Gunakan gambar asli apa adanya",
    "setBackgroundColor": "Atur warna latar belakang",
    "backgroundColor": "Warna Latar Belakang",
    "backgroundRadius": "Radius Latar Belakang",
    "margin": "Margin"
  },
  "he": {
    "useOriginalImage": "השתמש בתמונה המקורית כפי שהיא",
    "setBackgroundColor": "הגדר צבע רקע",
    "backgroundColor": "צבע רקע",
    "backgroundRadius": "רדיוס רקע",
    "margin": "שוליים"
  },
  "ms": {
    "useOriginalImage": "Gunakan imej asal seperti sedia ada",
    "setBackgroundColor": "Tetapkan warna latar belakang",
    "backgroundColor": "Warna Latar Belakang",
    "backgroundRadius": "Radius Latar Belakang",
    "margin": "Margin"
  },
  "no": {
    "useOriginalImage": "Bruk originalbildet som det er",
    "setBackgroundColor": "Angi en bakgrunnsfarge",
    "backgroundColor": "Bakgrunnsfarge",
    "backgroundRadius": "Bakgrunnsradius",
    "margin": "Margin"
  }
}
</i18n>
