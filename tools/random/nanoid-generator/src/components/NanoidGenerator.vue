<template>
  <NanoidGeneratorOptions
    v-model:count="count"
    v-model:length="length"
    v-model:alphabetPreset="alphabetPreset"
    v-model:customAlphabet="customAlphabet"
    :max-count="maxCount"
    :max-length="maxLength"
    :alphabet-error="alphabetError"
  />
  <NanoidGeneratorResults :output="output" @regenerate="regenerate" />
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStorage } from '@vueuse/core'
import NanoidGeneratorOptions from './NanoidGeneratorOptions.vue'
import NanoidGeneratorResults from './NanoidGeneratorResults.vue'
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

<i18n lang="json">
{
  "en": {
    "alphabetTooShort": "Alphabet must contain at least 2 unique characters.",
    "alphabetDuplicate": "Alphabet must not contain duplicate characters."
  },
  "zh": {
    "alphabetTooShort": "字符集至少需要 2 个唯一字符。",
    "alphabetDuplicate": "字符集中不能包含重复字符。"
  },
  "zh-CN": {
    "alphabetTooShort": "字符集至少需要 2 个唯一字符。",
    "alphabetDuplicate": "字符集中不能包含重复字符。"
  },
  "zh-TW": {
    "alphabetTooShort": "字元集至少需要 2 個唯一字元。",
    "alphabetDuplicate": "字元集中不能包含重複字元。"
  },
  "zh-HK": {
    "alphabetTooShort": "字元集至少需要 2 個唯一字元。",
    "alphabetDuplicate": "字元集中不能包含重複字元。"
  },
  "es": {
    "alphabetTooShort": "Alphabet must contain at least 2 unique characters.",
    "alphabetDuplicate": "Alphabet must not contain duplicate characters."
  },
  "fr": {
    "alphabetTooShort": "Alphabet must contain at least 2 unique characters.",
    "alphabetDuplicate": "Alphabet must not contain duplicate characters."
  },
  "de": {
    "alphabetTooShort": "Alphabet must contain at least 2 unique characters.",
    "alphabetDuplicate": "Alphabet must not contain duplicate characters."
  },
  "it": {
    "alphabetTooShort": "Alphabet must contain at least 2 unique characters.",
    "alphabetDuplicate": "Alphabet must not contain duplicate characters."
  },
  "ja": {
    "alphabetTooShort": "Alphabet must contain at least 2 unique characters.",
    "alphabetDuplicate": "Alphabet must not contain duplicate characters."
  },
  "ko": {
    "alphabetTooShort": "Alphabet must contain at least 2 unique characters.",
    "alphabetDuplicate": "Alphabet must not contain duplicate characters."
  },
  "ru": {
    "alphabetTooShort": "Alphabet must contain at least 2 unique characters.",
    "alphabetDuplicate": "Alphabet must not contain duplicate characters."
  },
  "pt": {
    "alphabetTooShort": "Alphabet must contain at least 2 unique characters.",
    "alphabetDuplicate": "Alphabet must not contain duplicate characters."
  },
  "ar": {
    "alphabetTooShort": "Alphabet must contain at least 2 unique characters.",
    "alphabetDuplicate": "Alphabet must not contain duplicate characters."
  },
  "hi": {
    "alphabetTooShort": "Alphabet must contain at least 2 unique characters.",
    "alphabetDuplicate": "Alphabet must not contain duplicate characters."
  },
  "tr": {
    "alphabetTooShort": "Alphabet must contain at least 2 unique characters.",
    "alphabetDuplicate": "Alphabet must not contain duplicate characters."
  },
  "nl": {
    "alphabetTooShort": "Alphabet must contain at least 2 unique characters.",
    "alphabetDuplicate": "Alphabet must not contain duplicate characters."
  },
  "sv": {
    "alphabetTooShort": "Alphabet must contain at least 2 unique characters.",
    "alphabetDuplicate": "Alphabet must not contain duplicate characters."
  },
  "pl": {
    "alphabetTooShort": "Alphabet must contain at least 2 unique characters.",
    "alphabetDuplicate": "Alphabet must not contain duplicate characters."
  },
  "vi": {
    "alphabetTooShort": "Alphabet must contain at least 2 unique characters.",
    "alphabetDuplicate": "Alphabet must not contain duplicate characters."
  },
  "th": {
    "alphabetTooShort": "Alphabet must contain at least 2 unique characters.",
    "alphabetDuplicate": "Alphabet must not contain duplicate characters."
  },
  "id": {
    "alphabetTooShort": "Alphabet must contain at least 2 unique characters.",
    "alphabetDuplicate": "Alphabet must not contain duplicate characters."
  },
  "he": {
    "alphabetTooShort": "Alphabet must contain at least 2 unique characters.",
    "alphabetDuplicate": "Alphabet must not contain duplicate characters."
  },
  "ms": {
    "alphabetTooShort": "Alphabet must contain at least 2 unique characters.",
    "alphabetDuplicate": "Alphabet must not contain duplicate characters."
  },
  "no": {
    "alphabetTooShort": "Alphabet must contain at least 2 unique characters.",
    "alphabetDuplicate": "Alphabet must not contain duplicate characters."
  }
}
</i18n>
