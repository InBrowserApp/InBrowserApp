<template>
  <SchemaDataInputs
    :schema-status="schemaStatus"
    :data-status="dataStatus"
    :schema-error="schemaErrorMessage"
    :data-error="dataErrorMessage"
    :schema-value="schemaText"
    :data-value="dataText"
    @update:schema-value="handleSchemaInput"
    @update:data-value="handleDataInput"
  />

  <ValidatorOptions
    :validate-formats="validateFormats"
    :all-errors="allErrors"
    @update:validate-formats="validateFormats = $event"
    @update:all-errors="allErrors = $event"
  />

  <ValidationResult
    :state="validationState.state"
    :valid="validationState.state === 'validated' ? validationState.valid : false"
    :draft-value="draftDisplay.label"
    :draft-detected="draftDisplay.detected"
    :errors="validationErrors"
    :errors-json="errorsJson"
    :schema-error="schemaError"
    :loading="isValidating"
  />

  <WhatIsJsonSchema />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { computedAsync, useDebounce, useStorage } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import { detectSchemaDraft, validateJsonSchema } from '@utils/json-schema'
import SchemaDataInputs from './SchemaDataInputs.vue'
import ValidatorOptions from './ValidatorOptions.vue'
import ValidationResult from './ValidationResult.vue'
import WhatIsJsonSchema from './WhatIsJsonSchema.vue'
import type { JsonSchemaValidationError } from '@utils/json-schema'

type ValidationState =
  | { state: 'empty' }
  | { state: 'schema-error'; message: string }
  | { state: 'validated'; errors: JsonSchemaValidationError[]; valid: boolean }

const { t } = useI18n()

const defaultSchema = `{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "id": { "type": "string", "format": "uuid" },
    "name": { "type": "string", "minLength": 1 },
    "age": { "type": "integer", "minimum": 0 }
  },
  "required": ["id", "name"],
  "additionalProperties": false
}`

const defaultData = `{
  "id": "1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed",
  "name": "Ada",
  "age": 37
}`

const schemaText = useStorage('tools:json-schema-validator:schema', defaultSchema)
const dataText = useStorage('tools:json-schema-validator:data', defaultData)
const validateFormats = useStorage('tools:json-schema-validator:validate-formats', true)
const allErrors = useStorage('tools:json-schema-validator:all-errors', true)

const debouncedSchemaText = useDebounce(schemaText, 150)
const debouncedDataText = useDebounce(dataText, 150)
const isValidating = ref(false)

const schemaParse = computed(() => parseJson(schemaText.value))
const dataParse = computed(() => parseJson(dataText.value))

const hasSchemaInput = computed(() => schemaText.value.trim().length > 0)
const hasDataInput = computed(() => dataText.value.trim().length > 0)

const schemaStatus = computed(() => {
  if (!hasSchemaInput.value) return undefined
  return schemaParse.value.error ? 'error' : 'success'
})

const dataStatus = computed(() => {
  if (!hasDataInput.value) return undefined
  return dataParse.value.error ? 'error' : 'success'
})

const schemaErrorMessage = computed(() => (schemaParse.value.error ? schemaParse.value.error : ''))

const dataErrorMessage = computed(() => (dataParse.value.error ? dataParse.value.error : ''))

const schemaDraftInfo = computed(() => {
  if (!hasSchemaInput.value || schemaParse.value.error) {
    return { draft: '2020-12', detected: false }
  }

  const parsed = schemaParse.value.value
  if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
    return detectSchemaDraft(parsed)
  }

  return { draft: '2020-12', detected: false }
})

const draftDisplay = computed(() => {
  if (!hasSchemaInput.value || schemaParse.value.error) {
    return { label: '-', detected: false }
  }

  const draft =
    schemaDraftInfo.value.draft === 'draft-07' ? 'Draft-07' : schemaDraftInfo.value.draft
  return { label: draft, detected: schemaDraftInfo.value.detected }
})

