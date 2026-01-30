<template>
  <ToolSection>
    <n-flex align="center" justify="space-between" wrap>
      <n-flex align="center" wrap>
        <n-button text @click="emit('import')">
          <template #icon>
            <n-icon :component="Document16Regular" />
          </template>
          {{ t('actionsImport') }}
        </n-button>
        <n-button text @click="emit('import-url')">
          <template #icon>
            <n-icon :component="Link16Regular" />
          </template>
          {{ t('actionsImportUrl') }}
        </n-button>
        <n-button text @click="emit('load-sample')">
          <template #icon>
            <n-icon :component="Wand16Regular" />
          </template>
          {{ t('actionsSample') }}
        </n-button>
      </n-flex>
      <n-flex align="center" wrap>
        <CopyToClipboardButton :content="outputText" />
        <n-button
          tag="a"
          text
          :href="downloadUrl ?? undefined"
          download="openapi-types.d.ts"
          :disabled="!downloadUrl"
        >
          <template #icon>
            <n-icon :component="ArrowDownload16Regular" />
          </template>
          {{ t('actionsDownload') }}
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
import Link16Regular from '@vicons/fluent/Link16Regular'
import Wand16Regular from '@vicons/fluent/Wand16Regular'

defineProps<{
  outputText: string
  downloadUrl?: string
}>()

const emit = defineEmits<{
  (e: 'import'): void
  (e: 'import-url'): void
  (e: 'load-sample'): void
}>()

const { t } = useI18n({ useScope: 'local' })
</script>

<i18n lang="json">
{
  "en": {
    "actionsImport": "Import from file",
    "actionsImportUrl": "Import from URL",
    "actionsSample": "Load sample",
    "actionsDownload": "Download .d.ts"
  },
  "zh": {
    "actionsImport": "从文件导入",
    "actionsImportUrl": "从 URL 导入",
    "actionsSample": "加载示例",
    "actionsDownload": "下载 .d.ts"
  },
  "zh-CN": {
    "actionsImport": "从文件导入",
    "actionsImportUrl": "从 URL 导入",
    "actionsSample": "加载示例",
    "actionsDownload": "下载 .d.ts"
  },
  "zh-TW": {
    "actionsImport": "從檔案匯入",
    "actionsImportUrl": "從 URL 匯入",
    "actionsSample": "載入範例",
    "actionsDownload": "下載 .d.ts"
  },
  "zh-HK": {
    "actionsImport": "從檔案匯入",
    "actionsImportUrl": "從 URL 匯入",
    "actionsSample": "載入範例",
    "actionsDownload": "下載 .d.ts"
  },
  "es": {
    "actionsImport": "Importar desde archivo",
    "actionsImportUrl": "Importar desde URL",
    "actionsSample": "Cargar ejemplo",
    "actionsDownload": "Descargar .d.ts"
  },
  "fr": {
    "actionsImport": "Importer depuis un fichier",
    "actionsImportUrl": "Importer depuis une URL",
    "actionsSample": "Charger un exemple",
    "actionsDownload": "Télécharger .d.ts"
  },
  "de": {
    "actionsImport": "Aus Datei importieren",
    "actionsImportUrl": "Von URL importieren",
    "actionsSample": "Beispiel laden",
    "actionsDownload": ".d.ts herunterladen"
  },
  "it": {
    "actionsImport": "Importa da file",
    "actionsImportUrl": "Importa da URL",
    "actionsSample": "Carica esempio",
    "actionsDownload": "Scarica .d.ts"
  },
  "ja": {
    "actionsImport": "ファイルからインポート",
    "actionsImportUrl": "URL からインポート",
    "actionsSample": "サンプルを読み込む",
    "actionsDownload": ".d.ts をダウンロード"
  },
  "ko": {
    "actionsImport": "파일에서 가져오기",
    "actionsImportUrl": "URL에서 가져오기",
    "actionsSample": "샘플 불러오기",
    "actionsDownload": ".d.ts 다운로드"
  },
  "ru": {
    "actionsImport": "Импорт из файла",
    "actionsImportUrl": "Импорт из URL",
    "actionsSample": "Загрузить пример",
    "actionsDownload": "Скачать .d.ts"
  },
  "pt": {
    "actionsImport": "Importar de arquivo",
    "actionsImportUrl": "Importar de URL",
    "actionsSample": "Carregar exemplo",
    "actionsDownload": "Baixar .d.ts"
  },
  "ar": {
    "actionsImport": "استيراد من ملف",
    "actionsImportUrl": "استيراد من عنوان URL",
    "actionsSample": "تحميل مثال",
    "actionsDownload": "تنزيل .d.ts"
  },
  "hi": {
    "actionsImport": "फ़ाइल से आयात करें",
    "actionsImportUrl": "URL से आयात करें",
    "actionsSample": "नमूना लोड करें",
    "actionsDownload": ".d.ts डाउनलोड करें"
  },
  "tr": {
    "actionsImport": "Dosyadan içe aktar",
    "actionsImportUrl": "URL'den içe aktar",
    "actionsSample": "Örnek yükle",
    "actionsDownload": ".d.ts indir"
  },
  "nl": {
    "actionsImport": "Importeren uit bestand",
    "actionsImportUrl": "Importeren via URL",
    "actionsSample": "Voorbeeld laden",
    "actionsDownload": ".d.ts downloaden"
  },
  "sv": {
    "actionsImport": "Importera från fil",
    "actionsImportUrl": "Importera från URL",
    "actionsSample": "Ladda exempel",
    "actionsDownload": "Ladda ner .d.ts"
  },
  "pl": {
    "actionsImport": "Importuj z pliku",
    "actionsImportUrl": "Importuj z URL",
    "actionsSample": "Wczytaj przykład",
    "actionsDownload": "Pobierz .d.ts"
  },
  "vi": {
    "actionsImport": "Nhập từ tệp",
    "actionsImportUrl": "Nhập từ URL",
    "actionsSample": "Tải mẫu",
    "actionsDownload": "Tải xuống .d.ts"
  },
  "th": {
    "actionsImport": "นำเข้าจากไฟล์",
    "actionsImportUrl": "นำเข้าจาก URL",
    "actionsSample": "โหลดตัวอย่าง",
    "actionsDownload": "ดาวน์โหลด .d.ts"
  },
  "id": {
    "actionsImport": "Impor dari file",
    "actionsImportUrl": "Impor dari URL",
    "actionsSample": "Muat contoh",
    "actionsDownload": "Unduh .d.ts"
  },
  "he": {
    "actionsImport": "ייבוא מקובץ",
    "actionsImportUrl": "ייבוא מ-URL",
    "actionsSample": "טען דוגמה",
    "actionsDownload": "הורד .d.ts"
  },
  "ms": {
    "actionsImport": "Import dari fail",
    "actionsImportUrl": "Import dari URL",
    "actionsSample": "Muat contoh",
    "actionsDownload": "Muat turun .d.ts"
  },
  "no": {
    "actionsImport": "Importer fra fil",
    "actionsImportUrl": "Importer fra URL",
    "actionsSample": "Last inn eksempel",
    "actionsDownload": "Last ned .d.ts"
  }
}
</i18n>
