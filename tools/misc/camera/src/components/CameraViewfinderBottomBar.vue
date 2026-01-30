<template>
  <div class="bottom-bar">
    <div class="mode-tabs">
      <button
        type="button"
        class="mode-tab"
        :class="{ active: mode === 'photo' }"
        :disabled="!canSwitchMode"
        @click="emit('set-mode', 'photo')"
      >
        {{ labels.photoMode }}
      </button>
      <button
        type="button"
        class="mode-tab"
        :class="{ active: mode === 'video' }"
        :disabled="!canSwitchMode || !isRecorderSupported"
        @click="emit('set-mode', 'video')"
      >
        {{ labels.videoMode }}
      </button>
    </div>

    <button type="button" class="shutter" :disabled="shutterDisabled" @click="emit('shutter')">
      <span class="shutter-core" :class="{ recording: isRecording }" />
    </button>

    <div class="bottom-actions">
      <n-text v-if="!isRecorderSupported" class="unsupported-text">
        {{ labels.videoNotSupported }}
      </n-text>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NText } from 'naive-ui'

defineProps<{
  labels: {
    photoMode: string
    videoMode: string
    videoNotSupported: string
  }
  mode: 'photo' | 'video'
  canSwitchMode: boolean
  isRecorderSupported: boolean
  shutterDisabled: boolean
  isRecording: boolean
}>()

const emit = defineEmits<{
  (event: 'set-mode', value: 'photo' | 'video'): void
  (event: 'shutter'): void
}>()
</script>

<style scoped>
.bottom-bar {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 12px;
  padding: 14px 16px calc(18px + env(safe-area-inset-bottom));
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.7), transparent);
}

.mode-tabs {
  display: inline-flex;
  gap: 6px;
  padding: 4px;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.4);
  width: fit-content;
  max-width: 100%;
  justify-self: start;
}

.mode-tab {
  border: none;
  background: transparent;
  color: rgba(255, 255, 255, 0.7);
  font-size: 13px;
  padding: 4px 10px;
  border-radius: 999px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.mode-tab.active {
  color: #111;
  background: #fff;
}

.mode-tab:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.shutter {
  width: 74px;
  height: 74px;
  border-radius: 50%;
  border: 4px solid rgba(255, 255, 255, 0.9);
  background: transparent;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0;
  box-sizing: border-box;
  transition: transform 0.15s ease;
}

.shutter:active {
  transform: scale(0.96);
}

.shutter:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.shutter-core {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: #fff;
  transition: all 0.2s ease;
}

.shutter-core.recording {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: #ff3b30;
}

.bottom-actions {
  display: flex;
  justify-content: flex-end;
}

.unsupported-text {
  color: rgba(255, 255, 255, 0.75);
  font-size: 12px;
}

@media (max-width: 640px) {
  .bottom-bar {
    grid-template-columns: 1fr auto 1fr;
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
