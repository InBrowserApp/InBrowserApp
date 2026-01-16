<template>
  <n-popover trigger="hover">
    <template #trigger>
      <n-button text>
        <template #icon>
          <n-icon :component="Icon" />
        </template>
        {{ t('download') }}
      </n-button>
    </template>
    <n-flex vertical :size="8">
      <n-button
        v-for="link in downloadLinks"
        :key="link.label"
        tag="a"
        text
        :href="link.url ?? undefined"
        :download="link.filename"
      >
        {{ link.label }}
      </n-button>
    </n-flex>
  </n-popover>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useObjectUrl } from '@vueuse/core'
import { NIcon, NButton, NFlex, NPopover } from 'naive-ui'
import { ArrowDownload16Regular as Icon } from '@shared/icons/fluent'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps<{
  uuids: string[]
}>()

const txtBlob = computed(() => new Blob([props.uuids.join('\n')], { type: 'text/plain' }))
const csvBlob = computed(
  () =>
    new Blob(['uuid,\n' + props.uuids.join(',\n')], {
      type: 'text/csv',
    }),
)
const tsvBlob = computed(
  () =>
    new Blob(['uuid\t\n' + props.uuids.join('\t\n')], {
      type: 'text/tab-separated-values',
    }),
)
const jsonBlob = computed(
  () =>
    new Blob([JSON.stringify(props.uuids)], {
      type: 'application/json',
    }),
)

const txtUrl = useObjectUrl(txtBlob)
const csvUrl = useObjectUrl(csvBlob)
const tsvUrl = useObjectUrl(tsvBlob)
const jsonUrl = useObjectUrl(jsonBlob)

const downloadLinks = computed(() => [
  { label: 'TXT', url: txtUrl.value, filename: 'uuids.txt' },
  { label: 'CSV', url: csvUrl.value, filename: 'uuids.csv' },
  { label: 'TSV', url: tsvUrl.value, filename: 'uuids.tsv' },
  { label: 'JSON', url: jsonUrl.value, filename: 'uuids.json' },
])
</script>
<i18n lang="json">
{
  "en": {
    "download": "Download"
  },
  "zh": {
    "download": "下载"
  },
  "zh-CN": {
    "download": "下载"
  },
  "zh-TW": {
    "download": "下载"
  },
  "zh-HK": {
    "download": "下载"
  },
  "es": {
    "download": "Descargar"
  },
  "fr": {
    "download": "Télécharger"
  },
  "de": {
    "download": "Herunterladen"
  },
  "it": {
    "download": "Scarica"
  },
  "ja": {
    "download": "ダウンロード"
  },
  "ko": {
    "download": "다운로드"
  },
  "ru": {
    "download": "Скачать"
  },
  "pt": {
    "download": "Baixar"
  },
  "ar": {
    "download": "تحميل"
  },
  "hi": {
    "download": "डाउनलोड"
  },
  "tr": {
    "download": "İndir"
  },
  "nl": {
    "download": "Downloaden"
  },
  "sv": {
    "download": "Ladda ner"
  },
  "pl": {
    "download": "Pobierz"
  },
  "vi": {
    "download": "Tải xuống"
  },
  "th": {
    "download": "ดาวน์โหลด"
  },
  "id": {
    "download": "Unduh"
  },
  "he": {
    "download": "הורדה"
  },
  "ms": {
    "download": "Muat turun"
  },
  "no": {
    "download": "Last ned"
  }
}
</i18n>
