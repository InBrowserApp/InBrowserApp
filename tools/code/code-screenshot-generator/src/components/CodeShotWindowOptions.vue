<template>
  <n-form-item-gi :label="t('windowStyle')" :show-feedback="false">
    <n-select v-model:value="windowStyle" :options="windowStyleOptions" size="small" />
  </n-form-item-gi>
  <n-form-item-gi :label="t('lineNumbers')" :show-feedback="false">
    <n-switch v-model:value="showLineNumbers" />
  </n-form-item-gi>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { NFormItemGi, NSelect, NSwitch } from 'naive-ui'
import type { WindowStyle } from '../utils/render'

const windowStyle = defineModel<WindowStyle>('windowStyle', { required: true })
const showLineNumbers = defineModel<boolean>('showLineNumbers', { required: true })

const { t } = useI18n()

const windowStyleOptions = computed(() => [
  { label: t('windowMac'), value: 'mac' },
  { label: t('windowWindows'), value: 'windows' },
  { label: t('windowNone'), value: 'none' },
])
</script>

<i18n lang="json">
{
  "en": {
    "windowStyle": "Window style",
    "windowMac": "macOS",
    "windowWindows": "Windows",
    "windowNone": "None",
    "lineNumbers": "Line numbers"
  },
  "zh": {
    "windowStyle": "窗口样式",
    "windowMac": "macOS",
    "windowWindows": "Windows",
    "windowNone": "无",
    "lineNumbers": "行号"
  },
  "zh-CN": {
    "windowStyle": "窗口样式",
    "windowMac": "macOS",
    "windowWindows": "Windows",
    "windowNone": "无",
    "lineNumbers": "行号"
  },
  "zh-TW": {
    "windowStyle": "視窗樣式",
    "windowMac": "macOS",
    "windowWindows": "Windows",
    "windowNone": "無",
    "lineNumbers": "行號"
  },
  "zh-HK": {
    "windowStyle": "視窗樣式",
    "windowMac": "macOS",
    "windowWindows": "Windows",
    "windowNone": "無",
    "lineNumbers": "行號"
  },
  "es": {
    "windowStyle": "Estilo de ventana",
    "windowMac": "macOS",
    "windowWindows": "Windows",
    "windowNone": "Ninguno",
    "lineNumbers": "Números de línea"
  },
  "fr": {
    "windowStyle": "Style de fenêtre",
    "windowMac": "macOS",
    "windowWindows": "Windows",
    "windowNone": "Aucun",
    "lineNumbers": "Numéros de ligne"
  },
  "de": {
    "windowStyle": "Fensterstil",
    "windowMac": "macOS",
    "windowWindows": "Windows",
    "windowNone": "Keiner",
    "lineNumbers": "Zeilennummern"
  },
  "it": {
    "windowStyle": "Stile finestra",
    "windowMac": "macOS",
    "windowWindows": "Windows",
    "windowNone": "Nessuno",
    "lineNumbers": "Numeri di riga"
  },
  "ja": {
    "windowStyle": "ウィンドウスタイル",
    "windowMac": "macOS",
    "windowWindows": "Windows",
    "windowNone": "なし",
    "lineNumbers": "行番号"
  },
  "ko": {
    "windowStyle": "창 스타일",
    "windowMac": "macOS",
    "windowWindows": "Windows",
    "windowNone": "없음",
    "lineNumbers": "줄 번호"
  },
  "ru": {
    "windowStyle": "Стиль окна",
    "windowMac": "macOS",
    "windowWindows": "Windows",
    "windowNone": "Нет",
    "lineNumbers": "Номера строк"
  },
  "pt": {
    "windowStyle": "Estilo da janela",
    "windowMac": "macOS",
    "windowWindows": "Windows",
    "windowNone": "Nenhum",
    "lineNumbers": "Números de linha"
  },
  "ar": {
    "windowStyle": "نمط النافذة",
    "windowMac": "macOS",
    "windowWindows": "Windows",
    "windowNone": "بدون",
    "lineNumbers": "أرقام الأسطر"
  },
  "hi": {
    "windowStyle": "विंडो शैली",
    "windowMac": "macOS",
    "windowWindows": "Windows",
    "windowNone": "कोई नहीं",
    "lineNumbers": "लाइन नंबर"
  },
  "tr": {
    "windowStyle": "Pencere stili",
    "windowMac": "macOS",
    "windowWindows": "Windows",
    "windowNone": "Yok",
    "lineNumbers": "Satır numaraları"
  },
  "nl": {
    "windowStyle": "Vensterstijl",
    "windowMac": "macOS",
    "windowWindows": "Windows",
    "windowNone": "Geen",
    "lineNumbers": "Regelnummers"
  },
  "sv": {
    "windowStyle": "Fönsterstil",
    "windowMac": "macOS",
    "windowWindows": "Windows",
    "windowNone": "Ingen",
    "lineNumbers": "Radnummer"
  },
  "pl": {
    "windowStyle": "Styl okna",
    "windowMac": "macOS",
    "windowWindows": "Windows",
    "windowNone": "Brak",
    "lineNumbers": "Numery wierszy"
  },
  "vi": {
    "windowStyle": "Kiểu cửa sổ",
    "windowMac": "macOS",
    "windowWindows": "Windows",
    "windowNone": "Không",
    "lineNumbers": "Số dòng"
  },
  "th": {
    "windowStyle": "สไตล์หน้าต่าง",
    "windowMac": "macOS",
    "windowWindows": "Windows",
    "windowNone": "ไม่มี",
    "lineNumbers": "หมายเลขบรรทัด"
  },
  "id": {
    "windowStyle": "Gaya jendela",
    "windowMac": "macOS",
    "windowWindows": "Windows",
    "windowNone": "Tidak ada",
    "lineNumbers": "Nomor baris"
  },
  "he": {
    "windowStyle": "סגנון חלון",
    "windowMac": "macOS",
    "windowWindows": "Windows",
    "windowNone": "ללא",
    "lineNumbers": "מספרי שורות"
  },
  "ms": {
    "windowStyle": "Gaya tetingkap",
    "windowMac": "macOS",
    "windowWindows": "Windows",
    "windowNone": "Tiada",
    "lineNumbers": "Nombor baris"
  },
  "no": {
    "windowStyle": "Vindusstil",
    "windowMac": "macOS",
    "windowWindows": "Windows",
    "windowNone": "Ingen",
    "lineNumbers": "Linjenummer"
  }
}
</i18n>
