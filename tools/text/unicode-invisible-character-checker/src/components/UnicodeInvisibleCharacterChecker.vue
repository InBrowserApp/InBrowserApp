<template>
  <UnicodeInvisibleInputSection v-model:value="textOrFile" />
  <UnicodeInvisibleCategoriesSection v-model:value="selectedCategories" />
  <UnicodeInvisibleResultsSection
    :matches="matches"
    :counts="counts"
    :cleaned-text="cleanedText"
    :annotated-text="annotatedText"
    :has-input="hasInput"
    :selected-categories="selectedCategories"
  />
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { computedAsync, useStorage } from '@vueuse/core'
import UnicodeInvisibleCategoriesSection from './UnicodeInvisibleCategoriesSection.vue'
import UnicodeInvisibleInputSection from './UnicodeInvisibleInputSection.vue'
import UnicodeInvisibleResultsSection from './UnicodeInvisibleResultsSection.vue'
import { INVISIBLE_CATEGORIES, scanInvisibleCharacters, type InvisibleCategory } from '../utils'

const defaultText = [
  'Hello\u200BWorld',
  'Price:\u00A0123\u202FUSD',
  'Order\u00ADID: 42',
  'Direction\u200E/LTR\u200FRTL',
].join('\n')

const storedText = useStorage('tools:unicode-invisible-character-checker:text', defaultText)
const textOrFile = ref<string | File>(storedText.value)
const selectedCategories = useStorage<InvisibleCategory[]>(
  'tools:unicode-invisible-character-checker:categories',
  INVISIBLE_CATEGORIES.map((entry) => entry.value),
)
const isReading = ref(false)

const sourceText = computedAsync(
  async () => {
    const input = textOrFile.value
    if (typeof input === 'string') return input
    return input.text()
  },
  '',
  isReading,
)

watch(textOrFile, (value) => {
  if (typeof value === 'string') {
    storedText.value = value
  }
})

watch(storedText, (value) => {
  if (typeof textOrFile.value === 'string') {
    textOrFile.value = value
  }
})

const enabledCategories = computed(() => new Set(selectedCategories.value))

const scanResult = computed(() =>
  scanInvisibleCharacters(sourceText.value, enabledCategories.value),
)
const matches = computed(() => scanResult.value.matches)
const counts = computed(() => scanResult.value.counts)
const cleanedText = computed(() => scanResult.value.cleanedText)
const annotatedText = computed(() => scanResult.value.annotatedText)
const hasInput = computed(() => sourceText.value.length > 0)
</script>
