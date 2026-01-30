<template>
  <ToolSectionHeader>{{ t('query') }}</ToolSectionHeader>

  <IPInputFormItem v-model:ip="ip" />
  <DOHServerSelectFormItem v-model:value="dohServer" />

  <n-button round :loading="loading" @click="lookup">
    <template #icon>
      <n-icon>
        <DocumentSearch16Regular />
      </n-icon>
    </template>
    {{ t('lookup') }}
  </n-button>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { DOHServerSelectFormItem } from '@shared/ui/domain/domain'
import { NButton, NIcon } from 'naive-ui'
import { makeDOHQuery } from '@utils/dns'
import type { DNSJSONResponse } from '@utils/dns'
import DocumentSearch16Regular from '@vicons/fluent/DocumentSearch16Regular'
import { ReverseIPDomain } from '@utils/dns'
import { useStorage } from '@vueuse/core'
import { IPInputFormItem } from '@shared/ui/domain/ip'
import { ToolSectionHeader } from '@shared/ui/tool'
import { useI18n } from 'vue-i18n'

const emit = defineEmits<{
  'update:result': [DNSJSONResponse]
}>()
const ip = useStorage('reverse-ip-lookup-ip', '1.1.1.1')
const dohServer = useStorage('doh-server', 'https://cloudflare-dns.com/dns-query')
const loading = ref(false)

const { t } = useI18n()

async function lookup() {
  loading.value = true
  try {
    const reverseIPDomain = ReverseIPDomain(ip.value)
    const response = await makeDOHQuery(dohServer.value, {
      name: reverseIPDomain,
      type: 'PTR',
    })
    emit('update:result', response)
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}
</script>

<i18n lang="json">
{
  "en": {
    "query": "Query",
    "lookup": "Lookup"
  },
  "zh": {
    "query": "查询",
    "lookup": "查询"
  },
  "zh-CN": {
    "query": "查询",
    "lookup": "查询"
  },
  "zh-TW": {
    "query": "查詢",
    "lookup": "查詢"
  },
  "zh-HK": {
    "query": "查詢",
    "lookup": "查詢"
  },
  "es": {
    "query": "Consulta",
    "lookup": "Buscar"
  },
  "fr": {
    "query": "Requête",
    "lookup": "Rechercher"
  },
  "de": {
    "query": "Abfrage",
    "lookup": "Nachschlagen"
  },
  "it": {
    "query": "Query",
    "lookup": "Cerca"
  },
  "ja": {
    "query": "クエリ",
    "lookup": "検索"
  },
  "ko": {
    "query": "쿼리",
    "lookup": "조회"
  },
  "ru": {
    "query": "Запрос",
    "lookup": "Поиск"
  },
  "pt": {
    "query": "Consulta",
    "lookup": "Pesquisar"
  },
  "ar": {
    "query": "الاستعلام",
    "lookup": "البحث"
  },
  "hi": {
    "query": "क्वेरी",
    "lookup": "खोजें"
  },
  "tr": {
    "query": "Sorgu",
    "lookup": "Arama"
  },
  "nl": {
    "query": "Query",
    "lookup": "Opzoeken"
  },
  "sv": {
    "query": "Fråga",
    "lookup": "Slå upp"
  },
  "pl": {
    "query": "Zapytanie",
    "lookup": "Wyszukaj"
  },
  "vi": {
    "query": "Truy vấn",
    "lookup": "Tra cứu"
  },
  "th": {
    "query": "คำค้นหา",
    "lookup": "ค้นหา"
  },
  "id": {
    "query": "Kueri",
    "lookup": "Cari"
  },
  "he": {
    "query": "שאילתה",
    "lookup": "חיפוש"
  },
  "ms": {
    "query": "Pertanyaan",
    "lookup": "Cari"
  },
  "no": {
    "query": "Spørring",
    "lookup": "Slå opp"
  }
}
</i18n>
