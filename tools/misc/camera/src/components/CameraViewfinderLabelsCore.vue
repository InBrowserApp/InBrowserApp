<template>
  <slot :labels="labels" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n({ useScope: 'local' })
const labels = computed(() => ({
  camera: t('camera'),
  cameraNotSupported: t('cameraNotSupported'),
  cameraPermissionDenied: t('cameraPermissionDenied'),
  retryPermission: t('retryPermission'),
  preparingCamera: t('preparingCamera'),
}))
</script>

<i18n lang="json">
{
  "en": {
    "camera": "Camera",
    "cameraNotSupported": "Camera is not supported in this browser.",
    "cameraPermissionDenied": "Camera permission denied. Please allow camera access.",
    "retryPermission": "Retry",
    "preparingCamera": "Preparing camera..."
  },
  "zh": {
    "camera": "照相机",
    "cameraNotSupported": "当前浏览器不支持摄像头。",
    "cameraPermissionDenied": "摄像头权限被拒绝，请允许访问。",
    "retryPermission": "重试",
    "preparingCamera": "正在启动摄像头..."
  },
  "zh-CN": {
    "camera": "照相机",
    "cameraNotSupported": "当前浏览器不支持摄像头。",
    "cameraPermissionDenied": "摄像头权限被拒绝，请允许访问。",
    "retryPermission": "重试",
    "preparingCamera": "正在启动摄像头..."
  },
  "zh-TW": {
    "camera": "相機",
    "cameraNotSupported": "目前瀏覽器不支援攝影機。",
    "cameraPermissionDenied": "攝影機權限被拒絕，請允許存取。",
    "retryPermission": "重試",
    "preparingCamera": "正在啟動攝影機..."
  },
  "zh-HK": {
    "camera": "相機",
    "cameraNotSupported": "目前瀏覽器不支援攝影機。",
    "cameraPermissionDenied": "攝影機權限被拒絕，請允許存取。",
    "retryPermission": "重試",
    "preparingCamera": "正在啟動攝影機..."
  },
  "es": {
    "camera": "Camera",
    "cameraNotSupported": "Camera is not supported in this browser.",
    "cameraPermissionDenied": "Camera permission denied. Please allow camera access.",
    "retryPermission": "Retry",
    "preparingCamera": "Preparing camera..."
  },
  "fr": {
    "camera": "Camera",
    "cameraNotSupported": "Camera is not supported in this browser.",
    "cameraPermissionDenied": "Camera permission denied. Please allow camera access.",
    "retryPermission": "Retry",
    "preparingCamera": "Preparing camera..."
  },
  "de": {
    "camera": "Camera",
    "cameraNotSupported": "Camera is not supported in this browser.",
    "cameraPermissionDenied": "Camera permission denied. Please allow camera access.",
    "retryPermission": "Retry",
    "preparingCamera": "Preparing camera..."
  },
  "it": {
    "camera": "Camera",
    "cameraNotSupported": "Camera is not supported in this browser.",
    "cameraPermissionDenied": "Camera permission denied. Please allow camera access.",
    "retryPermission": "Retry",
    "preparingCamera": "Preparing camera..."
  },
  "ja": {
    "camera": "Camera",
    "cameraNotSupported": "Camera is not supported in this browser.",
    "cameraPermissionDenied": "Camera permission denied. Please allow camera access.",
    "retryPermission": "Retry",
    "preparingCamera": "Preparing camera..."
  },
  "ko": {
    "camera": "Camera",
    "cameraNotSupported": "Camera is not supported in this browser.",
    "cameraPermissionDenied": "Camera permission denied. Please allow camera access.",
    "retryPermission": "Retry",
    "preparingCamera": "Preparing camera..."
  },
  "ru": {
    "camera": "Camera",
    "cameraNotSupported": "Camera is not supported in this browser.",
    "cameraPermissionDenied": "Camera permission denied. Please allow camera access.",
    "retryPermission": "Retry",
    "preparingCamera": "Preparing camera..."
  },
  "pt": {
    "camera": "Camera",
    "cameraNotSupported": "Camera is not supported in this browser.",
    "cameraPermissionDenied": "Camera permission denied. Please allow camera access.",
    "retryPermission": "Retry",
    "preparingCamera": "Preparing camera..."
  },
  "ar": {
    "camera": "Camera",
    "cameraNotSupported": "Camera is not supported in this browser.",
    "cameraPermissionDenied": "Camera permission denied. Please allow camera access.",
    "retryPermission": "Retry",
    "preparingCamera": "Preparing camera..."
  },
  "hi": {
    "camera": "Camera",
    "cameraNotSupported": "Camera is not supported in this browser.",
    "cameraPermissionDenied": "Camera permission denied. Please allow camera access.",
    "retryPermission": "Retry",
    "preparingCamera": "Preparing camera..."
  },
  "tr": {
    "camera": "Camera",
    "cameraNotSupported": "Camera is not supported in this browser.",
    "cameraPermissionDenied": "Camera permission denied. Please allow camera access.",
    "retryPermission": "Retry",
    "preparingCamera": "Preparing camera..."
  },
  "nl": {
    "camera": "Camera",
    "cameraNotSupported": "Camera is not supported in this browser.",
    "cameraPermissionDenied": "Camera permission denied. Please allow camera access.",
    "retryPermission": "Retry",
    "preparingCamera": "Preparing camera..."
  },
  "sv": {
    "camera": "Camera",
    "cameraNotSupported": "Camera is not supported in this browser.",
    "cameraPermissionDenied": "Camera permission denied. Please allow camera access.",
    "retryPermission": "Retry",
    "preparingCamera": "Preparing camera..."
  },
  "pl": {
    "camera": "Camera",
    "cameraNotSupported": "Camera is not supported in this browser.",
    "cameraPermissionDenied": "Camera permission denied. Please allow camera access.",
    "retryPermission": "Retry",
    "preparingCamera": "Preparing camera..."
  },
  "vi": {
    "camera": "Camera",
    "cameraNotSupported": "Camera is not supported in this browser.",
    "cameraPermissionDenied": "Camera permission denied. Please allow camera access.",
    "retryPermission": "Retry",
    "preparingCamera": "Preparing camera..."
  },
  "th": {
    "camera": "Camera",
    "cameraNotSupported": "Camera is not supported in this browser.",
    "cameraPermissionDenied": "Camera permission denied. Please allow camera access.",
    "retryPermission": "Retry",
    "preparingCamera": "Preparing camera..."
  },
  "id": {
    "camera": "Camera",
    "cameraNotSupported": "Camera is not supported in this browser.",
    "cameraPermissionDenied": "Camera permission denied. Please allow camera access.",
    "retryPermission": "Retry",
    "preparingCamera": "Preparing camera..."
  },
  "he": {
    "camera": "Camera",
    "cameraNotSupported": "Camera is not supported in this browser.",
    "cameraPermissionDenied": "Camera permission denied. Please allow camera access.",
    "retryPermission": "Retry",
    "preparingCamera": "Preparing camera..."
  },
  "ms": {
    "camera": "Camera",
    "cameraNotSupported": "Camera is not supported in this browser.",
    "cameraPermissionDenied": "Camera permission denied. Please allow camera access.",
    "retryPermission": "Retry",
    "preparingCamera": "Preparing camera..."
  },
  "no": {
    "camera": "Camera",
    "cameraNotSupported": "Camera is not supported in this browser.",
    "cameraPermissionDenied": "Camera permission denied. Please allow camera access.",
    "retryPermission": "Retry",
    "preparingCamera": "Preparing camera..."
  }
}
</i18n>
