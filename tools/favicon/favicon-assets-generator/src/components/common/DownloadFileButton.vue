<template>
  <n-button
    size="small"
    text
    tag="a"
    :href="href ?? undefined"
    :download="filename"
    :disabled="!href"
  >
    <template #icon>
      <n-icon :component="ArrowDownload16Filled" />
    </template>

    {{ t('download-file', { filename: filename }) }}
  </n-button>
</template>

<script setup lang="ts">
import { NButton, NIcon } from 'naive-ui'
import { ArrowDownload16Filled } from '@shared/icons/fluent'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

defineProps<{
  filename: string
  href?: string | null
}>()
</script>

<i18n lang="json">
{
  "en": {
    "download-file": "Download {filename}"
  },
  "zh": {
    "download-file": "下载 {filename}"
  },
  "zh-CN": {
    "download-file": "下载 {filename}"
  },
  "zh-TW": {
    "download-file": "下載 {filename}"
  },
  "zh-HK": {
    "download-file": "下載 {filename}"
  },
  "es": {
    "download-file": "Descargar {filename}"
  },
  "fr": {
    "download-file": "Télécharger {filename}"
  },
  "de": {
    "download-file": "{filename} herunterladen"
  },
  "it": {
    "download-file": "Scarica {filename}"
  },
  "ja": {
    "download-file": "{filename} をダウンロード"
  },
  "ko": {
    "download-file": "{filename} 다운로드"
  },
  "ru": {
    "download-file": "Скачать {filename}"
  },
  "pt": {
    "download-file": "Baixar {filename}"
  },
  "ar": {
    "download-file": "تنزيل {filename}"
  },
  "hi": {
    "download-file": "{filename} डाउनलोड करें"
  },
  "tr": {
    "download-file": "{filename}'yi indir"
  },
  "nl": {
    "download-file": "{filename} downloaden"
  },
  "sv": {
    "download-file": "Ladda ner {filename}"
  },
  "pl": {
    "download-file": "Pobierz {filename}"
  },
  "vi": {
    "download-file": "Tải xuống {filename}"
  },
  "th": {
    "download-file": "ดาวน์โหลด {filename}"
  },
  "id": {
    "download-file": "Unduh {filename}"
  },
  "he": {
    "download-file": "הורד {filename}"
  },
  "ms": {
    "download-file": "Muat turun {filename}"
  },
  "no": {
    "download-file": "Last ned {filename}"
  }
}
</i18n>
