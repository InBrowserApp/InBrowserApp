<template>
  <ToolSectionHeader>{{ t('cidrsToMerge') }}</ToolSectionHeader>
  <CIDRsInput @update:cidrs="cidrsToMerge = $event" />
  <ToolSectionHeader>{{ t('cidrsToExclude') }}</ToolSectionHeader>
  <CIDRsInput @update:cidrs="cidrsToExclude = $event" />
  <template
    v-if="cidrsToMerge && cidrsToExclude && cidrsToMerge.length + cidrsToExclude.length > 1"
  >
    <ToolSectionHeader>{{ t('mergeAndExcludeResult') }}</ToolSectionHeader>
    <CIDRsMergeExcludeResult
      v-if="cidrsToMerge && cidrsToExclude"
      :cidrs-to-merge="cidrsToMerge"
      :cidrs-to-exclude="cidrsToExclude"
    />
  </template>
</template>

<script setup lang="ts">
import CIDRsInput from './CIDRsInput.vue'
import { ref } from 'vue'
import CIDRsMergeExcludeResult from './CIDRsMergeExcludeResult.vue'
import { ToolSectionHeader } from '@shared/ui/tool'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const cidrsToMerge = ref<string[] | undefined>([])
const cidrsToExclude = ref<string[] | undefined>([])
</script>

<i18n lang="json">
{
  "en": {
    "cidrsToMerge": "CIDRs to Merge",
    "cidrsToExclude": "CIDRs to Exclude",
    "mergeAndExcludeResult": "Merge And Exclude Result"
  },
  "zh": {
    "cidrsToMerge": "要合并的 CIDR",
    "cidrsToExclude": "要排除的 CIDR",
    "mergeAndExcludeResult": "合并和排除结果"
  },
  "zh-CN": {
    "cidrsToMerge": "要合并的 CIDR",
    "cidrsToExclude": "要排除的 CIDR",
    "mergeAndExcludeResult": "合并和排除结果"
  },
  "zh-TW": {
    "cidrsToMerge": "要合併的 CIDR",
    "cidrsToExclude": "要排除的 CIDR",
    "mergeAndExcludeResult": "合併和排除結果"
  },
  "zh-HK": {
    "cidrsToMerge": "要合併的 CIDR",
    "cidrsToExclude": "要排除的 CIDR",
    "mergeAndExcludeResult": "合併和排除結果"
  },
  "es": {
    "cidrsToMerge": "CIDRs a Fusionar",
    "cidrsToExclude": "CIDRs a Excluir",
    "mergeAndExcludeResult": "Resultado de Fusión y Exclusión"
  },
  "fr": {
    "cidrsToMerge": "CIDRs à Fusionner",
    "cidrsToExclude": "CIDRs à Exclure",
    "mergeAndExcludeResult": "Résultat de Fusion et d'Exclusion"
  },
  "de": {
    "cidrsToMerge": "CIDRs zum Zusammenführen",
    "cidrsToExclude": "CIDRs zum Ausschließen",
    "mergeAndExcludeResult": "Zusammenführungs- und Ausschlussergebnis"
  },
  "it": {
    "cidrsToMerge": "CIDR da Unire",
    "cidrsToExclude": "CIDR da Escludere",
    "mergeAndExcludeResult": "Risultato di Unione ed Esclusione"
  },
  "ja": {
    "cidrsToMerge": "マージする CIDR",
    "cidrsToExclude": "除外する CIDR",
    "mergeAndExcludeResult": "マージと除外の結果"
  },
  "ko": {
    "cidrsToMerge": "병합할 CIDR",
    "cidrsToExclude": "제외할 CIDR",
    "mergeAndExcludeResult": "병합 및 제외 결과"
  },
  "ru": {
    "cidrsToMerge": "CIDR для Объединения",
    "cidrsToExclude": "CIDR для Исключения",
    "mergeAndExcludeResult": "Результат Объединения и Исключения"
  },
  "pt": {
    "cidrsToMerge": "CIDRs para Mesclar",
    "cidrsToExclude": "CIDRs para Excluir",
    "mergeAndExcludeResult": "Resultado de Mesclagem e Exclusão"
  },
  "ar": {
    "cidrsToMerge": "CIDRs للدمج",
    "cidrsToExclude": "CIDRs للاستبعاد",
    "mergeAndExcludeResult": "نتيجة الدمج والاستبعاد"
  },
  "hi": {
    "cidrsToMerge": "मर्ज करने के लिए CIDR",
    "cidrsToExclude": "बाहर करने के लिए CIDR",
    "mergeAndExcludeResult": "मर्ज और बहिष्करण परिणाम"
  },
  "tr": {
    "cidrsToMerge": "Birleştirilecek CIDR'lar",
    "cidrsToExclude": "Hariç Tutulacak CIDR'lar",
    "mergeAndExcludeResult": "Birleştirme ve Hariç Tutma Sonucu"
  },
  "nl": {
    "cidrsToMerge": "CIDRs om Samen te Voegen",
    "cidrsToExclude": "CIDRs om Uit te Sluiten",
    "mergeAndExcludeResult": "Samenvoeg- en Uitsluitingsresultaat"
  },
  "sv": {
    "cidrsToMerge": "CIDRs att Slå Samman",
    "cidrsToExclude": "CIDRs att Utesluta",
    "mergeAndExcludeResult": "Sammanslagnings- och Uteslutningsresultat"
  },
  "pl": {
    "cidrsToMerge": "CIDR do Scalenia",
    "cidrsToExclude": "CIDR do Wykluczenia",
    "mergeAndExcludeResult": "Wynik Scalania i Wykluczenia"
  },
  "vi": {
    "cidrsToMerge": "CIDR để Gộp",
    "cidrsToExclude": "CIDR để Loại Trừ",
    "mergeAndExcludeResult": "Kết Quả Gộp và Loại Trừ"
  },
  "th": {
    "cidrsToMerge": "CIDR ที่จะรวม",
    "cidrsToExclude": "CIDR ที่จะยกเว้น",
    "mergeAndExcludeResult": "ผลลัพธ์การรวมและยกเว้น"
  },
  "id": {
    "cidrsToMerge": "CIDR untuk Digabung",
    "cidrsToExclude": "CIDR untuk Dikecualikan",
    "mergeAndExcludeResult": "Hasil Penggabungan dan Pengecualian"
  },
  "he": {
    "cidrsToMerge": "CIDR לאיחוד",
    "cidrsToExclude": "CIDR להחרגה",
    "mergeAndExcludeResult": "תוצאת איחוד והחרגה"
  },
  "ms": {
    "cidrsToMerge": "CIDR untuk Digabungkan",
    "cidrsToExclude": "CIDR untuk Dikecualikan",
    "mergeAndExcludeResult": "Hasil Penggabungan dan Pengecualian"
  },
  "no": {
    "cidrsToMerge": "CIDRer å Slå Sammen",
    "cidrsToExclude": "CIDRer å Ekskludere",
    "mergeAndExcludeResult": "Sammenslåings- og Ekskluderingsresultat"
  }
}
</i18n>
