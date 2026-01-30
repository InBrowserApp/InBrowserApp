<template>
  <ToolSectionHeader>{{ t('ipRange') }}</ToolSectionHeader>

  <ToolSection>
    <IPRangeInput @update:ip-range="ipRange = $event" />
  </ToolSection>

  <template v-if="ipRange[0] !== '' && ipRange[1] !== ''">
    <ToolSectionHeader>{{ t('cidrResult') }}</ToolSectionHeader>

    <ToolSection>
      <IPRangeCIDRResult :ip-range="ipRange" />
    </ToolSection>
  </template>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import IPRangeInput from './IPRangeInput.vue'
import IPRangeCIDRResult from './IPRangeCIDRResult.vue'
import { ToolSectionHeader, ToolSection } from '@shared/ui/tool'

const { t } = useI18n()
const ipRange = ref<[string, string]>(['', ''])
</script>

<i18n lang="json">
{
  "en": {
    "ipRange": "IP Range",
    "cidrResult": "CIDR Result"
  },
  "zh": {
    "ipRange": "IP 地址范围",
    "cidrResult": "CIDR 结果"
  },
  "zh-CN": {
    "ipRange": "IP 地址范围",
    "cidrResult": "CIDR 结果"
  },
  "zh-TW": {
    "ipRange": "IP 位址範圍",
    "cidrResult": "CIDR 結果"
  },
  "zh-HK": {
    "ipRange": "IP 位址範圍",
    "cidrResult": "CIDR 結果"
  },
  "es": {
    "ipRange": "Rango de IP",
    "cidrResult": "Resultado CIDR"
  },
  "fr": {
    "ipRange": "Plage d'IP",
    "cidrResult": "Résultat CIDR"
  },
  "de": {
    "ipRange": "IP-Bereich",
    "cidrResult": "CIDR-Ergebnis"
  },
  "it": {
    "ipRange": "Intervallo IP",
    "cidrResult": "Risultato CIDR"
  },
  "ja": {
    "ipRange": "IP レンジ",
    "cidrResult": "CIDR 結果"
  },
  "ko": {
    "ipRange": "IP 범위",
    "cidrResult": "CIDR 결과"
  },
  "ru": {
    "ipRange": "Диапазон IP",
    "cidrResult": "Результат CIDR"
  },
  "pt": {
    "ipRange": "Faixa de IP",
    "cidrResult": "Resultado CIDR"
  },
  "ar": {
    "ipRange": "نطاق IP",
    "cidrResult": "نتيجة CIDR"
  },
  "hi": {
    "ipRange": "IP रेंज",
    "cidrResult": "CIDR परिणाम"
  },
  "tr": {
    "ipRange": "IP Aralığı",
    "cidrResult": "CIDR Sonucu"
  },
  "nl": {
    "ipRange": "IP-bereik",
    "cidrResult": "CIDR-resultaat"
  },
  "sv": {
    "ipRange": "IP-intervall",
    "cidrResult": "CIDR-resultat"
  },
  "pl": {
    "ipRange": "Zakres IP",
    "cidrResult": "Wynik CIDR"
  },
  "vi": {
    "ipRange": "Dải IP",
    "cidrResult": "Kết quả CIDR"
  },
  "th": {
    "ipRange": "ช่วง IP",
    "cidrResult": "ผลลัพธ์ CIDR"
  },
  "id": {
    "ipRange": "Rentang IP",
    "cidrResult": "Hasil CIDR"
  },
  "he": {
    "ipRange": "טווח IP",
    "cidrResult": "תוצאת CIDR"
  },
  "ms": {
    "ipRange": "Julat IP",
    "cidrResult": "Keputusan CIDR"
  },
  "no": {
    "ipRange": "IP-område",
    "cidrResult": "CIDR-resultat"
  }
}
</i18n>
