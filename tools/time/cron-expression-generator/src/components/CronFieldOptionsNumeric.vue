<template>
  <n-checkbox-group v-if="mode === 'specific'" v-model:value="specificValues">
    <n-grid :cols="fieldConfig.gridCols" :x-gap="4" :y-gap="4">
      <n-gi v-for="opt in options" :key="opt.value">
        <n-checkbox :value="opt.value" size="small">
          {{ opt.label }}
        </n-checkbox>
      </n-gi>
    </n-grid>
  </n-checkbox-group>
  <n-flex v-else align="center" :size="8">
    <n-text>{{ t('from') }}</n-text>
    <n-select v-model:value="rangeStart" :options="options" size="small" style="width: 100px" />
    <n-text>{{ t('to') }}</n-text>
    <n-select v-model:value="rangeEnd" :options="options" size="small" style="width: 100px" />
  </n-flex>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { NCheckbox, NCheckboxGroup, NFlex, NGi, NGrid, NSelect, NText } from 'naive-ui'

type FieldConfig = {
  min: number
  max: number
  gridCols: number
}

type Mode = 'specific' | 'range'

const props = defineProps<{
  fieldConfig: FieldConfig
  mode: Mode
}>()

const specificValues = defineModel<number[]>('specificValues', { required: true })
const rangeStart = defineModel<number>('rangeStart', { required: true })
const rangeEnd = defineModel<number>('rangeEnd', { required: true })

const { t } = useI18n()

const options = computed(() => {
  const values = [] as Array<{ value: number; label: string }>
  for (let i = props.fieldConfig.min; i <= props.fieldConfig.max; i += 1) {
    values.push({ value: i, label: String(i) })
  }
  return values
})
</script>

<i18n lang="json">
{
  "en": {
    "from": "From",
    "to": "to"
  },
  "zh": {
    "from": "从",
    "to": "到"
  },
  "zh-CN": {
    "from": "从",
    "to": "到"
  },
  "zh-TW": {
    "from": "從",
    "to": "到"
  },
  "zh-HK": {
    "from": "從",
    "to": "到"
  },
  "es": {
    "from": "Desde",
    "to": "hasta"
  },
  "fr": {
    "from": "De",
    "to": "a"
  },
  "de": {
    "from": "Von",
    "to": "bis"
  },
  "it": {
    "from": "Da",
    "to": "a"
  },
  "ja": {
    "from": "開始",
    "to": "終了"
  },
  "ko": {
    "from": "시작",
    "to": "끝"
  },
  "ru": {
    "from": "От",
    "to": "до"
  },
  "pt": {
    "from": "De",
    "to": "ate"
  },
  "ar": {
    "from": "من",
    "to": "الى"
  },
  "hi": {
    "from": "से",
    "to": "तक"
  },
  "tr": {
    "from": "Baslangic",
    "to": "bitis"
  },
  "nl": {
    "from": "Van",
    "to": "tot"
  },
  "sv": {
    "from": "Fran",
    "to": "till"
  },
  "pl": {
    "from": "Od",
    "to": "do"
  },
  "vi": {
    "from": "Tu",
    "to": "den"
  },
  "th": {
    "from": "จาก",
    "to": "ถึง"
  },
  "id": {
    "from": "Dari",
    "to": "sampai"
  },
  "he": {
    "from": "מ",
    "to": "עד"
  },
  "ms": {
    "from": "Dari",
    "to": "hingga"
  },
  "no": {
    "from": "Fra",
    "to": "til"
  }
}
</i18n>
