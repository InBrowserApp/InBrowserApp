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
}>()

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

const toggleOptions = computed(() => [
  { label: props.optionDefaultLabel, value: 'default' as const },
  { label: props.optionOnLabel, value: 'on' as const },
  { label: props.optionOffLabel, value: 'off' as const },
])

function handleAdvancedEnabledUpdate(value: boolean) {
  advancedEnabled.value = value
}

function handleTargetSizeUpdate(value: number | null) {
  targetSize.value = value
  if (value !== null) targetPsnr.value = null
}

function handleTargetPsnrUpdate(value: number | null) {
  targetPsnr.value = value
  if (value !== null) targetSize.value = null
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
