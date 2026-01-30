<template>
  <ToolSectionHeader>{{ t('ipv6Address') }}</ToolSectionHeader>
  <ToolSection>
    <IPv6Input :ipv6="ipv6" @update:ipv6="ipv6 = $event" />
  </ToolSection>
  <template v-if="ipv6 !== ''">
    <ToolSectionHeader>{{ t('macAddress') }}</ToolSectionHeader>
    <ToolSection>
      <MacResult :ipv6="ipv6" />
    </ToolSection>
  </template>
</template>

<script setup lang="ts">
import IPv6Input from './IPv6Input.vue'
import MacResult from './MacResult.vue'
import { useStorage } from '@vueuse/core'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const ipv6 = useStorage('tools:ipv6-to-mac:ipv6', '')
</script>

<i18n lang="json">
{
  "en": {
    "ipv6Address": "IPv6 Address",
    "macAddress": "MAC Address"
  },
  "zh": {
    "ipv6Address": "IPv6 地址",
    "macAddress": "MAC 地址"
  },
  "zh-CN": {
    "ipv6Address": "IPv6 地址",
    "macAddress": "MAC 地址"
  },
  "zh-TW": {
    "ipv6Address": "IPv6 位址",
    "macAddress": "MAC 位址"
  },
  "zh-HK": {
    "ipv6Address": "IPv6 位址",
    "macAddress": "MAC 位址"
  },
  "es": {
    "ipv6Address": "Dirección IPv6",
    "macAddress": "Dirección MAC"
  },
  "fr": {
    "ipv6Address": "Adresse IPv6",
    "macAddress": "Adresse MAC"
  },
  "de": {
    "ipv6Address": "IPv6-Adresse",
    "macAddress": "MAC-Adresse"
  },
  "it": {
    "ipv6Address": "Indirizzo IPv6",
    "macAddress": "Indirizzo MAC"
  },
  "ja": {
    "ipv6Address": "IPv6 アドレス",
    "macAddress": "MAC アドレス"
  },
  "ko": {
    "ipv6Address": "IPv6 주소",
    "macAddress": "MAC 주소"
  },
  "ru": {
    "ipv6Address": "IPv6 адрес",
    "macAddress": "MAC адрес"
  },
  "pt": {
    "ipv6Address": "Endereço IPv6",
    "macAddress": "Endereço MAC"
  },
  "ar": {
    "ipv6Address": "عنوان IPv6",
    "macAddress": "عنوان MAC"
  },
  "hi": {
    "ipv6Address": "IPv6 पता",
    "macAddress": "MAC पता"
  },
  "tr": {
    "ipv6Address": "IPv6 Adresi",
    "macAddress": "MAC Adresi"
  },
  "nl": {
    "ipv6Address": "IPv6-adres",
    "macAddress": "MAC-adres"
  },
  "sv": {
    "ipv6Address": "IPv6-adress",
    "macAddress": "MAC-adress"
  },
  "pl": {
    "ipv6Address": "Adres IPv6",
    "macAddress": "Adres MAC"
  },
  "vi": {
    "ipv6Address": "Địa chỉ IPv6",
    "macAddress": "Địa chỉ MAC"
  },
  "th": {
    "ipv6Address": "ที่อยู่ IPv6",
    "macAddress": "ที่อยู่ MAC"
  },
  "id": {
    "ipv6Address": "Alamat IPv6",
    "macAddress": "Alamat MAC"
  },
  "he": {
    "ipv6Address": "כתובת IPv6",
    "macAddress": "כתובת MAC"
  },
  "ms": {
    "ipv6Address": "Alamat IPv6",
    "macAddress": "Alamat MAC"
  },
  "no": {
    "ipv6Address": "IPv6-adresse",
    "macAddress": "MAC-adresse"
  }
}
</i18n>
