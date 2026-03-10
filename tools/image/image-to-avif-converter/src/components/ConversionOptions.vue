<template>
  <ToolSection>
    <ToolSectionHeader>{{ title }}</ToolSectionHeader>

    <ConversionOptionsBaseGrid
      v-model:scale="scale"
      v-model:quality="quality"
      v-model:speed="speed"
      v-model:lossless="lossless"
      :scale-label="scaleLabel"
      :scale-hint="scaleHint"
      :quality-label="qualityLabel"
      :quality-hint="qualityHint"
      :speed-label="speedLabel"
      :speed-hint="speedHint"
      :lossless-label="losslessLabel"
      :min-scale="minScale"
      :max-scale="maxScale"
      :min-speed="minSpeed"
      :max-speed="maxSpeed"
    />

    <ConversionOptionsAdvancedSection
      v-model:advanced-enabled="advancedEnabled"
      v-model:alpha-quality="alphaQuality"
      v-model:denoise-level="denoiseLevel"
      v-model:sharpness="sharpness"
      v-model:subsample="subsample"
      v-model:tune="tune"
      v-model:enable-sharp-yuv="enableSharpYuv"
      :advanced-label="advancedLabel"
      :alpha-quality-label="alphaQualityLabel"
      :denoise-level-label="denoiseLevelLabel"
      :sharpness-label="sharpnessLabel"
      :subsample-label="subsampleLabel"
      :subsample420-label="subsample420Label"
      :subsample422-label="subsample422Label"
      :subsample444-label="subsample444Label"
      :tune-label="tuneLabel"
      :tune-auto-label="tuneAutoLabel"
      :tune-psnr-label="tunePsnrLabel"
      :tune-ssim-label="tuneSsimLabel"
      :sharp-yuv-label="sharpYuvLabel"
    />

    <ConversionOptionsActions
      :convert-label="convertLabel"
      :converting-label="convertingLabel"
      :is-converting="isConverting"
      :can-convert="canConvert"
      @convert="emit('convert')"
    />
  </ToolSection>
</template>

<script setup lang="ts">
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import ConversionOptionsActions from './ConversionOptionsActions.vue'
import ConversionOptionsAdvancedSection from './ConversionOptionsAdvancedSection.vue'
import ConversionOptionsBaseGrid from './ConversionOptionsBaseGrid.vue'
import type { AvifSubsample, AvifTune } from '../types'

defineProps<{
  title: string
  scaleLabel: string
  scaleHint: string
  qualityLabel: string
  qualityHint: string
  speedLabel: string
  speedHint: string
  losslessLabel: string
  advancedLabel: string
  alphaQualityLabel: string
  denoiseLevelLabel: string
  sharpnessLabel: string
  subsampleLabel: string
  subsample420Label: string
  subsample422Label: string
  subsample444Label: string
  tuneLabel: string
  tuneAutoLabel: string
  tunePsnrLabel: string
  tuneSsimLabel: string
  sharpYuvLabel: string
  convertLabel: string
  convertingLabel: string
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
