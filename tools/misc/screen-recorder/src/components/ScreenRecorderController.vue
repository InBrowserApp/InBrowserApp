<template>
  <ScreenRecorderControls
    :is-supported="isSupported"
    :permission-denied="permissionDenied"
    :microphone-denied="microphoneDenied"
    :error-message="errorMessage"
    :is-preparing="isPreparing"
    :is-recording="isRecording"
    :is-paused="isPaused"
    :formatted-duration="formattedDuration"
    :retry-permission-label="t('retryPermission')"
    :on-start="startRecording"
    :on-pause="pauseRecording"
    :on-resume="resumeRecording"
    :on-stop="stopRecording"
  />

  <ScreenRecorderSettings
    v-model:include-system-audio="includeSystemAudio"
    v-model:include-microphone="includeMicrophone"
    :settings-disabled="settingsDisabled"
    :is-mic-supported="isMicSupported"
  />

  <ScreenRecorderOutput
    v-if="recordingBlob"
    v-model:file-name="fileName"
    :recording-blob="recordingBlob"
    :recording-url="recordingUrl"
    :mime-type="mimeType"
    :on-clear="clearRecording"
  />

  <ScreenRecorderNotes />
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import ScreenRecorderControls from './ScreenRecorderControls.vue'
import ScreenRecorderNotes from './ScreenRecorderNotes.vue'
import ScreenRecorderOutput from './ScreenRecorderOutput.vue'
import ScreenRecorderSettings from './ScreenRecorderSettings.vue'
import { useScreenRecorder } from '../composables/useScreenRecorder'

const { t } = useI18n({ useScope: 'local' })
const messages = {
  microphoneNotSupported: () => t('microphoneNotSupported'),
  recordingFailed: () => t('recordingFailed'),
  formatUnknown: () => t('formatUnknown'),
  fileNamePlaceholder: () => t('fileNamePlaceholder'),
}

const {
  permissionDenied,
  microphoneDenied,
  errorMessage,
  isPreparing,
  includeSystemAudio,
  includeMicrophone,
  isSupported,
  isMicSupported,
  isRecording,
  isPaused,
  settingsDisabled,
  formattedDuration,
  displayMimeType,
  fileSizeLabel,
  downloadName,
  recordingBlob,
  recordingUrl,
  mimeType,
  fileName,
  elapsedMs,
  startRecording,
  pauseRecording,
  resumeRecording,
  stopRecording,
  clearRecording,
} = useScreenRecorder(messages)

defineExpose({ displayMimeType, fileSizeLabel, downloadName, elapsedMs })
</script>

