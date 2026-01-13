<template>
  <SchemaDataInputs
    :title="t('inputsTitle')"
    :schema-label="t('schemaLabel')"
    :data-label="t('dataLabel')"
    :schema-placeholder="t('schemaPlaceholder')"
    :data-placeholder="t('dataPlaceholder')"
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
    :title="t('optionsTitle')"
    :validate-formats="validateFormats"
    :all-errors="allErrors"
    :validate-formats-label="t('validateFormats')"
    :all-errors-label="t('allErrors')"
    @update:validate-formats="validateFormats = $event"
    @update:all-errors="allErrors = $event"
  />

  <ValidationResult
    :title="t('resultTitle')"
    :status-label="t('statusLabel')"
    :status-value="statusValue"
    :status-type="statusType"
    :draft-label="t('draftLabel')"
    :draft-value="draftDisplay.label"
    :draft-hint="draftDisplay.hint"
    :errors-label="t('errorsLabel')"
    :errors-count="errorsCount"
    :errors-title="errorsTitle"
    :errors="validationErrors"
    :errors-json="errorsJson"
    :columns-labels="{
      path: t('errorsColumnPath'),
      message: t('errorsColumnMessage'),
      keyword: t('errorsColumnKeyword'),
    }"
    :no-errors-label="t('noErrors')"
    :schema-error="schemaError"
    :empty-message="t('emptyMessage')"
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

const schemaErrorMessage = computed(() =>
  schemaParse.value.error ? `${t('invalidJson')}: ${schemaParse.value.error}` : '',
)

const dataErrorMessage = computed(() =>
  dataParse.value.error ? `${t('invalidJson')}: ${dataParse.value.error}` : '',
)

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
    return { label: '-', hint: '' }
  }

  const draft =
    schemaDraftInfo.value.draft === 'draft-07' ? 'Draft-07' : schemaDraftInfo.value.draft
  const hint = schemaDraftInfo.value.detected ? t('draftDetected') : t('draftDefault')
  return { label: draft, hint }
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

const errorsCount = computed(() => validationErrors.value.length)
const errorsTitle = computed(() =>
  errorsCount.value > 0
    ? t('errorsTitleWithCount', { count: errorsCount.value })
    : t('errorsTitle'),
)

const schemaError = computed(() =>
  validationState.value.state === 'schema-error' ? validationState.value.message : '',
)

const statusValue = computed(() => {
  if (validationState.value.state === 'validated') {
    return validationState.value.valid ? t('statusValid') : t('statusInvalid')
  }
  if (validationState.value.state === 'schema-error') {
    return t('statusSchemaError')
  }
  return t('statusPending')
})

