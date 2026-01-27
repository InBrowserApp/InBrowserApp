<template>
  <n-grid-item :span="2">
    <n-form-item :label="t('startUrl')">
      <n-input v-model:value="options.start_url" />
    </n-form-item>
  </n-grid-item>
  <n-grid-item :span="2">
    <n-form-item :label="t('pathOfIcons')">
      <n-input v-model:value="options.path" />
    </n-form-item>
  </n-grid-item>
</template>

<script setup lang="ts">
import { toRefs } from 'vue'
import { NGridItem, NFormItem, NInput } from 'naive-ui'
import type { GeneralInfoOptions } from '../../utils/favicon-generator/general-info'
import { useI18n } from 'vue-i18n'

const props = defineProps<{ options: GeneralInfoOptions }>()
const { options } = toRefs(props)

const { t } = useI18n({ useScope: 'local' })
</script>

<i18n lang="json">
{
  "en": {
    "startUrl": "Start URL",
    "pathOfIcons": "Path of icons"
  },
  "zh": {
    "startUrl": "起始 URL",
    "pathOfIcons": "图标路径"
  },
  "zh-CN": {
    "startUrl": "起始 URL",
    "pathOfIcons": "图标路径"
  },
  "zh-TW": {
    "startUrl": "起始 URL",
    "pathOfIcons": "圖標路徑"
  },
  "zh-HK": {
    "startUrl": "起始 URL",
    "pathOfIcons": "圖標路徑"
  },
  "es": {
    "startUrl": "URL de Inicio",
    "pathOfIcons": "Ruta de los Iconos"
  },
  "fr": {
    "startUrl": "URL de Démarrage",
    "pathOfIcons": "Chemin des Icônes"
  },
  "de": {
    "startUrl": "Start-URL",
    "pathOfIcons": "Pfad der Icons"
  },
  "it": {
    "startUrl": "URL di Avvio",
    "pathOfIcons": "Percorso delle Icone"
  },
  "ja": {
    "startUrl": "開始 URL",
    "pathOfIcons": "アイコンのパス"
  },
  "ko": {
    "startUrl": "시작 URL",
    "pathOfIcons": "아이콘 경로"
  },
  "ru": {
    "startUrl": "Начальный URL",
    "pathOfIcons": "Путь к Иконкам"
  },
  "pt": {
    "startUrl": "URL de Início",
    "pathOfIcons": "Caminho dos Ícones"
  },
  "ar": {
    "startUrl": "رابط البداية",
    "pathOfIcons": "مسار الأيقونات"
  },
  "hi": {
    "startUrl": "प्रारंभ URL",
    "pathOfIcons": "आइकन का पथ"
  },
  "tr": {
    "startUrl": "Başlangıç URL'si",
    "pathOfIcons": "Simgelerin Yolu"
  },
  "nl": {
    "startUrl": "Start-URL",
    "pathOfIcons": "Pad van Iconen"
  },
  "sv": {
    "startUrl": "Start-URL",
    "pathOfIcons": "Sökväg för Ikoner"
  },
  "pl": {
    "startUrl": "URL Startowy",
    "pathOfIcons": "Ścieżka do Ikon"
  },
  "vi": {
    "startUrl": "URL Khởi động",
    "pathOfIcons": "Đường dẫn Biểu tượng"
  },
  "th": {
    "startUrl": "URL เริ่มต้น",
    "pathOfIcons": "เส้นทางไอคอน"
  },
  "id": {
    "startUrl": "URL Mulai",
    "pathOfIcons": "Jalur Ikon"
  },
  "he": {
    "startUrl": "כתובת URL התחלתית",
    "pathOfIcons": "נתיב הסמלים"
  },
  "ms": {
    "startUrl": "URL Mula",
    "pathOfIcons": "Laluan Ikon"
  },
  "no": {
    "startUrl": "Start-URL",
    "pathOfIcons": "Sti til Ikoner"
  }
}
</i18n>
