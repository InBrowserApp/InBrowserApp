<template>
  <ToolSection>
    <ToolSectionHeader>{{ title }}</ToolSectionHeader>
    <ConversionOptionsBaseGrid
      v-model:lossless="lossless"
      :scale-label="scaleLabel"
      :scale-hint="scaleHint"
      :quality-label="qualityLabel"
      :quality-hint="qualityHint"
      :method-label="methodLabel"
      :method-hint="methodHint"
      :lossless-label="losslessLabel"
      :scale="scale"
      :quality="quality"
      :method="method"
      :min-scale="minScale"
      :max-scale="maxScale"
      @update:scale="handleScaleUpdate"
      @update:quality="handleQualityUpdate"
      @update:method="handleMethodUpdate"
    />
    <ConversionOptionsAdvancedSection
      v-model:advanced-enabled="advancedEnabled"
      v-model:near-lossless="nearLossless"
      v-model:alpha-quality="alphaQuality"
      v-model:sns-strength="snsStrength"
      v-model:filter-strength="filterStrength"
      v-model:filter-sharpness="filterSharpness"
      v-model:filter-type="filterType"
      v-model:partitions="partitions"
      v-model:segments="segments"
      v-model:pass-count="passCount"
      v-model:exact-mode="exactMode"
      v-model:sharp-yuv-mode="sharpYuvMode"
      :advanced-label="advancedLabel"
      :target-size-label="targetSizeLabel"
      :target-psnr-label="targetPsnrLabel"
      :near-lossless-label="nearLosslessLabel"
      :alpha-quality-label="alphaQualityLabel"
      :sns-strength-label="snsStrengthLabel"
      :filter-strength-label="filterStrengthLabel"
      :filter-sharpness-label="filterSharpnessLabel"
      :filter-type-label="filterTypeLabel"
      :partitions-label="partitionsLabel"
      :segments-label="segmentsLabel"
      :pass-label="passLabel"
      :exact-label="exactLabel"
      :use-sharp-yuv-label="useSharpYuvLabel"
      :option-default-label="optionDefaultLabel"
      :option-on-label="optionOnLabel"
      :option-off-label="optionOffLabel"
      :target-size="targetSize"
      :target-psnr="targetPsnr"
      @update:target-size="handleTargetSizeUpdate"
      @update:target-psnr="handleTargetPsnrUpdate"
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

type TriState = 'default' | 'on' | 'off'

defineProps<{
  title: string
  scaleLabel: string
  scaleHint: string
  qualityLabel: string
  qualityHint: string
  methodLabel: string
  methodHint: string
  losslessLabel: string
  advancedLabel: string
  targetSizeLabel: string
  targetPsnrLabel: string
  nearLosslessLabel: string
  alphaQualityLabel: string
  snsStrengthLabel: string
  filterStrengthLabel: string
  filterSharpnessLabel: string
  filterTypeLabel: string
  partitionsLabel: string
  segmentsLabel: string
  passLabel: string
  exactLabel: string
  useSharpYuvLabel: string
  optionDefaultLabel: string
  optionOnLabel: string
  optionOffLabel: string
  convertLabel: string
  convertingLabel: string
  minScale: number
  maxScale: number
  isConverting: boolean
  canConvert: boolean
}>()

const emit = defineEmits<{
  convert: []
  'update:targetPsnr': [value: number | null]
  'update:targetSize': [value: number | null]
}>()

const scale = defineModel<number>('scale', { required: true })
const quality = defineModel<number>('quality', { required: true })
const method = defineModel<number>('method', { required: true })
const lossless = defineModel<boolean>('lossless', { required: true })
const advancedEnabled = defineModel<boolean>('advancedEnabled', { required: true })
const targetSize = defineModel<number | null>('targetSize', { required: true })
const targetPsnr = defineModel<number | null>('targetPsnr', { required: true })
const nearLossless = defineModel<number | null>('nearLossless', { required: true })
const alphaQuality = defineModel<number | null>('alphaQuality', { required: true })
const snsStrength = defineModel<number | null>('snsStrength', { required: true })
const filterStrength = defineModel<number | null>('filterStrength', { required: true })
const filterSharpness = defineModel<number | null>('filterSharpness', { required: true })
const filterType = defineModel<number | null>('filterType', { required: true })
const partitions = defineModel<number | null>('partitions', { required: true })
const segments = defineModel<number | null>('segments', { required: true })
const passCount = defineModel<number | null>('passCount', { required: true })
const exactMode = defineModel<TriState>('exactMode', { required: true })
const sharpYuvMode = defineModel<TriState>('sharpYuvMode', { required: true })

function handleScaleUpdate(value: number | null) {
  if (value === null) return
  scale.value = value
}

function handleQualityUpdate(value: number | null) {
  if (value === null) return
  quality.value = value
}

function handleMethodUpdate(value: number | null) {
  if (value === null) return
  method.value = value
}

function handleTargetSizeUpdate(value: number | null) {
  targetSize.value = value
  if (value !== null) {
    if (targetPsnr.value === null) {
      emit('update:targetPsnr', null)
    } else {
      targetPsnr.value = null
    }
  }
}

function handleTargetPsnrUpdate(value: number | null) {
  targetPsnr.value = value
  if (value !== null) {
    if (targetSize.value === null) {
      emit('update:targetSize', null)
    } else {
      targetSize.value = null
    }
  }
}
</script>
