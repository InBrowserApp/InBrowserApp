<template>
  <n-flex align="center" justify="space-between">
    <n-flex align="center">
      <n-button @click="emitImport" text>
        <template #icon>
          <n-icon :component="Document16Regular" />
        </template>
        {{ t('import-from-file') }}
      </n-button>
    </n-flex>
    <n-flex>
      <CopyToClipboardButton :content="renderedJson" />
      <n-button
        tag="a"
        text
        :href="downloadHref"
        download="converted.json"
        :disabled="!downloadHref"
      >
        <template #icon>
          <n-icon :component="ArrowDownload16Regular" />
        </template>
        {{ t('download-json') }}
      </n-button>
    </n-flex>
  </n-flex>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { NButton, NFlex, NIcon } from 'naive-ui'
import { CopyToClipboardButton } from '@shared/ui/base'
import ArrowDownload16Regular from '@vicons/fluent/ArrowDownload16Regular'
import Document16Regular from '@vicons/fluent/Document16Regular'

const props = defineProps<{
  renderedJson: string
  downloadUrl?: string | null
}>()

const emit = defineEmits<{
  (event: 'import'): void
}>()

const { t } = useI18n({ useScope: 'local' })

const downloadHref = computed(() => props.downloadUrl ?? undefined)

const emitImport = () => emit('import')
</script>

<i18n lang="json">
{
  "en": {
    "import-from-file": "Import from file",
    "download-json": "Download JSON"
  },
  "zh": {
    "import-from-file": "从文件导入",
    "download-json": "下载 JSON"
  },
  "zh-CN": {
    "import-from-file": "从文件导入",
    "download-json": "下载 JSON"
  },
  "zh-TW": {
    "import-from-file": "從檔案匯入",
    "download-json": "下載 JSON"
  },
  "zh-HK": {
    "import-from-file": "從檔案匯入",
    "download-json": "下載 JSON"
  },
  "es": {
    "import-from-file": "Importar desde archivo",
    "download-json": "Descargar JSON"
  },
  "fr": {
    "import-from-file": "Importer depuis un fichier",
    "download-json": "Télécharger le JSON"
  },
  "de": {
    "import-from-file": "Aus Datei importieren",
    "download-json": "JSON herunterladen"
  },
  "it": {
    "import-from-file": "Importa da file",
    "download-json": "Scarica JSON"
  },
  "ja": {
    "import-from-file": "ファイルからインポート",
    "download-json": "JSONをダウンロード"
  },
  "ko": {
    "import-from-file": "파일에서 가져오기",
    "download-json": "JSON 다운로드"
  },
  "ru": {
    "import-from-file": "Импорт из файла",
    "download-json": "Скачать JSON"
  },
  "pt": {
    "import-from-file": "Importar de arquivo",
    "download-json": "Baixar JSON"
  },
  "ar": {
    "import-from-file": "استيراد من ملف",
    "download-json": "تنزيل JSON"
  },
  "hi": {
    "import-from-file": "फ़ाइल से आयात करें",
    "download-json": "JSON डाउनलोड करें"
  },
  "tr": {
    "import-from-file": "Dosyadan içe aktar",
    "download-json": "JSON İndir"
  },
  "nl": {
    "import-from-file": "Importeren uit bestand",
    "download-json": "JSON downloaden"
  },
  "sv": {
    "import-from-file": "Importera från fil",
    "download-json": "Ladda ner JSON"
  },
  "pl": {
    "import-from-file": "Importuj z pliku",
    "download-json": "Pobierz JSON"
  },
  "vi": {
    "import-from-file": "Nhập từ tệp",
    "download-json": "Tải JSON"
  },
  "th": {
    "import-from-file": "นำเข้าจากไฟล์",
    "download-json": "ดาวน์โหลด JSON"
  },
  "id": {
    "import-from-file": "Impor dari file",
    "download-json": "Unduh JSON"
  },
  "he": {
    "import-from-file": "יבוא מקובץ",
    "download-json": "הורד JSON"
  },
  "ms": {
    "import-from-file": "Import dari fail",
    "download-json": "Muat turun JSON"
  },
  "no": {
    "import-from-file": "Importer fra fil",
    "download-json": "Last ned JSON"
  }
}
</i18n>
