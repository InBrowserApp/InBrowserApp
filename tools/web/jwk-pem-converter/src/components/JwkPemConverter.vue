<template>
  <n-tabs v-model:value="activeTab" type="line" animated>
    <n-tab-pane name="jwk" :tab="t('tabJwkToPem')" display-directive="show">
      <JwkPemJwkPanel />
    </n-tab-pane>
    <n-tab-pane name="pem" :tab="t('tabPemToJwk')" display-directive="show">
      <JwkPemPemPanel />
    </n-tab-pane>
  </n-tabs>
</template>

<script setup lang="ts">
import { NTabPane, NTabs } from 'naive-ui'
import { useStorage } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import JwkPemJwkPanel from './JwkPemJwkPanel.vue'
import JwkPemPemPanel from './JwkPemPemPanel.vue'

const { t } = useI18n()

const activeTab = useStorage('tools:jwk-pem-converter:tab', 'jwk')
</script>

<i18n lang="json">
{
  "en": {
    "tabJwkToPem": "JWK → PEM",
    "tabPemToJwk": "PEM → JWK"
  },
  "zh": {
    "tabJwkToPem": "JWK → PEM",
    "tabPemToJwk": "PEM → JWK"
  },
  "zh-CN": {
    "tabJwkToPem": "JWK → PEM",
    "tabPemToJwk": "PEM → JWK"
  },
  "zh-TW": {
    "tabJwkToPem": "JWK → PEM",
    "tabPemToJwk": "PEM → JWK"
  },
  "zh-HK": {
    "tabJwkToPem": "JWK → PEM",
    "tabPemToJwk": "PEM → JWK"
  },
  "es": {
    "tabJwkToPem": "JWK → PEM",
    "tabPemToJwk": "PEM → JWK"
  },
  "fr": {
    "tabJwkToPem": "JWK → PEM",
    "tabPemToJwk": "PEM → JWK"
  },
  "de": {
    "tabJwkToPem": "JWK → PEM",
    "tabPemToJwk": "PEM → JWK"
  },
  "it": {
    "tabJwkToPem": "JWK → PEM",
    "tabPemToJwk": "PEM → JWK"
  },
  "ja": {
    "tabJwkToPem": "JWK → PEM",
    "tabPemToJwk": "PEM → JWK"
  },
  "ko": {
    "tabJwkToPem": "JWK → PEM",
    "tabPemToJwk": "PEM → JWK"
  },
  "ru": {
    "tabJwkToPem": "JWK → PEM",
    "tabPemToJwk": "PEM → JWK"
  },
  "pt": {
    "tabJwkToPem": "JWK → PEM",
    "tabPemToJwk": "PEM → JWK"
  },
  "ar": {
    "tabJwkToPem": "JWK → PEM",
    "tabPemToJwk": "PEM → JWK"
  },
  "hi": {
    "tabJwkToPem": "JWK → PEM",
    "tabPemToJwk": "PEM → JWK"
  },
  "tr": {
    "tabJwkToPem": "JWK → PEM",
    "tabPemToJwk": "PEM → JWK"
  },
  "nl": {
    "tabJwkToPem": "JWK → PEM",
    "tabPemToJwk": "PEM → JWK"
  },
  "sv": {
    "tabJwkToPem": "JWK → PEM",
    "tabPemToJwk": "PEM → JWK"
  },
  "pl": {
    "tabJwkToPem": "JWK → PEM",
    "tabPemToJwk": "PEM → JWK"
  },
  "vi": {
    "tabJwkToPem": "JWK → PEM",
    "tabPemToJwk": "PEM → JWK"
  },
  "th": {
    "tabJwkToPem": "JWK → PEM",
    "tabPemToJwk": "PEM → JWK"
  },
  "id": {
    "tabJwkToPem": "JWK → PEM",
    "tabPemToJwk": "PEM → JWK"
  },
  "he": {
    "tabJwkToPem": "JWK → PEM",
    "tabPemToJwk": "PEM → JWK"
  },
  "ms": {
    "tabJwkToPem": "JWK → PEM",
    "tabPemToJwk": "PEM → JWK"
  },
  "no": {
    "tabJwkToPem": "JWK → PEM",
    "tabPemToJwk": "PEM → JWK"
  }
}
</i18n>
