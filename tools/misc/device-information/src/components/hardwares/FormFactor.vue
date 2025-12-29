<template>
  <InfoStatistic :label="t('form-factor')" :value="formFactor" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { computedAsync } from '@vueuse/core'
import InfoStatistic from '../common/InfoStatistic.vue'

const { t } = useI18n()

declare global {
  interface Navigator {
    readonly userAgentData?: NavigatorUAData
  }

  interface NavigatorUAData {
    getHighEntropyValues(hints: string[]): Promise<UADataValues>
  }

  interface UADataValues {
    readonly formFactor?: string
  }
}

const uaHighEntropyData = computedAsync(async () => {
  try {
    if (navigator.userAgentData?.getHighEntropyValues) {
      return await navigator.userAgentData.getHighEntropyValues(['formFactor'])
    }
    return null
  } catch {
    return null
  }
}, null)

const formFactor = computed(() => uaHighEntropyData.value?.formFactor)
</script>

<i18n lang="json">
{
  "en": {
    "form-factor": "Form Factor"
  },
  "zh": {
    "form-factor": "设备形态"
  },
  "zh-CN": {
    "form-factor": "设备形态"
  },
  "zh-TW": {
    "form-factor": "裝置形態"
  },
  "zh-HK": {
    "form-factor": "裝置形態"
  },
  "es": {
    "form-factor": "Factor de forma"
  },
  "fr": {
    "form-factor": "Facteur de forme"
  },
  "de": {
    "form-factor": "Formfaktor"
  },
  "it": {
    "form-factor": "Fattore di forma"
  },
  "ja": {
    "form-factor": "フォームファクター"
  },
  "ko": {
    "form-factor": "폼 팩터"
  },
  "ru": {
    "form-factor": "Форм-фактор"
  },
  "pt": {
    "form-factor": "Fator de forma"
  },
  "ar": {
    "form-factor": "عامل الشكل"
  },
  "hi": {
    "form-factor": "फॉर्म फैक्टर"
  },
  "tr": {
    "form-factor": "Form Faktoru"
  },
  "nl": {
    "form-factor": "Vormfactor"
  },
  "sv": {
    "form-factor": "Formfaktor"
  },
  "pl": {
    "form-factor": "Format"
  },
  "vi": {
    "form-factor": "Kieu dang"
  },
  "th": {
    "form-factor": "ฟอร์มแฟกเตอร์"
  },
  "id": {
    "form-factor": "Faktor Bentuk"
  },
  "he": {
    "form-factor": "גורם צורה"
  },
  "ms": {
    "form-factor": "Faktor Bentuk"
  },
  "no": {
    "form-factor": "Formfaktor"
  }
}
</i18n>
