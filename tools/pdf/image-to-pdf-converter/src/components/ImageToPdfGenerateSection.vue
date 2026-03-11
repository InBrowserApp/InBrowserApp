<template>
  <ToolSectionHeader>{{ t('generateTitle') }}</ToolSectionHeader>
  <ToolSection>
    <div class="generate-section">
      <n-button
        type="primary"
        :loading="isGenerating"
        :disabled="!canGenerate"
        @click="emit('generate')"
      >
        {{ t('generateButton') }}
      </n-button>

      <div v-if="isGenerating && progress" class="generate-section__progress">
        <n-text depth="3">
          {{ t('progressLabel', { completed: progress.completed, total: progress.total }) }}
        </n-text>
        <n-progress
          type="line"
          status="success"
          :show-indicator="false"
          :percentage="progressPercentage"
        />
      </div>

      <n-card v-if="downloadUrl" size="small">
        <div class="generate-section__result">
          <n-text strong>{{ t('resultReady') }}</n-text>
          <n-text depth="3">
            {{ t('resultSummary', { pages: pageCount, size: outputSizeLabel }) }}
          </n-text>
          <n-button
            tag="a"
            type="primary"
            secondary
            :href="downloadUrl || ''"
            :download="downloadFilename"
          >
            {{ t('downloadButton') }}
          </n-button>
        </div>
      </n-card>
    </div>
  </ToolSection>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { filesize } from 'filesize'
import { NButton, NCard, NProgress, NText } from 'naive-ui'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import type { PdfGenerationProgress } from '../types'

const props = defineProps<{
  canGenerate: boolean
  isGenerating: boolean
  progress: PdfGenerationProgress | null
  downloadUrl: string | null
  downloadFilename: string
  outputSize: number | null
  pageCount: number
}>()

const emit = defineEmits<{
  (event: 'generate'): void
}>()

const { t } = useI18n({ useScope: 'local' })

const progressPercentage = computed(() => {
  if (!props.progress?.total) {
    return 0
  }

  return Math.round((props.progress.completed / props.progress.total) * 100)
})

const outputSizeLabel = computed(() => {
  if (!props.outputSize) {
    return '0 B'
  }

  return filesize(props.outputSize)
})
</script>

<style scoped>
.generate-section,
.generate-section__progress,
.generate-section__result {
  display: grid;
  gap: 12px;
}
</style>

