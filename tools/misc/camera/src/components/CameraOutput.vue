<template>
  <ToolSectionHeader>{{ t('output') }}</ToolSectionHeader>
  <ToolSection>
    <n-flex vertical :size="12">
      <img v-if="outputKind === 'photo'" class="output-media" :src="outputUrl" alt="" />
      <video v-else class="output-media" :src="outputUrl" controls />

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

      <n-flex :size="8">
        <n-button tag="a" type="primary" :href="outputUrl" :download="downloadName">
          <template #icon>
            <n-icon :component="DownloadIcon" />
          </template>
          {{ t('download') }}
        </n-button>
        <n-button tertiary @click="emit('clear')">
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
import { useI18n } from 'vue-i18n'
import { NButton, NFlex, NGi, NGrid, NIcon, NText } from 'naive-ui'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import DownloadIcon from '@vicons/fluent/ArrowDownload16Filled'
import ClearIcon from '@vicons/fluent/Delete16Regular'

defineProps<{
  outputKind: 'photo' | 'video' | ''
  outputUrl: string
  displayMimeType: string
  fileSizeLabel: string
  downloadName: string
}>()

const emit = defineEmits<{ (event: 'clear'): void }>()

const { t } = useI18n({ useScope: 'local' })
</script>

<style scoped>
.output-media {
  width: 100%;
  border-radius: 12px;
  background: #000;
}
</style>

<i18n lang="json">
{
  "en": {
    "output": "Output",
    "format": "Format",
    "fileSize": "File size",
    "download": "Download",
    "clear": "Clear"
  },
  "zh": {
    "output": "输出",
    "format": "格式",
    "fileSize": "文件大小",
    "download": "下载",
    "clear": "清除"
  },
  "zh-CN": {
    "output": "输出",
    "format": "格式",
    "fileSize": "文件大小",
    "download": "下载",
    "clear": "清除"
  },
  "zh-TW": {
    "output": "輸出",
    "format": "格式",
    "fileSize": "檔案大小",
    "download": "下載",
    "clear": "清除"
  },
  "zh-HK": {
    "output": "輸出",
    "format": "格式",
    "fileSize": "檔案大小",
    "download": "下載",
    "clear": "清除"
  },
  "es": {
    "output": "Output",
    "format": "Format",
    "fileSize": "File size",
    "download": "Download",
    "clear": "Clear"
  },
  "fr": {
    "output": "Output",
    "format": "Format",
    "fileSize": "File size",
    "download": "Download",
    "clear": "Clear"
  },
  "de": {
    "output": "Output",
    "format": "Format",
    "fileSize": "File size",
    "download": "Download",
    "clear": "Clear"
  },
  "it": {
    "output": "Output",
    "format": "Format",
    "fileSize": "File size",
    "download": "Download",
    "clear": "Clear"
  },
  "ja": {
    "output": "Output",
    "format": "Format",
    "fileSize": "File size",
    "download": "Download",
    "clear": "Clear"
  },
  "ko": {
    "output": "Output",
    "format": "Format",
    "fileSize": "File size",
    "download": "Download",
    "clear": "Clear"
  },
  "ru": {
    "output": "Output",
    "format": "Format",
    "fileSize": "File size",
    "download": "Download",
    "clear": "Clear"
  },
  "pt": {
    "output": "Output",
    "format": "Format",
    "fileSize": "File size",
    "download": "Download",
    "clear": "Clear"
  },
  "ar": {
    "output": "Output",
    "format": "Format",
    "fileSize": "File size",
    "download": "Download",
    "clear": "Clear"
  },
  "hi": {
    "output": "Output",
    "format": "Format",
    "fileSize": "File size",
    "download": "Download",
    "clear": "Clear"
  },
  "tr": {
    "output": "Output",
    "format": "Format",
    "fileSize": "File size",
    "download": "Download",
    "clear": "Clear"
  },
  "nl": {
    "output": "Output",
    "format": "Format",
    "fileSize": "File size",
    "download": "Download",
    "clear": "Clear"
  },
  "sv": {
    "output": "Output",
    "format": "Format",
    "fileSize": "File size",
    "download": "Download",
    "clear": "Clear"
  },
  "pl": {
    "output": "Output",
    "format": "Format",
    "fileSize": "File size",
    "download": "Download",
    "clear": "Clear"
  },
  "vi": {
    "output": "Output",
    "format": "Format",
    "fileSize": "File size",
    "download": "Download",
    "clear": "Clear"
  },
  "th": {
    "output": "Output",
    "format": "Format",
    "fileSize": "File size",
    "download": "Download",
    "clear": "Clear"
  },
  "id": {
    "output": "Output",
    "format": "Format",
    "fileSize": "File size",
    "download": "Download",
    "clear": "Clear"
  },
  "he": {
    "output": "Output",
    "format": "Format",
    "fileSize": "File size",
    "download": "Download",
    "clear": "Clear"
  },
  "ms": {
    "output": "Output",
    "format": "Format",
    "fileSize": "File size",
    "download": "Download",
    "clear": "Clear"
  },
  "no": {
    "output": "Output",
    "format": "Format",
    "fileSize": "File size",
    "download": "Download",
    "clear": "Clear"
  }
}
</i18n>
