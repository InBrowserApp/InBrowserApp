<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <ImageToAvifUploadSection v-model:files="files" />

    <ImageToAvifOptionsSection
      v-if="files.length"
      v-model:scale="scale"
      v-model:quality="quality"
      v-model:speed="speed"
      v-model:lossless="lossless"
      v-model:advanced-enabled="advancedEnabled"
      v-model:alpha-quality="alphaQuality"
      v-model:denoise-level="denoiseLevel"
      v-model:sharpness="sharpness"
      v-model:subsample="subsample"
      v-model:tune="tune"
      v-model:enable-sharp-yuv="enableSharpYuv"
      :min-scale="minScale"
      :max-scale="maxScale"
      :min-speed="minSpeed"
      :max-speed="maxSpeed"
      :is-converting="isConverting"
      :can-convert="canConvert"
      @convert="convertImages"
    />

    <ImageToAvifResultsSection
      v-if="results.length"
      :results="results"
      :zip-blob="zipBlob"
      :is-zipping="isZipping"
      :download-zip-name="zipName"
    />

    <ToolSection v-if="error">
      <n-alert type="warning" :show-icon="false">{{ error }}</n-alert>
    </ToolSection>

    <ImageToAvifNote />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useMessage, NAlert } from 'naive-ui'
import { ToolDefaultPageLayout, ToolSection } from '@shared/ui/tool'
import * as toolInfo from './info'
import ImageToAvifNote from './components/ImageToAvifNote.vue'
import ImageToAvifOptionsSection from './components/ImageToAvifOptionsSection.vue'
import ImageToAvifResultsSection from './components/ImageToAvifResultsSection.vue'
import ImageToAvifUploadSection from './components/ImageToAvifUploadSection.vue'
import { useAvifConversion } from './composables/useAvifConversion'
import type { AvifSubsample, AvifTune } from './types'

const message = useMessage()

const files = ref<File[]>([])
const scale = ref(100)
const quality = ref(75)
const speed = ref(6)
const lossless = ref(false)
const advancedEnabled = ref(false)
const alphaQuality = ref<number | null>(null)
const denoiseLevel = ref<number | null>(null)
const sharpness = ref<number | null>(null)
const subsample = ref<AvifSubsample | null>(null)
const tune = ref<AvifTune | null>(null)
const enableSharpYuv = ref(false)

const minScale = 10
const maxScale = 400
const minSpeed = 0
const maxSpeed = 10
const zipName = 'avif-images.zip'

const messages = {
  convertSuccess: () => 'Conversion completed.',
  convertFailed: () => 'Failed to convert images. Please try again.',
  partialFailed: (count: number) => `${count} files failed to convert.`,
  zipFailed: () => 'Failed to create the ZIP file.',
  invalidImage: () => 'Failed to load the image. Please try another file.',
  canvasUnavailable: () => 'Canvas is not available in this browser.',
}

const { results, zipBlob, error, isConverting, isZipping, canConvert, convertImages } =
  useAvifConversion({
    files,
    scale,
    quality,
    speed,
    lossless,
    advancedEnabled,
    alphaQuality,
    denoiseLevel,
    sharpness,
    subsample,
    tune,
    enableSharpYuv,
    messages,
    message,
  })
</script>
