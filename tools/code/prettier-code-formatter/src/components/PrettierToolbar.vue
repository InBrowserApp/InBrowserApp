<template>
  <n-flex align="center" justify="space-between" wrap>
    <n-flex align="center" wrap>
      <n-button text @click="emitImport">
        <template #icon>
          <n-icon :component="Document16Regular" />
        </template>
        {{ t('import-from-file') }}
      </n-button>
    </n-flex>

    <n-flex align="center" wrap>
      <CopyToClipboardButton :content="formattedCode" />
      <n-button
        tag="a"
        text
        :href="downloadHref"
        :download="downloadFilename"
        :disabled="!downloadHref"
      >
        <template #icon>
          <n-icon :component="ArrowDownload16Regular" />
        </template>
        {{ t('download-formatted') }}
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
  formattedCode: string
  downloadUrl?: string | null
  downloadFilename: string
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
    "download-formatted": "Download formatted"
  },
  "zh": {
    "import-from-file": "从文件导入",
    "download-formatted": "下载格式化结果"
  },
  "zh-CN": {
    "import-from-file": "从文件导入",
    "download-formatted": "下载格式化结果"
  },
  "zh-TW": {
    "import-from-file": "從檔案匯入",
    "download-formatted": "下載格式化結果"
  },
  "zh-HK": {
    "import-from-file": "從檔案匯入",
    "download-formatted": "下載格式化結果"
  },
  "es": {
    "import-from-file": "Importar desde archivo",
    "download-formatted": "Descargar formateado"
  },
  "fr": {
    "import-from-file": "Importer depuis un fichier",
    "download-formatted": "Télécharger le formaté"
  },
  "de": {
    "import-from-file": "Aus Datei importieren",
    "download-formatted": "Formatiertes herunterladen"
  },
  "it": {
    "import-from-file": "Importa da file",
    "download-formatted": "Scarica formattato"
  },
  "ja": {
    "import-from-file": "ファイルから読み込み",
    "download-formatted": "整形結果をダウンロード"
  },
  "ko": {
    "import-from-file": "파일에서 가져오기",
    "download-formatted": "형식화 다운로드"
  },
  "ru": {
    "import-from-file": "Импорт из файла",
    "download-formatted": "Скачать форматированный"
  },
  "pt": {
    "import-from-file": "Importar de arquivo",
    "download-formatted": "Baixar formatado"
  },
  "ar": {
    "import-from-file": "استيراد من ملف",
    "download-formatted": "تنزيل المنسق"
  },
  "hi": {
    "import-from-file": "फ़ाइल से आयात करें",
    "download-formatted": "फ़ॉर्मेटेड डाउनलोड करें"
  },
  "tr": {
    "import-from-file": "Dosyadan içe aktar",
    "download-formatted": "Biçimlendirileni indir"
  },
  "nl": {
    "import-from-file": "Importeren uit bestand",
    "download-formatted": "Geformatteerd downloaden"
  },
  "sv": {
    "import-from-file": "Importera från fil",
    "download-formatted": "Ladda ner formaterat"
  },
  "pl": {
    "import-from-file": "Importuj z pliku",
    "download-formatted": "Pobierz sformatowany"
  },
  "vi": {
    "import-from-file": "Nhập từ tệp",
    "download-formatted": "Tải xuống đã định dạng"
  },
  "th": {
    "import-from-file": "นำเข้าจากไฟล์",
    "download-formatted": "ดาวน์โหลดที่จัดรูปแบบแล้ว"
  },
  "id": {
    "import-from-file": "Impor dari file",
    "download-formatted": "Unduh yang diformat"
  },
  "he": {
    "import-from-file": "ייבוא מקובץ",
    "download-formatted": "הורד מעוצב"
  },
  "ms": {
    "import-from-file": "Import dari fail",
    "download-formatted": "Muat turun yang diformat"
  },
  "no": {
    "import-from-file": "Importer fra fil",
    "download-formatted": "Last ned formatert"
  }
}
</i18n>
