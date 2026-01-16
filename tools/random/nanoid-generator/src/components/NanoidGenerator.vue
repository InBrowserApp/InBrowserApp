<template>
  <ToolSectionHeader>{{ t('options') }}</ToolSectionHeader>
  <ToolSection>
    <n-flex vertical :size="16">
      <n-grid cols="1 m:2" responsive="screen" :x-gap="16" :y-gap="12">
        <n-form-item-gi :label="t('count')" :show-feedback="false">
          <n-input-number v-model:value="count" :min="1" :max="maxCount" style="width: 100%" />
        </n-form-item-gi>
        <n-form-item-gi :label="t('length')" :show-feedback="false">
          <n-input-number v-model:value="length" :min="1" :max="maxLength" style="width: 100%" />
        </n-form-item-gi>
      </n-grid>

      <n-grid cols="1 m:2" responsive="screen" :x-gap="16" :y-gap="12">
        <n-form-item-gi :label="t('alphabetPreset')" :show-feedback="false">
          <n-select v-model:value="alphabetPreset" :options="presetOptions" style="width: 100%" />
        </n-form-item-gi>
        <n-form-item-gi
          v-if="alphabetPreset === 'custom'"
          :label="t('customAlphabet')"
          :show-feedback="false"
        >
          <n-input v-model:value="customAlphabet" :placeholder="t('customAlphabetPlaceholder')" />
        </n-form-item-gi>
      </n-grid>

      <n-alert v-if="alphabetError" type="error">
        {{ alphabetError }}
      </n-alert>
    </n-flex>
  </ToolSection>

  <ToolSectionHeader>{{ t('results') }}</ToolSectionHeader>
  <ToolSection>
    <n-flex vertical :size="12">
      <n-input
        :value="output"
        class="monospace-output"
        type="textarea"
        readonly
        :autosize="{ minRows: 4, maxRows: 12 }"
        :placeholder="t('placeholder')"
      />
      <n-flex>
        <CopyToClipboardButton :content="output" />
        <RegenerateButton @click="regenerate" />
      </n-flex>
    </n-flex>
  </ToolSection>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStorage } from '@vueuse/core'
import { NAlert, NFlex, NFormItemGi, NGrid, NInput, NInputNumber, NSelect } from 'naive-ui'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import { CopyToClipboardButton, RegenerateButton } from '@shared/ui/base'
import {
  DEFAULT_NANOID_LENGTH,
  NANOID_ALPHABETS,
  NANOID_MAX_COUNT,
  NANOID_MAX_LENGTH,
  type NanoidAlphabetPreset,
  generateNanoid,
  getAlphabetMetrics,
} from '../utils/nanoid'

const { t } = useI18n()

const maxCount = NANOID_MAX_COUNT
const maxLength = NANOID_MAX_LENGTH

const count = useStorage<number | null>('tools:nanoid-generator:count', 5)
const length = useStorage<number | null>('tools:nanoid-generator:length', DEFAULT_NANOID_LENGTH)
const alphabetPreset = useStorage<NanoidAlphabetPreset>(
  'tools:nanoid-generator:alphabet-preset',
  'url-safe',
)
const customAlphabet = useStorage<string>(
  'tools:nanoid-generator:custom-alphabet',
  NANOID_ALPHABETS['url-safe'],
)

const presetOptions = computed(() => [
  { label: t('presetUrlSafe'), value: 'url-safe' },
  { label: t('presetAlphanumeric'), value: 'alphanumeric' },
  { label: t('presetLowercase'), value: 'lowercase' },
  { label: t('presetUppercase'), value: 'uppercase' },
  { label: t('presetNumbers'), value: 'numbers' },
  { label: t('presetHexLowercase'), value: 'hex-lowercase' },
  { label: t('presetHexUppercase'), value: 'hex-uppercase' },
  { label: t('presetCustom'), value: 'custom' },
])

