<template>
  <div>
    <n-grid cols="1 s:2" responsive="screen" :x-gap="20" :y-gap="20">
      <n-form-item-gi :label="t('length')" :show-feedback="false">
        <n-slider v-model:value="length" :min="4" :max="128" :step="1" />
      </n-form-item-gi>
      <n-form-item-gi :label="t('charset')" :show-feedback="false">
        <n-checkbox-group v-model:value="charsets">
          <n-flex>
            <n-checkbox value="upper">{{ t('upper') }}</n-checkbox>
            <n-checkbox value="lower">{{ t('lower') }}</n-checkbox>
            <n-checkbox value="digits">{{ t('digits') }}</n-checkbox>
            <n-checkbox value="symbols">{{ t('symbols') }}</n-checkbox>
          </n-flex>
        </n-checkbox-group>
      </n-form-item-gi>
      <n-form-item-gi :label="t('exclude-similar')" :show-feedback="false">
        <n-switch v-model:value="excludeSimilar" />
      </n-form-item-gi>
    </n-grid>
  </div>
</template>

<script setup lang="ts">
import { computed, watchEffect } from 'vue'
import { useI18n } from 'vue-i18n'
import { NGrid, NFormItemGi, NSlider, NCheckboxGroup, NCheckbox, NSwitch, NFlex } from 'naive-ui'
import { useStorage } from '@vueuse/core'

const props = defineProps<{ nonce: number }>()

const { t } = useI18n()

const modelValue = defineModel<string>('value', { default: '' })

const length = useStorage<number>('tools:random-password-generator:random:length', 16)
const charsets = useStorage<Array<'upper' | 'lower' | 'digits' | 'symbols'>>(
  'tools:random-password-generator:random:charsets',
  ['upper', 'lower', 'digits'],
)
const excludeSimilar = useStorage<boolean>(
  'tools:random-password-generator:random:excludeSimilar',
  true,
)

const pool = computed(() => {
  const sets: string[] = []
  if (charsets.value.includes('upper')) sets.push('ABCDEFGHIJKLMNOPQRSTUVWXYZ')
  if (charsets.value.includes('lower')) sets.push('abcdefghijklmnopqrstuvwxyz')
  if (charsets.value.includes('digits')) sets.push('0123456789')
  if (charsets.value.includes('symbols')) sets.push('!@#$%^&*()_+-={}[]|:;<>,.?/~')
  let chars = sets.join('')
  if (excludeSimilar.value) chars = chars.replace(/[Il1O0]/g, '')
  return chars || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
})

function getRandomInt(max: number): number {
  const buffer = new Uint32Array(1)
  crypto.getRandomValues(buffer)
  return buffer[0]! % max
}

