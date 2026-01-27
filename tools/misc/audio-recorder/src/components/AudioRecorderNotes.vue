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
    "offlineNote": "Uses your local microphone only (offline).",
    "formatNote": "Output format depends on the browser (WebM/Opus, OGG, or M4A).",
    "permissionNote": "Allow microphone access when prompted."
  },
  "zh": {
    "notes": "说明",
    "offlineNote": "仅使用本地麦克风（离线）。",
    "formatNote": "输出格式取决于浏览器（WebM/Opus、OGG 或 M4A）。",
    "permissionNote": "弹出提示时请允许麦克风访问。"
  },
  "zh-CN": {
    "notes": "说明",
    "offlineNote": "仅使用本地麦克风（离线）。",
    "formatNote": "输出格式取决于浏览器（WebM/Opus、OGG 或 M4A）。",
    "permissionNote": "弹出提示时请允许麦克风访问。"
  },
  "zh-TW": {
    "notes": "說明",
    "offlineNote": "僅使用本機麥克風（離線）。",
    "formatNote": "輸出格式取決於瀏覽器（WebM/Opus、OGG 或 M4A）。",
    "permissionNote": "出現提示時請允許麥克風存取。"
  },
  "zh-HK": {
    "notes": "說明",
    "offlineNote": "僅使用本機麥克風（離線）。",
    "formatNote": "輸出格式取決於瀏覽器（WebM/Opus、OGG 或 M4A）。",
    "permissionNote": "出現提示時請允許麥克風存取。"
  },
  "es": {
    "notes": "Notes",
    "offlineNote": "Uses your local microphone only (offline).",
    "formatNote": "Output format depends on the browser (WebM/Opus, OGG, or M4A).",
    "permissionNote": "Allow microphone access when prompted."
  },
  "fr": {
    "notes": "Notes",
    "offlineNote": "Uses your local microphone only (offline).",
    "formatNote": "Output format depends on the browser (WebM/Opus, OGG, or M4A).",
    "permissionNote": "Allow microphone access when prompted."
  },
  "de": {
    "notes": "Notes",
    "offlineNote": "Uses your local microphone only (offline).",
    "formatNote": "Output format depends on the browser (WebM/Opus, OGG, or M4A).",
    "permissionNote": "Allow microphone access when prompted."
  },
  "it": {
    "notes": "Notes",
    "offlineNote": "Uses your local microphone only (offline).",
    "formatNote": "Output format depends on the browser (WebM/Opus, OGG, or M4A).",
    "permissionNote": "Allow microphone access when prompted."
  },
  "ja": {
    "notes": "Notes",
    "offlineNote": "Uses your local microphone only (offline).",
    "formatNote": "Output format depends on the browser (WebM/Opus, OGG, or M4A).",
    "permissionNote": "Allow microphone access when prompted."
  },
  "ko": {
    "notes": "Notes",
    "offlineNote": "Uses your local microphone only (offline).",
    "formatNote": "Output format depends on the browser (WebM/Opus, OGG, or M4A).",
    "permissionNote": "Allow microphone access when prompted."
  },
  "ru": {
    "notes": "Notes",
    "offlineNote": "Uses your local microphone only (offline).",
    "formatNote": "Output format depends on the browser (WebM/Opus, OGG, or M4A).",
    "permissionNote": "Allow microphone access when prompted."
  },
  "pt": {
    "notes": "Notes",
    "offlineNote": "Uses your local microphone only (offline).",
    "formatNote": "Output format depends on the browser (WebM/Opus, OGG, or M4A).",
    "permissionNote": "Allow microphone access when prompted."
  },
  "ar": {
    "notes": "Notes",
    "offlineNote": "Uses your local microphone only (offline).",
    "formatNote": "Output format depends on the browser (WebM/Opus, OGG, or M4A).",
    "permissionNote": "Allow microphone access when prompted."
  },
  "hi": {
    "notes": "Notes",
    "offlineNote": "Uses your local microphone only (offline).",
    "formatNote": "Output format depends on the browser (WebM/Opus, OGG, or M4A).",
    "permissionNote": "Allow microphone access when prompted."
  },
  "tr": {
    "notes": "Notes",
    "offlineNote": "Uses your local microphone only (offline).",
    "formatNote": "Output format depends on the browser (WebM/Opus, OGG, or M4A).",
    "permissionNote": "Allow microphone access when prompted."
  },
  "nl": {
    "notes": "Notes",
    "offlineNote": "Uses your local microphone only (offline).",
    "formatNote": "Output format depends on the browser (WebM/Opus, OGG, or M4A).",
    "permissionNote": "Allow microphone access when prompted."
  },
  "sv": {
    "notes": "Notes",
    "offlineNote": "Uses your local microphone only (offline).",
    "formatNote": "Output format depends on the browser (WebM/Opus, OGG, or M4A).",
    "permissionNote": "Allow microphone access when prompted."
  },
  "pl": {
    "notes": "Notes",
    "offlineNote": "Uses your local microphone only (offline).",
    "formatNote": "Output format depends on the browser (WebM/Opus, OGG, or M4A).",
    "permissionNote": "Allow microphone access when prompted."
  },
  "vi": {
    "notes": "Notes",
    "offlineNote": "Uses your local microphone only (offline).",
    "formatNote": "Output format depends on the browser (WebM/Opus, OGG, or M4A).",
    "permissionNote": "Allow microphone access when prompted."
  },
  "th": {
    "notes": "Notes",
    "offlineNote": "Uses your local microphone only (offline).",
    "formatNote": "Output format depends on the browser (WebM/Opus, OGG, or M4A).",
    "permissionNote": "Allow microphone access when prompted."
  },
  "id": {
    "notes": "Notes",
    "offlineNote": "Uses your local microphone only (offline).",
    "formatNote": "Output format depends on the browser (WebM/Opus, OGG, or M4A).",
    "permissionNote": "Allow microphone access when prompted."
  },
  "he": {
    "notes": "Notes",
    "offlineNote": "Uses your local microphone only (offline).",
    "formatNote": "Output format depends on the browser (WebM/Opus, OGG, or M4A).",
    "permissionNote": "Allow microphone access when prompted."
  },
  "ms": {
    "notes": "Notes",
    "offlineNote": "Uses your local microphone only (offline).",
    "formatNote": "Output format depends on the browser (WebM/Opus, OGG, or M4A).",
    "permissionNote": "Allow microphone access when prompted."
  },
  "no": {
    "notes": "Notes",
    "offlineNote": "Uses your local microphone only (offline).",
    "formatNote": "Output format depends on the browser (WebM/Opus, OGG, or M4A).",
    "permissionNote": "Allow microphone access when prompted."
  }
}
</i18n>
