<template>
  <slot :labels="labels" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n({ useScope: 'local' })
const labels = computed(() => ({
  torch: t('torch'),
  micOn: t('micOn'),
  micOff: t('micOff'),
  recording: t('recording'),
  switchCamera: t('switchCamera'),
  photoMode: t('photoMode'),
  videoMode: t('videoMode'),
  videoNotSupported: t('videoNotSupported'),
}))
</script>

<i18n lang="json">
{
  "en": {
    "torch": "Torch",
    "micOn": "Mic on",
    "micOff": "Mic off",
    "recording": "REC",
    "switchCamera": "Flip",
    "photoMode": "Photo",
    "videoMode": "Video",
    "videoNotSupported": "Video recording is not supported in this browser."
  },
  "zh": {
    "torch": "补光灯",
    "micOn": "麦克风开",
    "micOff": "麦克风关",
    "recording": "录制中",
    "switchCamera": "切换镜头",
    "photoMode": "拍照",
    "videoMode": "录像",
    "videoNotSupported": "当前浏览器不支持录像。"
  },
  "zh-CN": {
    "torch": "补光灯",
    "micOn": "麦克风开",
    "micOff": "麦克风关",
    "recording": "录制中",
    "switchCamera": "切换镜头",
    "photoMode": "拍照",
    "videoMode": "录像",
    "videoNotSupported": "当前浏览器不支持录像。"
  },
  "zh-TW": {
    "torch": "補光燈",
    "micOn": "麥克風開",
    "micOff": "麥克風關",
    "recording": "錄影中",
    "switchCamera": "切換鏡頭",
    "photoMode": "拍照",
    "videoMode": "錄影",
    "videoNotSupported": "目前瀏覽器不支援錄影。"
  },
  "zh-HK": {
    "torch": "補光燈",
    "micOn": "麥克風開",
    "micOff": "麥克風關",
    "recording": "錄影中",
    "switchCamera": "切換鏡頭",
    "photoMode": "拍照",
    "videoMode": "錄影",
    "videoNotSupported": "目前瀏覽器不支援錄影。"
  },
  "es": {
    "torch": "Torch",
    "micOn": "Mic on",
    "micOff": "Mic off",
    "recording": "REC",
    "switchCamera": "Flip",
    "photoMode": "Photo",
    "videoMode": "Video",
    "videoNotSupported": "Video recording is not supported in this browser."
  },
  "fr": {
    "torch": "Torch",
    "micOn": "Mic on",
    "micOff": "Mic off",
    "recording": "REC",
    "switchCamera": "Flip",
    "photoMode": "Photo",
    "videoMode": "Video",
    "videoNotSupported": "Video recording is not supported in this browser."
  },
  "de": {
    "torch": "Torch",
    "micOn": "Mic on",
    "micOff": "Mic off",
    "recording": "REC",
    "switchCamera": "Flip",
    "photoMode": "Photo",
    "videoMode": "Video",
    "videoNotSupported": "Video recording is not supported in this browser."
  },
  "it": {
    "torch": "Torch",
    "micOn": "Mic on",
    "micOff": "Mic off",
    "recording": "REC",
    "switchCamera": "Flip",
    "photoMode": "Photo",
    "videoMode": "Video",
    "videoNotSupported": "Video recording is not supported in this browser."
  },
  "ja": {
    "torch": "Torch",
    "micOn": "Mic on",
    "micOff": "Mic off",
    "recording": "REC",
    "switchCamera": "Flip",
    "photoMode": "Photo",
    "videoMode": "Video",
    "videoNotSupported": "Video recording is not supported in this browser."
  },
  "ko": {
    "torch": "Torch",
    "micOn": "Mic on",
    "micOff": "Mic off",
    "recording": "REC",
    "switchCamera": "Flip",
    "photoMode": "Photo",
    "videoMode": "Video",
    "videoNotSupported": "Video recording is not supported in this browser."
  },
  "ru": {
    "torch": "Torch",
    "micOn": "Mic on",
    "micOff": "Mic off",
    "recording": "REC",
    "switchCamera": "Flip",
    "photoMode": "Photo",
    "videoMode": "Video",
    "videoNotSupported": "Video recording is not supported in this browser."
  },
  "pt": {
    "torch": "Torch",
    "micOn": "Mic on",
    "micOff": "Mic off",
    "recording": "REC",
    "switchCamera": "Flip",
    "photoMode": "Photo",
    "videoMode": "Video",
    "videoNotSupported": "Video recording is not supported in this browser."
  },
  "ar": {
    "torch": "Torch",
    "micOn": "Mic on",
    "micOff": "Mic off",
    "recording": "REC",
    "switchCamera": "Flip",
    "photoMode": "Photo",
    "videoMode": "Video",
    "videoNotSupported": "Video recording is not supported in this browser."
  },
  "hi": {
    "torch": "Torch",
    "micOn": "Mic on",
    "micOff": "Mic off",
    "recording": "REC",
    "switchCamera": "Flip",
    "photoMode": "Photo",
    "videoMode": "Video",
    "videoNotSupported": "Video recording is not supported in this browser."
  },
  "tr": {
    "torch": "Torch",
    "micOn": "Mic on",
    "micOff": "Mic off",
    "recording": "REC",
    "switchCamera": "Flip",
    "photoMode": "Photo",
    "videoMode": "Video",
    "videoNotSupported": "Video recording is not supported in this browser."
  },
  "nl": {
    "torch": "Torch",
    "micOn": "Mic on",
    "micOff": "Mic off",
    "recording": "REC",
    "switchCamera": "Flip",
    "photoMode": "Photo",
    "videoMode": "Video",
    "videoNotSupported": "Video recording is not supported in this browser."
  },
  "sv": {
    "torch": "Torch",
    "micOn": "Mic on",
    "micOff": "Mic off",
    "recording": "REC",
    "switchCamera": "Flip",
    "photoMode": "Photo",
    "videoMode": "Video",
    "videoNotSupported": "Video recording is not supported in this browser."
  },
  "pl": {
    "torch": "Torch",
    "micOn": "Mic on",
    "micOff": "Mic off",
    "recording": "REC",
    "switchCamera": "Flip",
    "photoMode": "Photo",
    "videoMode": "Video",
    "videoNotSupported": "Video recording is not supported in this browser."
  },
  "vi": {
    "torch": "Torch",
    "micOn": "Mic on",
    "micOff": "Mic off",
    "recording": "REC",
    "switchCamera": "Flip",
    "photoMode": "Photo",
    "videoMode": "Video",
    "videoNotSupported": "Video recording is not supported in this browser."
  },
  "th": {
    "torch": "Torch",
    "micOn": "Mic on",
    "micOff": "Mic off",
    "recording": "REC",
    "switchCamera": "Flip",
    "photoMode": "Photo",
    "videoMode": "Video",
    "videoNotSupported": "Video recording is not supported in this browser."
  },
  "id": {
    "torch": "Torch",
    "micOn": "Mic on",
    "micOff": "Mic off",
    "recording": "REC",
    "switchCamera": "Flip",
    "photoMode": "Photo",
    "videoMode": "Video",
    "videoNotSupported": "Video recording is not supported in this browser."
  },
  "he": {
    "torch": "Torch",
    "micOn": "Mic on",
    "micOff": "Mic off",
    "recording": "REC",
    "switchCamera": "Flip",
    "photoMode": "Photo",
    "videoMode": "Video",
    "videoNotSupported": "Video recording is not supported in this browser."
  },
  "ms": {
    "torch": "Torch",
    "micOn": "Mic on",
    "micOff": "Mic off",
    "recording": "REC",
    "switchCamera": "Flip",
    "photoMode": "Photo",
    "videoMode": "Video",
    "videoNotSupported": "Video recording is not supported in this browser."
  },
  "no": {
    "torch": "Torch",
    "micOn": "Mic on",
    "micOff": "Mic off",
    "recording": "REC",
    "switchCamera": "Flip",
    "photoMode": "Photo",
    "videoMode": "Video",
    "videoNotSupported": "Video recording is not supported in this browser."
  }
}
</i18n>
