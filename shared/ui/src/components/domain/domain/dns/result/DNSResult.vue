<template>
  <n-h3 prefix="bar" align-text>{{ title ?? t('result') }}</n-h3>

  <DNSResultMetadata :result="result" />
  <DNSResultTable :result="result" style="margin: 1em 0 1em 0" />

  <n-collapse>
    <n-collapse-item :title="t('rawResult')" name="raw-result">
      <DNSRawResult :result="result" />
    </n-collapse-item>
  </n-collapse>
</template>

<script lang="ts" setup>
import { NCollapse, NCollapseItem, NH3 } from 'naive-ui'
import DNSRawResult from './DNSRawResult.vue'
import DNSResultMetadata from './DNSResultMetadata.vue'
import DNSResultTable from './DNSResultTable.vue'
import type { DNSJSONResponse } from '@utils/dns'
import { useI18n } from 'vue-i18n'

defineProps<{
  result: DNSJSONResponse
  title?: string
}>()

const { t } = useI18n()
</script>

<i18n lang="json">
{
  "en": {
    "result": "Result",
    "rawResult": "Raw Result"
  },
  "zh": {
    "result": "结果",
    "rawResult": "原始结果"
  },
  "zh-CN": {
    "result": "结果",
    "rawResult": "原始结果"
  },
  "zh-TW": {
    "result": "結果",
    "rawResult": "原始結果"
  },
  "zh-HK": {
    "result": "結果",
    "rawResult": "原始結果"
  },
  "es": {
    "result": "Resultado",
    "rawResult": "Resultado Sin Procesar"
  },
  "fr": {
    "result": "Résultat",
    "rawResult": "Résultat Brut"
  },
  "de": {
    "result": "Ergebnis",
    "rawResult": "Rohergebnis"
  },
  "it": {
    "result": "Risultato",
    "rawResult": "Risultato Grezzo"
  },
  "ja": {
    "result": "結果",
    "rawResult": "生の結果"
  },
  "ko": {
    "result": "결과",
    "rawResult": "원시 결과"
  },
  "ru": {
    "result": "Результат",
    "rawResult": "Необработанный Результат"
  },
  "pt": {
    "result": "Resultado",
    "rawResult": "Resultado Bruto"
  },
  "ar": {
    "result": "النتيجة",
    "rawResult": "النتيجة الخام"
  },
  "hi": {
    "result": "परिणाम",
    "rawResult": "कच्चा परिणाम"
  },
  "tr": {
    "result": "Sonuç",
    "rawResult": "Ham Sonuç"
  },
  "nl": {
    "result": "Resultaat",
    "rawResult": "Ruwe Resultaat"
  },
  "sv": {
    "result": "Resultat",
    "rawResult": "Råresultat"
  },
  "pl": {
    "result": "Wynik",
    "rawResult": "Surowy Wynik"
  },
  "vi": {
    "result": "Kết Quả",
    "rawResult": "Kết Quả Thô"
  },
  "th": {
    "result": "ผลลัพธ์",
    "rawResult": "ผลลัพธ์ดิบ"
  },
  "id": {
    "result": "Hasil",
    "rawResult": "Hasil Mentah"
  },
  "he": {
    "result": "תוצאה",
    "rawResult": "תוצאה גולמית"
  },
  "ms": {
    "result": "Keputusan",
    "rawResult": "Keputusan Mentah"
  },
  "no": {
    "result": "Resultat",
    "rawResult": "Råresultat"
  }
}
</i18n>
