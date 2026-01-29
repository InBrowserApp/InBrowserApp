<template>
  <CameraViewfinderLabelsCore v-slot="{ labels: coreLabels }">
    <CameraViewfinderLabelsControls v-slot="{ labels: controlLabels }">
      <ToolSectionHeader>{{ coreLabels.camera }}</ToolSectionHeader>
      <ToolSection>
        <div class="camera-shell">
          <div class="viewfinder" :style="{ aspectRatio: viewfinderAspectRatio }">
            <slot name="preview" />

            <div v-if="!isSupported" class="camera-overlay">
              <p>{{ coreLabels.cameraNotSupported }}</p>
            </div>
            <div v-else-if="permissionDenied" class="camera-overlay">
              <p>{{ coreLabels.cameraPermissionDenied }}</p>
              <n-button size="small" type="primary" @click="emit('retry-permission')">
                {{ coreLabels.retryPermission }}
              </n-button>
            </div>
            <div v-else-if="errorMessage" class="camera-overlay">
              <p>{{ errorMessage }}</p>
            </div>
            <div v-else-if="isPreparing" class="camera-overlay">
              <p>{{ coreLabels.preparingCamera }}</p>
            </div>

            <div class="top-bar">
              <div class="top-actions">
                <n-button
                  v-if="torchSupported"
                  quaternary
                  size="small"
                  class="icon-button"
                  :aria-label="controlLabels.torch"
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
                  :aria-label="micEnabled ? controlLabels.micOn : controlLabels.micOff"
                  @click="emit('toggle-mic')"
                >
                  <template #icon>
                    <n-icon :component="micEnabled ? MicOnIcon : MicOffIcon" />
                  </template>
                </n-button>
              </div>

              <div v-if="isRecording" class="status-pill">
                <span class="rec-dot" />
                <span>{{ controlLabels.recording }}</span>
                <span>{{ formattedDuration }}</span>
              </div>

              <n-button
                quaternary
                size="small"
                class="icon-button"
                :aria-label="controlLabels.switchCamera"
                :disabled="!canSwitchMode"
                @click="emit('switch-camera')"
              >
                <template #icon>
                  <n-icon :component="SwitchCameraIcon" />
                </template>
              </n-button>
            </div>

            <div v-if="zoomSupported" class="zoom-bar">
              <n-icon :component="ZoomOutIcon" />
              <n-slider
                :value="zoomValue"
                :min="zoomMin"
                :max="zoomMax"
                :step="zoomStep"
                :disabled="isPreparing"
                @update:value="(value) => emit('apply-zoom', value)"
              />
              <n-icon :component="ZoomInIcon" />
              <span class="zoom-label">{{ zoomDisplay }}</span>
            </div>

            <div v-if="outputBlob" class="thumbnail">
              <img v-if="outputKind === 'photo'" :src="outputUrl" alt="" />
              <video v-else :src="outputUrl" muted playsinline />
            </div>

            <div class="bottom-bar">
              <div class="mode-tabs">
                <button
                  type="button"
                  class="mode-tab"
                  :class="{ active: mode === 'photo' }"
                  :disabled="!canSwitchMode"
                  @click="emit('set-mode', 'photo')"
                >
                  {{ controlLabels.photoMode }}
                </button>
                <button
                  type="button"
                  class="mode-tab"
                  :class="{ active: mode === 'video' }"
                  :disabled="!canSwitchMode || !isRecorderSupported"
                  @click="emit('set-mode', 'video')"
                >
                  {{ controlLabels.videoMode }}
                </button>
              </div>

              <button
                type="button"
                class="shutter"
                :disabled="shutterDisabled"
                @click="emit('shutter')"
              >
                <span class="shutter-core" :class="{ recording: isRecording }" />
              </button>

              <div class="bottom-actions">
                <n-text v-if="!isRecorderSupported" class="unsupported-text">
                  {{ controlLabels.videoNotSupported }}
                </n-text>
              </div>
            </div>
          </div>
        </div>
      </ToolSection>
    </CameraViewfinderLabelsControls>
  </CameraViewfinderLabelsCore>
</template>

<script setup lang="ts">
import { NButton, NIcon, NSlider, NText } from 'naive-ui'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import CameraViewfinderLabelsControls from './CameraViewfinderLabelsControls.vue'
import CameraViewfinderLabelsCore from './CameraViewfinderLabelsCore.vue'
import SwitchCameraIcon from '@vicons/fluent/CameraSwitch24Regular'
import FlashlightOnIcon from '@vicons/fluent/Flashlight24Regular'
import FlashlightOffIcon from '@vicons/fluent/FlashlightOff24Regular'
import MicOnIcon from '@vicons/fluent/Mic16Regular'
import MicOffIcon from '@vicons/fluent/MicOff16Regular'
import ZoomInIcon from '@vicons/fluent/ZoomIn16Regular'
import ZoomOutIcon from '@vicons/fluent/ZoomOut16Regular'

defineProps<{
  viewfinderAspectRatio: string | number
  isSupported: boolean
  permissionDenied: boolean
  errorMessage: string
  isPreparing: boolean
  torchSupported: boolean
  torchEnabled: boolean
  isVideoMode: boolean
  micEnabled: boolean
  isRecording: boolean
  formattedDuration: string
  canSwitchMode: boolean
  zoomSupported: boolean
  zoomValue: number
  zoomMin: number
  zoomMax: number
  zoomStep: number
  zoomDisplay: string
  outputBlob: Blob | null
  outputKind: 'photo' | 'video' | ''
  outputUrl: string
  mode: 'photo' | 'video'
  shutterDisabled: boolean
  isRecorderSupported: boolean
}>()

const emit = defineEmits<{
  (event: 'retry-permission'): void
  (event: 'toggle-torch'): void
  (event: 'toggle-mic'): void
  (event: 'switch-camera'): void
  (event: 'apply-zoom', value: number): void
  (event: 'set-mode', value: 'photo' | 'video'): void
  (event: 'shutter'): void
}>()
</script>

<style scoped>
.camera-shell {
  display: flex;
  justify-content: center;
  width: 100%;
}

.viewfinder {
  position: relative;
  width: 100%;
  max-width: 92vw;
  aspect-ratio: 9 / 16;
  max-height: 80vh;
  border-radius: 28px;
  overflow: hidden;
  background: radial-gradient(circle at top, #2b2b2b, #0f0f0f 70%);
  box-shadow:
    0 24px 60px rgba(0, 0, 0, 0.4),
    inset 0 0 0 1px rgba(255, 255, 255, 0.08);
}

::v-slotted(.preview-video) {
  width: 100%;
  height: 100%;
  object-fit: cover;
  background: #000;
}

::v-slotted(.preview-video.mirrored) {
  transform: scaleX(-1);
}

.camera-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
  justify-content: center;
  padding: 24px;
  text-align: center;
  color: #fff;
  background: rgba(0, 0, 0, 0.65);
}

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

.zoom-bar {
  position: absolute;
  left: 18px;
  right: 18px;
  bottom: 130px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 10px;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.45);
  color: #fff;
}

.zoom-label {
  font-size: 12px;
  font-weight: 600;
  color: #fff;
  min-width: 40px;
  text-align: right;
}

.thumbnail {
  position: absolute;
  left: 16px;
  bottom: 116px;
  width: 56px;
  height: 56px;
  border-radius: 12px;
  overflow: hidden;
  border: 2px solid rgba(255, 255, 255, 0.7);
  background: #000;
}

.thumbnail img,
.thumbnail video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

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
  .viewfinder {
    border-radius: 22px;
  }

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
