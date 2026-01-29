<template>
  <CameraViewfinder
    :viewfinder-aspect-ratio="viewfinderAspectRatio"
    :is-supported="isSupported"
    :permission-denied="permissionDenied"
    :error-message="errorMessage"
    :is-preparing="isPreparing"
    :torch-supported="torchSupported"
    :torch-enabled="torchEnabled"
    :is-video-mode="isVideoMode"
    :mic-enabled="micEnabled"
    :is-recording="isRecording"
    :formatted-duration="formattedDuration"
    :can-switch-mode="canSwitchMode"
    :zoom-supported="zoomSupported"
    :zoom-value="zoomValue"
    :zoom-min="zoomMin"
    :zoom-max="zoomMax"
    :zoom-step="zoomStep"
    :zoom-display="zoomDisplay"
    :output-blob="outputBlob"
    :output-kind="outputKind"
    :output-url="outputUrl"
    :mode="mode"
    :shutter-disabled="shutterDisabled"
    :is-recorder-supported="isRecorderSupported"
    @retry-permission="startCamera"
    @toggle-torch="toggleTorch"
    @toggle-mic="toggleMic"
    @switch-camera="switchCamera"
    @apply-zoom="applyZoom"
    @set-mode="setMode"
    @shutter="handleShutter"
  >
    <template #preview>
      <video
        ref="previewRef"
        class="preview-video"
        :class="{ mirrored: isMirrored }"
        autoplay
        playsinline
        muted
      />
    </template>
  </CameraViewfinder>

  <CameraOutput
    v-if="outputBlob"
    :output-kind="outputKind"
    :output-url="outputUrl"
    :display-mime-type="displayMimeType"
    :file-size-label="fileSizeLabel"
    :download-name="downloadName"
    @clear="clearOutput"
  />

  <CameraNotes />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import CameraNotes from './CameraNotes.vue'
import CameraOutput from './CameraOutput.vue'
import CameraViewfinder from './CameraViewfinder.vue'
import { useCameraController } from '../composables/useCameraController'

const { t } = useI18n({ useScope: 'local' })

const labels = computed(() => ({
  formatUnknown: t('formatUnknown'),
  photoName: t('photoName'),
  videoName: t('videoName'),
  cameraNotReady: t('cameraNotReady'),
  cameraError: t('cameraError'),
  videoNotSupported: t('videoNotSupported'),
  recordingFailed: t('recordingFailed'),
}))

const {
  previewRef,
  viewfinderAspectRatio,
  isSupported,
  permissionDenied,
  errorMessage,
  isPreparing,
  torchSupported,
  torchEnabled,
  isVideoMode,
  micEnabled,
  isRecording,
  formattedDuration,
  canSwitchMode,
  zoomSupported,
  zoomValue,
  zoomMin,
  zoomMax,
  zoomStep,
  zoomDisplay,
  outputBlob,
  outputKind,
  outputUrl,
  mode,
  shutterDisabled,
  isRecorderSupported,
  isMirrored,
  startCamera,
  toggleTorch,
  toggleMic,
  switchCamera,
  applyZoom,
  setMode,
  handleShutter,
  displayMimeType,
  fileSizeLabel,
  downloadName,
  clearOutput,
} = useCameraController(labels)
</script>

