<template>
  <JmesPathInputs
    v-model:json-text="jsonText"
    v-model:query-text="queryText"
    :example-options="exampleOptions"
    :json-status="jsonStatus"
    :json-error-message="jsonErrorMessage"
    :query-status="queryStatus"
    :query-error-message="queryErrorMessage"
    :import-from-file="importFromFile"
    :format-json="formatJson"
  />

  <JmesPathResults
    :query-state="queryState"
    :result-count="resultCount"
    :formatted-result="formattedResult"
    :download-url="downloadUrl"
    :download-filename="downloadFilename"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useObjectUrl, useStorage } from '@vueuse/core'
import { search } from 'jmespath'
import { fileOpen } from 'browser-fs-access'
import type { QueryState } from './types'
import JmesPathInputs from './JmesPathInputs.vue'
import JmesPathResults from './JmesPathResults.vue'

const { t } = useI18n({ useScope: 'local' })

const defaultJson = `{
  "people": [
    {
      "first": "James",
      "last": "Smith",
      "age": 32
    },
    {
      "first": "Sarah",
      "last": "Jones",
      "age": 27
    },
    {
      "first": "Harry",
      "last": "Wilson",
      "age": 42
    }
  ],
  "orders": [
    {
      "id": "A1",
      "total": 29.99
    },
    {
      "id": "B2",
      "total": 17.5
    }
  ],
  "active": true
}`

const defaultQuery = 'people[*].last'

const jsonText = useStorage('tools:jmespath-tester:json', defaultJson)
const queryText = useStorage('tools:jmespath-tester:query', defaultQuery)

const jsonErrorMessage = computed(() => {
  const parsed = parseJson(jsonText.value)
  return parsed.error ? `${t('invalid-json')}: ${parsed.error}` : ''
})

const jsonStatus = computed(() => {
  if (!jsonText.value.trim()) return undefined
  return jsonErrorMessage.value ? 'error' : 'success'
})

const queryState = computed<QueryState>(() => {
  if (!jsonText.value.trim() || !queryText.value.trim()) {
    return { state: 'empty' }
  }

  const parsed = parseJson(jsonText.value)
  if (parsed.error) {
    return { state: 'json-error', message: `${t('invalid-json')}: ${parsed.error}` }
  }

  const query = queryText.value.trim()
  if (!query) {
    return { state: 'empty' }
  }

  try {
    const result = search(parsed.value, query)
    return { state: 'ready', result }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return { state: 'query-error', message: `${t('invalid-query')}: ${message}` }
  }
})

const queryStatus = computed(() => (queryState.value.state === 'query-error' ? 'error' : undefined))

const queryErrorMessage = computed(() =>
  queryState.value.state === 'query-error' ? queryState.value.message : '',
)

const resultCount = computed(() => {
  if (queryState.value.state !== 'ready') return 0
  const result = queryState.value.result
  if (Array.isArray(result)) return result.length
  if (result === null || result === undefined) return 0
  return 1
})

const formattedResult = computed(() =>
  queryState.value.state === 'ready'
    ? JSON.stringify(queryState.value.result ?? null, null, 2)
    : '',
)

const downloadFilename = 'jmespath-results.json'

const downloadFile = computed<File | null>(() => {
  if (queryState.value.state !== 'ready') return null
  return new File([formattedResult.value], downloadFilename, {
    type: 'application/json',
  })
})

const downloadUrl = useObjectUrl(downloadFile)

const exampleOptions = computed(() => [
  { label: t('example-last-names'), value: 'people[*].last' },
  { label: t('example-adults'), value: 'people[?age >= `30`].first' },
  { label: t('example-orders'), value: 'orders[?total > `20`].id' },
])

async function importFromFile(): Promise<void> {
  try {
    const file = await fileOpen({
      extensions: ['.json', '.txt'],
    })
    jsonText.value = await file.text()
  } catch {
    // User cancelled file selection - this is normal
  }
}

function formatJson(): void {
  const parsed = parseJson(jsonText.value)
  if (!parsed.error && parsed.value !== undefined) {
    jsonText.value = JSON.stringify(parsed.value, null, 2)
  }
}

function parseJson(input: string): { value?: unknown; error?: string } {
  if (!input.trim()) return {}
  try {
    return { value: JSON.parse(input) }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return { error: message }
  }
}
</script>

