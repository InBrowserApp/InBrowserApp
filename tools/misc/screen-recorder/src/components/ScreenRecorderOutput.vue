<template>
  <ToolSectionHeader>{{ t('output') }}</ToolSectionHeader>
  <ToolSection>
    <n-flex vertical :size="12">
      <video class="video-player" :src="recordingUrl" controls />

      <n-grid :cols="2" :x-gap="16" :y-gap="8">
        <n-gi>
          <n-flex vertical :size="4">
            <n-text depth="3">{{ t('format') }}</n-text>
            <n-text>{{ displayMimeType }}</n-text>
          </n-flex>
        </n-gi>
        <n-gi>
          <n-flex vertical :size="4">
            <n-text depth="3">{{ t('fileSize') }}</n-text>
            <n-text>{{ fileSizeLabel }}</n-text>
          </n-flex>
        </n-gi>
      </n-grid>

      <n-flex align="center" :size="8" class="filename-row">
        <n-text depth="3">{{ t('fileName') }}</n-text>
        <n-input
          :value="fileName"
          :placeholder="t('fileNamePlaceholder')"
          @update:value="emit('update:fileName', $event)"
        />
        <n-text>.{{ fileExtension }}</n-text>
      </n-flex>

      <n-flex :size="8">
        <n-button tag="a" type="primary" :href="recordingUrl" :download="downloadName">
          <template #icon>
            <n-icon :component="DownloadIcon" />
          </template>
          {{ t('download') }}
        </n-button>
        <n-button tertiary @click="onClear">
          <template #icon>
            <n-icon :component="ClearIcon" />
          </template>
          {{ t('clear') }}
        </n-button>
      </n-flex>
    </n-flex>
  </ToolSection>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { NButton, NFlex, NGi, NGrid, NIcon, NInput, NText } from 'naive-ui'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import DownloadIcon from '@vicons/fluent/ArrowDownload16Filled'
import ClearIcon from '@vicons/fluent/Delete16Regular'
import { formatFileSize, getExtensionForMimeType } from '../utils/recorder'

const props = defineProps<{
  recordingBlob: Blob | null
  recordingUrl?: string
  mimeType: string
  fileName: string
  onClear: () => void
}>()

const emit = defineEmits<{ 'update:fileName': [string] }>()

const { t } = useI18n({ useScope: 'local' })

const fileExtension = computed(() => getExtensionForMimeType(props.mimeType))
const displayMimeType = computed(() => props.mimeType || t('formatUnknown'))
const fileSizeLabel = computed(() =>
  props.recordingBlob ? formatFileSize(props.recordingBlob.size) : '0 B',
)
const downloadName = computed(() => {
  const base = props.fileName.trim() || t('fileNamePlaceholder')
  return base + '.' + fileExtension.value
})
</script>

<style scoped>
.video-player {
  width: 100%;
}

.filename-row :deep(.n-input) {
  flex: 1;
}
</style>