<i18n lang="json">
{
  "en": {
    "formatUnknown": "Unknown",
    "photoName": "photo",
    "videoName": "video",
    "cameraNotReady": "Camera is not ready.",
    "cameraError": "Failed to access camera.",
    "videoNotSupported": "Video recording is not supported in this browser.",
    "recordingFailed": "Failed to start recording."
  },
  "zh": {
    "formatUnknown": "未知",
    "photoName": "照片",
    "videoName": "视频",
    "cameraNotReady": "摄像头尚未准备就绪。",
    "cameraError": "无法访问摄像头。",
    "videoNotSupported": "当前浏览器不支持录像。",
    "recordingFailed": "无法开始录制。"
  },
  "zh-CN": {
    "formatUnknown": "未知",
    "photoName": "照片",
    "videoName": "视频",
    "cameraNotReady": "摄像头尚未准备就绪。",
    "cameraError": "无法访问摄像头。",
    "videoNotSupported": "当前浏览器不支持录像。",
    "recordingFailed": "无法开始录制。"
  },
  "zh-TW": {
    "formatUnknown": "未知",
    "photoName": "照片",
    "videoName": "影片",
    "cameraNotReady": "攝影機尚未準備就緒。",
    "cameraError": "無法存取攝影機。",
    "videoNotSupported": "目前瀏覽器不支援錄影。",
    "recordingFailed": "無法開始錄影。"
  },
  "zh-HK": {
    "formatUnknown": "未知",
    "photoName": "照片",
    "videoName": "影片",
    "cameraNotReady": "攝影機尚未準備就緒。",
    "cameraError": "無法存取攝影機。",
    "videoNotSupported": "目前瀏覽器不支援錄影。",
    "recordingFailed": "無法開始錄影。"
  },
  "es": {
    "formatUnknown": "Unknown",
    "photoName": "photo",
    "videoName": "video",
    "cameraNotReady": "Camera is not ready.",
    "cameraError": "Failed to access camera.",
    "videoNotSupported": "Video recording is not supported in this browser.",
    "recordingFailed": "Failed to start recording."
  },
  "fr": {
    "formatUnknown": "Unknown",
    "photoName": "photo",
    "videoName": "video",
    "cameraNotReady": "Camera is not ready.",
    "cameraError": "Failed to access camera.",
    "videoNotSupported": "Video recording is not supported in this browser.",
    "recordingFailed": "Failed to start recording."
  },
  "de": {
    "formatUnknown": "Unknown",
    "photoName": "photo",
    "videoName": "video",
    "cameraNotReady": "Camera is not ready.",
    "cameraError": "Failed to access camera.",
    "videoNotSupported": "Video recording is not supported in this browser.",
    "recordingFailed": "Failed to start recording."
  },
  "it": {
    "formatUnknown": "Unknown",
    "photoName": "photo",
    "videoName": "video",
    "cameraNotReady": "Camera is not ready.",
    "cameraError": "Failed to access camera.",
    "videoNotSupported": "Video recording is not supported in this browser.",
    "recordingFailed": "Failed to start recording."
  },
  "ja": {
    "formatUnknown": "Unknown",
    "photoName": "photo",
    "videoName": "video",
    "cameraNotReady": "Camera is not ready.",
    "cameraError": "Failed to access camera.",
    "videoNotSupported": "Video recording is not supported in this browser.",
    "recordingFailed": "Failed to start recording."
  },
  "ko": {
    "formatUnknown": "Unknown",
    "photoName": "photo",
    "videoName": "video",
    "cameraNotReady": "Camera is not ready.",
    "cameraError": "Failed to access camera.",
    "videoNotSupported": "Video recording is not supported in this browser.",
    "recordingFailed": "Failed to start recording."
  },
  "ru": {
    "formatUnknown": "Unknown",
    "photoName": "photo",
    "videoName": "video",
    "cameraNotReady": "Camera is not ready.",
    "cameraError": "Failed to access camera.",
    "videoNotSupported": "Video recording is not supported in this browser.",
    "recordingFailed": "Failed to start recording."
  },
  "pt": {
    "formatUnknown": "Unknown",
    "photoName": "photo",
    "videoName": "video",
    "cameraNotReady": "Camera is not ready.",
    "cameraError": "Failed to access camera.",
    "videoNotSupported": "Video recording is not supported in this browser.",
    "recordingFailed": "Failed to start recording."
  },
  "ar": {
    "formatUnknown": "Unknown",
    "photoName": "photo",
    "videoName": "video",
    "cameraNotReady": "Camera is not ready.",
    "cameraError": "Failed to access camera.",
    "videoNotSupported": "Video recording is not supported in this browser.",
    "recordingFailed": "Failed to start recording."
  },
  "hi": {
    "formatUnknown": "Unknown",
    "photoName": "photo",
    "videoName": "video",
    "cameraNotReady": "Camera is not ready.",
    "cameraError": "Failed to access camera.",
    "videoNotSupported": "Video recording is not supported in this browser.",
    "recordingFailed": "Failed to start recording."
  },
  "tr": {
    "formatUnknown": "Unknown",
    "photoName": "photo",
    "videoName": "video",
    "cameraNotReady": "Camera is not ready.",
    "cameraError": "Failed to access camera.",
    "videoNotSupported": "Video recording is not supported in this browser.",
    "recordingFailed": "Failed to start recording."
  },
  "nl": {
    "formatUnknown": "Unknown",
    "photoName": "photo",
    "videoName": "video",
    "cameraNotReady": "Camera is not ready.",
    "cameraError": "Failed to access camera.",
    "videoNotSupported": "Video recording is not supported in this browser.",
    "recordingFailed": "Failed to start recording."
  },
  "sv": {
    "formatUnknown": "Unknown",
    "photoName": "photo",
    "videoName": "video",
    "cameraNotReady": "Camera is not ready.",
    "cameraError": "Failed to access camera.",
    "videoNotSupported": "Video recording is not supported in this browser.",
    "recordingFailed": "Failed to start recording."
  },
  "pl": {
    "formatUnknown": "Unknown",
    "photoName": "photo",
    "videoName": "video",
    "cameraNotReady": "Camera is not ready.",
    "cameraError": "Failed to access camera.",
    "videoNotSupported": "Video recording is not supported in this browser.",
    "recordingFailed": "Failed to start recording."
  },
  "vi": {
    "formatUnknown": "Unknown",
    "photoName": "photo",
    "videoName": "video",
    "cameraNotReady": "Camera is not ready.",
    "cameraError": "Failed to access camera.",
    "videoNotSupported": "Video recording is not supported in this browser.",
    "recordingFailed": "Failed to start recording."
  },
  "th": {
    "formatUnknown": "Unknown",
    "photoName": "photo",
    "videoName": "video",
    "cameraNotReady": "Camera is not ready.",
    "cameraError": "Failed to access camera.",
    "videoNotSupported": "Video recording is not supported in this browser.",
    "recordingFailed": "Failed to start recording."
  },
  "id": {
    "formatUnknown": "Unknown",
    "photoName": "photo",
    "videoName": "video",
    "cameraNotReady": "Camera is not ready.",
    "cameraError": "Failed to access camera.",
    "videoNotSupported": "Video recording is not supported in this browser.",
    "recordingFailed": "Failed to start recording."
  },
  "he": {
    "formatUnknown": "Unknown",
    "photoName": "photo",
    "videoName": "video",
    "cameraNotReady": "Camera is not ready.",
    "cameraError": "Failed to access camera.",
    "videoNotSupported": "Video recording is not supported in this browser.",
    "recordingFailed": "Failed to start recording."
  },
  "ms": {
    "formatUnknown": "Unknown",
    "photoName": "photo",
    "videoName": "video",
    "cameraNotReady": "Camera is not ready.",
    "cameraError": "Failed to access camera.",
    "videoNotSupported": "Video recording is not supported in this browser.",
    "recordingFailed": "Failed to start recording."
  },
  "no": {
    "formatUnknown": "Unknown",
    "photoName": "photo",
    "videoName": "video",
    "cameraNotReady": "Camera is not ready.",
    "cameraError": "Failed to access camera.",
    "videoNotSupported": "Video recording is not supported in this browser.",
    "recordingFailed": "Failed to start recording."
  }
}
</i18n>
