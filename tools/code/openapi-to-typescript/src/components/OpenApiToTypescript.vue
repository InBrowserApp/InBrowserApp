<template>
  <ToolSection>
    <n-flex align="center" justify="space-between" wrap>
      <n-flex align="center" wrap>
        <n-button @click="importFromFile" text>
          <template #icon>
            <n-icon :component="Document16Regular" />
          </template>
          {{ t('actionsImport') }}
        </n-button>
        <n-button @click="openImportUrlModal" text>
          <template #icon>
            <n-icon :component="Link16Regular" />
          </template>
          {{ t('actionsImportUrl') }}
        </n-button>
        <n-button @click="loadSample" text>
          <template #icon>
            <n-icon :component="Wand16Regular" />
          </template>
          {{ t('actionsSample') }}
        </n-button>
      </n-flex>
      <n-flex align="center" wrap>
        <CopyToClipboardButton :content="outputText" />
        <n-button
          tag="a"
          text
          :href="downloadUrl ?? undefined"
          download="openapi-types.d.ts"
          :disabled="!downloadUrl"
        >
          <template #icon>
            <n-icon :component="ArrowDownload16Regular" />
          </template>
          {{ t('actionsDownload') }}
        </n-button>
      </n-flex>
    </n-flex>
  </ToolSection>

  <ToolSection>
    <ToolSectionHeader>{{ t('inputTitle') }}</ToolSectionHeader>
    <n-grid cols="1 s:2" responsive="screen" :x-gap="12" :y-gap="12">
      <n-form-item-gi
        :label="t('inputLabel')"
        :show-feedback="Boolean(inputError)"
        :validation-status="inputStatus"
      >
        <TextOrFileInput
          class="monospace-input"
          :value="openApiText"
          :accept="accept"
          :placeholder="t('inputPlaceholder')"
          :status="inputStatus"
          :wrap-with-form-item="false"
          @update:value="handleInput"
        />
        <template v-if="inputError" #feedback>
          <n-text type="error">{{ inputError }}</n-text>
        </template>
      </n-form-item-gi>

      <n-form-item-gi :label="t('outputLabel')" :show-feedback="false">
        <n-spin :show="isGenerating">
          <n-alert v-if="outputError" type="error" :bordered="false">
            {{ outputError }}
          </n-alert>
          <n-card v-else size="small">
            <n-code
              v-if="outputText"
              :code="outputText"
              language="typescript"
              :hljs="hljs"
              word-wrap
            />
            <n-text v-else depth="3">{{ t('outputEmpty') }}</n-text>
          </n-card>
          <n-text v-for="ref in externalRefs" :key="ref" depth="3" class="external-ref-item">
            {{ ref }}
          </n-text>
        </n-spin>
      </n-form-item-gi>
    </n-grid>
  </ToolSection>

  <ToolSection>
    <ToolSectionHeader>{{ t('optionsTitle') }}</ToolSectionHeader>
    <n-grid cols="1 s:2 m:3" responsive="screen" :x-gap="12" :y-gap="8">
      <n-form-item-gi :label="t('optionAdditionalProperties')" :show-feedback="false">
        <n-switch v-model:value="additionalProperties" />
      </n-form-item-gi>
      <n-form-item-gi :label="t('optionDefaultNonNullable')" :show-feedback="false">
        <n-switch v-model:value="defaultNonNullable" />
      </n-form-item-gi>
      <n-form-item-gi :label="t('optionPropertiesRequiredByDefault')" :show-feedback="false">
        <n-switch v-model:value="propertiesRequiredByDefault" />
      </n-form-item-gi>
      <n-form-item-gi :label="t('optionExportType')" :show-feedback="false">
        <n-switch v-model:value="exportType" />
      </n-form-item-gi>
      <n-form-item-gi :label="t('optionEnum')" :show-feedback="false">
        <n-switch v-model:value="enumOutput" />
      </n-form-item-gi>
      <n-form-item-gi :label="t('optionPathParamsAsTypes')" :show-feedback="false">
        <n-switch v-model:value="pathParamsAsTypes" />
      </n-form-item-gi>
      <n-form-item-gi :label="t('optionRootTypes')" :show-feedback="false">
        <n-switch v-model:value="rootTypes" />
      </n-form-item-gi>
      <n-form-item-gi :label="t('optionMakePathsEnum')" :show-feedback="false">
        <n-switch v-model:value="makePathsEnum" />
      </n-form-item-gi>
      <n-form-item-gi :label="t('optionGeneratePathParams')" :show-feedback="false">
        <n-switch v-model:value="generatePathParams" />
      </n-form-item-gi>
      <n-form-item-gi :label="t('optionImmutable')" :show-feedback="false">
        <n-switch v-model:value="immutable" />
      </n-form-item-gi>
      <n-form-item-gi :label="t('optionExcludeDeprecated')" :show-feedback="false">
        <n-switch v-model:value="excludeDeprecated" />
      </n-form-item-gi>
      <n-form-item-gi :label="t('optionIncludeHeader')" :show-feedback="false">
        <n-switch v-model:value="includeHeader" />
      </n-form-item-gi>
    </n-grid>
  </ToolSection>

  <n-modal
    v-model:show="showImportUrlModal"
    preset="card"
    :title="t('importUrlTitle')"
    :style="modalStyle"
    :segmented="modalSegmented"
    :bordered="false"
    size="large"
    :mask-closable="false"
  >
    <n-space vertical size="small">
      <n-alert type="warning" :bordered="false">
        {{ t('importUrlWarning') }}
      </n-alert>
      <n-form-item
        :label="t('importUrlLabel')"
        :show-feedback="Boolean(importUrlError)"
        :validation-status="importUrlStatus"
      >
        <n-input
          class="monospace-input"
          :value="importUrl"
          :placeholder="t('importUrlPlaceholder')"
          :status="importUrlStatus"
          :disabled="isImportingUrl"
          @update:value="handleImportUrlInput"
          @keydown.enter="handleImportUrlEnter"
        />
        <template v-if="importUrlError" #feedback>
          <n-text type="error">{{ importUrlError }}</n-text>
        </template>
      </n-form-item>
    </n-space>
    <template #footer>
      <n-flex justify="end" :wrap="false">
        <n-button @click="closeImportUrlModal" :disabled="isImportingUrl">
          {{ t('importUrlCancel') }}
        </n-button>
        <n-button type="primary" :loading="isImportingUrl" @click="importFromUrl">
          {{ t('importUrlConfirm') }}
        </n-button>
      </n-flex>
    </template>
  </n-modal>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { computedAsync, useDebounce, useObjectUrl, useStorage } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import { fileOpen } from 'browser-fs-access'
import {
  NAlert,
  NButton,
  NCard,
  NCode,
  NFlex,
  NFormItem,
  NFormItemGi,
  NGrid,
  NIcon,
  NInput,
  NModal,
  NSpace,
  NSpin,
  NSwitch,
  NText,
} from 'naive-ui'
import hljs from 'highlight.js/lib/core'
import typescript from 'highlight.js/lib/languages/typescript'
import ArrowDownload16Regular from '@vicons/fluent/ArrowDownload16Regular'
import Document16Regular from '@vicons/fluent/Document16Regular'
import Link16Regular from '@vicons/fluent/Link16Regular'
import Wand16Regular from '@vicons/fluent/Wand16Regular'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import { CopyToClipboardButton, TextOrFileInput } from '@shared/ui/base'
import {
  generateOpenApiTypes,
  parseOpenApiDocument,
  type OpenApiDocument,
  type OpenApiTypegenOptions,
} from '@utils/openapi-typescript'

hljs.registerLanguage('typescript', typescript)

const { t } = useI18n()
const accept = '.json,.yaml,.yml,.txt'

const sampleOpenApi = `openapi: 3.1.0
info:
  title: Sample API
  version: '1.0.0'
paths:
  /users:
    get:
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/User'
components:
  schemas:
    User:
      type: object
      properties:
        id:
          type: string
        name:
          type: string
      required:
        - id
        - name
`

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
const modalStyle = { width: '520px' }
const modalSegmented = { content: 'soft', footer: 'soft' } as const

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

<style scoped>
.monospace-input :deep(textarea),
.monospace-input :deep(input) {
  font-family:
    ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New',
    monospace;
}

.external-ref-item {
  display: block;
  margin-top: 2px;
  font-family:
    ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New',
    monospace;
}
</style>

