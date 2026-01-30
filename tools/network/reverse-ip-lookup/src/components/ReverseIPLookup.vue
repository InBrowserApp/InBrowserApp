<template>
  <DNSQuery @update:result="result = $event" />

  <DNSResult v-if="result" :result="result" />
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import DNSQuery from './query/DNSQuery.vue'
import { DNSResult } from '@shared/ui/domain/domain'
import type { DNSJSONResponse } from '@utils/dns'

const result = ref<DNSJSONResponse | null>(null)
</script>
