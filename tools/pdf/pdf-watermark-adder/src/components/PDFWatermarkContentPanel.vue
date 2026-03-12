<template>
  <n-grid :cols="24" :x-gap="12" :y-gap="12">
    <n-gi :span="24">
      <n-form-item :label="modeLabel" :show-feedback="false">
        <n-radio-group :value="mode" name="watermark-mode" @update:value="handleModeChange">
          <n-radio-button value="text">{{ textModeLabel }}</n-radio-button>
          <n-radio-button value="image">{{ imageModeLabel }}</n-radio-button>
        </n-radio-group>
      </n-form-item>
    </n-gi>

    <n-gi :span="24">
      <n-form-item :label="pageRangesLabel" :show-feedback="false">
        <n-input
          :value="rangeInput"
          data-test="range-input"
          :placeholder="pageRangesPlaceholder"
          :disabled="isGenerating"
          @update:value="emit('update-range-input', $event)"
        />
      </n-form-item>
    </n-gi>

    <n-gi v-if="mode === 'text'" :span="24">
      <n-form-item :label="textContentLabel" :show-feedback="false">
        <n-input
          type="textarea"
          data-test="text-input"
          :autosize="{ minRows: 3, maxRows: 6 }"
          :value="text"
          :placeholder="textPlaceholder"
          :disabled="isGenerating"
          @update:value="emit('update-text', $event)"
        />
      </n-form-item>
      <div class="text-preset-list">
        <n-flex :size="8" wrap>
          <n-button
            v-for="preset in textPresets"
            :key="preset"
            size="small"
            tertiary
            :disabled="isGenerating"
            @click="emit('preset-text', preset)"
          >
            {{ preset }}
          </n-button>
        </n-flex>
      </div>
    </n-gi>

    <n-gi v-else :span="24">
      <n-form-item :label="imageContentLabel" :show-feedback="false">
        <n-flex vertical :size="10">
          <input
            ref="imageInputRef"
            class="hidden-file-input"
            type="file"
            accept="image/*"
            @change="handleImageInputChange"
          />

          <n-flex :size="8" align="center">
            <n-button
              data-test="image-upload-button"
              :disabled="isGenerating"
              @click="triggerImageDialog"
            >
              {{ imageFile ? replaceImageLabel : uploadImageLabel }}
            </n-button>
            <n-button
              v-if="imageFile"
              tertiary
              :disabled="isGenerating"
              @click="emit('clear-image')"
            >
              {{ clearImageLabel }}
            </n-button>
          </n-flex>

          <n-text depth="3">{{ imageHint }}</n-text>
          <n-text v-if="imageFile">{{ imageFile.name }}</n-text>
          <n-alert v-if="imageErrorMessage" type="error" :title="imageErrorMessage" />
        </n-flex>
      </n-form-item>
    </n-gi>
  </n-grid>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  NAlert,
  NButton,
  NFlex,
  NFormItem,
  NGi,
  NGrid,
  NInput,
  NRadioButton,
  NRadioGroup,
  NText,
} from 'naive-ui'
import type { WatermarkMode } from '../types'

defineProps<{
  modeLabel: string
  textModeLabel: string
  imageModeLabel: string
  textContentLabel: string
  imageContentLabel: string
  textPlaceholder: string
  uploadImageLabel: string
  replaceImageLabel: string
  clearImageLabel: string
  imageHint: string
  pageRangesLabel: string
  pageRangesPlaceholder: string
  imageErrorMessage: string
  textPresets: string[]
  imageFile: File | null
  mode: WatermarkMode
  rangeInput: string
  text: string
  isGenerating: boolean
}>()

const emit = defineEmits<{
  (event: 'update-mode', value: WatermarkMode): void
  (event: 'update-range-input', value: string): void
  (event: 'update-text', value: string): void
  (event: 'preset-text', value: string): void
  (event: 'upload-image', file: File): void
  (event: 'clear-image'): void
}>()

const imageInputRef = ref<HTMLInputElement | null>(null)

const handleModeChange = (value: string): void => {
  if (value === 'text' || value === 'image') {
    emit('update-mode', value)
  }
}

const triggerImageDialog = (): void => {
  imageInputRef.value?.click()
}

const handleImageInputChange = (event: Event): void => {
  const target = event.target as HTMLInputElement
  const selectedFile = target.files?.[0]
  if (!selectedFile) {
    return
  }

  emit('upload-image', selectedFile)
  target.value = ''
}
</script>

<style scoped>
.hidden-file-input {
  display: none;
}

.text-preset-list {
  padding-block: 6px 4px;
}
</style>
