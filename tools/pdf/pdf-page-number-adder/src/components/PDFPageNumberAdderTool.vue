<template>
  <ToolSectionHeader>{{ t('title') }}</ToolSectionHeader>

  <PDFPageNumberUploadSection
    :file="file"
    :page-count="pageCount"
    :is-loading-document="isLoadingDocument"
    :file-error-code="fileErrorCode"
    @upload="handleUpload"
    @clear-file="clearFile"
  />

  <template v-if="file">
    <PDFPageNumberSettingsSection
      :file="file"
      :page-count="pageCount"
      :range-input="rangeInput"
      :start-number="startNumber"
      :format="format"
      :position="position"
      :font-size="fontSize"
      :margin-x="marginX"
      :margin-y="marginY"
      :range-error-code="rangeErrorCode"
      @update:range-input="setRangeInput"
      @update:start-number="setStartNumber"
      @update:format="setFormat"
      @update:position="setPosition"
      @update:font-size="setFontSize"
      @update:margin-x="setMarginX"
      @update:margin-y="setMarginY"
    />

    <PDFPageNumberGenerateSection
      :is-generating="isGenerating"
      :can-generate="canGenerate"
      :generate-error-code="generateErrorCode"
      :has-result="hasResult"
      :result-url="resultUrl ?? null"
      :result-filename="resultFilename"
      @generate="generate"
    />
  </template>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ToolSectionHeader } from '@shared/ui/tool'
import { usePdfPageNumberAdder } from './usePdfPageNumberAdder'
import PDFPageNumberGenerateSection from './PDFPageNumberGenerateSection.vue'
import PDFPageNumberSettingsSection from './PDFPageNumberSettingsSection.vue'
import PDFPageNumberUploadSection from './PDFPageNumberUploadSection.vue'

const { t } = useI18n({ useScope: 'local' })

const {
  file,
  pageCount,
  rangeInput,
  startNumber,
  format,
  position,
  fontSize,
  marginX,
  marginY,
  isLoadingDocument,
  isGenerating,
  fileErrorCode,
  rangeErrorCode,
  generateErrorCode,
  resultFilename,
  resultUrl,
  canGenerate,
  hasResult,
  setRangeInput,
  setStartNumber,
  setFormat,
  setPosition,
  setFontSize,
  setMarginX,
  setMarginY,
  clearFile,
  handleUpload,
  generate,
} = usePdfPageNumberAdder()
</script>

<i18n lang="json">
{
  "en": {
    "title": "PDF Page Number Adder"
  },
  "zh": {
    "title": "PDF 页码添加器"
  },
  "zh-CN": {
    "title": "PDF 页码添加器"
  },
  "zh-TW": {
    "title": "PDF 頁碼新增器"
  },
  "zh-HK": {
    "title": "PDF 頁碼新增器"
  },
  "es": {
    "title": "Añadir números de página a PDF"
  },
  "fr": {
    "title": "Ajout de numéros de page PDF"
  },
  "de": {
    "title": "PDF-Seitennummerierung"
  },
  "it": {
    "title": "Aggiungi numeri di pagina PDF"
  },
  "ja": {
    "title": "PDF ページ番号追加"
  },
  "ko": {
    "title": "PDF 페이지 번호 추가"
  },
  "ru": {
    "title": "Добавление нумерации страниц PDF"
  },
  "pt": {
    "title": "Adicionar números de página em PDF"
  },
  "ar": {
    "title": "إضافة أرقام صفحات PDF"
  },
  "hi": {
    "title": "PDF पेज नंबर जोड़ें"
  },
  "tr": {
    "title": "PDF Sayfa Numarası Ekleme"
  },
  "nl": {
    "title": "PDF-paginanummers toevoegen"
  },
  "sv": {
    "title": "Lägg till sidnummer i PDF"
  },
  "pl": {
    "title": "Dodawanie numerów stron PDF"
  },
  "vi": {
    "title": "Thêm số trang PDF"
  },
  "th": {
    "title": "เพิ่มเลขหน้า PDF"
  },
  "id": {
    "title": "Tambah nomor halaman PDF"
  },
  "he": {
    "title": "הוספת מספרי עמודים ל-PDF"
  },
  "ms": {
    "title": "Tambah nombor halaman PDF"
  },
  "no": {
    "title": "Legg til sidetall i PDF"
  }
}
</i18n>
