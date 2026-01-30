<template>
  <SchemaGeneratorActions
    :schema-text="schemaText"
    :download-url="downloadUrl"
    @load-sample="loadSample"
  />
  <SchemaGeneratorInputOutput
    :input-value="inputText"
    :input-status="inputStatus"
    :input-error="inputError"
    :schema-text="schemaText"
    :output-error="outputError"
    @update:input-value="handleInput"
  />
  <SchemaGeneratorOptions
    :draft="draft"
    :draft-options="draftOptions"
    :infer-required="inferRequired"
    :allow-additional-properties="allowAdditionalProperties"
    :detect-format="detectFormat"
    @update:draft="draft = $event"
    @update:infer-required="inferRequired = $event"
    @update:allow-additional-properties="allowAdditionalProperties = $event"
    @update:detect-format="detectFormat = $event"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useObjectUrl, useStorage } from '@vueuse/core'
import { generateJsonSchema, type JsonSchemaDraft } from '@utils/json-schema'
import SchemaGeneratorActions from './SchemaGeneratorActions.vue'
import SchemaGeneratorInputOutput from './SchemaGeneratorInputOutput.vue'
import SchemaGeneratorOptions from './SchemaGeneratorOptions.vue'

const sampleJson = `{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Ada Lovelace",
  "email": "ada@example.com",
  "age": 36,
  "active": true,
  "website": "https://example.com",
  "tags": ["math", "poetry"],
  "address": {
    "street": "123 Main St",
    "city": "London",
    "postalCode": "SW1A 1AA"
  },
  "projects": [
    { "name": "Analytical Engine", "year": 1843 },
    { "name": "Notes", "year": 1842, "url": "https://example.com/notes" }
  ],
  "lastSeen": "2024-01-20T10:12:30Z",
  "metadata": null
}`

const inputText = useStorage('tools:json-schema-generator:input', sampleJson)
const draft = useStorage<JsonSchemaDraft>('tools:json-schema-generator:draft', '2020-12')
const inferRequired = useStorage('tools:json-schema-generator:infer-required', true)
const allowAdditionalProperties = useStorage(
  'tools:json-schema-generator:allow-additional-properties',
  true,
)
const detectFormat = useStorage('tools:json-schema-generator:detect-format', true)

const draftOptions: { label: string; value: JsonSchemaDraft }[] = [
  { label: '2020-12', value: '2020-12' },
  { label: '2019-09', value: '2019-09' },
  { label: 'Draft-07', value: 'draft-07' },
]

const inputState = computed(() => parseJson(inputText.value))
const hasInput = computed(() => inputText.value.trim().length > 0)
const inputStatus = computed(() => {
  if (!hasInput.value) return undefined
  return inputState.value.error ? 'error' : 'success'
})
const inputError = computed(() => inputState.value.error ?? '')

const schemaText = computed(() => {
  if (!hasInput.value || inputState.value.error) {
    return ''
  }

  const schema = generateJsonSchema(inputState.value.value, {
    draft: draft.value,
    inferRequired: inferRequired.value,
    allowAdditionalProperties: allowAdditionalProperties.value,
    detectFormat: detectFormat.value,
  })

  return JSON.stringify(schema, null, 2)
})

const outputError = computed(() => inputState.value.error ?? '')

const downloadBlob = computed(() => {
  if (!schemaText.value) return null
  return new Blob([schemaText.value], { type: 'application/json;charset=utf-8' })
})
const downloadUrl = useObjectUrl(downloadBlob)

function loadSample() {
  inputText.value = sampleJson
}

async function handleInput(value: string | File) {
  if (typeof value === 'string') {
    inputText.value = value
    return
  }
  try {
    inputText.value = await value.text()
  } catch {
    inputText.value = ''
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
