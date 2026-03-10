<template>
  <ListComparerInputSection
    v-model:left-text="leftText"
    v-model:right-text="rightText"
    :left-summary="comparison.left"
    :right-summary="comparison.right"
    @swap="swapLists"
    @use-sample="loadSampleLists"
    @clear="clearLists"
  />

  <ListComparerOptionsSection
    v-model:delimiter-mode="delimiterModeModel"
    v-model:custom-delimiter="customDelimiter"
    v-model:trim-items="trimItems"
    v-model:ignore-case="ignoreCase"
    v-model:omit-empty-items="omitEmptyItems"
    v-model:sort-results="sortResults"
  />

  <ListComparerSummarySection :comparison="comparison" />

  <ListComparerResultsSection
    v-model:active-tab="activeTabModel"
    :comparison="comparison"
    :has-any-input="hasAnyInput"
    :active-output="activeOutput"
    :active-count="activeCount"
    :download-url="downloadUrl"
    :download-name="downloadName"
  />
</template>

<script setup lang="ts">
import { computed, watchEffect } from 'vue'
import { useObjectUrl, useStorage } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import ListComparerInputSection from './ListComparerInputSection.vue'
import ListComparerOptionsSection from './ListComparerOptionsSection.vue'
import ListComparerResultsSection from './ListComparerResultsSection.vue'
import ListComparerSummarySection from './ListComparerSummarySection.vue'
import {
  DEFAULT_CUSTOM_DELIMITER,
  DEFAULT_DELIMITER_MODE,
  DEFAULT_LIST_COMPARER_TAB,
  compareLists,
  formatDuplicateItemsForExport,
  formatItemsForExport,
  normalizeDelimiterMode,
  normalizeListComparerTab,
  type ListComparerOptions,
  type ListComparerTab,
} from '../utils/listComparer'

const DEFAULT_LEFT_SAMPLE = ['banana', 'kiwi', 'banana', 'mango', 'pear', 'apple'].join('\n')
const DEFAULT_RIGHT_SAMPLE = ['kiwi', 'grape', 'apple', 'apple', 'melon', 'banana'].join('\n')

const { locale } = useI18n()

const leftText = useStorage('tools:list-comparer:left', DEFAULT_LEFT_SAMPLE)
const rightText = useStorage('tools:list-comparer:right', DEFAULT_RIGHT_SAMPLE)
const storedDelimiterMode = useStorage('tools:list-comparer:delimiter-mode', DEFAULT_DELIMITER_MODE)
const customDelimiter = useStorage('tools:list-comparer:custom-delimiter', DEFAULT_CUSTOM_DELIMITER)
const trimItems = useStorage('tools:list-comparer:trim-items', true)
const ignoreCase = useStorage('tools:list-comparer:ignore-case', false)
const omitEmptyItems = useStorage('tools:list-comparer:omit-empty-items', true)
const sortResults = useStorage('tools:list-comparer:sort-results', false)
const storedActiveTab = useStorage('tools:list-comparer:active-tab', DEFAULT_LIST_COMPARER_TAB)

const delimiterModeModel = computed<ListComparerOptions['delimiterMode']>({
  get: () => normalizeDelimiterMode(storedDelimiterMode.value),
  set: (value) => {
    storedDelimiterMode.value = normalizeDelimiterMode(value)
  },
})

const activeTabModel = computed<ListComparerTab>({
  get: () => normalizeListComparerTab(storedActiveTab.value),
  set: (value) => {
    storedActiveTab.value = normalizeListComparerTab(value)
  },
})

watchEffect(() => {
  const normalizedDelimiterMode = normalizeDelimiterMode(storedDelimiterMode.value)
  if (storedDelimiterMode.value !== normalizedDelimiterMode) {
    storedDelimiterMode.value = normalizedDelimiterMode
  }

  const normalizedActiveTab = normalizeListComparerTab(storedActiveTab.value)
  if (storedActiveTab.value !== normalizedActiveTab) {
    storedActiveTab.value = normalizedActiveTab
  }
})

const options = computed<ListComparerOptions>(() => ({
  delimiterMode: delimiterModeModel.value,
  customDelimiter: customDelimiter.value,
  trimItems: trimItems.value,
  ignoreCase: ignoreCase.value,
  omitEmptyItems: omitEmptyItems.value,
  sortResults: sortResults.value,
}))

const comparison = computed(() =>
  compareLists(leftText.value, rightText.value, options.value, locale.value || 'en'),
)

const hasAnyInput = computed(() => Boolean(leftText.value || rightText.value))

const activeCount = computed(() => {
  switch (activeTabModel.value) {
    case 'common':
      return comparison.value.commonItems.length
    case 'left-only':
      return comparison.value.leftOnlyItems.length
    case 'right-only':
      return comparison.value.rightOnlyItems.length
    case 'all-unique':
      return comparison.value.unionItems.length
    case 'left-duplicates':
      return comparison.value.left.duplicateItems.length
    case 'right-duplicates':
      return comparison.value.right.duplicateItems.length
  }

  return 0
})

const activeOutput = computed(() => {
  switch (activeTabModel.value) {
    case 'common':
      return formatItemsForExport(comparison.value.commonItems)
    case 'left-only':
      return formatItemsForExport(comparison.value.leftOnlyItems)
    case 'right-only':
      return formatItemsForExport(comparison.value.rightOnlyItems)
    case 'all-unique':
      return formatItemsForExport(comparison.value.unionItems)
    case 'left-duplicates':
      return formatDuplicateItemsForExport(comparison.value.left.duplicateItems)
    case 'right-duplicates':
      return formatDuplicateItemsForExport(comparison.value.right.duplicateItems)
  }

  return ''
})

const downloadFile = computed<File | null>(() => {
  if (!hasAnyInput.value || activeCount.value === 0) {
    return null
  }

  const { name, type } = resolveDownloadSpec(activeTabModel.value)
  return new File([activeOutput.value], `list-comparer-${name}`, { type })
})

const downloadUrl = useObjectUrl(downloadFile)

const downloadName = computed(() => resolveDownloadSpec(activeTabModel.value).name)

function swapLists(): void {
  const previousLeft = leftText.value
  leftText.value = rightText.value
  rightText.value = previousLeft
}

function loadSampleLists(): void {
  leftText.value = DEFAULT_LEFT_SAMPLE
  rightText.value = DEFAULT_RIGHT_SAMPLE
}

function clearLists(): void {
  leftText.value = ''
  rightText.value = ''
}

function resolveDownloadSpec(tab: ListComparerTab): { name: string; type: string } {
  if (tab === 'left-duplicates') {
    return {
      name: 'left-duplicates.tsv',
      type: 'text/tab-separated-values;charset=utf-8',
    }
  }

  if (tab === 'right-duplicates') {
    return {
      name: 'right-duplicates.tsv',
      type: 'text/tab-separated-values;charset=utf-8',
    }
  }

  return {
    name: `${tab}.txt`,
    type: 'text/plain;charset=utf-8',
  }
}
</script>
