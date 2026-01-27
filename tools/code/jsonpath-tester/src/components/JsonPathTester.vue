<template>
  <JsonPathInputs
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

  <JsonPathResults
    v-model:active-tab="activeTab"
    :query-state="queryState"
    :matches-count="matchesCount"
    :formatted-values="formattedValues"
    :formatted-paths="formattedPaths"
    :download-url="downloadUrl"
    :download-filename="downloadFilename"
  />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useObjectUrl, useStorage } from '@vueuse/core'
import { JSONPath, type JSONPathOptions } from 'jsonpath-plus'
import { fileOpen } from 'browser-fs-access'
import type { QueryState } from './types'
import JsonPathInputs from './JsonPathInputs.vue'
import JsonPathResults from './JsonPathResults.vue'

const { t } = useI18n({ useScope: 'local' })

const defaultJson = `{
  "store": {
    "book": [
      {
        "category": "reference",
        "author": "Nigel Rees",
        "title": "Sayings of the Century",
        "price": 8.95
      },
      {
        "category": "fiction",
        "author": "Evelyn Waugh",
        "title": "Sword of Honour",
        "price": 12.99
      },
      {
        "category": "fiction",
        "author": "Herman Melville",
        "title": "Moby Dick",
        "isbn": "0-553-21311-3",
        "price": 8.99
      },
      {
        "category": "fiction",
        "author": "J. R. R. Tolkien",
        "title": "The Lord of the Rings",
        "isbn": "0-395-19395-8",
        "price": 22.99
      }
    ],
    "bicycle": {
      "color": "red",
      "price": 19.95
    }
  }
}`

const defaultQuery = '$.store.book[*].author'

const jsonText = useStorage('tools:jsonpath-tester:json', defaultJson)
const queryText = useStorage('tools:jsonpath-tester:query', defaultQuery)
const activeTab = ref<'values' | 'paths'>('values')

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
    const jsonValue = parsed.value as JSONPathOptions['json']
    const values = JSONPath<unknown[]>({ path: query, json: jsonValue, resultType: 'value' })
    const paths = JSONPath<string[]>({ path: query, json: jsonValue, resultType: 'path' })
    return { state: 'ready', values, paths }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return { state: 'query-error', message: `${t('invalid-query')}: ${message}` }
  }
})

const queryStatus = computed(() => (queryState.value.state === 'query-error' ? 'error' : undefined))

const queryErrorMessage = computed(() =>
  queryState.value.state === 'query-error' ? queryState.value.message : '',
)

const matchesCount = computed(() =>
  queryState.value.state === 'ready' ? queryState.value.values.length : 0,
)

const formattedValues = computed(() =>
  queryState.value.state === 'ready' ? JSON.stringify(queryState.value.values, null, 2) : '',
)

const formattedPaths = computed(() =>
  queryState.value.state === 'ready' ? JSON.stringify(queryState.value.paths, null, 2) : '',
)

const downloadFilename = computed(() =>
  activeTab.value === 'paths' ? 'jsonpath-paths.json' : 'jsonpath-values.json',
)

const downloadContent = computed(() =>
  activeTab.value === 'paths' ? formattedPaths.value : formattedValues.value,
)

const downloadFile = computed<File | null>(() => {
  if (queryState.value.state !== 'ready') return null
  return new File([downloadContent.value], downloadFilename.value, {
    type: 'application/json',
  })
})

const downloadUrl = useObjectUrl(downloadFile)

