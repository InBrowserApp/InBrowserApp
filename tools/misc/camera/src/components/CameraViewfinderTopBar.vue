<template>
  <div class="top-bar">
    <div class="top-actions">
      <n-button
        v-if="torchSupported"
        quaternary
        size="small"
        class="icon-button"
        :aria-label="labels.torch"
        @click="emit('toggle-torch')"
      >
        <template #icon>
          <n-icon :component="torchEnabled ? FlashlightOnIcon : FlashlightOffIcon" />
        </template>
      </n-button>
      <n-button
        v-if="isVideoMode"
        quaternary
        size="small"
        class="icon-button"
        :aria-label="micEnabled ? labels.micOn : labels.micOff"
        @click="emit('toggle-mic')"
      >
        <template #icon>
          <n-icon :component="micEnabled ? MicOnIcon : MicOffIcon" />
        </template>
      </n-button>
    </div>

    <div v-if="isRecording" class="status-pill">
      <span class="rec-dot" />
      <span>{{ labels.recording }}</span>
      <span>{{ formattedDuration }}</span>
    </div>

    <n-button
      quaternary
      size="small"
      class="icon-button"
      :aria-label="labels.switchCamera"
      :disabled="!canSwitchMode"
      @click="emit('switch-camera')"
    >
      <template #icon>
        <n-icon :component="SwitchCameraIcon" />
      </template>
    </n-button>
  </div>
</template>

<script setup lang="ts">
import { NButton, NIcon } from 'naive-ui'
import SwitchCameraIcon from '@vicons/fluent/CameraSwitch24Regular'
import FlashlightOnIcon from '@vicons/fluent/Flashlight24Regular'
import FlashlightOffIcon from '@vicons/fluent/FlashlightOff24Regular'
import MicOnIcon from '@vicons/fluent/Mic16Regular'
import MicOffIcon from '@vicons/fluent/MicOff16Regular'

defineProps<{
  labels: {
    torch: string
    micOn: string
    micOff: string
    recording: string
    switchCamera: string
  }
  torchSupported: boolean
  torchEnabled: boolean
  isVideoMode: boolean
  micEnabled: boolean
  isRecording: boolean
  formattedDuration: string
  canSwitchMode: boolean
}>()

const emit = defineEmits<{
  (event: 'toggle-torch'): void
  (event: 'toggle-mic'): void
  (event: 'switch-camera'): void
}>()
</script>

<style scoped>
.top-bar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.6), transparent);
  pointer-events: none;
}

.top-bar > * {
  pointer-events: auto;
}

.top-actions {
  display: flex;
  gap: 8px;
}

.icon-button {
  background: rgba(255, 255, 255, 0.92);
  color: #111;
  border: 1px solid rgba(255, 255, 255, 0.6);
  border-radius: 999px;
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.28);
}

.icon-button:hover {
  background: #fff;
}

.status-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.55);
  color: #fff;
  font-size: 12px;
}

.rec-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ff3b30;
  box-shadow: 0 0 12px rgba(255, 59, 48, 0.8);
  animation: pulse 1.2s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.25);
  }
}
</style>

<i18n lang="json">
{
  "en": {},
  "zh": {},
  "zh-CN": {},
  "zh-TW": {},
  "zh-HK": {},
  "es": {},
  "fr": {},
  "de": {},
  "it": {},
  "ja": {},
  "ko": {},
  "ru": {},
  "pt": {},
  "ar": {},
  "hi": {},
  "tr": {},
  "nl": {},
  "sv": {},
  "pl": {},
  "vi": {},
  "th": {},
  "id": {},
  "he": {},
  "ms": {},
  "no": {}
}
</i18n>