<i18n lang="json">
{
  "en": {
    "microphoneNotSupported": "Microphone capture is not supported in this browser.",
    "recordingFailed": "Failed to start recording.",
    "retryPermission": "Retry",
    "formatUnknown": "Unknown",
    "fileNamePlaceholder": "screen-recording"
  },
  "zh": {
    "microphoneNotSupported": "当前浏览器不支持麦克风录制。",
    "recordingFailed": "无法开始录制。",
    "retryPermission": "重试",
    "formatUnknown": "未知",
    "fileNamePlaceholder": "屏幕录制"
  },
  "zh-CN": {
    "microphoneNotSupported": "当前浏览器不支持麦克风录制。",
    "recordingFailed": "无法开始录制。",
    "retryPermission": "重试",
    "formatUnknown": "未知",
    "fileNamePlaceholder": "屏幕录制"
  },
  "zh-TW": {
    "microphoneNotSupported": "目前瀏覽器不支援麥克風錄製。",
    "recordingFailed": "無法開始錄製。",
    "retryPermission": "重試",
    "formatUnknown": "未知",
    "fileNamePlaceholder": "螢幕錄製"
  },
  "zh-HK": {
    "microphoneNotSupported": "目前瀏覽器不支援麥克風錄製。",
    "recordingFailed": "無法開始錄製。",
    "retryPermission": "重試",
    "formatUnknown": "未知",
    "fileNamePlaceholder": "螢幕錄製"
  },
  "es": {
    "microphoneNotSupported": "Microphone capture is not supported in this browser.",
    "recordingFailed": "Failed to start recording.",
    "retryPermission": "Retry",
    "formatUnknown": "Unknown",
    "fileNamePlaceholder": "screen-recording"
  },
  "fr": {
    "microphoneNotSupported": "Microphone capture is not supported in this browser.",
    "recordingFailed": "Failed to start recording.",
    "retryPermission": "Retry",
    "formatUnknown": "Unknown",
    "fileNamePlaceholder": "screen-recording"
  },
  "de": {
    "microphoneNotSupported": "Microphone capture is not supported in this browser.",
    "recordingFailed": "Failed to start recording.",
    "retryPermission": "Retry",
    "formatUnknown": "Unknown",
    "fileNamePlaceholder": "screen-recording"
  },
  "it": {
    "microphoneNotSupported": "Microphone capture is not supported in this browser.",
    "recordingFailed": "Failed to start recording.",
    "retryPermission": "Retry",
    "formatUnknown": "Unknown",
    "fileNamePlaceholder": "screen-recording"
  },
  "ja": {
    "microphoneNotSupported": "Microphone capture is not supported in this browser.",
    "recordingFailed": "Failed to start recording.",
    "retryPermission": "Retry",
    "formatUnknown": "Unknown",
    "fileNamePlaceholder": "screen-recording"
  },
  "ko": {
    "microphoneNotSupported": "Microphone capture is not supported in this browser.",
    "recordingFailed": "Failed to start recording.",
    "retryPermission": "Retry",
    "formatUnknown": "Unknown",
    "fileNamePlaceholder": "screen-recording"
  },
  "ru": {
    "microphoneNotSupported": "Microphone capture is not supported in this browser.",
    "recordingFailed": "Failed to start recording.",
    "retryPermission": "Retry",
    "formatUnknown": "Unknown",
    "fileNamePlaceholder": "screen-recording"
  },
  "pt": {
    "microphoneNotSupported": "Microphone capture is not supported in this browser.",
    "recordingFailed": "Failed to start recording.",
    "retryPermission": "Retry",
    "formatUnknown": "Unknown",
    "fileNamePlaceholder": "screen-recording"
  },
  "ar": {
    "microphoneNotSupported": "Microphone capture is not supported in this browser.",
    "recordingFailed": "Failed to start recording.",
    "retryPermission": "Retry",
    "formatUnknown": "Unknown",
    "fileNamePlaceholder": "screen-recording"
  },
  "hi": {
    "microphoneNotSupported": "Microphone capture is not supported in this browser.",
    "recordingFailed": "Failed to start recording.",
    "retryPermission": "Retry",
    "formatUnknown": "Unknown",
    "fileNamePlaceholder": "screen-recording"
  },
  "tr": {
    "microphoneNotSupported": "Microphone capture is not supported in this browser.",
    "recordingFailed": "Failed to start recording.",
    "retryPermission": "Retry",
    "formatUnknown": "Unknown",
    "fileNamePlaceholder": "screen-recording"
  },
  "nl": {
    "microphoneNotSupported": "Microphone capture is not supported in this browser.",
    "recordingFailed": "Failed to start recording.",
    "retryPermission": "Retry",
    "formatUnknown": "Unknown",
    "fileNamePlaceholder": "screen-recording"
  },
  "sv": {
    "microphoneNotSupported": "Microphone capture is not supported in this browser.",
    "recordingFailed": "Failed to start recording.",
    "retryPermission": "Retry",
    "formatUnknown": "Unknown",
    "fileNamePlaceholder": "screen-recording"
  },
  "pl": {
    "microphoneNotSupported": "Microphone capture is not supported in this browser.",
    "recordingFailed": "Failed to start recording.",
    "retryPermission": "Retry",
    "formatUnknown": "Unknown",
    "fileNamePlaceholder": "screen-recording"
  },
  "vi": {
    "microphoneNotSupported": "Microphone capture is not supported in this browser.",
    "recordingFailed": "Failed to start recording.",
    "retryPermission": "Retry",
    "formatUnknown": "Unknown",
    "fileNamePlaceholder": "screen-recording"
  },
  "th": {
    "microphoneNotSupported": "Microphone capture is not supported in this browser.",
    "recordingFailed": "Failed to start recording.",
    "retryPermission": "Retry",
    "formatUnknown": "Unknown",
    "fileNamePlaceholder": "screen-recording"
  },
  "id": {
    "microphoneNotSupported": "Microphone capture is not supported in this browser.",
    "recordingFailed": "Failed to start recording.",
    "retryPermission": "Retry",
    "formatUnknown": "Unknown",
    "fileNamePlaceholder": "screen-recording"
  },
  "he": {
    "microphoneNotSupported": "Microphone capture is not supported in this browser.",
    "recordingFailed": "Failed to start recording.",
    "retryPermission": "Retry",
    "formatUnknown": "Unknown",
    "fileNamePlaceholder": "screen-recording"
  },
  "ms": {
    "microphoneNotSupported": "Microphone capture is not supported in this browser.",
    "recordingFailed": "Failed to start recording.",
    "retryPermission": "Retry",
    "formatUnknown": "Unknown",
    "fileNamePlaceholder": "screen-recording"
  },
  "no": {
    "microphoneNotSupported": "Microphone capture is not supported in this browser.",
    "recordingFailed": "Failed to start recording.",
    "retryPermission": "Retry",
    "formatUnknown": "Unknown",
    "fileNamePlaceholder": "screen-recording"
  }
}
</i18n>
