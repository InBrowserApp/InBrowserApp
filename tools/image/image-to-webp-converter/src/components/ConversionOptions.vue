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
  scale: number
  quality: number
  method: number
  lossless: boolean
  advancedEnabled: boolean
  targetSize: number | null
  targetPsnr: number | null
  nearLossless: number | null
  alphaQuality: number | null
  snsStrength: number | null
  filterStrength: number | null
  filterSharpness: number | null
  filterType: number | null
  partitions: number | null
  segments: number | null
  passCount: number | null
  exactMode: TriState
  sharpYuvMode: TriState
  minScale: number
  maxScale: number
  isConverting: boolean
  canConvert: boolean
}>()

const emit = defineEmits<{
  'update:scale': [value: number]
  'update:quality': [value: number]
  'update:method': [value: number]
  'update:lossless': [value: boolean]
  'update:advancedEnabled': [value: boolean]
  'update:targetSize': [value: number | null]
  'update:targetPsnr': [value: number | null]
  'update:nearLossless': [value: number | null]
  'update:alphaQuality': [value: number | null]
  'update:snsStrength': [value: number | null]
  'update:filterStrength': [value: number | null]
  'update:filterSharpness': [value: number | null]
  'update:filterType': [value: number | null]
  'update:partitions': [value: number | null]
  'update:segments': [value: number | null]
  'update:passCount': [value: number | null]
  'update:exactMode': [value: TriState]
  'update:sharpYuvMode': [value: TriState]
  convert: []
}>()

function handleScaleUpdate(value: number | null) {
  if (value === null) return
  emit('update:scale', value)
}

function handleQualityUpdate(value: number | null) {
  if (value === null) return
  emit('update:quality', value)
}

function handleMethodUpdate(value: number | null) {
  if (value === null) return
  emit('update:method', value)
}

function handleLosslessUpdate(value: boolean) {
  emit('update:lossless', value)
}

function handleAdvancedEnabledUpdate(value: boolean) {
  emit('update:advancedEnabled', value)
}

function handleTargetSizeUpdate(value: number | null) {
  emit('update:targetSize', value)
  if (value !== null) {
    emit('update:targetPsnr', null)
  }
}

function handleTargetPsnrUpdate(value: number | null) {
  emit('update:targetPsnr', value)
  if (value !== null) {
    emit('update:targetSize', null)
  }
}

function handleNearLosslessUpdate(value: number | null) {
  emit('update:nearLossless', value)
}

function handleAlphaQualityUpdate(value: number | null) {
  emit('update:alphaQuality', value)
}

function handleSnsStrengthUpdate(value: number | null) {
  emit('update:snsStrength', value)
}

function handleFilterStrengthUpdate(value: number | null) {
  emit('update:filterStrength', value)
}

function handleFilterSharpnessUpdate(value: number | null) {
  emit('update:filterSharpness', value)
}

function handleFilterTypeUpdate(value: number | null) {
  emit('update:filterType', value)
}

function handlePartitionsUpdate(value: number | null) {
  emit('update:partitions', value)
}

function handleSegmentsUpdate(value: number | null) {
  emit('update:segments', value)
}

function handlePassCountUpdate(value: number | null) {
  emit('update:passCount', value)
}

function handleExactModeUpdate(value: TriState) {
  emit('update:exactMode', value)
}

function handleSharpYuvModeUpdate(value: TriState) {
  emit('update:sharpYuvMode', value)
}
</script>
