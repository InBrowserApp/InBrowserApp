<template>
  <OpenApiToolbar
    :output-text="outputText"
    :download-url="downloadUrl"
    @import="importFromFile"
    @import-url="openImportUrlModal"
    @load-sample="loadSample"
  />
  <OpenApiInputOutput
    :open-api-text="openApiText"
    :accept="accept"
    :input-error="inputError"
    :input-status="inputStatus"
    :output-error="outputError"
    :output-text="outputText"
    :external-refs="externalRefs"
    :is-generating="isGenerating"
    :handle-input="handleInput"
  />
  <OpenApiOptions
    v-model:additional-properties="additionalProperties"
    v-model:default-non-nullable="defaultNonNullable"
    v-model:properties-required-by-default="propertiesRequiredByDefault"
    v-model:export-type="exportType"
    v-model:enum-output="enumOutput"
    v-model:path-params-as-types="pathParamsAsTypes"
    v-model:root-types="rootTypes"
    v-model:make-paths-enum="makePathsEnum"
    v-model:generate-path-params="generatePathParams"
    v-model:immutable="immutable"
    v-model:exclude-deprecated="excludeDeprecated"
    v-model:include-header="includeHeader"
  />
  <OpenApiImportUrlModal
    v-model:show="showImportUrlModal"
    :import-url="importUrl"
    :import-url-error="importUrlError"
    :import-url-status="importUrlStatus"
    :is-importing="isImportingUrl"
    :on-update-input="handleImportUrlInput"
    :on-enter="handleImportUrlEnter"
    :on-close="closeImportUrlModal"
    :on-confirm="importFromUrl"
  />
</template>
<script setup lang="ts">
import { computed, ref } from 'vue'
import { computedAsync, useDebounce, useObjectUrl, useStorage } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import { fileOpen } from 'browser-fs-access'
import {
  generateOpenApiTypes,
  parseOpenApiDocument,
  type OpenApiDocument,
  type OpenApiTypegenOptions,
} from '@utils/openapi-typescript'
import { sampleOpenApi } from '../sampleOpenApi'
import OpenApiImportUrlModal from './OpenApiImportUrlModal.vue'
import OpenApiInputOutput from './OpenApiInputOutput.vue'
import OpenApiOptions from './OpenApiOptions.vue'
import OpenApiToolbar from './OpenApiToolbar.vue'
const { t } = useI18n({ useScope: 'local' })
const accept = '.json,.yaml,.yml,.txt'
const openApiText = useStorage('tools:openapi-to-typescript:input', sampleOpenApi)
const includeHeader = useStorage('tools:openapi-to-typescript:include-header', true)
const additionalProperties = useStorage('tools:openapi-to-typescript:additional-properties', false)
const defaultNonNullable = useStorage('tools:openapi-to-typescript:default-non-nullable', true)
const propertiesRequiredByDefault = useStorage(
  'tools:openapi-to-typescript:properties-required-by-default',
  false,
)
const exportType = useStorage('tools:openapi-to-typescript:export-type', false)
const enumOutput = useStorage('tools:openapi-to-typescript:enum', false)
const pathParamsAsTypes = useStorage('tools:openapi-to-typescript:path-params-as-types', false)
const rootTypes = useStorage('tools:openapi-to-typescript:root-types', false)
const makePathsEnum = useStorage('tools:openapi-to-typescript:make-paths-enum', false)
const generatePathParams = useStorage('tools:openapi-to-typescript:generate-path-params', false)
const immutable = useStorage('tools:openapi-to-typescript:immutable', false)
const excludeDeprecated = useStorage('tools:openapi-to-typescript:exclude-deprecated', false)
const debouncedOpenApiText = useDebounce(
  computed(() => openApiText.value ?? ''),
  200,
)
const isGenerating = ref(false)
const showImportUrlModal = ref(false)
const importUrl = ref('')
const importUrlError = ref('')
const isImportingUrl = ref(false)
const parseResult = computed(() => parseOpenApiDocument(debouncedOpenApiText.value ?? ''))
const inputError = computed(() => {
  if (parseResult.value.ok || parseResult.value.code === 'empty') return ''
  if (parseResult.value.code === 'invalid') {
    const detail = parseResult.value.message
    return detail ? t('invalidDocumentWithMessage', { message: detail }) : t('invalidDocument')
  }
  if (parseResult.value.code === 'not-object') return t('invalidRoot')
  if (parseResult.value.code === 'unsupported-version') return t('unsupportedVersion')
  return t('invalidDocument')
})