<i18n lang="json">
{
  "en": {
    "output": "Output",
    "format": "Format",
    "formatUnknown": "Unknown",
    "fileName": "File name",
    "fileNamePlaceholder": "screen-recording",
    "fileSize": "File size",
    "download": "Download",
    "clear": "Clear"
  },
  "zh": {
    "output": "输出",
    "format": "格式",
    "formatUnknown": "未知",
    "fileName": "文件名",
    "fileNamePlaceholder": "屏幕录制",
    "fileSize": "文件大小",
    "download": "下载",
    "clear": "清除"
  },
  "zh-CN": {
    "output": "输出",
    "format": "格式",
    "formatUnknown": "未知",
    "fileName": "文件名",
    "fileNamePlaceholder": "屏幕录制",
    "fileSize": "文件大小",
    "download": "下载",
    "clear": "清除"
  },
  "zh-TW": {
    "output": "輸出",
    "format": "格式",
    "formatUnknown": "未知",
    "fileName": "檔案名稱",
    "fileNamePlaceholder": "螢幕錄製",
    "fileSize": "檔案大小",
    "download": "下載",
    "clear": "清除"
  },
  "zh-HK": {
    "output": "輸出",
    "format": "格式",
    "formatUnknown": "未知",
    "fileName": "檔案名稱",
    "fileNamePlaceholder": "螢幕錄製",
    "fileSize": "檔案大小",
    "download": "下載",
    "clear": "清除"
  },
  "es": {
    "output": "Output",
    "format": "Format",
    "formatUnknown": "Unknown",
    "fileName": "File name",
    "fileNamePlaceholder": "screen-recording",
    "fileSize": "File size",
    "download": "Download",
    "clear": "Clear"
  },
  "fr": {
    "output": "Output",
    "format": "Format",
    "formatUnknown": "Unknown",
    "fileName": "File name",
    "fileNamePlaceholder": "screen-recording",
    "fileSize": "File size",
    "download": "Download",
    "clear": "Clear"
  },
  "de": {
    "output": "Output",
    "format": "Format",
    "formatUnknown": "Unknown",
    "fileName": "File name",
    "fileNamePlaceholder": "screen-recording",
    "fileSize": "File size",
    "download": "Download",
    "clear": "Clear"
  },
  "it": {
    "output": "Output",
    "format": "Format",
    "formatUnknown": "Unknown",
    "fileName": "File name",
    "fileNamePlaceholder": "screen-recording",
    "fileSize": "File size",
    "download": "Download",
    "clear": "Clear"
  },
  "ja": {
    "output": "Output",
    "format": "Format",
    "formatUnknown": "Unknown",
    "fileName": "File name",
    "fileNamePlaceholder": "screen-recording",
    "fileSize": "File size",
    "download": "Download",
    "clear": "Clear"
  },
  "ko": {
    "output": "Output",
    "format": "Format",
    "formatUnknown": "Unknown",
    "fileName": "File name",
    "fileNamePlaceholder": "screen-recording",
    "fileSize": "File size",
    "download": "Download",
    "clear": "Clear"
  },
  "ru": {
    "output": "Output",
    "format": "Format",
    "formatUnknown": "Unknown",
    "fileName": "File name",
    "fileNamePlaceholder": "screen-recording",
    "fileSize": "File size",
    "download": "Download",
    "clear": "Clear"
  },
  "pt": {
    "output": "Output",
    "format": "Format",
    "formatUnknown": "Unknown",
    "fileName": "File name",
    "fileNamePlaceholder": "screen-recording",
    "fileSize": "File size",
    "download": "Download",
    "clear": "Clear"
  },
  "ar": {
    "output": "Output",
    "format": "Format",
    "formatUnknown": "Unknown",
    "fileName": "File name",
    "fileNamePlaceholder": "screen-recording",
    "fileSize": "File size",
    "download": "Download",
    "clear": "Clear"
  },
  "hi": {
    "output": "Output",
    "format": "Format",
    "formatUnknown": "Unknown",
    "fileName": "File name",
    "fileNamePlaceholder": "screen-recording",
    "fileSize": "File size",
    "download": "Download",
    "clear": "Clear"
  },
  "tr": {
    "output": "Output",
    "format": "Format",
    "formatUnknown": "Unknown",
    "fileName": "File name",
    "fileNamePlaceholder": "screen-recording",
    "fileSize": "File size",
    "download": "Download",
    "clear": "Clear"
  },
  "nl": {
    "output": "Output",
    "format": "Format",
    "formatUnknown": "Unknown",
    "fileName": "File name",
    "fileNamePlaceholder": "screen-recording",
    "fileSize": "File size",
    "download": "Download",
    "clear": "Clear"
  },
  "sv": {
    "output": "Output",
    "format": "Format",
    "formatUnknown": "Unknown",
    "fileName": "File name",
    "fileNamePlaceholder": "screen-recording",
    "fileSize": "File size",
    "download": "Download",
    "clear": "Clear"
  },
  "pl": {
    "output": "Output",
    "format": "Format",
    "formatUnknown": "Unknown",
    "fileName": "File name",
    "fileNamePlaceholder": "screen-recording",
    "fileSize": "File size",
    "download": "Download",
    "clear": "Clear"
  },
  "vi": {
    "output": "Output",
    "format": "Format",
    "formatUnknown": "Unknown",
    "fileName": "File name",
    "fileNamePlaceholder": "screen-recording",
    "fileSize": "File size",
    "download": "Download",
    "clear": "Clear"
  },
  "th": {
    "output": "Output",
    "format": "Format",
    "formatUnknown": "Unknown",
    "fileName": "File name",
    "fileNamePlaceholder": "screen-recording",
    "fileSize": "File size",
    "download": "Download",
    "clear": "Clear"
  },
  "id": {
    "output": "Output",
    "format": "Format",
    "formatUnknown": "Unknown",
    "fileName": "File name",
    "fileNamePlaceholder": "screen-recording",
    "fileSize": "File size",
    "download": "Download",
    "clear": "Clear"
  },
  "he": {
    "output": "Output",
    "format": "Format",
    "formatUnknown": "Unknown",
    "fileName": "File name",
    "fileNamePlaceholder": "screen-recording",
    "fileSize": "File size",
    "download": "Download",
    "clear": "Clear"
  },
  "ms": {
    "output": "Output",
    "format": "Format",
    "formatUnknown": "Unknown",
    "fileName": "File name",
    "fileNamePlaceholder": "screen-recording",
    "fileSize": "File size",
    "download": "Download",
    "clear": "Clear"
  },
  "no": {
    "output": "Output",
    "format": "Format",
    "formatUnknown": "Unknown",
    "fileName": "File name",
    "fileNamePlaceholder": "screen-recording",
    "fileSize": "File size",
    "download": "Download",
    "clear": "Clear"
  }
}
</i18n>
