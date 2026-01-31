<template>
  <ToolSection>
    <n-flex justify="flex-end">
      <n-button
        tag="a"
        type="primary"
        :href="downloadUrl ?? undefined"
        :download="downloadName"
        :disabled="!downloadUrl"
      >
        <template #icon>
          <n-icon :component="ArrowDownload16Regular" />
        </template>
        {{ t('download-file') }}
      </n-button>
    </n-flex>
  </ToolSection>
</template>

<script setup lang="ts">
import { NButton, NFlex, NIcon } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { ToolSection } from '@shared/ui/tool'
import ArrowDownload16Regular from '@vicons/fluent/ArrowDownload16Regular'

defineProps<{
  downloadUrl: string | undefined
  downloadName: string
}>()

const { t } = useI18n()
</script>

<i18n lang="json">
{
  "en": {
    "download-file": "Download file"
  },
  "zh": {
    "download-file": "下载文件"
  },
  "zh-CN": {
    "download-file": "下载文件"
  },
  "zh-TW": {
    "download-file": "下載檔案"
  },
  "zh-HK": {
    "download-file": "下載檔案"
  },
  "es": {
    "download-file": "Descargar archivo"
  },
  "fr": {
    "download-file": "Télécharger le fichier"
  },
  "de": {
    "download-file": "Datei herunterladen"
  },
  "it": {
    "download-file": "Scarica file"
  },
  "ja": {
    "download-file": "ファイルをダウンロード"
  },
  "ko": {
    "download-file": "파일 다운로드"
  },
  "ru": {
    "download-file": "Скачать файл"
  },
  "pt": {
    "download-file": "Baixar arquivo"
  },
  "ar": {
    "download-file": "تنزيل الملف"
  },
  "hi": {
    "download-file": "फ़ाइल डाउनलोड करें"
  },
  "tr": {
    "download-file": "Dosyayı indir"
  },
  "nl": {
    "download-file": "Bestand downloaden"
  },
  "sv": {
    "download-file": "Ladda ner fil"
  },
  "pl": {
    "download-file": "Pobierz plik"
  },
  "vi": {
    "download-file": "Tải tệp xuống"
  },
  "th": {
    "download-file": "ดาวน์โหลดไฟล์"
  },
  "id": {
    "download-file": "Unduh file"
  },
  "he": {
    "download-file": "הורדת קובץ"
  },
  "ms": {
    "download-file": "Muat turun fail"
  },
  "no": {
    "download-file": "Last ned fil"
  }
}
</i18n>
