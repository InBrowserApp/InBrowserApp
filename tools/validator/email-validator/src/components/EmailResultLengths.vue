<template>
  <NDescriptions :column="1" bordered label-placement="left">
    <NDescriptionsItem :label="t('length')">
      <NText depth="3">{{ length }}</NText>
    </NDescriptionsItem>
    <NDescriptionsItem :label="t('localLength')">
      <NText depth="3">{{ localLength }}</NText>
    </NDescriptionsItem>
    <NDescriptionsItem :label="t('domainLength')">
      <NText depth="3">{{ domainLength }}</NText>
    </NDescriptionsItem>
  </NDescriptions>
</template>

<script setup lang="ts">
import { NDescriptions, NDescriptionsItem, NText } from 'naive-ui'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

defineProps<{
  length: string
  localLength: string
  domainLength: string
}>()
</script>

<i18n lang="json">
{
  "en": {
    "length": "Total Length",
    "localLength": "Local Length",
    "domainLength": "Domain Length"
  },
  "zh": {
    "length": "总长度",
    "localLength": "本地长度",
    "domainLength": "域名长度"
  },
  "zh-CN": {
    "length": "总长度",
    "localLength": "本地长度",
    "domainLength": "域名长度"
  },
  "zh-TW": {
    "length": "總長度",
    "localLength": "本地長度",
    "domainLength": "網域長度"
  },
  "zh-HK": {
    "length": "總長度",
    "localLength": "本地長度",
    "domainLength": "網域長度"
  },
  "es": {
    "length": "Longitud total",
    "localLength": "Longitud local",
    "domainLength": "Longitud del dominio"
  },
  "fr": {
    "length": "Longueur totale",
    "localLength": "Longueur locale",
    "domainLength": "Longueur du domaine"
  },
  "de": {
    "length": "Gesamtlänge",
    "localLength": "Lokale Länge",
    "domainLength": "Domainlänge"
  },
  "it": {
    "length": "Lunghezza totale",
    "localLength": "Lunghezza locale",
    "domainLength": "Lunghezza dominio"
  },
  "ja": {
    "length": "合計長",
    "localLength": "ローカル長",
    "domainLength": "ドメイン長"
  },
  "ko": {
    "length": "전체 길이",
    "localLength": "로컬 길이",
    "domainLength": "도메인 길이"
  },
  "ru": {
    "length": "Общая длина",
    "localLength": "Длина локальной части",
    "domainLength": "Длина домена"
  },
  "pt": {
    "length": "Comprimento total",
    "localLength": "Comprimento local",
    "domainLength": "Comprimento do domínio"
  },
  "ar": {
    "length": "الطول الكلي",
    "localLength": "طول الجزء المحلي",
    "domainLength": "طول النطاق"
  },
  "hi": {
    "length": "कुल लंबाई",
    "localLength": "लोकल लंबाई",
    "domainLength": "डोमेन लंबाई"
  },
  "tr": {
    "length": "Toplam uzunluk",
    "localLength": "Yerel uzunluk",
    "domainLength": "Alan adı uzunluğu"
  },
  "nl": {
    "length": "Totale lengte",
    "localLength": "Lokale lengte",
    "domainLength": "Domeinlengte"
  },
  "sv": {
    "length": "Total längd",
    "localLength": "Lokal längd",
    "domainLength": "Domänlängd"
  },
  "pl": {
    "length": "Łączna długość",
    "localLength": "Długość części lokalnej",
    "domainLength": "Długość domeny"
  },
  "vi": {
    "length": "Tổng độ dài",
    "localLength": "Độ dài phần cục bộ",
    "domainLength": "Độ dài tên miền"
  },
  "th": {
    "length": "ความยาวรวม",
    "localLength": "ความยาวส่วนโลคัล",
    "domainLength": "ความยาวโดเมน"
  },
  "id": {
    "length": "Panjang total",
    "localLength": "Panjang lokal",
    "domainLength": "Panjang domain"
  },
  "he": {
    "length": "אורך כולל",
    "localLength": "אורך החלק המקומי",
    "domainLength": "אורך הדומיין"
  },
  "ms": {
    "length": "Panjang keseluruhan",
    "localLength": "Panjang lokal",
    "domainLength": "Panjang domain"
  },
  "no": {
    "length": "Total lengde",
    "localLength": "Lokal lengde",
    "domainLength": "Domenelengde"
  }
}
</i18n>