const alphabet = computed(() =>
  alphabetPreset.value === 'custom' ? customAlphabet.value : NANOID_ALPHABETS[alphabetPreset.value],
)

const alphabetMetrics = computed(() => getAlphabetMetrics(alphabet.value))

const alphabetError = computed(() => {
  if (alphabetMetrics.value.uniqueCount < 2) {
    return t('alphabetTooShort')
  }
  if (alphabetMetrics.value.duplicates.length > 0) {
    return t('alphabetDuplicate')
  }
  return ''
})

const generatedIds = ref<string[]>([])

function normalizeCount(value: number | null | undefined): number {
  if (typeof value !== 'number' || Number.isNaN(value)) return 1
  return Math.min(Math.max(Math.floor(value), 1), maxCount)
}

function normalizeLength(value: number | null | undefined): number {
  if (typeof value !== 'number' || Number.isNaN(value)) return DEFAULT_NANOID_LENGTH
  return Math.min(Math.max(Math.floor(value), 1), maxLength)
}

function regenerate() {
  const normalizedCount = normalizeCount(count.value)
  if (count.value !== normalizedCount) {
    count.value = normalizedCount
  }

  const normalizedLength = normalizeLength(length.value)
  if (length.value !== normalizedLength) {
    length.value = normalizedLength
  }

  if (alphabetError.value) {
    generatedIds.value = []
    return
  }

  const results: string[] = []
  for (let i = 0; i < normalizedCount; i += 1) {
    results.push(generateNanoid(alphabet.value, normalizedLength))
  }
  generatedIds.value = results
}

const output = computed(() => generatedIds.value.join('\n'))

watch([count, length, alphabetPreset, customAlphabet], regenerate, { immediate: true })
</script>

<style scoped>
.monospace-output :deep(textarea) {
  font-family:
    ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New',
    monospace;
}
</style>

