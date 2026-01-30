<template>
  <ToolSectionHeader v-if="hasEntries">{{ t('resultsTitle') }}</ToolSectionHeader>
  <ToolSection v-if="hasEntries">
    <n-tabs v-if="entries.length > 1" type="line">
      <n-tab-pane
        v-for="entry in entries"
        :key="entry.label"
        :name="entry.label"
        :tab="entry.label"
      >
        <ParsedEntryDetails :entry="entry" />
      </n-tab-pane>
    </n-tabs>

    <ParsedEntryDetails v-else :entry="entries[0]!" />
  </ToolSection>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { NTabPane, NTabs } from 'naive-ui'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import ParsedEntryDetails from './ParsedEntryDetails.vue'
import type { ParsedEntry } from '../utils/types'

const props = defineProps<{
  entries: ParsedEntry[]
}>()

const { t } = useI18n({ useScope: 'local' })

const hasEntries = computed(() => props.entries.length > 0)
</script>

<i18n lang="json">
{
  "en": {
    "resultsTitle": "Parsed Result"
  },
  "zh": {
    "resultsTitle": "解析结果"
  },
  "zh-CN": {
    "resultsTitle": "解析结果"
  },
  "zh-TW": {
    "resultsTitle": "解析結果"
  },
  "zh-HK": {
    "resultsTitle": "解析結果"
  },
  "es": {
    "resultsTitle": "Resultado del análisis"
  },
  "fr": {
    "resultsTitle": "Résultat d'analyse"
  },
  "de": {
    "resultsTitle": "Analyseergebnis"
  },
  "it": {
    "resultsTitle": "Risultato dell'analisi"
  },
  "ja": {
    "resultsTitle": "解析結果"
  },
  "ko": {
    "resultsTitle": "분석 결과"
  },
  "ru": {
    "resultsTitle": "Результат разбора"
  },
  "pt": {
    "resultsTitle": "Resultado da análise"
  },
  "ar": {
    "resultsTitle": "نتيجة التحليل"
  },
  "hi": {
    "resultsTitle": "पार्स परिणाम"
  },
  "tr": {
    "resultsTitle": "Ayrıştırma Sonucu"
  },
  "nl": {
    "resultsTitle": "Geparseerd resultaat"
  },
  "sv": {
    "resultsTitle": "Analyserat resultat"
  },
  "pl": {
    "resultsTitle": "Wynik analizy"
  },
  "vi": {
    "resultsTitle": "Kết quả phân tích"
  },
  "th": {
    "resultsTitle": "ผลลัพธ์การวิเคราะห์"
  },
  "id": {
    "resultsTitle": "Hasil analisis"
  },
  "he": {
    "resultsTitle": "תוצאת הניתוח"
  },
  "ms": {
    "resultsTitle": "Hasil analisis"
  },
  "no": {
    "resultsTitle": "Analyseresultat"
  }
}
</i18n>
