<template>
  <ToolSection>
    <SqlToolbar
      :formatted-sql="formattedSql"
      :download-url="resolvedDownloadUrl"
      :download-filename="downloadFilename"
      @import="importFromFile"
      @sample="applySample"
      @clear="clearInput"
    />
  </ToolSection>

  <ToolSection>
    <ToolSectionHeader>{{ t('input-output') }}</ToolSectionHeader>
    <SqlInputOutput
      v-model:source-sql="sourceSql"
      :formatted-sql="formattedSql"
      :format-error="formatError"
    />
  </ToolSection>

  <ToolSection>
    <ToolSectionHeader>{{ t('format-options') }}</ToolSectionHeader>
    <SqlFormatOptions
      v-model:dialect="dialect"
      v-model:tab-width="tabWidth"
      v-model:use-tabs="useTabs"
      v-model:lines-between-queries="linesBetweenQueries"
      v-model:expression-width="expressionWidth"
      v-model:keyword-case="keywordCase"
      v-model:data-type-case="dataTypeCase"
      v-model:function-case="functionCase"
    />
  </ToolSection>

  <ToolSection>
    <ToolSectionHeader>{{ t('lint-options') }}</ToolSectionHeader>
    <SqlLintOptions
      v-model:check-select-star="checkSelectStar"
      v-model:check-unsafe-mutation="checkUnsafeMutation"
      v-model:require-semicolon="requireSemicolon"
      v-model:max-line-length="maxLineLength"
    />
  </ToolSection>

  <ToolSection>
    <ToolSectionHeader>{{ t('lint-results') }}</ToolSectionHeader>
    <SqlLintResult :issues="lintIssues" />
  </ToolSection>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useDebounce, useObjectUrl, useStorage } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import { fileOpen } from 'browser-fs-access'
import { format } from 'sql-formatter'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import { extensionToDialect, fileExtensions, sqlDialects } from '../sqlDialects'
import type { SqlDialect } from '../sqlDialects'
import { lintSql, type SqlCaseStyle } from '../sqlLint'
import SqlFormatOptions from './SqlFormatOptions.vue'
import SqlInputOutput from './SqlInputOutput.vue'
import SqlLintOptions from './SqlLintOptions.vue'
import SqlLintResult from './SqlLintResult.vue'
import SqlToolbar from './SqlToolbar.vue'

const { t } = useI18n({ useScope: 'local' })

const sampleSql = `SELECT id, email, created_at
FROM users
WHERE status = 'active'
ORDER BY created_at DESC`

const sourceSql = useStorage<string>('tools:sql-formatter-and-linter:source-sql', sampleSql)
const dialect = useStorage<SqlDialect>('tools:sql-formatter-and-linter:dialect', 'sql')
const tabWidth = useStorage<number>('tools:sql-formatter-and-linter:tab-width', 2)
const useTabs = useStorage<boolean>('tools:sql-formatter-and-linter:use-tabs', false)
const linesBetweenQueries = useStorage<number>(
  'tools:sql-formatter-and-linter:lines-between-queries',
  1,
)
const expressionWidth = useStorage<number>('tools:sql-formatter-and-linter:expression-width', 50)
const keywordCase = useStorage<SqlCaseStyle>(
  'tools:sql-formatter-and-linter:keyword-case',
  'preserve',
)
const dataTypeCase = useStorage<SqlCaseStyle>(
  'tools:sql-formatter-and-linter:data-type-case',
  'preserve',
)
const functionCase = useStorage<SqlCaseStyle>(
  'tools:sql-formatter-and-linter:function-case',
  'preserve',
)

const checkSelectStar = useStorage<boolean>(
  'tools:sql-formatter-and-linter:check-select-star',
  true,
)
const checkUnsafeMutation = useStorage<boolean>(
  'tools:sql-formatter-and-linter:check-unsafe-mutation',
  true,
)
const requireSemicolon = useStorage<boolean>(
  'tools:sql-formatter-and-linter:require-semicolon',
  true,
)
const maxLineLength = useStorage<number>('tools:sql-formatter-and-linter:max-line-length', 100)

if (!sqlDialects.includes(dialect.value)) {
  dialect.value = 'sql'
}

