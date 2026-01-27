<template>
  <ToolSectionHeader>{{ t('notes') }}</ToolSectionHeader>
  <ToolSection>
    <n-flex vertical :size="6">
      <n-text>{{ t('sourceNote') }}</n-text>
      <n-text>{{ t('audioNote') }}</n-text>
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
    "sourceNote": "Uses browser screen sharing to record your screen, window, or tab (offline).",
    "audioNote": "System audio depends on browser support; microphone can be included separately.",
    "permissionNote": "Allow screen sharing and microphone access when prompted."
  },
  "zh": {
    "notes": "说明",
    "sourceNote": "使用浏览器屏幕共享录制屏幕、窗口或标签页（离线）。",
    "audioNote": "系统声音取决于浏览器支持情况；可单独加入麦克风。",
    "permissionNote": "弹出提示时请允许屏幕共享与麦克风访问。"
  },
  "zh-CN": {
    "notes": "说明",
    "sourceNote": "使用浏览器屏幕共享录制屏幕、窗口或标签页（离线）。",
    "audioNote": "系统声音取决于浏览器支持情况；可单独加入麦克风。",
    "permissionNote": "弹出提示时请允许屏幕共享与麦克风访问。"
  },
  "zh-TW": {
    "notes": "說明",
    "sourceNote": "使用瀏覽器螢幕共享錄製螢幕、視窗或分頁（離線）。",
    "audioNote": "系統聲音取決於瀏覽器支援；可單獨加入麥克風。",
    "permissionNote": "出現提示時請允許螢幕共享與麥克風存取。"
  },
  "zh-HK": {
    "notes": "說明",
    "sourceNote": "使用瀏覽器螢幕共享錄製螢幕、視窗或分頁（離線）。",
    "audioNote": "系統聲音取決於瀏覽器支援；可單獨加入麥克風。",
    "permissionNote": "出現提示時請允許螢幕共享與麥克風存取。"
  },
  "es": {
    "notes": "Notes",
    "sourceNote": "Uses browser screen sharing to record your screen, window, or tab (offline).",
    "audioNote": "System audio depends on browser support; microphone can be included separately.",
    "permissionNote": "Allow screen sharing and microphone access when prompted."
  },
  "fr": {
    "notes": "Notes",
    "sourceNote": "Uses browser screen sharing to record your screen, window, or tab (offline).",
    "audioNote": "System audio depends on browser support; microphone can be included separately.",
    "permissionNote": "Allow screen sharing and microphone access when prompted."
  },
  "de": {
    "notes": "Notes",
    "sourceNote": "Uses browser screen sharing to record your screen, window, or tab (offline).",
    "audioNote": "System audio depends on browser support; microphone can be included separately.",
    "permissionNote": "Allow screen sharing and microphone access when prompted."
  },
  "it": {
    "notes": "Notes",
    "sourceNote": "Uses browser screen sharing to record your screen, window, or tab (offline).",
    "audioNote": "System audio depends on browser support; microphone can be included separately.",
    "permissionNote": "Allow screen sharing and microphone access when prompted."
  },
  "ja": {
    "notes": "Notes",
    "sourceNote": "Uses browser screen sharing to record your screen, window, or tab (offline).",
    "audioNote": "System audio depends on browser support; microphone can be included separately.",
    "permissionNote": "Allow screen sharing and microphone access when prompted."
  },
  "ko": {
    "notes": "Notes",
    "sourceNote": "Uses browser screen sharing to record your screen, window, or tab (offline).",
    "audioNote": "System audio depends on browser support; microphone can be included separately.",
    "permissionNote": "Allow screen sharing and microphone access when prompted."
  },
  "ru": {
    "notes": "Notes",
    "sourceNote": "Uses browser screen sharing to record your screen, window, or tab (offline).",
    "audioNote": "System audio depends on browser support; microphone can be included separately.",
    "permissionNote": "Allow screen sharing and microphone access when prompted."
  },
  "pt": {
    "notes": "Notes",
    "sourceNote": "Uses browser screen sharing to record your screen, window, or tab (offline).",
    "audioNote": "System audio depends on browser support; microphone can be included separately.",
    "permissionNote": "Allow screen sharing and microphone access when prompted."
  },
  "ar": {
    "notes": "Notes",
    "sourceNote": "Uses browser screen sharing to record your screen, window, or tab (offline).",
    "audioNote": "System audio depends on browser support; microphone can be included separately.",
    "permissionNote": "Allow screen sharing and microphone access when prompted."
  },
  "hi": {
    "notes": "Notes",
    "sourceNote": "Uses browser screen sharing to record your screen, window, or tab (offline).",
    "audioNote": "System audio depends on browser support; microphone can be included separately.",
    "permissionNote": "Allow screen sharing and microphone access when prompted."
  },
  "tr": {
    "notes": "Notes",
    "sourceNote": "Uses browser screen sharing to record your screen, window, or tab (offline).",
    "audioNote": "System audio depends on browser support; microphone can be included separately.",
    "permissionNote": "Allow screen sharing and microphone access when prompted."
  },
  "nl": {
    "notes": "Notes",
    "sourceNote": "Uses browser screen sharing to record your screen, window, or tab (offline).",
    "audioNote": "System audio depends on browser support; microphone can be included separately.",
    "permissionNote": "Allow screen sharing and microphone access when prompted."
  },
  "sv": {
    "notes": "Notes",
    "sourceNote": "Uses browser screen sharing to record your screen, window, or tab (offline).",
    "audioNote": "System audio depends on browser support; microphone can be included separately.",
    "permissionNote": "Allow screen sharing and microphone access when prompted."
  },
  "pl": {
    "notes": "Notes",
    "sourceNote": "Uses browser screen sharing to record your screen, window, or tab (offline).",
    "audioNote": "System audio depends on browser support; microphone can be included separately.",
    "permissionNote": "Allow screen sharing and microphone access when prompted."
  },
  "vi": {
    "notes": "Notes",
    "sourceNote": "Uses browser screen sharing to record your screen, window, or tab (offline).",
    "audioNote": "System audio depends on browser support; microphone can be included separately.",
    "permissionNote": "Allow screen sharing and microphone access when prompted."
  },
  "th": {
    "notes": "Notes",
    "sourceNote": "Uses browser screen sharing to record your screen, window, or tab (offline).",
    "audioNote": "System audio depends on browser support; microphone can be included separately.",
    "permissionNote": "Allow screen sharing and microphone access when prompted."
  },
  "id": {
    "notes": "Notes",
    "sourceNote": "Uses browser screen sharing to record your screen, window, or tab (offline).",
    "audioNote": "System audio depends on browser support; microphone can be included separately.",
    "permissionNote": "Allow screen sharing and microphone access when prompted."
  },
  "he": {
    "notes": "Notes",
    "sourceNote": "Uses browser screen sharing to record your screen, window, or tab (offline).",
    "audioNote": "System audio depends on browser support; microphone can be included separately.",
    "permissionNote": "Allow screen sharing and microphone access when prompted."
  },
  "ms": {
    "notes": "Notes",
    "sourceNote": "Uses browser screen sharing to record your screen, window, or tab (offline).",
    "audioNote": "System audio depends on browser support; microphone can be included separately.",
    "permissionNote": "Allow screen sharing and microphone access when prompted."
  },
  "no": {
    "notes": "Notes",
    "sourceNote": "Uses browser screen sharing to record your screen, window, or tab (offline).",
    "audioNote": "System audio depends on browser support; microphone can be included separately.",
    "permissionNote": "Allow screen sharing and microphone access when prompted."
  }
}
</i18n>
