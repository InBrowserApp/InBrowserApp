<template>
  <GifToApngOptionsLabelsCore v-slot="{ labels: coreLabels }">
    <GifToApngOptionsLabelsOptimize v-slot="{ labels: optimizeLabels }">
      <ConversionOptions
        v-model:scale="scale"
        v-model:speed="speed"
        v-model:loop-mode="loopMode"
        v-model:loop-count="loopCount"
        v-model:optimize="optimize"
        v-model:optimize-level="optimizeLevel"
        :title="coreLabels.title"
        :scale-label="coreLabels.scaleLabel"
        :scale-hint="coreLabels.scaleHint"
        :speed-label="coreLabels.speedLabel"
        :speed-hint="coreLabels.speedHint"
        :loop-label="coreLabels.loopLabel"
        :loop-hint="coreLabels.loopHint"
        :loop-count-label="coreLabels.loopCountLabel"
        :loop-inherit-label="coreLabels.loopInheritLabel"
        :loop-infinite-label="coreLabels.loopInfiniteLabel"
        :loop-custom-label="coreLabels.loopCustomLabel"
        :optimize-label="optimizeLabels.optimizeLabel"
        :optimize-level-label="optimizeLabels.optimizeLevelLabel"
        :optimize-hint="optimizeLabels.optimizeHint"
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
    </GifToApngOptionsLabelsOptimize>
  </GifToApngOptionsLabelsCore>
</template>

<script setup lang="ts">
import ConversionOptions from './ConversionOptions.vue'
import GifToApngOptionsLabelsCore from './GifToApngOptionsLabelsCore.vue'
import GifToApngOptionsLabelsOptimize from './GifToApngOptionsLabelsOptimize.vue'
import type { GifLoopMode } from '../types'

const scale = defineModel<number>('scale', { required: true })
const speed = defineModel<number>('speed', { required: true })
const loopMode = defineModel<GifLoopMode>('loopMode', { required: true })
const loopCount = defineModel<number | null>('loopCount', { required: true })
const optimize = defineModel<boolean>('optimize', { required: true })
const optimizeLevel = defineModel<number>('optimizeLevel', { required: true })

defineProps<{
  minScale: number
  maxScale: number
  minSpeed: number
  maxSpeed: number
  isConverting: boolean
  canConvert: boolean
}>()

const emit = defineEmits<{ (event: 'convert'): void }>()
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
