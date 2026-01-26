<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <ToolSectionHeader>{{ t('styleTitle') }}</ToolSectionHeader>
    <ToolSection>
      <NRadioGroup v-model:value="variant" size="large">
        <NRadioButton value="simplified">{{ t('simplified') }}</NRadioButton>
        <NRadioButton value="traditional">{{ t('traditional') }}</NRadioButton>
      </NRadioGroup>
    </ToolSection>

    <NumberInput :value="numberInput" @update:value="handleNumberUpdate" />
    <ChineseUppercaseInput :value="uppercaseInput" @update:value="handleUppercaseUpdate" />
    <WhatIsChineseUppercaseNumber />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStorage } from '@vueuse/core'
import { NRadioGroup, NRadioButton } from 'naive-ui'
import { ToolDefaultPageLayout, ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import * as toolInfo from './info'
import NumberInput from './components/NumberInput.vue'
import ChineseUppercaseInput from './components/ChineseUppercaseInput.vue'
import WhatIsChineseUppercaseNumber from './components/WhatIsChineseUppercaseNumber.vue'
import {
  convertNumberToUppercase,
  convertUppercaseToNumber,
  type UppercaseVariant,
} from './data/conversion'

const variant = useStorage<UppercaseVariant>(
  'tools:chinese-uppercase-number-converter:variant',
  'simplified',
)
const numberInput = useStorage('tools:chinese-uppercase-number-converter:number', '1234.56')
const uppercaseInput = ref('')
const { t } = useI18n()

const uppercaseResult = convertNumberToUppercase(numberInput.value, variant.value)
uppercaseInput.value = uppercaseResult.isValid ? uppercaseResult.value : ''

function handleNumberUpdate(value: string) {
  numberInput.value = value
  const result = convertNumberToUppercase(value, variant.value)
  uppercaseInput.value = result.isValid ? result.value : ''
}

function handleUppercaseUpdate(value: string) {
  uppercaseInput.value = value
  const result = convertUppercaseToNumber(value)
  if (result.isValid) {
    numberInput.value = result.value
  }
}

watch(variant, (nextVariant) => {
  const result = convertNumberToUppercase(numberInput.value, nextVariant)
  uppercaseInput.value = result.isValid ? result.value : ''
})
</script>

<i18n lang="json">
{
  "en": {
    "styleTitle": "Uppercase Style",
    "simplified": "Simplified",
    "traditional": "Traditional"
  },
  "zh": {
    "styleTitle": "大写样式",
    "simplified": "简体",
    "traditional": "繁体"
  },
  "zh-CN": {
    "styleTitle": "大写样式",
    "simplified": "简体",
    "traditional": "繁体"
  },
  "zh-TW": {
    "styleTitle": "大寫樣式",
    "simplified": "簡體",
    "traditional": "繁體"
  },
  "zh-HK": {
    "styleTitle": "大寫樣式",
    "simplified": "簡體",
    "traditional": "繁體"
  },
  "es": {
    "styleTitle": "Uppercase Style",
    "simplified": "Simplified",
    "traditional": "Traditional"
  },
  "fr": {
    "styleTitle": "Uppercase Style",
    "simplified": "Simplified",
    "traditional": "Traditional"
  },
  "de": {
    "styleTitle": "Uppercase Style",
    "simplified": "Simplified",
    "traditional": "Traditional"
  },
  "it": {
    "styleTitle": "Uppercase Style",
    "simplified": "Simplified",
    "traditional": "Traditional"
  },
  "ja": {
    "styleTitle": "Uppercase Style",
    "simplified": "Simplified",
    "traditional": "Traditional"
  },
  "ko": {
    "styleTitle": "Uppercase Style",
    "simplified": "Simplified",
    "traditional": "Traditional"
  },
  "ru": {
    "styleTitle": "Uppercase Style",
    "simplified": "Simplified",
    "traditional": "Traditional"
  },
  "pt": {
    "styleTitle": "Uppercase Style",
    "simplified": "Simplified",
    "traditional": "Traditional"
  },
  "ar": {
    "styleTitle": "Uppercase Style",
    "simplified": "Simplified",
    "traditional": "Traditional"
  },
  "hi": {
    "styleTitle": "Uppercase Style",
    "simplified": "Simplified",
    "traditional": "Traditional"
  },
  "tr": {
    "styleTitle": "Uppercase Style",
    "simplified": "Simplified",
    "traditional": "Traditional"
  },
  "nl": {
    "styleTitle": "Uppercase Style",
    "simplified": "Simplified",
    "traditional": "Traditional"
  },
  "sv": {
    "styleTitle": "Uppercase Style",
    "simplified": "Simplified",
    "traditional": "Traditional"
  },
  "pl": {
    "styleTitle": "Uppercase Style",
    "simplified": "Simplified",
    "traditional": "Traditional"
  },
  "vi": {
    "styleTitle": "Uppercase Style",
    "simplified": "Simplified",
    "traditional": "Traditional"
  },
  "th": {
    "styleTitle": "Uppercase Style",
    "simplified": "Simplified",
    "traditional": "Traditional"
  },
  "id": {
    "styleTitle": "Uppercase Style",
    "simplified": "Simplified",
    "traditional": "Traditional"
  },
  "he": {
    "styleTitle": "Uppercase Style",
    "simplified": "Simplified",
    "traditional": "Traditional"
  },
  "ms": {
    "styleTitle": "Uppercase Style",
    "simplified": "Simplified",
    "traditional": "Traditional"
  },
  "no": {
    "styleTitle": "Uppercase Style",
    "simplified": "Simplified",
    "traditional": "Traditional"
  }
}
</i18n>
