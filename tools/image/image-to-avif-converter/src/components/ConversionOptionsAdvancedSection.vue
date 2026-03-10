<template>
  <n-flex align="center" :size="8" style="margin-top: 12px">
    <n-switch v-model:value="advancedEnabled" />
    <n-text>{{ advancedLabel }}</n-text>
  </n-flex>

  <n-collapse-transition :show="advancedEnabled">
    <n-grid cols="1 s:2 l:3" :x-gap="12" :y-gap="12" responsive="screen" style="margin-top: 12px">
      <n-form-item-gi :label="alphaQualityLabel" :show-feedback="false">
        <n-input-number
          v-model:value="alphaQuality"
          :min="0"
          :max="100"
          :step="1"
          style="width: 100%"
        />
      </n-form-item-gi>
      <n-form-item-gi :label="denoiseLevelLabel" :show-feedback="false">
        <n-input-number v-model:value="denoiseLevel" :min="0" :step="1" style="width: 100%" />
      </n-form-item-gi>
      <n-form-item-gi :label="sharpnessLabel" :show-feedback="false">
        <n-input-number v-model:value="sharpness" :min="0" :step="1" style="width: 100%" />
      </n-form-item-gi>
      <n-form-item-gi :label="subsampleLabel" :show-feedback="false">
        <n-select
          v-model:value="subsample"
          :options="subsampleOptions"
          clearable
          style="width: 100%"
        />
      </n-form-item-gi>
      <n-form-item-gi :label="tuneLabel" :show-feedback="false">
        <n-select v-model:value="tune" :options="tuneOptions" clearable style="width: 100%" />
      </n-form-item-gi>
      <n-form-item-gi :label="sharpYuvLabel" :show-feedback="false">
        <n-switch v-model:value="enableSharpYuv" />
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
import type { AvifSubsample, AvifTune } from '../types'

const props = defineProps<{
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
}>()

const advancedEnabled = defineModel<boolean>('advancedEnabled', { required: true })
const alphaQuality = defineModel<number | null>('alphaQuality', { required: true })
const denoiseLevel = defineModel<number | null>('denoiseLevel', { required: true })
const sharpness = defineModel<number | null>('sharpness', { required: true })
const subsample = defineModel<AvifSubsample | null>('subsample', { required: true })
const tune = defineModel<AvifTune | null>('tune', { required: true })
const enableSharpYuv = defineModel<boolean>('enableSharpYuv', { required: true })

const subsampleOptions = computed(() => [
  { label: props.subsample420Label, value: '420' as const },
  { label: props.subsample422Label, value: '422' as const },
  { label: props.subsample444Label, value: '444' as const },
])

const tuneOptions = computed(() => [
  { label: props.tuneAutoLabel, value: 'auto' as const },
  { label: props.tunePsnrLabel, value: 'psnr' as const },
  { label: props.tuneSsimLabel, value: 'ssim' as const },
])
</script>
