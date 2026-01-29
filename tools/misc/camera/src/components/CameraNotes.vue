<template>
  <ToolSectionHeader>{{ t('notes') }}</ToolSectionHeader>
  <ToolSection>
    <n-flex vertical :size="6">
      <n-text>{{ t('offlineNote') }}</n-text>
      <n-text>{{ t('formatNote') }}</n-text>
      <n-text>{{ t('permissionNote') }}</n-text>
    </n-flex>
  </ToolSection>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { NFlex, NText } from 'naive-ui'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'

const { t } = useI18n({ useScope: 'local' })
</script>

<i18n lang="json">
{
  "en": {
    "notes": "Notes",
    "offlineNote": "Uses your local device only (offline).",
    "formatNote": "Photo format is JPEG; video format depends on the browser (MP4/WebM).",
    "permissionNote": "Allow camera/microphone access when prompted."
  },
  "zh": {
    "notes": "说明",
    "offlineNote": "仅使用本地设备（离线）。",
    "formatNote": "照片为 JPEG，视频格式取决于浏览器（MP4/WebM）。",
    "permissionNote": "弹出提示时请允许摄像头/麦克风访问。"
  },
  "zh-CN": {
    "notes": "说明",
    "offlineNote": "仅使用本地设备（离线）。",
    "formatNote": "照片为 JPEG，视频格式取决于浏览器（MP4/WebM）。",
    "permissionNote": "弹出提示时请允许摄像头/麦克风访问。"
  },
  "zh-TW": {
    "notes": "說明",
    "offlineNote": "僅使用本機裝置（離線）。",
    "formatNote": "照片為 JPEG，影片格式取決於瀏覽器（MP4/WebM）。",
    "permissionNote": "彈出提示時請允許攝影機/麥克風存取。"
  },
  "zh-HK": {
    "notes": "說明",
    "offlineNote": "僅使用本機裝置（離線）。",
    "formatNote": "照片為 JPEG，影片格式取決於瀏覽器（MP4/WebM）。",
    "permissionNote": "彈出提示時請允許攝影機/麥克風存取。"
  },
  "es": {
    "notes": "Notes",
    "offlineNote": "Uses your local device only (offline).",
    "formatNote": "Photo format is JPEG; video format depends on the browser (MP4/WebM).",
    "permissionNote": "Allow camera/microphone access when prompted."
  },
  "fr": {
    "notes": "Notes",
    "offlineNote": "Uses your local device only (offline).",
    "formatNote": "Photo format is JPEG; video format depends on the browser (MP4/WebM).",
    "permissionNote": "Allow camera/microphone access when prompted."
  },
  "de": {
    "notes": "Notes",
    "offlineNote": "Uses your local device only (offline).",
    "formatNote": "Photo format is JPEG; video format depends on the browser (MP4/WebM).",
    "permissionNote": "Allow camera/microphone access when prompted."
  },
  "it": {
    "notes": "Notes",
    "offlineNote": "Uses your local device only (offline).",
    "formatNote": "Photo format is JPEG; video format depends on the browser (MP4/WebM).",
    "permissionNote": "Allow camera/microphone access when prompted."
  },
  "ja": {
    "notes": "Notes",
    "offlineNote": "Uses your local device only (offline).",
    "formatNote": "Photo format is JPEG; video format depends on the browser (MP4/WebM).",
    "permissionNote": "Allow camera/microphone access when prompted."
  },
  "ko": {
    "notes": "Notes",
    "offlineNote": "Uses your local device only (offline).",
    "formatNote": "Photo format is JPEG; video format depends on the browser (MP4/WebM).",
    "permissionNote": "Allow camera/microphone access when prompted."
  },
  "ru": {
    "notes": "Notes",
    "offlineNote": "Uses your local device only (offline).",
    "formatNote": "Photo format is JPEG; video format depends on the browser (MP4/WebM).",
    "permissionNote": "Allow camera/microphone access when prompted."
  },
  "pt": {
    "notes": "Notes",
    "offlineNote": "Uses your local device only (offline).",
    "formatNote": "Photo format is JPEG; video format depends on the browser (MP4/WebM).",
    "permissionNote": "Allow camera/microphone access when prompted."
  },
  "ar": {
    "notes": "Notes",
    "offlineNote": "Uses your local device only (offline).",
    "formatNote": "Photo format is JPEG; video format depends on the browser (MP4/WebM).",
    "permissionNote": "Allow camera/microphone access when prompted."
  },
  "hi": {
    "notes": "Notes",
    "offlineNote": "Uses your local device only (offline).",
    "formatNote": "Photo format is JPEG; video format depends on the browser (MP4/WebM).",
    "permissionNote": "Allow camera/microphone access when prompted."
  },
  "tr": {
    "notes": "Notes",
    "offlineNote": "Uses your local device only (offline).",
    "formatNote": "Photo format is JPEG; video format depends on the browser (MP4/WebM).",
    "permissionNote": "Allow camera/microphone access when prompted."
  },
  "nl": {
    "notes": "Notes",
    "offlineNote": "Uses your local device only (offline).",
    "formatNote": "Photo format is JPEG; video format depends on the browser (MP4/WebM).",
    "permissionNote": "Allow camera/microphone access when prompted."
  },
  "sv": {
    "notes": "Notes",
    "offlineNote": "Uses your local device only (offline).",
    "formatNote": "Photo format is JPEG; video format depends on the browser (MP4/WebM).",
    "permissionNote": "Allow camera/microphone access when prompted."
  },
  "pl": {
    "notes": "Notes",
    "offlineNote": "Uses your local device only (offline).",
    "formatNote": "Photo format is JPEG; video format depends on the browser (MP4/WebM).",
    "permissionNote": "Allow camera/microphone access when prompted."
  },
  "vi": {
    "notes": "Notes",
    "offlineNote": "Uses your local device only (offline).",
    "formatNote": "Photo format is JPEG; video format depends on the browser (MP4/WebM).",
    "permissionNote": "Allow camera/microphone access when prompted."
  },
  "th": {
    "notes": "Notes",
    "offlineNote": "Uses your local device only (offline).",
    "formatNote": "Photo format is JPEG; video format depends on the browser (MP4/WebM).",
    "permissionNote": "Allow camera/microphone access when prompted."
  },
  "id": {
    "notes": "Notes",
    "offlineNote": "Uses your local device only (offline).",
    "formatNote": "Photo format is JPEG; video format depends on the browser (MP4/WebM).",
    "permissionNote": "Allow camera/microphone access when prompted."
  },
  "he": {
    "notes": "Notes",
    "offlineNote": "Uses your local device only (offline).",
    "formatNote": "Photo format is JPEG; video format depends on the browser (MP4/WebM).",
    "permissionNote": "Allow camera/microphone access when prompted."
  },
  "ms": {
    "notes": "Notes",
    "offlineNote": "Uses your local device only (offline).",
    "formatNote": "Photo format is JPEG; video format depends on the browser (MP4/WebM).",
    "permissionNote": "Allow camera/microphone access when prompted."
  },
  "no": {
    "notes": "Notes",
    "offlineNote": "Uses your local device only (offline).",
    "formatNote": "Photo format is JPEG; video format depends on the browser (MP4/WebM).",
    "permissionNote": "Allow camera/microphone access when prompted."
  }
}
</i18n>