<i18n lang="json">
{
  "en": {
    "generateTitle": "Generate PDF",
    "generateButton": "Generate PDF",
    "progressLabel": "Processing {completed} of {total} pages",
    "resultReady": "PDF ready",
    "resultSummary": "{pages} pages · {size}",
    "downloadButton": "Download PDF"
  },
  "zh": {
    "generateTitle": "生成 PDF",
    "generateButton": "生成 PDF",
    "progressLabel": "正在处理第 {completed} / {total} 页",
    "resultReady": "PDF 已生成",
    "resultSummary": "{pages} 页 · {size}",
    "downloadButton": "下载 PDF"
  },
  "zh-CN": {
    "generateTitle": "生成 PDF",
    "generateButton": "生成 PDF",
    "progressLabel": "正在处理第 {completed} / {total} 页",
    "resultReady": "PDF 已生成",
    "resultSummary": "{pages} 页 · {size}",
    "downloadButton": "下载 PDF"
  },
  "zh-TW": {
    "generateTitle": "產生 PDF",
    "generateButton": "產生 PDF",
    "progressLabel": "正在處理第 {completed} / {total} 頁",
    "resultReady": "PDF 已產生",
    "resultSummary": "{pages} 頁 · {size}",
    "downloadButton": "下載 PDF"
  },
  "zh-HK": {
    "generateTitle": "產生 PDF",
    "generateButton": "產生 PDF",
    "progressLabel": "正在處理第 {completed} / {total} 頁",
    "resultReady": "PDF 已產生",
    "resultSummary": "{pages} 頁 · {size}",
    "downloadButton": "下載 PDF"
  },
  "es": {
    "generateTitle": "Generate PDF",
    "generateButton": "Generate PDF",
    "progressLabel": "Processing {completed} of {total} pages",
    "resultReady": "PDF ready",
    "resultSummary": "{pages} pages · {size}",
    "downloadButton": "Download PDF"
  },
  "fr": {
    "generateTitle": "Generate PDF",
    "generateButton": "Generate PDF",
    "progressLabel": "Processing {completed} of {total} pages",
    "resultReady": "PDF ready",
    "resultSummary": "{pages} pages · {size}",
    "downloadButton": "Download PDF"
  },
  "de": {
    "generateTitle": "Generate PDF",
    "generateButton": "Generate PDF",
    "progressLabel": "Processing {completed} of {total} pages",
    "resultReady": "PDF ready",
    "resultSummary": "{pages} pages · {size}",
    "downloadButton": "Download PDF"
  },
  "it": {
    "generateTitle": "Generate PDF",
    "generateButton": "Generate PDF",
    "progressLabel": "Processing {completed} of {total} pages",
    "resultReady": "PDF ready",
    "resultSummary": "{pages} pages · {size}",
    "downloadButton": "Download PDF"
  },
  "ja": {
    "generateTitle": "Generate PDF",
    "generateButton": "Generate PDF",
    "progressLabel": "Processing {completed} of {total} pages",
    "resultReady": "PDF ready",
    "resultSummary": "{pages} pages · {size}",
    "downloadButton": "Download PDF"
  },
  "ko": {
    "generateTitle": "Generate PDF",
    "generateButton": "Generate PDF",
    "progressLabel": "Processing {completed} of {total} pages",
    "resultReady": "PDF ready",
    "resultSummary": "{pages} pages · {size}",
    "downloadButton": "Download PDF"
  },
  "ru": {
    "generateTitle": "Generate PDF",
    "generateButton": "Generate PDF",
    "progressLabel": "Processing {completed} of {total} pages",
    "resultReady": "PDF ready",
    "resultSummary": "{pages} pages · {size}",
    "downloadButton": "Download PDF"
  },
  "pt": {
    "generateTitle": "Generate PDF",
    "generateButton": "Generate PDF",
    "progressLabel": "Processing {completed} of {total} pages",
    "resultReady": "PDF ready",
    "resultSummary": "{pages} pages · {size}",
    "downloadButton": "Download PDF"
  },
  "ar": {
    "generateTitle": "Generate PDF",
    "generateButton": "Generate PDF",
    "progressLabel": "Processing {completed} of {total} pages",
    "resultReady": "PDF ready",
    "resultSummary": "{pages} pages · {size}",
    "downloadButton": "Download PDF"
  },
  "hi": {
    "generateTitle": "Generate PDF",
    "generateButton": "Generate PDF",
    "progressLabel": "Processing {completed} of {total} pages",
    "resultReady": "PDF ready",
    "resultSummary": "{pages} pages · {size}",
    "downloadButton": "Download PDF"
  },
  "tr": {
    "generateTitle": "Generate PDF",
    "generateButton": "Generate PDF",
    "progressLabel": "Processing {completed} of {total} pages",
    "resultReady": "PDF ready",
    "resultSummary": "{pages} pages · {size}",
    "downloadButton": "Download PDF"
  },
  "nl": {
    "generateTitle": "Generate PDF",
    "generateButton": "Generate PDF",
    "progressLabel": "Processing {completed} of {total} pages",
    "resultReady": "PDF ready",
    "resultSummary": "{pages} pages · {size}",
    "downloadButton": "Download PDF"
  },
  "sv": {
    "generateTitle": "Generate PDF",
    "generateButton": "Generate PDF",
    "progressLabel": "Processing {completed} of {total} pages",
    "resultReady": "PDF ready",
    "resultSummary": "{pages} pages · {size}",
    "downloadButton": "Download PDF"
  },
  "pl": {
    "generateTitle": "Generate PDF",
    "generateButton": "Generate PDF",
    "progressLabel": "Processing {completed} of {total} pages",
    "resultReady": "PDF ready",
    "resultSummary": "{pages} pages · {size}",
    "downloadButton": "Download PDF"
  },
  "vi": {
    "generateTitle": "Generate PDF",
    "generateButton": "Generate PDF",
    "progressLabel": "Processing {completed} of {total} pages",
    "resultReady": "PDF ready",
    "resultSummary": "{pages} pages · {size}",
    "downloadButton": "Download PDF"
  },
  "th": {
    "generateTitle": "Generate PDF",
    "generateButton": "Generate PDF",
    "progressLabel": "Processing {completed} of {total} pages",
    "resultReady": "PDF ready",
    "resultSummary": "{pages} pages · {size}",
    "downloadButton": "Download PDF"
  },
  "id": {
    "generateTitle": "Generate PDF",
    "generateButton": "Generate PDF",
    "progressLabel": "Processing {completed} of {total} pages",
    "resultReady": "PDF ready",
    "resultSummary": "{pages} pages · {size}",
    "downloadButton": "Download PDF"
  },
  "he": {
    "generateTitle": "Generate PDF",
    "generateButton": "Generate PDF",
    "progressLabel": "Processing {completed} of {total} pages",
    "resultReady": "PDF ready",
    "resultSummary": "{pages} pages · {size}",
    "downloadButton": "Download PDF"
  },
  "ms": {
    "generateTitle": "Generate PDF",
    "generateButton": "Generate PDF",
    "progressLabel": "Processing {completed} of {total} pages",
    "resultReady": "PDF ready",
    "resultSummary": "{pages} pages · {size}",
    "downloadButton": "Download PDF"
  },
  "no": {
    "generateTitle": "Generate PDF",
    "generateButton": "Generate PDF",
    "progressLabel": "Processing {completed} of {total} pages",
    "resultReady": "PDF ready",
    "resultSummary": "{pages} pages · {size}",
    "downloadButton": "Download PDF"
  }
}
</i18n>