<i18n lang="json">
{
  "en": {
    "invalid-json": "Invalid JSON",
    "invalid-query": "Invalid JMESPath",
    "example-last-names": "All last names",
    "example-adults": "People age 30+",
    "example-orders": "Orders over 20"
  },
  "zh": {
    "invalid-json": "无效的 JSON",
    "invalid-query": "无效的 JMESPath",
    "example-last-names": "所有姓氏",
    "example-adults": "30 岁以上的人",
    "example-orders": "超过 20 的订单"
  },
  "zh-CN": {
    "invalid-json": "无效的 JSON",
    "invalid-query": "无效的 JMESPath",
    "example-last-names": "所有姓氏",
    "example-adults": "30 岁以上的人",
    "example-orders": "超过 20 的订单"
  },
  "zh-TW": {
    "invalid-json": "無效的 JSON",
    "invalid-query": "無效的 JMESPath",
    "example-last-names": "所有姓氏",
    "example-adults": "30 歲以上的人",
    "example-orders": "超過 20 的訂單"
  },
  "zh-HK": {
    "invalid-json": "無效的 JSON",
    "invalid-query": "無效的 JMESPath",
    "example-last-names": "所有姓氏",
    "example-adults": "30 歲以上的人",
    "example-orders": "超過 20 的訂單"
  },
  "es": {
    "invalid-json": "JSON inválido",
    "invalid-query": "JMESPath inválido",
    "example-last-names": "Todos los apellidos",
    "example-adults": "Personas de 30+ años",
    "example-orders": "Pedidos mayores de 20"
  },
  "fr": {
    "invalid-json": "JSON invalide",
    "invalid-query": "JMESPath invalide",
    "example-last-names": "Tous les noms de famille",
    "example-adults": "Personnes de 30 ans et plus",
    "example-orders": "Commandes au-dessus de 20"
  },
  "de": {
    "invalid-json": "Ungültiges JSON",
    "invalid-query": "Ungültiges JMESPath",
    "example-last-names": "Alle Nachnamen",
    "example-adults": "Personen ab 30",
    "example-orders": "Bestellungen über 20"
  },
  "it": {
    "invalid-json": "JSON non valido",
    "invalid-query": "JMESPath non valido",
    "example-last-names": "Tutti i cognomi",
    "example-adults": "Persone di 30+ anni",
    "example-orders": "Ordini oltre 20"
  },
  "ja": {
    "invalid-json": "無効な JSON",
    "invalid-query": "無効な JMESPath",
    "example-last-names": "すべての姓",
    "example-adults": "30歳以上の人",
    "example-orders": "20超の注文"
  },
  "ko": {
    "invalid-json": "유효하지 않은 JSON",
    "invalid-query": "유효하지 않은 JMESPath",
    "example-last-names": "모든 성",
    "example-adults": "30세 이상",
    "example-orders": "20 초과 주문"
  },
  "ru": {
    "invalid-json": "Недопустимый JSON",
    "invalid-query": "Недопустимый JMESPath",
    "example-last-names": "Все фамилии",
    "example-adults": "Люди старше 30",
    "example-orders": "Заказы больше 20"
  },
  "pt": {
    "invalid-json": "JSON inválido",
    "invalid-query": "JMESPath inválido",
    "example-last-names": "Todos os sobrenomes",
    "example-adults": "Pessoas com 30+",
    "example-orders": "Pedidos acima de 20"
  },
  "ar": {
    "invalid-json": "JSON غير صالح",
    "invalid-query": "JMESPath غير صالح",
    "example-last-names": "جميع أسماء العائلة",
    "example-adults": "الأشخاص بعمر 30+",
    "example-orders": "طلبات أكثر من 20"
  },
  "hi": {
    "invalid-json": "अमान्य JSON",
    "invalid-query": "अमान्य JMESPath",
    "example-last-names": "सभी उपनाम",
    "example-adults": "30+ वर्ष के लोग",
    "example-orders": "20 से ऊपर के ऑर्डर"
  },
  "tr": {
    "invalid-json": "Geçersiz JSON",
    "invalid-query": "Geçersiz JMESPath",
    "example-last-names": "Tüm soyadları",
    "example-adults": "30+ yaş",
    "example-orders": "20'nin üzerindeki siparişler"
  },
  "nl": {
    "invalid-json": "Ongeldige JSON",
    "invalid-query": "Ongeldige JMESPath",
    "example-last-names": "Alle achternamen",
    "example-adults": "Mensen van 30+",
    "example-orders": "Bestellingen boven 20"
  },
  "sv": {
    "invalid-json": "Ogiltig JSON",
    "invalid-query": "Ogiltig JMESPath",
    "example-last-names": "Alla efternamn",
    "example-adults": "Personer 30+",
    "example-orders": "Beställningar över 20"
  },
  "pl": {
    "invalid-json": "Nieprawidłowy JSON",
    "invalid-query": "Nieprawidłowy JMESPath",
    "example-last-names": "Wszystkie nazwiska",
    "example-adults": "Osoby 30+",
    "example-orders": "Zamówienia powyżej 20"
  },
  "vi": {
    "invalid-json": "JSON không hợp lệ",
    "invalid-query": "JMESPath không hợp lệ",
    "example-last-names": "Tất cả họ",
    "example-adults": "Người từ 30+",
    "example-orders": "Đơn hàng trên 20"
  },
  "th": {
    "invalid-json": "JSON ไม่ถูกต้อง",
    "invalid-query": "JMESPath ไม่ถูกต้อง",
    "example-last-names": "นามสกุลทั้งหมด",
    "example-adults": "คนอายุ 30+",
    "example-orders": "คำสั่งซื้อมากกว่า 20"
  },
  "id": {
    "invalid-json": "JSON tidak valid",
    "invalid-query": "JMESPath tidak valid",
    "example-last-names": "Semua nama belakang",
    "example-adults": "Orang usia 30+",
    "example-orders": "Pesanan di atas 20"
  },
  "he": {
    "invalid-json": "JSON לא תקין",
    "invalid-query": "JMESPath לא תקין",
    "example-last-names": "כל שמות המשפחה",
    "example-adults": "אנשים בני 30+",
    "example-orders": "הזמנות מעל 20"
  },
  "ms": {
    "invalid-json": "JSON tidak sah",
    "invalid-query": "JMESPath tidak sah",
    "example-last-names": "Semua nama keluarga",
    "example-adults": "Orang berumur 30+",
    "example-orders": "Pesanan melebihi 20"
  },
  "no": {
    "invalid-json": "Ugyldig JSON",
    "invalid-query": "Ugyldig JMESPath",
    "example-last-names": "Alle etternavn",
    "example-adults": "Personer 30+",
    "example-orders": "Bestillinger over 20"
  }
}
</i18n>
