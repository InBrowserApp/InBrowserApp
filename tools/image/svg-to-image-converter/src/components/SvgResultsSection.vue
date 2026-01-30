<template>
  <ToolSection>
    <ToolSectionHeader>{{ t('resultsTitle') }}</ToolSectionHeader>
    <n-grid cols="1 s:2" responsive="screen" :x-gap="16" :y-gap="16">
      <n-gi>
        <n-flex vertical :size="8">
          <n-text strong>{{ t('original') }}</n-text>
          <n-text depth="3">{{ t('dimensions') }}: {{ originalDimensionsLabel }}</n-text>
          <n-text depth="3">{{ t('fileSize') }}: {{ originalSizeLabel }}</n-text>
        </n-flex>
      </n-gi>
      <n-gi>
        <n-flex vertical :size="8">
          <n-text strong>{{ t('output') }}</n-text>
          <n-text depth="3">{{ t('dimensions') }}: {{ outputDimensionsLabel }}</n-text>
          <n-text depth="3">{{ t('fileSize') }}: {{ outputSizeLabel }}</n-text>
          <n-text depth="3">{{ outputFileName }}</n-text>
        </n-flex>
      </n-gi>
    </n-grid>
    <n-flex vertical :size="12" style="margin-top: 16px">
      <n-flex justify="center">
        <div class="preview-box">
          <img
            v-if="outputPreviewUrl"
            :src="outputPreviewUrl"
            alt="Output preview"
            class="preview-image"
          />
        </div>
      </n-flex>
      <n-button
        tag="a"
        :href="downloadHref || undefined"
        :download="outputFileName"
        :disabled="!downloadHref"
      >
        <template #icon>
          <n-icon><ArrowDownload24Regular /></n-icon>
        </template>
        {{ t('download') }}
      </n-button>
    </n-flex>
  </ToolSection>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { NButton, NFlex, NGi, NGrid, NIcon, NText } from 'naive-ui'
import ArrowDownload24Regular from '@vicons/fluent/ArrowDownload24Regular'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'

defineProps<{
  originalDimensionsLabel: string
  originalSizeLabel: string
  outputDimensionsLabel: string
  outputSizeLabel: string
  outputFileName: string
  outputPreviewUrl?: string
  downloadHref?: string
}>()

const { t } = useI18n({ useScope: 'local' })
</script>

<style scoped>
.preview-box {
  width: 240px;
  height: 240px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border: 1px solid var(--n-border-color);
  border-radius: 8px;
  background: #f5f5f5;
}

.preview-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  display: block;
}
</style>

