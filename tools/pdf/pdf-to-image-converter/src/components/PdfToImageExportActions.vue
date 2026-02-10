<template>
  <n-flex :size="8" wrap>
    <n-button
      tag="a"
      type="primary"
      :disabled="!hasCurrentImage || !currentDownloadUrl || isRendering"
      :href="currentDownloadUrl ?? undefined"
      :download="currentDownloadName"
    >
      <template #icon>
        <n-icon><ArrowDownload24Regular /></n-icon>
      </template>
      {{ t('downloadCurrent') }}
    </n-button>

    <n-button
      type="primary"
      secondary
      :disabled="!numPages || isExporting"
      :loading="isExporting"
      @click="emit('export-all')"
    >
      <template #icon>
        <n-icon><Archive24Regular /></n-icon>
      </template>
      {{ t('exportAll') }}
    </n-button>

    <n-button
      v-if="zipDownloadUrl"
      tag="a"
      secondary
      :href="zipDownloadUrl"
      :download="zipDownloadName"
    >
      <template #icon>
        <n-icon><ArrowDownload24Regular /></n-icon>
      </template>
      {{ t('downloadZip') }}
    </n-button>
  </n-flex>

  <n-text depth="3">
    {{ exportStatusText }}
  </n-text>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NButton, NFlex, NIcon, NText } from 'naive-ui'
import ArrowDownload24Regular from '@vicons/fluent/ArrowDownload24Regular'
import Archive24Regular from '@vicons/fluent/Archive24Regular'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  numPages: number
  hasCurrentImage: boolean
  isRendering: boolean
  isExporting: boolean
  exportProgress: number
  currentDownloadUrl: string | null
  currentDownloadName: string
  zipDownloadUrl: string | null
  zipDownloadName: string
}>()

const emit = defineEmits<{
  (event: 'export-all'): void
}>()

const { t } = useI18n({ useScope: 'local' })

const exportStatusText = computed(() => {
  if (props.isExporting) {
    return t('exporting', {
      current: props.exportProgress,
      total: props.numPages,
    })
  }

  return t('exportHint')
})
</script>