const sourceSqlText = computed(() => sourceSql.value as string)
const debouncedSourceSql = useDebounce(sourceSqlText, 250)
const formattedSql = ref<string>('')
const formatError = ref<string>('')

const lintIssues = computed(() =>
  lintSql(
    debouncedSourceSql.value,
    {
      checkSelectStar: checkSelectStar.value,
      checkUnsafeMutation: checkUnsafeMutation.value,
      requireSemicolon: requireSemicolon.value,
      maxLineLength: maxLineLength.value,
      keywordCase: keywordCase.value,
    },
    formatError.value,
  ),
)

const downloadFilename = computed(() => `formatted-${dialect.value}.sql`)
const downloadBlob = computed(() => {
  if (!formattedSql.value.trim()) return null
  return new Blob([formattedSql.value], { type: 'application/sql;charset=utf-8' })
})
const rawDownloadUrl = useObjectUrl(downloadBlob)
const resolvedDownloadUrl = computed<string | null>(() => rawDownloadUrl.value ?? null)

watch(
  () => [
    debouncedSourceSql.value,
    dialect.value,
    tabWidth.value,
    useTabs.value,
    linesBetweenQueries.value,
    expressionWidth.value,
    keywordCase.value,
    dataTypeCase.value,
    functionCase.value,
  ],
  () => {
    formatSourceSql(debouncedSourceSql.value)
  },
  { immediate: true },
)

function formatSourceSql(value: string): void {
  if (!value.trim()) {
    formattedSql.value = ''
    formatError.value = ''
    return
  }

  try {
    const output = format(value, {
      language: dialect.value,
      tabWidth: tabWidth.value,
      useTabs: useTabs.value,
      linesBetweenQueries: linesBetweenQueries.value,
      expressionWidth: expressionWidth.value,
      keywordCase: keywordCase.value,
      dataTypeCase: dataTypeCase.value,
      functionCase: functionCase.value,
    })

    formattedSql.value = output
    formatError.value = ''
  } catch (error) {
    const message = error instanceof Error ? error.message : t('format-error')
    formattedSql.value = ''
    formatError.value = message
  }
}

function applySample(): void {
  sourceSql.value = sampleSql
}

function clearInput(): void {
  sourceSql.value = ''
}

function detectDialect(filename: string): SqlDialect | null {
  const match = filename.toLowerCase().match(/\.([a-z0-9]+)$/)
  const extension = match?.[1]
  if (!extension) {
    return null
  }
  return extensionToDialect[extension] ?? null
}

async function importFromFile(): Promise<void> {
  try {
    const file = await fileOpen({ extensions: fileExtensions })
    sourceSql.value = await file.text()

    const detected = detectDialect(file.name)
    if (detected) {
      dialect.value = detected
    }
  } catch {
    // User cancelled file selection.
  }
}
</script>