const validationState = computedAsync<ValidationState>(
  async () => {
    if (!hasSchemaInput.value || !hasDataInput.value) {
      return { state: 'empty' }
    }

    const schemaResult = parseJson(debouncedSchemaText.value ?? '')
    const dataResult = parseJson(debouncedDataText.value ?? '')

    if (schemaResult.error || dataResult.error) {
      return { state: 'empty' }
    }

    const schemaValue = schemaResult.value
    if (!schemaValue || typeof schemaValue !== 'object' || Array.isArray(schemaValue)) {
      return { state: 'schema-error', message: t('schemaObjectError') }
    }

    const result = validateJsonSchema(schemaValue as Record<string, unknown>, dataResult.value, {
      allErrors: allErrors.value,
      validateFormats: validateFormats.value,
      strict: false,
    })

    if (result.schemaError) {
      return { state: 'schema-error', message: result.schemaError }
    }

    return {
      state: 'validated',
      errors: result.errors,
      valid: result.valid,
    }
  },
  { state: 'empty' },
  { evaluating: isValidating },
)

const validationErrors = computed<JsonSchemaValidationError[]>(() =>
  validationState.value.state === 'validated' ? validationState.value.errors : [],
)

const errorsJson = computed(() =>
  validationErrors.value.length ? JSON.stringify(validationErrors.value, null, 2) : '',
)

const schemaError = computed(() =>
  validationState.value.state === 'schema-error' ? validationState.value.message : '',
)

async function handleSchemaInput(value: string | File) {
  if (typeof value === 'string') {
    schemaText.value = value
    return
  }
  try {
    schemaText.value = await value.text()
  } catch {
    schemaText.value = ''
  }
}

async function handleDataInput(value: string | File) {
  if (typeof value === 'string') {
    dataText.value = value
    return
  }
  try {
    dataText.value = await value.text()
  } catch {
    dataText.value = ''
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
    "schemaObjectError": "Schema must be a JSON object"
  },
  "zh": {
    "schemaObjectError": "Schema 必须是 JSON 对象"
  },
  "zh-CN": {
    "schemaObjectError": "Schema 必须是 JSON 对象"
  },
  "zh-TW": {
    "schemaObjectError": "Schema 必須是 JSON 物件"
  },
  "zh-HK": {
    "schemaObjectError": "Schema 必須是 JSON 物件"
  },
  "es": {
    "schemaObjectError": "El esquema debe ser un objeto JSON"
  },
  "fr": {
    "schemaObjectError": "Le schéma doit être un objet JSON"
  },
  "de": {
    "schemaObjectError": "Das Schema muss ein JSON-Objekt sein"
  },
  "it": {
    "schemaObjectError": "Lo schema deve essere un oggetto JSON"
  },
  "ja": {
    "schemaObjectError": "Schema は JSON オブジェクトである必要があります"
  },
  "ko": {
    "schemaObjectError": "스키마는 JSON 객체여야 합니다"
  },
  "ru": {
    "schemaObjectError": "Схема должна быть JSON объектом"
  },
  "pt": {
    "schemaObjectError": "O esquema deve ser um objeto JSON"
  },
  "ar": {
    "schemaObjectError": "يجب أن يكون المخطط كائن JSON"
  },
  "hi": {
    "schemaObjectError": "स्कीमा एक JSON ऑब्जेक्ट होना चाहिए"
  },
  "tr": {
    "schemaObjectError": "Şema bir JSON nesnesi olmalıdır"
  },
  "nl": {
    "schemaObjectError": "Het schema moet een JSON-object zijn"
  },
  "sv": {
    "schemaObjectError": "Schemat måste vara ett JSON-objekt"
  },
  "pl": {
    "schemaObjectError": "Schemat musi być obiektem JSON"
  },
  "vi": {
    "schemaObjectError": "Schema phải là một đối tượng JSON"
  },
  "th": {
    "schemaObjectError": "สคีมาต้องเป็นอ็อบเจ็กต์ JSON"
  },
  "id": {
    "schemaObjectError": "Skema harus berupa objek JSON"
  },
  "he": {
    "schemaObjectError": "הסכימה חייבת להיות אובייקט JSON"
  },
  "ms": {
    "schemaObjectError": "Skema mesti menjadi objek JSON"
  },
  "no": {
    "schemaObjectError": "Skjemaet må være et JSON-objekt"
  }
}
</i18n>
