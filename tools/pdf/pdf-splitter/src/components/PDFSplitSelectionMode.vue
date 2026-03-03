<template>
  <n-flex vertical :size="6">
    <n-text strong>{{ t('outputMode') }}</n-text>
    <n-radio-group :value="outputMode" @update:value="emit('update:output-mode', $event)">
      <n-space vertical>
        <n-radio value="single">{{ t('modeSingle') }}</n-radio>
        <n-radio value="multiple">{{ t('modeMultiple') }}</n-radio>
      </n-space>
    </n-radio-group>
  </n-flex>

  <n-flex v-if="outputMode === 'multiple'" vertical :size="6">
    <n-text strong>{{ t('splitStrategy') }}</n-text>
    <n-radio-group :value="multipleMode" @update:value="emit('update:multiple-mode', $event)">
      <n-space vertical>
        <n-radio value="ranges">{{ t('strategyRanges') }}</n-radio>
        <n-radio value="pages">{{ t('strategyPages') }}</n-radio>
      </n-space>
    </n-radio-group>
  </n-flex>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { NFlex, NRadio, NRadioGroup, NSpace, NText } from 'naive-ui'
import type { SplitMultipleMode, SplitOutputMode } from '../split-pdf.worker'

defineProps<{
  outputMode: SplitOutputMode
  multipleMode: SplitMultipleMode
}>()

const emit = defineEmits<{
  (event: 'update:output-mode', value: SplitOutputMode): void
  (event: 'update:multiple-mode', value: SplitMultipleMode): void
}>()

const { t } = useI18n({ useScope: 'local' })
</script>

