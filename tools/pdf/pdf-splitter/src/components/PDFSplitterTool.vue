<template>
  <PDFSplitUploadSection :file-error-code="fileErrorCode" @upload="handleUploadAndScroll" />

  <template v-if="file">
    <PDFSplitSelectionSection
      ref="selectionSectionRef"
      :page-count="pageCount"
      :selected-count="selectedCount"
      :range-input="rangeInput"
      :output-mode="outputMode"
      :multiple-mode="multipleMode"
      :is-generating="isGenerating"
      :can-generate="canGenerate"
      :range-error-code="rangeErrorCode"
      :generate-error-code="generateErrorCode"
      :has-result="hasResult"
      :download-url="downloadUrl"
      :result-filename="resultFilename"
      :result-file-count="resultFileCount"
      @update:range-input="handleRangeInputChange($event)"
      @update:output-mode="setOutputMode($event)"
      @update:multiple-mode="setMultipleMode($event)"
      @select-all="selectAll"
      @select-odd="selectOddPages"
      @select-even="selectEvenPages"
      @clear-selection="clearSelectedPages"
      @generate="handleGenerate"
    />

    <PDFSplitPreviewSection
      :items="items"
      :selected-page-set="selectedPageSet"
      :is-loading-document="isLoadingDocument"
      :is-rendering-thumbnails="isRenderingThumbnails"
      @toggle-page="handleTogglePage"
      @open-preview="handleOpenPreview"
    />
  </template>

  <PDFSplitPreviewModal
    :visible="previewPage !== null"
    :page="previewPage"
    :image-url="previewImageUrl"
    :is-loading="isPreviewLoading"
    :is-fallback-image="isPreviewLoading && !previewBlobURL"
    @close="closePreview"
  />
</template>

<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMessage } from 'naive-ui'
import { usePdfSplitter } from './usePdfSplitter'
import PDFSplitUploadSection from './PDFSplitUploadSection.vue'
import PDFSplitSelectionSection from './PDFSplitSelectionSection.vue'
import PDFSplitPreviewSection from './PDFSplitPreviewSection.vue'
import PDFSplitPreviewModal from './PDFSplitPreviewModal.vue'

type SelectionSectionExposed = {
  scrollToHeading: () => void
}

const { t } = useI18n({ useScope: 'local' })
const message = useMessage()
const selectionSectionRef = ref<SelectionSectionExposed | null>(null)

const {
  file,
  pageCount,
  rangeInput,
  outputMode,
  multipleMode,
  isLoadingDocument,
  isRenderingThumbnails,
  isGenerating,
  isPreviewLoading,
  fileErrorCode,
  rangeErrorCode,
  generateErrorCode,
  previewPage,
  previewBlobURL,
  selectedCount,
  selectedPageSet,
  items,
  resultFilename,
  resultFileCount,
  hasResult,
  downloadUrl,
  canGenerate,
  handleUpload,
  handleRangeInputChange,
  togglePageSelection,
  setOutputMode,
  setMultipleMode,
  selectAll,
  selectOddPages,
  selectEvenPages,
  clearSelectedPages,
  openPreview,
  closePreview,
  generate,
} = usePdfSplitter()

const previewFallbackUrl = computed(() => {
  if (previewPage.value === null) {
    return null
  }

  const target = items.value.find((item) => item.page === previewPage.value)
  return target?.thumbnailUrl ?? null
})
const previewImageUrl = computed(() => previewBlobURL.value || previewFallbackUrl.value)

const handleTogglePage = (page: number, event: MouseEvent): void => {
  togglePageSelection(page, event.shiftKey)
}

const handleGenerate = async (): Promise<void> => {
  const result = await generate()

  if (result.success) {
    if (resultFileCount.value <= 1) {
      message.success(t('generateSingleSuccess'))
    } else {
      message.success(t('generateMultipleSuccess', { count: resultFileCount.value }))
    }

    return
  }

  if (result.errorCode) {
    message.error(t('generationFailed'))
  }
}

