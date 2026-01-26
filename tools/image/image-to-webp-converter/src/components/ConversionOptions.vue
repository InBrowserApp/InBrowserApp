<template>
  <ToolSection>
    <ToolSectionHeader>{{ title }}</ToolSectionHeader>

    <n-grid cols="1 s:2 l:4" :x-gap="12" :y-gap="12" responsive="screen">
      <n-form-item-gi :label="scaleLabel" :show-feedback="false">
        <n-flex vertical :size="8" style="width: 100%">
          <n-input-number
            :value="scale"
            :min="minScale"
            :max="maxScale"
            :step="1"
            style="width: 100%"
            @update:value="handleScaleUpdate"
          />
          <n-text depth="3">{{ scaleHint }}</n-text>
        </n-flex>
      </n-form-item-gi>
      <n-form-item-gi :label="qualityLabel" :show-feedback="false">
        <n-flex vertical :size="8" style="width: 100%">
          <n-input-number
            :value="quality"
            :min="0"
            :max="100"
            :step="1"
            style="width: 100%"
            @update:value="handleQualityUpdate"
          />
          <n-text depth="3">{{ qualityHint }}</n-text>
        </n-flex>
      </n-form-item-gi>
      <n-form-item-gi :label="methodLabel" :show-feedback="false">
        <n-flex vertical :size="8" style="width: 100%">
          <n-input-number
            :value="method"
            :min="0"
            :max="6"
            :step="1"
            style="width: 100%"
            @update:value="handleMethodUpdate"
          />
          <n-text depth="3">{{ methodHint }}</n-text>
        </n-flex>
      </n-form-item-gi>
      <n-form-item-gi :label="losslessLabel" :show-feedback="false">
        <n-switch :value="lossless" @update:value="handleLosslessUpdate" />
      </n-form-item-gi>
    </n-grid>

    <n-flex align="center" :size="8" style="margin-top: 12px">
      <n-switch :value="advancedEnabled" @update:value="handleAdvancedEnabledUpdate" />
      <n-text>{{ advancedLabel }}</n-text>
    </n-flex>

    <n-collapse-transition :show="advancedEnabled">
      <n-grid cols="1 s:2 l:3" :x-gap="12" :y-gap="12" responsive="screen" style="margin-top: 12px">
        <n-form-item-gi :label="targetSizeLabel" :show-feedback="false">
          <n-input-number
            :value="targetSize"
            :min="0"
            :step="1"
            style="width: 100%"
            @update:value="handleTargetSizeUpdate"
          />
        </n-form-item-gi>
        <n-form-item-gi :label="targetPsnrLabel" :show-feedback="false">
          <n-input-number
            :value="targetPsnr"
            :min="0"
            :step="0.1"
            style="width: 100%"
            @update:value="handleTargetPsnrUpdate"
          />
        </n-form-item-gi>
        <n-form-item-gi :label="nearLosslessLabel" :show-feedback="false">
          <n-input-number
            :value="nearLossless"
            :min="0"
            :max="100"
            :step="1"
            style="width: 100%"
            @update:value="handleNearLosslessUpdate"
          />
        </n-form-item-gi>
        <n-form-item-gi :label="alphaQualityLabel" :show-feedback="false">
          <n-input-number
            :value="alphaQuality"
            :min="0"
            :max="100"
            :step="1"
            style="width: 100%"
            @update:value="handleAlphaQualityUpdate"
          />
        </n-form-item-gi>
        <n-form-item-gi :label="snsStrengthLabel" :show-feedback="false">
          <n-input-number
            :value="snsStrength"
            :min="0"
            :max="100"
            :step="1"
            style="width: 100%"
            @update:value="handleSnsStrengthUpdate"
          />
        </n-form-item-gi>
        <n-form-item-gi :label="filterStrengthLabel" :show-feedback="false">
          <n-input-number
            :value="filterStrength"
            :min="0"
            :max="100"
            :step="1"
            style="width: 100%"
            @update:value="handleFilterStrengthUpdate"
          />
        </n-form-item-gi>
        <n-form-item-gi :label="filterSharpnessLabel" :show-feedback="false">
          <n-input-number
            :value="filterSharpness"
            :min="0"
            :max="7"
            :step="1"
            style="width: 100%"
            @update:value="handleFilterSharpnessUpdate"
          />
        </n-form-item-gi>
        <n-form-item-gi :label="filterTypeLabel" :show-feedback="false">
          <n-input-number
            :value="filterType"
            :min="0"
            :max="1"
            :step="1"
            style="width: 100%"
            @update:value="handleFilterTypeUpdate"
          />
        </n-form-item-gi>
        <n-form-item-gi :label="partitionsLabel" :show-feedback="false">
          <n-input-number
            :value="partitions"
            :min="0"
            :max="3"
            :step="1"
            style="width: 100%"
            @update:value="handlePartitionsUpdate"
          />
        </n-form-item-gi>
        <n-form-item-gi :label="segmentsLabel" :show-feedback="false">
          <n-input-number
            :value="segments"
            :min="1"
            :max="4"
            :step="1"
            style="width: 100%"
            @update:value="handleSegmentsUpdate"
          />
        </n-form-item-gi>
        <n-form-item-gi :label="passLabel" :show-feedback="false">
          <n-input-number
            :value="passCount"
            :min="1"
            :max="10"
            :step="1"
            style="width: 100%"
            @update:value="handlePassCountUpdate"
          />
        </n-form-item-gi>
        <n-form-item-gi :label="exactLabel" :show-feedback="false">
          <n-select
            :value="exactMode"
            :options="toggleOptions"
            style="width: 100%"
            @update:value="handleExactModeUpdate"
          />
        </n-form-item-gi>
        <n-form-item-gi :label="useSharpYuvLabel" :show-feedback="false">
          <n-select
            :value="sharpYuvMode"
            :options="toggleOptions"
            style="width: 100%"
            @update:value="handleSharpYuvModeUpdate"
          />
        </n-form-item-gi>
      </n-grid>
    </n-collapse-transition>

    <n-flex align="center" :size="12" style="margin-top: 12px">
      <n-button
        type="primary"
        :loading="isConverting"
        :disabled="!canConvert"
        @click="emit('convert')"
      >
        <template #icon>
          <n-icon><ImageEdit24Regular /></n-icon>
        </template>
        {{ isConverting ? convertingLabel : convertLabel }}
      </n-button>
    </n-flex>
  </ToolSection>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  NButton,
  NCollapseTransition,
  NFlex,
  NFormItemGi,
  NGrid,
  NIcon,
  NInputNumber,
  NSelect,
  NSwitch,
  NText,
} from 'naive-ui'
import ImageEdit24Regular from '@vicons/fluent/ImageEdit24Regular'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'

type TriState = 'default' | 'on' | 'off'

const props = defineProps<{
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

const toggleOptions = computed(() => [
  { label: props.optionDefaultLabel, value: 'default' as const },
  { label: props.optionOnLabel, value: 'on' as const },
  { label: props.optionOffLabel, value: 'off' as const },
])

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
  if (value !== null) emit('update:targetPsnr', null)
}

function handleTargetPsnrUpdate(value: number | null) {
  emit('update:targetPsnr', value)
  if (value !== null) emit('update:targetSize', null)
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
