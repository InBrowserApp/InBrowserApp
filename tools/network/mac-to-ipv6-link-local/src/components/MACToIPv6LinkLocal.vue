<template>
  <ToolSectionHeader>{{ t('macAddress') }}</ToolSectionHeader>
  <MACInput
    :mac="mac"
    :network-interface="networkInterface"
    @update:mac="mac = $event"
    @update:network-interface="networkInterface = $event"
  />
  <template v-if="mac !== ''">
    <ToolSectionHeader>{{ t('ipv6LinkLocalAddress') }}</ToolSectionHeader>
    <IPv6LinkLocalResult :mac="mac" :network-interface="networkInterface" />
  </template>
</template>

<script setup lang="ts">
import MACInput from './MACInput.vue'
import IPv6LinkLocalResult from './IPv6LinkLocalResult.vue'
import { randomMACAddress } from '@utils/mac-address'
import { useStorage } from '@vueuse/core'
import { ToolSectionHeader } from '@shared/ui/tool'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const mac = useStorage('tools:mac-to-ipv6-link-local:mac', randomMACAddress())
const networkInterface = useStorage('tools:mac-to-ipv6-link-local:network-interface', '')
</script>

<i18n lang="json">
{
  "en": {
    "macAddress": "MAC Address",
    "ipv6LinkLocalAddress": "IPv6 Link Local Address"
  },
  "zh": {
    "macAddress": "MAC 地址",
    "ipv6LinkLocalAddress": "IPv6 链路本地地址"
  },
  "zh-CN": {
    "macAddress": "MAC 地址",
    "ipv6LinkLocalAddress": "IPv6 链路本地地址"
  },
  "zh-TW": {
    "macAddress": "MAC 位址",
    "ipv6LinkLocalAddress": "IPv6 鏈路本地位址"
  },
  "zh-HK": {
    "macAddress": "MAC 位址",
    "ipv6LinkLocalAddress": "IPv6 鏈路本地位址"
  },
  "es": {
    "macAddress": "Dirección MAC",
    "ipv6LinkLocalAddress": "Dirección Local de Enlace IPv6"
  },
  "fr": {
    "macAddress": "Adresse MAC",
    "ipv6LinkLocalAddress": "Adresse Locale de Liaison IPv6"
  },
  "de": {
    "macAddress": "MAC-Adresse",
    "ipv6LinkLocalAddress": "IPv6-Link-Local-Adresse"
  },
  "it": {
    "macAddress": "Indirizzo MAC",
    "ipv6LinkLocalAddress": "Indirizzo Locale di Collegamento IPv6"
  },
  "ja": {
    "macAddress": "MAC アドレス",
    "ipv6LinkLocalAddress": "IPv6 リンクローカルアドレス"
  },
  "ko": {
    "macAddress": "MAC 주소",
    "ipv6LinkLocalAddress": "IPv6 링크 로컬 주소"
  },
  "ru": {
    "macAddress": "MAC-адрес",
    "ipv6LinkLocalAddress": "IPv6 локальный адрес канала"
  },
  "pt": {
    "macAddress": "Endereço MAC",
    "ipv6LinkLocalAddress": "Endereço Local de Link IPv6"
  },
  "ar": {
    "macAddress": "عنوان MAC",
    "ipv6LinkLocalAddress": "عنوان IPv6 المحلي للرابط"
  },
  "hi": {
    "macAddress": "MAC पता",
    "ipv6LinkLocalAddress": "IPv6 लिंक स्थानीय पता"
  },
  "tr": {
    "macAddress": "MAC Adresi",
    "ipv6LinkLocalAddress": "IPv6 Bağlantı Yerel Adresi"
  },
  "nl": {
    "macAddress": "MAC-adres",
    "ipv6LinkLocalAddress": "IPv6 Link-Local Adres"
  },
  "sv": {
    "macAddress": "MAC-adress",
    "ipv6LinkLocalAddress": "IPv6 Länk-Lokal Adress"
  },
  "pl": {
    "macAddress": "Adres MAC",
    "ipv6LinkLocalAddress": "Adres Lokalny Łącza IPv6"
  },
  "vi": {
    "macAddress": "Địa chỉ MAC",
    "ipv6LinkLocalAddress": "Địa chỉ Local Link IPv6"
  },
  "th": {
    "macAddress": "ที่อยู่ MAC",
    "ipv6LinkLocalAddress": "ที่อยู่ Local Link IPv6"
  },
  "id": {
    "macAddress": "Alamat MAC",
    "ipv6LinkLocalAddress": "Alamat Link Lokal IPv6"
  },
  "he": {
    "macAddress": "כתובת MAC",
    "ipv6LinkLocalAddress": "כתובת קישור מקומית IPv6"
  },
  "ms": {
    "macAddress": "Alamat MAC",
    "ipv6LinkLocalAddress": "Alamat Pautan Tempatan IPv6"
  },
  "no": {
    "macAddress": "MAC-adresse",
    "ipv6LinkLocalAddress": "IPv6 Link-Lokal Adresse"
  }
}
</i18n>