const handleUploadAndScroll = async (nextFile: File): Promise<void> => {
  const result = await handleUpload(nextFile)
  if (!result.success || !pageCount.value) {
    return
  }

  await nextTick()
  selectionSectionRef.value?.scrollToHeading()
}

const handleOpenPreview = async (page: number): Promise<void> => {
  const result = await openPreview(page)
  if (!result.success && result.errorCode) {
    message.error(t('previewLoadFailed'))
  }
}
</script>

<i18n lang="json">
{
  "en": {
    "generateSingleSuccess": "PDF generated successfully.",
    "generateMultipleSuccess": "{count} PDF files are ready in ZIP.",
    "generationFailed": "Generation failed.",
    "previewLoadFailed": "Failed to load page preview."
  },
  "zh": {
    "generateSingleSuccess": "PDF 生成成功。",
    "generateMultipleSuccess": "已生成 {count} 个 PDF 文件并打包为 ZIP。",
    "generationFailed": "生成失败。",
    "previewLoadFailed": "加载页面预览失败。"
  },
  "zh-CN": {
    "generateSingleSuccess": "PDF 生成成功。",
    "generateMultipleSuccess": "已生成 {count} 个 PDF 文件并打包为 ZIP。",
    "generationFailed": "生成失败。",
    "previewLoadFailed": "加载页面预览失败。"
  },
  "zh-TW": {
    "generateSingleSuccess": "PDF 產生成功。",
    "generateMultipleSuccess": "已產生 {count} 個 PDF 檔案並打包為 ZIP。",
    "generationFailed": "產生失敗。",
    "previewLoadFailed": "載入頁面預覽失敗。"
  },
  "zh-HK": {
    "generateSingleSuccess": "PDF 產生成功。",
    "generateMultipleSuccess": "已產生 {count} 個 PDF 檔案並打包為 ZIP。",
    "generationFailed": "產生失敗。",
    "previewLoadFailed": "載入頁面預覽失敗。"
  },
  "es": {
    "generateSingleSuccess": "PDF generado correctamente.",
    "generateMultipleSuccess": "{count} archivos PDF están listos en ZIP.",
    "generationFailed": "La generación falló.",
    "previewLoadFailed": "No se pudo cargar el PDF."
  },
  "fr": {
    "generateSingleSuccess": "PDF généré avec succès.",
    "generateMultipleSuccess": "{count} fichiers PDF sont prêts dans le ZIP.",
    "generationFailed": "Échec de la génération.",
    "previewLoadFailed": "Échec du chargement du PDF."
  },
  "de": {
    "generateSingleSuccess": "PDF erfolgreich erstellt.",
    "generateMultipleSuccess": "{count} PDF-Dateien sind im ZIP bereit.",
    "generationFailed": "Generierung fehlgeschlagen.",
    "previewLoadFailed": "PDF-Datei konnte nicht geladen werden."
  },
  "it": {
    "generateSingleSuccess": "PDF generato con successo.",
    "generateMultipleSuccess": "{count} file PDF sono pronti nello ZIP.",
    "generationFailed": "Generazione non riuscita.",
    "previewLoadFailed": "Impossibile caricare il PDF."
  },
  "ja": {
    "generateSingleSuccess": "PDF の生成が完了しました。",
    "generateMultipleSuccess": "{count} 個の PDF が ZIP で準備できました。",
    "generationFailed": "生成に失敗しました。",
    "previewLoadFailed": "PDF の読み込みに失敗しました。"
  },
  "ko": {
    "generateSingleSuccess": "PDF가 성공적으로 생성되었습니다.",
    "generateMultipleSuccess": "{count}개의 PDF 파일이 ZIP으로 준비되었습니다.",
    "generationFailed": "생성에 실패했습니다.",
    "previewLoadFailed": "PDF 파일을 불러오지 못했습니다."
  },
  "ru": {
    "generateSingleSuccess": "PDF успешно создан.",
    "generateMultipleSuccess": "{count} PDF-файлов готовы в ZIP.",
    "generationFailed": "Не удалось выполнить генерацию.",
    "previewLoadFailed": "Не удалось загрузить PDF-файл."
  },
  "pt": {
    "generateSingleSuccess": "PDF gerado com sucesso.",
    "generateMultipleSuccess": "{count} arquivos PDF estão prontos no ZIP.",
    "generationFailed": "A geração falhou.",
    "previewLoadFailed": "Falha ao carregar o arquivo PDF."
  },
  "ar": {
    "generateSingleSuccess": "تم إنشاء PDF بنجاح.",
    "generateMultipleSuccess": "تم تجهيز {count} ملف PDF داخل ZIP.",
    "generationFailed": "فشل الإنشاء.",
    "previewLoadFailed": "تعذر تحميل ملف PDF."
  },
  "hi": {
    "generateSingleSuccess": "PDF सफलतापूर्वक जनरेट हो गया।",
    "generateMultipleSuccess": "{count} PDF फाइलें ZIP में तैयार हैं।",
    "generationFailed": "जनरेशन विफल।",
    "previewLoadFailed": "PDF फ़ाइल लोड करने में विफल।"
  },
  "tr": {
    "generateSingleSuccess": "PDF başarıyla oluşturuldu.",
    "generateMultipleSuccess": "{count} PDF dosyası ZIP içinde hazır.",
    "generationFailed": "Oluşturma başarısız.",
    "previewLoadFailed": "PDF dosyası yüklenemedi."
  },
  "nl": {
    "generateSingleSuccess": "PDF succesvol gegenereerd.",
    "generateMultipleSuccess": "{count} PDF-bestanden staan klaar in ZIP.",
    "generationFailed": "Genereren mislukt.",
    "previewLoadFailed": "Kon PDF-bestand niet laden."
  },
  "sv": {
    "generateSingleSuccess": "PDF skapades.",
    "generateMultipleSuccess": "{count} PDF-filer är klara i ZIP.",
    "generationFailed": "Generering misslyckades.",
    "previewLoadFailed": "Kunde inte läsa in PDF-filen."
  },
  "pl": {
    "generateSingleSuccess": "PDF wygenerowano pomyślnie.",
    "generateMultipleSuccess": "{count} plików PDF jest gotowych w ZIP.",
    "generationFailed": "Generowanie nie powiodło się.",
    "previewLoadFailed": "Nie udało się załadować pliku PDF."
  },
  "vi": {
    "generateSingleSuccess": "Đã tạo PDF thành công.",
    "generateMultipleSuccess": "{count} tệp PDF đã sẵn sàng trong ZIP.",
    "generationFailed": "Tạo thất bại.",
    "previewLoadFailed": "Không thể tải tệp PDF."
  },
  "th": {
    "generateSingleSuccess": "สร้าง PDF สำเร็จ",
    "generateMultipleSuccess": "ไฟล์ PDF จำนวน {count} ไฟล์พร้อมแล้วใน ZIP",
    "generationFailed": "การสร้างล้มเหลว",
    "previewLoadFailed": "ไม่สามารถโหลดไฟล์ PDF ได้"
  },
  "id": {
    "generateSingleSuccess": "PDF berhasil dibuat.",
    "generateMultipleSuccess": "{count} file PDF siap dalam ZIP.",
    "generationFailed": "Pembuatan gagal.",
    "previewLoadFailed": "Gagal memuat file PDF."
  },
  "he": {
    "generateSingleSuccess": "ה-PDF נוצר בהצלחה.",
    "generateMultipleSuccess": "{count} קובצי PDF מוכנים בתוך ZIP.",
    "generationFailed": "היצירה נכשלה.",
    "previewLoadFailed": "טעינת קובץ ה-PDF נכשלה."
  },
  "ms": {
    "generateSingleSuccess": "PDF berjaya dijana.",
    "generateMultipleSuccess": "{count} fail PDF sedia dalam ZIP.",
    "generationFailed": "Penjanaan gagal.",
    "previewLoadFailed": "Gagal memuatkan fail PDF."
  },
  "no": {
    "generateSingleSuccess": "PDF ble generert.",
    "generateMultipleSuccess": "{count} PDF-filer er klare i ZIP.",
    "generationFailed": "Generering mislyktes.",
    "previewLoadFailed": "Klarte ikke å laste PDF-filen."
  }
}
</i18n>
