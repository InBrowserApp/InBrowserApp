<template>
  <ToolSection>
    <ToolSectionHeader>{{ title }}</ToolSectionHeader>
    <ConversionOptionsBaseGrid
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
      :lossless="lossless"
      :min-scale="minScale"
      :max-scale="maxScale"
      @update:scale="handleScaleUpdate"
      @update:quality="handleQualityUpdate"
      @update:method="handleMethodUpdate"
      @update:lossless="handleLosslessUpdate"
    />
    <ConversionOptionsAdvancedSection
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
      :advanced-enabled="advancedEnabled"
      :target-size="targetSize"
      :target-psnr="targetPsnr"
      :near-lossless="nearLossless"
      :alpha-quality="alphaQuality"
      :sns-strength="snsStrength"
      :filter-strength="filterStrength"
      :filter-sharpness="filterSharpness"
      :filter-type="filterType"
      :partitions="partitions"
      :segments="segments"
      :pass-count="passCount"
      :exact-mode="exactMode"
      :sharp-yuv-mode="sharpYuvMode"
      @update:advanced-enabled="handleAdvancedEnabledUpdate"
      @update:target-size="handleTargetSizeUpdate"
      @update:target-psnr="handleTargetPsnrUpdate"
      @update:near-lossless="handleNearLosslessUpdate"
      @update:alpha-quality="handleAlphaQualityUpdate"
      @update:sns-strength="handleSnsStrengthUpdate"
      @update:filter-strength="handleFilterStrengthUpdate"
      @update:filter-sharpness="handleFilterSharpnessUpdate"
      @update:filter-type="handleFilterTypeUpdate"
      @update:partitions="handlePartitionsUpdate"
      @update:segments="handleSegmentsUpdate"
      @update:pass-count="handlePassCountUpdate"
      @update:exact-mode="handleExactModeUpdate"
      @update:sharp-yuv-mode="handleSharpYuvModeUpdate"
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

function handleLosslessUpdate(value: boolean) {
  lossless.value = value
}

function handleAdvancedEnabledUpdate(value: boolean) {
  advancedEnabled.value = value
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

function handleNearLosslessUpdate(value: number | null) {
  nearLossless.value = value
}

function handleAlphaQualityUpdate(value: number | null) {
  alphaQuality.value = value
}

function handleSnsStrengthUpdate(value: number | null) {
  snsStrength.value = value
}

function handleFilterStrengthUpdate(value: number | null) {
  filterStrength.value = value
}

function handleFilterSharpnessUpdate(value: number | null) {
  filterSharpness.value = value
}

function handleFilterTypeUpdate(value: number | null) {
  filterType.value = value
}

function handlePartitionsUpdate(value: number | null) {
  partitions.value = value
}

function handleSegmentsUpdate(value: number | null) {
  segments.value = value
}

function handlePassCountUpdate(value: number | null) {
  passCount.value = value
}

function handleExactModeUpdate(value: TriState) {
  exactMode.value = value
}

function handleSharpYuvModeUpdate(value: TriState) {
  sharpYuvMode.value = value
}
</script>