<i18n lang="json">
{
  "en": {
    "format-options": "Format Options",
    "lint-options": "Lint Options",
    "input-output": "SQL Input & Output",
    "lint-results": "Lint Results",
    "format-error": "Formatting failed"
  },
  "zh": {
    "format-options": "格式化选项",
    "lint-options": "Lint 选项",
    "input-output": "SQL 输入与输出",
    "lint-results": "Lint 结果",
    "format-error": "格式化失败"
  },
  "zh-CN": {
    "format-options": "格式化选项",
    "lint-options": "Lint 选项",
    "input-output": "SQL 输入与输出",
    "lint-results": "Lint 结果",
    "format-error": "格式化失败"
  },
  "zh-TW": {
    "format-options": "格式化選項",
    "lint-options": "Lint 選項",
    "input-output": "SQL 輸入與輸出",
    "lint-results": "Lint 結果",
    "format-error": "格式化失敗"
  },
  "zh-HK": {
    "format-options": "格式化選項",
    "lint-options": "Lint 選項",
    "input-output": "SQL 輸入與輸出",
    "lint-results": "Lint 結果",
    "format-error": "格式化失敗"
  },
  "es": {
    "format-options": "Format Options",
    "lint-options": "Lint Options",
    "input-output": "SQL Input & Output",
    "lint-results": "Lint Results",
    "format-error": "Formatting failed"
  },
  "fr": {
    "format-options": "Format Options",
    "lint-options": "Lint Options",
    "input-output": "SQL Input & Output",
    "lint-results": "Lint Results",
    "format-error": "Formatting failed"
  },
  "de": {
    "format-options": "Format Options",
    "lint-options": "Lint Options",
    "input-output": "SQL Input & Output",
    "lint-results": "Lint Results",
    "format-error": "Formatting failed"
  },
  "it": {
    "format-options": "Format Options",
    "lint-options": "Lint Options",
    "input-output": "SQL Input & Output",
    "lint-results": "Lint Results",
    "format-error": "Formatting failed"
  },
  "ja": {
    "format-options": "Format Options",
    "lint-options": "Lint Options",
    "input-output": "SQL Input & Output",
    "lint-results": "Lint Results",
    "format-error": "Formatting failed"
  },
  "ko": {
    "format-options": "Format Options",
    "lint-options": "Lint Options",
    "input-output": "SQL Input & Output",
    "lint-results": "Lint Results",
    "format-error": "Formatting failed"
  },
  "ru": {
    "format-options": "Format Options",
    "lint-options": "Lint Options",
    "input-output": "SQL Input & Output",
    "lint-results": "Lint Results",
    "format-error": "Formatting failed"
  },
  "pt": {
    "format-options": "Format Options",
    "lint-options": "Lint Options",
    "input-output": "SQL Input & Output",
    "lint-results": "Lint Results",
    "format-error": "Formatting failed"
  },
  "ar": {
    "format-options": "Format Options",
    "lint-options": "Lint Options",
    "input-output": "SQL Input & Output",
    "lint-results": "Lint Results",
    "format-error": "Formatting failed"
  },
  "hi": {
    "format-options": "Format Options",
    "lint-options": "Lint Options",
    "input-output": "SQL Input & Output",
    "lint-results": "Lint Results",
    "format-error": "Formatting failed"
  },
  "tr": {
    "format-options": "Format Options",
    "lint-options": "Lint Options",
    "input-output": "SQL Input & Output",
    "lint-results": "Lint Results",
    "format-error": "Formatting failed"
  },
  "nl": {
    "format-options": "Format Options",
    "lint-options": "Lint Options",
    "input-output": "SQL Input & Output",
    "lint-results": "Lint Results",
    "format-error": "Formatting failed"
  },
  "sv": {
    "format-options": "Format Options",
    "lint-options": "Lint Options",
    "input-output": "SQL Input & Output",
    "lint-results": "Lint Results",
    "format-error": "Formatting failed"
  },
  "pl": {
    "format-options": "Format Options",
    "lint-options": "Lint Options",
    "input-output": "SQL Input & Output",
    "lint-results": "Lint Results",
    "format-error": "Formatting failed"
  },
  "vi": {
    "format-options": "Format Options",
    "lint-options": "Lint Options",
    "input-output": "SQL Input & Output",
    "lint-results": "Lint Results",
    "format-error": "Formatting failed"
  },
  "th": {
    "format-options": "Format Options",
    "lint-options": "Lint Options",
    "input-output": "SQL Input & Output",
    "lint-results": "Lint Results",
    "format-error": "Formatting failed"
  },
  "id": {
    "format-options": "Format Options",
    "lint-options": "Lint Options",
    "input-output": "SQL Input & Output",
    "lint-results": "Lint Results",
    "format-error": "Formatting failed"
  },
  "he": {
    "format-options": "Format Options",
    "lint-options": "Lint Options",
    "input-output": "SQL Input & Output",
    "lint-results": "Lint Results",
    "format-error": "Formatting failed"
  },
  "ms": {
    "format-options": "Format Options",
    "lint-options": "Lint Options",
    "input-output": "SQL Input & Output",
    "lint-results": "Lint Results",
    "format-error": "Formatting failed"
  },
  "no": {
    "format-options": "Format Options",
    "lint-options": "Lint Options",
    "input-output": "SQL Input & Output",
    "lint-results": "Lint Results",
    "format-error": "Formatting failed"
  }
}
</i18n>