const statusType = computed(() => {
  if (validationState.value.state === 'validated') {
    return validationState.value.valid ? 'success' : 'error'
  }
  if (validationState.value.state === 'schema-error') {
    return 'error'
  }
  return 'info'
})

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
    "inputsTitle": "Schema & Data",
    "schemaLabel": "JSON Schema",
    "dataLabel": "JSON Data",
    "schemaPlaceholder": "Paste JSON Schema here...",
    "dataPlaceholder": "Paste JSON data here...",
    "invalidJson": "Invalid JSON",
    "optionsTitle": "Validation Options",
    "validateFormats": "Validate formats (email, uri, uuid)",
    "allErrors": "Show all errors",
    "resultTitle": "Validation Result",
    "statusLabel": "Status",
    "statusValid": "Valid",
    "statusInvalid": "Invalid",
    "statusPending": "Waiting for inputs",
    "statusSchemaError": "Schema error",
    "draftLabel": "Schema Draft",
    "draftDetected": "from $schema",
    "draftDefault": "default",
    "errorsLabel": "Errors",
    "errorsTitle": "Errors",
    "errorsTitleWithCount": "Errors ({count})",
    "errorsColumnPath": "Path",
    "errorsColumnMessage": "Message",
    "errorsColumnKeyword": "Keyword",
    "noErrors": "No errors",
    "schemaObjectError": "Schema must be a JSON object",
    "emptyMessage": "Provide a valid JSON Schema and JSON data to see results"
  },
  "zh": {
    "inputsTitle": "Schema 与数据",
    "schemaLabel": "JSON Schema",
    "dataLabel": "JSON 数据",
    "schemaPlaceholder": "在此粘贴 JSON Schema...",
    "dataPlaceholder": "在此粘贴 JSON 数据...",
    "invalidJson": "无效的 JSON",
    "optionsTitle": "校验选项",
    "validateFormats": "校验格式 (email, uri, uuid)",
    "allErrors": "显示全部错误",
    "resultTitle": "校验结果",
    "statusLabel": "状态",
    "statusValid": "有效",
    "statusInvalid": "无效",
    "statusPending": "等待输入",
    "statusSchemaError": "Schema 错误",
    "draftLabel": "Schema 草案",
    "draftDetected": "来自 $schema",
    "draftDefault": "默认",
    "errorsLabel": "错误",
    "errorsTitle": "错误",
    "errorsTitleWithCount": "错误 ({count})",
    "errorsColumnPath": "路径",
    "errorsColumnMessage": "消息",
    "errorsColumnKeyword": "关键字",
    "noErrors": "无错误",
    "schemaObjectError": "Schema 必须是 JSON 对象",
    "emptyMessage": "请输入有效的 JSON Schema 和 JSON 数据以查看结果"
  },
  "zh-CN": {
    "inputsTitle": "Schema 与数据",
    "schemaLabel": "JSON Schema",
    "dataLabel": "JSON 数据",
    "schemaPlaceholder": "在此粘贴 JSON Schema...",
    "dataPlaceholder": "在此粘贴 JSON 数据...",
    "invalidJson": "无效的 JSON",
    "optionsTitle": "校验选项",
    "validateFormats": "校验格式 (email, uri, uuid)",
    "allErrors": "显示全部错误",
    "resultTitle": "校验结果",
    "statusLabel": "状态",
    "statusValid": "有效",
    "statusInvalid": "无效",
    "statusPending": "等待输入",
    "statusSchemaError": "Schema 错误",
    "draftLabel": "Schema 草案",
    "draftDetected": "来自 $schema",
    "draftDefault": "默认",
    "errorsLabel": "错误",
    "errorsTitle": "错误",
    "errorsTitleWithCount": "错误 ({count})",
    "errorsColumnPath": "路径",
    "errorsColumnMessage": "消息",
    "errorsColumnKeyword": "关键字",
    "noErrors": "无错误",
    "schemaObjectError": "Schema 必须是 JSON 对象",
    "emptyMessage": "请输入有效的 JSON Schema 和 JSON 数据以查看结果"
  },
  "zh-TW": {
    "inputsTitle": "Schema 與資料",
    "schemaLabel": "JSON Schema",
    "dataLabel": "JSON 資料",
    "schemaPlaceholder": "在此貼上 JSON Schema...",
    "dataPlaceholder": "在此貼上 JSON 資料...",
    "invalidJson": "無效的 JSON",
    "optionsTitle": "驗證選項",
    "validateFormats": "驗證格式 (email, uri, uuid)",
    "allErrors": "顯示所有錯誤",
    "resultTitle": "驗證結果",
    "statusLabel": "狀態",
    "statusValid": "有效",
    "statusInvalid": "無效",
    "statusPending": "等待輸入",
    "statusSchemaError": "Schema 錯誤",
    "draftLabel": "Schema 草案",
    "draftDetected": "來自 $schema",
    "draftDefault": "預設",
    "errorsLabel": "錯誤",
    "errorsTitle": "錯誤",
    "errorsTitleWithCount": "錯誤 ({count})",
    "errorsColumnPath": "路徑",
    "errorsColumnMessage": "訊息",
    "errorsColumnKeyword": "關鍵字",
    "noErrors": "沒有錯誤",
    "schemaObjectError": "Schema 必須是 JSON 物件",
    "emptyMessage": "請輸入有效的 JSON Schema 與 JSON 資料以查看結果"
  },
  "zh-HK": {
    "inputsTitle": "Schema 與資料",
    "schemaLabel": "JSON Schema",
    "dataLabel": "JSON 資料",
    "schemaPlaceholder": "在此貼上 JSON Schema...",
    "dataPlaceholder": "在此貼上 JSON 資料...",
    "invalidJson": "無效的 JSON",
    "optionsTitle": "驗證選項",
    "validateFormats": "驗證格式 (email, uri, uuid)",
    "allErrors": "顯示所有錯誤",
    "resultTitle": "驗證結果",
    "statusLabel": "狀態",
    "statusValid": "有效",
    "statusInvalid": "無效",
    "statusPending": "等待輸入",
    "statusSchemaError": "Schema 錯誤",
    "draftLabel": "Schema 草案",
    "draftDetected": "來自 $schema",
    "draftDefault": "預設",
    "errorsLabel": "錯誤",
    "errorsTitle": "錯誤",
    "errorsTitleWithCount": "錯誤 ({count})",
    "errorsColumnPath": "路徑",
    "errorsColumnMessage": "訊息",
    "errorsColumnKeyword": "關鍵字",
    "noErrors": "沒有錯誤",
    "schemaObjectError": "Schema 必須是 JSON 物件",
    "emptyMessage": "請輸入有效的 JSON Schema 與 JSON 資料以查看結果"
  },
  "es": {
    "inputsTitle": "Esquema y datos",
    "schemaLabel": "JSON Schema",
    "dataLabel": "Datos JSON",
    "schemaPlaceholder": "Pegue el JSON Schema aquí...",
    "dataPlaceholder": "Pegue los datos JSON aquí...",
    "invalidJson": "JSON no válido",
    "optionsTitle": "Opciones de validación",
    "validateFormats": "Validar formatos (email, uri, uuid)",
    "allErrors": "Mostrar todos los errores",
    "resultTitle": "Resultado de validación",
    "statusLabel": "Estado",
    "statusValid": "Válido",
    "statusInvalid": "No válido",
    "statusPending": "Esperando entradas",
    "statusSchemaError": "Error de esquema",
    "draftLabel": "Borrador del esquema",
    "draftDetected": "desde $schema",
    "draftDefault": "predeterminado",
    "errorsLabel": "Errores",
    "errorsTitle": "Errores",
    "errorsTitleWithCount": "Errores ({count})",
    "errorsColumnPath": "Ruta",
    "errorsColumnMessage": "Mensaje",
    "errorsColumnKeyword": "Palabra clave",
    "noErrors": "Sin errores",
    "schemaObjectError": "El esquema debe ser un objeto JSON",
    "emptyMessage": "Proporcione un JSON Schema y datos JSON válidos para ver resultados"
  },
  "fr": {
    "inputsTitle": "Schéma et données",
    "schemaLabel": "Schéma JSON",
    "dataLabel": "Données JSON",
    "schemaPlaceholder": "Collez le schéma JSON ici...",
    "dataPlaceholder": "Collez les données JSON ici...",
    "invalidJson": "JSON invalide",
    "optionsTitle": "Options de validation",
    "validateFormats": "Valider les formats (email, uri, uuid)",
    "allErrors": "Afficher toutes les erreurs",
    "resultTitle": "Résultat de validation",
    "statusLabel": "Statut",
    "statusValid": "Valide",
    "statusInvalid": "Invalide",
    "statusPending": "En attente des entrées",
    "statusSchemaError": "Erreur de schéma",
    "draftLabel": "Version du schéma",
    "draftDetected": "depuis $schema",
    "draftDefault": "par défaut",
    "errorsLabel": "Erreurs",
    "errorsTitle": "Erreurs",
    "errorsTitleWithCount": "Erreurs ({count})",
    "errorsColumnPath": "Chemin",
    "errorsColumnMessage": "Message",
    "errorsColumnKeyword": "Mot-clé",
    "noErrors": "Aucune erreur",
    "schemaObjectError": "Le schéma doit être un objet JSON",
    "emptyMessage": "Fournissez un schéma JSON et des données JSON valides pour voir les résultats"
  },
  "de": {
    "inputsTitle": "Schema und Daten",
    "schemaLabel": "JSON-Schema",
    "dataLabel": "JSON-Daten",
    "schemaPlaceholder": "JSON-Schema hier einfügen...",
    "dataPlaceholder": "JSON-Daten hier einfügen...",
    "invalidJson": "Ungültiges JSON",
    "optionsTitle": "Validierungsoptionen",
    "validateFormats": "Formate prüfen (email, uri, uuid)",
    "allErrors": "Alle Fehler anzeigen",
    "resultTitle": "Validierungsergebnis",
    "statusLabel": "Status",
    "statusValid": "Gültig",
    "statusInvalid": "Ungültig",
    "statusPending": "Warten auf Eingaben",
    "statusSchemaError": "Schemafehler",
    "draftLabel": "Schema-Entwurf",
    "draftDetected": "aus $schema",
    "draftDefault": "Standard",
    "errorsLabel": "Fehler",
    "errorsTitle": "Fehler",
    "errorsTitleWithCount": "Fehler ({count})",
    "errorsColumnPath": "Pfad",
    "errorsColumnMessage": "Nachricht",
    "errorsColumnKeyword": "Schlüsselwort",
    "noErrors": "Keine Fehler",
    "schemaObjectError": "Das Schema muss ein JSON-Objekt sein",
    "emptyMessage": "Geben Sie ein gültiges JSON-Schema und JSON-Daten ein, um Ergebnisse zu sehen"
  },
  "it": {
    "inputsTitle": "Schema e dati",
    "schemaLabel": "JSON Schema",
    "dataLabel": "Dati JSON",
    "schemaPlaceholder": "Incolla il JSON Schema qui...",
    "dataPlaceholder": "Incolla i dati JSON qui...",
    "invalidJson": "JSON non valido",
    "optionsTitle": "Opzioni di validazione",
    "validateFormats": "Valida formati (email, uri, uuid)",
    "allErrors": "Mostra tutti gli errori",
    "resultTitle": "Risultato di validazione",
    "statusLabel": "Stato",
    "statusValid": "Valido",
    "statusInvalid": "Non valido",
    "statusPending": "In attesa di input",
    "statusSchemaError": "Errore schema",
    "draftLabel": "Bozza schema",
    "draftDetected": "da $schema",
    "draftDefault": "predefinito",
    "errorsLabel": "Errori",
    "errorsTitle": "Errori",
    "errorsTitleWithCount": "Errori ({count})",
    "errorsColumnPath": "Percorso",
    "errorsColumnMessage": "Messaggio",
    "errorsColumnKeyword": "Parola chiave",
    "noErrors": "Nessun errore",
    "schemaObjectError": "Lo schema deve essere un oggetto JSON",
    "emptyMessage": "Fornisci un JSON Schema e dati JSON validi per vedere i risultati"
  },
  "ja": {
    "inputsTitle": "Schema とデータ",
    "schemaLabel": "JSON Schema",
    "dataLabel": "JSON データ",
    "schemaPlaceholder": "ここに JSON Schema を貼り付け...",
    "dataPlaceholder": "ここに JSON データを貼り付け...",
    "invalidJson": "無効な JSON",
    "optionsTitle": "検証オプション",
    "validateFormats": "形式を検証 (email, uri, uuid)",
    "allErrors": "すべてのエラーを表示",
    "resultTitle": "検証結果",
    "statusLabel": "ステータス",
    "statusValid": "有効",
    "statusInvalid": "無効",
    "statusPending": "入力待ち",
    "statusSchemaError": "Schema エラー",
    "draftLabel": "Schema ドラフト",
    "draftDetected": "$schema から",
    "draftDefault": "既定",
    "errorsLabel": "エラー",
    "errorsTitle": "エラー",
    "errorsTitleWithCount": "エラー ({count})",
    "errorsColumnPath": "パス",
    "errorsColumnMessage": "メッセージ",
    "errorsColumnKeyword": "キーワード",
    "noErrors": "エラーなし",
    "schemaObjectError": "Schema は JSON オブジェクトである必要があります",
    "emptyMessage": "有効な JSON Schema と JSON データを入力して結果を確認してください"
  },
  "ko": {
    "inputsTitle": "스키마와 데이터",
    "schemaLabel": "JSON 스키마",
    "dataLabel": "JSON 데이터",
    "schemaPlaceholder": "여기에 JSON 스키마를 붙여넣으세요...",
    "dataPlaceholder": "여기에 JSON 데이터를 붙여넣으세요...",
    "invalidJson": "유효하지 않은 JSON",
    "optionsTitle": "검증 옵션",
    "validateFormats": "형식 검증 (email, uri, uuid)",
    "allErrors": "모든 오류 표시",
    "resultTitle": "검증 결과",
    "statusLabel": "상태",
    "statusValid": "유효함",
    "statusInvalid": "유효하지 않음",
    "statusPending": "입력 대기",
    "statusSchemaError": "스키마 오류",
    "draftLabel": "스키마 초안",
    "draftDetected": "$schema 기준",
    "draftDefault": "기본",
    "errorsLabel": "오류",
    "errorsTitle": "오류",
    "errorsTitleWithCount": "오류 ({count})",
    "errorsColumnPath": "경로",
    "errorsColumnMessage": "메시지",
    "errorsColumnKeyword": "키워드",
    "noErrors": "오류 없음",
    "schemaObjectError": "스키마는 JSON 객체여야 합니다",
    "emptyMessage": "유효한 JSON 스키마와 JSON 데이터를 입력하면 결과가 표시됩니다"
  },
  "ru": {
    "inputsTitle": "Схема и данные",
    "schemaLabel": "JSON Schema",
    "dataLabel": "JSON данные",
    "schemaPlaceholder": "Вставьте JSON Schema сюда...",
    "dataPlaceholder": "Вставьте JSON данные сюда...",
    "invalidJson": "Недопустимый JSON",
    "optionsTitle": "Параметры проверки",
    "validateFormats": "Проверять форматы (email, uri, uuid)",
    "allErrors": "Показывать все ошибки",
    "resultTitle": "Результат проверки",
    "statusLabel": "Статус",
    "statusValid": "Действительно",
    "statusInvalid": "Недействительно",
    "statusPending": "Ожидание ввода",
    "statusSchemaError": "Ошибка схемы",
    "draftLabel": "Версия схемы",
    "draftDetected": "из $schema",
    "draftDefault": "по умолчанию",
    "errorsLabel": "Ошибки",
    "errorsTitle": "Ошибки",
    "errorsTitleWithCount": "Ошибки ({count})",
    "errorsColumnPath": "Путь",
    "errorsColumnMessage": "Сообщение",
    "errorsColumnKeyword": "Ключевое слово",
    "noErrors": "Ошибок нет",
    "schemaObjectError": "Схема должна быть JSON объектом",
    "emptyMessage": "Введите корректный JSON Schema и JSON данные для просмотра результатов"
  },
  "pt": {
    "inputsTitle": "Esquema e dados",
    "schemaLabel": "JSON Schema",
    "dataLabel": "Dados JSON",
    "schemaPlaceholder": "Cole o JSON Schema aqui...",
    "dataPlaceholder": "Cole os dados JSON aqui...",
    "invalidJson": "JSON inválido",
    "optionsTitle": "Opções de validação",
    "validateFormats": "Validar formatos (email, uri, uuid)",
    "allErrors": "Mostrar todos os erros",
    "resultTitle": "Resultado da validação",
    "statusLabel": "Status",
    "statusValid": "Válido",
    "statusInvalid": "Inválido",
    "statusPending": "Aguardando entradas",
    "statusSchemaError": "Erro de esquema",
    "draftLabel": "Rascunho do esquema",
    "draftDetected": "de $schema",
    "draftDefault": "padrão",
    "errorsLabel": "Erros",
    "errorsTitle": "Erros",
    "errorsTitleWithCount": "Erros ({count})",
    "errorsColumnPath": "Caminho",
    "errorsColumnMessage": "Mensagem",
    "errorsColumnKeyword": "Palavra-chave",
    "noErrors": "Sem erros",
    "schemaObjectError": "O esquema deve ser um objeto JSON",
    "emptyMessage": "Forneça um JSON Schema e dados JSON válidos para ver os resultados"
  },
  "ar": {
    "inputsTitle": "المخطط والبيانات",
    "schemaLabel": "JSON Schema",
    "dataLabel": "بيانات JSON",
    "schemaPlaceholder": "ألصق JSON Schema هنا...",
    "dataPlaceholder": "ألصق بيانات JSON هنا...",
    "invalidJson": "JSON غير صالح",
    "optionsTitle": "خيارات التحقق",
    "validateFormats": "تحقق من التنسيقات (email, uri, uuid)",
    "allErrors": "عرض جميع الأخطاء",
    "resultTitle": "نتيجة التحقق",
    "statusLabel": "الحالة",
    "statusValid": "صالح",
    "statusInvalid": "غير صالح",
    "statusPending": "في انتظار الإدخال",
    "statusSchemaError": "خطأ في المخطط",
    "draftLabel": "مسودة المخطط",
    "draftDetected": "من $schema",
    "draftDefault": "افتراضي",
    "errorsLabel": "الأخطاء",
    "errorsTitle": "الأخطاء",
    "errorsTitleWithCount": "الأخطاء ({count})",
    "errorsColumnPath": "المسار",
    "errorsColumnMessage": "الرسالة",
    "errorsColumnKeyword": "الكلمة المفتاحية",
    "noErrors": "لا توجد أخطاء",
    "schemaObjectError": "يجب أن يكون المخطط كائن JSON",
    "emptyMessage": "قدّم JSON Schema وبيانات JSON صالحة لرؤية النتائج"
  },
  "hi": {
    "inputsTitle": "स्कीमा और डेटा",
    "schemaLabel": "JSON Schema",
    "dataLabel": "JSON डेटा",
    "schemaPlaceholder": "यहाँ JSON Schema पेस्ट करें...",
    "dataPlaceholder": "यहाँ JSON डेटा पेस्ट करें...",
    "invalidJson": "अमान्य JSON",
    "optionsTitle": "सत्यापन विकल्प",
    "validateFormats": "फॉर्मेट सत्यापित करें (email, uri, uuid)",
    "allErrors": "सभी त्रुटियां दिखाएँ",
    "resultTitle": "सत्यापन परिणाम",
    "statusLabel": "स्थिति",
    "statusValid": "मान्य",
    "statusInvalid": "अमान्य",
    "statusPending": "इनपुट का इंतज़ार",
    "statusSchemaError": "स्कीमा त्रुटि",
    "draftLabel": "स्कीमा ड्राफ्ट",
    "draftDetected": "$schema से",
    "draftDefault": "डिफ़ॉल्ट",
    "errorsLabel": "त्रुटियां",
    "errorsTitle": "त्रुटियां",
    "errorsTitleWithCount": "त्रुटियां ({count})",
    "errorsColumnPath": "पथ",
    "errorsColumnMessage": "संदेश",
    "errorsColumnKeyword": "कीवर्ड",
    "noErrors": "कोई त्रुटि नहीं",
    "schemaObjectError": "स्कीमा एक JSON ऑब्जेक्ट होना चाहिए",
    "emptyMessage": "परिणाम देखने के लिए मान्य JSON Schema और JSON डेटा दें"
  },
  "tr": {
    "inputsTitle": "Şema ve veriler",
    "schemaLabel": "JSON Schema",
    "dataLabel": "JSON verisi",
    "schemaPlaceholder": "JSON Schema'yı buraya yapıştırın...",
    "dataPlaceholder": "JSON verisini buraya yapıştırın...",
    "invalidJson": "Geçersiz JSON",
    "optionsTitle": "Doğrulama seçenekleri",
    "validateFormats": "Biçimleri doğrula (email, uri, uuid)",
    "allErrors": "Tüm hataları göster",
    "resultTitle": "Doğrulama sonucu",
    "statusLabel": "Durum",
    "statusValid": "Geçerli",
    "statusInvalid": "Geçersiz",
    "statusPending": "Girdi bekleniyor",
    "statusSchemaError": "Şema hatası",
    "draftLabel": "Şema taslağı",
    "draftDetected": "$schema'dan",
    "draftDefault": "varsayılan",
    "errorsLabel": "Hatalar",
    "errorsTitle": "Hatalar",
    "errorsTitleWithCount": "Hatalar ({count})",
    "errorsColumnPath": "Yol",
    "errorsColumnMessage": "Mesaj",
    "errorsColumnKeyword": "Anahtar kelime",
    "noErrors": "Hata yok",
    "schemaObjectError": "Şema bir JSON nesnesi olmalıdır",
    "emptyMessage": "Sonuçları görmek için geçerli JSON Schema ve JSON verisi sağlayın"
  },
  "nl": {
    "inputsTitle": "Schema en gegevens",
    "schemaLabel": "JSON Schema",
    "dataLabel": "JSON-gegevens",
    "schemaPlaceholder": "Plak JSON Schema hier...",
    "dataPlaceholder": "Plak JSON-gegevens hier...",
    "invalidJson": "Ongeldige JSON",
    "optionsTitle": "Validatieopties",
    "validateFormats": "Formaten valideren (email, uri, uuid)",
    "allErrors": "Alle fouten tonen",
    "resultTitle": "Validatieresultaat",
    "statusLabel": "Status",
    "statusValid": "Geldig",
    "statusInvalid": "Ongeldig",
    "statusPending": "Wachten op invoer",
    "statusSchemaError": "Schemafout",
    "draftLabel": "Schema-versie",
    "draftDetected": "van $schema",
    "draftDefault": "standaard",
    "errorsLabel": "Fouten",
    "errorsTitle": "Fouten",
    "errorsTitleWithCount": "Fouten ({count})",
    "errorsColumnPath": "Pad",
    "errorsColumnMessage": "Bericht",
    "errorsColumnKeyword": "Trefwoord",
    "noErrors": "Geen fouten",
    "schemaObjectError": "Het schema moet een JSON-object zijn",
    "emptyMessage": "Geef een geldig JSON Schema en JSON-gegevens om resultaten te zien"
  },
  "sv": {
    "inputsTitle": "Schema och data",
    "schemaLabel": "JSON Schema",
    "dataLabel": "JSON-data",
    "schemaPlaceholder": "Klistra in JSON Schema här...",
    "dataPlaceholder": "Klistra in JSON-data här...",
    "invalidJson": "Ogiltig JSON",
    "optionsTitle": "Valideringsalternativ",
    "validateFormats": "Validera format (email, uri, uuid)",
    "allErrors": "Visa alla fel",
    "resultTitle": "Valideringsresultat",
    "statusLabel": "Status",
    "statusValid": "Giltig",
    "statusInvalid": "Ogiltig",
    "statusPending": "Väntar på inmatning",
    "statusSchemaError": "Schemafel",
    "draftLabel": "Schemautkast",
    "draftDetected": "från $schema",
    "draftDefault": "standard",
    "errorsLabel": "Fel",
    "errorsTitle": "Fel",
    "errorsTitleWithCount": "Fel ({count})",
    "errorsColumnPath": "Sökväg",
    "errorsColumnMessage": "Meddelande",
    "errorsColumnKeyword": "Nyckelord",
    "noErrors": "Inga fel",
    "schemaObjectError": "Schemat måste vara ett JSON-objekt",
    "emptyMessage": "Ange giltigt JSON Schema och JSON-data för att se resultat"
  },
  "pl": {
    "inputsTitle": "Schemat i dane",
    "schemaLabel": "JSON Schema",
    "dataLabel": "Dane JSON",
    "schemaPlaceholder": "Wklej JSON Schema tutaj...",
    "dataPlaceholder": "Wklej dane JSON tutaj...",
    "invalidJson": "Nieprawidłowy JSON",
    "optionsTitle": "Opcje walidacji",
    "validateFormats": "Waliduj formaty (email, uri, uuid)",
    "allErrors": "Pokaż wszystkie błędy",
    "resultTitle": "Wynik walidacji",
    "statusLabel": "Status",
    "statusValid": "Poprawny",
    "statusInvalid": "Niepoprawny",
    "statusPending": "Oczekiwanie na dane",
    "statusSchemaError": "Błąd schematu",
    "draftLabel": "Wersja schematu",
    "draftDetected": "z $schema",
    "draftDefault": "domyślnie",
    "errorsLabel": "Błędy",
    "errorsTitle": "Błędy",
    "errorsTitleWithCount": "Błędy ({count})",
    "errorsColumnPath": "Ścieżka",
    "errorsColumnMessage": "Wiadomość",
    "errorsColumnKeyword": "Słowo kluczowe",
    "noErrors": "Brak błędów",
    "schemaObjectError": "Schemat musi być obiektem JSON",
    "emptyMessage": "Podaj poprawny JSON Schema i dane JSON, aby zobaczyć wyniki"
  },
  "vi": {
    "inputsTitle": "Schema và dữ liệu",
    "schemaLabel": "JSON Schema",
    "dataLabel": "Dữ liệu JSON",
    "schemaPlaceholder": "Dán JSON Schema vào đây...",
    "dataPlaceholder": "Dán dữ liệu JSON vào đây...",
    "invalidJson": "JSON không hợp lệ",
    "optionsTitle": "Tùy chọn xác thực",
    "validateFormats": "Xác thực định dạng (email, uri, uuid)",
    "allErrors": "Hiển thị tất cả lỗi",
    "resultTitle": "Kết quả xác thực",
    "statusLabel": "Trạng thái",
    "statusValid": "Hợp lệ",
    "statusInvalid": "Không hợp lệ",
    "statusPending": "Đang chờ dữ liệu",
    "statusSchemaError": "Lỗi schema",
    "draftLabel": "Bản nháp schema",
    "draftDetected": "từ $schema",
    "draftDefault": "mặc định",
    "errorsLabel": "Lỗi",
    "errorsTitle": "Lỗi",
    "errorsTitleWithCount": "Lỗi ({count})",
    "errorsColumnPath": "Đường dẫn",
    "errorsColumnMessage": "Thông báo",
    "errorsColumnKeyword": "Từ khóa",
    "noErrors": "Không có lỗi",
    "schemaObjectError": "Schema phải là một đối tượng JSON",
    "emptyMessage": "Hãy cung cấp JSON Schema và dữ liệu JSON hợp lệ để xem kết quả"
  },
  "th": {
    "inputsTitle": "สคีมาและข้อมูล",
    "schemaLabel": "JSON Schema",
    "dataLabel": "ข้อมูล JSON",
    "schemaPlaceholder": "วาง JSON Schema ที่นี่...",
    "dataPlaceholder": "วางข้อมูล JSON ที่นี่...",
    "invalidJson": "JSON ไม่ถูกต้อง",
    "optionsTitle": "ตัวเลือกการตรวจสอบ",
    "validateFormats": "ตรวจสอบรูปแบบ (email, uri, uuid)",
    "allErrors": "แสดงข้อผิดพลาดทั้งหมด",
    "resultTitle": "ผลการตรวจสอบ",
    "statusLabel": "สถานะ",
    "statusValid": "ถูกต้อง",
    "statusInvalid": "ไม่ถูกต้อง",
    "statusPending": "รอข้อมูล",
    "statusSchemaError": "ข้อผิดพลาดของสคีมา",
    "draftLabel": "ฉบับร่างสคีมา",
    "draftDetected": "จาก $schema",
    "draftDefault": "ค่าเริ่มต้น",
    "errorsLabel": "ข้อผิดพลาด",
    "errorsTitle": "ข้อผิดพลาด",
    "errorsTitleWithCount": "ข้อผิดพลาด ({count})",
    "errorsColumnPath": "เส้นทาง",
    "errorsColumnMessage": "ข้อความ",
    "errorsColumnKeyword": "คีย์เวิร์ด",
    "noErrors": "ไม่มีข้อผิดพลาด",
    "schemaObjectError": "สคีมาต้องเป็นอ็อบเจ็กต์ JSON",
    "emptyMessage": "โปรดระบุ JSON Schema และข้อมูล JSON ที่ถูกต้องเพื่อดูผลลัพธ์"
  },
  "id": {
    "inputsTitle": "Skema dan data",
    "schemaLabel": "JSON Schema",
    "dataLabel": "Data JSON",
    "schemaPlaceholder": "Tempel JSON Schema di sini...",
    "dataPlaceholder": "Tempel data JSON di sini...",
    "invalidJson": "JSON tidak valid",
    "optionsTitle": "Opsi validasi",
    "validateFormats": "Validasi format (email, uri, uuid)",
    "allErrors": "Tampilkan semua kesalahan",
    "resultTitle": "Hasil validasi",
    "statusLabel": "Status",
    "statusValid": "Valid",
    "statusInvalid": "Tidak valid",
    "statusPending": "Menunggu input",
    "statusSchemaError": "Kesalahan skema",
    "draftLabel": "Draf skema",
    "draftDetected": "dari $schema",
    "draftDefault": "default",
    "errorsLabel": "Kesalahan",
    "errorsTitle": "Kesalahan",
    "errorsTitleWithCount": "Kesalahan ({count})",
    "errorsColumnPath": "Jalur",
    "errorsColumnMessage": "Pesan",
    "errorsColumnKeyword": "Kata kunci",
    "noErrors": "Tidak ada kesalahan",
    "schemaObjectError": "Skema harus berupa objek JSON",
    "emptyMessage": "Berikan JSON Schema dan data JSON yang valid untuk melihat hasil"
  },
  "he": {
    "inputsTitle": "סכימה ונתונים",
    "schemaLabel": "JSON Schema",
    "dataLabel": "נתוני JSON",
    "schemaPlaceholder": "הדביקו JSON Schema כאן...",
    "dataPlaceholder": "הדביקו נתוני JSON כאן...",
    "invalidJson": "JSON לא תקין",
    "optionsTitle": "אפשרויות אימות",
    "validateFormats": "אמת פורמטים (email, uri, uuid)",
    "allErrors": "הצג את כל השגיאות",
    "resultTitle": "תוצאת אימות",
    "statusLabel": "סטטוס",
    "statusValid": "תקין",
    "statusInvalid": "לא תקין",
    "statusPending": "ממתין לקלט",
    "statusSchemaError": "שגיאת סכימה",
    "draftLabel": "טיוטת סכימה",
    "draftDetected": "מ־$schema",
    "draftDefault": "ברירת מחדל",
    "errorsLabel": "שגיאות",
    "errorsTitle": "שגיאות",
    "errorsTitleWithCount": "שגיאות ({count})",
    "errorsColumnPath": "נתיב",
    "errorsColumnMessage": "הודעה",
    "errorsColumnKeyword": "מילת מפתח",
    "noErrors": "אין שגיאות",
    "schemaObjectError": "הסכימה חייבת להיות אובייקט JSON",
    "emptyMessage": "ספקו JSON Schema ונתוני JSON תקינים כדי לראות תוצאות"
  },
  "ms": {
    "inputsTitle": "Skema dan data",
    "schemaLabel": "JSON Schema",
    "dataLabel": "Data JSON",
    "schemaPlaceholder": "Tampal JSON Schema di sini...",
    "dataPlaceholder": "Tampal data JSON di sini...",
    "invalidJson": "JSON tidak sah",
    "optionsTitle": "Pilihan pengesahan",
    "validateFormats": "Sahkan format (email, uri, uuid)",
    "allErrors": "Papar semua ralat",
    "resultTitle": "Keputusan pengesahan",
    "statusLabel": "Status",
    "statusValid": "Sah",
    "statusInvalid": "Tidak sah",
    "statusPending": "Menunggu input",
    "statusSchemaError": "Ralat skema",
    "draftLabel": "Draf skema",
    "draftDetected": "daripada $schema",
    "draftDefault": "lalai",
    "errorsLabel": "Ralat",
    "errorsTitle": "Ralat",
    "errorsTitleWithCount": "Ralat ({count})",
    "errorsColumnPath": "Laluan",
    "errorsColumnMessage": "Mesej",
    "errorsColumnKeyword": "Kata kunci",
    "noErrors": "Tiada ralat",
    "schemaObjectError": "Skema mesti menjadi objek JSON",
    "emptyMessage": "Sediakan JSON Schema dan data JSON yang sah untuk melihat hasil"
  },
  "no": {
    "inputsTitle": "Skjema og data",
    "schemaLabel": "JSON Schema",
    "dataLabel": "JSON-data",
    "schemaPlaceholder": "Lim inn JSON Schema her...",
    "dataPlaceholder": "Lim inn JSON-data her...",
    "invalidJson": "Ugyldig JSON",
    "optionsTitle": "Valideringsalternativer",
    "validateFormats": "Valider formater (email, uri, uuid)",
    "allErrors": "Vis alle feil",
    "resultTitle": "Valideringsresultat",
    "statusLabel": "Status",
    "statusValid": "Gyldig",
    "statusInvalid": "Ugyldig",
    "statusPending": "Venter på inndata",
    "statusSchemaError": "Skjemafeil",
    "draftLabel": "Skjemautkast",
    "draftDetected": "fra $schema",
    "draftDefault": "standard",
    "errorsLabel": "Feil",
    "errorsTitle": "Feil",
    "errorsTitleWithCount": "Feil ({count})",
    "errorsColumnPath": "Sti",
    "errorsColumnMessage": "Melding",
    "errorsColumnKeyword": "Nøkkelord",
    "noErrors": "Ingen feil",
    "schemaObjectError": "Skjemaet må være et JSON-objekt",
    "emptyMessage": "Oppgi et gyldig JSON Schema og JSON-data for å se resultater"
  }
}
</i18n>
