<template>
  <ImageToWebpOptionsLabelsCore v-slot="{ labels: coreLabels }">
    <ImageToWebpOptionsLabelsAdvanced v-slot="{ labels: advancedLabels }">
      <ConversionOptions
        v-model:scale="scale"
        v-model:quality="quality"
        v-model:method="method"
        v-model:lossless="lossless"
        v-model:advanced-enabled="advancedEnabled"
        v-model:target-size="targetSize"
        v-model:target-psnr="targetPsnr"
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
        :title="coreLabels.title"
        :scale-label="coreLabels.scaleLabel"
        :scale-hint="coreLabels.scaleHint"
        :quality-label="coreLabels.qualityLabel"
        :quality-hint="coreLabels.qualityHint"
        :method-label="coreLabels.methodLabel"
        :method-hint="coreLabels.methodHint"
        :lossless-label="coreLabels.losslessLabel"
        :advanced-label="coreLabels.advancedLabel"
        :target-size-label="advancedLabels.targetSizeLabel"
        :target-psnr-label="advancedLabels.targetPsnrLabel"
        :near-lossless-label="advancedLabels.nearLosslessLabel"
        :alpha-quality-label="advancedLabels.alphaQualityLabel"
        :sns-strength-label="advancedLabels.snsStrengthLabel"
        :filter-strength-label="advancedLabels.filterStrengthLabel"
        :filter-sharpness-label="advancedLabels.filterSharpnessLabel"
        :filter-type-label="advancedLabels.filterTypeLabel"
        :partitions-label="advancedLabels.partitionsLabel"
        :segments-label="advancedLabels.segmentsLabel"
        :pass-label="advancedLabels.passLabel"
        :exact-label="advancedLabels.exactLabel"
        :use-sharp-yuv-label="advancedLabels.useSharpYuvLabel"
        :option-default-label="advancedLabels.optionDefault"
        :option-on-label="advancedLabels.optionOn"
        :option-off-label="advancedLabels.optionOff"
        :convert-label="coreLabels.convertLabel"
        :converting-label="coreLabels.convertingLabel"
        :min-scale="minScale"
        :max-scale="maxScale"
        :is-converting="isConverting"
        :can-convert="canConvert"
        @convert="emit('convert')"
      />
    </ImageToWebpOptionsLabelsAdvanced>
  </ImageToWebpOptionsLabelsCore>
</template>

<script setup lang="ts">
import ConversionOptions from './ConversionOptions.vue'
import ImageToWebpOptionsLabelsAdvanced from './ImageToWebpOptionsLabelsAdvanced.vue'
import ImageToWebpOptionsLabelsCore from './ImageToWebpOptionsLabelsCore.vue'

type TriState = 'default' | 'on' | 'off'

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

defineProps<{
  minScale: number
  maxScale: number
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
