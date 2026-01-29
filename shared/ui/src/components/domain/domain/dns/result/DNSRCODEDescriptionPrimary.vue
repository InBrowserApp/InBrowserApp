<template>
  <DNSRCODEDescriptionMid v-if="isMid" :rcode="rcode" />
  <DNSRCODEDescriptionLow v-else :rcode="rcode" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import DNSRCODEDescriptionLow from './DNSRCODEDescriptionLow.vue'
import DNSRCODEDescriptionMid from './DNSRCODEDescriptionMid.vue'

const props = defineProps<{
  rcode: number
}>()

const isMid = computed(() => props.rcode >= 6)
</script>

<i18n lang="json">
{
  "en": {},
  "zh": {},
  "zh-CN": {},
  "zh-TW": {},
  "zh-HK": {},
  "es": {},
  "fr": {},
  "de": {},
  "it": {},
  "ja": {},
  "ko": {},
  "ru": {},
  "pt": {},
  "ar": {},
  "hi": {},
  "tr": {},
  "nl": {},
  "sv": {},
  "pl": {},
  "vi": {},
  "th": {},
  "id": {},
  "he": {},
  "ms": {},
  "no": {}
}
</i18n>