<i18n lang="json">
{
  "en": {
    "resultsTitle": "Output",
    "original": "Original",
    "output": "Output",
    "dimensions": "Dimensions",
    "fileSize": "File size",
    "download": "Download"
  },
  "zh": {
    "resultsTitle": "输出",
    "original": "原始",
    "output": "输出",
    "dimensions": "尺寸",
    "fileSize": "文件大小",
    "download": "下载"
  },
  "zh-CN": {
    "resultsTitle": "输出",
    "original": "原始",
    "output": "输出",
    "dimensions": "尺寸",
    "fileSize": "文件大小",
    "download": "下载"
  },
  "zh-TW": {
    "resultsTitle": "輸出",
    "original": "原始",
    "output": "輸出",
    "dimensions": "尺寸",
    "fileSize": "檔案大小",
    "download": "下載"
  },
  "zh-HK": {
    "resultsTitle": "輸出",
    "original": "原始",
    "output": "輸出",
    "dimensions": "尺寸",
    "fileSize": "檔案大小",
    "download": "下載"
  },
  "es": {
    "resultsTitle": "Salida",
    "original": "Original",
    "output": "Salida",
    "dimensions": "Dimensiones",
    "fileSize": "Tamaño de archivo",
    "download": "Descargar"
  },
  "fr": {
    "resultsTitle": "Sortie",
    "original": "Original",
    "output": "Sortie",
    "dimensions": "Dimensions",
    "fileSize": "Taille du fichier",
    "download": "Télécharger"
  },
  "de": {
    "resultsTitle": "Ausgabe",
    "original": "Original",
    "output": "Ausgabe",
    "dimensions": "Abmessungen",
    "fileSize": "Dateigröße",
    "download": "Herunterladen"
  },
  "it": {
    "resultsTitle": "Output",
    "original": "Originale",
    "output": "Output",
    "dimensions": "Dimensioni",
    "fileSize": "Dimensione file",
    "download": "Scarica"
  },
  "ja": {
    "resultsTitle": "出力",
    "original": "元",
    "output": "出力",
    "dimensions": "サイズ",
    "fileSize": "ファイルサイズ",
    "download": "ダウンロード"
  },
  "ko": {
    "resultsTitle": "출력",
    "original": "원본",
    "output": "출력",
    "dimensions": "크기",
    "fileSize": "파일 크기",
    "download": "다운로드"
  },
  "ru": {
    "resultsTitle": "Результат",
    "original": "Исходный",
    "output": "Выход",
    "dimensions": "Размеры",
    "fileSize": "Размер файла",
    "download": "Скачать"
  },
  "pt": {
    "resultsTitle": "Saída",
    "original": "Original",
    "output": "Saída",
    "dimensions": "Dimensões",
    "fileSize": "Tamanho do arquivo",
    "download": "Baixar"
  },
  "ar": {
    "resultsTitle": "الإخراج",
    "original": "الأصل",
    "output": "الإخراج",
    "dimensions": "الأبعاد",
    "fileSize": "حجم الملف",
    "download": "تنزيل"
  },
  "hi": {
    "resultsTitle": "आउटपुट",
    "original": "मूल",
    "output": "आउटपुट",
    "dimensions": "आयाम",
    "fileSize": "फ़ाइल आकार",
    "download": "डाउनलोड"
  },
  "tr": {
    "resultsTitle": "Çıktı",
    "original": "Orijinal",
    "output": "Çıktı",
    "dimensions": "Boyutlar",
    "fileSize": "Dosya boyutu",
    "download": "İndir"
  },
  "nl": {
    "resultsTitle": "Uitvoer",
    "original": "Origineel",
    "output": "Uitvoer",
    "dimensions": "Afmetingen",
    "fileSize": "Bestandsgrootte",
    "download": "Downloaden"
  },
  "sv": {
    "resultsTitle": "Utdata",
    "original": "Original",
    "output": "Utdata",
    "dimensions": "Dimensioner",
    "fileSize": "Filstorlek",
    "download": "Ladda ner"
  },
  "pl": {
    "resultsTitle": "Wynik",
    "original": "Oryginał",
    "output": "Wynik",
    "dimensions": "Wymiary",
    "fileSize": "Rozmiar pliku",
    "download": "Pobierz"
  },
  "vi": {
    "resultsTitle": "Đầu ra",
    "original": "Gốc",
    "output": "Đầu ra",
    "dimensions": "Kích thước",
    "fileSize": "Kích thước tệp",
    "download": "Tải xuống"
  },
  "th": {
    "resultsTitle": "ผลลัพธ์",
    "original": "ต้นฉบับ",
    "output": "ผลลัพธ์",
    "dimensions": "ขนาด",
    "fileSize": "ขนาดไฟล์",
    "download": "ดาวน์โหลด"
  },
  "id": {
    "resultsTitle": "Output",
    "original": "Asli",
    "output": "Output",
    "dimensions": "Dimensi",
    "fileSize": "Ukuran file",
    "download": "Unduh"
  },
  "he": {
    "resultsTitle": "פלט",
    "original": "מקורי",
    "output": "פלט",
    "dimensions": "ממדים",
    "fileSize": "גודל קובץ",
    "download": "הורדה"
  },
  "ms": {
    "resultsTitle": "Output",
    "original": "Asal",
    "output": "Output",
    "dimensions": "Dimensi",
    "fileSize": "Saiz fail",
    "download": "Muat turun"
  },
  "no": {
    "resultsTitle": "Utdata",
    "original": "Original",
    "output": "Utdata",
    "dimensions": "Dimensjoner",
    "fileSize": "Filstørrelse",
    "download": "Last ned"
  }
}
</i18n>
