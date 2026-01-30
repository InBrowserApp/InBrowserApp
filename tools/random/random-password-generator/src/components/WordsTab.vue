<template>
  <div>
    <n-grid cols="1 s:2" responsive="screen" :x-gap="20" :y-gap="20">
      <n-form-item-gi :label="t('word-count')" :show-feedback="false">
        <n-slider v-model:value="wordCount" :min="2" :max="12" :step="1" />
      </n-form-item-gi>
      <n-form-item-gi :label="t('separator')" :show-feedback="false">
        <n-input v-model:value="separator" maxlength="3" style="width: 100%" placeholder="-" />
      </n-form-item-gi>
      <n-form-item-gi :label="t('capitalize')" :show-feedback="false">
        <n-switch v-model:value="capitalize" />
      </n-form-item-gi>
      <n-form-item-gi :label="t('include-number')" :show-feedback="false">
        <n-switch v-model:value="includeNumber" />
      </n-form-item-gi>
    </n-grid>
  </div>
</template>

<script setup lang="ts">
import { watchEffect } from 'vue'
import { useI18n } from 'vue-i18n'
import { NGrid, NFormItemGi, NSlider, NInput, NSwitch } from 'naive-ui'
import { useStorage } from '@vueuse/core'
import englishWordlist from 'bip39/src/wordlists/english.json'

const props = defineProps<{ nonce: number }>()

const { t } = useI18n()

const modelValue = defineModel<string>('value', { default: '' })

const wordCount = useStorage<number>('tools:random-password-generator:words:count', 4)
const separator = useStorage<string>('tools:random-password-generator:words:sep', '-')
const capitalize = useStorage<boolean>('tools:random-password-generator:words:caps', false)
const includeNumber = useStorage<boolean>('tools:random-password-generator:words:num', false)

const WORDS: readonly string[] = englishWordlist as readonly string[]

function getRandomInt(max: number): number {
  const buf = new Uint32Array(1)
  crypto.getRandomValues(buf)
  return buf[0]! % max
}

function generate(): string {
  const numWords = Math.max(1, wordCount.value)
  const parts: string[] = []
  for (let i = 0; i < numWords; i++) {
    let w = WORDS[getRandomInt(WORDS.length)]!
    if (capitalize.value) w = w.charAt(0).toUpperCase() + w.slice(1)
    parts.push(w)
  }
  if (includeNumber.value) {
    parts.push(String(getRandomInt(100)))
  }
  return parts.join(separator.value || '-')
}

watchEffect(() => {
  void props.nonce
  modelValue.value = generate()
})
</script>

<i18n lang="json">
{
  "en": {
    "word-count": "Word count",
    "separator": "Separator",
    "capitalize": "Capitalize",
    "include-number": "Append a number"
  },
  "zh": {
    "word-count": "单词数量",
    "separator": "分隔符",
    "capitalize": "首字母大写",
    "include-number": "追加一个数字"
  },
  "zh-CN": {
    "word-count": "单词数量",
    "separator": "分隔符",
    "capitalize": "首字母大写",
    "include-number": "追加一个数字"
  },
  "zh-TW": {
    "word-count": "單詞數量",
    "separator": "分隔符",
    "capitalize": "首字母大寫",
    "include-number": "追加一個數字"
  },
  "zh-HK": {
    "word-count": "單詞數量",
    "separator": "分隔符",
    "capitalize": "首字母大寫",
    "include-number": "追加一個數字"
  },
  "es": {
    "word-count": "Word count",
    "separator": "Separator",
    "capitalize": "Capitalize",
    "include-number": "Append a number"
  },
  "fr": {
    "word-count": "Word count",
    "separator": "Separator",
    "capitalize": "Capitalize",
    "include-number": "Append a number"
  },
  "de": {
    "word-count": "Word count",
    "separator": "Separator",
    "capitalize": "Capitalize",
    "include-number": "Append a number"
  },
  "it": {
    "word-count": "Word count",
    "separator": "Separator",
    "capitalize": "Capitalize",
    "include-number": "Append a number"
  },
  "ja": {
    "word-count": "Word count",
    "separator": "Separator",
    "capitalize": "Capitalize",
    "include-number": "Append a number"
  },
  "ko": {
    "word-count": "Word count",
    "separator": "Separator",
    "capitalize": "Capitalize",
    "include-number": "Append a number"
  },
  "ru": {
    "word-count": "Word count",
    "separator": "Separator",
    "capitalize": "Capitalize",
    "include-number": "Append a number"
  },
  "pt": {
    "word-count": "Word count",
    "separator": "Separator",
    "capitalize": "Capitalize",
    "include-number": "Append a number"
  },
  "ar": {
    "word-count": "Word count",
    "separator": "Separator",
    "capitalize": "Capitalize",
    "include-number": "Append a number"
  },
  "hi": {
    "word-count": "Word count",
    "separator": "Separator",
    "capitalize": "Capitalize",
    "include-number": "Append a number"
  },
  "tr": {
    "word-count": "Word count",
    "separator": "Separator",
    "capitalize": "Capitalize",
    "include-number": "Append a number"
  },
  "nl": {
    "word-count": "Word count",
    "separator": "Separator",
    "capitalize": "Capitalize",
    "include-number": "Append a number"
  },
  "sv": {
    "word-count": "Word count",
    "separator": "Separator",
    "capitalize": "Capitalize",
    "include-number": "Append a number"
  },
  "pl": {
    "word-count": "Word count",
    "separator": "Separator",
    "capitalize": "Capitalize",
    "include-number": "Append a number"
  },
  "vi": {
    "word-count": "Word count",
    "separator": "Separator",
    "capitalize": "Capitalize",
    "include-number": "Append a number"
  },
  "th": {
    "word-count": "Word count",
    "separator": "Separator",
    "capitalize": "Capitalize",
    "include-number": "Append a number"
  },
  "id": {
    "word-count": "Word count",
    "separator": "Separator",
    "capitalize": "Capitalize",
    "include-number": "Append a number"
  },
  "he": {
    "word-count": "Word count",
    "separator": "Separator",
    "capitalize": "Capitalize",
    "include-number": "Append a number"
  },
  "ms": {
    "word-count": "Word count",
    "separator": "Separator",
    "capitalize": "Capitalize",
    "include-number": "Append a number"
  },
  "no": {
    "word-count": "Word count",
    "separator": "Separator",
    "capitalize": "Capitalize",
    "include-number": "Append a number"
  }
}
</i18n>