<i18n lang="json">
{
  "en": {
    "options": "Options",
    "count": "Count",
    "length": "Length",
    "alphabetPreset": "Alphabet Preset",
    "customAlphabet": "Custom Alphabet",
    "customAlphabetPlaceholder": "Enter custom alphabet...",
    "presetUrlSafe": "URL-safe (A-Z, a-z, 0-9, -_)",
    "presetAlphanumeric": "Alphanumeric (A-Z, a-z, 0-9)",
    "presetLowercase": "Lowercase (a-z)",
    "presetUppercase": "Uppercase (A-Z)",
    "presetNumbers": "Numbers (0-9)",
    "presetHexLowercase": "Hex (0-9, a-f)",
    "presetHexUppercase": "Hex (0-9, A-F)",
    "presetCustom": "Custom",
    "alphabetTooShort": "Alphabet must contain at least 2 unique characters.",
    "alphabetDuplicate": "Alphabet must not contain duplicate characters.",
    "results": "Results",
    "placeholder": "Generated NanoIDs will appear here..."
  },
  "zh": {
    "options": "选项",
    "count": "数量",
    "length": "长度",
    "alphabetPreset": "字符集预设",
    "customAlphabet": "自定义字符集",
    "customAlphabetPlaceholder": "输入自定义字符集...",
    "presetUrlSafe": "URL 安全（A-Z、a-z、0-9、-_）",
    "presetAlphanumeric": "字母数字（A-Z、a-z、0-9）",
    "presetLowercase": "小写（a-z）",
    "presetUppercase": "大写（A-Z）",
    "presetNumbers": "数字（0-9）",
    "presetHexLowercase": "十六进制（0-9、a-f）",
    "presetHexUppercase": "十六进制（0-9、A-F）",
    "presetCustom": "自定义",
    "alphabetTooShort": "字符集至少需要 2 个唯一字符。",
    "alphabetDuplicate": "字符集中不能包含重复字符。",
    "results": "结果",
    "placeholder": "生成的 NanoID 将显示在这里..."
  },
  "zh-CN": {
    "options": "选项",
    "count": "数量",
    "length": "长度",
    "alphabetPreset": "字符集预设",
    "customAlphabet": "自定义字符集",
    "customAlphabetPlaceholder": "输入自定义字符集...",
    "presetUrlSafe": "URL 安全（A-Z、a-z、0-9、-_）",
    "presetAlphanumeric": "字母数字（A-Z、a-z、0-9）",
    "presetLowercase": "小写（a-z）",
    "presetUppercase": "大写（A-Z）",
    "presetNumbers": "数字（0-9）",
    "presetHexLowercase": "十六进制（0-9、a-f）",
    "presetHexUppercase": "十六进制（0-9、A-F）",
    "presetCustom": "自定义",
    "alphabetTooShort": "字符集至少需要 2 个唯一字符。",
    "alphabetDuplicate": "字符集中不能包含重复字符。",
    "results": "结果",
    "placeholder": "生成的 NanoID 将显示在这里..."
  },
  "zh-TW": {
    "options": "選項",
    "count": "數量",
    "length": "長度",
    "alphabetPreset": "字元集預設",
    "customAlphabet": "自訂字元集",
    "customAlphabetPlaceholder": "輸入自訂字元集...",
    "presetUrlSafe": "URL 安全（A-Z、a-z、0-9、-_）",
    "presetAlphanumeric": "字母數字（A-Z、a-z、0-9）",
    "presetLowercase": "小寫（a-z）",
    "presetUppercase": "大寫（A-Z）",
    "presetNumbers": "數字（0-9）",
    "presetHexLowercase": "十六進位（0-9、a-f）",
    "presetHexUppercase": "十六進位（0-9、A-F）",
    "presetCustom": "自訂",
    "alphabetTooShort": "字元集至少需要 2 個唯一字元。",
    "alphabetDuplicate": "字元集中不能包含重複字元。",
    "results": "結果",
    "placeholder": "產生的 NanoID 會顯示在這裡..."
  },
  "zh-HK": {
    "options": "選項",
    "count": "數量",
    "length": "長度",
    "alphabetPreset": "字元集預設",
    "customAlphabet": "自訂字元集",
    "customAlphabetPlaceholder": "輸入自訂字元集...",
    "presetUrlSafe": "URL 安全（A-Z、a-z、0-9、-_）",
    "presetAlphanumeric": "字母數字（A-Z、a-z、0-9）",
    "presetLowercase": "小寫（a-z）",
    "presetUppercase": "大寫（A-Z）",
    "presetNumbers": "數字（0-9）",
    "presetHexLowercase": "十六進位（0-9、a-f）",
    "presetHexUppercase": "十六進位（0-9、A-F）",
    "presetCustom": "自訂",
    "alphabetTooShort": "字元集至少需要 2 個唯一字元。",
    "alphabetDuplicate": "字元集中不能包含重複字元。",
    "results": "結果",
    "placeholder": "產生的 NanoID 會顯示在這裡..."
  },
  "es": {
    "options": "Options",
    "count": "Count",
    "length": "Length",
    "alphabetPreset": "Alphabet Preset",
    "customAlphabet": "Custom Alphabet",
    "customAlphabetPlaceholder": "Enter custom alphabet...",
    "presetUrlSafe": "URL-safe (A-Z, a-z, 0-9, -_)",
    "presetAlphanumeric": "Alphanumeric (A-Z, a-z, 0-9)",
    "presetLowercase": "Lowercase (a-z)",
    "presetUppercase": "Uppercase (A-Z)",
    "presetNumbers": "Numbers (0-9)",
    "presetHexLowercase": "Hex (0-9, a-f)",
    "presetHexUppercase": "Hex (0-9, A-F)",
    "presetCustom": "Custom",
    "alphabetTooShort": "Alphabet must contain at least 2 unique characters.",
    "alphabetDuplicate": "Alphabet must not contain duplicate characters.",
    "results": "Results",
    "placeholder": "Generated NanoIDs will appear here..."
  },
  "fr": {
    "options": "Options",
    "count": "Count",
    "length": "Length",
    "alphabetPreset": "Alphabet Preset",
    "customAlphabet": "Custom Alphabet",
    "customAlphabetPlaceholder": "Enter custom alphabet...",
    "presetUrlSafe": "URL-safe (A-Z, a-z, 0-9, -_)",
    "presetAlphanumeric": "Alphanumeric (A-Z, a-z, 0-9)",
    "presetLowercase": "Lowercase (a-z)",
    "presetUppercase": "Uppercase (A-Z)",
    "presetNumbers": "Numbers (0-9)",
    "presetHexLowercase": "Hex (0-9, a-f)",
    "presetHexUppercase": "Hex (0-9, A-F)",
    "presetCustom": "Custom",
    "alphabetTooShort": "Alphabet must contain at least 2 unique characters.",
    "alphabetDuplicate": "Alphabet must not contain duplicate characters.",
    "results": "Results",
    "placeholder": "Generated NanoIDs will appear here..."
  },
  "de": {
    "options": "Options",
    "count": "Count",
    "length": "Length",
    "alphabetPreset": "Alphabet Preset",
    "customAlphabet": "Custom Alphabet",
    "customAlphabetPlaceholder": "Enter custom alphabet...",
    "presetUrlSafe": "URL-safe (A-Z, a-z, 0-9, -_)",
    "presetAlphanumeric": "Alphanumeric (A-Z, a-z, 0-9)",
    "presetLowercase": "Lowercase (a-z)",
    "presetUppercase": "Uppercase (A-Z)",
    "presetNumbers": "Numbers (0-9)",
    "presetHexLowercase": "Hex (0-9, a-f)",
    "presetHexUppercase": "Hex (0-9, A-F)",
    "presetCustom": "Custom",
    "alphabetTooShort": "Alphabet must contain at least 2 unique characters.",
    "alphabetDuplicate": "Alphabet must not contain duplicate characters.",
    "results": "Results",
    "placeholder": "Generated NanoIDs will appear here..."
  },
  "it": {
    "options": "Options",
    "count": "Count",
    "length": "Length",
    "alphabetPreset": "Alphabet Preset",
    "customAlphabet": "Custom Alphabet",
    "customAlphabetPlaceholder": "Enter custom alphabet...",
    "presetUrlSafe": "URL-safe (A-Z, a-z, 0-9, -_)",
    "presetAlphanumeric": "Alphanumeric (A-Z, a-z, 0-9)",
    "presetLowercase": "Lowercase (a-z)",
    "presetUppercase": "Uppercase (A-Z)",
    "presetNumbers": "Numbers (0-9)",
    "presetHexLowercase": "Hex (0-9, a-f)",
    "presetHexUppercase": "Hex (0-9, A-F)",
    "presetCustom": "Custom",
    "alphabetTooShort": "Alphabet must contain at least 2 unique characters.",
    "alphabetDuplicate": "Alphabet must not contain duplicate characters.",
    "results": "Results",
    "placeholder": "Generated NanoIDs will appear here..."
  },
  "ja": {
    "options": "Options",
    "count": "Count",
    "length": "Length",
    "alphabetPreset": "Alphabet Preset",
    "customAlphabet": "Custom Alphabet",
    "customAlphabetPlaceholder": "Enter custom alphabet...",
    "presetUrlSafe": "URL-safe (A-Z, a-z, 0-9, -_)",
    "presetAlphanumeric": "Alphanumeric (A-Z, a-z, 0-9)",
    "presetLowercase": "Lowercase (a-z)",
    "presetUppercase": "Uppercase (A-Z)",
    "presetNumbers": "Numbers (0-9)",
    "presetHexLowercase": "Hex (0-9, a-f)",
    "presetHexUppercase": "Hex (0-9, A-F)",
    "presetCustom": "Custom",
    "alphabetTooShort": "Alphabet must contain at least 2 unique characters.",
    "alphabetDuplicate": "Alphabet must not contain duplicate characters.",
    "results": "Results",
    "placeholder": "Generated NanoIDs will appear here..."
  },
  "ko": {
    "options": "Options",
    "count": "Count",
    "length": "Length",
    "alphabetPreset": "Alphabet Preset",
    "customAlphabet": "Custom Alphabet",
    "customAlphabetPlaceholder": "Enter custom alphabet...",
    "presetUrlSafe": "URL-safe (A-Z, a-z, 0-9, -_)",
    "presetAlphanumeric": "Alphanumeric (A-Z, a-z, 0-9)",
    "presetLowercase": "Lowercase (a-z)",
    "presetUppercase": "Uppercase (A-Z)",
    "presetNumbers": "Numbers (0-9)",
    "presetHexLowercase": "Hex (0-9, a-f)",
    "presetHexUppercase": "Hex (0-9, A-F)",
    "presetCustom": "Custom",
    "alphabetTooShort": "Alphabet must contain at least 2 unique characters.",
    "alphabetDuplicate": "Alphabet must not contain duplicate characters.",
    "results": "Results",
    "placeholder": "Generated NanoIDs will appear here..."
  },
  "ru": {
    "options": "Options",
    "count": "Count",
    "length": "Length",
    "alphabetPreset": "Alphabet Preset",
    "customAlphabet": "Custom Alphabet",
    "customAlphabetPlaceholder": "Enter custom alphabet...",
    "presetUrlSafe": "URL-safe (A-Z, a-z, 0-9, -_)",
    "presetAlphanumeric": "Alphanumeric (A-Z, a-z, 0-9)",
    "presetLowercase": "Lowercase (a-z)",
    "presetUppercase": "Uppercase (A-Z)",
    "presetNumbers": "Numbers (0-9)",
    "presetHexLowercase": "Hex (0-9, a-f)",
    "presetHexUppercase": "Hex (0-9, A-F)",
    "presetCustom": "Custom",
    "alphabetTooShort": "Alphabet must contain at least 2 unique characters.",
    "alphabetDuplicate": "Alphabet must not contain duplicate characters.",
    "results": "Results",
    "placeholder": "Generated NanoIDs will appear here..."
  },
  "pt": {
    "options": "Options",
    "count": "Count",
    "length": "Length",
    "alphabetPreset": "Alphabet Preset",
    "customAlphabet": "Custom Alphabet",
    "customAlphabetPlaceholder": "Enter custom alphabet...",
    "presetUrlSafe": "URL-safe (A-Z, a-z, 0-9, -_)",
    "presetAlphanumeric": "Alphanumeric (A-Z, a-z, 0-9)",
    "presetLowercase": "Lowercase (a-z)",
    "presetUppercase": "Uppercase (A-Z)",
    "presetNumbers": "Numbers (0-9)",
    "presetHexLowercase": "Hex (0-9, a-f)",
    "presetHexUppercase": "Hex (0-9, A-F)",
    "presetCustom": "Custom",
    "alphabetTooShort": "Alphabet must contain at least 2 unique characters.",
    "alphabetDuplicate": "Alphabet must not contain duplicate characters.",
    "results": "Results",
    "placeholder": "Generated NanoIDs will appear here..."
  },
  "ar": {
    "options": "Options",
    "count": "Count",
    "length": "Length",
    "alphabetPreset": "Alphabet Preset",
    "customAlphabet": "Custom Alphabet",
    "customAlphabetPlaceholder": "Enter custom alphabet...",
    "presetUrlSafe": "URL-safe (A-Z, a-z, 0-9, -_)",
    "presetAlphanumeric": "Alphanumeric (A-Z, a-z, 0-9)",
    "presetLowercase": "Lowercase (a-z)",
    "presetUppercase": "Uppercase (A-Z)",
    "presetNumbers": "Numbers (0-9)",
    "presetHexLowercase": "Hex (0-9, a-f)",
    "presetHexUppercase": "Hex (0-9, A-F)",
    "presetCustom": "Custom",
    "alphabetTooShort": "Alphabet must contain at least 2 unique characters.",
    "alphabetDuplicate": "Alphabet must not contain duplicate characters.",
    "results": "Results",
    "placeholder": "Generated NanoIDs will appear here..."
  },
  "hi": {
    "options": "Options",
    "count": "Count",
    "length": "Length",
    "alphabetPreset": "Alphabet Preset",
    "customAlphabet": "Custom Alphabet",
    "customAlphabetPlaceholder": "Enter custom alphabet...",
    "presetUrlSafe": "URL-safe (A-Z, a-z, 0-9, -_)",
    "presetAlphanumeric": "Alphanumeric (A-Z, a-z, 0-9)",
    "presetLowercase": "Lowercase (a-z)",
    "presetUppercase": "Uppercase (A-Z)",
    "presetNumbers": "Numbers (0-9)",
    "presetHexLowercase": "Hex (0-9, a-f)",
    "presetHexUppercase": "Hex (0-9, A-F)",
    "presetCustom": "Custom",
    "alphabetTooShort": "Alphabet must contain at least 2 unique characters.",
    "alphabetDuplicate": "Alphabet must not contain duplicate characters.",
    "results": "Results",
    "placeholder": "Generated NanoIDs will appear here..."
  },
  "tr": {
    "options": "Options",
    "count": "Count",
    "length": "Length",
    "alphabetPreset": "Alphabet Preset",
    "customAlphabet": "Custom Alphabet",
    "customAlphabetPlaceholder": "Enter custom alphabet...",
    "presetUrlSafe": "URL-safe (A-Z, a-z, 0-9, -_)",
    "presetAlphanumeric": "Alphanumeric (A-Z, a-z, 0-9)",
    "presetLowercase": "Lowercase (a-z)",
    "presetUppercase": "Uppercase (A-Z)",
    "presetNumbers": "Numbers (0-9)",
    "presetHexLowercase": "Hex (0-9, a-f)",
    "presetHexUppercase": "Hex (0-9, A-F)",
    "presetCustom": "Custom",
    "alphabetTooShort": "Alphabet must contain at least 2 unique characters.",
    "alphabetDuplicate": "Alphabet must not contain duplicate characters.",
    "results": "Results",
    "placeholder": "Generated NanoIDs will appear here..."
  },
  "nl": {
    "options": "Options",
    "count": "Count",
    "length": "Length",
    "alphabetPreset": "Alphabet Preset",
    "customAlphabet": "Custom Alphabet",
    "customAlphabetPlaceholder": "Enter custom alphabet...",
    "presetUrlSafe": "URL-safe (A-Z, a-z, 0-9, -_)",
    "presetAlphanumeric": "Alphanumeric (A-Z, a-z, 0-9)",
    "presetLowercase": "Lowercase (a-z)",
    "presetUppercase": "Uppercase (A-Z)",
    "presetNumbers": "Numbers (0-9)",
    "presetHexLowercase": "Hex (0-9, a-f)",
    "presetHexUppercase": "Hex (0-9, A-F)",
    "presetCustom": "Custom",
    "alphabetTooShort": "Alphabet must contain at least 2 unique characters.",
    "alphabetDuplicate": "Alphabet must not contain duplicate characters.",
    "results": "Results",
    "placeholder": "Generated NanoIDs will appear here..."
  },
  "sv": {
    "options": "Options",
    "count": "Count",
    "length": "Length",
    "alphabetPreset": "Alphabet Preset",
    "customAlphabet": "Custom Alphabet",
    "customAlphabetPlaceholder": "Enter custom alphabet...",
    "presetUrlSafe": "URL-safe (A-Z, a-z, 0-9, -_)",
    "presetAlphanumeric": "Alphanumeric (A-Z, a-z, 0-9)",
    "presetLowercase": "Lowercase (a-z)",
    "presetUppercase": "Uppercase (A-Z)",
    "presetNumbers": "Numbers (0-9)",
    "presetHexLowercase": "Hex (0-9, a-f)",
    "presetHexUppercase": "Hex (0-9, A-F)",
    "presetCustom": "Custom",
    "alphabetTooShort": "Alphabet must contain at least 2 unique characters.",
    "alphabetDuplicate": "Alphabet must not contain duplicate characters.",
    "results": "Results",
    "placeholder": "Generated NanoIDs will appear here..."
  },
  "pl": {
    "options": "Options",
    "count": "Count",
    "length": "Length",
    "alphabetPreset": "Alphabet Preset",
    "customAlphabet": "Custom Alphabet",
    "customAlphabetPlaceholder": "Enter custom alphabet...",
    "presetUrlSafe": "URL-safe (A-Z, a-z, 0-9, -_)",
    "presetAlphanumeric": "Alphanumeric (A-Z, a-z, 0-9)",
    "presetLowercase": "Lowercase (a-z)",
    "presetUppercase": "Uppercase (A-Z)",
    "presetNumbers": "Numbers (0-9)",
    "presetHexLowercase": "Hex (0-9, a-f)",
    "presetHexUppercase": "Hex (0-9, A-F)",
    "presetCustom": "Custom",
    "alphabetTooShort": "Alphabet must contain at least 2 unique characters.",
    "alphabetDuplicate": "Alphabet must not contain duplicate characters.",
    "results": "Results",
    "placeholder": "Generated NanoIDs will appear here..."
  },
  "vi": {
    "options": "Options",
    "count": "Count",
    "length": "Length",
    "alphabetPreset": "Alphabet Preset",
    "customAlphabet": "Custom Alphabet",
    "customAlphabetPlaceholder": "Enter custom alphabet...",
    "presetUrlSafe": "URL-safe (A-Z, a-z, 0-9, -_)",
    "presetAlphanumeric": "Alphanumeric (A-Z, a-z, 0-9)",
    "presetLowercase": "Lowercase (a-z)",
    "presetUppercase": "Uppercase (A-Z)",
    "presetNumbers": "Numbers (0-9)",
    "presetHexLowercase": "Hex (0-9, a-f)",
    "presetHexUppercase": "Hex (0-9, A-F)",
    "presetCustom": "Custom",
    "alphabetTooShort": "Alphabet must contain at least 2 unique characters.",
    "alphabetDuplicate": "Alphabet must not contain duplicate characters.",
    "results": "Results",
    "placeholder": "Generated NanoIDs will appear here..."
  },
  "th": {
    "options": "Options",
    "count": "Count",
    "length": "Length",
    "alphabetPreset": "Alphabet Preset",
    "customAlphabet": "Custom Alphabet",
    "customAlphabetPlaceholder": "Enter custom alphabet...",
    "presetUrlSafe": "URL-safe (A-Z, a-z, 0-9, -_)",
    "presetAlphanumeric": "Alphanumeric (A-Z, a-z, 0-9)",
    "presetLowercase": "Lowercase (a-z)",
    "presetUppercase": "Uppercase (A-Z)",
    "presetNumbers": "Numbers (0-9)",
    "presetHexLowercase": "Hex (0-9, a-f)",
    "presetHexUppercase": "Hex (0-9, A-F)",
    "presetCustom": "Custom",
    "alphabetTooShort": "Alphabet must contain at least 2 unique characters.",
    "alphabetDuplicate": "Alphabet must not contain duplicate characters.",
    "results": "Results",
    "placeholder": "Generated NanoIDs will appear here..."
  },
  "id": {
    "options": "Options",
    "count": "Count",
    "length": "Length",
    "alphabetPreset": "Alphabet Preset",
    "customAlphabet": "Custom Alphabet",
    "customAlphabetPlaceholder": "Enter custom alphabet...",
    "presetUrlSafe": "URL-safe (A-Z, a-z, 0-9, -_)",
    "presetAlphanumeric": "Alphanumeric (A-Z, a-z, 0-9)",
    "presetLowercase": "Lowercase (a-z)",
    "presetUppercase": "Uppercase (A-Z)",
    "presetNumbers": "Numbers (0-9)",
    "presetHexLowercase": "Hex (0-9, a-f)",
    "presetHexUppercase": "Hex (0-9, A-F)",
    "presetCustom": "Custom",
    "alphabetTooShort": "Alphabet must contain at least 2 unique characters.",
    "alphabetDuplicate": "Alphabet must not contain duplicate characters.",
    "results": "Results",
    "placeholder": "Generated NanoIDs will appear here..."
  },
  "he": {
    "options": "Options",
    "count": "Count",
    "length": "Length",
    "alphabetPreset": "Alphabet Preset",
    "customAlphabet": "Custom Alphabet",
    "customAlphabetPlaceholder": "Enter custom alphabet...",
    "presetUrlSafe": "URL-safe (A-Z, a-z, 0-9, -_)",
    "presetAlphanumeric": "Alphanumeric (A-Z, a-z, 0-9)",
    "presetLowercase": "Lowercase (a-z)",
    "presetUppercase": "Uppercase (A-Z)",
    "presetNumbers": "Numbers (0-9)",
    "presetHexLowercase": "Hex (0-9, a-f)",
    "presetHexUppercase": "Hex (0-9, A-F)",
    "presetCustom": "Custom",
    "alphabetTooShort": "Alphabet must contain at least 2 unique characters.",
    "alphabetDuplicate": "Alphabet must not contain duplicate characters.",
    "results": "Results",
    "placeholder": "Generated NanoIDs will appear here..."
  },
  "ms": {
    "options": "Options",
    "count": "Count",
    "length": "Length",
    "alphabetPreset": "Alphabet Preset",
    "customAlphabet": "Custom Alphabet",
    "customAlphabetPlaceholder": "Enter custom alphabet...",
    "presetUrlSafe": "URL-safe (A-Z, a-z, 0-9, -_)",
    "presetAlphanumeric": "Alphanumeric (A-Z, a-z, 0-9)",
    "presetLowercase": "Lowercase (a-z)",
    "presetUppercase": "Uppercase (A-Z)",
    "presetNumbers": "Numbers (0-9)",
    "presetHexLowercase": "Hex (0-9, a-f)",
    "presetHexUppercase": "Hex (0-9, A-F)",
    "presetCustom": "Custom",
    "alphabetTooShort": "Alphabet must contain at least 2 unique characters.",
    "alphabetDuplicate": "Alphabet must not contain duplicate characters.",
    "results": "Results",
    "placeholder": "Generated NanoIDs will appear here..."
  },
  "no": {
    "options": "Options",
    "count": "Count",
    "length": "Length",
    "alphabetPreset": "Alphabet Preset",
    "customAlphabet": "Custom Alphabet",
    "customAlphabetPlaceholder": "Enter custom alphabet...",
    "presetUrlSafe": "URL-safe (A-Z, a-z, 0-9, -_)",
    "presetAlphanumeric": "Alphanumeric (A-Z, a-z, 0-9)",
    "presetLowercase": "Lowercase (a-z)",
    "presetUppercase": "Uppercase (A-Z)",
    "presetNumbers": "Numbers (0-9)",
    "presetHexLowercase": "Hex (0-9, a-f)",
    "presetHexUppercase": "Hex (0-9, A-F)",
    "presetCustom": "Custom",
    "alphabetTooShort": "Alphabet must contain at least 2 unique characters.",
    "alphabetDuplicate": "Alphabet must not contain duplicate characters.",
    "results": "Results",
    "placeholder": "Generated NanoIDs will appear here..."
  }
}
</i18n>
