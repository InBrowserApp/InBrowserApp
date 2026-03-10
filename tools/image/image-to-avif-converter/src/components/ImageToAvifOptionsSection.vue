<template>
  <ImageToAvifOptionsLabelsCore v-slot="{ labels: coreLabels }">
    <ImageToAvifOptionsLabelsAdvanced v-slot="{ labels: advancedLabels }">
      <ConversionOptions
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
        :title="coreLabels.title"
        :scale-label="coreLabels.scaleLabel"
        :scale-hint="coreLabels.scaleHint"
        :quality-label="coreLabels.qualityLabel"
        :quality-hint="coreLabels.qualityHint"
        :speed-label="coreLabels.speedLabel"
        :speed-hint="coreLabels.speedHint"
        :lossless-label="coreLabels.losslessLabel"
        :advanced-label="coreLabels.advancedLabel"
        :alpha-quality-label="advancedLabels.alphaQualityLabel"
        :denoise-level-label="advancedLabels.denoiseLevelLabel"
        :sharpness-label="advancedLabels.sharpnessLabel"
        :subsample-label="advancedLabels.subsampleLabel"
        :subsample420-label="advancedLabels.subsample420Label"
        :subsample422-label="advancedLabels.subsample422Label"
        :subsample444-label="advancedLabels.subsample444Label"
        :tune-label="advancedLabels.tuneLabel"
        :tune-auto-label="advancedLabels.tuneAutoLabel"
        :tune-psnr-label="advancedLabels.tunePsnrLabel"
        :tune-ssim-label="advancedLabels.tuneSsimLabel"
        :sharp-yuv-label="advancedLabels.sharpYuvLabel"
        :convert-label="coreLabels.convertLabel"
        :converting-label="coreLabels.convertingLabel"
        :min-scale="minScale"
        :max-scale="maxScale"
        :min-speed="minSpeed"
        :max-speed="maxSpeed"
        :is-converting="isConverting"
        :can-convert="canConvert"
        @convert="emit('convert')"
      />
    </ImageToAvifOptionsLabelsAdvanced>
  </ImageToAvifOptionsLabelsCore>
</template>

<script setup lang="ts">
import ConversionOptions from './ConversionOptions.vue'
import ImageToAvifOptionsLabelsAdvanced from './ImageToAvifOptionsLabelsAdvanced.vue'
import ImageToAvifOptionsLabelsCore from './ImageToAvifOptionsLabelsCore.vue'
import type { AvifSubsample, AvifTune } from '../types'

defineProps<{
  minScale: number
  maxScale: number
  minSpeed: number
  maxSpeed: number
  isConverting: boolean
  canConvert: boolean
}>()

const emit = defineEmits<{ convert: [] }>()

const scale = defineModel<number>('scale', { required: true })
const quality = defineModel<number>('quality', { required: true })
const speed = defineModel<number>('speed', { required: true })
const lossless = defineModel<boolean>('lossless', { required: true })
const advancedEnabled = defineModel<boolean>('advancedEnabled', { required: true })
const alphaQuality = defineModel<number | null>('alphaQuality', { required: true })
const denoiseLevel = defineModel<number | null>('denoiseLevel', { required: true })
const sharpness = defineModel<number | null>('sharpness', { required: true })
const subsample = defineModel<AvifSubsample | null>('subsample', { required: true })
const tune = defineModel<AvifTune | null>('tune', { required: true })
const enableSharpYuv = defineModel<boolean>('enableSharpYuv', { required: true })
</script>

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
