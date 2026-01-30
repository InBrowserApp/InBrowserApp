<template>
  <div>
    <n-grid cols="1 s:2" responsive="screen" :x-gap="20" :y-gap="20">
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
      <n-form-item-gi :label="t('block-length')" :show-feedback="false">
        <n-slider v-model:value="blockLength" :min="1" :max="16" :step="1" />
      </n-form-item-gi>
      <n-form-item-gi :label="t('block-count')" :show-feedback="false">
        <n-slider v-model:value="blockCount" :min="2" :max="10" :step="1" />
      </n-form-item-gi>
      <n-form-item-gi :label="t('block-separator')" :show-feedback="false">
        <n-input v-model:value="blockSeparator" maxlength="3" style="width: 100%" placeholder="-" />
      </n-form-item-gi>
    </n-grid>
  </div>
</template>

<script setup lang="ts">
import { computed, watchEffect } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  NGrid,
  NFormItemGi,
  NSlider,
  NCheckboxGroup,
  NCheckbox,
  NSwitch,
  NFlex,
  NInput,
} from 'naive-ui'
import { useStorage } from '@vueuse/core'

const props = defineProps<{ nonce: number }>()

const { t } = useI18n()

const modelValue = defineModel<string>('value', { default: '' })

const charsets = useStorage<Array<'upper' | 'lower' | 'digits' | 'symbols'>>(
  'tools:random-password-generator:separator:charsets',
  ['upper', 'lower', 'digits'],
)
const excludeSimilar = useStorage<boolean>(
  'tools:random-password-generator:separator:excludeSimilar',
  true,
)
const blockLength = useStorage<number>('tools:random-password-generator:separator:blockLength', 3)
const blockCount = useStorage<number>('tools:random-password-generator:separator:blockCount', 3)
const blockSeparator = useStorage<string>(
  'tools:random-password-generator:separator:blockSeparator',
  '-',
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
  const len = Math.max(1, blockLength.value)
  const cnt = Math.max(1, blockCount.value)
  const sep = blockSeparator.value || '-'
  const blocks: string[] = []
  for (let b = 0; b < cnt; b++) {
    let block = ''
    for (let i = 0; i < len; i++) {
      block += chars[getRandomInt(chars.length)]
    }
    blocks.push(block)
  }
  return blocks.join(sep)
}

watchEffect(() => {
  void props.nonce
  modelValue.value = generate()
})
</script>