<i18n lang="json">
{
  "en": {
    "downloadCurrent": "Download Current Page",
    "exportAll": "Export All Pages (ZIP)",
    "downloadZip": "Download ZIP",
    "exportHint": "Select your settings, preview the page, then export one page or all pages.",
    "exporting": "Exporting pages {current}/{total}..."
  },
  "zh": {
    "downloadCurrent": "Download Current Page",
    "exportAll": "Export All Pages (ZIP)",
    "downloadZip": "Download ZIP",
    "exportHint": "Select your settings, preview the page, then export one page or all pages.",
    "exporting": "Exporting pages {current}/{total}..."
  },
  "zh-CN": {
    "downloadCurrent": "Download Current Page",
    "exportAll": "Export All Pages (ZIP)",
    "downloadZip": "Download ZIP",
    "exportHint": "Select your settings, preview the page, then export one page or all pages.",
    "exporting": "Exporting pages {current}/{total}..."
  },
  "zh-TW": {
    "downloadCurrent": "Download Current Page",
    "exportAll": "Export All Pages (ZIP)",
    "downloadZip": "Download ZIP",
    "exportHint": "Select your settings, preview the page, then export one page or all pages.",
    "exporting": "Exporting pages {current}/{total}..."
  },
  "zh-HK": {
    "downloadCurrent": "Download Current Page",
    "exportAll": "Export All Pages (ZIP)",
    "downloadZip": "Download ZIP",
    "exportHint": "Select your settings, preview the page, then export one page or all pages.",
    "exporting": "Exporting pages {current}/{total}..."
  },
  "es": {
    "downloadCurrent": "Download Current Page",
    "exportAll": "Export All Pages (ZIP)",
    "downloadZip": "Download ZIP",
    "exportHint": "Select your settings, preview the page, then export one page or all pages.",
    "exporting": "Exporting pages {current}/{total}..."
  },
  "fr": {
    "downloadCurrent": "Download Current Page",
    "exportAll": "Export All Pages (ZIP)",
    "downloadZip": "Download ZIP",
    "exportHint": "Select your settings, preview the page, then export one page or all pages.",
    "exporting": "Exporting pages {current}/{total}..."
  },
  "de": {
    "downloadCurrent": "Download Current Page",
    "exportAll": "Export All Pages (ZIP)",
    "downloadZip": "Download ZIP",
    "exportHint": "Select your settings, preview the page, then export one page or all pages.",
    "exporting": "Exporting pages {current}/{total}..."
  },
  "it": {
    "downloadCurrent": "Download Current Page",
    "exportAll": "Export All Pages (ZIP)",
    "downloadZip": "Download ZIP",
    "exportHint": "Select your settings, preview the page, then export one page or all pages.",
    "exporting": "Exporting pages {current}/{total}..."
  },
  "ja": {
    "downloadCurrent": "Download Current Page",
    "exportAll": "Export All Pages (ZIP)",
    "downloadZip": "Download ZIP",
    "exportHint": "Select your settings, preview the page, then export one page or all pages.",
    "exporting": "Exporting pages {current}/{total}..."
  },
  "ko": {
    "downloadCurrent": "Download Current Page",
    "exportAll": "Export All Pages (ZIP)",
    "downloadZip": "Download ZIP",
    "exportHint": "Select your settings, preview the page, then export one page or all pages.",
    "exporting": "Exporting pages {current}/{total}..."
  },
  "ru": {
    "downloadCurrent": "Download Current Page",
    "exportAll": "Export All Pages (ZIP)",
    "downloadZip": "Download ZIP",
    "exportHint": "Select your settings, preview the page, then export one page or all pages.",
    "exporting": "Exporting pages {current}/{total}..."
  },
  "pt": {
    "downloadCurrent": "Download Current Page",
    "exportAll": "Export All Pages (ZIP)",
    "downloadZip": "Download ZIP",
    "exportHint": "Select your settings, preview the page, then export one page or all pages.",
    "exporting": "Exporting pages {current}/{total}..."
  },
  "ar": {
    "downloadCurrent": "Download Current Page",
    "exportAll": "Export All Pages (ZIP)",
    "downloadZip": "Download ZIP",
    "exportHint": "Select your settings, preview the page, then export one page or all pages.",
    "exporting": "Exporting pages {current}/{total}..."
  },
  "hi": {
    "downloadCurrent": "Download Current Page",
    "exportAll": "Export All Pages (ZIP)",
    "downloadZip": "Download ZIP",
    "exportHint": "Select your settings, preview the page, then export one page or all pages.",
    "exporting": "Exporting pages {current}/{total}..."
  },
  "tr": {
    "downloadCurrent": "Download Current Page",
    "exportAll": "Export All Pages (ZIP)",
    "downloadZip": "Download ZIP",
    "exportHint": "Select your settings, preview the page, then export one page or all pages.",
    "exporting": "Exporting pages {current}/{total}..."
  },
  "nl": {
    "downloadCurrent": "Download Current Page",
    "exportAll": "Export All Pages (ZIP)",
    "downloadZip": "Download ZIP",
    "exportHint": "Select your settings, preview the page, then export one page or all pages.",
    "exporting": "Exporting pages {current}/{total}..."
  },
  "sv": {
    "downloadCurrent": "Download Current Page",
    "exportAll": "Export All Pages (ZIP)",
    "downloadZip": "Download ZIP",
    "exportHint": "Select your settings, preview the page, then export one page or all pages.",
    "exporting": "Exporting pages {current}/{total}..."
  },
  "pl": {
    "downloadCurrent": "Download Current Page",
    "exportAll": "Export All Pages (ZIP)",
    "downloadZip": "Download ZIP",
    "exportHint": "Select your settings, preview the page, then export one page or all pages.",
    "exporting": "Exporting pages {current}/{total}..."
  },
  "vi": {
    "downloadCurrent": "Download Current Page",
    "exportAll": "Export All Pages (ZIP)",
    "downloadZip": "Download ZIP",
    "exportHint": "Select your settings, preview the page, then export one page or all pages.",
    "exporting": "Exporting pages {current}/{total}..."
  },
  "th": {
    "downloadCurrent": "Download Current Page",
    "exportAll": "Export All Pages (ZIP)",
    "downloadZip": "Download ZIP",
    "exportHint": "Select your settings, preview the page, then export one page or all pages.",
    "exporting": "Exporting pages {current}/{total}..."
  },
  "id": {
    "downloadCurrent": "Download Current Page",
    "exportAll": "Export All Pages (ZIP)",
    "downloadZip": "Download ZIP",
    "exportHint": "Select your settings, preview the page, then export one page or all pages.",
    "exporting": "Exporting pages {current}/{total}..."
  },
  "he": {
    "downloadCurrent": "Download Current Page",
    "exportAll": "Export All Pages (ZIP)",
    "downloadZip": "Download ZIP",
    "exportHint": "Select your settings, preview the page, then export one page or all pages.",
    "exporting": "Exporting pages {current}/{total}..."
  },
  "ms": {
    "downloadCurrent": "Download Current Page",
    "exportAll": "Export All Pages (ZIP)",
    "downloadZip": "Download ZIP",
    "exportHint": "Select your settings, preview the page, then export one page or all pages.",
    "exporting": "Exporting pages {current}/{total}..."
  },
  "no": {
    "downloadCurrent": "Download Current Page",
    "exportAll": "Export All Pages (ZIP)",
    "downloadZip": "Download ZIP",
    "exportHint": "Select your settings, preview the page, then export one page or all pages.",
    "exporting": "Exporting pages {current}/{total}..."
  }
}
</i18n>