<i18n lang="json">
{
  "en": {
    "actionsImport": "Import from file",
    "actionsSample": "Load sample",
    "actionsDownload": "Download .d.ts",
    "inputTitle": "OpenAPI Document",
    "inputLabel": "OpenAPI (JSON or YAML)",
    "inputPlaceholder": "Paste OpenAPI 3.0/3.1 JSON or YAML here...",
    "outputLabel": "TypeScript Output",
    "outputEmpty": "Provide a valid OpenAPI document to generate types.",
    "optionsTitle": "Generation Options",
    "optionAdditionalProperties": "Allow additional properties",
    "optionDefaultNonNullable": "Default non-nullable",
    "optionPropertiesRequiredByDefault": "Properties required by default",
    "optionExportType": "Use type aliases for root types",
    "optionEnum": "Generate enums",
    "optionPathParamsAsTypes": "Path params as types",
    "optionRootTypes": "Generate root types",
    "optionMakePathsEnum": "Create paths enum",
    "optionGeneratePathParams": "Generate path params helpers",
    "optionImmutable": "Readonly output",
    "optionExcludeDeprecated": "Exclude deprecated fields",
    "optionIncludeHeader": "Include header comment",
    "invalidDocument": "Invalid OpenAPI document",
    "invalidDocumentWithMessage": "Invalid OpenAPI document: {message}",
    "invalidRoot": "OpenAPI document must be an object",
    "unsupportedVersion": "Only OpenAPI 3.0/3.1 is supported",
    "externalRefError": "External $ref is not supported ({count}). Inline or bundle the schema.",
    "actionsImportUrl": "Import from URL",
    "importUrlTitle": "Import from URL",
    "importUrlWarning": "This runs in your browser. The URL must allow CORS, or the request will fail.",
    "importUrlLabel": "OpenAPI URL",
    "importUrlPlaceholder": "https://example.com/openapi.yaml",
    "importUrlCancel": "Cancel",
    "importUrlConfirm": "Import",
    "importUrlEmptyError": "Enter a URL to import.",
    "importUrlInvalidError": "URL must start with http:// or https://.",
    "importUrlFetchError": "Failed to fetch the URL: {message}"
  },
  "zh": {
    "actionsImport": "从文件导入",
    "actionsSample": "加载示例",
    "actionsDownload": "下载 .d.ts",
    "inputTitle": "OpenAPI 文档",
    "inputLabel": "OpenAPI（JSON 或 YAML）",
    "inputPlaceholder": "在此粘贴 OpenAPI 3.0/3.1 的 JSON 或 YAML...",
    "outputLabel": "TypeScript 输出",
    "outputEmpty": "提供有效的 OpenAPI 文档以生成类型。",
    "optionsTitle": "生成选项",
    "optionAdditionalProperties": "允许额外属性",
    "optionDefaultNonNullable": "默认非空",
    "optionPropertiesRequiredByDefault": "属性默认必填",
    "optionExportType": "根类型使用 type 别名",
    "optionEnum": "生成枚举",
    "optionPathParamsAsTypes": "路径参数作为类型",
    "optionRootTypes": "生成根类型",
    "optionMakePathsEnum": "生成路径枚举",
    "optionGeneratePathParams": "生成路径参数辅助类型",
    "optionImmutable": "只读输出",
    "optionExcludeDeprecated": "排除已弃用字段",
    "optionIncludeHeader": "包含头部注释",
    "invalidDocument": "无效的 OpenAPI 文档",
    "invalidDocumentWithMessage": "无效的 OpenAPI 文档：{message}",
    "invalidRoot": "OpenAPI 文档必须是对象",
    "unsupportedVersion": "仅支持 OpenAPI 3.0/3.1",
    "externalRefError": "不支持外部 $ref（{count}）。请内联或打包该 schema。",
    "actionsImportUrl": "从 URL 导入",
    "importUrlTitle": "从 URL 导入",
    "importUrlWarning": "此操作在浏览器中执行。URL 需要允许 CORS，否则请求会失败。",
    "importUrlLabel": "OpenAPI URL",
    "importUrlPlaceholder": "https://example.com/openapi.yaml",
    "importUrlCancel": "取消",
    "importUrlConfirm": "导入",
    "importUrlEmptyError": "请输入要导入的 URL。",
    "importUrlInvalidError": "URL 必须以 http:// 或 https:// 开头。",
    "importUrlFetchError": "获取 URL 失败：{message}"
  },
  "zh-CN": {
    "actionsImport": "从文件导入",
    "actionsSample": "加载示例",
    "actionsDownload": "下载 .d.ts",
    "inputTitle": "OpenAPI 文档",
    "inputLabel": "OpenAPI（JSON 或 YAML）",
    "inputPlaceholder": "在此粘贴 OpenAPI 3.0/3.1 的 JSON 或 YAML...",
    "outputLabel": "TypeScript 输出",
    "outputEmpty": "提供有效的 OpenAPI 文档以生成类型。",
    "optionsTitle": "生成选项",
    "optionAdditionalProperties": "允许额外属性",
    "optionDefaultNonNullable": "默认非空",
    "optionPropertiesRequiredByDefault": "属性默认必填",
    "optionExportType": "根类型使用 type 别名",
    "optionEnum": "生成枚举",
    "optionPathParamsAsTypes": "路径参数作为类型",
    "optionRootTypes": "生成根类型",
    "optionMakePathsEnum": "生成路径枚举",
    "optionGeneratePathParams": "生成路径参数辅助类型",
    "optionImmutable": "只读输出",
    "optionExcludeDeprecated": "排除已弃用字段",
    "optionIncludeHeader": "包含头部注释",
    "invalidDocument": "无效的 OpenAPI 文档",
    "invalidDocumentWithMessage": "无效的 OpenAPI 文档：{message}",
    "invalidRoot": "OpenAPI 文档必须是对象",
    "unsupportedVersion": "仅支持 OpenAPI 3.0/3.1",
    "externalRefError": "不支持外部 $ref（{count}）。请内联或打包该 schema。",
    "actionsImportUrl": "从 URL 导入",
    "importUrlTitle": "从 URL 导入",
    "importUrlWarning": "此操作在浏览器中执行。URL 需要允许 CORS，否则请求会失败。",
    "importUrlLabel": "OpenAPI URL",
    "importUrlPlaceholder": "https://example.com/openapi.yaml",
    "importUrlCancel": "取消",
    "importUrlConfirm": "导入",
    "importUrlEmptyError": "请输入要导入的 URL。",
    "importUrlInvalidError": "URL 必须以 http:// 或 https:// 开头。",
    "importUrlFetchError": "获取 URL 失败：{message}"
  },
  "zh-TW": {
    "actionsImport": "從檔案匯入",
    "actionsSample": "載入範例",
    "actionsDownload": "下載 .d.ts",
    "inputTitle": "OpenAPI 文件",
    "inputLabel": "OpenAPI（JSON 或 YAML）",
    "inputPlaceholder": "在此貼上 OpenAPI 3.0/3.1 的 JSON 或 YAML...",
    "outputLabel": "TypeScript 輸出",
    "outputEmpty": "提供有效的 OpenAPI 文件以產生型別。",
    "optionsTitle": "生成選項",
    "optionAdditionalProperties": "允許額外屬性",
    "optionDefaultNonNullable": "預設非空",
    "optionPropertiesRequiredByDefault": "屬性預設必填",
    "optionExportType": "根型別使用 type 別名",
    "optionEnum": "生成列舉",
    "optionPathParamsAsTypes": "路徑參數作為型別",
    "optionRootTypes": "生成根型別",
    "optionMakePathsEnum": "生成路徑列舉",
    "optionGeneratePathParams": "生成路徑參數輔助型別",
    "optionImmutable": "唯讀輸出",
    "optionExcludeDeprecated": "排除已棄用欄位",
    "optionIncludeHeader": "包含標頭註解",
    "invalidDocument": "無效的 OpenAPI 文件",
    "invalidDocumentWithMessage": "無效的 OpenAPI 文件：{message}",
    "invalidRoot": "OpenAPI 文件必須是物件",
    "unsupportedVersion": "僅支援 OpenAPI 3.0/3.1",
    "externalRefError": "不支援外部 $ref（{count}）。請內嵌或打包該 schema。",
    "actionsImportUrl": "從 URL 匯入",
    "importUrlTitle": "從 URL 匯入",
    "importUrlWarning": "此操作在瀏覽器中執行。URL 必須允許 CORS，否則請求會失敗。",
    "importUrlLabel": "OpenAPI URL",
    "importUrlPlaceholder": "https://example.com/openapi.yaml",
    "importUrlCancel": "取消",
    "importUrlConfirm": "匯入",
    "importUrlEmptyError": "請輸入要匯入的 URL。",
    "importUrlInvalidError": "URL 必須以 http:// 或 https:// 開頭。",
    "importUrlFetchError": "取得 URL 失敗：{message}"
  },
  "zh-HK": {
    "actionsImport": "從檔案匯入",
    "actionsSample": "載入範例",
    "actionsDownload": "下載 .d.ts",
    "inputTitle": "OpenAPI 文件",
    "inputLabel": "OpenAPI（JSON 或 YAML）",
    "inputPlaceholder": "在此貼上 OpenAPI 3.0/3.1 的 JSON 或 YAML...",
    "outputLabel": "TypeScript 輸出",
    "outputEmpty": "提供有效的 OpenAPI 文件以產生型別。",
    "optionsTitle": "生成選項",
    "optionAdditionalProperties": "允許額外屬性",
    "optionDefaultNonNullable": "預設非空",
    "optionPropertiesRequiredByDefault": "屬性預設必填",
    "optionExportType": "根型別使用 type 別名",
    "optionEnum": "生成列舉",
    "optionPathParamsAsTypes": "路徑參數作為型別",
    "optionRootTypes": "生成根型別",
    "optionMakePathsEnum": "生成路徑列舉",
    "optionGeneratePathParams": "生成路徑參數輔助型別",
    "optionImmutable": "唯讀輸出",
    "optionExcludeDeprecated": "排除已棄用欄位",
    "optionIncludeHeader": "包含標頭註解",
    "invalidDocument": "無效的 OpenAPI 文件",
    "invalidDocumentWithMessage": "無效的 OpenAPI 文件：{message}",
    "invalidRoot": "OpenAPI 文件必須是物件",
    "unsupportedVersion": "僅支援 OpenAPI 3.0/3.1",
    "externalRefError": "不支援外部 $ref（{count}）。請內嵌或打包該 schema。",
    "actionsImportUrl": "從 URL 匯入",
    "importUrlTitle": "從 URL 匯入",
    "importUrlWarning": "此操作在瀏覽器中執行。URL 必須允許 CORS，否則請求會失敗。",
    "importUrlLabel": "OpenAPI URL",
    "importUrlPlaceholder": "https://example.com/openapi.yaml",
    "importUrlCancel": "取消",
    "importUrlConfirm": "匯入",
    "importUrlEmptyError": "請輸入要匯入的 URL。",
    "importUrlInvalidError": "URL 必須以 http:// 或 https:// 開頭。",
    "importUrlFetchError": "取得 URL 失敗：{message}"
  },
  "es": {
    "actionsImport": "Importar desde archivo",
    "actionsSample": "Cargar ejemplo",
    "actionsDownload": "Descargar .d.ts",
    "inputTitle": "Documento OpenAPI",
    "inputLabel": "OpenAPI (JSON o YAML)",
    "inputPlaceholder": "Pega aquí OpenAPI 3.0/3.1 en JSON o YAML...",
    "outputLabel": "Salida TypeScript",
    "outputEmpty": "Proporciona un documento OpenAPI válido para generar tipos.",
    "optionsTitle": "Opciones de generación",
    "optionAdditionalProperties": "Permitir propiedades adicionales",
    "optionDefaultNonNullable": "No anulable por defecto",
    "optionPropertiesRequiredByDefault": "Propiedades obligatorias por defecto",
    "optionExportType": "Usar alias type para tipos raíz",
    "optionEnum": "Generar enums",
    "optionPathParamsAsTypes": "Parámetros de ruta como tipos",
    "optionRootTypes": "Generar tipos raíz",
    "optionMakePathsEnum": "Crear enum de rutas",
    "optionGeneratePathParams": "Generar ayudas de parámetros de ruta",
    "optionImmutable": "Salida de solo lectura",
    "optionExcludeDeprecated": "Excluir campos obsoletos",
    "optionIncludeHeader": "Incluir comentario de cabecera",
    "invalidDocument": "Documento OpenAPI inválido",
    "invalidDocumentWithMessage": "Documento OpenAPI inválido: {message}",
    "invalidRoot": "El documento OpenAPI debe ser un objeto",
    "unsupportedVersion": "Solo se admite OpenAPI 3.0/3.1",
    "externalRefError": "No se admite $ref externo ({count}). Incrusta o empaqueta el schema.",
    "actionsImportUrl": "Importar desde URL",
    "importUrlTitle": "Importar desde URL",
    "importUrlWarning": "Esto se ejecuta en tu navegador. La URL debe permitir CORS o la solicitud fallará.",
    "importUrlLabel": "URL de OpenAPI",
    "importUrlPlaceholder": "https://example.com/openapi.yaml",
    "importUrlCancel": "Cancelar",
    "importUrlConfirm": "Importar",
    "importUrlEmptyError": "Introduce una URL para importar.",
    "importUrlInvalidError": "La URL debe empezar con http:// o https://.",
    "importUrlFetchError": "No se pudo obtener la URL: {message}"
  },
  "fr": {
    "actionsImport": "Importer depuis un fichier",
    "actionsSample": "Charger un exemple",
    "actionsDownload": "Télécharger .d.ts",
    "inputTitle": "Document OpenAPI",
    "inputLabel": "OpenAPI (JSON ou YAML)",
    "inputPlaceholder": "Collez ici un OpenAPI 3.0/3.1 en JSON ou YAML...",
    "outputLabel": "Sortie TypeScript",
    "outputEmpty": "Fournissez un document OpenAPI valide pour générer des types.",
    "optionsTitle": "Options de génération",
    "optionAdditionalProperties": "Autoriser des propriétés supplémentaires",
    "optionDefaultNonNullable": "Non-nullable par défaut",
    "optionPropertiesRequiredByDefault": "Propriétés requises par défaut",
    "optionExportType": "Utiliser des alias type pour les types racine",
    "optionEnum": "Générer des enums",
    "optionPathParamsAsTypes": "Paramètres de chemin en types",
    "optionRootTypes": "Générer les types racine",
    "optionMakePathsEnum": "Créer un enum des chemins",
    "optionGeneratePathParams": "Générer des helpers de paramètres de chemin",
    "optionImmutable": "Sortie en lecture seule",
    "optionExcludeDeprecated": "Exclure les champs obsolètes",
    "optionIncludeHeader": "Inclure le commentaire d'en-tête",
    "invalidDocument": "Document OpenAPI invalide",
    "invalidDocumentWithMessage": "Document OpenAPI invalide : {message}",
    "invalidRoot": "Le document OpenAPI doit être un objet",
    "unsupportedVersion": "Seul OpenAPI 3.0/3.1 est pris en charge",
    "externalRefError": "$ref externe non pris en charge ({count}). Intégrez ou regroupez le schéma.",
    "actionsImportUrl": "Importer depuis une URL",
    "importUrlTitle": "Importer depuis une URL",
    "importUrlWarning": "Cela s'exécute dans votre navigateur. L'URL doit autoriser CORS, sinon la requête échouera.",
    "importUrlLabel": "URL OpenAPI",
    "importUrlPlaceholder": "https://example.com/openapi.yaml",
    "importUrlCancel": "Annuler",
    "importUrlConfirm": "Importer",
    "importUrlEmptyError": "Saisissez une URL à importer.",
    "importUrlInvalidError": "L'URL doit commencer par http:// ou https://.",
    "importUrlFetchError": "Échec de la récupération de l'URL : {message}"
  },
  "de": {
    "actionsImport": "Aus Datei importieren",
    "actionsSample": "Beispiel laden",
    "actionsDownload": ".d.ts herunterladen",
    "inputTitle": "OpenAPI-Dokument",
    "inputLabel": "OpenAPI (JSON oder YAML)",
    "inputPlaceholder": "OpenAPI 3.0/3.1 als JSON oder YAML hier einfügen...",
    "outputLabel": "TypeScript-Ausgabe",
    "outputEmpty": "Gültiges OpenAPI-Dokument angeben, um Typen zu erzeugen.",
    "optionsTitle": "Generierungsoptionen",
    "optionAdditionalProperties": "Zusätzliche Eigenschaften zulassen",
    "optionDefaultNonNullable": "Standardmäßig nicht-null",
    "optionPropertiesRequiredByDefault": "Eigenschaften standardmäßig erforderlich",
    "optionExportType": "Type-Aliase für Root-Typen verwenden",
    "optionEnum": "Enums erzeugen",
    "optionPathParamsAsTypes": "Pfadparameter als Typen",
    "optionRootTypes": "Root-Typen erzeugen",
    "optionMakePathsEnum": "Pfad-Enum erstellen",
    "optionGeneratePathParams": "Hilfstypen für Pfadparameter erzeugen",
    "optionImmutable": "Nur-Lese-Ausgabe",
    "optionExcludeDeprecated": "Veraltete Felder ausschließen",
    "optionIncludeHeader": "Header-Kommentar einfügen",
    "invalidDocument": "Ungültiges OpenAPI-Dokument",
    "invalidDocumentWithMessage": "Ungültiges OpenAPI-Dokument: {message}",
    "invalidRoot": "OpenAPI-Dokument muss ein Objekt sein",
    "unsupportedVersion": "Nur OpenAPI 3.0/3.1 wird unterstützt",
    "externalRefError": "Externe $ref wird nicht unterstützt ({count}). Schema inline/bündeln.",
    "actionsImportUrl": "Von URL importieren",
    "importUrlTitle": "Von URL importieren",
    "importUrlWarning": "Dies läuft im Browser. Die URL muss CORS erlauben, sonst schlägt die Anfrage fehl.",
    "importUrlLabel": "OpenAPI-URL",
    "importUrlPlaceholder": "https://example.com/openapi.yaml",
    "importUrlCancel": "Abbrechen",
    "importUrlConfirm": "Importieren",
    "importUrlEmptyError": "Bitte eine URL zum Importieren eingeben.",
    "importUrlInvalidError": "Die URL muss mit http:// oder https:// beginnen.",
    "importUrlFetchError": "URL konnte nicht abgerufen werden: {message}"
  },
  "it": {
    "actionsImport": "Importa da file",
    "actionsSample": "Carica esempio",
    "actionsDownload": "Scarica .d.ts",
    "inputTitle": "Documento OpenAPI",
    "inputLabel": "OpenAPI (JSON o YAML)",
    "inputPlaceholder": "Incolla qui OpenAPI 3.0/3.1 in JSON o YAML...",
    "outputLabel": "Output TypeScript",
    "outputEmpty": "Fornisci un documento OpenAPI valido per generare i tipi.",
    "optionsTitle": "Opzioni di generazione",
    "optionAdditionalProperties": "Consenti proprietà aggiuntive",
    "optionDefaultNonNullable": "Non nullabile per default",
    "optionPropertiesRequiredByDefault": "Proprietà richieste per default",
    "optionExportType": "Usa alias type per i tipi radice",
    "optionEnum": "Genera enum",
    "optionPathParamsAsTypes": "Parametri di percorso come tipi",
    "optionRootTypes": "Genera tipi radice",
    "optionMakePathsEnum": "Crea enum dei percorsi",
    "optionGeneratePathParams": "Genera helper per parametri di percorso",
    "optionImmutable": "Output di sola lettura",
    "optionExcludeDeprecated": "Escludi campi deprecati",
    "optionIncludeHeader": "Includi commento di intestazione",
    "invalidDocument": "Documento OpenAPI non valido",
    "invalidDocumentWithMessage": "Documento OpenAPI non valido: {message}",
    "invalidRoot": "Il documento OpenAPI deve essere un oggetto",
    "unsupportedVersion": "È supportato solo OpenAPI 3.0/3.1",
    "externalRefError": "$ref esterno non supportato ({count}). In linea o raggruppa lo schema.",
    "actionsImportUrl": "Importa da URL",
    "importUrlTitle": "Importa da URL",
    "importUrlWarning": "Eseguito nel browser. La URL deve consentire CORS o la richiesta fallirà.",
    "importUrlLabel": "URL OpenAPI",
    "importUrlPlaceholder": "https://example.com/openapi.yaml",
    "importUrlCancel": "Annulla",
    "importUrlConfirm": "Importa",
    "importUrlEmptyError": "Inserisci un URL da importare.",
    "importUrlInvalidError": "L'URL deve iniziare con http:// o https://.",
    "importUrlFetchError": "Impossibile recuperare l'URL: {message}"
  },
  "ja": {
    "actionsImport": "ファイルからインポート",
    "actionsSample": "サンプルを読み込む",
    "actionsDownload": ".d.ts をダウンロード",
    "inputTitle": "OpenAPI ドキュメント",
    "inputLabel": "OpenAPI（JSON または YAML）",
    "inputPlaceholder": "OpenAPI 3.0/3.1 の JSON または YAML を貼り付け...",
    "outputLabel": "TypeScript 出力",
    "outputEmpty": "有効な OpenAPI ドキュメントを指定すると型を生成します。",
    "optionsTitle": "生成オプション",
    "optionAdditionalProperties": "追加プロパティを許可",
    "optionDefaultNonNullable": "既定で非 null",
    "optionPropertiesRequiredByDefault": "既定で必須プロパティ",
    "optionExportType": "ルート型を type エイリアスで出力",
    "optionEnum": "enum を生成",
    "optionPathParamsAsTypes": "パスパラメータを型として生成",
    "optionRootTypes": "ルート型を生成",
    "optionMakePathsEnum": "パス enum を生成",
    "optionGeneratePathParams": "パスパラメータのヘルパーを生成",
    "optionImmutable": "読み取り専用出力",
    "optionExcludeDeprecated": "非推奨フィールドを除外",
    "optionIncludeHeader": "ヘッダーコメントを含める",
    "invalidDocument": "無効な OpenAPI ドキュメント",
    "invalidDocumentWithMessage": "無効な OpenAPI ドキュメント: {message}",
    "invalidRoot": "OpenAPI ドキュメントはオブジェクトである必要があります",
    "unsupportedVersion": "OpenAPI 3.0/3.1 のみ対応",
    "externalRefError": "外部 $ref は未対応（{count}）。スキーマをインライン化/バンドルしてください。",
    "actionsImportUrl": "URL からインポート",
    "importUrlTitle": "URL からインポート",
    "importUrlWarning": "ブラウザ内で実行されます。URL が CORS を許可していない場合、リクエストは失敗します。",
    "importUrlLabel": "OpenAPI URL",
    "importUrlPlaceholder": "https://example.com/openapi.yaml",
    "importUrlCancel": "キャンセル",
    "importUrlConfirm": "インポート",
    "importUrlEmptyError": "インポートする URL を入力してください。",
    "importUrlInvalidError": "URL は http:// または https:// で始まる必要があります。",
    "importUrlFetchError": "URL の取得に失敗しました: {message}"
  },
  "ko": {
    "actionsImport": "파일에서 가져오기",
    "actionsSample": "샘플 불러오기",
    "actionsDownload": ".d.ts 다운로드",
    "inputTitle": "OpenAPI 문서",
    "inputLabel": "OpenAPI (JSON 또는 YAML)",
    "inputPlaceholder": "OpenAPI 3.0/3.1 JSON 또는 YAML을 붙여넣기...",
    "outputLabel": "TypeScript 출력",
    "outputEmpty": "유효한 OpenAPI 문서를 제공하면 타입을 생성합니다.",
    "optionsTitle": "생성 옵션",
    "optionAdditionalProperties": "추가 속성 허용",
    "optionDefaultNonNullable": "기본 non-null",
    "optionPropertiesRequiredByDefault": "기본 필수 속성",
    "optionExportType": "루트 타입을 type 별칭으로",
    "optionEnum": "enum 생성",
    "optionPathParamsAsTypes": "경로 파라미터를 타입으로",
    "optionRootTypes": "루트 타입 생성",
    "optionMakePathsEnum": "경로 enum 생성",
    "optionGeneratePathParams": "경로 파라미터 헬퍼 생성",
    "optionImmutable": "읽기 전용 출력",
    "optionExcludeDeprecated": "사용 중단 필드 제외",
    "optionIncludeHeader": "헤더 주석 포함",
    "invalidDocument": "잘못된 OpenAPI 문서",
    "invalidDocumentWithMessage": "잘못된 OpenAPI 문서: {message}",
    "invalidRoot": "OpenAPI 문서는 객체여야 합니다",
    "unsupportedVersion": "OpenAPI 3.0/3.1만 지원합니다",
    "externalRefError": "외부 $ref 미지원({count}). 스키마를 인라인/번들하세요.",
    "actionsImportUrl": "URL에서 가져오기",
    "importUrlTitle": "URL에서 가져오기",
    "importUrlWarning": "브라우저에서 실행됩니다. URL이 CORS를 허용하지 않으면 요청이 실패합니다.",
    "importUrlLabel": "OpenAPI URL",
    "importUrlPlaceholder": "https://example.com/openapi.yaml",
    "importUrlCancel": "취소",
    "importUrlConfirm": "가져오기",
    "importUrlEmptyError": "가져올 URL을 입력하세요.",
    "importUrlInvalidError": "URL은 http:// 또는 https://로 시작해야 합니다.",
    "importUrlFetchError": "URL 가져오기에 실패했습니다: {message}"
  },
  "ru": {
    "actionsImport": "Импорт из файла",
    "actionsSample": "Загрузить пример",
    "actionsDownload": "Скачать .d.ts",
    "inputTitle": "Документ OpenAPI",
    "inputLabel": "OpenAPI (JSON или YAML)",
    "inputPlaceholder": "Вставьте OpenAPI 3.0/3.1 в JSON или YAML...",
    "outputLabel": "Вывод TypeScript",
    "outputEmpty": "Укажите корректный документ OpenAPI, чтобы сгенерировать типы.",
    "optionsTitle": "Параметры генерации",
    "optionAdditionalProperties": "Разрешить дополнительные свойства",
    "optionDefaultNonNullable": "По умолчанию non-null",
    "optionPropertiesRequiredByDefault": "Свойства обязательны по умолчанию",
    "optionExportType": "Использовать type-алиасы для корневых типов",
    "optionEnum": "Генерировать enum",
    "optionPathParamsAsTypes": "Параметры пути как типы",
    "optionRootTypes": "Генерировать корневые типы",
    "optionMakePathsEnum": "Создать enum путей",
    "optionGeneratePathParams": "Генерировать helper-и параметров пути",
    "optionImmutable": "Вывод только для чтения",
    "optionExcludeDeprecated": "Исключить устаревшие поля",
    "optionIncludeHeader": "Включить заголовочный комментарий",
    "invalidDocument": "Недопустимый документ OpenAPI",
    "invalidDocumentWithMessage": "Недопустимый документ OpenAPI: {message}",
    "invalidRoot": "Документ OpenAPI должен быть объектом",
    "unsupportedVersion": "Поддерживается только OpenAPI 3.0/3.1",
    "externalRefError": "Внешний $ref не поддерживается ({count}). Встроите или объедините схему.",
    "actionsImportUrl": "Импорт из URL",
    "importUrlTitle": "Импорт из URL",
    "importUrlWarning": "Выполняется в браузере. URL должен разрешать CORS, иначе запрос не пройдет.",
    "importUrlLabel": "OpenAPI URL",
    "importUrlPlaceholder": "https://example.com/openapi.yaml",
    "importUrlCancel": "Отмена",
    "importUrlConfirm": "Импортировать",
    "importUrlEmptyError": "Введите URL для импорта.",
    "importUrlInvalidError": "URL должен начинаться с http:// или https://.",
    "importUrlFetchError": "Не удалось получить URL: {message}"
  },
  "pt": {
    "actionsImport": "Importar de arquivo",
    "actionsSample": "Carregar exemplo",
    "actionsDownload": "Baixar .d.ts",
    "inputTitle": "Documento OpenAPI",
    "inputLabel": "OpenAPI (JSON ou YAML)",
    "inputPlaceholder": "Cole aqui OpenAPI 3.0/3.1 em JSON ou YAML...",
    "outputLabel": "Saída TypeScript",
    "outputEmpty": "Forneça um documento OpenAPI válido para gerar tipos.",
    "optionsTitle": "Opções de geração",
    "optionAdditionalProperties": "Permitir propriedades adicionais",
    "optionDefaultNonNullable": "Não anulável por padrão",
    "optionPropertiesRequiredByDefault": "Propriedades obrigatórias por padrão",
    "optionExportType": "Usar aliases type para tipos raiz",
    "optionEnum": "Gerar enums",
    "optionPathParamsAsTypes": "Parâmetros de rota como tipos",
    "optionRootTypes": "Gerar tipos raiz",
    "optionMakePathsEnum": "Criar enum de rotas",
    "optionGeneratePathParams": "Gerar helpers de parâmetros de rota",
    "optionImmutable": "Saída somente leitura",
    "optionExcludeDeprecated": "Excluir campos obsoletos",
    "optionIncludeHeader": "Incluir comentário de cabeçalho",
    "invalidDocument": "Documento OpenAPI inválido",
    "invalidDocumentWithMessage": "Documento OpenAPI inválido: {message}",
    "invalidRoot": "O documento OpenAPI deve ser um objeto",
    "unsupportedVersion": "Somente OpenAPI 3.0/3.1 é suportado",
    "externalRefError": "$ref externo não suportado ({count}). Incorpore ou agregue o schema.",
    "actionsImportUrl": "Importar de URL",
    "importUrlTitle": "Importar de URL",
    "importUrlWarning": "Isso roda no navegador. A URL precisa permitir CORS, ou a solicitação falhará.",
    "importUrlLabel": "URL do OpenAPI",
    "importUrlPlaceholder": "https://example.com/openapi.yaml",
    "importUrlCancel": "Cancelar",
    "importUrlConfirm": "Importar",
    "importUrlEmptyError": "Insira uma URL para importar.",
    "importUrlInvalidError": "A URL deve começar com http:// ou https://.",
    "importUrlFetchError": "Falha ao obter a URL: {message}"
  },
  "ar": {
    "actionsImport": "استيراد من ملف",
    "actionsSample": "تحميل مثال",
    "actionsDownload": "تنزيل .d.ts",
    "inputTitle": "مستند OpenAPI",
    "inputLabel": "OpenAPI (JSON أو YAML)",
    "inputPlaceholder": "الصق OpenAPI 3.0/3.1 بصيغة JSON أو YAML هنا...",
    "outputLabel": "مخرجات TypeScript",
    "outputEmpty": "قدّم مستند OpenAPI صالحًا لتوليد الأنواع.",
    "optionsTitle": "خيارات التوليد",
    "optionAdditionalProperties": "السماح بخصائص إضافية",
    "optionDefaultNonNullable": "غير قابل لـ null افتراضيًا",
    "optionPropertiesRequiredByDefault": "الخصائص مطلوبة افتراضيًا",
    "optionExportType": "استخدام type للأصناف الجذرية",
    "optionEnum": "توليد enums",
    "optionPathParamsAsTypes": "معلمات المسار كأنواع",
    "optionRootTypes": "توليد الأنواع الجذرية",
    "optionMakePathsEnum": "إنشاء enum للمسارات",
    "optionGeneratePathParams": "توليد مساعدات معلمات المسار",
    "optionImmutable": "مخرجات للقراءة فقط",
    "optionExcludeDeprecated": "استبعاد الحقول المهجورة",
    "optionIncludeHeader": "تضمين تعليق الرأس",
    "invalidDocument": "مستند OpenAPI غير صالح",
    "invalidDocumentWithMessage": "مستند OpenAPI غير صالح: {message}",
    "invalidRoot": "يجب أن يكون مستند OpenAPI كائنًا",
    "unsupportedVersion": "يدعم فقط OpenAPI 3.0/3.1",
    "externalRefError": "‏$ref خارجي غير مدعوم ({count}). قم بدمج المخطط أو تضمينه.",
    "actionsImportUrl": "استيراد من عنوان URL",
    "importUrlTitle": "استيراد من عنوان URL",
    "importUrlWarning": "يعمل هذا في المتصفح. يجب أن يسمح عنوان URL بـ CORS وإلا سيفشل الطلب.",
    "importUrlLabel": "عنوان URL لـ OpenAPI",
    "importUrlPlaceholder": "https://example.com/openapi.yaml",
    "importUrlCancel": "إلغاء",
    "importUrlConfirm": "استيراد",
    "importUrlEmptyError": "أدخل عنوان URL للاستيراد.",
    "importUrlInvalidError": "يجب أن يبدأ عنوان URL بـ http:// أو https://.",
    "importUrlFetchError": "فشل جلب عنوان URL: {message}"
  },
  "hi": {
    "actionsImport": "फ़ाइल से आयात करें",
    "actionsSample": "नमूना लोड करें",
    "actionsDownload": ".d.ts डाउनलोड करें",
    "inputTitle": "OpenAPI दस्तावेज़",
    "inputLabel": "OpenAPI (JSON या YAML)",
    "inputPlaceholder": "OpenAPI 3.0/3.1 JSON या YAML यहाँ पेस्ट करें...",
    "outputLabel": "TypeScript आउटपुट",
    "outputEmpty": "टाइप्स बनाने के लिए एक मान्य OpenAPI दस्तावेज़ दें।",
    "optionsTitle": "जेनरेशन विकल्प",
    "optionAdditionalProperties": "अतिरिक्त प्रॉपर्टी अनुमति दें",
    "optionDefaultNonNullable": "डिफ़ॉल्ट रूप से non-null",
    "optionPropertiesRequiredByDefault": "डिफ़ॉल्ट रूप से आवश्यक प्रॉपर्टी",
    "optionExportType": "रूट टाइप के लिए type alias उपयोग करें",
    "optionEnum": "enum बनाएँ",
    "optionPathParamsAsTypes": "पाथ पैरामीटर को टाइप के रूप में",
    "optionRootTypes": "रूट टाइप बनाएँ",
    "optionMakePathsEnum": "पाथ enum बनाएँ",
    "optionGeneratePathParams": "पाथ पैरामीटर हेल्पर बनाएँ",
    "optionImmutable": "रीड-ओनली आउटपुट",
    "optionExcludeDeprecated": "डिप्रिकेटेड फ़ील्ड हटाएँ",
    "optionIncludeHeader": "हेडर कमेंट शामिल करें",
    "invalidDocument": "अमान्य OpenAPI दस्तावेज़",
    "invalidDocumentWithMessage": "अमान्य OpenAPI दस्तावेज़: {message}",
    "invalidRoot": "OpenAPI दस्तावेज़ एक ऑब्जेक्ट होना चाहिए",
    "unsupportedVersion": "केवल OpenAPI 3.0/3.1 समर्थित है",
    "externalRefError": "बाहरी $ref समर्थित नहीं है ({count})। schema को inline या bundle करें।",
    "actionsImportUrl": "URL से आयात करें",
    "importUrlTitle": "URL से आयात करें",
    "importUrlWarning": "यह ब्राउज़र में चलता है। URL को CORS की अनुमति देनी होगी, नहीं तो अनुरोध विफल होगा।",
    "importUrlLabel": "OpenAPI URL",
    "importUrlPlaceholder": "https://example.com/openapi.yaml",
    "importUrlCancel": "रद्द करें",
    "importUrlConfirm": "आयात करें",
    "importUrlEmptyError": "आयात करने के लिए URL दर्ज करें।",
    "importUrlInvalidError": "URL को http:// या https:// से शुरू होना चाहिए।",
    "importUrlFetchError": "URL लाने में विफल: {message}"
  },
  "tr": {
    "actionsImport": "Dosyadan içe aktar",
    "actionsSample": "Örnek yükle",
    "actionsDownload": ".d.ts indir",
    "inputTitle": "OpenAPI Belgesi",
    "inputLabel": "OpenAPI (JSON veya YAML)",
    "inputPlaceholder": "OpenAPI 3.0/3.1 JSON veya YAML buraya yapıştırın...",
    "outputLabel": "TypeScript Çıktısı",
    "outputEmpty": "Tür üretmek için geçerli bir OpenAPI belgesi sağlayın.",
    "optionsTitle": "Üretim Seçenekleri",
    "optionAdditionalProperties": "Ek özelliklere izin ver",
    "optionDefaultNonNullable": "Varsayılan non-null",
    "optionPropertiesRequiredByDefault": "Varsayılan gerekli özellikler",
    "optionExportType": "Kök türler için type alias kullan",
    "optionEnum": "Enum üret",
    "optionPathParamsAsTypes": "Yol parametreleri tür olarak",
    "optionRootTypes": "Kök türler üret",
    "optionMakePathsEnum": "Yol enum'u oluştur",
    "optionGeneratePathParams": "Yol parametre yardımcılarını üret",
    "optionImmutable": "Salt okunur çıktı",
    "optionExcludeDeprecated": "Kullanımdan kaldırılan alanları hariç tut",
    "optionIncludeHeader": "Üstbilgi yorumunu ekle",
    "invalidDocument": "Geçersiz OpenAPI belgesi",
    "invalidDocumentWithMessage": "Geçersiz OpenAPI belgesi: {message}",
    "invalidRoot": "OpenAPI belgesi bir nesne olmalıdır",
    "unsupportedVersion": "Yalnızca OpenAPI 3.0/3.1 desteklenir",
    "externalRefError": "Harici $ref desteklenmiyor ({count}). Şemayı içe gömün veya paketleyin.",
    "actionsImportUrl": "URL'den içe aktar",
    "importUrlTitle": "URL'den içe aktar",
    "importUrlWarning": "Bu işlem tarayıcıda çalışır. URL CORS'a izin vermeli, aksi halde istek başarısız olur.",
    "importUrlLabel": "OpenAPI URL",
    "importUrlPlaceholder": "https://example.com/openapi.yaml",
    "importUrlCancel": "İptal",
    "importUrlConfirm": "İçe aktar",
    "importUrlEmptyError": "İçe aktarmak için bir URL girin.",
    "importUrlInvalidError": "URL http:// veya https:// ile başlamalıdır.",
    "importUrlFetchError": "URL alınamadı: {message}"
  },
  "nl": {
    "actionsImport": "Importeren uit bestand",
    "actionsSample": "Voorbeeld laden",
    "actionsDownload": ".d.ts downloaden",
    "inputTitle": "OpenAPI-document",
    "inputLabel": "OpenAPI (JSON of YAML)",
    "inputPlaceholder": "Plak hier OpenAPI 3.0/3.1 in JSON of YAML...",
    "outputLabel": "TypeScript-uitvoer",
    "outputEmpty": "Geef een geldig OpenAPI-document om typen te genereren.",
    "optionsTitle": "Generatieopties",
    "optionAdditionalProperties": "Extra eigenschappen toestaan",
    "optionDefaultNonNullable": "Standaard non-null",
    "optionPropertiesRequiredByDefault": "Eigenschappen standaard verplicht",
    "optionExportType": "Gebruik type-aliases voor root-typen",
    "optionEnum": "Enums genereren",
    "optionPathParamsAsTypes": "Padparameters als typen",
    "optionRootTypes": "Root-typen genereren",
    "optionMakePathsEnum": "Pad-enum maken",
    "optionGeneratePathParams": "Helpers voor padparameters genereren",
    "optionImmutable": "Alleen-lezen uitvoer",
    "optionExcludeDeprecated": "Verouderde velden uitsluiten",
    "optionIncludeHeader": "Headercommentaar opnemen",
    "invalidDocument": "Ongeldig OpenAPI-document",
    "invalidDocumentWithMessage": "Ongeldig OpenAPI-document: {message}",
    "invalidRoot": "OpenAPI-document moet een object zijn",
    "unsupportedVersion": "Alleen OpenAPI 3.0/3.1 wordt ondersteund",
    "externalRefError": "Externe $ref wordt niet ondersteund ({count}). Inline of bundel het schema.",
    "actionsImportUrl": "Importeren via URL",
    "importUrlTitle": "Importeren via URL",
    "importUrlWarning": "Dit draait in je browser. De URL moet CORS toestaan, anders mislukt het verzoek.",
    "importUrlLabel": "OpenAPI-URL",
    "importUrlPlaceholder": "https://example.com/openapi.yaml",
    "importUrlCancel": "Annuleren",
    "importUrlConfirm": "Importeren",
    "importUrlEmptyError": "Voer een URL in om te importeren.",
    "importUrlInvalidError": "De URL moet beginnen met http:// of https://.",
    "importUrlFetchError": "URL ophalen mislukt: {message}"
  },
  "sv": {
    "actionsImport": "Importera från fil",
    "actionsSample": "Ladda exempel",
    "actionsDownload": "Ladda ner .d.ts",
    "inputTitle": "OpenAPI-dokument",
    "inputLabel": "OpenAPI (JSON eller YAML)",
    "inputPlaceholder": "Klistra in OpenAPI 3.0/3.1 i JSON eller YAML här...",
    "outputLabel": "TypeScript-utdata",
    "outputEmpty": "Ange ett giltigt OpenAPI-dokument för att generera typer.",
    "optionsTitle": "Genereringsalternativ",
    "optionAdditionalProperties": "Tillåt extra egenskaper",
    "optionDefaultNonNullable": "Icke-null som standard",
    "optionPropertiesRequiredByDefault": "Egenskaper krävs som standard",
    "optionExportType": "Använd type-alias för rot-typer",
    "optionEnum": "Generera enums",
    "optionPathParamsAsTypes": "Sökvägsparametrar som typer",
    "optionRootTypes": "Generera rot-typer",
    "optionMakePathsEnum": "Skapa sökvägs-enum",
    "optionGeneratePathParams": "Generera hjälpertyper för sökvägsparametrar",
    "optionImmutable": "Skrivskyddad utdata",
    "optionExcludeDeprecated": "Uteslut föråldrade fält",
    "optionIncludeHeader": "Inkludera header-kommentar",
    "invalidDocument": "Ogiltigt OpenAPI-dokument",
    "invalidDocumentWithMessage": "Ogiltigt OpenAPI-dokument: {message}",
    "invalidRoot": "OpenAPI-dokument måste vara ett objekt",
    "unsupportedVersion": "Endast OpenAPI 3.0/3.1 stöds",
    "externalRefError": "Extern $ref stöds inte ({count}). Inkludera eller bunt ihop schemat.",
    "actionsImportUrl": "Importera från URL",
    "importUrlTitle": "Importera från URL",
    "importUrlWarning": "Detta körs i webbläsaren. URL:en måste tillåta CORS, annars misslyckas begäran.",
    "importUrlLabel": "OpenAPI-URL",
    "importUrlPlaceholder": "https://example.com/openapi.yaml",
    "importUrlCancel": "Avbryt",
    "importUrlConfirm": "Importera",
    "importUrlEmptyError": "Ange en URL att importera.",
    "importUrlInvalidError": "URL:en måste börja med http:// eller https://.",
    "importUrlFetchError": "Det gick inte att hämta URL:en: {message}"
  },
  "pl": {
    "actionsImport": "Importuj z pliku",
    "actionsSample": "Wczytaj przykład",
    "actionsDownload": "Pobierz .d.ts",
    "inputTitle": "Dokument OpenAPI",
    "inputLabel": "OpenAPI (JSON lub YAML)",
    "inputPlaceholder": "Wklej tutaj OpenAPI 3.0/3.1 w JSON lub YAML...",
    "outputLabel": "Wyjście TypeScript",
    "outputEmpty": "Podaj poprawny dokument OpenAPI, aby wygenerować typy.",
    "optionsTitle": "Opcje generowania",
    "optionAdditionalProperties": "Zezwalaj na dodatkowe właściwości",
    "optionDefaultNonNullable": "Domyślnie non-null",
    "optionPropertiesRequiredByDefault": "Właściwości wymagane domyślnie",
    "optionExportType": "Użyj aliasów type dla typów głównych",
    "optionEnum": "Generuj enumy",
    "optionPathParamsAsTypes": "Parametry ścieżki jako typy",
    "optionRootTypes": "Generuj typy główne",
    "optionMakePathsEnum": "Utwórz enum ścieżek",
    "optionGeneratePathParams": "Generuj helpery parametrów ścieżki",
    "optionImmutable": "Wyjście tylko do odczytu",
    "optionExcludeDeprecated": "Wyklucz przestarzałe pola",
    "optionIncludeHeader": "Dołącz komentarz nagłówka",
    "invalidDocument": "Nieprawidłowy dokument OpenAPI",
    "invalidDocumentWithMessage": "Nieprawidłowy dokument OpenAPI: {message}",
    "invalidRoot": "Dokument OpenAPI musi być obiektem",
    "unsupportedVersion": "Obsługiwane jest tylko OpenAPI 3.0/3.1",
    "externalRefError": "Zewnętrzny $ref nie jest obsługiwany ({count}). Wbuduj lub zbundluj schemat.",
    "actionsImportUrl": "Importuj z URL",
    "importUrlTitle": "Importuj z URL",
    "importUrlWarning": "Działa w przeglądarce. URL musi zezwalać na CORS, inaczej żądanie się nie powiedzie.",
    "importUrlLabel": "URL OpenAPI",
    "importUrlPlaceholder": "https://example.com/openapi.yaml",
    "importUrlCancel": "Anuluj",
    "importUrlConfirm": "Importuj",
    "importUrlEmptyError": "Wpisz URL do importu.",
    "importUrlInvalidError": "URL musi zaczynać się od http:// lub https://.",
    "importUrlFetchError": "Nie udało się pobrać URL: {message}"
  },
  "vi": {
    "actionsImport": "Nhập từ tệp",
    "actionsSample": "Tải mẫu",
    "actionsDownload": "Tải xuống .d.ts",
    "inputTitle": "Tài liệu OpenAPI",
    "inputLabel": "OpenAPI (JSON hoặc YAML)",
    "inputPlaceholder": "Dán OpenAPI 3.0/3.1 JSON hoặc YAML vào đây...",
    "outputLabel": "Đầu ra TypeScript",
    "outputEmpty": "Cung cấp tài liệu OpenAPI hợp lệ để tạo kiểu.",
    "optionsTitle": "Tùy chọn tạo",
    "optionAdditionalProperties": "Cho phép thuộc tính bổ sung",
    "optionDefaultNonNullable": "Mặc định non-null",
    "optionPropertiesRequiredByDefault": "Thuộc tính bắt buộc mặc định",
    "optionExportType": "Dùng alias type cho loại gốc",
    "optionEnum": "Tạo enum",
    "optionPathParamsAsTypes": "Tham số đường dẫn dưới dạng kiểu",
    "optionRootTypes": "Tạo kiểu gốc",
    "optionMakePathsEnum": "Tạo enum đường dẫn",
    "optionGeneratePathParams": "Tạo helper tham số đường dẫn",
    "optionImmutable": "Đầu ra chỉ đọc",
    "optionExcludeDeprecated": "Loại bỏ trường đã lỗi thời",
    "optionIncludeHeader": "Bao gồm chú thích tiêu đề",
    "invalidDocument": "Tài liệu OpenAPI không hợp lệ",
    "invalidDocumentWithMessage": "Tài liệu OpenAPI không hợp lệ: {message}",
    "invalidRoot": "Tài liệu OpenAPI phải là một đối tượng",
    "unsupportedVersion": "Chỉ hỗ trợ OpenAPI 3.0/3.1",
    "externalRefError": "$ref bên ngoài không được hỗ trợ ({count}). Hãy inline hoặc bundle schema.",
    "actionsImportUrl": "Nhập từ URL",
    "importUrlTitle": "Nhập từ URL",
    "importUrlWarning": "Chạy trong trình duyệt. URL phải cho phép CORS, nếu không yêu cầu sẽ thất bại.",
    "importUrlLabel": "URL OpenAPI",
    "importUrlPlaceholder": "https://example.com/openapi.yaml",
    "importUrlCancel": "Hủy",
    "importUrlConfirm": "Nhập",
    "importUrlEmptyError": "Nhập URL để import.",
    "importUrlInvalidError": "URL phải bắt đầu bằng http:// hoặc https://.",
    "importUrlFetchError": "Không thể tải URL: {message}"
  },
  "th": {
    "actionsImport": "นำเข้าจากไฟล์",
    "actionsSample": "โหลดตัวอย่าง",
    "actionsDownload": "ดาวน์โหลด .d.ts",
    "inputTitle": "เอกสาร OpenAPI",
    "inputLabel": "OpenAPI (JSON หรือ YAML)",
    "inputPlaceholder": "วาง OpenAPI 3.0/3.1 แบบ JSON หรือ YAML ที่นี่...",
    "outputLabel": "ผลลัพธ์ TypeScript",
    "outputEmpty": "กรุณาใส่เอกสาร OpenAPI ที่ถูกต้องเพื่อสร้างชนิดข้อมูล",
    "optionsTitle": "ตัวเลือกการสร้าง",
    "optionAdditionalProperties": "อนุญาตพร็อพเพอร์ตีเพิ่มเติม",
    "optionDefaultNonNullable": "ค่าเริ่มต้นไม่เป็น null",
    "optionPropertiesRequiredByDefault": "พร็อพเพอร์ตีจำเป็นตามค่าเริ่มต้น",
    "optionExportType": "ใช้ type alias สำหรับชนิดหลัก",
    "optionEnum": "สร้าง enum",
    "optionPathParamsAsTypes": "พารามิเตอร์เส้นทางเป็นชนิด",
    "optionRootTypes": "สร้างชนิดหลัก",
    "optionMakePathsEnum": "สร้าง enum ของเส้นทาง",
    "optionGeneratePathParams": "สร้างตัวช่วยพารามิเตอร์เส้นทาง",
    "optionImmutable": "ผลลัพธ์แบบอ่านอย่างเดียว",
    "optionExcludeDeprecated": "ตัดฟิลด์ที่เลิกใช้",
    "optionIncludeHeader": "รวมคอมเมนต์ส่วนหัว",
    "invalidDocument": "เอกสาร OpenAPI ไม่ถูกต้อง",
    "invalidDocumentWithMessage": "เอกสาร OpenAPI ไม่ถูกต้อง: {message}",
    "invalidRoot": "เอกสาร OpenAPI ต้องเป็นอ็อบเจ็กต์",
    "unsupportedVersion": "รองรับเฉพาะ OpenAPI 3.0/3.1",
    "externalRefError": "ไม่รองรับ $ref ภายนอก ({count}) โปรด inline หรือ bundle schema",
    "actionsImportUrl": "นำเข้าจาก URL",
    "importUrlTitle": "นำเข้าจาก URL",
    "importUrlWarning": "ทำงานในเบราว์เซอร์ URL ต้องอนุญาต CORS ไม่เช่นนั้นคำขอจะล้มเหลว",
    "importUrlLabel": "OpenAPI URL",
    "importUrlPlaceholder": "https://example.com/openapi.yaml",
    "importUrlCancel": "ยกเลิก",
    "importUrlConfirm": "นำเข้า",
    "importUrlEmptyError": "กรุณาใส่ URL เพื่อ import",
    "importUrlInvalidError": "URL ต้องขึ้นต้นด้วย http:// หรือ https://",
    "importUrlFetchError": "ไม่สามารถดึง URL ได้: {message}"
  },
  "id": {
    "actionsImport": "Impor dari file",
    "actionsSample": "Muat contoh",
    "actionsDownload": "Unduh .d.ts",
    "inputTitle": "Dokumen OpenAPI",
    "inputLabel": "OpenAPI (JSON atau YAML)",
    "inputPlaceholder": "Tempel OpenAPI 3.0/3.1 JSON atau YAML di sini...",
    "outputLabel": "Output TypeScript",
    "outputEmpty": "Berikan dokumen OpenAPI yang valid untuk menghasilkan tipe.",
    "optionsTitle": "Opsi pembuatan",
    "optionAdditionalProperties": "Izinkan properti tambahan",
    "optionDefaultNonNullable": "Non-null secara default",
    "optionPropertiesRequiredByDefault": "Properti wajib secara default",
    "optionExportType": "Gunakan alias type untuk tipe root",
    "optionEnum": "Buat enum",
    "optionPathParamsAsTypes": "Parameter path sebagai tipe",
    "optionRootTypes": "Buat tipe root",
    "optionMakePathsEnum": "Buat enum path",
    "optionGeneratePathParams": "Buat helper parameter path",
    "optionImmutable": "Output hanya-baca",
    "optionExcludeDeprecated": "Kecualikan field usang",
    "optionIncludeHeader": "Sertakan komentar header",
    "invalidDocument": "Dokumen OpenAPI tidak valid",
    "invalidDocumentWithMessage": "Dokumen OpenAPI tidak valid: {message}",
    "invalidRoot": "Dokumen OpenAPI harus berupa objek",
    "unsupportedVersion": "Hanya OpenAPI 3.0/3.1 yang didukung",
    "externalRefError": "$ref eksternal tidak didukung ({count}). Inline atau bundle schema.",
    "actionsImportUrl": "Impor dari URL",
    "importUrlTitle": "Impor dari URL",
    "importUrlWarning": "Berjalan di browser. URL harus mengizinkan CORS, jika tidak permintaan akan gagal.",
    "importUrlLabel": "URL OpenAPI",
    "importUrlPlaceholder": "https://example.com/openapi.yaml",
    "importUrlCancel": "Batal",
    "importUrlConfirm": "Impor",
    "importUrlEmptyError": "Masukkan URL untuk diimpor.",
    "importUrlInvalidError": "URL harus diawali dengan http:// atau https://.",
    "importUrlFetchError": "Gagal mengambil URL: {message}"
  },
  "he": {
    "actionsImport": "ייבוא מקובץ",
    "actionsSample": "טען דוגמה",
    "actionsDownload": "הורד .d.ts",
    "inputTitle": "מסמך OpenAPI",
    "inputLabel": "OpenAPI (JSON או YAML)",
    "inputPlaceholder": "הדבק כאן OpenAPI 3.0/3.1 ב-JSON או YAML...",
    "outputLabel": "פלט TypeScript",
    "outputEmpty": "ספק מסמך OpenAPI תקין כדי ליצור טיפוסים.",
    "optionsTitle": "אפשרויות יצירה",
    "optionAdditionalProperties": "אפשר מאפיינים נוספים",
    "optionDefaultNonNullable": "ברירת מחדל non-null",
    "optionPropertiesRequiredByDefault": "מאפיינים נדרשים כברירת מחדל",
    "optionExportType": "השתמש ב-type alias לטיפוסי שורש",
    "optionEnum": "צור enum",
    "optionPathParamsAsTypes": "פרמטרי נתיב כטיפוסים",
    "optionRootTypes": "צור טיפוסי שורש",
    "optionMakePathsEnum": "צור enum לנתיבים",
    "optionGeneratePathParams": "צור עוזרי פרמטרי נתיב",
    "optionImmutable": "פלט לקריאה בלבד",
    "optionExcludeDeprecated": "הסר שדות מיושנים",
    "optionIncludeHeader": "כלול הערת כותרת",
    "invalidDocument": "מסמך OpenAPI לא תקין",
    "invalidDocumentWithMessage": "מסמך OpenAPI לא תקין: {message}",
    "invalidRoot": "מסמך OpenAPI חייב להיות אובייקט",
    "unsupportedVersion": "נתמך רק OpenAPI 3.0/3.1",
    "externalRefError": "$ref חיצוני אינו נתמך ({count}). נא להטמיע או לאגד את הסכמה.",
    "actionsImportUrl": "ייבוא מ-URL",
    "importUrlTitle": "ייבוא מ-URL",
    "importUrlWarning": "פועל בדפדפן. ה-URL חייב לאפשר CORS אחרת הבקשה תיכשל.",
    "importUrlLabel": "כתובת URL של OpenAPI",
    "importUrlPlaceholder": "https://example.com/openapi.yaml",
    "importUrlCancel": "ביטול",
    "importUrlConfirm": "ייבוא",
    "importUrlEmptyError": "הזן כתובת URL לייבוא.",
    "importUrlInvalidError": "ה-URL חייב להתחיל ב‑http:// או https://.",
    "importUrlFetchError": "נכשל בטעינת ה-URL: {message}"
  },
  "ms": {
    "actionsImport": "Import dari fail",
    "actionsSample": "Muat contoh",
    "actionsDownload": "Muat turun .d.ts",
    "inputTitle": "Dokumen OpenAPI",
    "inputLabel": "OpenAPI (JSON atau YAML)",
    "inputPlaceholder": "Tampal OpenAPI 3.0/3.1 JSON atau YAML di sini...",
    "outputLabel": "Output TypeScript",
    "outputEmpty": "Sediakan dokumen OpenAPI yang sah untuk menjana jenis.",
    "optionsTitle": "Pilihan penjanaan",
    "optionAdditionalProperties": "Benarkan sifat tambahan",
    "optionDefaultNonNullable": "Non-null secara lalai",
    "optionPropertiesRequiredByDefault": "Sifat diperlukan secara lalai",
    "optionExportType": "Guna alias type untuk jenis root",
    "optionEnum": "Jana enum",
    "optionPathParamsAsTypes": "Parameter laluan sebagai jenis",
    "optionRootTypes": "Jana jenis root",
    "optionMakePathsEnum": "Cipta enum laluan",
    "optionGeneratePathParams": "Jana pembantu parameter laluan",
    "optionImmutable": "Output baca sahaja",
    "optionExcludeDeprecated": "Kecualikan medan usang",
    "optionIncludeHeader": "Sertakan komen pengepala",
    "invalidDocument": "Dokumen OpenAPI tidak sah",
    "invalidDocumentWithMessage": "Dokumen OpenAPI tidak sah: {message}",
    "invalidRoot": "Dokumen OpenAPI mestilah objek",
    "unsupportedVersion": "Hanya OpenAPI 3.0/3.1 disokong",
    "externalRefError": "$ref luaran tidak disokong ({count}). Sila inline atau bundle skema.",
    "actionsImportUrl": "Import dari URL",
    "importUrlTitle": "Import dari URL",
    "importUrlWarning": "Berjalan dalam pelayar. URL mesti membenarkan CORS, jika tidak permintaan akan gagal.",
    "importUrlLabel": "URL OpenAPI",
    "importUrlPlaceholder": "https://example.com/openapi.yaml",
    "importUrlCancel": "Batal",
    "importUrlConfirm": "Import",
    "importUrlEmptyError": "Masukkan URL untuk diimport.",
    "importUrlInvalidError": "URL mesti bermula dengan http:// atau https://.",
    "importUrlFetchError": "Gagal mendapatkan URL: {message}"
  },
  "no": {
    "actionsImport": "Importer fra fil",
    "actionsSample": "Last inn eksempel",
    "actionsDownload": "Last ned .d.ts",
    "inputTitle": "OpenAPI-dokument",
    "inputLabel": "OpenAPI (JSON eller YAML)",
    "inputPlaceholder": "Lim inn OpenAPI 3.0/3.1 i JSON eller YAML her...",
    "outputLabel": "TypeScript-utdata",
    "outputEmpty": "Oppgi et gyldig OpenAPI-dokument for å generere typer.",
    "optionsTitle": "Genereringsvalg",
    "optionAdditionalProperties": "Tillat ekstra egenskaper",
    "optionDefaultNonNullable": "Standard non-null",
    "optionPropertiesRequiredByDefault": "Egenskaper kreves som standard",
    "optionExportType": "Bruk type-alias for rot-typer",
    "optionEnum": "Generer enums",
    "optionPathParamsAsTypes": "Sti-parametere som typer",
    "optionRootTypes": "Generer rot-typer",
    "optionMakePathsEnum": "Lag sti-enum",
    "optionGeneratePathParams": "Generer hjelpe-typer for sti-parametere",
    "optionImmutable": "Skrivebeskyttet utdata",
    "optionExcludeDeprecated": "Ekskluder utdaterte felt",
    "optionIncludeHeader": "Inkluder toppkommentar",
    "invalidDocument": "Ugyldig OpenAPI-dokument",
    "invalidDocumentWithMessage": "Ugyldig OpenAPI-dokument: {message}",
    "invalidRoot": "OpenAPI-dokumentet må være et objekt",
    "unsupportedVersion": "Kun OpenAPI 3.0/3.1 støttes",
    "externalRefError": "Ekstern $ref støttes ikke ({count}). Inline eller bunt schemaet.",
    "actionsImportUrl": "Importer fra URL",
    "importUrlTitle": "Importer fra URL",
    "importUrlWarning": "Dette kjører i nettleseren. URL-en må tillate CORS, ellers vil forespørselen mislykkes.",
    "importUrlLabel": "OpenAPI-URL",
    "importUrlPlaceholder": "https://example.com/openapi.yaml",
    "importUrlCancel": "Avbryt",
    "importUrlConfirm": "Importer",
    "importUrlEmptyError": "Skriv inn en URL å importere.",
    "importUrlInvalidError": "URL-en må starte med http:// eller https://.",
    "importUrlFetchError": "Kunne ikke hente URL-en: {message}"
  }
}
</i18n>