function generate(): string {
  const chars = pool.value
  const n = Math.max(1, length.value)
  let result = ''
  for (let i = 0; i < n; i++) {
    result += chars[getRandomInt(chars.length)]
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
    "charset": "Character set",
    "upper": "Uppercase",
    "lower": "Lowercase",
    "digits": "Digits",
    "symbols": "Symbols",
    "exclude-similar": "Exclude similar characters (Il1O0)"
  },
  "zh": {
    "length": "长度",
    "charset": "字符集",
    "upper": "大写字母",
    "lower": "小写字母",
    "digits": "数字",
    "symbols": "符号",
    "exclude-similar": "排除相似字符 (Il1O0)"
  },
  "zh-CN": {
    "length": "长度",
    "charset": "字符集",
    "upper": "大写字母",
    "lower": "小写字母",
    "digits": "数字",
    "symbols": "符号",
    "exclude-similar": "排除相似字符 (Il1O0)"
  },
  "zh-TW": {
    "length": "長度",
    "charset": "字元集",
    "upper": "大寫字母",
    "lower": "小寫字母",
    "digits": "數字",
    "symbols": "符號",
    "exclude-similar": "排除相似字元 (Il1O0)"
  },
  "zh-HK": {
    "length": "長度",
    "charset": "字元集",
    "upper": "大寫字母",
    "lower": "小寫字母",
    "digits": "數字",
    "symbols": "符號",
    "exclude-similar": "排除相似字元 (Il1O0)"
  },
  "es": {
    "length": "Length",
    "charset": "Character set",
    "upper": "Uppercase",
    "lower": "Lowercase",
    "digits": "Digits",
    "symbols": "Symbols",
    "exclude-similar": "Exclude similar characters (Il1O0)"
  },
  "fr": {
    "length": "Length",
    "charset": "Character set",
    "upper": "Uppercase",
    "lower": "Lowercase",
    "digits": "Digits",
    "symbols": "Symbols",
    "exclude-similar": "Exclude similar characters (Il1O0)"
  },
  "de": {
    "length": "Length",
    "charset": "Character set",
    "upper": "Uppercase",
    "lower": "Lowercase",
    "digits": "Digits",
    "symbols": "Symbols",
    "exclude-similar": "Exclude similar characters (Il1O0)"
  },
  "it": {
    "length": "Length",
    "charset": "Character set",
    "upper": "Uppercase",
    "lower": "Lowercase",
    "digits": "Digits",
    "symbols": "Symbols",
    "exclude-similar": "Exclude similar characters (Il1O0)"
  },
  "ja": {
    "length": "Length",
    "charset": "Character set",
    "upper": "Uppercase",
    "lower": "Lowercase",
    "digits": "Digits",
    "symbols": "Symbols",
    "exclude-similar": "Exclude similar characters (Il1O0)"
  },
  "ko": {
    "length": "Length",
    "charset": "Character set",
    "upper": "Uppercase",
    "lower": "Lowercase",
    "digits": "Digits",
    "symbols": "Symbols",
    "exclude-similar": "Exclude similar characters (Il1O0)"
  },
  "ru": {
    "length": "Length",
    "charset": "Character set",
    "upper": "Uppercase",
    "lower": "Lowercase",
    "digits": "Digits",
    "symbols": "Symbols",
    "exclude-similar": "Exclude similar characters (Il1O0)"
  },
  "pt": {
    "length": "Length",
    "charset": "Character set",
    "upper": "Uppercase",
    "lower": "Lowercase",
    "digits": "Digits",
    "symbols": "Symbols",
    "exclude-similar": "Exclude similar characters (Il1O0)"
  },
  "ar": {
    "length": "Length",
    "charset": "Character set",
    "upper": "Uppercase",
    "lower": "Lowercase",
    "digits": "Digits",
    "symbols": "Symbols",
    "exclude-similar": "Exclude similar characters (Il1O0)"
  },
  "hi": {
    "length": "Length",
    "charset": "Character set",
    "upper": "Uppercase",
    "lower": "Lowercase",
    "digits": "Digits",
    "symbols": "Symbols",
    "exclude-similar": "Exclude similar characters (Il1O0)"
  },
  "tr": {
    "length": "Length",
    "charset": "Character set",
    "upper": "Uppercase",
    "lower": "Lowercase",
    "digits": "Digits",
    "symbols": "Symbols",
    "exclude-similar": "Exclude similar characters (Il1O0)"
  },
  "nl": {
    "length": "Length",
    "charset": "Character set",
    "upper": "Uppercase",
    "lower": "Lowercase",
    "digits": "Digits",
    "symbols": "Symbols",
    "exclude-similar": "Exclude similar characters (Il1O0)"
  },
  "sv": {
    "length": "Length",
    "charset": "Character set",
    "upper": "Uppercase",
    "lower": "Lowercase",
    "digits": "Digits",
    "symbols": "Symbols",
    "exclude-similar": "Exclude similar characters (Il1O0)"
  },
  "pl": {
    "length": "Length",
    "charset": "Character set",
    "upper": "Uppercase",
    "lower": "Lowercase",
    "digits": "Digits",
    "symbols": "Symbols",
    "exclude-similar": "Exclude similar characters (Il1O0)"
  },
  "vi": {
    "length": "Length",
    "charset": "Character set",
    "upper": "Uppercase",
    "lower": "Lowercase",
    "digits": "Digits",
    "symbols": "Symbols",
    "exclude-similar": "Exclude similar characters (Il1O0)"
  },
  "th": {
    "length": "Length",
    "charset": "Character set",
    "upper": "Uppercase",
    "lower": "Lowercase",
    "digits": "Digits",
    "symbols": "Symbols",
    "exclude-similar": "Exclude similar characters (Il1O0)"
  },
  "id": {
    "length": "Length",
    "charset": "Character set",
    "upper": "Uppercase",
    "lower": "Lowercase",
    "digits": "Digits",
    "symbols": "Symbols",
    "exclude-similar": "Exclude similar characters (Il1O0)"
  },
  "he": {
    "length": "Length",
    "charset": "Character set",
    "upper": "Uppercase",
    "lower": "Lowercase",
    "digits": "Digits",
    "symbols": "Symbols",
    "exclude-similar": "Exclude similar characters (Il1O0)"
  },
  "ms": {
    "length": "Length",
    "charset": "Character set",
    "upper": "Uppercase",
    "lower": "Lowercase",
    "digits": "Digits",
    "symbols": "Symbols",
    "exclude-similar": "Exclude similar characters (Il1O0)"
  },
  "no": {
    "length": "Length",
    "charset": "Character set",
    "upper": "Uppercase",
    "lower": "Lowercase",
    "digits": "Digits",
    "symbols": "Symbols",
    "exclude-similar": "Exclude similar characters (Il1O0)"
  }
}
</i18n>
