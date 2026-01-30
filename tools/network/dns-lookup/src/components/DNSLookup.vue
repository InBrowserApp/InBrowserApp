<template>
  <DNSQuery @update:results="results = $event" />

  <n-p v-for="result in results" :key="result.question.type">
    <DNSResult v-if="result.result" :result="result.result" :title="result.question.type" />
  </n-p>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import DNSQuery from './query/DNSQuery.vue'
import { DNSResult } from '@shared/ui/domain/domain'
import type { DNSJSONResponse } from '@utils/dns'
import { NP } from 'naive-ui'

const results = ref<{ question: { name: string; type: string }; result: DNSJSONResponse }[] | null>(
  null,
)
</script>
