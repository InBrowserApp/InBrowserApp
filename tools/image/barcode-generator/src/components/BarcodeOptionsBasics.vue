<template>
  <n-grid cols="1" :y-gap="12">
    <n-form-item-gi :label="t('text')" :show-feedback="false">
      <n-input v-model:value="text" :placeholder="t('text-ph')" />
    </n-form-item-gi>

    <n-form-item-gi :label="t('format')" :show-feedback="false">
      <n-select v-model:value="format" :options="formatOptions" />
    </n-form-item-gi>

    <n-form-item-gi :label="t('bar-width')" :show-feedback="false">
      <n-slider v-model:value="width" :min="1" :max="8" :step="1" />
    </n-form-item-gi>

    <n-form-item-gi :label="t('bar-height')" :show-feedback="false">
      <n-slider v-model:value="height" :min="20" :max="300" :step="2" />
    </n-form-item-gi>

    <n-form-item-gi :label="t('margin')" :show-feedback="false">
      <n-slider v-model:value="margin" :min="0" :max="30" :step="1" />
    </n-form-item-gi>
  </n-grid>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NFormItemGi, NGrid, NInput, NSelect, NSlider } from 'naive-ui'
import { useI18n } from 'vue-i18n'

const text = defineModel<string>('text', { required: true })
const format = defineModel<string>('format', { required: true })
const width = defineModel<number>('width', { required: true })
const height = defineModel<number>('height', { required: true })
const margin = defineModel<number>('margin', { required: true })

const { t } = useI18n({ useScope: 'local' })

const formatOptions = computed(() => [
  { label: 'CODE128', value: 'CODE128' },
  { label: 'CODE128A', value: 'CODE128A' },
  { label: 'CODE128B', value: 'CODE128B' },
  { label: 'CODE128C', value: 'CODE128C' },
  { label: 'EAN13', value: 'EAN13' },
  { label: 'EAN8', value: 'EAN8' },
  { label: 'EAN5', value: 'EAN5' },
  { label: 'EAN2', value: 'EAN2' },
  { label: 'UPC', value: 'UPC' },
  { label: 'UPCE', value: 'UPCE' },
  { label: 'CODE39', value: 'CODE39' },
  { label: 'ITF', value: 'ITF' },
  { label: 'ITF14', value: 'ITF14' },
  { label: 'MSI', value: 'MSI' },
  { label: 'MSI10', value: 'MSI10' },
  { label: 'MSI11', value: 'MSI11' },
  { label: 'MSI1010', value: 'MSI1010' },
  { label: 'MSI1110', value: 'MSI1110' },
  { label: 'pharmacode', value: 'pharmacode' },
  { label: 'codabar', value: 'codabar' },
  { label: 'CODE93', value: 'CODE93' },
])
</script>

