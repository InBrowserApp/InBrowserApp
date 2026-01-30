<template>
  <ToolSectionHeader v-if="output">{{ t('outputTitle') }}</ToolSectionHeader>
  <ToolSection v-if="output">
    <n-input
      class="monospace-field"
      :value="output"
      type="textarea"
      :autosize="{ minRows: 6, maxRows: 14 }"
      readonly
    />
  </ToolSection>
  <ToolSection v-if="output">
    <n-flex justify="space-between" align="center">
      <CopyToClipboardButton :content="output" />
      <n-button tag="a" text :href="downloadUrl ?? undefined" :download="downloadName">
        <template #icon>
          <n-icon :component="ArrowDownload16Regular" />
        </template>
        {{ t('downloadButton') }}
      </n-button>
    </n-flex>
  </ToolSection>
</template>

<script setup lang="ts">
import { NButton, NFlex, NIcon, NInput } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { CopyToClipboardButton } from '@shared/ui/base'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import ArrowDownload16Regular from '@vicons/fluent/ArrowDownload16Regular'

defineProps<{
  output: string
  downloadUrl?: string | null
  downloadName: string
}>()

const { t } = useI18n()
</script>

<style scoped>
.monospace-field :deep(textarea) {
  font-family:
    ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New',
    monospace;
}
</style>

<i18n lang="json">
{
  "en": {
    "outputTitle": "Output",
    "downloadButton": "Download"
  },
  "zh": {
    "outputTitle": "输出",
    "downloadButton": "下载"
  },
  "zh-CN": {
    "outputTitle": "输出",
    "downloadButton": "下载"
  },
  "zh-TW": {
    "outputTitle": "輸出",
    "downloadButton": "下載"
  },
  "zh-HK": {
    "outputTitle": "輸出",
    "downloadButton": "下載"
  },
  "es": {
    "outputTitle": "Salida",
    "downloadButton": "Descargar"
  },
  "fr": {
    "outputTitle": "Sortie",
    "downloadButton": "Télécharger"
  },
  "de": {
    "outputTitle": "Ausgabe",
    "downloadButton": "Herunterladen"
  },
  "it": {
    "outputTitle": "Output",
    "downloadButton": "Scarica"
  },
  "ja": {
    "outputTitle": "出力",
    "downloadButton": "ダウンロード"
  },
  "ko": {
    "outputTitle": "출력",
    "downloadButton": "다운로드"
  },
  "ru": {
    "outputTitle": "Вывод",
    "downloadButton": "Скачать"
  },
  "pt": {
    "outputTitle": "Saída",
    "downloadButton": "Baixar"
  },
  "ar": {
    "outputTitle": "الإخراج",
    "downloadButton": "تنزيل"
  },
  "hi": {
    "outputTitle": "आउटपुट",
    "downloadButton": "डाउनलोड"
  },
  "tr": {
    "outputTitle": "Çıktı",
    "downloadButton": "İndir"
  },
  "nl": {
    "outputTitle": "Uitvoer",
    "downloadButton": "Downloaden"
  },
  "sv": {
    "outputTitle": "Utdata",
    "downloadButton": "Ladda ner"
  },
  "pl": {
    "outputTitle": "Wyjście",
    "downloadButton": "Pobierz"
  },
  "vi": {
    "outputTitle": "Kết quả",
    "downloadButton": "Tải xuống"
  },
  "th": {
    "outputTitle": "ผลลัพธ์",
    "downloadButton": "ดาวน์โหลด"
  },
  "id": {
    "outputTitle": "Output",
    "downloadButton": "Unduh"
  },
  "he": {
    "outputTitle": "פלט",
    "downloadButton": "הורדה"
  },
  "ms": {
    "outputTitle": "Output",
    "downloadButton": "Muat turun"
  },
  "no": {
    "outputTitle": "Utdata",
    "downloadButton": "Last ned"
  }
}
</i18n>