<i18n lang="json">
{
  "en": {
    "outputMode": "Output mode",
    "modeSingle": "Extract to one PDF",
    "modeMultiple": "Split to multiple PDFs",
    "splitStrategy": "Split strategy",
    "strategyRanges": "Split by range segments",
    "strategyPages": "Split by single page"
  },
  "zh": {
    "outputMode": "输出模式",
    "modeSingle": "提取为一个 PDF",
    "modeMultiple": "拆分为多个 PDF",
    "splitStrategy": "拆分策略",
    "strategyRanges": "按范围段拆分",
    "strategyPages": "按单页拆分"
  },
  "zh-CN": {
    "outputMode": "输出模式",
    "modeSingle": "提取为一个 PDF",
    "modeMultiple": "拆分为多个 PDF",
    "splitStrategy": "拆分策略",
    "strategyRanges": "按范围段拆分",
    "strategyPages": "按单页拆分"
  },
  "zh-TW": {
    "outputMode": "輸出模式",
    "modeSingle": "擷取為單一 PDF",
    "modeMultiple": "拆分為多個 PDF",
    "splitStrategy": "拆分策略",
    "strategyRanges": "依範圍段拆分",
    "strategyPages": "依單頁拆分"
  },
  "zh-HK": {
    "outputMode": "輸出模式",
    "modeSingle": "擷取為單一 PDF",
    "modeMultiple": "拆分為多個 PDF",
    "splitStrategy": "拆分策略",
    "strategyRanges": "依範圍段拆分",
    "strategyPages": "依單頁拆分"
  },
  "es": {
    "outputMode": "Modo de salida",
    "modeSingle": "Extraer a un PDF",
    "modeMultiple": "Dividir en varios PDF",
    "splitStrategy": "Estrategia de división",
    "strategyRanges": "Dividir por segmentos de rango",
    "strategyPages": "Dividir por página individual"
  },
  "fr": {
    "outputMode": "Mode de sortie",
    "modeSingle": "Extraire en un seul PDF",
    "modeMultiple": "Diviser en plusieurs PDF",
    "splitStrategy": "Stratégie de division",
    "strategyRanges": "Diviser par segments de plage",
    "strategyPages": "Diviser par page"
  },
  "de": {
    "outputMode": "Ausgabemodus",
    "modeSingle": "In eine PDF extrahieren",
    "modeMultiple": "In mehrere PDFs aufteilen",
    "splitStrategy": "Aufteilungsstrategie",
    "strategyRanges": "Nach Bereichssegmenten aufteilen",
    "strategyPages": "Nach einzelnen Seiten aufteilen"
  },
  "it": {
    "outputMode": "Modalità di output",
    "modeSingle": "Estrai in un PDF",
    "modeMultiple": "Dividi in più PDF",
    "splitStrategy": "Strategia di divisione",
    "strategyRanges": "Dividi per segmenti di intervallo",
    "strategyPages": "Dividi per singola pagina"
  },
  "ja": {
    "outputMode": "出力モード",
    "modeSingle": "1 つの PDF に抽出",
    "modeMultiple": "複数の PDF に分割",
    "splitStrategy": "分割方式",
    "strategyRanges": "範囲セグメントで分割",
    "strategyPages": "ページ単位で分割"
  },
  "ko": {
    "outputMode": "출력 모드",
    "modeSingle": "하나의 PDF로 추출",
    "modeMultiple": "여러 PDF로 분할",
    "splitStrategy": "분할 방식",
    "strategyRanges": "범위 구간으로 분할",
    "strategyPages": "단일 페이지로 분할"
  },
  "ru": {
    "outputMode": "Режим вывода",
    "modeSingle": "Извлечь в один PDF",
    "modeMultiple": "Разделить на несколько PDF",
    "splitStrategy": "Стратегия разделения",
    "strategyRanges": "Делить по сегментам диапазонов",
    "strategyPages": "Делить по отдельным страницам"
  },
  "pt": {
    "outputMode": "Modo de saída",
    "modeSingle": "Extrair para um PDF",
    "modeMultiple": "Dividir em vários PDFs",
    "splitStrategy": "Estratégia de divisão",
    "strategyRanges": "Dividir por segmentos de intervalo",
    "strategyPages": "Dividir por página única"
  },
  "ar": {
    "outputMode": "وضع الإخراج",
    "modeSingle": "استخراج إلى PDF واحد",
    "modeMultiple": "تقسيم إلى عدة ملفات PDF",
    "splitStrategy": "استراتيجية التقسيم",
    "strategyRanges": "تقسيم حسب مقاطع النطاق",
    "strategyPages": "تقسيم حسب كل صفحة"
  },
  "hi": {
    "outputMode": "आउटपुट मोड",
    "modeSingle": "एक PDF में निकालें",
    "modeMultiple": "कई PDF में विभाजित करें",
    "splitStrategy": "विभाजन रणनीति",
    "strategyRanges": "रेंज सेगमेंट के अनुसार विभाजित करें",
    "strategyPages": "एक-एक पेज के अनुसार विभाजित करें"
  },
  "tr": {
    "outputMode": "Çıktı modu",
    "modeSingle": "Tek PDF olarak çıkar",
    "modeMultiple": "Birden çok PDF'e böl",
    "splitStrategy": "Bölme stratejisi",
    "strategyRanges": "Aralık segmentlerine göre böl",
    "strategyPages": "Tek tek sayfaya göre böl"
  },
  "nl": {
    "outputMode": "Uitvoermodus",
    "modeSingle": "Naar één PDF extraheren",
    "modeMultiple": "Splitsen naar meerdere PDF's",
    "splitStrategy": "Splitsstrategie",
    "strategyRanges": "Splitsen op bereiksegmenten",
    "strategyPages": "Splitsen per losse pagina"
  },
  "sv": {
    "outputMode": "Utdatamodus",
    "modeSingle": "Extrahera till en PDF",
    "modeMultiple": "Dela till flera PDF:er",
    "splitStrategy": "Delningsstrategi",
    "strategyRanges": "Dela efter intervallsegment",
    "strategyPages": "Dela per enskild sida"
  },
  "pl": {
    "outputMode": "Tryb wyjścia",
    "modeSingle": "Wyodrębnij do jednego PDF",
    "modeMultiple": "Podziel na wiele PDF",
    "splitStrategy": "Strategia podziału",
    "strategyRanges": "Dziel według segmentów zakresu",
    "strategyPages": "Dziel według pojedynczych stron"
  },
  "vi": {
    "outputMode": "Chế độ đầu ra",
    "modeSingle": "Trích xuất thành một PDF",
    "modeMultiple": "Tách thành nhiều PDF",
    "splitStrategy": "Chiến lược tách",
    "strategyRanges": "Tách theo từng đoạn dải",
    "strategyPages": "Tách theo từng trang"
  },
  "th": {
    "outputMode": "โหมดผลลัพธ์",
    "modeSingle": "แยกเป็น PDF เดียว",
    "modeMultiple": "แยกเป็นหลาย PDF",
    "splitStrategy": "กลยุทธ์การแยก",
    "strategyRanges": "แยกตามช่วงที่ระบุ",
    "strategyPages": "แยกตามหน้าเดี่ยว"
  },
  "id": {
    "outputMode": "Mode keluaran",
    "modeSingle": "Ekstrak ke satu PDF",
    "modeMultiple": "Bagi ke beberapa PDF",
    "splitStrategy": "Strategi pemisahan",
    "strategyRanges": "Pisah berdasarkan segmen rentang",
    "strategyPages": "Pisah per halaman tunggal"
  },
  "he": {
    "outputMode": "מצב פלט",
    "modeSingle": "חלץ ל-PDF אחד",
    "modeMultiple": "פצל למספר קובצי PDF",
    "splitStrategy": "אסטרטגיית פיצול",
    "strategyRanges": "פיצול לפי מקטעי טווח",
    "strategyPages": "פיצול לפי עמוד בודד"
  },
  "ms": {
    "outputMode": "Mod output",
    "modeSingle": "Ekstrak ke satu PDF",
    "modeMultiple": "Pisah kepada beberapa PDF",
    "splitStrategy": "Strategi pemisahan",
    "strategyRanges": "Pisah mengikut segmen julat",
    "strategyPages": "Pisah mengikut halaman tunggal"
  },
  "no": {
    "outputMode": "Utdatamodus",
    "modeSingle": "Trekk ut til én PDF",
    "modeMultiple": "Del opp i flere PDF-er",
    "splitStrategy": "Delingsstrategi",
    "strategyRanges": "Del etter intervallsegmenter",
    "strategyPages": "Del etter enkeltsider"
  }
}
</i18n>