const exampleOptions = computed(() => [
  { label: t('example-authors'), value: '$.store.book[*].author' },
  { label: t('example-cheap-books'), value: '$.store.book[?(@.price < 10)].title' },
  { label: t('example-bicycle-color'), value: '$.store.bicycle.color' },
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
    "invalid-query": "Invalid JSONPath",
    "example-authors": "All authors",
    "example-cheap-books": "Books under $10",
    "example-bicycle-color": "Bicycle color"
  },
  "zh": {
    "invalid-json": "无效的 JSON",
    "invalid-query": "无效的 JSONPath",
    "example-authors": "所有作者",
    "example-cheap-books": "低于 $10 的图书",
    "example-bicycle-color": "自行车颜色"
  },
  "zh-CN": {
    "invalid-json": "无效的 JSON",
    "invalid-query": "无效的 JSONPath",
    "example-authors": "所有作者",
    "example-cheap-books": "低于 $10 的图书",
    "example-bicycle-color": "自行车颜色"
  },
  "zh-TW": {
    "invalid-json": "無效的 JSON",
    "invalid-query": "無效的 JSONPath",
    "example-authors": "所有作者",
    "example-cheap-books": "低於 $10 的書籍",
    "example-bicycle-color": "自行車顏色"
  },
  "zh-HK": {
    "invalid-json": "無效的 JSON",
    "invalid-query": "無效的 JSONPath",
    "example-authors": "所有作者",
    "example-cheap-books": "低於 $10 的書籍",
    "example-bicycle-color": "單車顏色"
  },
  "es": {
    "invalid-json": "JSON inválido",
    "invalid-query": "JSONPath inválido",
    "example-authors": "Todos los autores",
    "example-cheap-books": "Libros por debajo de $10",
    "example-bicycle-color": "Color de la bicicleta"
  },
  "fr": {
    "invalid-json": "JSON invalide",
    "invalid-query": "JSONPath invalide",
    "example-authors": "Tous les auteurs",
    "example-cheap-books": "Livres à moins de 10 $",
    "example-bicycle-color": "Couleur du vélo"
  },
  "de": {
    "invalid-json": "Ungültiges JSON",
    "invalid-query": "Ungültiges JSONPath",
    "example-authors": "Alle Autoren",
    "example-cheap-books": "Bücher unter $10",
    "example-bicycle-color": "Fahrradfarbe"
  },
  "it": {
    "invalid-json": "JSON non valido",
    "invalid-query": "JSONPath non valido",
    "example-authors": "Tutti gli autori",
    "example-cheap-books": "Libri sotto i 10 $",
    "example-bicycle-color": "Colore della bici"
  },
  "ja": {
    "invalid-json": "無効な JSON",
    "invalid-query": "無効な JSONPath",
    "example-authors": "すべての著者",
    "example-cheap-books": "10ドル未満の書籍",
    "example-bicycle-color": "自転車の色"
  },
  "ko": {
    "invalid-json": "유효하지 않은 JSON",
    "invalid-query": "유효하지 않은 JSONPath",
    "example-authors": "모든 저자",
    "example-cheap-books": "$10 미만 도서",
    "example-bicycle-color": "자전거 색상"
  },
  "ru": {
    "invalid-json": "Недопустимый JSON",
    "invalid-query": "Недопустимый JSONPath",
    "example-authors": "Все авторы",
    "example-cheap-books": "Книги дешевле $10",
    "example-bicycle-color": "Цвет велосипеда"
  },
  "pt": {
    "invalid-json": "JSON inválido",
    "invalid-query": "JSONPath inválido",
    "example-authors": "Todos os autores",
    "example-cheap-books": "Livros abaixo de $10",
    "example-bicycle-color": "Cor da bicicleta"
  },
  "ar": {
    "invalid-json": "JSON غير صالح",
    "invalid-query": "JSONPath غير صالح",
    "example-authors": "جميع المؤلفين",
    "example-cheap-books": "كتب أقل من 10 دولارات",
    "example-bicycle-color": "لون الدراجة"
  },
  "hi": {
    "invalid-json": "अमान्य JSON",
    "invalid-query": "अमान्य JSONPath",
    "example-authors": "सभी लेखक",
    "example-cheap-books": "$10 से कम की किताबें",
    "example-bicycle-color": "साइकिल का रंग"
  },
  "tr": {
    "invalid-json": "Geçersiz JSON",
    "invalid-query": "Geçersiz JSONPath",
    "example-authors": "Tüm yazarlar",
    "example-cheap-books": "10 $ altındaki kitaplar",
    "example-bicycle-color": "Bisiklet rengi"
  },
  "nl": {
    "invalid-json": "Ongeldige JSON",
    "invalid-query": "Ongeldige JSONPath",
    "example-authors": "Alle auteurs",
    "example-cheap-books": "Boeken onder $10",
    "example-bicycle-color": "Fietskleur"
  },
  "sv": {
    "invalid-json": "Ogiltig JSON",
    "invalid-query": "Ogiltig JSONPath",
    "example-authors": "Alla författare",
    "example-cheap-books": "Böcker under $10",
    "example-bicycle-color": "Cykelfärg"
  },
  "pl": {
    "invalid-json": "Nieprawidłowy JSON",
    "invalid-query": "Nieprawidłowy JSONPath",
    "example-authors": "Wszyscy autorzy",
    "example-cheap-books": "Książki poniżej 10 $",
    "example-bicycle-color": "Kolor roweru"
  },
  "vi": {
    "invalid-json": "JSON không hợp lệ",
    "invalid-query": "JSONPath không hợp lệ",
    "example-authors": "Tất cả tác giả",
    "example-cheap-books": "Sách dưới $10",
    "example-bicycle-color": "Màu xe đạp"
  },
  "th": {
    "invalid-json": "JSON ไม่ถูกต้อง",
    "invalid-query": "JSONPath ไม่ถูกต้อง",
    "example-authors": "ผู้เขียนทั้งหมด",
    "example-cheap-books": "หนังสือราคาต่ำกว่า $10",
    "example-bicycle-color": "สีจักรยาน"
  },
  "id": {
    "invalid-json": "JSON tidak valid",
    "invalid-query": "JSONPath tidak valid",
    "example-authors": "Semua penulis",
    "example-cheap-books": "Buku di bawah $10",
    "example-bicycle-color": "Warna sepeda"
  },
  "he": {
    "invalid-json": "JSON לא תקין",
    "invalid-query": "JSONPath לא תקין",
    "example-authors": "כל המחברים",
    "example-cheap-books": "ספרים מתחת ל-$10",
    "example-bicycle-color": "צבע האופניים"
  },
  "ms": {
    "invalid-json": "JSON tidak sah",
    "invalid-query": "JSONPath tidak sah",
    "example-authors": "Semua penulis",
    "example-cheap-books": "Buku di bawah $10",
    "example-bicycle-color": "Warna basikal"
  },
  "no": {
    "invalid-json": "Ugyldig JSON",
    "invalid-query": "Ugyldig JSONPath",
    "example-authors": "Alle forfattere",
    "example-cheap-books": "Bøker under $10",
    "example-bicycle-color": "Sykkelfarge"
  }
}
</i18n>