const inputStatus = computed(() => {
  if (!debouncedOpenApiText.value.trim()) return undefined
  return inputError.value ? 'error' : 'success'
})

const externalRefs = computed(() => (parseResult.value.ok ? parseResult.value.externalRefs : []))

const generationOptions = computed<OpenApiTypegenOptions>(() => ({
  additionalProperties: additionalProperties.value,
  defaultNonNullable: defaultNonNullable.value,
  propertiesRequiredByDefault: propertiesRequiredByDefault.value,
  exportType: exportType.value,
  enum: enumOutput.value,
  pathParamsAsTypes: pathParamsAsTypes.value,
  rootTypes: rootTypes.value,
  makePathsEnum: makePathsEnum.value,
  generatePathParams: generatePathParams.value,
  immutable: immutable.value,
  excludeDeprecated: excludeDeprecated.value,
  includeHeader: includeHeader.value,
}))

const outputState = computedAsync(
  () => {
    if (!debouncedOpenApiText.value.trim()) {
      return { output: '', error: '' }
    }
    if (!parseResult.value.ok) {
      return { output: '', error: inputError.value }
    }
    if (externalRefs.value.length) {
      return {
        output: '',
        error: t('externalRefError', { count: externalRefs.value.length }),
      }
    }
    try {
      const output = generateOpenApiTypes(
        parseResult.value.document as OpenApiDocument,
        generationOptions.value,
      )
      return { output, error: '' }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      return { output: '', error: message }
    }
  },
  { output: '', error: '' },
  { evaluating: isGenerating },
)

const outputText = computed(() => outputState.value.output)
const downloadBlob = computed(() => {
  if (!outputText.value) return null
  return new Blob([outputText.value], { type: 'text/plain;charset=utf-8' })
})
const downloadUrl = useObjectUrl(downloadBlob)
const outputError = computed(() => outputState.value.error)
const importUrlStatus = computed(() => (importUrlError.value ? 'error' : undefined))

function loadSample() {
  openApiText.value = sampleOpenApi
}

async function importFromFile() {
  const file = await fileOpen({
    extensions: ['.json', '.yaml', '.yml', '.txt'],
  })
  openApiText.value = await file.text()
}

function openImportUrlModal() {
  showImportUrlModal.value = true
  importUrlError.value = ''
}

function closeImportUrlModal() {
  showImportUrlModal.value = false
  importUrlError.value = ''
}

function handleImportUrlInput(value: string) {
  importUrl.value = value
  if (importUrlError.value) {
    importUrlError.value = ''
  }
}

function handleImportUrlEnter(event: KeyboardEvent) {
  if (event.isComposing || isImportingUrl.value) return
  importFromUrl()
}

async function importFromUrl() {
  const value = importUrl.value.trim()
  if (!value) {
    importUrlError.value = t('importUrlEmptyError')
    return
  }

  let parsedUrl: URL
  try {
    parsedUrl = new URL(value)
  } catch {
    importUrlError.value = t('importUrlInvalidError')
    return
  }

  if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
    importUrlError.value = t('importUrlInvalidError')
    return
  }

  isImportingUrl.value = true
  importUrlError.value = ''

  try {
    const response = await fetch(value, { mode: 'cors' })
    if (!response.ok) {
      const status = response.status ? `${response.status}` : ''
      const statusText = response.statusText ? ` ${response.statusText}` : ''
      throw new Error(`${status}${statusText}`.trim() || 'Request failed')
    }
    openApiText.value = await response.text()
    closeImportUrlModal()
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    importUrlError.value = t('importUrlFetchError', { message })
  } finally {
    isImportingUrl.value = false
  }
}

async function handleInput(value: string | File) {
  if (typeof value === 'string') {
    openApiText.value = value
    return
  }
  try {
    openApiText.value = await value.text()
  } catch {
    openApiText.value = ''
  }
}
</script>

