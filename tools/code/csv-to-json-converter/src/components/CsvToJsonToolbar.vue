<template>
  <ToolSection>
    <n-flex align="center" justify="space-between">
      <n-flex align="center">
        <n-button text @click="emit('import')">
          <template #icon>
            <n-icon :component="Document16Regular" />
          </template>
          {{ t('import-from-file') }}
        </n-button>

        <n-button text @click="toggleSettings">
          <template #icon>
            <n-icon :component="Settings16Regular" />
          </template>
          {{ t('opt-settings') }}
        </n-button>
      </n-flex>
      <n-flex>
        <CopyToClipboardButton :content="renderedJson" />
        <n-button tag="a" text :href="downloadUrl ?? undefined" download="converted.json">
          <template #icon>
            <n-icon :component="ArrowDownload16Regular" />
          </template>
          {{ t('download-json') }}
        </n-button>
      </n-flex>
    </n-flex>
  </ToolSection>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ToolSection } from '@shared/ui/tool'
import { CopyToClipboardButton } from '@shared/ui/base'
import { NButton, NFlex, NIcon } from 'naive-ui'
import ArrowDownload16Regular from '@vicons/fluent/ArrowDownload16Regular'
import Document16Regular from '@vicons/fluent/Document16Regular'
import Settings16Regular from '@vicons/fluent/Settings16Regular'

defineProps<{
  renderedJson: string
  downloadUrl?: string
}>()

const emit = defineEmits<{
  (e: 'import'): void
}>()

const showSettings = defineModel<boolean>('showSettings', { required: true })

const { t } = useI18n({ useScope: 'local' })

const toggleSettings = () => {
  showSettings.value = !showSettings.value
}
</script>

<i18n lang="json">
{
  "en": {
    "import-from-file": "Import from file",
    "opt-settings": "Settings",
    "download-json": "Download JSON"
  },
  "zh": {
    "import-from-file": "从文件导入",
    "opt-settings": "设置",
    "download-json": "下载 JSON"
  },
  "zh-CN": {
    "import-from-file": "从文件导入",
    "opt-settings": "设置",
    "download-json": "下载 JSON"
  },
  "zh-TW": {
    "import-from-file": "從檔案匯入",
    "opt-settings": "設定",
    "download-json": "下載 JSON"
  },
  "zh-HK": {
    "import-from-file": "從檔案匯入",
    "opt-settings": "設定",
    "download-json": "下載 JSON"
  },
  "es": {
    "import-from-file": "Importar desde archivo",
    "opt-settings": "Configuración",
    "download-json": "Descargar JSON"
  },
  "fr": {
    "import-from-file": "Importer depuis un fichier",
    "opt-settings": "Paramètres",
    "download-json": "Télécharger le JSON"
  },
  "de": {
    "import-from-file": "Aus Datei importieren",
    "opt-settings": "Einstellungen",
    "download-json": "JSON herunterladen"
  },
  "it": {
    "import-from-file": "Importa da file",
    "opt-settings": "Impostazioni",
    "download-json": "Scarica JSON"
  },
  "ja": {
    "import-from-file": "ファイルからインポート",
    "opt-settings": "設定",
    "download-json": "JSONをダウンロード"
  },
  "ko": {
    "import-from-file": "파일에서 가져오기",
    "opt-settings": "설정",
    "download-json": "JSON 다운로드"
  },
  "ru": {
    "import-from-file": "Импорт из файла",
    "opt-settings": "Настройки",
    "download-json": "Скачать JSON"
  },
  "pt": {
    "import-from-file": "Importar de arquivo",
    "opt-settings": "Configurações",
    "download-json": "Baixar JSON"
  },
  "ar": {
    "import-from-file": "استيراد من ملف",
    "opt-settings": "الإعدادات",
    "download-json": "تنزيل JSON"
  },
  "hi": {
    "import-from-file": "फ़ाइल से आयात करें",
    "opt-settings": "सेटिंग्स",
    "download-json": "JSON डाउनलोड करें"
  },
  "tr": {
    "import-from-file": "Dosyadan içe aktar",
    "opt-settings": "Ayarlar",
    "download-json": "JSON İndir"
  },
  "nl": {
    "import-from-file": "Importeren uit bestand",
    "opt-settings": "Instellingen",
    "download-json": "JSON downloaden"
  },
  "sv": {
    "import-from-file": "Importera från fil",
    "opt-settings": "Inställningar",
    "download-json": "Ladda ner JSON"
  },
  "pl": {
    "import-from-file": "Importuj z pliku",
    "opt-settings": "Ustawienia",
    "download-json": "Pobierz JSON"
  },
  "vi": {
    "import-from-file": "Nhập từ tệp",
    "opt-settings": "Cài đặt",
    "download-json": "Tải JSON"
  },
  "th": {
    "import-from-file": "นำเข้าจากไฟล์",
    "opt-settings": "การตั้งค่า",
    "download-json": "ดาวน์โหลด JSON"
  },
  "id": {
    "import-from-file": "Impor dari file",
    "opt-settings": "Pengaturan",
    "download-json": "Unduh JSON"
  },
  "he": {
    "import-from-file": "יבוא מקובץ",
    "opt-settings": "הגדרות",
    "download-json": "הורד JSON"
  },
  "ms": {
    "import-from-file": "Import dari fail",
    "opt-settings": "Tetapan",
    "download-json": "Muat turun JSON"
  },
  "no": {
    "import-from-file": "Importer fra fil",
    "opt-settings": "Innstillinger",
    "download-json": "Last ned JSON"
  }
}
</i18n>
