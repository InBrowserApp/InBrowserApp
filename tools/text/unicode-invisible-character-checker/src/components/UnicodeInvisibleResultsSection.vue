<template>
  <ToolSectionHeader>{{ t('results-title') }}</ToolSectionHeader>
  <ToolSection>
    <UnicodeInvisibleResultsSummary
      :matches="matches"
      :counts="counts"
      :cleaned-text="cleanedText"
      :has-input="hasInput"
      :selected-categories="selectedCategories"
    />
    <UnicodeInvisibleResultsOutputs :cleaned-text="cleanedText" :annotated-text="annotatedText" />
    <UnicodeInvisibleResultsTable :matches="matches" />
  </ToolSection>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import UnicodeInvisibleResultsOutputs from './UnicodeInvisibleResultsOutputs.vue'
import UnicodeInvisibleResultsSummary from './UnicodeInvisibleResultsSummary.vue'
import UnicodeInvisibleResultsTable from './UnicodeInvisibleResultsTable.vue'
import { type InvisibleCategory, type InvisibleMatch } from '../utils'

defineProps<{
  matches: InvisibleMatch[]
  counts: Record<InvisibleCategory, number>
  cleanedText: string
  annotatedText: string
  hasInput: boolean
  selectedCategories: InvisibleCategory[]
}>()

const { t } = useI18n()
</script>

<i18n lang="json">
{
  "en": {
    "results-title": "Results"
  },
  "zh": {
    "results-title": "结果"
  },
  "zh-CN": {
    "results-title": "结果"
  },
  "zh-TW": {
    "results-title": "結果"
  },
  "zh-HK": {
    "results-title": "結果"
  },
  "es": {
    "results-title": "Resultados"
  },
  "fr": {
    "results-title": "Résultats"
  },
  "de": {
    "results-title": "Ergebnisse"
  },
  "it": {
    "results-title": "Risultati"
  },
  "ja": {
    "results-title": "結果"
  },
  "ko": {
    "results-title": "결과"
  },
  "ru": {
    "results-title": "Результаты"
  },
  "pt": {
    "results-title": "Resultados"
  },
  "ar": {
    "results-title": "النتائج"
  },
  "hi": {
    "results-title": "परिणाम"
  },
  "tr": {
    "results-title": "Sonuçlar"
  },
  "nl": {
    "results-title": "Resultaten"
  },
  "sv": {
    "results-title": "Resultat"
  },
  "pl": {
    "results-title": "Wyniki"
  },
  "vi": {
    "results-title": "Kết quả"
  },
  "th": {
    "results-title": "ผลลัพธ์"
  },
  "id": {
    "results-title": "Hasil"
  },
  "he": {
    "results-title": "תוצאות"
  },
  "ms": {
    "results-title": "Keputusan"
  },
  "no": {
    "results-title": "Resultater"
  }
}
</i18n>
