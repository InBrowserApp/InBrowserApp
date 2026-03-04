<template>
  <JsonDiffPathInputsSection
    v-model:original-text="originalText"
    v-model:modified-text="modifiedText"
    v-model:selected-operations="selectedOperations"
    :show-large-compare-hint="pendingLargeCompare"
    @swap="swapInputs"
    @format="formatInputs"
    @compare="applyComparison"
  />

  <JsonDiffPathResultsSection
    v-model:active-tab="activeTab"
    :is-ready="isReady"
    :original-error="displayedOriginalError"
    :modified-error="displayedModifiedError"
    :filtered-count="filteredEntries.length"
    :total-count="diffEntries.length"
    :formatted-paths="formattedPaths"
    :formatted-patch="formattedPatch"
    :paths-download-url="pathsDownloadUrl"
    :patch-download-url="patchDownloadUrl"
    :pending-large-compare="pendingLargeCompare"
  />
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useObjectUrl, useStorage } from '@vueuse/core'
import {
  diffJsonValues,
  parseJsonWithError,
  toJsonPatch,
  type JsonDiffEntry,
  type JsonDiffOperation,
} from '../utils/jsonDiff'
import JsonDiffPathInputsSection from './JsonDiffPathInputsSection.vue'
import JsonDiffPathResultsSection from './JsonDiffPathResultsSection.vue'

const DEFAULT_LARGE_JSON_INPUT_THRESHOLD = 120_000
const LARGE_JSON_INPUT_THRESHOLD = resolveLargeJsonInputThreshold()

const sampleOriginal = `{
  "user": {
    "id": 1,
    "name": "Alice",
    "roles": ["reader", "editor"]
  },
  "active": true
}`

const sampleModified = `{
  "user": {
    "id": 1,
    "name": "Alice Chen",
    "roles": ["reader", "editor", "admin"]
  },
  "active": false,
  "region": "us-east-1"
}`

const originalText = useStorage('tools:json-diff-path:original', sampleOriginal)
const modifiedText = useStorage('tools:json-diff-path:modified', sampleModified)

const activeTab = ref<'paths' | 'patch'>('paths')
const selectedOperations = ref<JsonDiffOperation[]>(['add', 'remove', 'replace'])

const pendingLargeCompare = ref(false)
const comparisonOriginalText = ref(originalText.value)
const comparisonModifiedText = ref(modifiedText.value)

const exceedsLargeInputThreshold = computed(
  () => originalText.value.length + modifiedText.value.length >= LARGE_JSON_INPUT_THRESHOLD,
)

watch(
  () => [originalText.value, modifiedText.value, exceedsLargeInputThreshold.value] as const,
  ([nextOriginal, nextModified, largeInput]) => {
    if (largeInput) {
      pendingLargeCompare.value =
        nextOriginal !== comparisonOriginalText.value ||
        nextModified !== comparisonModifiedText.value
      return
    }

    comparisonOriginalText.value = nextOriginal
    comparisonModifiedText.value = nextModified
    pendingLargeCompare.value = false
  },
  { immediate: true },
)

const originalParse = computed(() => parseJsonWithError(comparisonOriginalText.value))
const modifiedParse = computed(() => parseJsonWithError(comparisonModifiedText.value))
const displayedOriginalError = computed(() =>
  pendingLargeCompare.value ? undefined : originalParse.value.error,
)
const displayedModifiedError = computed(() =>
  pendingLargeCompare.value ? undefined : modifiedParse.value.error,
)

const isReady = computed(
  () =>
    Boolean(comparisonOriginalText.value.trim()) &&
    Boolean(comparisonModifiedText.value.trim()) &&
    !originalParse.value.error &&
    !modifiedParse.value.error,
)

const diffEntries = computed<JsonDiffEntry[]>(() => {
  if (!isReady.value) {
    return []
  }

  return diffJsonValues(originalParse.value.value, modifiedParse.value.value)
})

const filteredEntries = computed(() =>
  diffEntries.value.filter((entry) => selectedOperations.value.includes(entry.op)),
)

const formattedPaths = computed(() =>
  JSON.stringify(
    filteredEntries.value.map((entry) => ({
      op: entry.op,
      path: entry.jsonPath,
      pointer: entry.jsonPointer,
      oldValue: entry.oldValue,
      newValue: entry.newValue,
    })),
    null,
    2,
  ),
)

const formattedPatch = computed(() => JSON.stringify(toJsonPatch(filteredEntries.value), null, 2))

const pathsDownloadFile = computed<File | null>(() => {
  if (!isReady.value) {
    return null
  }

  return new File([formattedPaths.value], 'json-diff-paths.json', {
    type: 'application/json',
  })
})

const patchDownloadFile = computed<File | null>(() => {
  if (!isReady.value) {
    return null
  }

  return new File([formattedPatch.value], 'json-diff-patch.json', {
    type: 'application/json',
  })
})

const pathsDownloadUrl = useObjectUrl(pathsDownloadFile)
const patchDownloadUrl = useObjectUrl(patchDownloadFile)

function swapInputs(): void {
  const previousOriginal = originalText.value
  originalText.value = modifiedText.value
  modifiedText.value = previousOriginal
}

function applyComparison(): void {
  comparisonOriginalText.value = originalText.value
  comparisonModifiedText.value = modifiedText.value
  pendingLargeCompare.value = false
}

function formatInputs(): void {
  originalText.value = formatJsonInput(originalText.value)
  modifiedText.value = formatJsonInput(modifiedText.value)
}

function formatJsonInput(input: string): string {
  const parsed = parseJsonWithError(input)
  if (parsed.error || parsed.value === undefined) {
    return input
  }

  return JSON.stringify(parsed.value, null, 2)
}

function resolveLargeJsonInputThreshold(): number {
  if (typeof navigator === 'undefined') {
    return DEFAULT_LARGE_JSON_INPUT_THRESHOLD
  }

  const hardwareConcurrency = navigator.hardwareConcurrency ?? 4
  const deviceMemory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 0

  if (hardwareConcurrency >= 12 || deviceMemory >= 8) {
    return 220_000
  }

  if (hardwareConcurrency >= 8 || deviceMemory >= 4) {
    return 180_000
  }

  if (hardwareConcurrency >= 4) {
    return DEFAULT_LARGE_JSON_INPUT_THRESHOLD
  }

  return 80_000
}
</script>