<i18n lang="json">
{
  "en": {
    "charset": "Character set",
    "upper": "Uppercase",
    "lower": "Lowercase",
    "digits": "Digits",
    "symbols": "Symbols",
    "exclude-similar": "Exclude similar characters (Il1O0)",
    "block-length": "Block length",
    "block-count": "Block count",
    "block-separator": "Separator"
  },
  "zh": {
    "charset": "字符集",
    "upper": "大写字母",
    "lower": "小写字母",
    "digits": "数字",
    "symbols": "符号",
    "exclude-similar": "排除相似字符 (Il1O0)",
    "block-length": "分段长度",
    "block-count": "分段数量",
    "block-separator": "分隔符"
  },
  "zh-CN": {
    "charset": "字符集",
    "upper": "大写字母",
    "lower": "小写字母",
    "digits": "数字",
    "symbols": "符号",
    "exclude-similar": "排除相似字符 (Il1O0)",
    "block-length": "分段长度",
    "block-count": "分段数量",
    "block-separator": "分隔符"
  },
  "zh-TW": {
    "charset": "字元集",
    "upper": "大寫字母",
    "lower": "小寫字母",
    "digits": "數字",
    "symbols": "符號",
    "exclude-similar": "排除相似字元 (Il1O0)",
    "block-length": "分段長度",
    "block-count": "分段數量",
    "block-separator": "分隔符"
  },
  "zh-HK": {
    "charset": "字元集",
    "upper": "大寫字母",
    "lower": "小寫字母",
    "digits": "數字",
    "symbols": "符號",
    "exclude-similar": "排除相似字元 (Il1O0)",
    "block-length": "分段長度",
    "block-count": "分段數量",
    "block-separator": "分隔符"
  },
  "es": {
    "charset": "Character set",
    "upper": "Uppercase",
    "lower": "Lowercase",
    "digits": "Digits",
    "symbols": "Symbols",
    "exclude-similar": "Exclude similar characters (Il1O0)",
    "block-length": "Block length",
    "block-count": "Block count",
    "block-separator": "Separator"
  },
  "fr": {
    "charset": "Character set",
    "upper": "Uppercase",
    "lower": "Lowercase",
    "digits": "Digits",
    "symbols": "Symbols",
    "exclude-similar": "Exclude similar characters (Il1O0)",
    "block-length": "Block length",
    "block-count": "Block count",
    "block-separator": "Separator"
  },
  "de": {
    "charset": "Character set",
    "upper": "Uppercase",
    "lower": "Lowercase",
    "digits": "Digits",
    "symbols": "Symbols",
    "exclude-similar": "Exclude similar characters (Il1O0)",
    "block-length": "Block length",
    "block-count": "Block count",
    "block-separator": "Separator"
  },
  "it": {
    "charset": "Character set",
    "upper": "Uppercase",
    "lower": "Lowercase",
    "digits": "Digits",
    "symbols": "Symbols",
    "exclude-similar": "Exclude similar characters (Il1O0)",
    "block-length": "Block length",
    "block-count": "Block count",
    "block-separator": "Separator"
  },
  "ja": {
    "charset": "Character set",
    "upper": "Uppercase",
    "lower": "Lowercase",
    "digits": "Digits",
    "symbols": "Symbols",
    "exclude-similar": "Exclude similar characters (Il1O0)",
    "block-length": "Block length",
    "block-count": "Block count",
    "block-separator": "Separator"
  },
  "ko": {
    "charset": "Character set",
    "upper": "Uppercase",
    "lower": "Lowercase",
    "digits": "Digits",
    "symbols": "Symbols",
    "exclude-similar": "Exclude similar characters (Il1O0)",
    "block-length": "Block length",
    "block-count": "Block count",
    "block-separator": "Separator"
  },
  "ru": {
    "charset": "Character set",
    "upper": "Uppercase",
    "lower": "Lowercase",
    "digits": "Digits",
    "symbols": "Symbols",
    "exclude-similar": "Exclude similar characters (Il1O0)",
    "block-length": "Block length",
    "block-count": "Block count",
    "block-separator": "Separator"
  },
  "pt": {
    "charset": "Character set",
    "upper": "Uppercase",
    "lower": "Lowercase",
    "digits": "Digits",
    "symbols": "Symbols",
    "exclude-similar": "Exclude similar characters (Il1O0)",
    "block-length": "Block length",
    "block-count": "Block count",
    "block-separator": "Separator"
  },
  "ar": {
    "charset": "Character set",
    "upper": "Uppercase",
    "lower": "Lowercase",
    "digits": "Digits",
    "symbols": "Symbols",
    "exclude-similar": "Exclude similar characters (Il1O0)",
    "block-length": "Block length",
    "block-count": "Block count",
    "block-separator": "Separator"
  },
  "hi": {
    "charset": "Character set",
    "upper": "Uppercase",
    "lower": "Lowercase",
    "digits": "Digits",
    "symbols": "Symbols",
    "exclude-similar": "Exclude similar characters (Il1O0)",
    "block-length": "Block length",
    "block-count": "Block count",
    "block-separator": "Separator"
  },
  "tr": {
    "charset": "Character set",
    "upper": "Uppercase",
    "lower": "Lowercase",
    "digits": "Digits",
    "symbols": "Symbols",
    "exclude-similar": "Exclude similar characters (Il1O0)",
    "block-length": "Block length",
    "block-count": "Block count",
    "block-separator": "Separator"
  },
  "nl": {
    "charset": "Character set",
    "upper": "Uppercase",
    "lower": "Lowercase",
    "digits": "Digits",
    "symbols": "Symbols",
    "exclude-similar": "Exclude similar characters (Il1O0)",
    "block-length": "Block length",
    "block-count": "Block count",
    "block-separator": "Separator"
  },
  "sv": {
    "charset": "Character set",
    "upper": "Uppercase",
    "lower": "Lowercase",
    "digits": "Digits",
    "symbols": "Symbols",
    "exclude-similar": "Exclude similar characters (Il1O0)",
    "block-length": "Block length",
    "block-count": "Block count",
    "block-separator": "Separator"
  },
  "pl": {
    "charset": "Character set",
    "upper": "Uppercase",
    "lower": "Lowercase",
    "digits": "Digits",
    "symbols": "Symbols",
    "exclude-similar": "Exclude similar characters (Il1O0)",
    "block-length": "Block length",
    "block-count": "Block count",
    "block-separator": "Separator"
  },
  "vi": {
    "charset": "Character set",
    "upper": "Uppercase",
    "lower": "Lowercase",
    "digits": "Digits",
    "symbols": "Symbols",
    "exclude-similar": "Exclude similar characters (Il1O0)",
    "block-length": "Block length",
    "block-count": "Block count",
    "block-separator": "Separator"
  },
  "th": {
    "charset": "Character set",
    "upper": "Uppercase",
    "lower": "Lowercase",
    "digits": "Digits",
    "symbols": "Symbols",
    "exclude-similar": "Exclude similar characters (Il1O0)",
    "block-length": "Block length",
    "block-count": "Block count",
    "block-separator": "Separator"
  },
  "id": {
    "charset": "Character set",
    "upper": "Uppercase",
    "lower": "Lowercase",
    "digits": "Digits",
    "symbols": "Symbols",
    "exclude-similar": "Exclude similar characters (Il1O0)",
    "block-length": "Block length",
    "block-count": "Block count",
    "block-separator": "Separator"
  },
  "he": {
    "charset": "Character set",
    "upper": "Uppercase",
    "lower": "Lowercase",
    "digits": "Digits",
    "symbols": "Symbols",
    "exclude-similar": "Exclude similar characters (Il1O0)",
    "block-length": "Block length",
    "block-count": "Block count",
    "block-separator": "Separator"
  },
  "ms": {
    "charset": "Character set",
    "upper": "Uppercase",
    "lower": "Lowercase",
    "digits": "Digits",
    "symbols": "Symbols",
    "exclude-similar": "Exclude similar characters (Il1O0)",
    "block-length": "Block length",
    "block-count": "Block count",
    "block-separator": "Separator"
  },
  "no": {
    "charset": "Character set",
    "upper": "Uppercase",
    "lower": "Lowercase",
    "digits": "Digits",
    "symbols": "Symbols",
    "exclude-similar": "Exclude similar characters (Il1O0)",
    "block-length": "Block length",
    "block-count": "Block count",
    "block-separator": "Separator"
  }
}
</i18n>