<i18n lang="json">
{
  "en": {
    "invalidDocument": "Invalid OpenAPI document",
    "invalidDocumentWithMessage": "Invalid OpenAPI document: {message}",
    "invalidRoot": "OpenAPI document must be an object",
    "unsupportedVersion": "Only OpenAPI 3.0/3.1 is supported",
    "externalRefError": "External $ref is not supported ({count}). Inline or bundle the schema.",
    "importUrlEmptyError": "Enter a URL to import.",
    "importUrlInvalidError": "URL must start with http:// or https://.",
    "importUrlFetchError": "Failed to fetch the URL: {message}"
  },
  "zh": {
    "invalidDocument": "无效的 OpenAPI 文档",
    "invalidDocumentWithMessage": "无效的 OpenAPI 文档：{message}",
    "invalidRoot": "OpenAPI 文档必须是对象",
    "unsupportedVersion": "仅支持 OpenAPI 3.0/3.1",
    "externalRefError": "不支持外部 $ref（{count}）。请内联或打包该 schema。",
    "importUrlEmptyError": "请输入要导入的 URL。",
    "importUrlInvalidError": "URL 必须以 http:// 或 https:// 开头。",
    "importUrlFetchError": "获取 URL 失败：{message}"
  },
  "zh-CN": {
    "invalidDocument": "无效的 OpenAPI 文档",
    "invalidDocumentWithMessage": "无效的 OpenAPI 文档：{message}",
    "invalidRoot": "OpenAPI 文档必须是对象",
    "unsupportedVersion": "仅支持 OpenAPI 3.0/3.1",
    "externalRefError": "不支持外部 $ref（{count}）。请内联或打包该 schema。",
    "importUrlEmptyError": "请输入要导入的 URL。",
    "importUrlInvalidError": "URL 必须以 http:// 或 https:// 开头。",
    "importUrlFetchError": "获取 URL 失败：{message}"
  },
  "zh-TW": {
    "invalidDocument": "無效的 OpenAPI 文件",
    "invalidDocumentWithMessage": "無效的 OpenAPI 文件：{message}",
    "invalidRoot": "OpenAPI 文件必須是物件",
    "unsupportedVersion": "僅支援 OpenAPI 3.0/3.1",
    "externalRefError": "不支援外部 $ref（{count}）。請內嵌或打包該 schema。",
    "importUrlEmptyError": "請輸入要匯入的 URL。",
    "importUrlInvalidError": "URL 必須以 http:// 或 https:// 開頭。",
    "importUrlFetchError": "取得 URL 失敗：{message}"
  },
  "zh-HK": {
    "invalidDocument": "無效的 OpenAPI 文件",
    "invalidDocumentWithMessage": "無效的 OpenAPI 文件：{message}",
    "invalidRoot": "OpenAPI 文件必須是物件",
    "unsupportedVersion": "僅支援 OpenAPI 3.0/3.1",
    "externalRefError": "不支援外部 $ref（{count}）。請內嵌或打包該 schema。",
    "importUrlEmptyError": "請輸入要匯入的 URL。",
    "importUrlInvalidError": "URL 必須以 http:// 或 https:// 開頭。",
    "importUrlFetchError": "取得 URL 失敗：{message}"
  },
  "es": {
    "invalidDocument": "Documento OpenAPI inválido",
    "invalidDocumentWithMessage": "Documento OpenAPI inválido: {message}",
    "invalidRoot": "El documento OpenAPI debe ser un objeto",
    "unsupportedVersion": "Solo se admite OpenAPI 3.0/3.1",
    "externalRefError": "No se admite $ref externo ({count}). Incrusta o empaqueta el schema.",
    "importUrlEmptyError": "Introduce una URL para importar.",
    "importUrlInvalidError": "La URL debe empezar con http:// o https://.",
    "importUrlFetchError": "No se pudo obtener la URL: {message}"
  },
  "fr": {
    "invalidDocument": "Document OpenAPI invalide",
    "invalidDocumentWithMessage": "Document OpenAPI invalide : {message}",
    "invalidRoot": "Le document OpenAPI doit être un objet",
    "unsupportedVersion": "Seul OpenAPI 3.0/3.1 est pris en charge",
    "externalRefError": "$ref externe non pris en charge ({count}). Intégrez ou regroupez le schéma.",
    "importUrlEmptyError": "Saisissez une URL à importer.",
    "importUrlInvalidError": "L'URL doit commencer par http:// ou https://.",
    "importUrlFetchError": "Échec de la récupération de l'URL : {message}"
  },
  "de": {
    "invalidDocument": "Ungültiges OpenAPI-Dokument",
    "invalidDocumentWithMessage": "Ungültiges OpenAPI-Dokument: {message}",
    "invalidRoot": "OpenAPI-Dokument muss ein Objekt sein",
    "unsupportedVersion": "Nur OpenAPI 3.0/3.1 wird unterstützt",
    "externalRefError": "Externe $ref wird nicht unterstützt ({count}). Schema inline/bündeln.",
    "importUrlEmptyError": "Bitte eine URL zum Importieren eingeben.",
    "importUrlInvalidError": "Die URL muss mit http:// oder https:// beginnen.",
    "importUrlFetchError": "URL konnte nicht abgerufen werden: {message}"
  },
  "it": {
    "invalidDocument": "Documento OpenAPI non valido",
    "invalidDocumentWithMessage": "Documento OpenAPI non valido: {message}",
    "invalidRoot": "Il documento OpenAPI deve essere un oggetto",
    "unsupportedVersion": "È supportato solo OpenAPI 3.0/3.1",
    "externalRefError": "$ref esterno non supportato ({count}). In linea o raggruppa lo schema.",
    "importUrlEmptyError": "Inserisci un URL da importare.",
    "importUrlInvalidError": "L'URL deve iniziare con http:// o https://.",
    "importUrlFetchError": "Impossibile recuperare l'URL: {message}"
  },
  "ja": {
    "invalidDocument": "無効な OpenAPI ドキュメント",
    "invalidDocumentWithMessage": "無効な OpenAPI ドキュメント: {message}",
    "invalidRoot": "OpenAPI ドキュメントはオブジェクトである必要があります",
    "unsupportedVersion": "OpenAPI 3.0/3.1 のみ対応",
    "externalRefError": "外部 $ref は未対応（{count}）。スキーマをインライン化/バンドルしてください。",
    "importUrlEmptyError": "インポートする URL を入力してください。",
    "importUrlInvalidError": "URL は http:// または https:// で始まる必要があります。",
    "importUrlFetchError": "URL の取得に失敗しました: {message}"
  },
  "ko": {
    "invalidDocument": "잘못된 OpenAPI 문서",
    "invalidDocumentWithMessage": "잘못된 OpenAPI 문서: {message}",
    "invalidRoot": "OpenAPI 문서는 객체여야 합니다",
    "unsupportedVersion": "OpenAPI 3.0/3.1만 지원합니다",
    "externalRefError": "외부 $ref 미지원({count}). 스키마를 인라인/번들하세요.",
    "importUrlEmptyError": "가져올 URL을 입력하세요.",
    "importUrlInvalidError": "URL은 http:// 또는 https://로 시작해야 합니다.",
    "importUrlFetchError": "URL 가져오기에 실패했습니다: {message}"
  },
  "ru": {
    "invalidDocument": "Недопустимый документ OpenAPI",
    "invalidDocumentWithMessage": "Недопустимый документ OpenAPI: {message}",
    "invalidRoot": "Документ OpenAPI должен быть объектом",
    "unsupportedVersion": "Поддерживается только OpenAPI 3.0/3.1",
    "externalRefError": "Внешний $ref не поддерживается ({count}). Встроите или объедините схему.",
    "importUrlEmptyError": "Введите URL для импорта.",
    "importUrlInvalidError": "URL должен начинаться с http:// или https://.",
    "importUrlFetchError": "Не удалось получить URL: {message}"
  },
  "pt": {
    "invalidDocument": "Documento OpenAPI inválido",
    "invalidDocumentWithMessage": "Documento OpenAPI inválido: {message}",
    "invalidRoot": "O documento OpenAPI deve ser um objeto",
    "unsupportedVersion": "Somente OpenAPI 3.0/3.1 é suportado",
    "externalRefError": "$ref externo não suportado ({count}). Incorpore ou agregue o schema.",
    "importUrlEmptyError": "Insira uma URL para importar.",
    "importUrlInvalidError": "A URL deve começar com http:// ou https://.",
    "importUrlFetchError": "Falha ao obter a URL: {message}"
  },
  "ar": {
    "invalidDocument": "مستند OpenAPI غير صالح",
    "invalidDocumentWithMessage": "مستند OpenAPI غير صالح: {message}",
    "invalidRoot": "يجب أن يكون مستند OpenAPI كائنًا",
    "unsupportedVersion": "يدعم فقط OpenAPI 3.0/3.1",
    "externalRefError": "‏$ref خارجي غير مدعوم ({count}). قم بدمج المخطط أو تضمينه.",
    "importUrlEmptyError": "أدخل عنوان URL للاستيراد.",
    "importUrlInvalidError": "يجب أن يبدأ عنوان URL بـ http:// أو https://.",
    "importUrlFetchError": "فشل جلب عنوان URL: {message}"
  },
  "hi": {
    "invalidDocument": "अमान्य OpenAPI दस्तावेज़",
    "invalidDocumentWithMessage": "अमान्य OpenAPI दस्तावेज़: {message}",
    "invalidRoot": "OpenAPI दस्तावेज़ एक ऑब्जेक्ट होना चाहिए",
    "unsupportedVersion": "केवल OpenAPI 3.0/3.1 समर्थित है",
    "externalRefError": "बाहरी $ref समर्थित नहीं है ({count})। schema को inline या bundle करें।",
    "importUrlEmptyError": "आयात करने के लिए URL दर्ज करें।",
    "importUrlInvalidError": "URL को http:// या https:// से शुरू होना चाहिए।",
    "importUrlFetchError": "URL लाने में विफल: {message}"
  },
  "tr": {
    "invalidDocument": "Geçersiz OpenAPI belgesi",
    "invalidDocumentWithMessage": "Geçersiz OpenAPI belgesi: {message}",
    "invalidRoot": "OpenAPI belgesi bir nesne olmalıdır",
    "unsupportedVersion": "Yalnızca OpenAPI 3.0/3.1 desteklenir",
    "externalRefError": "Harici $ref desteklenmiyor ({count}). Şemayı içe gömün veya paketleyin.",
    "importUrlEmptyError": "İçe aktarmak için bir URL girin.",
    "importUrlInvalidError": "URL http:// veya https:// ile başlamalıdır.",
    "importUrlFetchError": "URL alınamadı: {message}"
  },
  "nl": {
    "invalidDocument": "Ongeldig OpenAPI-document",
    "invalidDocumentWithMessage": "Ongeldig OpenAPI-document: {message}",
    "invalidRoot": "OpenAPI-document moet een object zijn",
    "unsupportedVersion": "Alleen OpenAPI 3.0/3.1 wordt ondersteund",
    "externalRefError": "Externe $ref wordt niet ondersteund ({count}). Inline of bundel het schema.",
    "importUrlEmptyError": "Voer een URL in om te importeren.",
    "importUrlInvalidError": "De URL moet beginnen met http:// of https://.",
    "importUrlFetchError": "URL ophalen mislukt: {message}"
  },
  "sv": {
    "invalidDocument": "Ogiltigt OpenAPI-dokument",
    "invalidDocumentWithMessage": "Ogiltigt OpenAPI-dokument: {message}",
    "invalidRoot": "OpenAPI-dokument måste vara ett objekt",
    "unsupportedVersion": "Endast OpenAPI 3.0/3.1 stöds",
    "externalRefError": "Extern $ref stöds inte ({count}). Inkludera eller bunt ihop schemat.",
    "importUrlEmptyError": "Ange en URL att importera.",
    "importUrlInvalidError": "URL:en måste börja med http:// eller https://.",
    "importUrlFetchError": "Det gick inte att hämta URL:en: {message}"
  },
  "pl": {
    "invalidDocument": "Nieprawidłowy dokument OpenAPI",
    "invalidDocumentWithMessage": "Nieprawidłowy dokument OpenAPI: {message}",
    "invalidRoot": "Dokument OpenAPI musi być obiektem",
    "unsupportedVersion": "Obsługiwane jest tylko OpenAPI 3.0/3.1",
    "externalRefError": "Zewnętrzny $ref nie jest obsługiwany ({count}). Wbuduj lub zbundluj schemat.",
    "importUrlEmptyError": "Wpisz URL do importu.",
    "importUrlInvalidError": "URL musi zaczynać się od http:// lub https://.",
    "importUrlFetchError": "Nie udało się pobrać URL: {message}"
  },
  "vi": {
    "invalidDocument": "Tài liệu OpenAPI không hợp lệ",
    "invalidDocumentWithMessage": "Tài liệu OpenAPI không hợp lệ: {message}",
    "invalidRoot": "Tài liệu OpenAPI phải là một đối tượng",
    "unsupportedVersion": "Chỉ hỗ trợ OpenAPI 3.0/3.1",
    "externalRefError": "$ref bên ngoài không được hỗ trợ ({count}). Hãy inline hoặc bundle schema.",
    "importUrlEmptyError": "Nhập URL để import.",
    "importUrlInvalidError": "URL phải bắt đầu bằng http:// hoặc https://.",
    "importUrlFetchError": "Không thể tải URL: {message}"
  },
  "th": {
    "invalidDocument": "เอกสาร OpenAPI ไม่ถูกต้อง",
    "invalidDocumentWithMessage": "เอกสาร OpenAPI ไม่ถูกต้อง: {message}",
    "invalidRoot": "เอกสาร OpenAPI ต้องเป็นอ็อบเจ็กต์",
    "unsupportedVersion": "รองรับเฉพาะ OpenAPI 3.0/3.1",
    "externalRefError": "ไม่รองรับ $ref ภายนอก ({count}) โปรด inline หรือ bundle schema",
    "importUrlEmptyError": "กรุณาใส่ URL เพื่อ import",
    "importUrlInvalidError": "URL ต้องขึ้นต้นด้วย http:// หรือ https://",
    "importUrlFetchError": "ไม่สามารถดึง URL ได้: {message}"
  },
  "id": {
    "invalidDocument": "Dokumen OpenAPI tidak valid",
    "invalidDocumentWithMessage": "Dokumen OpenAPI tidak valid: {message}",
    "invalidRoot": "Dokumen OpenAPI harus berupa objek",
    "unsupportedVersion": "Hanya OpenAPI 3.0/3.1 yang didukung",
    "externalRefError": "$ref eksternal tidak didukung ({count}). Inline atau bundle schema.",
    "importUrlEmptyError": "Masukkan URL untuk diimpor.",
    "importUrlInvalidError": "URL harus diawali dengan http:// atau https://.",
    "importUrlFetchError": "Gagal mengambil URL: {message}"
  },
  "he": {
    "invalidDocument": "מסמך OpenAPI לא תקין",
    "invalidDocumentWithMessage": "מסמך OpenAPI לא תקין: {message}",
    "invalidRoot": "מסמך OpenAPI חייב להיות אובייקט",
    "unsupportedVersion": "נתמך רק OpenAPI 3.0/3.1",
    "externalRefError": "$ref חיצוני אינו נתמך ({count}). נא להטמיע או לאגד את הסכמה.",
    "importUrlEmptyError": "הזן כתובת URL לייבוא.",
    "importUrlInvalidError": "ה-URL חייב להתחיל ב‑http:// או https://.",
    "importUrlFetchError": "נכשל בטעינת ה-URL: {message}"
  },
  "ms": {
    "invalidDocument": "Dokumen OpenAPI tidak sah",
    "invalidDocumentWithMessage": "Dokumen OpenAPI tidak sah: {message}",
    "invalidRoot": "Dokumen OpenAPI mestilah objek",
    "unsupportedVersion": "Hanya OpenAPI 3.0/3.1 disokong",
    "externalRefError": "$ref luaran tidak disokong ({count}). Sila inline atau bundle skema.",
    "importUrlEmptyError": "Masukkan URL untuk diimport.",
    "importUrlInvalidError": "URL mesti bermula dengan http:// atau https://.",
    "importUrlFetchError": "Gagal mendapatkan URL: {message}"
  },
  "no": {
    "invalidDocument": "Ugyldig OpenAPI-dokument",
    "invalidDocumentWithMessage": "Ugyldig OpenAPI-dokument: {message}",
    "invalidRoot": "OpenAPI-dokumentet må være et objekt",
    "unsupportedVersion": "Kun OpenAPI 3.0/3.1 støttes",
    "externalRefError": "Ekstern $ref støttes ikke ({count}). Inline eller bunt schemaet.",
    "importUrlEmptyError": "Skriv inn en URL å importere.",
    "importUrlInvalidError": "URL-en må starte med http:// eller https://.",
    "importUrlFetchError": "Kunne ikke hente URL-en: {message}"
  }
}
</i18n>