<i18n lang="json">
{
  "en": {
    "text": "Text",
    "text-ph": "Type content to encode...",
    "format": "Format",
    "bar-width": "Bar width",
    "bar-height": "Bar height",
    "margin": "Margin"
  },
  "zh": {
    "text": "文本",
    "text-ph": "输入要编码的内容...",
    "format": "格式",
    "bar-width": "条宽",
    "bar-height": "条高",
    "margin": "边距"
  },
  "zh-CN": {
    "text": "文本",
    "text-ph": "输入要编码的内容...",
    "format": "格式",
    "bar-width": "条宽",
    "bar-height": "条高",
    "margin": "边距"
  },
  "zh-TW": {
    "text": "文字",
    "text-ph": "輸入要編碼的內容...",
    "format": "格式",
    "bar-width": "條寬",
    "bar-height": "條高",
    "margin": "邊距"
  },
  "zh-HK": {
    "text": "文字",
    "text-ph": "輸入要編碼的內容...",
    "format": "格式",
    "bar-width": "條寬",
    "bar-height": "條高",
    "margin": "邊距"
  },
  "es": {
    "text": "Texto",
    "text-ph": "Escribe contenido...",
    "format": "Formato",
    "bar-width": "Ancho de barra",
    "bar-height": "Altura de barra",
    "margin": "Margen"
  },
  "fr": {
    "text": "Texte",
    "text-ph": "Saisir le contenu...",
    "format": "Format",
    "bar-width": "Largeur des barres",
    "bar-height": "Hauteur des barres",
    "margin": "Marge"
  },
  "de": {
    "text": "Text",
    "text-ph": "Geben Sie Inhalt ein...",
    "format": "Format",
    "bar-width": "Balkenbreite",
    "bar-height": "Balkenhöhe",
    "margin": "Rand"
  },
  "it": {
    "text": "Testo",
    "text-ph": "Scrivi contenuto...",
    "format": "Formato",
    "bar-width": "Larghezza barre",
    "bar-height": "Altezza barre",
    "margin": "Margine"
  },
  "ja": {
    "text": "テキスト",
    "text-ph": "内容を入力...",
    "format": "フォーマット",
    "bar-width": "バー幅",
    "bar-height": "バー高さ",
    "margin": "マージン"
  },
  "ko": {
    "text": "텍스트",
    "text-ph": "내용 입력...",
    "format": "형식",
    "bar-width": "바 폭",
    "bar-height": "바 높이",
    "margin": "여백"
  },
  "ru": {
    "text": "Текст",
    "text-ph": "Введите данные...",
    "format": "Формат",
    "bar-width": "Ширина штрихов",
    "bar-height": "Высота штрихов",
    "margin": "Отступ"
  },
  "pt": {
    "text": "Texto",
    "text-ph": "Digite o conteúdo...",
    "format": "Formato",
    "bar-width": "Largura das barras",
    "bar-height": "Altura das barras",
    "margin": "Margem"
  },
  "ar": {
    "text": "نص",
    "text-ph": "أدخل المحتوى...",
    "format": "التنسيق",
    "bar-width": "عرض الأشرطة",
    "bar-height": "ارتفاع الأشرطة",
    "margin": "الهامش"
  },
  "hi": {
    "text": "टेक्स्ट",
    "text-ph": "सामग्री दर्ज करें...",
    "format": "फॉर्मेट",
    "bar-width": "बार चौड़ाई",
    "bar-height": "बार ऊंचाई",
    "margin": "मार्जिन"
  },
  "tr": {
    "text": "Metin",
    "text-ph": "İçerik yazın...",
    "format": "Biçim",
    "bar-width": "Çubuk genişliği",
    "bar-height": "Çubuk yüksekliği",
    "margin": "Kenar boşluğu"
  },
  "nl": {
    "text": "Tekst",
    "text-ph": "Voer inhoud in...",
    "format": "Formaat",
    "bar-width": "Balkbreedte",
    "bar-height": "Balkhoogte",
    "margin": "Marge"
  },
  "sv": {
    "text": "Text",
    "text-ph": "Ange innehåll...",
    "format": "Format",
    "bar-width": "Streckbredd",
    "bar-height": "Streckhöjd",
    "margin": "Marginal"
  },
  "pl": {
    "text": "Tekst",
    "text-ph": "Wpisz treść...",
    "format": "Format",
    "bar-width": "Szerokość pasków",
    "bar-height": "Wysokość pasków",
    "margin": "Margines"
  },
  "vi": {
    "text": "Văn bản",
    "text-ph": "Nhập nội dung...",
    "format": "Định dạng",
    "bar-width": "Độ rộng vạch",
    "bar-height": "Chiều cao vạch",
    "margin": "Lề"
  },
  "th": {
    "text": "ข้อความ",
    "text-ph": "พิมพ์เนื้อหา...",
    "format": "รูปแบบ",
    "bar-width": "ความกว้างแท่ง",
    "bar-height": "ความสูงแท่ง",
    "margin": "ระยะขอบ"
  },
  "id": {
    "text": "Teks",
    "text-ph": "Masukkan konten...",
    "format": "Format",
    "bar-width": "Lebar batang",
    "bar-height": "Tinggi batang",
    "margin": "Margin"
  },
  "he": {
    "text": "טקסט",
    "text-ph": "הזן תוכן...",
    "format": "פורמט",
    "bar-width": "רוחב קווים",
    "bar-height": "גובה קווים",
    "margin": "שוליים"
  },
  "ms": {
    "text": "Teks",
    "text-ph": "Masukkan kandungan...",
    "format": "Format",
    "bar-width": "Lebar bar",
    "bar-height": "Tinggi bar",
    "margin": "Jidar"
  },
  "no": {
    "text": "Tekst",
    "text-ph": "Skriv innhold...",
    "format": "Format",
    "bar-width": "Strekbredde",
    "bar-height": "Strekhøyde",
    "margin": "Marg"
  }
}
</i18n>
