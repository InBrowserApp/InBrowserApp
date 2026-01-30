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

            <CameraViewfinderTopBar
              :labels="controlLabels"
              :torch-supported="torchSupported"
              :torch-enabled="torchEnabled"
              :is-video-mode="isVideoMode"
              :mic-enabled="micEnabled"
              :is-recording="isRecording"
              :formatted-duration="formattedDuration"
              :can-switch-mode="canSwitchMode"
              @toggle-torch="emit('toggle-torch')"
              @toggle-mic="emit('toggle-mic')"
              @switch-camera="emit('switch-camera')"
            />

            <CameraViewfinderZoomBar
              v-if="zoomSupported"
              :zoom-value="zoomValue"
              :zoom-min="zoomMin"
              :zoom-max="zoomMax"
              :zoom-step="zoomStep"
              :zoom-display="zoomDisplay"
              :is-preparing="isPreparing"
              @apply-zoom="(value) => emit('apply-zoom', value)"
            />

            <div v-if="outputBlob" class="thumbnail">
              <img v-if="outputKind === 'photo'" :src="outputUrl" alt="" />
              <video v-else :src="outputUrl" muted playsinline />
            </div>

            <CameraViewfinderBottomBar
              :labels="controlLabels"
              :mode="mode"
              :can-switch-mode="canSwitchMode"
              :is-recorder-supported="isRecorderSupported"
              :shutter-disabled="shutterDisabled"
              :is-recording="isRecording"
              @set-mode="(value) => emit('set-mode', value)"
              @shutter="emit('shutter')"
            />
          </div>
        </div>
      </ToolSection>
    </CameraViewfinderLabelsControls>
  </CameraViewfinderLabelsCore>
</template>

<script setup lang="ts">
import { NButton } from 'naive-ui'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import CameraViewfinderLabelsControls from './CameraViewfinderLabelsControls.vue'
import CameraViewfinderLabelsCore from './CameraViewfinderLabelsCore.vue'
import CameraViewfinderBottomBar from './CameraViewfinderBottomBar.vue'
import CameraViewfinderTopBar from './CameraViewfinderTopBar.vue'
import CameraViewfinderZoomBar from './CameraViewfinderZoomBar.vue'

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

@media (max-width: 640px) {
  .viewfinder {
    border-radius: 22px;
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
