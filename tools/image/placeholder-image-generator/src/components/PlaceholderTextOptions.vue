<template>
  <n-form-item-gi :label="t('text-color')" :show-feedback="false">
    <n-color-picker v-model:value="textColor" :modes="['hex']" :show-alpha="true" />
  </n-form-item-gi>

  <n-form-item-gi :label="t('custom-text')" :show-feedback="false" span="1 s:2">
    <n-input
      :value="customText"
      :placeholder="`${width} × ${height}`"
      clearable
      @update:value="(v) => (customText = v ?? '')"
    />
  </n-form-item-gi>

  <n-form-item-gi :label="t('font-size')" :show-feedback="false">
    <n-input-number
      :value="fontSize"
      :min="0"
      :max="500"
      :step="1"
      :placeholder="t('auto')"
      style="width: 100%"
      clearable
      @update:value="(v) => (fontSize = v ?? 0)"
    />
  </n-form-item-gi>
</template>

<script setup lang="ts">
import { NColorPicker, NFormItemGi, NInput, NInputNumber } from 'naive-ui'
import { useI18n } from 'vue-i18n'

defineProps<{ width: number; height: number }>()

const textColor = defineModel<string>('text-color', { required: true })
const customText = defineModel<string>('custom-text', { required: true })
const fontSize = defineModel<number>('font-size', { required: true })

const { t } = useI18n({ useScope: 'local' })
</script>

<i18n lang="json">
{
  "en": {
    "text-color": "Text Color",
    "custom-text": "Custom Text",
    "font-size": "Font Size (px)",
    "auto": "Auto"
  },
  "zh": {
    "text-color": "文字颜色",
    "custom-text": "自定义文字",
    "font-size": "字体大小 (px)",
    "auto": "自动"
  },
  "zh-CN": {
    "text-color": "文字颜色",
    "custom-text": "自定义文字",
    "font-size": "字体大小 (px)",
    "auto": "自动"
  },
  "zh-TW": {
    "text-color": "文字顏色",
    "custom-text": "自訂文字",
    "font-size": "字體大小 (px)",
    "auto": "自動"
  },
  "zh-HK": {
    "text-color": "文字顏色",
    "custom-text": "自訂文字",
    "font-size": "字體大小 (px)",
    "auto": "自動"
  },
  "es": {
    "text-color": "Color del texto",
    "custom-text": "Texto personalizado",
    "font-size": "Tamaño de fuente (px)",
    "auto": "Automático"
  },
  "fr": {
    "text-color": "Couleur du texte",
    "custom-text": "Texte personnalisé",
    "font-size": "Taille de police (px)",
    "auto": "Auto"
  },
  "de": {
    "text-color": "Textfarbe",
    "custom-text": "Benutzerdefinierter Text",
    "font-size": "Schriftgröße (px)",
    "auto": "Auto"
  },
  "it": {
    "text-color": "Colore del testo",
    "custom-text": "Testo personalizzato",
    "font-size": "Dimensione carattere (px)",
    "auto": "Auto"
  },
  "ja": {
    "text-color": "テキスト色",
    "custom-text": "カスタムテキスト",
    "font-size": "フォントサイズ (px)",
    "auto": "自動"
  },
  "ko": {
    "text-color": "텍스트 색상",
    "custom-text": "사용자 정의 텍스트",
    "font-size": "글꼴 크기 (px)",
    "auto": "자동"
  },
  "ru": {
    "text-color": "Цвет текста",
    "custom-text": "Пользовательский текст",
    "font-size": "Размер шрифта (px)",
    "auto": "Авто"
  },
  "pt": {
    "text-color": "Cor do texto",
    "custom-text": "Texto personalizado",
    "font-size": "Tamanho da fonte (px)",
    "auto": "Auto"
  },
  "ar": {
    "text-color": "لون النص",
    "custom-text": "نص مخصص",
    "font-size": "حجم الخط (px)",
    "auto": "تلقائي"
  },
  "hi": {
    "text-color": "टेक्स्ट रंग",
    "custom-text": "कस्टम टेक्स्ट",
    "font-size": "फ़ॉन्ट आकार (px)",
    "auto": "स्वचालित"
  },
  "tr": {
    "text-color": "Metin rengi",
    "custom-text": "Özel metin",
    "font-size": "Yazı tipi boyutu (px)",
    "auto": "Otomatik"
  },
  "nl": {
    "text-color": "Tekstkleur",
    "custom-text": "Aangepaste tekst",
    "font-size": "Lettergrootte (px)",
    "auto": "Auto"
  },
  "sv": {
    "text-color": "Textfärg",
    "custom-text": "Anpassad text",
    "font-size": "Teckenstorlek (px)",
    "auto": "Auto"
  },
  "pl": {
    "text-color": "Kolor tekstu",
    "custom-text": "Własny tekst",
    "font-size": "Rozmiar czcionki (px)",
    "auto": "Auto"
  },
  "vi": {
    "text-color": "Màu chữ",
    "custom-text": "Văn bản tùy chỉnh",
    "font-size": "Cỡ chữ (px)",
    "auto": "Tự động"
  },
  "th": {
    "text-color": "สีข้อความ",
    "custom-text": "ข้อความที่กำหนดเอง",
    "font-size": "ขนาดตัวอักษร (px)",
    "auto": "อัตโนมัติ"
  },
  "id": {
    "text-color": "Warna teks",
    "custom-text": "Teks kustom",
    "font-size": "Ukuran font (px)",
    "auto": "Otomatis"
  },
  "he": {
    "text-color": "צבע טקסט",
    "custom-text": "טקסט מותאם אישית",
    "font-size": "גודל גופן (px)",
    "auto": "אוטומטי"
  },
  "ms": {
    "text-color": "Warna teks",
    "custom-text": "Teks tersuai",
    "font-size": "Saiz fon (px)",
    "auto": "Auto"
  },
  "no": {
    "text-color": "Tekstfarge",
    "custom-text": "Egendefinert tekst",
    "font-size": "Skriftstørrelse (px)",
    "auto": "Auto"
  }
}
</i18n>
