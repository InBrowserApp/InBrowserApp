<template>
  <n-grid-item :span="2">
    <n-form-item :label="t('display')">
      <n-select v-model:value="options.display" :options="displayOptions" />
    </n-form-item>
  </n-grid-item>
</template>

<script setup lang="ts">
import { toRefs } from 'vue'
import { NGridItem, NFormItem, NSelect } from 'naive-ui'
import type { GeneralInfoOptions } from '../../utils/favicon-generator/general-info'
import { useI18n } from 'vue-i18n'

const props = defineProps<{ options: GeneralInfoOptions }>()
const { options } = toRefs(props)

const { t } = useI18n({ useScope: 'local' })

const displayOptions = [
  { label: t('displayFullscreen'), value: 'fullscreen' },
  { label: t('displayStandalone'), value: 'standalone' },
  { label: t('displayMinimalUI'), value: 'minimal-ui' },
  { label: t('displayBrowser'), value: 'browser' },
]
</script>

<i18n lang="json">
{
  "en": {
    "display": "Display",
    "displayFullscreen": "Fullscreen",
    "displayStandalone": "Standalone",
    "displayMinimalUI": "Minimal UI",
    "displayBrowser": "Browser"
  },
  "zh": {
    "display": "显示方式",
    "displayFullscreen": "全屏",
    "displayStandalone": "独立窗口",
    "displayMinimalUI": "最小化界面",
    "displayBrowser": "浏览器"
  },
  "zh-CN": {
    "display": "显示方式",
    "displayFullscreen": "全屏",
    "displayStandalone": "独立窗口",
    "displayMinimalUI": "最小化界面",
    "displayBrowser": "浏览器"
  },
  "zh-TW": {
    "display": "顯示方式",
    "displayFullscreen": "全螢幕",
    "displayStandalone": "獨立視窗",
    "displayMinimalUI": "最小化介面",
    "displayBrowser": "瀏覽器"
  },
  "zh-HK": {
    "display": "顯示方式",
    "displayFullscreen": "全螢幕",
    "displayStandalone": "獨立視窗",
    "displayMinimalUI": "最小化介面",
    "displayBrowser": "瀏覽器"
  },
  "es": {
    "display": "Visualización",
    "displayFullscreen": "Pantalla Completa",
    "displayStandalone": "Independiente",
    "displayMinimalUI": "Interfaz Mínima",
    "displayBrowser": "Navegador"
  },
  "fr": {
    "display": "Affichage",
    "displayFullscreen": "Plein Écran",
    "displayStandalone": "Autonome",
    "displayMinimalUI": "Interface Minimale",
    "displayBrowser": "Navigateur"
  },
  "de": {
    "display": "Anzeige",
    "displayFullscreen": "Vollbild",
    "displayStandalone": "Eigenständig",
    "displayMinimalUI": "Minimale Benutzeroberfläche",
    "displayBrowser": "Browser"
  },
  "it": {
    "display": "Visualizzazione",
    "displayFullscreen": "Schermo Intero",
    "displayStandalone": "Autonomo",
    "displayMinimalUI": "Interfaccia Minima",
    "displayBrowser": "Browser"
  },
  "ja": {
    "display": "表示",
    "displayFullscreen": "全画面",
    "displayStandalone": "スタンドアロン",
    "displayMinimalUI": "最小 UI",
    "displayBrowser": "ブラウザ"
  },
  "ko": {
    "display": "표시",
    "displayFullscreen": "전체 화면",
    "displayStandalone": "독립 실행",
    "displayMinimalUI": "최소 UI",
    "displayBrowser": "브라우저"
  },
  "ru": {
    "display": "Отображение",
    "displayFullscreen": "Полноэкранный",
    "displayStandalone": "Автономный",
    "displayMinimalUI": "Минимальный Интерфейс",
    "displayBrowser": "Браузер"
  },
  "pt": {
    "display": "Exibição",
    "displayFullscreen": "Tela Cheia",
    "displayStandalone": "Independente",
    "displayMinimalUI": "Interface Mínima",
    "displayBrowser": "Navegador"
  },
  "ar": {
    "display": "العرض",
    "displayFullscreen": "ملء الشاشة",
    "displayStandalone": "مستقل",
    "displayMinimalUI": "واجهة مستخدم بسيطة",
    "displayBrowser": "المتصفح"
  },
  "hi": {
    "display": "प्रदर्शन",
    "displayFullscreen": "पूर्ण स्क्रीन",
    "displayStandalone": "स्टैंडअलोन",
    "displayMinimalUI": "न्यूनतम UI",
    "displayBrowser": "ब्राउज़र"
  },
  "tr": {
    "display": "Görüntüleme",
    "displayFullscreen": "Tam Ekran",
    "displayStandalone": "Bağımsız",
    "displayMinimalUI": "Minimal Arayüz",
    "displayBrowser": "Tarayıcı"
  },
  "nl": {
    "display": "Weergave",
    "displayFullscreen": "Volledig Scherm",
    "displayStandalone": "Zelfstandig",
    "displayMinimalUI": "Minimale Interface",
    "displayBrowser": "Browser"
  },
  "sv": {
    "display": "Visning",
    "displayFullscreen": "Fullskärm",
    "displayStandalone": "Fristående",
    "displayMinimalUI": "Minimal Gränssnitt",
    "displayBrowser": "Webbläsare"
  },
  "pl": {
    "display": "Wyświetlanie",
    "displayFullscreen": "Pełny Ekran",
    "displayStandalone": "Samodzielny",
    "displayMinimalUI": "Minimalny Interfejs",
    "displayBrowser": "Przeglądarka"
  },
  "vi": {
    "display": "Hiển thị",
    "displayFullscreen": "Toàn màn hình",
    "displayStandalone": "Độc lập",
    "displayMinimalUI": "Giao diện Tối thiểu",
    "displayBrowser": "Trình duyệt"
  },
  "th": {
    "display": "การแสดงผล",
    "displayFullscreen": "เต็มหน้าจอ",
    "displayStandalone": "แยกอิสระ",
    "displayMinimalUI": "UI ขั้นต่ำ",
    "displayBrowser": "เบราว์เซอร์"
  },
  "id": {
    "display": "Tampilan",
    "displayFullscreen": "Layar Penuh",
    "displayStandalone": "Mandiri",
    "displayMinimalUI": "UI Minimal",
    "displayBrowser": "Browser"
  },
  "he": {
    "display": "תצוגה",
    "displayFullscreen": "מסך מלא",
    "displayStandalone": "עצמאי",
    "displayMinimalUI": "ממשק מינימלי",
    "displayBrowser": "דפדפן"
  },
  "ms": {
    "display": "Paparan",
    "displayFullscreen": "Skrin Penuh",
    "displayStandalone": "Berdiri Sendiri",
    "displayMinimalUI": "UI Minimum",
    "displayBrowser": "Pelayar"
  },
  "no": {
    "display": "Visning",
    "displayFullscreen": "Fullskjerm",
    "displayStandalone": "Frittstående",
    "displayMinimalUI": "Minimal Grensesnitt",
    "displayBrowser": "Nettleser"
  }
}
</i18n>
