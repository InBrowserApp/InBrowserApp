<template>
  <div>
    <n-grid cols="1 s:2" responsive="screen" :x-gap="20" :y-gap="20">
      <n-form-item-gi :label="t('length')" :show-feedback="false">
        <n-slider v-model:value="length" :min="1" :max="12" :step="1" />
      </n-form-item-gi>
      <n-form-item-gi :label="t('allow-leading-zero')" :show-feedback="false">
        <n-switch v-model:value="allowLeadingZero" />
      </n-form-item-gi>
    </n-grid>
  </div>
</template>

<script setup lang="ts">
import { watchEffect } from 'vue'
import { useI18n } from 'vue-i18n'
import { NGrid, NFormItemGi, NSlider, NSwitch } from 'naive-ui'
import { useStorage } from '@vueuse/core'

const props = defineProps<{ nonce: number }>()

const { t } = useI18n()

const modelValue = defineModel<string>('value', { default: '' })

const length = useStorage<number>('tools:random-password-generator:pin:length', 6)
const allowLeadingZero = useStorage<boolean>(
  'tools:random-password-generator:pin:leadingZero',
  true,
)

function getRandomInt(max: number): number {
  const buf = new Uint32Array(1)
  crypto.getRandomValues(buf)
  return buf[0]! % max
}

function generate(): string {
  const n = Math.max(1, length.value)
  let result = ''
  for (let i = 0; i < n; i++) {
    const digit = getRandomInt(10)
    if (!allowLeadingZero.value && i === 0 && digit === 0) {
      result += String(getRandomInt(9) + 1)
    } else {
      result += String(digit)
    }
  }
  return result
}

watchEffect(() => {
  void props.nonce
  modelValue.value = generate()
})
</script>

<i18n lang="json">
{
  "en": {
    "length": "Length",
    "allow-leading-zero": "Allow leading zero"
  },
  "zh": {
    "length": "长度",
    "allow-leading-zero": "允许以 0 开头"
  },
  "zh-CN": {
    "length": "长度",
    "allow-leading-zero": "允许以 0 开头"
  },
  "zh-TW": {
    "length": "長度",
    "allow-leading-zero": "允許以 0 開頭"
  },
  "zh-HK": {
    "length": "長度",
    "allow-leading-zero": "允許以 0 開頭"
  },
  "es": {
    "length": "Length",
    "allow-leading-zero": "Allow leading zero"
  },
  "fr": {
    "length": "Length",
    "allow-leading-zero": "Allow leading zero"
  },
  "de": {
    "length": "Length",
    "allow-leading-zero": "Allow leading zero"
  },
  "it": {
    "length": "Length",
    "allow-leading-zero": "Allow leading zero"
  },
  "ja": {
    "length": "Length",
    "allow-leading-zero": "Allow leading zero"
  },
  "ko": {
    "length": "Length",
    "allow-leading-zero": "Allow leading zero"
  },
  "ru": {
    "length": "Length",
    "allow-leading-zero": "Allow leading zero"
  },
  "pt": {
    "length": "Length",
    "allow-leading-zero": "Allow leading zero"
  },
  "ar": {
    "length": "Length",
    "allow-leading-zero": "Allow leading zero"
  },
  "hi": {
    "length": "Length",
    "allow-leading-zero": "Allow leading zero"
  },
  "tr": {
    "length": "Length",
    "allow-leading-zero": "Allow leading zero"
  },
  "nl": {
    "length": "Length",
    "allow-leading-zero": "Allow leading zero"
  },
  "sv": {
    "length": "Length",
    "allow-leading-zero": "Allow leading zero"
  },
  "pl": {
    "length": "Length",
    "allow-leading-zero": "Allow leading zero"
  },
  "vi": {
    "length": "Length",
    "allow-leading-zero": "Allow leading zero"
  },
  "th": {
    "length": "Length",
    "allow-leading-zero": "Allow leading zero"
  },
  "id": {
    "length": "Length",
    "allow-leading-zero": "Allow leading zero"
  },
  "he": {
    "length": "Length",
    "allow-leading-zero": "Allow leading zero"
  },
  "ms": {
    "length": "Length",
    "allow-leading-zero": "Allow leading zero"
  },
  "no": {
    "length": "Length",
    "allow-leading-zero": "Allow leading zero"
  }
}
</i18n>
