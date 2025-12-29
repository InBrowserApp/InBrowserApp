<template>
  <InfoStatistic :label="t('cpu-cores')" :value="cpuCores?.toString()" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import InfoStatistic from '../common/InfoStatistic.vue'

const { t } = useI18n()

// CPU Information
const cpuCores = computed(() => navigator.hardwareConcurrency || undefined)
</script>

<i18n lang="json">
{
  "en": {
    "cpu-cores": "CPU Cores"
  },
  "zh": {
    "cpu-cores": "CPU核心数"
  },
  "zh-CN": {
    "cpu-cores": "CPU核心数"
  },
  "zh-TW": {
    "cpu-cores": "CPU 核心數"
  },
  "zh-HK": {
    "cpu-cores": "CPU 核心數"
  },
  "es": {
    "cpu-cores": "Nucleos de CPU"
  },
  "fr": {
    "cpu-cores": "Coeurs CPU"
  },
  "de": {
    "cpu-cores": "CPU-Kerne"
  },
  "it": {
    "cpu-cores": "Core CPU"
  },
  "ja": {
    "cpu-cores": "CPUコア数"
  },
  "ko": {
    "cpu-cores": "CPU 코어"
  },
  "ru": {
    "cpu-cores": "Ядра процессора"
  },
  "pt": {
    "cpu-cores": "Nucleos da CPU"
  },
  "ar": {
    "cpu-cores": "أنوية المعالج"
  },
  "hi": {
    "cpu-cores": "CPU कोर"
  },
  "tr": {
    "cpu-cores": "CPU Cekirdekleri"
  },
  "nl": {
    "cpu-cores": "CPU-kernen"
  },
  "sv": {
    "cpu-cores": "CPU-karnor"
  },
  "pl": {
    "cpu-cores": "Rdzenie CPU"
  },
  "vi": {
    "cpu-cores": "So loi CPU"
  },
  "th": {
    "cpu-cores": "คอร์ CPU"
  },
  "id": {
    "cpu-cores": "Inti CPU"
  },
  "he": {
    "cpu-cores": "ליבות מעבד"
  },
  "ms": {
    "cpu-cores": "Teras CPU"
  },
  "no": {
    "cpu-cores": "CPU-kjerner"
  }
}
</i18n>
