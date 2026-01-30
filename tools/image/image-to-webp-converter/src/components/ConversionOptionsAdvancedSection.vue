<template>
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
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  NCollapseTransition,
  NFlex,
  NFormItemGi,
  NGrid,
  NInputNumber,
  NSelect,
  NSwitch,
  NText,
} from 'naive-ui'

type TriState = 'default' | 'on' | 'off'

const props = defineProps<{
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
}>()

const emit = defineEmits<{
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
}>()

const toggleOptions = computed(() => [
  { label: props.optionDefaultLabel, value: 'default' as const },
  { label: props.optionOnLabel, value: 'on' as const },
  { label: props.optionOffLabel, value: 'off' as const },
])

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
