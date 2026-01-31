<template>
  <n-grid :cols="2" :x-gap="16" :y-gap="12">
    <n-gi>
      <n-flex vertical :size="6">
        <n-text depth="3">{{ t('volume') }}</n-text>
        <n-slider v-model:value="volumeModel" :min="0" :max="1" :step="0.01" />
      </n-flex>
    </n-gi>
    <n-gi>
      <n-flex vertical :size="6">
        <n-text depth="3">{{ t('offset') }}</n-text>
        <n-input-number v-model:value="offsetModel" :step="1" />
      </n-flex>
    </n-gi>
    <n-gi>
      <n-flex vertical :size="6">
        <n-text depth="3">{{ t('carrier') }}</n-text>
        <n-text v-if="carrierHz !== undefined"
          >{{ carrierHz.toLocaleString() }} {{ t('hz') }}</n-text
        >
        <n-text v-else>-</n-text>
      </n-flex>
    </n-gi>
    <n-gi>
      <n-flex vertical :size="6">
        <n-text depth="3">{{ t('baseTone') }}</n-text>
        <n-text v-if="baseHz !== undefined">{{ baseHz.toLocaleString() }} {{ t('hz') }}</n-text>
        <n-text v-else>-</n-text>
      </n-flex>
    </n-gi>
  </n-grid>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NFlex, NGrid, NGi, NInputNumber, NSlider, NText } from 'naive-ui'
import { useI18n } from 'vue-i18n'

defineProps<{
  carrierHz?: number
  baseHz?: number
}>()

const volume = defineModel<number>('volume', { required: true })
const offsetMs = defineModel<number>('offsetMs', { required: true })

const { t } = useI18n()

const volumeModel = computed({
  get: () => volume.value,
  set: (value) => {
    volume.value = value
  },
})

const offsetModel = computed({
  get: () => offsetMs.value,
  set: (value) => {
    offsetMs.value = value ?? 0
  },
})
</script>

<i18n lang="json">
{
  "en": {
    "volume": "Volume",
    "offset": "Time Offset (ms)",
    "carrier": "Carrier",
    "baseTone": "Output tone",
    "hz": "Hz"
  },
  "zh": {
    "volume": "音量",
    "offset": "时间偏移（毫秒）",
    "carrier": "载波",
    "baseTone": "输出音调",
    "hz": "赫兹"
  },
  "zh-CN": {
    "volume": "音量",
    "offset": "时间偏移（毫秒）",
    "carrier": "载波",
    "baseTone": "输出音调",
    "hz": "赫兹"
  },
  "zh-TW": {
    "volume": "音量",
    "offset": "時間偏移（毫秒）",
    "carrier": "載波",
    "baseTone": "輸出音調",
    "hz": "赫茲"
  },
  "zh-HK": {
    "volume": "音量",
    "offset": "時間偏移（毫秒）",
    "carrier": "載波",
    "baseTone": "輸出音調",
    "hz": "赫茲"
  },
  "es": {
    "volume": "Volume",
    "offset": "Time Offset (ms)",
    "carrier": "Carrier",
    "baseTone": "Output tone",
    "hz": "Hz"
  },
  "fr": {
    "volume": "Volume",
    "offset": "Time Offset (ms)",
    "carrier": "Carrier",
    "baseTone": "Output tone",
    "hz": "Hz"
  },
  "de": {
    "volume": "Volume",
    "offset": "Time Offset (ms)",
    "carrier": "Carrier",
    "baseTone": "Output tone",
    "hz": "Hz"
  },
  "it": {
    "volume": "Volume",
    "offset": "Time Offset (ms)",
    "carrier": "Carrier",
    "baseTone": "Output tone",
    "hz": "Hz"
  },
  "ja": {
    "volume": "Volume",
    "offset": "Time Offset (ms)",
    "carrier": "Carrier",
    "baseTone": "Output tone",
    "hz": "Hz"
  },
  "ko": {
    "volume": "Volume",
    "offset": "Time Offset (ms)",
    "carrier": "Carrier",
    "baseTone": "Output tone",
    "hz": "Hz"
  },
  "ru": {
    "volume": "Volume",
    "offset": "Time Offset (ms)",
    "carrier": "Carrier",
    "baseTone": "Output tone",
    "hz": "Hz"
  },
  "pt": {
    "volume": "Volume",
    "offset": "Time Offset (ms)",
    "carrier": "Carrier",
    "baseTone": "Output tone",
    "hz": "Hz"
  },
  "ar": {
    "volume": "Volume",
    "offset": "Time Offset (ms)",
    "carrier": "Carrier",
    "baseTone": "Output tone",
    "hz": "Hz"
  },
  "hi": {
    "volume": "Volume",
    "offset": "Time Offset (ms)",
    "carrier": "Carrier",
    "baseTone": "Output tone",
    "hz": "Hz"
  },
  "tr": {
    "volume": "Volume",
    "offset": "Time Offset (ms)",
    "carrier": "Carrier",
    "baseTone": "Output tone",
    "hz": "Hz"
  },
  "nl": {
    "volume": "Volume",
    "offset": "Time Offset (ms)",
    "carrier": "Carrier",
    "baseTone": "Output tone",
    "hz": "Hz"
  },
  "sv": {
    "volume": "Volume",
    "offset": "Time Offset (ms)",
    "carrier": "Carrier",
    "baseTone": "Output tone",
    "hz": "Hz"
  },
  "pl": {
    "volume": "Volume",
    "offset": "Time Offset (ms)",
    "carrier": "Carrier",
    "baseTone": "Output tone",
    "hz": "Hz"
  },
  "vi": {
    "volume": "Volume",
    "offset": "Time Offset (ms)",
    "carrier": "Carrier",
    "baseTone": "Output tone",
    "hz": "Hz"
  },
  "th": {
    "volume": "Volume",
    "offset": "Time Offset (ms)",
    "carrier": "Carrier",
    "baseTone": "Output tone",
    "hz": "Hz"
  },
  "id": {
    "volume": "Volume",
    "offset": "Time Offset (ms)",
    "carrier": "Carrier",
    "baseTone": "Output tone",
    "hz": "Hz"
  },
  "he": {
    "volume": "Volume",
    "offset": "Time Offset (ms)",
    "carrier": "Carrier",
    "baseTone": "Output tone",
    "hz": "Hz"
  },
  "ms": {
    "volume": "Volume",
    "offset": "Time Offset (ms)",
    "carrier": "Carrier",
    "baseTone": "Output tone",
    "hz": "Hz"
  },
  "no": {
    "volume": "Volume",
    "offset": "Time Offset (ms)",
    "carrier": "Carrier",
    "baseTone": "Output tone",
    "hz": "Hz"
  }
}
</i18n>
